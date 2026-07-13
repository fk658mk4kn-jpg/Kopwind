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
  cta: "Check je rit",
  navLabel: "Fietsen",
  kleur: "#3D6E96",
  icoon: "fiets",
  groep: "Onderweg",
  diepte: "Wind per stuk route en het beste moment om te vertrekken.",
  vervoer: ["fiets"],
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
  instellingen: {
    defaults: DEFAULT_THRESHOLDS,
    velden: [
      { key: "tegenwindMatig", label: "Tegenwind merkbaar vanaf", eenheid: "km/u", step: 1 },
      { key: "tegenwindZwaar", label: "Tegenwind zwaar vanaf", eenheid: "km/u", step: 1 },
      { key: "neerslagKans", label: "Neerslagkans genoemd vanaf", eenheid: "%", step: 5 },
      { key: "neerslagMm", label: "Neerslag zwaar vanaf", eenheid: "mm/u", step: 0.1 },
      { key: "gevoelMin", label: "Te koud onder gevoels-", eenheid: "graden", step: 1 },
      { key: "segmentLengte", label: "Segmentlengte", eenheid: "m", step: 50 },
    ],
    uitleg:
      "Elke rit krijgt een rapportcijfer voor het fietsweer: rond de 7 is merkbare tegenwind maar droog, rond de 5 stevige tegenwind of serieuze buienkans, onder de 4 raden we fietsen af. Deze drempels bepalen waar merkbaar en zwaar voor jou beginnen.",
  },
  adviesLabels: {
    goed: "prima fietsdag",
    matig: "pittige rit",
    slecht: "liever niet fietsen",
  },
  affiliate: null,
};
