/**
 * lib/tools/picknickweer.js
 *
 * De picknickcheck op de gedeelde venstermotor (v3.17.0 "Passaat").
 * Dicht bij het terras, maar met twee eigen trekjes: de windgrens ligt
 * lager (servetten, kleedje en bekers waaien weg voordat een
 * terrasstoel ergens last van heeft) en het gras telt mee: buien
 * eerder op de dag laten de grond nog uren nat na.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "picknickweer",
    naam: "Is het picknickweer vandaag?",
    korteVraag: "Is het picknickweer vandaag?",
    meldingKort: "Picknickcheck",
    cta: "Check de picknick",
    navLabel: "Picknick",
    diepte: "Warm genoeg, droog gras en een kleedje dat blijft liggen.",
    locatieHint: "Zoek je stad of het park...",
    schaalLabels: { ideaal: "Heerlijk picknickweer", goed: "Prima picknickweer", twijfelachtig: "Kan, zoek de luwte", matig: "Kleedje waait weg", "zeer-slecht": "Geen picknickdag" },
    adviesLabels: { goed: "picknickweer", matig: "kan, in de luwte", slecht: "geen picknickweer" },
    legenda: { links: "binnen eten", rechts: "picknickweer" },
    redenNat: "te nat om buiten te eten",
    redenGeenBlok: "geen bruikbaar blok (wind of buien zitten dwars)",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenWind: (w) => `wind van ${w} km/u: servetten en bekers waaien weg`,
    redenNatGras: "het gras kan nog nat zijn van eerdere buien",
    redenFris: (g) => `fris om stil te zitten (gevoel maximaal ${g} graden)`,
    metric: (uur, g) => `Lekkerste picknickuur rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima picknickweer: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste picknickuren: ${tijd}.`,
    statusGeweest: "Het beste picknickweer is voor vandaag geweest.",
    statusNiks: "Vandaag wordt het geen picknick.",
    toekomstBeste: (tijd) => `Beste picknickblok: ${tijd}.`,
    toekomstGeen: "Geen picknickweer.",
    instWarmVraag: "Wanneer zit jij lekker op een kleedje?",
    instWarmKeuzes: ["Ik zit er snel", "Gemiddeld", "Alleen bij echt warm weer"],
    instWindVraag: "Hoeveel wind is oke\u0301?",
    instWindKeuzes: ["Ik zoek een beschut plekje", "Gemiddeld", "Wind verpest het snel"],
    instDagStart: "Vroegste picknicktijd",
    instDagEind: "Laatste picknicktijd",
    instUur: "uur",
    instUitleg:
      "Picknicken vraagt net iets meer dan het terras: je zit stil op de grond, dus warm genoeg (rond de 18 gevoel of meer), weinig wind (het kleedje) en droog gras. Buien eerder op de dag tellen mee: de grond blijft uren nat. Kies desnoods een bankje of neem een kleedje met ondergrond.",
  },
  en: {
    slug: "picnic-weather",
    naam: "Picnic weather today?",
    korteVraag: "Picnic weather today?",
    meldingKort: "Picnic check",
    cta: "Check the picnic",
    navLabel: "Picnic",
    diepte: "Warm enough, dry grass and a blanket that stays put.",
    locatieHint: "Search your town or the park...",
    schaalLabels: { ideaal: "Lovely picnic weather", goed: "Good picnic weather", twijfelachtig: "Doable, find shelter", matig: "Blanket blows away", "zeer-slecht": "Not a picnic day" },
    adviesLabels: { goed: "picnic weather", matig: "doable in shelter", slecht: "no picnic weather" },
    legenda: { links: "eat inside", rechts: "picnic weather" },
    redenNat: "too wet to eat outside",
    redenGeenBlok: "no usable window (wind or showers get in the way)",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenWind: (w) => `wind of ${w} km/h: napkins and cups blow away`,
    redenNatGras: "the grass may still be wet from earlier showers",
    redenFris: (g) => `chilly for sitting still (feels like ${g} degrees at best)`,
    metric: (uur, g) => `Nicest picnic hour around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good picnic weather right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best picnic hours: ${tijd}.`,
    statusGeweest: "The best picnic weather has been and gone today.",
    statusNiks: "No picnic today.",
    toekomstBeste: (tijd) => `Best picnic window: ${tijd}.`,
    toekomstGeen: "No picnic weather.",
    instWarmVraag: "When are you happy on a blanket?",
    instWarmKeuzes: ["I'm out there early", "Average", "Only in properly warm weather"],
    instWindVraag: "How much wind is fine?",
    instWindKeuzes: ["I find a sheltered spot", "Average", "Wind ruins it fast"],
    instDagStart: "Earliest picnic time",
    instDagEind: "Latest picnic time",
    instUur: "h",
    instUitleg:
      "A picnic asks a bit more than the patio: you sit still on the ground, so warm enough (around 18 feels-like or more), little wind (the blanket) and dry grass. Earlier showers count: the ground stays wet for hours. Pick a bench if needed, or bring a blanket with a backing.",
  },
});

export const PICKNICK_DEFAULTS = {
  minGevoel: 16,
  maxWind: 19,
  dagStart: 9,
  dagEind: 21,
};

export function uurPicknickScore(u, inst = PICKNICK_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.05 || (u.kans ?? 0) >= 60) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 10;
  const gevoelF = clamp(lerp(gevoel, inst.minGevoel - 6, 23, 0, 1), 0, 1);
  const wind = u.wind ?? 0;
  const windF = clamp(1 - Math.max(0, wind - inst.maxWind * 0.4) / (inst.maxWind * 1.2), 0.2, 1);
  const zon = u.dag && u.bewolking != null && u.bewolking <= 50 ? 10 : 0;
  return clamp(Math.round(86 * gevoelF * windF + zon), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: PICKNICK_DEFAULTS,
  uurScore: uurPicknickScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 2,
  extraFactoren: ({ uren, venster, inst }) => {
    const uit = [];
    if (venster) {
      const eerderNat = uren
        .filter((u) => u.uur < venster.van)
        .reduce((a, u) => a + (u.neerslag ?? 0), 0);
      if (eerderNat > 0.3) uit.push({ punten: 7, reden: T.redenNatGras });
    }
    const maxGevoel = Math.max(...uren.map((u) => u.gevoel ?? -99));
    if (maxGevoel < inst.minGevoel + 2) {
      uit.push({ punten: 8, reden: T.redenFris(Math.round(maxGevoel)) });
    }
    return uit;
  },
});

export const picknickweer = {
  id: "picknickweer",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#C24E3F",
  locatieHint: T.locatieHint,
  icoon: "mand",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: PICKNICK_DEFAULTS },
  instellingen: {
    defaults: PICKNICK_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "warmte",
        vraag: T.instWarmVraag,
        keuzes: [
          { label: T.instWarmKeuzes[0], zet: { minGevoel: 13 } },
          { label: T.instWarmKeuzes[1], zet: { minGevoel: 16 } },
          { label: T.instWarmKeuzes[2], zet: { minGevoel: 19 } },
        ],
      },
      {
        type: "keuze",
        id: "wind",
        vraag: T.instWindVraag,
        keuzes: [
          { label: T.instWindKeuzes[0], zet: { maxWind: 24 } },
          { label: T.instWindKeuzes[1], zet: { maxWind: 19 } },
          { label: T.instWindKeuzes[2], zet: { maxWind: 14 } },
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
