/**
 * lib/tools/vliegeren.js
 *
 * De vliegercheck (v3.29.0 "Ghibli"). De enige check op de site waar
 * wind geen straf maar de brandstof is: onder de 10 km/u komt niets
 * van de grond, en de ideale band ligt grofweg tussen 15 en 30. De
 * motor scoort daarom op een windBAND (twee flanken) in plaats van
 * een windplafond, en straft vlagerigheid apart: als de stoten ver
 * boven de gemiddelde wind uitkomen, klapt de vlieger steeds uit de
 * lucht. Powerkites verleggen de band omhoog.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "vliegeren",
    naam: "Kan ik vandaag vliegeren?",
    korteVraag: "Kan ik vandaag vliegeren?",
    meldingKort: "Vliegercheck",
    cta: "Check de wind",
    navLabel: "Vliegeren",
    diepte: "De enige check waar wind de brandstof is: zoekt de beste windband.",
    locatieHint: "Zoek je stad of het strand, dat is genoeg...",
    schaalLabels: { ideaal: "Perfecte vliegerwind", goed: "Prima vliegerwind", twijfelachtig: "Kan, met geduld", matig: "Lastige wind", "zeer-slecht": "Geen vliegerweer" },
    adviesLabels: { goed: "vliegerweer", matig: "kan, met geduld", slecht: "geen vliegerweer" },
    legenda: { links: "vlieger blijft thuis", rechts: "vliegerweer" },
    redenNat: "regen: natte vliegers vliegen slecht en lijnen worden zwaar",
    redenGeenBlok: "geen blok met bruikbare wind (te weinig, te veel of te nat)",
    redenMatigBlok: (g, w) => `de wind in het beste blok is behelpen (${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok met goede wind (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenVlagerig: (s, w) => `vlagerige wind (${w} km/u met stoten tot ${s}): de vlieger klapt steeds weg`,
    redenTeVeel: (s) => `stoten tot ${s} km/u: te veel voor de meeste vliegers`,
    metric: (uur, g) => `Beste vliegeruur rond ${uur}:00.`,
    statusNu: (tijd) => `Nu prima vliegerwind: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste vliegeruren: ${tijd}.`,
    statusGeweest: "De beste vliegerwind is voor vandaag geweest.",
    statusNiks: "Vandaag komt er niets fatsoenlijks van de grond.",
    toekomstBeste: (tijd) => `Beste vliegerblok: ${tijd}.`,
    toekomstGeen: "Geen vliegerweer.",
    instTypeVraag: "Wat voor vlieger?",
    instTypeKeuzes: ["Eenlijner (kindervlieger)", "Bestuurbare tweelijner", "Powerkite of matras"],
    instPlekVraag: "Waar vlieger je?",
    instPlekKeuzes: ["Park of veldje", "Open polder", "Strand"],
    instDagStart: "Vroegste vliegertijd",
    instDagEind: "Laatste vliegertijd",
    instUur: "uur",
    instUitleg:
      "Vliegeren wil een windband, geen windplafond: onder de 10 km/u komt niets omhoog, tussen de 15 en 30 is het genieten, daarboven wordt het vechten. Powerkites verleggen die band omhoog, kindervliegers omlaag. Vlagerige wind (stoten ver boven het gemiddelde) is de grootste spelbreker: op het strand is de wind het gelijkmatigst, tussen bomen en huizen het rommeligst.",
  },
  en: {
    slug: "kite-flying",
    naam: "Can I fly a kite today?",
    korteVraag: "Can I fly a kite today?",
    meldingKort: "Kite check",
    cta: "Check the wind",
    navLabel: "Kite flying",
    diepte: "The only check where wind is the fuel: finds the best wind band.",
    locatieHint: "Search your town or the beach...",
    schaalLabels: { ideaal: "Perfect kite wind", goed: "Good kite wind", twijfelachtig: "Doable with patience", matig: "Tricky wind", "zeer-slecht": "No kite weather" },
    adviesLabels: { goed: "kite weather", matig: "doable with patience", slecht: "no kite weather" },
    legenda: { links: "kite stays home", rechts: "kite weather" },
    redenNat: "rain: wet kites fly poorly and lines get heavy",
    redenGeenBlok: "no window with usable wind (too little, too much or too wet)",
    redenMatigBlok: (g, w) => `the wind in the best window is a struggle (${w} km/h)`,
    redenKortBlok: (u) => `only a short window of good wind (${u} hours)`,
    redenBuien: "showers around the best window",
    redenVlagerig: (s, w) => `gusty wind (${w} km/h with gusts to ${s}): the kite keeps collapsing`,
    redenTeVeel: (s) => `gusts up to ${s} km/h: too much for most kites`,
    metric: (uur, g) => `Best kite hour around ${uur}:00.`,
    statusNu: (tijd) => `Good kite wind right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best kite hours: ${tijd}.`,
    statusGeweest: "The best kite wind has been and gone today.",
    statusNiks: "Nothing decent gets off the ground today.",
    toekomstBeste: (tijd) => `Best kite window: ${tijd}.`,
    toekomstGeen: "No kite weather.",
    instTypeVraag: "What kind of kite?",
    instTypeKeuzes: ["Single-line (kids' kite)", "Steerable two-liner", "Power kite or foil"],
    instPlekVraag: "Where do you fly?",
    instPlekKeuzes: ["Park or field", "Open polder", "Beach"],
    instDagStart: "Earliest kite time",
    instDagEind: "Latest kite time",
    instUur: "h",
    instUitleg:
      "Kite flying wants a wind band, not a wind ceiling: below 10 km/h nothing rises, between 15 and 30 it's a joy, above that it's a fight. Power kites shift that band up, kids' kites down. Gusty wind (gusts far above the average) is the biggest spoiler: the beach has the steadiest wind, between trees and houses it's messiest.",
  },
});

export const VLIEGER_DEFAULTS = {
  bandMin: 12,
  bandMax: 32,
  plek: 0,
  dagStart: 9,
  dagEind: 21,
};

export function uurVliegerScore(u, inst = VLIEGER_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.2 || (u.kans ?? 0) >= 75) return 0;
  const wind = u.wind ?? 0;
  const top = (inst.bandMin + inst.bandMax) / 2;
  let windF;
  if (wind < inst.bandMin) {
    windF = clamp(lerp(wind, inst.bandMin * 0.5, inst.bandMin, 0.05, 0.75), 0.05, 0.75);
  } else if (wind <= inst.bandMax) {
    windF = wind <= top ? lerp(wind, inst.bandMin, top, 0.75, 1) : lerp(wind, top, inst.bandMax, 1, 0.7);
  } else {
    windF = clamp(lerp(wind, inst.bandMax, inst.bandMax + 18, 0.7, 0.05), 0.05, 0.7);
  }
  // Vlagerigheid: stoten ver boven de gemiddelde wind.
  const stoten = u.stoten ?? wind * 1.3;
  const ratio = wind > 4 ? stoten / wind : 2.5;
  const beschutting = inst.plek === 0 ? 0.15 : inst.plek === 1 ? 0.05 : 0;
  const vlaagF = clamp(1 - Math.max(0, ratio - 1.6 + beschutting) * 0.55, 0.35, 1);
  return clamp(Math.round(96 * windF * vlaagF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: VLIEGER_DEFAULTS,
  uurScore: uurVliegerScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 1,
  extraFactoren: ({ uren, venster, inst }) => {
    if (!venster) return [];
    const uit = [];
    const gemWind = Math.round(venster.blok.reduce((a, u) => a + (u.wind ?? 0), 0) / venster.uren);
    const piekStoten = Math.round(Math.max(...venster.blok.map((u) => u.stoten ?? 0)));
    if (piekStoten >= inst.bandMax + 22) {
      uit.push({ punten: 25, reden: T.redenTeVeel(piekStoten) });
    } else if (gemWind > 6 && piekStoten / gemWind >= 1.8) {
      uit.push({ punten: 14, reden: T.redenVlagerig(piekStoten, gemWind) });
    }
    return uit;
  },
});

export const vliegeren = {
  id: "vliegeren",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#C24E3F",
  locatieHint: T.locatieHint,
  icoon: "vlieger",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: VLIEGER_DEFAULTS },
  instellingen: {
    defaults: VLIEGER_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "type",
        vraag: T.instTypeVraag,
        keuzes: [
          { label: T.instTypeKeuzes[0], zet: { bandMin: 10, bandMax: 26 } },
          { label: T.instTypeKeuzes[1], zet: { bandMin: 12, bandMax: 32 } },
          { label: T.instTypeKeuzes[2], zet: { bandMin: 16, bandMax: 42 } },
        ],
      },
      {
        type: "keuze",
        id: "plek",
        vraag: T.instPlekVraag,
        keuzes: [
          { label: T.instPlekKeuzes[0], zet: { plek: 0 } },
          { label: T.instPlekKeuzes[1], zet: { plek: 1 } },
          { label: T.instPlekKeuzes[2], zet: { plek: 2 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 7, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 16, max: 22 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
