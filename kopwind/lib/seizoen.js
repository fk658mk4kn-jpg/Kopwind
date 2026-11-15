/**
 * lib/seizoen.js
 *
 * Seizoensbewuste volgorde van de populaire checks op de homepage
 * (v3.36.0). In november zoekt niemand op terrasweer; dan horen
 * gladheid, krabben en de sneeuw bovenaan. Meteorologische seizoenen
 * (hele maanden), in Nederlandse tijd. De zomerlijst is de oude vaste
 * POPULAIRE_TOOL_IDS, zodat er in de zomer niets verandert.
 */

import { POPULAIRE_TOOL_IDS } from "./tools/index.js";

export const SEIZOEN_POPULAIR = {
  winter: ["wat-trek-ik-aan", "gladheid", "krabben", "paraplu", "fiets-naar-werk", "sneeuw"],
  lente: ["wat-trek-ik-aan", "paraplu", "fiets-naar-werk", "terras", "was-buiten-drogen", "hooikoorts"],
  zomer: POPULAIRE_TOOL_IDS,
  herfst: ["wat-trek-ik-aan", "paraplu", "fiets-naar-werk", "storm", "was-buiten-drogen", "regen-timing"],
};

export function seizoenVanMaand(maand) {
  if (maand === 12 || maand <= 2) return "winter";
  if (maand <= 5) return "lente";
  if (maand <= 8) return "zomer";
  return "herfst";
}

export function huidigSeizoen(tijdstip = Date.now()) {
  const maand = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Amsterdam", month: "numeric" }).format(new Date(tijdstip))
  );
  return seizoenVanMaand(maand);
}

export function populairVoorSeizoen(tijdstip = Date.now()) {
  return SEIZOEN_POPULAIR[huidigSeizoen(tijdstip)];
}
