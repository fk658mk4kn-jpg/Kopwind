/**
 * lib/tools/hond-uitlaten.js
 *
 * De uitlaatcheck (v3.29.0 "Ghibli"). Anders dan elke andere
 * buitencheck is dit geen ja/nee-vraag (de hond moet er sowieso uit)
 * maar een wanneer- en hoe-vraag. De motor is daarom mild op regen
 * (natte hond, jammer dan) maar hard op hitte: asfalt in de zon wordt
 * gevaarlijk heet voor voetzolen, en kortsnuitige rassen raken hun
 * warmte niet kwijt. Het beste blok is dus vooral het comfortabelste
 * en veiligste blok, met een expliciete asfaltwaarschuwing op hete
 * dagen.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "hond-uitlaten",
    naam: "Wanneer laat ik de hond uit vandaag?",
    korteVraag: "Wanneer laat ik de hond uit vandaag?",
    meldingKort: "Uitlaatcheck",
    cta: "Check het rondje",
    navLabel: "Hond uitlaten",
    diepte: "Het beste uitlaatblok, met een harde grens op heet asfalt.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Heerlijk uitlaatweer", goed: "Prima uitlaatweer", twijfelachtig: "Kort rondje kan", matig: "Alleen het hoognodige", "zeer-slecht": "Wacht op een beter moment" },
    adviesLabels: { goed: "uitlaatweer", matig: "kort rondje", slecht: "wacht op een koeler moment" },
    legenda: { links: "korte plaspauze", rechts: "lange wandeling" },
    redenNat: "flinke regen: het wordt een korte, natte ronde",
    redenGeenBlok: "geen comfortabel uitlaatblok (hitte of hoosbuien)",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort goed blok (${u} uur)`,
    redenBuien: "buien rond het beste blok: neem het korte rondje",
    redenAsfalt: (g) => `heet asfalt (gevoel tot ${g} graden): doe de 7-secondentest met je handrug`,
    redenGlad: "gladde stoepen: korte lijn en rustig aan",
    metric: (uur, g) => `Fijnste uitlaatuur rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu een prima moment: het goede blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Fijnste uitlaaturen: ${tijd}.`,
    statusGeweest: "Het fijnste uitlaatweer is voor vandaag geweest; de avond kan alsnog.",
    statusNiks: "Houd de rondjes vandaag kort en kies de koelste momenten.",
    toekomstBeste: (tijd) => `Fijnste uitlaatblok: ${tijd}.`,
    toekomstGeen: "Een dag voor korte rondjes.",
    instHondVraag: "Wat voor hond heb je?",
    instHondKeuzes: ["Kortsnuitig of dikke vacht", "Gemiddeld", "Hittebestendige loper"],
    instDuurVraag: "Hoe lang is het grote rondje?",
    instDuurKeuzes: ["Half uurtje", "Een uur of langer"],
    instDagStart: "Vroegste rondje",
    instDagEind: "Laatste rondje",
    instUur: "uur",
    instUitleg:
      "De hond moet er toch uit, dus de check zoekt het comfortabelste en veiligste blok in plaats van een hard wel of niet te geven. Hitte weegt het zwaarst: asfalt in de zon wordt veel heter dan de lucht (7-secondentest: kun je je handrug er niet 7 tellen op houden, dan is het te heet voor voetzolen). Kortsnuitige rassen krijgen strengere grenzen. Regen maakt het rondje alleen natter, niet onmogelijk.",
  },
  en: {
    slug: "walking-the-dog",
    naam: "When to walk the dog today?",
    korteVraag: "When to walk the dog today?",
    meldingKort: "Dog walk check",
    cta: "Check the walk",
    navLabel: "Dog walking",
    diepte: "The best walking window, with a hard line on hot tarmac.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Lovely dog-walking weather", goed: "Good walking weather", twijfelachtig: "A short loop works", matig: "Essentials only", "zeer-slecht": "Wait for a better moment" },
    adviesLabels: { goed: "walking weather", matig: "short loop", slecht: "wait for a cooler moment" },
    legenda: { links: "quick pee break", rechts: "long walk" },
    redenNat: "proper rain: it'll be a short, wet loop",
    redenGeenBlok: "no comfortable walking window (heat or downpours)",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short good window (${u} hours)`,
    redenBuien: "showers around the best window: take the short loop",
    redenAsfalt: (g) => `hot tarmac (feels like up to ${g} degrees): do the 7-second test with the back of your hand`,
    redenGlad: "slippery pavements: short lead and easy does it",
    metric: (uur, g) => `Nicest walking hour around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `A good moment right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Nicest walking hours: ${tijd}.`,
    statusGeweest: "The nicest walking weather has passed; the evening still works.",
    statusNiks: "Keep the loops short today and pick the coolest moments.",
    toekomstBeste: (tijd) => `Nicest walking window: ${tijd}.`,
    toekomstGeen: "A day for short loops.",
    instHondVraag: "What kind of dog do you have?",
    instHondKeuzes: ["Flat-nosed or thick coat", "Average", "Heat-proof runner"],
    instDuurVraag: "How long is the big loop?",
    instDuurKeuzes: ["Half an hour", "An hour or more"],
    instDagStart: "Earliest walk",
    instDagEind: "Latest walk",
    instUur: "h",
    instUitleg:
      "The dog has to go out anyway, so the check finds the most comfortable and safest window rather than giving a flat go or no-go. Heat weighs heaviest: tarmac in the sun gets far hotter than the air (7-second test: if you can't hold the back of your hand on it for 7 counts, it's too hot for paws). Flat-nosed breeds get stricter limits. Rain only makes the loop wetter, not impossible.",
  },
});

export const HOND_DEFAULTS = {
  hitteGrens: 24,
  duur: 0,
  dagStart: 7,
  dagEind: 23,
};

export function uurHondScore(u, inst = HOND_DEFAULTS) {
  const gevoel = u.gevoel ?? u.temp ?? 12;
  // Hitte is de harde kant: heet plus zon betekent heet asfalt.
  if (gevoel >= inst.hitteGrens + 6) return 5;
  let tempF;
  if (gevoel <= 14) {
    tempF = clamp(lerp(gevoel, -8, 4, 0.5, 1), 0.5, 1);
  } else {
    tempF = clamp(lerp(gevoel, inst.hitteGrens - 4, inst.hitteGrens + 6, 1, 0.15), 0.15, 1);
  }
  const zonHeet = gevoel >= inst.hitteGrens && u.dag && (u.bewolking ?? 50) < 60;
  const asfaltF = zonHeet ? 0.55 : 1;
  // Regen is mild: natte hond, geen ramp. Hozen wel vermijden.
  const n = u.neerslag ?? 0;
  const regenF = n > 1.5 ? 0.35 : n > 0.3 ? 0.65 : n > 0.05 ? 0.85 : 1;
  const windF = clamp(1 - Math.max(0, (u.wind ?? 0) - (inst.duur === 1 ? 30 : 38)) / 40, 0.5, 1);
  return clamp(Math.round(96 * tempF * asfaltF * regenF * windF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: HOND_DEFAULTS,
  uurScore: uurHondScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 1,
  extraFactoren: ({ uren, inst }) => {
    const uit = [];
    const dagUren = uren.filter((u) => u.dag);
    const maxGevoel = Math.max(...dagUren.map((u) => u.gevoel ?? u.temp ?? -99), -99);
    if (maxGevoel >= inst.hitteGrens + 2) {
      uit.push({ punten: maxGevoel >= inst.hitteGrens + 6 ? 24 : 12, reden: T.redenAsfalt(Math.round(maxGevoel)) });
    }
    const minTemp = Math.min(...uren.map((u) => u.temp ?? 99));
    const vochtig = uren.some((u) => (u.neerslag ?? 0) > 0.05 || (u.rh ?? 0) >= 92);
    if (minTemp <= 1 && vochtig) {
      uit.push({ punten: 10, reden: T.redenGlad });
    }
    return uit;
  },
});

export const hondUitlaten = {
  id: "hond-uitlaten",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#C24E3F",
  locatieHint: T.locatieHint,
  icoon: "hond",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: HOND_DEFAULTS },
  instellingen: {
    defaults: HOND_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "hond",
        vraag: T.instHondVraag,
        keuzes: [
          { label: T.instHondKeuzes[0], zet: { hitteGrens: 21 } },
          { label: T.instHondKeuzes[1], zet: { hitteGrens: 24 } },
          { label: T.instHondKeuzes[2], zet: { hitteGrens: 27 } },
        ],
      },
      {
        type: "keuze",
        id: "duur",
        vraag: T.instDuurVraag,
        keuzes: [
          { label: T.instDuurKeuzes[0], zet: { duur: 0 } },
          { label: T.instDuurKeuzes[1], zet: { duur: 1 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 5, max: 10 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 18, max: 24 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
