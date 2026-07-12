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
 *   temperatuur (traag onder de 5 graden) en wind (bonus). Uren met
 *   neerslag of een hoge buienkans zijn ongeschikt.
 * - Het droogvenster is het beste aaneengesloten blok regenvrije uren
 *   binnen het ophangvenster (standaard 08:00 tot 20:00, instelbaar).
 *
 * Cijfer-ankers (v2.1.0 "Mistral", tegen score-inflatie):
 *   10  hele dag droog, lage luchtvochtigheid, een briesje
 *    7  degelijk venster van 6 tot 8 uur
 *    5  marginaal venster van 3 tot 4 uur
 *    3  minder dan 2 bruikbare uren of onderbroken door regen
 *  0-2  het grootste deel van de dag nat
 * De vensterduur is daarom de primaire, vrijwel lineaire driver van het
 * dagcijfer; droogkracht en buien rond het venster stapelen erbovenop.
 * Consistentieregel: zolang de samenvatting zegt dat je de was buiten kunt
 * hangen (droogtijd past in het venster), zakt het advies nooit naar
 * "binnen drogen vandaag".
 */

import { clamp, lerp, maakScore, adviesVoorScore } from "../engine/score.js";

export const WAS_VELDEN = [
  "temperature_2m",
  "precipitation",
  "precipitation_probability",
  "wind_speed_10m",
  "relative_humidity_2m",
];

export const WAS_DEFAULTS = {
  dagStart: 8, // ophangen kan vanaf dit uur
  dagEind: 20, // en tot dit uur
  buiKans: 55, // % buienkans waarboven een uur niet meetelt
};

const DROOG_BUDGET = 260; // som van droogkracht die een gemiddelde was nodig heeft
const MIN_VENSTER_UREN = 3;
const MAX_PIJN_MET_VENSTER = 58; // consistentie: buiten hangen kan => nooit "binnen drogen"
const MAX_PIJN_VENSTER_TE_KORT = 70; // anker 3: er is een venster, maar te kort

/** Droogkracht van een enkel uur, 0..100. */
export function uurDroogkracht({ rh, temp, wind, neerslag, neerslagKans }, buiKans = WAS_DEFAULTS.buiKans) {
  if ((neerslag ?? 0) > 0.1 || (neerslagKans ?? 0) >= buiKans) return 0;
  const vocht = clamp((92 - (rh ?? 85)) / (92 - 45), 0, 1);
  const tempF = clamp(((temp ?? 10) + 2) / 20, 0.25, 1.2);
  const windF = 0.7 + clamp((wind ?? 0) / 25, 0, 1) * 0.6;
  return clamp(Math.round(100 * vocht * tempF * windF), 0, 100);
}

/**
 * Vensterduur naar pijnpunten, op de ankers gefit: 12u+ perfect, 8u prima,
 * 6u degelijk (rond de 7), 4u en 3u marginaal (rond de 5), korter dan
 * MIN_VENSTER_UREN telt als geen venster.
 */
export function duurPijn(uren) {
  const ANKERS = [
    [12, 0],
    [10, 4],
    [8, 14],
    [6, 26],
    [4, 40],
    [3, 48],
  ];
  if (uren >= ANKERS[0][0]) return 0;
  for (let i = 0; i < ANKERS.length - 1; i++) {
    const [x1, y1] = ANKERS[i];
    const [x0, y0] = ANKERS[i + 1];
    if (uren >= x0) return Math.round(lerp(uren, x0, x1, y0, y1));
  }
  return 48;
}

/**
 * Analyseert het Open-Meteo hourly-blok tot dagen met venster en oordeel.
 * @returns {Array<{datum, uren, venster, droogUren, oordeel, samenvatting}>}
 */
