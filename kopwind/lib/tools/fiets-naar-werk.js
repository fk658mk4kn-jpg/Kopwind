/**
 * lib/tools/fiets-naar-werk.js
 *
 * De vlaggendrager als registerconfiguratie. De diepe route/wind/keten-
 * logica blijft in lib/planner.js en lib/advice.js (goed getest); deze
 * config koppelt hem aan het register zodat pagina's, meldingen en SEO
 * hem op dezelfde manier behandelen als elke andere tool.
 */

import { kies } from "../i18n/locale.js";
import { DEFAULT_THRESHOLDS } from "../advice.js";

export const fietsNaarWerk = {
  id: "fiets-naar-werk",
  slug: kies({ nl: "fietsen-naar-werk", en: "bike-to-work" }),
  naam: kies({ nl: "Kan ik vandaag fietsen?", en: "Can I bike today?" }),
  meldingKort: kies({ nl: "Fietscheck", en: "Bike check" }),
  cta: kies({ nl: "Check je rit", en: "Check your ride" }),
  navLabel: kies({ nl: "Fietsen", en: "Cycling" }),
  kleur: "#3D6E96",
  icoon: "fiets",
  groep: "Onderweg",
  diepte: kies({ nl: "Wind, regen en het beste vertrekmoment voor jouw rit.", en: "Wind, rain and the best time to set off." }),
  schaalLabels: kies({
    nl: { ideaal: "Ideale fietsdag", goed: "Goed te doen", twijfelachtig: "Twijfelachtig", matig: "Liever later", "zeer-slecht": "Beter van niet" },
    en: { ideaal: "Ideal bike day", goed: "Good to go", twijfelachtig: "Iffy", matig: "Better later", "zeer-slecht": "Give it a miss" },
  }),
  vervoer: ["fiets"],
  korteVraag: kies({ nl: "Kan ik vandaag fietsen naar werk?", en: "Can I bike to work today?" }),
  patroon: "A",
  inputType: "route",
  weerVelden: [
    "temperature_2m",
    "apparent_temperature",
    "precipitation",
    "precipitation_probability",
    "wind_speed_10m",
    "wind_direction_10m",
    "wind_gusts_10m",
  ],
  scoreConfig: { thresholds: DEFAULT_THRESHOLDS },
  instellingen: {
    defaults: DEFAULT_THRESHOLDS,
    velden: [
      {
        type: "keuze",
        id: "wind",
        vraag: kies({ nl: "Hoe gevoelig ben je voor wind?", en: "How much does wind bother you?" }),
        keuzes: [
          { label: kies({ nl: "Nauwelijks", en: "Hardly" }), zet: { tegenwindMatig: 18, tegenwindZwaar: 30 } },
          { label: kies({ nl: "Gemiddeld", en: "Average" }), zet: { tegenwindMatig: 12, tegenwindZwaar: 22 } },
          { label: kies({ nl: "Best snel", en: "Quite quickly" }), zet: { tegenwindMatig: 8, tegenwindZwaar: 16 } },
        ],
      },
      {
        type: "keuze",
        id: "regen",
        vraag: kies({ nl: "Wanneer is regen voor jou te veel?", en: "When is rain too much for you?" }),
        keuzes: [
          { label: kies({ nl: "Paar druppels prima", en: "A few drops are fine" }), zet: { neerslagKans: 75, neerslagMm: 1.6 } },
          { label: kies({ nl: "Motregen is ok\u00e9", en: "Drizzle is okay" }), zet: { neerslagKans: 60, neerslagMm: 1.0 } },
          { label: kies({ nl: "Ik wil droog blijven", en: "I want to stay dry" }), zet: { neerslagKans: 45, neerslagMm: 0.5 } },
        ],
      },
      {
        type: "keuze",
        id: "kou",
        vraag: kies({ nl: "Wanneer is het te koud?", en: "When is it too cold?" }),
        keuzes: [
          { label: kies({ nl: "Ik fiets altijd door", en: "I ride through anything" }), zet: { gevoelMin: -8 } },
          { label: kies({ nl: "Onder nul wordt het guur", en: "Below zero gets grim" }), zet: { gevoelMin: 0 } },
          { label: kies({ nl: "Snel te koud", en: "Cold gets me quickly" }), zet: { gevoelMin: 5 } },
        ],
      },
      { key: "segmentLengte", label: kies({ nl: "Segmentlengte", en: "Segment length" }), eenheid: "m", step: 50, geavanceerd: true },
    ],
    uitleg: kies({
      nl: "Goed te doen is droog met hooguit merkbare tegenwind; Liever later betekent stevige wind of serieuze buienkans. Met deze keuzes bepaal je waar die grenzen voor jou liggen.",
      en: "Good to go means dry with at most noticeable headwind; Better later means strong wind or a serious shower risk. These choices set where those lines sit for you.",
    }),
  },
  adviesLabels: kies({
    nl: { goed: "prima fietsdag", matig: "pittige rit", slecht: "liever niet fietsen" },
    en: { goed: "fine bike day", matig: "tough ride", slecht: "rather not bike" },
  }),
  affiliate: null,
};
