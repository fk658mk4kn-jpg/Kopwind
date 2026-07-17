/**
 * lib/tools/wandelen.js
 *
 * De wandelcheck op de gedeelde venstermotor (v3.17.0 "Passaat").
 * Wandelen is de ruimhartigste buitencheck: met de juiste jas kan
 * bijna alles, dus het optimum is breed (ruwweg 6 tot 20 gevoel),
 * motregen telt licht, en pas echte regen, hitte of storm drukken het
 * oordeel. Strenger dan hardlopen op warmte is het niet; wel milder op
 * kou en wind.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "wandelen",
    naam: "Kan ik wandelen vandaag?",
    korteVraag: "Kan ik wandelen vandaag?",
    meldingKort: "Wandelcheck",
    cta: "Check de wandeling",
    navLabel: "Wandelen",
    diepte: "Het beste wandelblok, met een ruim hart voor fris weer.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect wandelweer", goed: "Prima wandelweer", twijfelachtig: "Kan, met de juiste jas", matig: "Gure wandeling", "zeer-slecht": "Geen wandelweer" },
    adviesLabels: { goed: "wandelweer", matig: "kan, goed aangekleed", slecht: "geen wandelweer" },
    legenda: { links: "binnen blijven", rechts: "wandelweer" },
    redenNat: "te nat voor een wandeling",
    redenGeenBlok: "geen bruikbaar wandelblok (regen of storm zit dwars)",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenWind: (w) => `stevige wind (${w} km/u), zeker in open landschap`,
    redenWarm: (g) => `warm voor een lange wandeling (gevoel tot ${g} graden)`,
    metric: (uur, g) => `Lekkerste wandeluur rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima wandelweer: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste wandeluren: ${tijd}.`,
    statusGeweest: "Het beste wandelweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het geen dag voor een wandeling.",
    toekomstBeste: (tijd) => `Beste wandelblok: ${tijd}.`,
    toekomstGeen: "Geen wandelweer.",
    instWarmVraag: "Wanneer wordt wandelen jou te warm?",
    instWarmKeuzes: ["Fris wandelt het lekkerst", "Gemiddeld", "Warmte deert me niet"],
    instWindVraag: "Waar wandel je meestal?",
    instWindKeuzes: ["Beschut (bos, stad)", "Gemengd", "Open landschap (polder, kust)"],
    instDagStart: "Vroegste wandeltijd",
    instDagEind: "Laatste wandeltijd",
    instUur: "uur",
    instUitleg:
      "Wandelen kan bijna altijd; de check zoekt het comfortabelste blok. Ideaal is 6 tot 20 graden gevoel en droog; motregen telt licht mee, echte regen en storm drukken het oordeel. In open landschap weegt wind zwaarder: zet dat in de instellingen.",
  },
  en: {
    slug: "walking",
    naam: "Go for a walk today?",
    korteVraag: "Go for a walk today?",
    meldingKort: "Walking check",
    cta: "Check the walk",
    navLabel: "Walking",
    diepte: "Your best walking window, generous towards fresh weather.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect walking weather", goed: "Good walking weather", twijfelachtig: "Doable with the right coat", matig: "A bleak walk", "zeer-slecht": "No walking weather" },
    adviesLabels: { goed: "walking weather", matig: "doable, dressed well", slecht: "no walking weather" },
    legenda: { links: "stay inside", rechts: "walking weather" },
    redenNat: "too wet for a walk",
    redenGeenBlok: "no usable walking window (rain or storm gets in the way)",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenWind: (w) => `strong wind (${w} km/h), especially in open country`,
    redenWarm: (g) => `warm for a long walk (feels like up to ${g} degrees)`,
    metric: (uur, g) => `Nicest walking hour around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good walking weather right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best walking hours: ${tijd}.`,
    statusGeweest: "The best walking weather has been and gone today.",
    statusNiks: "Today isn't a day for a walk.",
    toekomstBeste: (tijd) => `Best walking window: ${tijd}.`,
    toekomstGeen: "No walking weather.",
    instWarmVraag: "When does walking get too warm for you?",
    instWarmKeuzes: ["Fresh walks best", "Average", "Heat doesn't bother me"],
    instWindVraag: "Where do you usually walk?",
    instWindKeuzes: ["Sheltered (woods, town)", "Mixed", "Open country (fields, coast)"],
    instDagStart: "Earliest walking time",
    instDagEind: "Latest walking time",
    instUur: "h",
    instUitleg:
      "Walking works almost always; the check finds the most comfortable window. Ideal is 6 to 20 degrees feels-like and dry; drizzle counts lightly, real rain and storm push the verdict down. In open country wind weighs heavier: set that in the settings.",
  },
});

export const WANDEL_DEFAULTS = {
  maxGevoel: 27,
  maxWind: 38,
  dagStart: 8,
  dagEind: 21,
};

export function uurWandelScore(u, inst = WANDEL_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.25 || (u.kans ?? 0) >= 75) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 10;
  let tempF;
  if (gevoel <= 18) {
    tempF = clamp(lerp(gevoel, -6, 6, 0.3, 1), 0.3, 1);
  } else {
    tempF = clamp(lerp(gevoel, 18, inst.maxGevoel + 5, 1, 0.3), 0.3, 1);
  }
  const wind = u.wind ?? 0;
  const windF = clamp(1 - Math.max(0, wind - inst.maxWind * 0.5) / (inst.maxWind * 1.4), 0.4, 1);
  const motregenF = (u.neerslag ?? 0) > 0.05 ? 0.88 : 1;
  return clamp(Math.round(95 * tempF * windF * motregenF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: WANDEL_DEFAULTS,
  uurScore: uurWandelScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 1,
  extraFactoren: ({ uren, inst }) => {
    const maxGevoel = Math.max(...uren.map((u) => u.gevoel ?? -99));
    if (maxGevoel > inst.maxGevoel) {
      return [{ punten: 8, reden: T.redenWarm(Math.round(maxGevoel)) }];
    }
    return [];
  },
});

export const wandelen = {
  id: "wandelen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#2F7D62",
  locatieHint: T.locatieHint,
  icoon: "bergen",
  categorieId: "sport",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: WANDEL_DEFAULTS },
  instellingen: {
    defaults: WANDEL_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "warmte",
        vraag: T.instWarmVraag,
        keuzes: [
          { label: T.instWarmKeuzes[0], zet: { maxGevoel: 24 } },
          { label: T.instWarmKeuzes[1], zet: { maxGevoel: 27 } },
          { label: T.instWarmKeuzes[2], zet: { maxGevoel: 30 } },
        ],
      },
      {
        type: "keuze",
        id: "wind",
        vraag: T.instWindVraag,
        keuzes: [
          { label: T.instWindKeuzes[0], zet: { maxWind: 44 } },
          { label: T.instWindKeuzes[1], zet: { maxWind: 38 } },
          { label: T.instWindKeuzes[2], zet: { maxWind: 30 } },
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
