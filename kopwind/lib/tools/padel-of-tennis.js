/**
 * lib/tools/padel-of-tennis.js
 *
 * De baancheck op de gedeelde venstermotor (v3.17.0 "Passaat"). Padel
 * en tennis stellen een harde eis: een droge baan. Elk nat uur valt
 * af, en buien eerder op de dag laten de baan (zeker gravel) nog lang
 * nat na. Wind is de tweede spelbreker, want die grijpt in op elke
 * bal; een padelkooi is beschutter dan een open tennisbaan, en dat is
 * de belangrijkste instelling.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "padel-of-tennis",
    naam: "Kan ik vandaag padellen of tennissen?",
    korteVraag: "Kan ik vandaag padellen of tennissen?",
    meldingKort: "Baancheck",
    cta: "Check de baan",
    navLabel: "Padel en tennis",
    diepte: "Droge baan, speelbare wind en het beste blok.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect baanweer", goed: "Prima baanweer", twijfelachtig: "Kan, wind stoort de bal", matig: "Lastig baanweer", "zeer-slecht": "Baan overslaan" },
    adviesLabels: { goed: "baanweer", matig: "kan, met windvatbaarheid", slecht: "geen baanweer" },
    legenda: { links: "baan overslaan", rechts: "baanweer" },
    redenNat: "te nat: de baan is onbespeelbaar",
    redenGeenBlok: "geen droog en speelbaar blok",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenWind: (w) => `wind van ${w} km/u grijpt in op elke bal`,
    redenNatteBaan: "de baan kan nog nat zijn van eerdere buien",
    metric: (uur, g) => `Beste speeluur rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima baanweer: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste speeluren: ${tijd}.`,
    statusGeweest: "Het beste baanweer is voor vandaag geweest.",
    statusNiks: "Vandaag wordt het niks op de baan.",
    toekomstBeste: (tijd) => `Beste speelblok: ${tijd}.`,
    toekomstGeen: "Geen baanweer.",
    instBaanVraag: "Waar speel je meestal?",
    instBaanKeuzes: ["Padelkooi (beschut)", "Gemengd", "Open tennisbaan"],
    instWarmVraag: "Wanneer is het jou te koud?",
    instWarmKeuzes: ["Ik speel ook fris door", "Gemiddeld", "Alleen bij zacht weer"],
    instDagStart: "Vroegste speeltijd",
    instDagEind: "Laatste speeltijd",
    instUur: "uur",
    instUitleg:
      "De baan moet droog: elk nat uur valt af en buien eerder op de dag laten gravel lang nat na. Wind is spelbreker twee; een padelkooi vangt veel op, een open tennisbaan niets. Ideaal is 12 tot 24 graden met weinig wind.",
  },
  en: {
    slug: "padel-or-tennis",
    naam: "Padel or tennis today?",
    korteVraag: "Padel or tennis today?",
    meldingKort: "Court check",
    cta: "Check the court",
    navLabel: "Padel and tennis",
    diepte: "A dry court, playable wind and the best window.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect court weather", goed: "Good court weather", twijfelachtig: "Doable, wind moves the ball", matig: "Tricky court weather", "zeer-slecht": "Skip the court" },
    adviesLabels: { goed: "court weather", matig: "doable, mind the wind", slecht: "no court weather" },
    legenda: { links: "skip the court", rechts: "court weather" },
    redenNat: "too wet: the court is unplayable",
    redenGeenBlok: "no dry and playable window",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenWind: (w) => `wind of ${w} km/h grabs every ball`,
    redenNatteBaan: "the court may still be wet from earlier showers",
    metric: (uur, g) => `Best playing hour around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good court weather right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best playing hours: ${tijd}.`,
    statusGeweest: "The best court weather has been and gone today.",
    statusNiks: "The court isn't happening today.",
    toekomstBeste: (tijd) => `Best playing window: ${tijd}.`,
    toekomstGeen: "No court weather.",
    instBaanVraag: "Where do you usually play?",
    instBaanKeuzes: ["Padel cage (sheltered)", "Mixed", "Open tennis court"],
    instWarmVraag: "When is it too cold for you?",
    instWarmKeuzes: ["I play on in the cold", "Average", "Only in mild weather"],
    instDagStart: "Earliest playing time",
    instDagEind: "Latest playing time",
    instUur: "h",
    instUitleg:
      "The court must be dry: every wet hour is out, and earlier showers keep clay wet for a long time. Wind is spoiler number two; a padel cage catches a lot, an open tennis court nothing. Ideal is 12 to 24 degrees with little wind.",
  },
});

export const BAAN_DEFAULTS = {
  minGevoel: 6,
  maxWind: 22,
  dagStart: 8,
  dagEind: 22,
};

export function uurBaanScore(u, inst = BAAN_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0 || (u.kans ?? 0) >= 50) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 10;
  let tempF;
  if (gevoel <= 24) {
    tempF = clamp(lerp(gevoel, inst.minGevoel - 5, 15, 0.15, 1), 0.15, 1);
  } else {
    tempF = clamp(lerp(gevoel, 24, 33, 1, 0.45), 0.45, 1);
  }
  const wind = u.wind ?? 0;
  const windF = clamp(1 - Math.max(0, wind - inst.maxWind * 0.35) / (inst.maxWind * 1.1), 0.2, 1);
  return clamp(Math.round(94 * tempF * windF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: BAAN_DEFAULTS,
  uurScore: uurBaanScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 1,
  extraFactoren: ({ uren, venster }) => {
    if (!venster) return [];
    const eerderNat = uren
      .filter((u) => u.uur < venster.van)
      .reduce((a, u) => a + (u.neerslag ?? 0), 0);
    if (eerderNat > 0.5) {
      return [{ punten: 8, reden: T.redenNatteBaan }];
    }
    return [];
  },
});

export const padelOfTennis = {
  id: "padel-of-tennis",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#2F7D62",
  locatieHint: T.locatieHint,
  icoon: "racket",
  categorieId: "sport",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: BAAN_DEFAULTS },
  instellingen: {
    defaults: BAAN_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "baan",
        vraag: T.instBaanVraag,
        keuzes: [
          { label: T.instBaanKeuzes[0], zet: { maxWind: 28 } },
          { label: T.instBaanKeuzes[1], zet: { maxWind: 22 } },
          { label: T.instBaanKeuzes[2], zet: { maxWind: 17 } },
        ],
      },
      {
        type: "keuze",
        id: "kou",
        vraag: T.instWarmVraag,
        keuzes: [
          { label: T.instWarmKeuzes[0], zet: { minGevoel: 3 } },
          { label: T.instWarmKeuzes[1], zet: { minGevoel: 6 } },
          { label: T.instWarmKeuzes[2], zet: { minGevoel: 10 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 7, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 16, max: 23 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-16",
  affiliate: null,
};
