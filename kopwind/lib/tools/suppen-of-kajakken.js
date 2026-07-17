/**
 * lib/tools/suppen-of-kajakken.js
 *
 * De vaarcheck op de gedeelde venstermotor (v3.17.0 "Passaat"). Op het
 * water is wind alles: wat op de kant een briesje lijkt, duwt een sup
 * of kajak zo de verkeerde kant op. De windgrens is daarom laag en
 * ervaringsafhankelijk, en de warmte-eis hangt van je wetsuit af. De
 * content waarschuwt apart voor aflandige wind en koud water; dat kan
 * de check niet uit de data halen.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "suppen-of-kajakken",
    naam: "Kan ik vandaag suppen of kajakken?",
    korteVraag: "Kan ik vandaag suppen of kajakken?",
    meldingKort: "Vaarcheck",
    cta: "Check het water",
    navLabel: "Suppen en kajakken",
    diepte: "Wind is alles op het water: het beste vaarblok.",
    locatieHint: "Zoek je vaarplek of stad...",
    schaalLabels: { ideaal: "Spiegelglad vaarweer", goed: "Prima op het water", twijfelachtig: "Kan, blijf bij de kant", matig: "Alleen voor ervaren peddelaars", "zeer-slecht": "Niet het water op" },
    adviesLabels: { goed: "vaarweer", matig: "kan, dicht bij de kant", slecht: "geen vaarweer" },
    legenda: { links: "aan de kant blijven", rechts: "vaarweer" },
    redenNat: "te nat en onstuimig voor het water",
    redenGeenBlok: "geen rustig vaarblok (de wind zit dwars)",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenWind: (w) => `wind van ${w} km/u: op het water voelt dat dubbel`,
    redenFris: (g) => `fris voor het water (gevoel maximaal ${g} graden)`,
    metric: (uur, g) => `Rustigste vaaruur rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu een prima vaarmoment: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste vaaruren: ${tijd}.`,
    statusGeweest: "Het beste vaarweer is voor vandaag geweest.",
    statusNiks: "Vandaag blijf je beter aan de kant.",
    toekomstBeste: (tijd) => `Beste vaarblok: ${tijd}.`,
    toekomstGeen: "Geen vaarweer.",
    instErvaringVraag: "Hoeveel wind kun je aan?",
    instErvaringKeuzes: ["Beginner", "Gemiddeld", "Ervaren peddelaar"],
    instWetsuitVraag: "Vaar je met wetsuit?",
    instWetsuitKeuzes: ["Zonder wetsuit", "Met wetsuit"],
    instDagStart: "Vroegste vaartijd",
    instDagEind: "Laatste vaartijd",
    instUur: "uur",
    instUitleg:
      "Wind is de baas op het water: boven jouw grens (beginner zo'n 14 km/u, ervaren 23) wordt sturen werken en terugkomen een gevecht. Met wetsuit mag het frisser. Let zelf op aflandige wind (die duwt je van de kant weg en lijkt op de oever zwakker dan op het water) en op koud water in voor- en najaar.",
  },
  en: {
    slug: "sup-or-kayak",
    naam: "SUP or kayak today?",
    korteVraag: "SUP or kayak today?",
    meldingKort: "Paddle check",
    cta: "Check the water",
    navLabel: "SUP and kayak",
    diepte: "Wind is everything on the water: your best paddle window.",
    locatieHint: "Search your paddling spot or town...",
    schaalLabels: { ideaal: "Mirror-flat paddle weather", goed: "Good on the water", twijfelachtig: "Doable, stay near shore", matig: "Experienced paddlers only", "zeer-slecht": "Stay off the water" },
    adviesLabels: { goed: "paddle weather", matig: "doable, close to shore", slecht: "no paddle weather" },
    legenda: { links: "stay ashore", rechts: "paddle weather" },
    redenNat: "too wet and rough for the water",
    redenGeenBlok: "no calm paddle window (the wind gets in the way)",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenWind: (w) => `wind of ${w} km/h: on the water that feels double`,
    redenFris: (g) => `chilly for the water (feels like ${g} degrees at best)`,
    metric: (uur, g) => `Calmest paddle hour around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good paddling right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best paddle hours: ${tijd}.`,
    statusGeweest: "The best paddle weather has been and gone today.",
    statusNiks: "Better to stay ashore today.",
    toekomstBeste: (tijd) => `Best paddle window: ${tijd}.`,
    toekomstGeen: "No paddle weather.",
    instErvaringVraag: "How much wind can you handle?",
    instErvaringKeuzes: ["Beginner", "Average", "Experienced paddler"],
    instWetsuitVraag: "Do you paddle in a wetsuit?",
    instWetsuitKeuzes: ["No wetsuit", "With a wetsuit"],
    instDagStart: "Earliest paddle time",
    instDagEind: "Latest paddle time",
    instUur: "h",
    instUitleg:
      "Wind rules the water: above your limit (roughly 14 km/h for beginners, 23 when experienced) steering becomes work and getting back a fight. A wetsuit allows cooler days. Watch offshore wind yourself (it pushes you away from shore and feels weaker on the bank than on the water) and cold water in spring and autumn.",
  },
});

export const VAAR_DEFAULTS = {
  minGevoel: 16,
  maxWind: 18,
  dagStart: 9,
  dagEind: 21,
};

export function uurVaarScore(u, inst = VAAR_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.3 || (u.kans ?? 0) >= 75) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 10;
  const tempF = clamp(lerp(gevoel, inst.minGevoel - 4, 24, 0, 1), 0, 1);
  const wind = u.wind ?? 0;
  const windF = clamp(1 - Math.max(0, wind - inst.maxWind * 0.3) / (inst.maxWind * 0.9), 0.1, 1);
  const zon = u.dag && u.bewolking != null && u.bewolking <= 50 ? 6 : 0;
  const motregenF = (u.neerslag ?? 0) > 0.05 ? 0.85 : 1;
  return clamp(Math.round(90 * tempF * windF * motregenF + zon), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: VAAR_DEFAULTS,
  uurScore: uurVaarScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 2,
  extraFactoren: ({ uren, inst }) => {
    const maxGevoel = Math.max(...uren.map((u) => u.gevoel ?? -99));
    if (maxGevoel < inst.minGevoel + 2) {
      return [{ punten: 8, reden: T.redenFris(Math.round(maxGevoel)) }];
    }
    return [];
  },
});

export const suppenOfKajakken = {
  id: "suppen-of-kajakken",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#C24E3F",
  locatieHint: T.locatieHint,
  icoon: "peddel",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: VAAR_DEFAULTS },
  instellingen: {
    defaults: VAAR_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "ervaring",
        vraag: T.instErvaringVraag,
        keuzes: [
          { label: T.instErvaringKeuzes[0], zet: { maxWind: 14 } },
          { label: T.instErvaringKeuzes[1], zet: { maxWind: 18 } },
          { label: T.instErvaringKeuzes[2], zet: { maxWind: 23 } },
        ],
      },
      {
        type: "keuze",
        id: "wetsuit",
        vraag: T.instWetsuitVraag,
        keuzes: [
          { label: T.instWetsuitKeuzes[0], zet: { minGevoel: 16 } },
          { label: T.instWetsuitKeuzes[1], zet: { minGevoel: 10 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 7, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 16, max: 22 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-16",
  affiliate: null,
};
