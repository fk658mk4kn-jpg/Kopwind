/**
 * lib/tools/wielrennen.js
 *
 * De wielrencheck (v3.25.0 "Pampero", besluit Martijn: eigen tool, geen
 * preset op de fietscheck). Andere intentie dan fietsen-naar-werk: een
 * forens MOET en wil weten hoe erg het wordt per rijrichting; een
 * wielrenner KIEST zijn moment en wil het beste trainingsblok van de
 * dag. Daarom een locatie-check op de gedeelde venstermotor, geen
 * routeplanner.
 *
 * Scorekarakter, anders gewogen dan wandelen of hardlopen:
 * - Nat is de hardste straf: nat wegdek betekent slechte remmen en
 *   valrisico op dunne banden, dus elke echte neerslag nult het uur en
 *   ook net-gestopte motregen drukt zwaar.
 * - Wind telt zwaarder dan bij elke andere buitencheck: op de racefiets
 *   is wind de hoofdvijand (geen beschutting, hoge snelheid).
 *   Windstoten boven de 45 km/u zijn een eigen minpunt (stuurgedrag).
 * - Kou is juist milder: met goede kleding rijdt 6 graden prima; pas
 *   rond het vriespunt (gladde plekken, handen) zakt het hard.
 * Drempels zijn beredeneerd, niet tegen echt weer gevalideerd; zelfde
 * kanttekening als batch 3 (zie BACKLOG).
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "wielrenweer",
    naam: "Is het wielrenweer vandaag?",
    korteVraag: "Is het wielrenweer vandaag?",
    meldingKort: "Wielrencheck",
    cta: "Check de rit",
    navLabel: "Wielrennen",
    diepte: "Het beste blok voor een rit op de racefiets: droog wegdek, hanteerbare wind.",
    locatieHint: "Zoek je stad of vertrekpunt...",
    schaalLabels: { ideaal: "Perfect rijweer", goed: "Goed rijweer", twijfelachtig: "Kan, met de juiste kleding", matig: "Gure rit", "zeer-slecht": "Geen rijweer" },
    adviesLabels: { goed: "rijweer", matig: "pittige rit", slecht: "geen rijweer" },
    legenda: { links: "rollenbank", rechts: "naar buiten" },
    redenNat: "nat wegdek (remmen en grip op dunne banden)",
    redenGeenBlok: "geen bruikbaar rijblok (regen of harde wind zit dwars)",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur), krap voor een echte rit`,
    redenBuien: "buien rond het beste blok",
    redenWind: (w) => `stevige wind (${w} km/u): veel vermogen kwijt, weinig plezier`,
    redenWarm: (g) => `heet voor een lange rit (gevoel tot ${g} graden): drink ruim`,
    redenKoud: (g) => `koud aan de handen en het gezicht (gevoel ${g} graden)`,
    redenStoten: (s) => `windstoten tot ${s} km/u: onrustig sturen`,
    metric: (uur, g) => `Beste vertrek rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu goed rijweer: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste rijblok: ${tijd}.`,
    statusGeweest: "Het beste rijweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het geen dag voor de racefiets.",
    toekomstBeste: (tijd) => `Beste rijblok: ${tijd}.`,
    toekomstGeen: "Geen rijweer.",
    instWindVraag: "Hoeveel wind accepteer je?",
    instWindKeuzes: ["Ik mijd wind", "Gemiddeld", "Wind hoort erbij"],
    instKouVraag: "Vanaf welke kou sla je over?",
    instKouKeuzes: ["Onder de 8 graden pas ik", "Rond de 5 graden", "Vorst houdt me pas binnen"],
    instWarmVraag: "Wanneer wordt het jou te heet?",
    instWarmKeuzes: ["Boven de 26 wordt het zwaar", "Gemiddeld", "Hitte deert me niet"],
    instDagStart: "Vroegste vertrektijd",
    instDagEind: "Laatste terugkomsttijd",
    instUur: "uur",
    instUitleg:
      "De wielrencheck zoekt het beste droge blok met hanteerbare wind. Nat wegdek weegt het zwaarst (remmen, dunne banden), daarna wind; kou is met goede kleding prima tot een graad of vijf. Stel je eigen wind-, kou- en warmtegrens in, plus je rijvenster.",
  },
  en: {
    slug: "road-cycling-weather",
    naam: "Good day for a road ride?",
    korteVraag: "Good day for a road ride?",
    meldingKort: "Road ride check",
    cta: "Check the ride",
    navLabel: "Road cycling",
    diepte: "The best window for a road ride: dry tarmac, manageable wind.",
    locatieHint: "Search your town or start point...",
    schaalLabels: { ideaal: "Perfect riding weather", goed: "Good riding weather", twijfelachtig: "Doable with the right kit", matig: "A grim ride", "zeer-slecht": "No riding weather" },
    adviesLabels: { goed: "riding weather", matig: "a tough ride", slecht: "no riding weather" },
    legenda: { links: "indoor trainer", rechts: "head out" },
    redenNat: "wet tarmac (braking and grip on thin tyres)",
    redenGeenBlok: "no usable riding window (rain or hard wind gets in the way)",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short window (${u} hours), tight for a proper ride`,
    redenBuien: "showers around the best window",
    redenWind: (w) => `strong wind (${w} km/h): lots of watts, little joy`,
    redenWarm: (g) => `hot for a long ride (feels like up to ${g} degrees): drink plenty`,
    redenKoud: (g) => `cold on the hands and face (feels like ${g} degrees)`,
    redenStoten: (s) => `gusts up to ${s} km/h: twitchy handling`,
    metric: (uur, g) => `Best start around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good riding weather right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best riding window: ${tijd}.`,
    statusGeweest: "The best riding weather has been and gone today.",
    statusNiks: "Today isn't a day for the road bike.",
    toekomstBeste: (tijd) => `Best riding window: ${tijd}.`,
    toekomstGeen: "No riding weather.",
    instWindVraag: "How much wind will you accept?",
    instWindKeuzes: ["I avoid wind", "Average", "Wind comes with it"],
    instKouVraag: "Below what temperature do you skip?",
    instKouKeuzes: ["Below 8 degrees I pass", "Around 5 degrees", "Only frost keeps me in"],
    instWarmVraag: "When does it get too hot for you?",
    instWarmKeuzes: ["Above 26 it gets heavy", "Average", "Heat doesn't bother me"],
    instDagStart: "Earliest start time",
    instDagEind: "Latest return time",
    instUur: "h",
    instUitleg:
      "The road ride check finds the best dry window with manageable wind. Wet tarmac weighs heaviest (braking, thin tyres), then wind; cold is fine down to around five degrees with proper kit. Set your own wind, cold and heat limits, plus your riding window.",
  },
});

export const WIELREN_DEFAULTS = {
  maxWind: 32,
  minGevoel: 5,
  maxGevoel: 28,
  dagStart: 8,
  dagEind: 21,
};

export function uurWielrenScore(u, inst = WIELREN_DEFAULTS) {
  // Nat is de hardste straf: echte neerslag of hoge kans nult het uur.
  if ((u.neerslag ?? 0) > 0.1 || (u.kans ?? 0) >= 70) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 12;
  // Temperatuur: breed optimum 10-24; onder minGevoel zakt het hard
  // (handen, gezicht, gladde plekken), boven maxGevoel geleidelijk.
  let tempF;
  if (gevoel <= 10) {
    tempF = clamp(lerp(gevoel, inst.minGevoel - 6, 10, 0.2, 1), 0.2, 1);
  } else {
    tempF = clamp(lerp(gevoel, 24, inst.maxGevoel + 6, 1, 0.35), 0.35, 1);
  }
  // Wind: de hoofdvijand. Vanaf 40 procent van de eigen grens begint de
  // aftrek, steiler dan bij wandelen of hardlopen.
  const wind = u.wind ?? 0;
  const windF = clamp(1 - Math.max(0, wind - inst.maxWind * 0.4) / (inst.maxWind * 0.9), 0.2, 1);
  // Motregen: op de racefiets al vervelend (bril, remmen), stevige factor.
  const motregenF = (u.neerslag ?? 0) > 0.03 ? 0.7 : 1;
  return clamp(Math.round(95 * tempF * windF * motregenF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: WIELREN_DEFAULTS,
  uurScore: uurWielrenScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  // Een echte rit vraagt ruimte: blokken van een uur tellen wel mee,
  // maar redenKortBlok benoemt de krapte.
  minVensterUren: 1,
  extraFactoren: ({ uren, inst }) => {
    const uit = [];
    const minGevoel = Math.min(...uren.map((u) => u.gevoel ?? 99));
    if (minGevoel < inst.minGevoel) {
      uit.push({ punten: 10, reden: T.redenKoud(Math.round(minGevoel)) });
    }
    const maxGevoel = Math.max(...uren.map((u) => u.gevoel ?? -99));
    if (maxGevoel > inst.maxGevoel) {
      uit.push({ punten: 8, reden: T.redenWarm(Math.round(maxGevoel)) });
    }
    const maxStoten = Math.max(...uren.map((u) => u.stoten ?? 0));
    if (maxStoten > 45) {
      uit.push({ punten: 10, reden: T.redenStoten(Math.round(maxStoten)) });
    }
    return uit;
  },
});

export const wielrennen = {
  id: "wielrennen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#2F7D62",
  locatieHint: T.locatieHint,
  icoon: "racefiets",
  categorieId: "sport",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: WIELREN_DEFAULTS },
  instellingen: {
    defaults: WIELREN_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "wind",
        vraag: T.instWindVraag,
        keuzes: [
          { label: T.instWindKeuzes[0], zet: { maxWind: 26 } },
          { label: T.instWindKeuzes[1], zet: { maxWind: 32 } },
          { label: T.instWindKeuzes[2], zet: { maxWind: 38 } },
        ],
      },
      {
        type: "keuze",
        id: "kou",
        vraag: T.instKouVraag,
        keuzes: [
          { label: T.instKouKeuzes[0], zet: { minGevoel: 8 } },
          { label: T.instKouKeuzes[1], zet: { minGevoel: 5 } },
          { label: T.instKouKeuzes[2], zet: { minGevoel: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "warmte",
        vraag: T.instWarmVraag,
        keuzes: [
          { label: T.instWarmKeuzes[0], zet: { maxGevoel: 26 } },
          { label: T.instWarmKeuzes[1], zet: { maxGevoel: 28 } },
          { label: T.instWarmKeuzes[2], zet: { maxGevoel: 31 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 6, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 16, max: 23 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-17",
  affiliate: null,
};
