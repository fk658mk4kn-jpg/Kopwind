/**
 * lib/engine/schaal.js
 *
 * Het verdictmodel van v3.0.0 "Levante": geen cijfers meer in beeld, maar
 * een Ja of Nee met een woord erachter. Vijf schalen, van Zeer slecht tot
 * Ideaal. De interne score (pijn, 0..100) blijft de motor: die bepaalt de
 * schaal, de kleur en de meldingsdrempels. Alleen de presentatie praat in
 * woorden.
 */

export const SCHAAL = [
  { id: "ideaal", label: "Ideaal", totPijn: 12 },
  { id: "goed", label: "Goed", totPijn: 30 },
  { id: "twijfelachtig", label: "Twijfelachtig", totPijn: 45 },
  { id: "matig", label: "Matig", totPijn: 62 },
  { id: "zeer-slecht", label: "Zeer slecht", totPijn: 101 },
];

/** Van pijnscore (0..100) naar schaal-item. */
export function schaalVoor(scorePijn) {
  return SCHAAL.find((s) => scorePijn < s.totPijn) ?? SCHAAL[SCHAAL.length - 1];
}

/** Kan-vragen: tot en met Twijfelachtig is het antwoord ja. */
export function jaVoor(scorePijn) {
  return scorePijn < 45;
}

/** Badgekleur bij een schaal: groen, oranje of rood. */
export function kleurVoorSchaal(schaalId) {
  if (schaalId === "ideaal" || schaalId === "goed") return "groen";
  if (schaalId === "twijfelachtig") return "oranje";
  return "rood";
}