export function berekenDroogdagen(hourly, nu = new Date(), instellingen = WAS_DEFAULTS) {
  if (!hourly?.time?.length) return [];
  const inst = { ...WAS_DEFAULTS, ...(instellingen ?? {}) };
  const perDag = new Map();
  for (let i = 0; i < hourly.time.length; i++) {
    const [datum, tijd] = hourly.time[i].split("T");
    const uur = Number(tijd.slice(0, 2));
    if (uur < inst.dagStart || uur >= inst.dagEind) continue;
    if (!perDag.has(datum)) perDag.set(datum, []);
    perDag.get(datum).push({
      uur,
      kracht: uurDroogkracht(
        {
          rh: hourly.relative_humidity_2m?.[i],
          temp: hourly.temperature_2m?.[i],
          wind: hourly.wind_speed_10m?.[i],
          neerslag: hourly.precipitation?.[i],
          neerslagKans: hourly.precipitation_probability?.[i],
        },
        inst.buiKans
      ),
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

  // Beste aaneengesloten regenvrije venster: kwaliteit maal lengte wint.
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

  let beste = null;
  for (const b of blokken) {
    if (b.length < MIN_VENSTER_UREN) continue;
    const gemiddeld = b.reduce((a, u) => a + u.kracht, 0) / b.length;
    if (!beste || gemiddeld * b.length > beste.gemiddeld * beste.uren) {
      beste = {
        van: b[0].uur,
        tot: b[b.length - 1].uur + 1,
        uren: b.length,
        gemiddeld,
      };
    }
  }

  // Geschatte droogtijd binnen het venster.
  let droogUren = null;
  if (beste) {
    droogUren = clamp(DROOG_BUDGET / Math.max(beste.gemiddeld, 15), 2, 12);
    if (droogUren > beste.uren) droogUren = null; // venster te kort om droog te krijgen
  }

  // Pijnscore: vensterduur is de primaire driver, droogkracht en buien
  // rondom stapelen erbovenop. Alles gegradeerd, geen drempel-kliffen.
  const factoren = [];
  if (!beste) {
    const regen = bruikbaar.some((u) => u.neerslag);
    factoren.push({
      punten: 72,
      reden: regen
        ? "neerslag verpest elk droogvenster"
        : `geen aaneengesloten droog venster van ${MIN_VENSTER_UREN} uur of meer`,
    });
  } else {
    factoren.push({
      punten: duurPijn(beste.uren),
      reden: beste.uren <= 4 ? `krap venster van ${beste.uren} uur` : null,
    });
    factoren.push({
      punten: Math.round(clamp((78 - beste.gemiddeld) * 0.9, 0, 40)),
      reden:
        beste.gemiddeld < 50
          ? `vochtige lucht remt het drogen (gem. droogkracht ${Math.round(beste.gemiddeld)}/100)`
          : null,
    });
    const regenRondom = bruikbaar.some(
      (u) => u.neerslag && (u.uur < beste.van || u.uur >= beste.tot)
    );
    if (regenRondom) {
      factoren.push({ punten: 8, reden: "buien rond het venster" });
    }
    if (droogUren == null) {
      factoren.push({ punten: 20, reden: "het droge venster is te kort om alles droog te krijgen" });
    }
  }
  let { score, redenen } = maakScore(factoren);

  // Consistentieborg: past de droogtijd in het venster ("hang de was
  // buiten"), dan blijft het advies maximaal "kan, met geduld". Is er wel
  // een venster maar te kort, dan landt de dag rond anker 3, niet lager.
  if (beste && droogUren != null && score > MAX_PIJN_MET_VENSTER) {
    score = MAX_PIJN_MET_VENSTER;
  } else if (beste && droogUren == null && score > MAX_PIJN_VENSTER_TE_KORT) {
    score = MAX_PIJN_VENSTER_TE_KORT;
  }

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
    samenvatting: samenvatDag(beste, droogUren),
  };
}

function samenvatDag(venster, droogUren) {
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
  scoreConfig: { berekenDroogdagen, uurDroogkracht, defaults: WAS_DEFAULTS },
  instellingen: {
    defaults: WAS_DEFAULTS,
    velden: [
      { key: "dagStart", label: "Ophangen kan vanaf", eenheid: "uur", step: 1, min: 5, max: 12 },
      { key: "dagEind", label: "Ophangen kan tot", eenheid: "uur", step: 1, min: 14, max: 23 },
      { key: "buiKans", label: "Uur telt niet mee vanaf buienkans", eenheid: "%", step: 5, min: 20, max: 90 },
    ],
    uitleg:
      "Het cijfer volgt vooral de lengte van het droge venster: een hele droge dag is een 9 of 10, een venster van 6 tot 8 uur rond de 7, een krap venster van 3 tot 4 uur rond de 5. Luchtvochtigheid, kou en windstilte drukken het verder.",
  },
  adviesLabels: {
    goed: "drooghangdag",
    matig: "kan, met geduld",
    slecht: "binnen drogen vandaag",
  },
  affiliate: null,
};
