/**
 * lib/tools/fiets-naar-werk.js
 *
 * De vlaggendrager als registerconfiguratie. De diepe route/wind/keten-
 * logica blijft in lib/planner.js en lib/advice.js (goed getest); deze
 * config koppelt hem aan het register zodat pagina's, meldingen en SEO
 * hem op dezelfde manier behandelen als elke andere tool.
 */

import { DEFAULT_THRESHOLDS } from "../advice.js";

export const fietsNaarWerk = {
  id: "fiets-naar-werk",
  slug: "fietsen-naar-werk",
  naam: "Kan ik vandaag fietsen?",
  meldingKort: "Fietscheck",
  cta: "Check je rit",
  navLabel: "Fietsen",
  kleur: "#3D6E96",
  icoon: "fiets",
  groep: "Onderweg",
  diepte: "Wind, regen en het beste vertrekmoment voor jouw rit.",
  schaalLabels: {
    ideaal: "Ideale fietsdag",
    goed: "Goed te doen",
    twijfelachtig: "Twijfelachtig",
    matig: "Liever later",
    "zeer-slecht": "Beter van niet",
  },
  vervoer: ["fiets"],
  korteVraag: "Kan ik vandaag fietsen naar werk?",
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
        vraag: "Hoe gevoelig ben je voor wind?",
        keuzes: [
          { label: "Nauwelijks", zet: { tegenwindMatig: 18, tegenwindZwaar: 30 } },
          { label: "Gemiddeld", zet: { tegenwindMatig: 12, tegenwindZwaar: 22 } },
          { label: "Best snel", zet: { tegenwindMatig: 8, tegenwindZwaar: 16 } },
        ],
      },
      {
        type: "keuze",
        id: "regen",
        vraag: "Wanneer is regen voor jou te veel?",
        keuzes: [
          { label: "Paar druppels prima", zet: { neerslagKans: 75, neerslagMm: 1.6 } },
          { label: "Motregen is ok\u00e9", zet: { neerslagKans: 60, neerslagMm: 1.0 } },
          { label: "Ik wil droog blijven", zet: { neerslagKans: 45, neerslagMm: 0.5 } },
        ],
      },
      {
        type: "keuze",
        id: "kou",
        vraag: "Wanneer is het te koud?",
        keuzes: [
          { label: "Ik fiets altijd door", zet: { gevoelMin: -8 } },
          { label: "Onder nul wordt het guur", zet: { gevoelMin: 0 } },
          { label: "Snel te koud", zet: { gevoelMin: 5 } },
        ],
      },
      { key: "segmentLengte", label: "Segmentlengte", eenheid: "m", step: 50, geavanceerd: true },
    ],
    uitleg:
      "Goed te doen is droog met hooguit merkbare tegenwind; Liever later betekent stevige wind of serieuze buienkans. Met deze keuzes bepaal je waar die grenzen voor jou liggen.",
  },
  adviesLabels: {
    goed: "prima fietsdag",
    matig: "pittige rit",
    slecht: "liever niet fietsen",
  },
  affiliate: null,
};
