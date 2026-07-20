/**
 * lib/tools/springkussen.js
 *
 * De springkussencheck (v3.33.0 "Autan"). Een luchtkussen in de tuin is
 * leuk tot de wind eronder komt: bij te veel wind waait een springkussen
 * los of om, en dat is een reeel veiligheidsrisico voor kinderen.
 * Fabrikanten en de veiligheidsrichtlijnen hanteren een windgrens rond
 * windkracht 5 (ongeveer 30 tot 38 km/u). De motor zoekt het rustigste,
 * droogste blok: wind (en vlagen) is de baas, en bij regen wordt het
 * kussen glad en zet je het niet op. Dit is weeradvies, geen vervanging
 * van deugdelijke verankering en toezicht.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "springkussen",
    naam: "Kan het springkussen buiten?",
    korteVraag: "Kan het springkussen buiten?",
    meldingKort: "Springkussencheck",
    cta: "Check het springkussenweer",
    navLabel: "Springkussen",
    diepte: "Het rustigste, droogste blok: te veel wind waait een luchtkussen los.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect springkussenweer", goed: "Prima om op te zetten", twijfelachtig: "Kan, houd de wind in de gaten", matig: "Te winderig", "zeer-slecht": "Niet opzetten" },
    adviesLabels: { goed: "veilig op te zetten", matig: "kan, let op de wind", slecht: "niet opzetten" },
    legenda: { links: "laat het opgerold", rechts: "springkussenweer" },
    redenNat: "regen: een nat springkussen is glad en dan zet je het niet op",
    redenGeenBlok: "geen rustig, droog blok vandaag",
    redenMatigBlok: (g, w) => `het rustigste blok is nog stevig (wind rond ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort rustig blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenWind: (w) => `te veel wind (rond ${w} km/u): een luchtkussen kan losraken`,
    redenStoten: (s) => `stevige windstoten (tot ${s} km/u): juist die tillen een kussen op`,
    metric: (uur) => `Rustigste moment voor het springkussen: rond ${uur}:00.`,
    statusNu: (tijd) => `Nu veilig op te zetten: het rustige blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Rustigste, droogste uren: ${tijd}.`,
    statusGeweest: "Het rustigste springkussenweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het te winderig of te nat voor het springkussen.",
    toekomstBeste: (tijd) => `Rustigste blok: ${tijd}.`,
    toekomstGeen: "Geen springkussenweer.",
    instGrootteVraag: "Wat voor springkussen is het?",
    instGrootteKeuzes: ["Klein (thuis, tuin)", "Middel", "Groot (feest, verhuur)"],
    instVerankerVraag: "Hoe goed is het verankerd?",
    instVerankerKeuzes: ["Losjes of onzeker", "Normaal met haringen", "Stevig verankerd of met zandzakken"],
    instDagStart: "Vroegste starttijd",
    instDagEind: "Laatste starttijd",
    instUur: "uur",
    instUitleg:
      "De check zoekt het rustigste en droogste blok van de dag. Wind is de belangrijkste factor: de veiligheidsgrens ligt rond windkracht 5 (ongeveer 30 tot 38 km/u), en windstoten zijn extra verraderlijk omdat die een kussen optillen. Een groot kussen vangt meer wind dan een klein tuinkussen, en goede verankering met haringen of zandzakken geeft wat meer marge. Bij regen wordt het kussen glad. Houd altijd toezicht en haal het kussen bij twijfel leeg; dit is weeradvies, geen garantie.",
  },
  en: {
    slug: "bouncy-castle",
    naam: "Can the bouncy castle go outside?",
    korteVraag: "Can the bouncy castle go outside?",
    meldingKort: "Bouncy castle check",
    cta: "Check the bouncy castle weather",
    navLabel: "Bouncy castle",
    diepte: "The calmest, driest window: too much wind lifts an inflatable loose.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect bouncy castle weather", goed: "Fine to set up", twijfelachtig: "Doable, watch the wind", matig: "Too windy", "zeer-slecht": "Don't set up" },
    adviesLabels: { goed: "safe to set up", matig: "doable, mind the wind", slecht: "don't set up" },
    legenda: { links: "keep it rolled up", rechts: "bouncy castle weather" },
    redenNat: "rain: a wet bouncy castle is slippery, so you won't set it up",
    redenGeenBlok: "no calm, dry window today",
    redenMatigBlok: (g, w) => `the calmest window is still stiff (wind around ${w} km/h)`,
    redenKortBlok: (u) => `only a short calm window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenWind: (w) => `too much wind (around ${w} km/h): an inflatable can come loose`,
    redenStoten: (s) => `strong gusts (up to ${s} km/h): those lift a castle up`,
    metric: (uur) => `Calmest moment for the bouncy castle: around ${uur}:00.`,
    statusNu: (tijd) => `Safe to set up now: the calm window runs until ${tijd}.`,
    statusBeste: (tijd) => `Calmest, driest hours: ${tijd}.`,
    statusGeweest: "The calmest bouncy castle weather has been and gone today.",
    statusNiks: "Today is too windy or too wet for the bouncy castle.",
    toekomstBeste: (tijd) => `Calmest window: ${tijd}.`,
    toekomstGeen: "No bouncy castle weather.",
    instGrootteVraag: "What kind of bouncy castle is it?",
    instGrootteKeuzes: ["Small (home, garden)", "Medium", "Large (party, rental)"],
    instVerankerVraag: "How well is it anchored?",
    instVerankerKeuzes: ["Loosely or unsure", "Normal with pegs", "Firmly anchored or with sandbags"],
    instDagStart: "Earliest start",
    instDagEind: "Latest start",
    instUur: "h",
    instUitleg:
      "The check finds the calmest and driest window of the day. Wind is the main factor: the safety limit is around force 5 (about 30 to 38 km/h), and gusts are extra treacherous because they lift a castle. A large castle catches more wind than a small garden one, and good anchoring with pegs or sandbags gives some margin. In the rain the castle gets slippery. Always supervise and deflate it if in doubt; this is weather advice, not a guarantee.",
  },
});

export const SPRINGKUSSEN_DEFAULTS = { maxWind: 32, windmarge: 1, dagStart: 10, dagEind: 18 };

export function uurSpringScore(u, inst = SPRINGKUSSEN_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.1 || (u.kans ?? 0) >= 55) return 0;
  const wind = u.wind ?? 0;
  const grens = (inst.maxWind ?? 32) * (inst.windmarge ?? 1);
  const windF = clamp(lerp(wind, grens - 16, grens, 1, 0), 0, 1);
  return clamp(Math.round(97 * windF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: SPRINGKUSSEN_DEFAULTS,
  uurScore: uurSpringScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 2,
  extraFactoren: ({ venster }) => {
    if (!venster) return [];
    const maxStoten = Math.round(Math.max(...venster.blok.map((u) => u.stoten ?? u.wind ?? 0)));
    return maxStoten >= 45 ? [{ punten: 16, reden: T.redenStoten(maxStoten) }] : [];
  },
});

export const springkussen = {
  id: "springkussen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#C24E3F",
  locatieHint: T.locatieHint,
  icoon: "springkussen",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: SPRINGKUSSEN_DEFAULTS },
  instellingen: {
    defaults: SPRINGKUSSEN_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "grootte",
        vraag: T.instGrootteVraag,
        keuzes: [
          { label: T.instGrootteKeuzes[0], zet: { maxWind: 38 } },
          { label: T.instGrootteKeuzes[1], zet: { maxWind: 32 } },
          { label: T.instGrootteKeuzes[2], zet: { maxWind: 26 } },
        ],
      },
      {
        type: "keuze",
        id: "verankering",
        vraag: T.instVerankerVraag,
        keuzes: [
          { label: T.instVerankerKeuzes[0], zet: { windmarge: 0.85 } },
          { label: T.instVerankerKeuzes[1], zet: { windmarge: 1 } },
          { label: T.instVerankerKeuzes[2], zet: { windmarge: 1.15 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 8, max: 13 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 14, max: 20 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-19",
  affiliate: {
    kop: { nl: "Veilig springplezier", en: "Safe bouncing fun" },
    advies: {
      nl: "Zet een springkussen altijd goed vast: extra lange grondharingen of zandzakken op de lussen maken het verschil bij een windvlaag. Een goede blower en een grondzeil eronder verlengen de levensduur. Haal het kussen leeg zodra de wind aantrekt.",
      en: "Always anchor a bouncy castle well: extra-long ground pegs or sandbags on the loops make the difference in a gust. A good blower and a ground sheet extend its life. Deflate it as soon as the wind picks up.",
    },
    items: [
      { label: { nl: "Grondharingen en verankering", en: "Ground pegs and anchoring" }, url: "https://www.bol.com/nl/nl/s/?searchtext=grondharingen", partner: "bol.com" },
    ],
  },
};
