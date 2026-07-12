/**
 * lib/tools/was-buiten-drogen.js
 *
 * Tweede tool en het bewijs van het register: locatie-only (patroon A,
 * inputType locatie), volledig op de gedeelde engine. Geen kaal ja/nee maar
 * een droogvenster: welke uren vandaag en de komende dagen droogt de was
 * buiten goed, met een rapportcijfer per dag.
 *
 * Droogmodel (bewust simpel en uitlegbaar):
 * - Per uur een droogkracht 0..100 uit luchtvochtigheid (de motor),
 *   temperatuur (traag onder de 5 graden) en wind (bonus).
 * - Uren met neerslag (of hoge kans daarop) zijn ongeschikt: de was wordt
 *   natter in plaats van droger.
 * - Het droogvenster is het beste aaneengesloten blok regenvrije uren
 *   tussen 08:00 en 20:00; de geschatte droogtijd volgt uit een
 *   droogbudget (hoe sterker de droogkracht, hoe korter).
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";

export const WAS_VELDEN = [
  "temperature_2m",
  "precipitation",
  "precipitation_probability",
  "wind_speed_10m",
  "relative_humidity_2m",
];

const DAG_START = 8;
const DAG_EIND = 20;
const DROOG_BUDGET = 260; // som van droogkracht die een gemiddelde was nodig heeft
const MIN_VENSTER_UREN = 3;

/** Droogkracht van een enkel uur, 0..100. */
export function uurDroogkracht({ rh, temp, wind, neerslag, neerslagKans }) {
  if ((neerslag ?? 0) > 0.1 || (neerslagKans ?? 0) >= 55) return 0;
  const vocht = clamp((92 - (rh ?? 85)) / (92 - 45), 0, 1);
  const tempF = clamp(((temp ?? 10) + 2) / 20, 0.25, 1.2);
  const windF = 0.7 + clamp((wind ?? 0) / 25, 0, 1) * 0.6;
  return clamp(Math.round(100 * vocht * tempF * windF), 0, 100);
}

/**
 * Analyseert het Open-Meteo hourly-blok tot dagen met venster en oordeel.
 * @returns {Array<{datum, label, uren, venster, droogUren, oordeel}>}
 */
export function berekenDroogdagen(hourly, nu = new Date()) {
  if (!hourly?.time?.length) return [];
  const perDag = new Map();
  for (let i = 0; i < hourly.time.length; i++) {
    const [datum, tijd] = hourly.time[i].split("T");
    const uur = Number(tijd.slice(0, 2));
    if (uur < DAG_START || uur >= DAG_EIND) continue;
    if (!perDag.has(datum)) perDag.set(datum, []);
    perDag.get(datum).push({
      uur,
      kracht: uurDroogkracht({
        rh: hourly.relative_humidity_2m?.[i],
        temp: hourly.temperature_2m?.[i],
        wind: hourly.wind_speed_10m?.[i],
        neerslag: hourly.precipitation?.[i],
        neerslagKans: hourly.precipitation_probability?.[i],
      }),
      neerslag: (hourly.precipitation?.[i] ?? 0) > 0.1,
      rh: hourly.relative_humidity_2m?.[i] ?? null,
      wind: hourly.wind_speed_10m?.[i] ?? null,
    });
  }

  const vandaagKey = lokaleDagKey(nu);
  const dagen = [];
  for (const [datum, uren] of perDag) {
    if (datum < vandaagKey) continue;
    dagen.push(analyseerDag(datum, uren, datum === vandaagKey ? nu : null));
  }
  return dagen.sort((a, b) => (a.datum < b.datum ? -1 : 1)).slice(0, 5);
}

