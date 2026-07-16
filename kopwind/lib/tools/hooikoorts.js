/**
 * lib/tools/hooikoorts.js
 *
 * De hooikoortscheck (v3.4.0 "Ponente"): heb ik vandaag last, en wat is
 * het rustigste blok? Eerste tool op een eigen databron: de Open-Meteo
 * Air Quality API (CAMS Europa, 11 km) met gras-, berk- en elspollen.
 *
 * Ontwerpkeuzes:
 * - Klassegrenzen zijn vuistregels per soort (korrels per m3), geen
 *   medische standaard; de uitleg zegt dat eerlijk. Gevoeligheid is
 *   instelbaar als factor op die grenzen.
 * - Het venster is omgekeerd aan de andere tools: niet het beste
 *   pollenmoment maar het RUSTIGSTE blok, want dat is wanneer je wilt
 *   luchten, sporten of de was ophangt.
 * - Buiten het seizoen (alles nul) zegt de check gewoon dat er niets in
 *   de lucht zit, in plaats van een leeg antwoord.
 * - CAMS is een model op 11 km: goed voor het dagbeeld, niet voor de
 *   straat. Ook dat staat in de uitleg.
 */

import { clamp, lerp, maakScore, adviesVoorScore } from "../engine/score.js";
import { kies } from "../i18n/locale.js";

/** Alle teksten van de hooikoortscheck, per taal. */
const T = kies({
  nl: {
    slug: "hooikoorts",
    naam: "Heb ik vandaag last van hooikoorts?",
    korteVraag: "Heb ik vandaag last van hooikoorts?",
    meldingKort: "Pollencheck",
    cta: "Check de pollen",
    navLabel: "Hooikoorts",
    diepte: "Gras, berk en els per uur, met het rustigste blok van de dag.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Vrijwel pollenvrij", goed: "Weinig in de lucht", twijfelachtig: "Merkbaar voor gevoeligen", matig: "Flink wat pollen", "zeer-slecht": "Pollenpiek" },
    adviesLabels: { goed: "rustige pollenlucht", matig: "merkbare pollen", slecht: "veel pollen" },
    legenda: { links: "veel pollen", rechts: "rustig" },
    vensterLabel: "rustigste blok",
    soorten: { gras: "gras", berk: "berk", els: "els" },
    klassen: ["laag", "matig", "hoog", "zeer hoog"],
    jaZin: (soort, klasse, blok) =>
      `Kans op klachten: ${soort}pollen zitten op ${klasse}.` + (blok ? ` Rustigste blok: ${blok}.` : ""),
    neeZin: "Nauwelijks pollen in de lucht vandaag. Ramen open kan.",
    seizoenUit: "Geen pollen in de lucht: het seizoen is voorbij of nog niet begonnen.",
    toekomstJa: (soort, klasse) => `${kapitaal(soort)}pollen op ${klasse}.`,
    toekomstNee: "Weinig pollen.",
    metric: (delen) => delen.join(" \u00b7 "),
    metricDeel: (soort, klasse, piek) => `${kapitaal(soort)}: ${klasse}${piek ? ` (${piek}/m\u00b3)` : ""}`,
    redenPiek: (soort, piek, klasse) => `${soort}pollen pieken op ${piek} korrels/m\u00b3 (${klasse})`,
    redenTweede: (soort, klasse) => `ook ${soort}pollen op ${klasse}`,
    instGevoelVraag: "Hoe gevoelig ben je?",
    instGevoelKeuzes: ["Merk het pas bij veel pollen", "Gemiddeld", "Merk het al snel"],
    instFocusVraag: "Waar reageer je op?",
    instFocusKeuzes: ["Alles", "Vooral gras", "Vooral bomen (berk en els)"],
    instFactor: "Gevoeligheidsfactor",
    instUitleg:
      "De klassegrenzen per soort zijn vuistregels in korrels per kubieke meter, geen medische standaard. Je gevoeligheid schuift die grenzen op. De data komt uit het Europese CAMS-model op 11 kilometer: goed voor het dagbeeld, niet voor jouw straat.",
  },
  en: {
    slug: "hay-fever",
    naam: "Will hay fever bother me today?",
    korteVraag: "Will I get hay fever today?",
    meldingKort: "Pollen check",
    cta: "Check the pollen",
    navLabel: "Hay fever",
    diepte: "Grass, birch and alder per hour, with the calmest window of the day.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Practically pollen-free", goed: "Little in the air", twijfelachtig: "Noticeable if sensitive", matig: "Plenty of pollen", "zeer-slecht": "Pollen peak" },
    adviesLabels: { goed: "calm pollen air", matig: "noticeable pollen", slecht: "lots of pollen" },
    legenda: { links: "lots of pollen", rechts: "calm" },
    vensterLabel: "calmest window",
    soorten: { gras: "grass", berk: "birch", els: "alder" },
    klassen: ["low", "moderate", "high", "very high"],
    jaZin: (soort, klasse, blok) =>
      `Symptoms likely: ${soort} pollen is at ${klasse}.` + (blok ? ` Calmest window: ${blok}.` : ""),
    neeZin: "Barely any pollen in the air today. Windows open is fine.",
    seizoenUit: "No pollen in the air: the season is over or hasn't started yet.",
    toekomstJa: (soort, klasse) => `${kapitaal(soort)} pollen at ${klasse}.`,
    toekomstNee: "Little pollen.",
    metric: (delen) => delen.join(" \u00b7 "),
    metricDeel: (soort, klasse, piek) => `${kapitaal(soort)}: ${klasse}${piek ? ` (${piek}/m\u00b3)` : ""}`,
    redenPiek: (soort, piek, klasse) => `${soort} pollen peaks at ${piek} grains/m\u00b3 (${klasse})`,
    redenTweede: (soort, klasse) => `${soort} pollen at ${klasse} as well`,
    instGevoelVraag: "How sensitive are you?",
    instGevoelKeuzes: ["Only notice heavy pollen", "Average", "Notice it quickly"],
    instFocusVraag: "What do you react to?",
    instFocusKeuzes: ["Everything", "Mostly grass", "Mostly trees (birch and alder)"],
    instFactor: "Sensitivity factor",
    instUitleg:
      "The class limits per species are rules of thumb in grains per cubic metre, not a medical standard. Your sensitivity shifts those limits. Data comes from the European CAMS model at 11 kilometres: good for the day's picture, not for your street.",
  },
});

