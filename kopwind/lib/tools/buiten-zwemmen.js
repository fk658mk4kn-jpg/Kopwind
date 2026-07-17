/**
 * lib/tools/buiten-zwemmen.js
 *
 * De zwemcheck op de gedeelde venstermotor (v3.17.0 "Passaat"). Voor
 * buitenzwemmen telt de lucht streng: warm genoeg (rond de 22 gevoel
 * of meer), zon (uit het water is de zon je handdoek) en niet te veel
 * wind. Wat de check bewust NIET weet: de watertemperatuur (die loopt
 * weken achter op de lucht) en de waterkwaliteit (blauwalg). Beide
 * staan met naam en toenaam in de content en de uitleg.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "buiten-zwemmen",
    naam: "Kan ik buiten zwemmen?",
    korteVraag: "Kan ik buiten zwemmen?",
    meldingKort: "Zwemcheck",
    cta: "Check het zwemweer",
    navLabel: "Buiten zwemmen",
    diepte: "Warm, zonnig en rustig genoeg voor open water.",
    locatieHint: "Zoek je zwemplek of stad...",
    schaalLabels: { ideaal: "Heerlijk zwemweer", goed: "Prima zwemweer", twijfelachtig: "Fris uit het water", matig: "Alleen voor diehards", "zeer-slecht": "Geen zwemweer" },
    adviesLabels: { goed: "zwemweer", matig: "kan, fris uit het water", slecht: "geen zwemweer" },
    legenda: { links: "niet zwemmen", rechts: "zwemweer" },
    redenNat: "te nat en onstuimig voor een zwemdag",
    redenGeenBlok: "geen warm en droog blok",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenWind: (w) => `wind van ${w} km/u: koud als je nat bent`,
    redenBewolkt: "weinig zon: uit het water warm je lastig op",
    metric: (uur, g) => `Lekkerste zwemuur rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima zwemweer: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste zwemuren: ${tijd}.`,
    statusGeweest: "Het beste zwemweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het geen zwemweer.",
    toekomstBeste: (tijd) => `Beste zwemblok: ${tijd}.`,
    toekomstGeen: "Geen zwemweer.",
    instWarmVraag: "Wanneer duik jij het water in?",
    instWarmKeuzes: ["Ik zwem snel", "Gemiddeld", "Alleen bij tropisch weer"],
    instPlekVraag: "Waar zwem je meestal?",
    instPlekKeuzes: ["Plas of rivier", "Zee"],
    instDagStart: "Vroegste zwemtijd",
    instDagEind: "Laatste zwemtijd",
    instUur: "uur",
    instUitleg:
      "De check beoordeelt het weer boven het water: warm genoeg, zon en weinig wind. Twee dingen check je zelf: de watertemperatuur (open water loopt weken achter op de lucht; na de eerste hittegolf is het vaak nog fris) en de waterkwaliteit op officiele zwemplekken via zwemwater.nl (blauwalg in warme zomers).",
  },
  en: {
    slug: "outdoor-swimming",
    naam: "Swim outside today?",
    korteVraag: "Swim outside today?",
    meldingKort: "Swim check",
    cta: "Check the swim",
    navLabel: "Outdoor swimming",
    diepte: "Warm, sunny and calm enough for open water.",
    locatieHint: "Search your swimming spot or town...",
    schaalLabels: { ideaal: "Lovely swimming weather", goed: "Good swimming weather", twijfelachtig: "Chilly out of the water", matig: "Diehards only", "zeer-slecht": "No swimming weather" },
    adviesLabels: { goed: "swimming weather", matig: "doable, chilly getting out", slecht: "no swimming weather" },
    legenda: { links: "skip the swim", rechts: "swimming weather" },
    redenNat: "too wet and rough for a swim day",
    redenGeenBlok: "no warm and dry window",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenWind: (w) => `wind of ${w} km/h: cold when you're wet`,
    redenBewolkt: "little sun: hard to warm up out of the water",
    metric: (uur, g) => `Nicest swim hour around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good swimming weather right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best swim hours: ${tijd}.`,
    statusGeweest: "The best swimming weather has been and gone today.",
    statusNiks: "No swimming weather today.",
    toekomstBeste: (tijd) => `Best swim window: ${tijd}.`,
    toekomstGeen: "No swimming weather.",
    instWarmVraag: "When do you get in?",
    instWarmKeuzes: ["I'm in quickly", "Average", "Only in tropical weather"],
    instPlekVraag: "Where do you usually swim?",
    instPlekKeuzes: ["Lake or river", "Sea"],
    instDagStart: "Earliest swim time",
    instDagEind: "Latest swim time",
    instUur: "h",
    instUitleg:
      "The check judges the weather above the water: warm enough, sun and little wind. Two things you check yourself: the water temperature (open water lags the air by weeks; after the first heatwave it's often still cold) and the water quality at official spots (blue-green algae in warm summers).",
  },
});

export const ZWEM_DEFAULTS = {
  minGevoel: 22,
  maxWind: 24,
  dagStart: 10,
  dagEind: 20,
};

export function uurZwemScore(u, inst = ZWEM_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.05 || (u.kans ?? 0) >= 60) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 10;
  const gevoelF = clamp(lerp(gevoel, inst.minGevoel - 3, 28, 0, 1), 0, 1);
  const wind = u.wind ?? 0;
  const windF = clamp(1 - Math.max(0, wind - inst.maxWind * 0.5) / (inst.maxWind * 1.3), 0.3, 1);
  const zon = u.dag && u.bewolking != null ? (u.bewolking <= 40 ? 14 : u.bewolking <= 70 ? 5 : 0) : 0;
  return clamp(Math.round(84 * gevoelF * windF + zon), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: ZWEM_DEFAULTS,
  uurScore: uurZwemScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 2,
  extraFactoren: ({ venster }) => {
    if (!venster) return [];
    const gemBewolking =
      venster.blok.reduce((a, u) => a + (u.bewolking ?? 50), 0) / venster.uren;
    if (gemBewolking > 70) {
      return [{ punten: 7, reden: T.redenBewolkt }];
    }
    return [];
  },
});

export const buitenZwemmen = {
  id: "buiten-zwemmen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#C24E3F",
  locatieHint: T.locatieHint,
  icoon: "golven",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: ZWEM_DEFAULTS },
  instellingen: {
    defaults: ZWEM_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "warmte",
        vraag: T.instWarmVraag,
        keuzes: [
          { label: T.instWarmKeuzes[0], zet: { minGevoel: 20 } },
          { label: T.instWarmKeuzes[1], zet: { minGevoel: 22 } },
          { label: T.instWarmKeuzes[2], zet: { minGevoel: 25 } },
        ],
      },
      {
        type: "keuze",
        id: "plek",
        vraag: T.instPlekVraag,
        keuzes: [
          { label: T.instPlekKeuzes[0], zet: { maxWind: 24 } },
          { label: T.instPlekKeuzes[1], zet: { maxWind: 18 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 8, max: 14 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 16, max: 22 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-16",
  affiliate: null,
};
