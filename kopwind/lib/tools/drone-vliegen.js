/**
 * lib/tools/drone-vliegen.js
 *
 * De dronecheck (v3.29.0 "Ghibli"). Consumentendrones zijn licht en
 * hun accu's haten kou: de motor kent daarom drie harde randen. Regen
 * is direct einde verhaal (elektronica), de wind moet ruim onder het
 * maximum van de drone blijven (een mini van 249 gram is bij 20 km/u
 * al aan het vechten en verbruikt daarbij dubbel zoveel accu), en er
 * wordt alleen bij daglicht gescoord, want dat is de regel voor de
 * meeste vliegers zonder ontheffing. Vlagerigheid telt apart: stoten
 * maken beelden onrustig en landingen spannend.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "drone-vliegen",
    naam: "Kan ik vandaag met de drone vliegen?",
    korteVraag: "Kan ik vandaag dronen?",
    meldingKort: "Dronecheck",
    cta: "Check de vlucht",
    navLabel: "Drone vliegen",
    diepte: "Wind onder de dronegrens, droog en daglicht: het beste vliegblok.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect droneweer", goed: "Prima droneweer", twijfelachtig: "Kan, blijf laag", matig: "Riskant vliegweer", "zeer-slecht": "Drone blijft in de tas" },
    adviesLabels: { goed: "droneweer", matig: "kan, blijf laag", slecht: "geen droneweer" },
    legenda: { links: "drone blijft in de tas", rechts: "droneweer" },
    redenNat: "neerslag: elektronica en regen gaan niet samen",
    redenGeenBlok: "geen droog daglichtblok met werkbare wind",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort vliegblok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenStoten: (s) => `windstoten tot ${s} km/u: onrustig beeld en spannende landingen`,
    redenKou: (g) => `koud voor de accu (gevoel ${g} graden): reken op flink kortere vluchttijd`,
    metric: (uur, g) => `Beste vlieguur rond ${uur}:00.`,
    statusNu: (tijd) => `Nu prima droneweer: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste vlieguren: ${tijd}.`,
    statusGeweest: "Het beste droneweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het geen dag om te vliegen.",
    toekomstBeste: (tijd) => `Beste vliegblok: ${tijd}.`,
    toekomstGeen: "Geen droneweer.",
    instKlasseVraag: "Wat voor drone vlieg je?",
    instKlasseKeuzes: ["Mini (tot 250 gram)", "Middenklasse", "Grote of professionele drone"],
    instKouVraag: "Vlieg je in de winter door?",
    instKouKeuzes: ["Nee, onder de 5 graden sla ik over", "Ja, met opgewarmde accu's"],
    instDagStart: "Vroegste vliegtijd",
    instDagEind: "Laatste vliegtijd",
    instUur: "uur",
    instUitleg:
      "De check scoort alleen daglichturen (de regel voor vliegen zonder ontheffing) en houdt de wind ruim onder het maximum van je drone: een mini vecht bij 20 km/u al en verbruikt daarbij dubbel zoveel accu. Kou drukt de accucapaciteit flink; neerslag is altijd einde verhaal. Check zelf de no-flyzones op de kaart van de overheid.",
  },
  en: {
    slug: "drone-flying",
    naam: "Can I fly the drone today?",
    korteVraag: "Can I fly the drone today?",
    meldingKort: "Drone check",
    cta: "Check the flight",
    navLabel: "Drone flying",
    diepte: "Wind under the drone's limit, dry and daylight: the best flying window.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect drone weather", goed: "Good drone weather", twijfelachtig: "Doable, stay low", matig: "Risky flying weather", "zeer-slecht": "Drone stays in the bag" },
    adviesLabels: { goed: "drone weather", matig: "doable, stay low", slecht: "no drone weather" },
    legenda: { links: "drone stays in the bag", rechts: "drone weather" },
    redenNat: "precipitation: electronics and rain don't mix",
    redenGeenBlok: "no dry daylight window with workable wind",
    redenMatigBlok: (g, w) => `the best window is only so-so (wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short flying window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenStoten: (s) => `gusts up to ${s} km/h: shaky footage and tense landings`,
    redenKou: (g) => `cold for the battery (feels like ${g} degrees): expect much shorter flight time`,
    metric: (uur, g) => `Best flying hour around ${uur}:00.`,
    statusNu: (tijd) => `Good drone weather right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best flying hours: ${tijd}.`,
    statusGeweest: "The best drone weather has been and gone today.",
    statusNiks: "Today isn't a day to fly.",
    toekomstBeste: (tijd) => `Best flying window: ${tijd}.`,
    toekomstGeen: "No drone weather.",
    instKlasseVraag: "What drone do you fly?",
    instKlasseKeuzes: ["Mini (under 250 grams)", "Mid-range", "Large or professional drone"],
    instKouVraag: "Do you fly through winter?",
    instKouKeuzes: ["No, below 5 degrees I skip", "Yes, with pre-warmed batteries"],
    instDagStart: "Earliest flying time",
    instDagEind: "Latest flying time",
    instUur: "h",
    instUitleg:
      "The check scores daylight hours only (the rule for flying without exemption) and keeps wind well under your drone's limit: a mini already fights at 20 km/h and burns twice the battery doing it. Cold cuts battery capacity sharply; precipitation is always game over. Check the official no-fly zone map yourself.",
  },
});

export const DRONE_DEFAULTS = {
  maxWind: 25,
  winter: 0,
  dagStart: 9,
  dagEind: 20,
};

export function uurDroneScore(u, inst = DRONE_DEFAULTS) {
  if (!u.dag) return 4;
  if ((u.neerslag ?? 0) > 0.05 || (u.kans ?? 0) >= 65) return 0;
  const wind = u.wind ?? 0;
  const windF = clamp(lerp(wind, inst.maxWind * 0.4, inst.maxWind, 1, 0.1), 0.05, 1);
  const stoten = u.stoten ?? wind * 1.3;
  const ratio = wind > 4 ? stoten / wind : 1;
  const vlaagF = clamp(1 - Math.max(0, ratio - 1.5) * 0.4, 0.45, 1);
  const gevoel = u.gevoel ?? u.temp ?? 10;
  const kouGrens = inst.winter === 1 ? -4 : 2;
  const kouF = gevoel <= kouGrens ? 0.5 : gevoel <= kouGrens + 4 ? 0.75 : 1;
  return clamp(Math.round(96 * windF * vlaagF * kouF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: DRONE_DEFAULTS,
  uurScore: uurDroneScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 1,
  extraFactoren: ({ uren, venster, inst }) => {
    if (!venster) return [];
    const uit = [];
    const piekStoten = Math.round(Math.max(...venster.blok.map((u) => u.stoten ?? 0)));
    if (piekStoten >= inst.maxWind + 12) {
      uit.push({ punten: 18, reden: T.redenStoten(piekStoten) });
    }
    const gemGevoel = venster.blok.reduce((a, u) => a + (u.gevoel ?? u.temp ?? 10), 0) / venster.uren;
    if (gemGevoel <= 4) {
      uit.push({ punten: 8, reden: T.redenKou(Math.round(gemGevoel)) });
    }
    return uit;
  },
});

export const droneVliegen = {
  id: "drone-vliegen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#C24E3F",
  locatieHint: T.locatieHint,
  icoon: "drone",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: DRONE_DEFAULTS },
  instellingen: {
    defaults: DRONE_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "klasse",
        vraag: T.instKlasseVraag,
        keuzes: [
          { label: T.instKlasseKeuzes[0], zet: { maxWind: 18 } },
          { label: T.instKlasseKeuzes[1], zet: { maxWind: 25 } },
          { label: T.instKlasseKeuzes[2], zet: { maxWind: 32 } },
        ],
      },
      {
        type: "keuze",
        id: "winter",
        vraag: T.instKouVraag,
        keuzes: [
          { label: T.instKouKeuzes[0], zet: { winter: 0 } },
          { label: T.instKouKeuzes[1], zet: { winter: 1 } },
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
