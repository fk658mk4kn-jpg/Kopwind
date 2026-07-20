/**
 * lib/tools/dak-op.js
 *
 * De dakcheck (v3.31.0 "Sirocco"). Anders dan de meeste checks gaat deze
 * over veiligheid, niet over comfort: op hoogte werken bij wind of op een
 * nat of glad dak is gevaarlijk. De motor zoekt het rustigste, droogste
 * blok van de dag. Wind (en vlagen) is de belangrijkste factor, een nat
 * dak is een harde nee (glad), en vorst maakt de boel glad. Hoe hoger en
 * steiler het dak, hoe strenger de windgrens. Dit vervangt geen
 * veiligheidsmateriaal of gezond verstand.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "dak-op",
    naam: "Kan ik veilig het dak op?",
    korteVraag: "Kan ik veilig het dak op?",
    meldingKort: "Dakcheck",
    cta: "Check het dakweer",
    navLabel: "Het dak op",
    diepte: "Het rustigste, droogste blok: wind is de baas, een nat of bevroren dak is glad.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Veilig het dak op", goed: "Prima om te klimmen", twijfelachtig: "Kan, blijf voorzichtig", matig: "Liever niet", "zeer-slecht": "Blijf van het dak" },
    adviesLabels: { goed: "veilig genoeg", matig: "kan, wees voorzichtig", slecht: "blijf van het dak" },
    legenda: { links: "blijf beneden", rechts: "veilig het dak op" },
    redenNat: "een nat dak is glad: te gevaarlijk om op te klimmen",
    redenGeenBlok: "geen rustig, droog blok vandaag",
    redenMatigBlok: (g, w) => `het rustigste blok is nog stevig (wind rond ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort rustig blok (${u} uur)`,
    redenBuien: "buien rond het beste blok, dus een glad dak",
    redenWind: (w) => `veel wind (rond ${w} km/u): riskant op hoogte`,
    redenStoten: (s) => `stevige windstoten (tot ${s} km/u): die duwen je uit balans`,
    redenIjs: "kans op vorst of ijzel: een glad dak",
    metric: (uur) => `Rustigste moment om het dak op te gaan: rond ${uur}:00.`,
    statusNu: (tijd) => `Nu relatief veilig op het dak: het rustige blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Rustigste, droogste dakuren: ${tijd}.`,
    statusGeweest: "Het rustigste dakweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het te ruig of te nat om het dak op te gaan.",
    toekomstBeste: (tijd) => `Rustigste dakblok: ${tijd}.`,
    toekomstGeen: "Geen veilig dakweer.",
    instHoogteVraag: "Wat voor dak is het?",
    instHoogteKeuzes: ["Laag (schuur, aanbouw)", "Woonhuis", "Hoog of steil dak"],
    instZekerVraag: "Hoe zeker sta je op hoogte?",
    instZekerKeuzes: ["Voorzichtig", "Normaal", "Ervaren, geen last van hoogte"],
    instDagStart: "Vroegste starttijd",
    instDagEind: "Laatste starttijd",
    instUur: "uur",
    instUitleg:
      "De check zoekt het rustigste en droogste blok van de dag. Wind is de belangrijkste factor: op een hoog of steil dak ligt de grens lager dan op een lage schuur. Een nat dak is glad en dus een harde nee, en bij vorst of ijzel is het oppervlak glad. Werk alleen bij daglicht, gebruik goede beveiliging en ga nooit alleen het dak op. Dit is weeradvies, geen vervanging van veiligheidsmaatregelen.",
  },
  en: {
    slug: "onto-the-roof",
    naam: "Is it safe to go on the roof?",
    korteVraag: "Is it safe to go on the roof?",
    meldingKort: "Roof check",
    cta: "Check the roof weather",
    navLabel: "On the roof",
    diepte: "The calmest, driest window: wind rules, a wet or frozen roof is slippery.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Safe to go up", goed: "Fine to climb", twijfelachtig: "Doable, stay careful", matig: "Better not", "zeer-slecht": "Stay off the roof" },
    adviesLabels: { goed: "safe enough", matig: "doable, be careful", slecht: "stay off the roof" },
    legenda: { links: "stay down", rechts: "safe to go up" },
    redenNat: "a wet roof is slippery: too dangerous to climb",
    redenGeenBlok: "no calm, dry window today",
    redenMatigBlok: (g, w) => `the calmest window is still stiff (wind around ${w} km/h)`,
    redenKortBlok: (u) => `only a short calm window (${u} hours)`,
    redenBuien: "showers around the best window, so a slippery roof",
    redenWind: (w) => `lots of wind (around ${w} km/h): risky at height`,
    redenStoten: (s) => `strong gusts (up to ${s} km/h): they push you off balance`,
    redenIjs: "chance of frost or ice: a slippery roof",
    metric: (uur) => `Calmest moment to go on the roof: around ${uur}:00.`,
    statusNu: (tijd) => `Relatively safe on the roof now: the calm window runs until ${tijd}.`,
    statusBeste: (tijd) => `Calmest, driest roof hours: ${tijd}.`,
    statusGeweest: "The calmest roof weather has been and gone today.",
    statusNiks: "Today is too rough or too wet to go on the roof.",
    toekomstBeste: (tijd) => `Calmest roof window: ${tijd}.`,
    toekomstGeen: "No safe roof weather.",
    instHoogteVraag: "What kind of roof is it?",
    instHoogteKeuzes: ["Low (shed, extension)", "House", "High or steep roof"],
    instZekerVraag: "How steady are you at height?",
    instZekerKeuzes: ["Careful", "Normal", "Experienced, fine with heights"],
    instDagStart: "Earliest start",
    instDagEind: "Latest start",
    instUur: "h",
    instUitleg:
      "The check finds the calmest and driest window of the day. Wind is the main factor: on a high or steep roof the limit is lower than on a low shed. A wet roof is slippery and thus a hard no, and with frost or ice the surface is slippery. Only work in daylight, use proper protection and never go on the roof alone. This is weather advice, not a substitute for safety measures.",
  },
});

export const DAK_DEFAULTS = { maxWind: 30, windmarge: 1, dagStart: 8, dagEind: 18 };

export function uurDakScore(u, inst = DAK_DEFAULTS) {
  // Nat dak: glad en gevaarlijk.
  if ((u.neerslag ?? 0) > 0.1 || (u.kans ?? 0) >= 55) return 0;
  const wind = u.wind ?? 0;
  const grens = (inst.maxWind ?? 30) * (inst.windmarge ?? 1);
  const windF = clamp(lerp(wind, grens - 16, grens, 1, 0), 0, 1);
  let ijsF = 1;
  if ((u.temp ?? 10) < 1 && ((u.rh ?? 0) > 85 || (u.neerslag ?? 0) > 0)) ijsF = 0.35;
  return clamp(Math.round(97 * windF * ijsF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: DAK_DEFAULTS,
  uurScore: uurDakScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 2,
  extraFactoren: ({ venster }) => {
    if (!venster) return [];
    const uit = [];
    const maxStoten = Math.round(Math.max(...venster.blok.map((u) => u.stoten ?? u.wind ?? 0)));
    const grensStoten = 45;
    if (maxStoten >= grensStoten) {
      uit.push({ punten: 14, reden: T.redenStoten(maxStoten) });
    }
    const vorst = venster.blok.some((u) => (u.temp ?? 10) < 1 && ((u.rh ?? 0) > 85 || (u.neerslag ?? 0) > 0));
    if (vorst) uit.push({ punten: 12, reden: T.redenIjs });
    return uit;
  },
});

export const dakOp = {
  id: "dak-op",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#8C6239",
  locatieHint: T.locatieHint,
  icoon: "ladder",
  categorieId: "huis-tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: DAK_DEFAULTS },
  instellingen: {
    defaults: DAK_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "hoogte",
        vraag: T.instHoogteVraag,
        keuzes: [
          { label: T.instHoogteKeuzes[0], zet: { maxWind: 38 } },
          { label: T.instHoogteKeuzes[1], zet: { maxWind: 30 } },
          { label: T.instHoogteKeuzes[2], zet: { maxWind: 24 } },
        ],
      },
      {
        type: "keuze",
        id: "zeker",
        vraag: T.instZekerVraag,
        keuzes: [
          { label: T.instZekerKeuzes[0], zet: { windmarge: 0.85 } },
          { label: T.instZekerKeuzes[1], zet: { windmarge: 1 } },
          { label: T.instZekerKeuzes[2], zet: { windmarge: 1.15 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 7, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 14, max: 20 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-19",
  affiliate: {
    kop: { nl: "Veilig op hoogte", en: "Safe at height" },
    advies: {
      nl: "Ga nooit onbeveiligd het dak op: een stabiele ladder met ladderhaken of een dakladder en, bij echt werk, een dakveiligheidsset met harnas en lijn maken het verschil. Werk bij daglicht en het liefst met iemand erbij.",
      en: "Never go on the roof unsecured: a stable ladder with hooks or a roof ladder and, for real work, a safety set with harness and line make the difference. Work in daylight and ideally with someone around.",
    },
    items: [
      { label: { nl: "Ladders en dakbeveiliging", en: "Ladders and roof safety" }, url: "https://www.bol.com/nl/nl/s/?searchtext=ladder", partner: "bol.com" },
    ],
  },
};
