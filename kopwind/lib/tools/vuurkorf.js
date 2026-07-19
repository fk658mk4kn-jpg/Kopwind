/**
 * lib/tools/vuurkorf.js
 *
 * De vuurkorfcheck (v3.29.0 "Ghibli"). Een avondtool met een dubbele
 * windgrens: te veel wind jaagt vonken over de schutting, maar
 * windstil is ook niet ideaal, want dan blijft de rook laag hangen en
 * krijgen de buren hem op het terras. Regen is einde verhaal, en op
 * zwoele avonden is de behoefte klein maar het kan prima. De motor
 * kijkt standaard alleen naar de avonduren.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "vuurkorf",
    naam: "Kan de vuurkorf aan vanavond?",
    korteVraag: "Kan de vuurkorf aan vanavond?",
    meldingKort: "Vuurkorfcheck",
    cta: "Check de avond",
    navLabel: "Vuurkorf",
    diepte: "Twee windgrenzen: te veel jaagt vonken, windstil houdt de rook laag.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfecte vuurkorfavond", goed: "Prima vuurkorfavond", twijfelachtig: "Kan, let op de rook", matig: "Onrustige avond", "zeer-slecht": "Laat de korf koud" },
    adviesLabels: { goed: "vuurkorfavond", matig: "kan, let op de rook", slecht: "geen vuurkorfavond" },
    legenda: { links: "korf blijft koud", rechts: "vuurkorfavond" },
    redenNat: "regen: nat hout en een sissende korf",
    redenGeenBlok: "geen rustig droog avondblok",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort goed blok (${u} uur)`,
    redenBuien: "buien rond de avond",
    redenVonken: (s) => `windstoten tot ${s} km/u: vonken waaien verder dan je denkt`,
    redenRook: "vrijwel windstil: de rook blijft laag hangen, houd rekening met de buren",
    metric: (uur, g) => `Beste aansteekmoment rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu een prima moment: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste vuurkorfuren: ${tijd}.`,
    statusGeweest: "Het beste moment van de avond is geweest.",
    statusNiks: "Vanavond is het geen weer voor de vuurkorf.",
    toekomstBeste: (tijd) => `Beste vuurkorfblok: ${tijd}.`,
    toekomstGeen: "Geen vuurkorfavond.",
    instBurenVraag: "Hoe dichtbij zitten de buren?",
    instBurenKeuzes: ["Rijtjeshuis, tuinen grenzen aan elkaar", "Wat ruimer opgezet", "Vrijstaand of buitenaf"],
    instZitVraag: "Hoe beschut is je zithoek?",
    instZitKeuzes: ["Beschut (schutting, muur)", "Half open", "Open tuin"],
    instDagStart: "Vroegste aansteektijd",
    instDagEind: "Hoe laat dooft het vuur?",
    instUur: "uur",
    instUitleg:
      "De check kijkt naar de avonduren en zoekt de balans tussen twee windgrenzen: boven de 25 km/u waaien vonken te ver, maar bij bijna windstil weer blijft de rook laag hangen en zitten de buren erin. Met dichtbije buren telt die windstille avond zwaarder mee. Regen betekent nat hout en einde verhaal.",
  },
  en: {
    slug: "fire-pit",
    naam: "Can the fire pit go on tonight?",
    korteVraag: "Fire pit on tonight?",
    meldingKort: "Fire pit check",
    cta: "Check the evening",
    navLabel: "Fire pit",
    diepte: "Two wind limits: too much throws sparks, dead calm keeps smoke low.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect fire pit evening", goed: "Good fire pit evening", twijfelachtig: "Doable, mind the smoke", matig: "A restless evening", "zeer-slecht": "Leave the pit cold" },
    adviesLabels: { goed: "fire pit evening", matig: "doable, mind the smoke", slecht: "no fire pit evening" },
    legenda: { links: "pit stays cold", rechts: "fire pit evening" },
    redenNat: "rain: wet wood and a hissing pit",
    redenGeenBlok: "no calm dry evening window",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short good window (${u} hours)`,
    redenBuien: "showers around the evening",
    redenVonken: (s) => `gusts up to ${s} km/h: sparks travel further than you think`,
    redenRook: "nearly dead calm: smoke hangs low, mind the neighbours",
    metric: (uur, g) => `Best lighting moment around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `A good moment right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best fire pit hours: ${tijd}.`,
    statusGeweest: "The best moment of the evening has passed.",
    statusNiks: "No fire pit weather tonight.",
    toekomstBeste: (tijd) => `Best fire pit window: ${tijd}.`,
    toekomstGeen: "No fire pit evening.",
    instBurenVraag: "How close are the neighbours?",
    instBurenKeuzes: ["Terraced, gardens back to back", "A bit more spacious", "Detached or rural"],
    instZitVraag: "How sheltered is your seating?",
    instZitKeuzes: ["Sheltered (fence, wall)", "Half open", "Open garden"],
    instDagStart: "Earliest lighting time",
    instDagEind: "When does the fire die?",
    instUur: "h",
    instUitleg:
      "The check looks at the evening hours and balances two wind limits: above 25 km/h sparks fly too far, but near dead calm the smoke hangs low and drifts into the neighbours. With close neighbours that calm evening counts heavier. Rain means wet wood and game over.",
  },
});

export const VUURKORF_DEFAULTS = {
  buren: 0,
  maxWind: 25,
  dagStart: 18,
  dagEind: 24,
};

export function uurVuurkorfScore(u, inst = VUURKORF_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.1 || (u.kans ?? 0) >= 70) return 0;
  const wind = u.wind ?? 0;
  let windF;
  if (wind < 5) {
    // Rook blijft hangen; met dichtbije buren is dat echt een minpunt.
    windF = inst.buren === 0 ? 0.6 : 0.8;
  } else if (wind <= inst.maxWind * 0.7) {
    windF = 1;
  } else {
    windF = clamp(lerp(wind, inst.maxWind * 0.7, inst.maxWind + 12, 1, 0.1), 0.1, 1);
  }
  const gevoel = u.gevoel ?? u.temp ?? 12;
  const tempF = gevoel < -2 ? 0.6 : gevoel > 24 ? 0.85 : 1;
  return clamp(Math.round(95 * windF * tempF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: VUURKORF_DEFAULTS,
  uurScore: uurVuurkorfScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 1,
  extraFactoren: ({ uren, venster, inst }) => {
    if (!venster) return [];
    const uit = [];
    const piekStoten = Math.round(Math.max(...venster.blok.map((u) => u.stoten ?? 0)));
    if (piekStoten >= 45) {
      uit.push({ punten: piekStoten >= 60 ? 28 : 14, reden: T.redenVonken(piekStoten) });
    }
    const gemWind = venster.blok.reduce((a, u) => a + (u.wind ?? 0), 0) / venster.uren;
    if (gemWind < 5 && inst.buren === 0) {
      uit.push({ punten: 10, reden: T.redenRook });
    }
    return uit;
  },
});

export const vuurkorf = {
  id: "vuurkorf",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#C24E3F",
  locatieHint: T.locatieHint,
  icoon: "vuurkorfje",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: VUURKORF_DEFAULTS },
  instellingen: {
    defaults: VUURKORF_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "buren",
        vraag: T.instBurenVraag,
        keuzes: [
          { label: T.instBurenKeuzes[0], zet: { buren: 0 } },
          { label: T.instBurenKeuzes[1], zet: { buren: 1 } },
          { label: T.instBurenKeuzes[2], zet: { buren: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "zithoek",
        vraag: T.instZitVraag,
        keuzes: [
          { label: T.instZitKeuzes[0], zet: { maxWind: 30 } },
          { label: T.instZitKeuzes[1], zet: { maxWind: 25 } },
          { label: T.instZitKeuzes[2], zet: { maxWind: 20 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 16, max: 21 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 21, max: 24 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
