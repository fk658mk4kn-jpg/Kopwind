/**
 * lib/tools/golfen.js
 *
 * De golfcheck (v3.29.0 "Ghibli"). Golf is de meest windgevoelige
 * venstersport op de site: vanaf een windkracht die een wandelaar
 * amper deert wordt een approach al gokwerk, en een ronde duurt uren,
 * dus het blok moet lang zijn. Regen is de tweede spelbreker (natte
 * grips), kou en hitte tellen milder mee dan bij hardlopen omdat het
 * tempo laag ligt.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "golfen",
    naam: "Kan ik vandaag golfen?",
    korteVraag: "Kan ik vandaag golfen?",
    meldingKort: "Golfcheck",
    cta: "Check de ronde",
    navLabel: "Golfen",
    diepte: "Het beste blok voor een ronde: wind weegt zwaar, want de bal voelt alles.",
    locatieHint: "Zoek je stad of de baan, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect golfweer", goed: "Prima golfweer", twijfelachtig: "Kan, met windcorrectie", matig: "Zware ronde", "zeer-slecht": "Geen golfweer" },
    adviesLabels: { goed: "golfweer", matig: "kan, met windcorrectie", slecht: "geen golfweer" },
    legenda: { links: "clubs laten staan", rechts: "golfweer" },
    redenNat: "te nat voor een ronde (natte grips, casual water)",
    redenGeenBlok: "geen bruikbaar blok voor een ronde (regen of wind zit dwars)",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur): eerder negen dan achttien holes`,
    redenBuien: "buien rond het beste blok",
    redenWind: (w) => `stevige wind (${w} km/u): reken op een club meer en lagere ballen`,
    metric: (uur, g) => `Beste starttijd rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima golfweer: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste golfuren: ${tijd}.`,
    statusGeweest: "Het beste golfweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het geen dag voor een ronde.",
    toekomstBeste: (tijd) => `Beste golfblok: ${tijd}.`,
    toekomstGeen: "Geen golfweer.",
    instWindVraag: "Hoeveel wind accepteer je?",
    instWindKeuzes: ["Ik wil rustige condities", "Gemiddeld", "Wind hoort bij links golf"],
    instWarmVraag: "Wanneer wordt het je te warm?",
    instWarmKeuzes: ["Boven de 25 wordt het zwaar", "Gemiddeld", "Hitte deert me niet"],
    instDagStart: "Vroegste starttijd",
    instDagEind: "Laatste starttijd plus ronde",
    instUur: "uur",
    instUitleg:
      "De check zoekt een blok dat lang genoeg is voor een ronde. Wind weegt zwaarder dan bij andere buitensporten: vanaf zo'n 25 km/u speelt de baan merkbaar anders, vanaf 40 wordt het overleven. Regen betekent natte grips en dat is einde verhaal; motregen telt licht mee.",
  },
  en: {
    slug: "golfing",
    naam: "Can I golf today?",
    korteVraag: "Can I golf today?",
    meldingKort: "Golf check",
    cta: "Check the round",
    navLabel: "Golfing",
    diepte: "The best window for a round: wind weighs heavy, the ball feels everything.",
    locatieHint: "Search your town or the course...",
    schaalLabels: { ideaal: "Perfect golf weather", goed: "Good golf weather", twijfelachtig: "Doable with wind play", matig: "A tough round", "zeer-slecht": "No golf weather" },
    adviesLabels: { goed: "golf weather", matig: "doable with wind play", slecht: "no golf weather" },
    legenda: { links: "leave the clubs", rechts: "golf weather" },
    redenNat: "too wet for a round (wet grips, casual water)",
    redenGeenBlok: "no usable window for a round (rain or wind in the way)",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short window (${u} hours): nine holes rather than eighteen`,
    redenBuien: "showers around the best window",
    redenWind: (w) => `strong wind (${w} km/h): count on an extra club and lower flights`,
    metric: (uur, g) => `Best tee time around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good golf weather right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best golfing hours: ${tijd}.`,
    statusGeweest: "The best golf weather has been and gone today.",
    statusNiks: "Today isn't a day for a round.",
    toekomstBeste: (tijd) => `Best golf window: ${tijd}.`,
    toekomstGeen: "No golf weather.",
    instWindVraag: "How much wind do you accept?",
    instWindKeuzes: ["I want calm conditions", "Average", "Wind is part of links golf"],
    instWarmVraag: "When does it get too warm?",
    instWarmKeuzes: ["Above 25 it gets heavy", "Average", "Heat doesn't bother me"],
    instDagStart: "Earliest tee time",
    instDagEind: "Latest tee time plus round",
    instUur: "h",
    instUitleg:
      "The check finds a window long enough for a round. Wind weighs heavier than in other outdoor sports: from about 25 km/h the course plays differently, from 40 it's survival. Rain means wet grips and that's game over; drizzle counts lightly.",
  },
});

export const GOLF_DEFAULTS = {
  maxWind: 32,
  maxGevoel: 28,
  dagStart: 8,
  dagEind: 20,
};

export function uurGolfScore(u, inst = GOLF_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.3 || (u.kans ?? 0) >= 75) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 12;
  let tempF;
  if (gevoel <= 16) {
    tempF = clamp(lerp(gevoel, -2, 10, 0.35, 1), 0.35, 1);
  } else {
    tempF = clamp(lerp(gevoel, 20, inst.maxGevoel + 6, 1, 0.4), 0.4, 1);
  }
  const wind = u.wind ?? 0;
  const windF = clamp(1 - Math.max(0, wind - inst.maxWind * 0.45) / (inst.maxWind * 0.95), 0.1, 1);
  const motregenF = (u.neerslag ?? 0) > 0.05 ? 0.8 : 1;
  return clamp(Math.round(96 * tempF * windF * motregenF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: GOLF_DEFAULTS,
  uurScore: uurGolfScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 3,
  extraFactoren: ({ uren }) => {
    const gemWind = uren.reduce((a, u) => a + (u.wind ?? 0), 0) / Math.max(uren.length, 1);
    if (gemWind >= 25) {
      return [{ punten: gemWind >= 38 ? 22 : 10, reden: T.redenWind(Math.round(gemWind)) }];
    }
    return [];
  },
});

export const golfen = {
  id: "golfen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#2F7D62",
  locatieHint: T.locatieHint,
  icoon: "golfvlag",
  categorieId: "sport",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: GOLF_DEFAULTS },
  instellingen: {
    defaults: GOLF_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "wind",
        vraag: T.instWindVraag,
        keuzes: [
          { label: T.instWindKeuzes[0], zet: { maxWind: 26 } },
          { label: T.instWindKeuzes[1], zet: { maxWind: 32 } },
          { label: T.instWindKeuzes[2], zet: { maxWind: 40 } },
        ],
      },
      {
        type: "keuze",
        id: "warmte",
        vraag: T.instWarmVraag,
        keuzes: [
          { label: T.instWarmKeuzes[0], zet: { maxGevoel: 25 } },
          { label: T.instWarmKeuzes[1], zet: { maxGevoel: 28 } },
          { label: T.instWarmKeuzes[2], zet: { maxGevoel: 32 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 6, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 16, max: 22 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
