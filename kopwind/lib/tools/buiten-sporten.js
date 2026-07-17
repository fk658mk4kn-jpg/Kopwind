/**
 * lib/tools/buiten-sporten.js
 *
 * De buitensportcheck op de gedeelde venstermotor (v3.17.0 "Passaat").
 * Voor bootcamp, calisthenics, veldsport en circuittraining: kou is
 * zelden het probleem (warming-up lost veel op), hitte en echte regen
 * wel. Wind weegt licht bij krachtwerk en zwaarder bij loopvormen; dat
 * is de belangrijkste instelling.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "buiten-sporten",
    naam: "Kan ik buiten sporten vandaag?",
    korteVraag: "Kan ik buiten sporten vandaag?",
    meldingKort: "Trainingscheck",
    cta: "Check de training",
    navLabel: "Buiten sporten",
    diepte: "Het beste trainingsblok voor bootcamp, veldsport of circuit.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect trainingsweer", goed: "Prima trainingsweer", twijfelachtig: "Kan, warm goed op", matig: "Zwaar trainingsweer", "zeer-slecht": "Vandaag binnen trainen" },
    adviesLabels: { goed: "trainingsweer", matig: "kan, met aanpassingen", slecht: "geen buitentraining" },
    legenda: { links: "binnen trainen", rechts: "trainingsweer" },
    redenNat: "te nat om buiten te trainen",
    redenGeenBlok: "geen bruikbaar trainingsblok (regen, hitte of storm)",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenWind: (w) => `stevige wind (${w} km/u), lastig bij loopvormen`,
    redenHitte: (g) => `te warm voor een intensieve training (gevoel tot ${g} graden)`,
    metric: (uur, g) => `Beste trainingsuur rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima trainingsweer: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste trainingsuren: ${tijd}.`,
    statusGeweest: "Het beste trainingsweer is voor vandaag geweest.",
    statusNiks: "Vandaag train je beter binnen.",
    toekomstBeste: (tijd) => `Beste trainingsblok: ${tijd}.`,
    toekomstGeen: "Geen weer voor een buitentraining.",
    instSoortVraag: "Wat voor training doe je meestal?",
    instSoortKeuzes: ["Kracht of circuit", "Gemengd", "Veel loopvormen"],
    instWarmVraag: "Wanneer wordt het je te warm?",
    instWarmKeuzes: ["Ik train graag fris", "Gemiddeld", "Hitte deert me niet"],
    instDagStart: "Vroegste trainingstijd",
    instDagEind: "Laatste trainingstijd",
    instUur: "uur",
    instUitleg:
      "Kou is met een goede warming-up zelden een reden om binnen te blijven; hitte en echte regen wel. Boven jouw warmtegrens zakt het oordeel hard. Doe je vooral krachtwerk, dan telt wind licht; bij loopvormen zwaarder. De statusregel noemt het beste blok.",
  },
  en: {
    slug: "outdoor-workout",
    naam: "Work out outside today?",
    korteVraag: "Work out outside today?",
    meldingKort: "Workout check",
    cta: "Check the workout",
    navLabel: "Outdoor workout",
    diepte: "Your best training window for bootcamp, field sport or circuits.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect training weather", goed: "Good training weather", twijfelachtig: "Doable, warm up well", matig: "Tough training weather", "zeer-slecht": "Train inside today" },
    adviesLabels: { goed: "training weather", matig: "doable with tweaks", slecht: "no outdoor session" },
    legenda: { links: "train inside", rechts: "training weather" },
    redenNat: "too wet to train outside",
    redenGeenBlok: "no usable training window (rain, heat or storm)",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenWind: (w) => `strong wind (${w} km/h), tricky for running drills`,
    redenHitte: (g) => `too warm for an intensive session (feels like up to ${g} degrees)`,
    metric: (uur, g) => `Best training hour around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good training weather right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best training hours: ${tijd}.`,
    statusGeweest: "The best training weather has been and gone today.",
    statusNiks: "Better to train inside today.",
    toekomstBeste: (tijd) => `Best training window: ${tijd}.`,
    toekomstGeen: "No weather for an outdoor session.",
    instSoortVraag: "What kind of training do you mostly do?",
    instSoortKeuzes: ["Strength or circuits", "Mixed", "Lots of running drills"],
    instWarmVraag: "When does it get too warm for you?",
    instWarmKeuzes: ["I like it cool", "Average", "Heat doesn't bother me"],
    instDagStart: "Earliest training time",
    instDagEind: "Latest training time",
    instUur: "h",
    instUitleg:
      "Cold is rarely a reason to stay in with a proper warm-up; heat and real rain are. Above your heat limit the verdict drops fast. Mostly strength work? Then wind counts lightly; with running drills it weighs more. The status line names the best window.",
  },
});

export const BUITENSPORT_DEFAULTS = {
  maxGevoel: 26,
  maxWind: 40,
  dagStart: 7,
  dagEind: 22,
};

export function uurTrainScore(u, inst = BUITENSPORT_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.15 || (u.kans ?? 0) >= 65) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 10;
  let tempF;
  if (gevoel <= 16) {
    tempF = clamp(lerp(gevoel, -6, 5, 0.25, 1), 0.25, 1);
  } else {
    tempF = clamp(lerp(gevoel, 16, inst.maxGevoel + 7, 1, 0.12), 0.12, 1);
  }
  const wind = u.wind ?? 0;
  const windF = clamp(1 - Math.max(0, wind - inst.maxWind * 0.55) / (inst.maxWind * 1.5), 0.35, 1);
  const motregenF = (u.neerslag ?? 0) > 0.05 ? 0.9 : 1;
  return clamp(Math.round(95 * tempF * windF * motregenF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: BUITENSPORT_DEFAULTS,
  uurScore: uurTrainScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 1,
  extraFactoren: ({ uren, inst }) => {
    const maxGevoel = Math.max(...uren.map((u) => u.gevoel ?? -99));
    if (maxGevoel > inst.maxGevoel - 2) {
      return [{ punten: 10, reden: T.redenHitte(Math.round(maxGevoel)) }];
    }
    return [];
  },
});

export const buitenSporten = {
  id: "buiten-sporten",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#2F7D62",
  locatieHint: T.locatieHint,
  icoon: "halter",
  categorieId: "sport",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: BUITENSPORT_DEFAULTS },
  instellingen: {
    defaults: BUITENSPORT_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "soort",
        vraag: T.instSoortVraag,
        keuzes: [
          { label: T.instSoortKeuzes[0], zet: { maxWind: 46 } },
          { label: T.instSoortKeuzes[1], zet: { maxWind: 40 } },
          { label: T.instSoortKeuzes[2], zet: { maxWind: 30 } },
        ],
      },
      {
        type: "keuze",
        id: "warmte",
        vraag: T.instWarmVraag,
        keuzes: [
          { label: T.instWarmKeuzes[0], zet: { maxGevoel: 23 } },
          { label: T.instWarmKeuzes[1], zet: { maxGevoel: 26 } },
          { label: T.instWarmKeuzes[2], zet: { maxGevoel: 29 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 6, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 16, max: 23 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-16",
  affiliate: null,
};