function kapitaal(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

export const POLLEN_DEFAULTS = {
  factor: 1, // gevoeligheid: lager = eerder last
  focus: "alles", // alles | gras | bomen
};

/** Klassegrenzen per soort in korrels/m3: [matig vanaf, hoog vanaf, zeer hoog vanaf]. */
export const KLASSEN = {
  gras: [30, 95, 200],
  berk: [100, 400, 900],
  els: [50, 200, 450],
};

/** 0 = laag, 1 = matig, 2 = hoog, 3 = zeer hoog. */
export function klasseVoor(soort, waarde, factor = 1) {
  if (waarde == null || waarde <= 0) return 0;
  const [m, h, z] = KLASSEN[soort].map((g) => g * factor);
  if (waarde >= z) return 3;
  if (waarde >= h) return 2;
  if (waarde >= m) return 1;
  return 0;
}

function weging(focus) {
  if (focus === "gras") return { gras: 1, berk: 0.4, els: 0.4 };
  if (focus === "bomen") return { gras: 0.4, berk: 1, els: 1 };
  return { gras: 1, berk: 1, els: 1 };
}

/** Pollen-uurreeksen naar dag-emmers, in de vorm van de weerbasis. */
function bouwPollenBasis(hourly) {
  const uit = [];
  const n = hourly?.time?.length ?? 0;
  for (let i = 0; i < n; i++) {
    const tijd = hourly.time[i];
    uit.push({
      tijd,
      datum: tijd.slice(0, 10),
      uur: Number(tijd.slice(11, 13)),
      gras: hourly.grass_pollen?.[i] ?? null,
      berk: hourly.birch_pollen?.[i] ?? null,
      els: hourly.alder_pollen?.[i] ?? null,
    });
  }
  return uit;
}

const RUSTIG_MIN_UREN = 2;

function rustigsteBlok(uren) {
  const blokken = [];
  let blok = [];
  for (const u of uren) {
    if (u.klasse === 0) {
      blok.push(u);
    } else if (blok.length) {
      blokken.push(blok);
      blok = [];
    }
  }
  if (blok.length) blokken.push(blok);
  let beste = null;
  for (const b of blokken) {
    if (b.length < RUSTIG_MIN_UREN) continue;
    if (!beste || b.length > beste.uren) {
      beste = { van: b[0].uur, tot: b[b.length - 1].uur + 1, uren: b.length };
    }
  }
  return beste;
}

const KLASSE_PIJN = [4, 34, 55, 72];

export function overlay(hourly, nu = new Date(), instellingen = POLLEN_DEFAULTS) {
  const inst = { ...POLLEN_DEFAULTS, ...(instellingen ?? {}) };
  const w = weging(inst.focus);
  const basis = bouwPollenBasis(hourly);
  const vandaagKey = `${nu.getFullYear()}-${String(nu.getMonth() + 1).padStart(2, "0")}-${String(nu.getDate()).padStart(2, "0")}`;

  const perDag = new Map();
  for (const u of basis) {
    if (u.datum < vandaagKey) continue;
    if (!perDag.has(u.datum)) perDag.set(u.datum, []);
    perDag.get(u.datum).push(u);
  }
  const dagen = [...perDag.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).slice(0, 5);

  const dagenUit = dagen.map(([datum, dagUren]) => {
    const soorten = ["gras", "berk", "els"].map((soort) => {
      const piek = Math.round(Math.max(0, ...dagUren.map((u) => u[soort] ?? 0)));
      const klasse = klasseVoor(soort, piek * w[soort], inst.factor);
      return { soort, piek, klasse };
    });
    soorten.sort((a, b) => b.klasse - a.klasse || b.piek - a.piek);
    const top = soorten[0];
    const dagKlasse = top.klasse;
    const heeftData = dagUren.some((u) => u.gras != null || u.berk != null || u.els != null);
    const allesNul = soorten.every((s) => s.piek === 0);

    const uren = dagUren.map((u) => {
      const uurKlasse = Math.max(
        klasseVoor("gras", (u.gras ?? 0) * w.gras, inst.factor),
        klasseVoor("berk", (u.berk ?? 0) * w.berk, inst.factor),
        klasseVoor("els", (u.els ?? 0) * w.els, inst.factor)
      );
      return { uur: u.uur, score: 100 - uurKlasse * 32, nat: false, klasse: uurKlasse };
    });
    const venster = dagKlasse >= 1 ? rustigsteBlok(uren) : null;

    const factoren = [
      {
        punten: KLASSE_PIJN[dagKlasse],
        reden: dagKlasse >= 1 ? T.redenPiek(T.soorten[top.soort], top.piek, T.klassen[top.klasse]) : null,
      },
    ];
    const tweede = soorten[1];
    if (tweede && tweede.klasse >= 1) {
      factoren.push({ punten: 8, reden: T.redenTweede(T.soorten[tweede.soort], T.klassen[tweede.klasse]) });
    }
    const { score, redenen } = maakScore(factoren);
    const conditie = { score, redenen, advies: adviesVoorScore(score, hooikoorts.adviesLabels) };

    const isVandaag = datum === vandaagKey;
    const last = dagKlasse >= 1;
    let zin;
    if (!heeftData || allesNul) {
      zin = T.seizoenUit;
    } else if (isVandaag) {
      zin = last
        ? T.jaZin(
            T.soorten[top.soort],
            T.klassen[top.klasse],
            venster ? `${String(venster.van).padStart(2, "0")}:00-${String(venster.tot).padStart(2, "0")}:00` : null
          )
        : T.neeZin;
    } else {
      zin = last ? T.toekomstJa(T.soorten[top.soort], T.klassen[top.klasse]) : T.toekomstNee;
    }

    const metricDelen = soorten
      .filter((s) => s.klasse >= 1 || s.piek > 0)
      .map((s) => T.metricDeel(T.soorten[s.soort], T.klassen[s.klasse], s.klasse >= 1 ? s.piek : null));

    return {
      datum,
      antwoord: { ja: last, zin },
      uren: uren.map(({ uur, score, nat }) => ({ uur, score, nat })),
      venster,
      metric: metricDelen.length ? { zin: T.metric(metricDelen) } : null,
      conditie,
      status: { soort: last ? "info" : "nee", zin },
    };
  });

  return {
    legenda: T.legenda,
    vensterLabel: T.vensterLabel,
    dagen: dagenUit,
  };
}

export const hooikoorts = {
  id: "hooikoorts",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#D97C1B",
  locatieHint: T.locatieHint,
  icoon: "bloem",
  categorieId: "gezondheid",
  soort: "advies",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  databron: "lucht",
  luchtVelden: ["grass_pollen", "birch_pollen", "alder_pollen"],
  weerVelden: [],
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: POLLEN_DEFAULTS },
  instellingen: {
    defaults: POLLEN_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "gevoel",
        vraag: T.instGevoelVraag,
        keuzes: [
          { label: T.instGevoelKeuzes[0], zet: { factor: 1.4 } },
          { label: T.instGevoelKeuzes[1], zet: { factor: 1 } },
          { label: T.instGevoelKeuzes[2], zet: { factor: 0.7 } },
        ],
      },
      {
        type: "keuze",
        id: "focus",
        vraag: T.instFocusVraag,
        keuzes: [
          { label: T.instFocusKeuzes[0], zet: { focus: "alles" } },
          { label: T.instFocusKeuzes[1], zet: { focus: "gras" } },
          { label: T.instFocusKeuzes[2], zet: { focus: "bomen" } },
        ],
      },
      { key: "factor", label: T.instFactor, eenheid: "", step: 0.1, min: 0.5, max: 1.6, geavanceerd: true },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-14",
  affiliate: null,
};
