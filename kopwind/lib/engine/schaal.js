/**
 * lib/engine/schaal.js
 *
 * Het verdictmodel van v3.0.0 "Levante": geen cijfers meer in beeld, maar
 * een Ja of Nee met een woord erachter. Vijf schalen, van Zeer slecht tot
 * Ideaal. De interne score (pijn, 0..100) blijft de motor: die bepaalt de
 * schaal, de kleur en de meldingsdrempels. Alleen de presentatie praat in
 * woorden.
 */

import { kies } from "../i18n/locale.js";

const LABELS = kies({
  nl: ["Ideaal", "Goed", "Twijfelachtig", "Matig", "Zeer slecht"],
  en: ["Ideal", "Good", "Iffy", "Poor", "Very poor"],
});

export const SCHAAL = [
  { id: "ideaal", label: LABELS[0], totPijn: 12 },
  { id: "goed", label: LABELS[1], totPijn: 30 },
  { id: "twijfelachtig", label: LABELS[2], totPijn: 45 },
  { id: "matig", label: LABELS[3], totPijn: 62 },
  { id: "zeer-slecht", label: LABELS[4], totPijn: 101 },
];

/** Van pijnscore (0..100) naar schaal-item. */
export function schaalVoor(scorePijn) {
  return SCHAAL.find((s) => scorePijn < s.totPijn) ?? SCHAAL[SCHAAL.length - 1];
}

/** Kan-vragen: tot en met Twijfelachtig is het antwoord ja. */
export function jaVoor(scorePijn) {
  return scorePijn < 45;
}

/**
 * Het schaalwoord in de eigen woorden van een tool: geef de schaalLabels
 * van de tool mee ({ ideaal, goed, twijfelachtig, matig, "zeer-slecht" })
 * en je krijgt "Hang maar op" in plaats van het generieke "Ideaal".
 */
export function labelVoor(scorePijn, labels) {
  const s = schaalVoor(scorePijn);
  return labels?.[s.id] ?? s.label;
}

/** Badgekleur bij een schaal: groen, oranje of rood. */
export function kleurVoorSchaal(schaalId) {
  if (schaalId === "ideaal" || schaalId === "goed") return "groen";
  if (schaalId === "twijfelachtig") return "oranje";
  return "rood";
}
