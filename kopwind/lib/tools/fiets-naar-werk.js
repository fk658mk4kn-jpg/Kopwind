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
  naam: "Vandaag op de fiets?",
  meldingKort: "Fietscheck",
  korteVraag: "Kan ik vandaag naar werk fietsen?",
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
  adviesLabels: {
    goed: "prima fietsdag",
    matig: "pittige rit",
    slecht: "liever niet fietsen",
  },
  affiliate: null,
};
