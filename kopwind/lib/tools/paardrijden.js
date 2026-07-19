/**
 * lib/tools/paardrijden.js
 *
 * De paardrijcheck (v3.29.0 "Ghibli"). Paarden zijn koukleumen noch
 * hittebestendig: het comfortvenster ligt tussen ruwweg 2 en 22
 * graden, daarboven wordt zwaar werk voor het paard onprettig. De
 * echte spelbreker is wind: harde wind en vooral vlagen maken paarden
 * schrikkerig (wapperende zeilen, vliegend blad), en dat weegt op een
 * nuchter paard anders dan op een gevoelige. Vorst betekent een harde
 * of gladde bodem in de buitenbak en op de wegen: dan gaat het oordeel
 * hard omlaag.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "paardrijden",
    naam: "Kan ik vandaag buiten paardrijden?",
    korteVraag: "Kan ik vandaag buiten rijden?",
    meldingKort: "Paardrijcheck",
    cta: "Check de rit",
    navLabel: "Paardrijden",
    diepte: "Wind maakt paarden schrikkerig en vorst de bodem hard: het beste rijblok.",
    locatieHint: "Zoek je stad of de manege, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect rijweer", goed: "Prima rijweer", twijfelachtig: "Kan, blijf alert", matig: "Onrustig rijweer", "zeer-slecht": "Geen buitenrijweer" },
    adviesLabels: { goed: "rijweer", matig: "kan, blijf alert", slecht: "geen buitenrijweer" },
    legenda: { links: "binnen rijden", rechts: "buitenrijweer" },
    redenNat: "flinke regen: gladde bodem en een chagrijnig paard",
    redenGeenBlok: "geen rustig droog rijblok",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort goed blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenSchrik: (s) => `windstoten tot ${s} km/u: wapperend zeil en vliegend blad maken paarden schrikkerig`,
    redenBodem: "vorst: harde of gladde bodem in de buitenbak en op de wegen",
    redenWarm: (g) => `warm voor zwaar werk (gevoel tot ${g} graden): houd de training licht`,
    metric: (uur, g) => `Beste rijuur rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima rijweer: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste rijuren: ${tijd}.`,
    statusGeweest: "Het beste rijweer is voor vandaag geweest.",
    statusNiks: "Vandaag kun je beter binnen rijden.",
    toekomstBeste: (tijd) => `Beste rijblok: ${tijd}.`,
    toekomstGeen: "Geen buitenrijweer.",
    instWaarVraag: "Waar rij je meestal buiten?",
    instWaarKeuzes: ["Beschutte buitenbak", "Bos en binnenwegen", "Open polder of strand"],
    instPaardVraag: "Hoe reageert je paard op wind?",
    instPaardKeuzes: ["Schrikkerig", "Gemiddeld", "Nuchter, kijkt nergens van op"],
    instDagStart: "Vroegste rijtijd",
    instDagEind: "Laatste rijtijd",
    instUur: "uur",
    instUitleg:
      "De check zoekt het rustigste blok. Wind weegt het zwaarst: niet de gemiddelde wind maar de vlagen, want daar schrikken paarden van. Op open terrein en met een gevoelig paard liggen de grenzen lager. Vorst betekent een harde of gladde bodem en drukt het oordeel hard; warm weer boven de 22 graden maakt vooral zwaar werk onprettig.",
  },
  en: {
    slug: "horse-riding",
    naam: "Can I ride outside today?",
    korteVraag: "Can I ride outside today?",
    meldingKort: "Riding check",
    cta: "Check the ride",
    navLabel: "Horse riding",
    diepte: "Wind spooks horses and frost hardens footing: the best riding window.",
    locatieHint: "Search your town or the stables...",
    schaalLabels: { ideaal: "Perfect riding weather", goed: "Good riding weather", twijfelachtig: "Doable, stay alert", matig: "Restless riding weather", "zeer-slecht": "No outdoor riding weather" },
    adviesLabels: { goed: "riding weather", matig: "doable, stay alert", slecht: "no outdoor riding" },
    legenda: { links: "ride indoors", rechts: "outdoor riding weather" },
    redenNat: "proper rain: slippery footing and a grumpy horse",
    redenGeenBlok: "no calm dry riding window",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short good window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenSchrik: (s) => `gusts up to ${s} km/h: flapping tarps and flying leaves spook horses`,
    redenBodem: "frost: hard or slippery footing in the arena and on the roads",
    redenWarm: (g) => `warm for heavy work (feels like up to ${g} degrees): keep the training light`,
    metric: (uur, g) => `Best riding hour around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good riding weather right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best riding hours: ${tijd}.`,
    statusGeweest: "The best riding weather has been and gone today.",
    statusNiks: "Better to ride indoors today.",
    toekomstBeste: (tijd) => `Best riding window: ${tijd}.`,
    toekomstGeen: "No outdoor riding weather.",
    instWaarVraag: "Where do you usually ride outside?",
    instWaarKeuzes: ["Sheltered outdoor arena", "Woods and lanes", "Open polder or beach"],
    instPaardVraag: "How does your horse react to wind?",
    instPaardKeuzes: ["Spooky", "Average", "Steady, nothing fazes it"],
    instDagStart: "Earliest riding time",
    instDagEind: "Latest riding time",
    instUur: "h",
    instUitleg:
      "The check finds the calmest window. Wind weighs heaviest: not the average but the gusts, because that's what spooks horses. On open ground and with a sensitive horse the limits sit lower. Frost means hard or slippery footing and pushes the verdict down hard; heat above 22 degrees mainly makes heavy work unpleasant.",
  },
});

export const PAARD_DEFAULTS = {
  maxWind: 30,
  schrik: 0,
  dagStart: 8,
  dagEind: 21,
};

export function uurPaardScore(u, inst = PAARD_DEFAULTS) {
  const n = u.neerslag ?? 0;
  if (n > 1.2 || (u.kans ?? 0) >= 80) return 5;
  const regenF = n > 0.3 ? 0.55 : n > 0.05 ? 0.85 : 1;
  const gevoel = u.gevoel ?? u.temp ?? 10;
  let tempF;
  if (gevoel <= 12) {
    tempF = clamp(lerp(gevoel, -4, 6, 0.4, 1), 0.4, 1);
  } else {
    tempF = clamp(lerp(gevoel, 20, 30, 1, 0.4), 0.4, 1);
  }
  const schrikFactor = inst.schrik === 1 ? 0.8 : inst.schrik === -1 ? 1.15 : 1;
  const grens = inst.maxWind * schrikFactor;
  const windF = clamp(1 - Math.max(0, (u.wind ?? 0) - grens * 0.55) / grens, 0.15, 1);
  return clamp(Math.round(95 * tempF * windF * regenF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: PAARD_DEFAULTS,
  uurScore: uurPaardScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 1,
  extraFactoren: ({ uren, venster, inst }) => {
    const uit = [];
    const minTemp = Math.min(...uren.map((u) => u.temp ?? 99));
    if (minTemp <= 0) {
      uit.push({ punten: 30, reden: T.redenBodem });
    }
    if (venster) {
      const piekStoten = Math.round(Math.max(...venster.blok.map((u) => u.stoten ?? 0)));
      const schrikGrens = inst.schrik === 1 ? 42 : inst.schrik === -1 ? 58 : 50;
      if (piekStoten >= schrikGrens) {
        uit.push({ punten: 16, reden: T.redenSchrik(piekStoten) });
      }
      const maxGevoel = Math.max(...venster.blok.map((u) => u.gevoel ?? u.temp ?? 0));
      if (maxGevoel >= 25) {
        uit.push({ punten: 8, reden: T.redenWarm(Math.round(maxGevoel)) });
      }
    }
    return uit;
  },
});

export const paardrijden = {
  id: "paardrijden",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#C24E3F",
  locatieHint: T.locatieHint,
  icoon: "paard",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: PAARD_DEFAULTS },
  instellingen: {
    defaults: PAARD_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "waar",
        vraag: T.instWaarVraag,
        keuzes: [
          { label: T.instWaarKeuzes[0], zet: { maxWind: 34 } },
          { label: T.instWaarKeuzes[1], zet: { maxWind: 30 } },
          { label: T.instWaarKeuzes[2], zet: { maxWind: 25 } },
        ],
      },
      {
        type: "keuze",
        id: "schrik",
        vraag: T.instPaardVraag,
        keuzes: [
          { label: T.instPaardKeuzes[0], zet: { schrik: 1 } },
          { label: T.instPaardKeuzes[1], zet: { schrik: 0 } },
          { label: T.instPaardKeuzes[2], zet: { schrik: -1 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 6, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 16, max: 23 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