function lokaleDagKey(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function analyseerDag(datum, uren, nuOfNull) {
  // Voor vandaag tellen alleen de uren die nog komen (plus het lopende uur).
  const bruikbaar = nuOfNull ? uren.filter((u) => u.uur >= nuOfNull.getHours()) : uren;

  // Beste aaneengesloten regenvrije venster met voldoende droogkracht.
  let beste = null;
  let start = 0;
  const blokken = [];
  let blok = [];
  for (const u of bruikbaar) {
    if (u.kracht > 0) {
      blok.push(u);
    } else if (blok.length) {
      blokken.push(blok);
      blok = [];
    }
  }
  if (blok.length) blokken.push(blok);

  for (const b of blokken) {
    if (b.length < MIN_VENSTER_UREN) continue;
    const gemiddeld = b.reduce((a, u) => a + u.kracht, 0) / b.length;
    if (!beste || gemiddeld * b.length > beste.gemiddeld * beste.uren) {
      beste = {
        van: b[0].uur,
        tot: b[b.length - 1].uur + 1,
        uren: b.length,
        gemiddeld,
        som: b.reduce((a, u) => a + u.kracht, 0),
      };
    }
  }

  // Geschatte droogtijd binnen het venster.
  let droogUren = null;
  if (beste) {
    droogUren = clamp(DROOG_BUDGET / Math.max(beste.gemiddeld, 15), 2, 12);
    if (droogUren > beste.uren) droogUren = null; // venster te kort om droog te krijgen
  }

  // Pijnscore via de generieke engine: factoren die het cijfer drukken.
  const factoren = [];
  if (!beste) {
    const regen = bruikbaar.some((u) => u.neerslag);
    factoren.push({
      punten: 75,
      reden: regen
        ? "neerslag verpest elk droogvenster"
        : "geen aaneengesloten droog venster van 3 uur of meer",
    });
  } else {
    // Zwakke droogkracht drukt het cijfer continu.
    const kwaliteit = clamp((beste.gemiddeld - 20) / 55, 0, 1); // 20 slecht .. 75 top
    factoren.push({
      punten: Math.round((1 - kwaliteit) * 55),
      reden:
        beste.gemiddeld < 45
          ? `hoge luchtvochtigheid remt het drogen (gem. droogkracht ${Math.round(beste.gemiddeld)}/100)`
          : null,
    });
    if (droogUren == null) {
      factoren.push({ punten: 25, reden: "het droge venster is te kort om alles droog te krijgen" });
    } else if (beste.uren < 5) {
      factoren.push({ punten: 8, reden: `krap venster van ${beste.uren} uur` });
    }
  }
  const { score, redenen } = maakScore(factoren);

  return {
    datum,
    uren: bruikbaar,
    venster: beste,
    droogUren,
    oordeel: {
      score,
      redenen,
      advies: adviesVoorScore(score, wasBuitenDrogen.adviesLabels),
    },
    samenvatting: samenvatDag(beste, droogUren, redenen),
  };
}

function samenvatDag(venster, droogUren, redenen) {
  if (!venster) {
    return "Vandaag binnen drogen: er is geen bruikbaar droog venster.";
  }
  const tijd = `${String(venster.van).padStart(2, "0")}:00 en ${String(venster.tot).padStart(2, "0")}:00`;
  if (droogUren == null) {
    return `Er is een droog venster tussen ${tijd}, maar te kort om alles droog te krijgen.`;
  }
  const uren = droogUren.toFixed(1).replace(".", ",").replace(/,0$/, "");
  return `Hang de was buiten tussen ${tijd}: in ongeveer ${uren} uur droog.`;
}

export const wasBuitenDrogen = {
  id: "was-buiten-drogen",
  slug: "was-buiten-drogen",
  naam: "Vandaag de was buiten?",
  meldingKort: "Wascheck",
  korteVraag: "Kan de was vandaag buiten drogen?",
  patroon: "A",
  inputType: "locatie",
  weerVelden: WAS_VELDEN,
  weerDagen: 5,
  scoreConfig: { berekenDroogdagen, uurDroogkracht },
  adviesLabels: {
    goed: "drooghangdag",
    matig: "kan, met geduld",
    slecht: "binnen drogen vandaag",
  },
  affiliate: null,
};
