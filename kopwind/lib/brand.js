/**
 * lib/brand.js
 *
 * Twee lagen merknamen: de hub en per tool. Van hub-naam wisselen is een
 * kwestie van deze constanten; per-tool namen staan in het toolregister
 * (lib/tools/). Interne namen (kopwind, localStorage-sleutels,
 * Supabase-tabellen) blijven ongewijzigd, zodat bestaande data en de
 * Vercel-koppeling niets merken van een naamswissel.
 */

export const HUB_NAAM = "Kan het vandaag?";
export const HUB_KORT = "Vandaag?";
export const HUB_CLAIM =
  "Kleine, dagelijkse beslistools op basis van live weer: fiets ik vandaag naar werk, kan de was buiten, en meer.";

// Compatibiliteit met bestaande imports (vlaggendrager).
export const APP_NAAM = "Vandaag op de fiets?";
export const APP_KORT = "Fietscheck";
export const APP_CLAIM =
  "Check of fietsen naar werk vandaag een goed idee is: reistijd, wind, regen en temperatuur voor jouw woon-werkrit.";

/** Signature-windstrip: een herkenbare rit van wind mee naar tegen en terug. */
export const WINDSTRIP_DEMO = [-0.9, -0.7, -0.55, -0.2, 0.1, 0.35, 0.6, 0.85, 0.95, 0.7, 0.3, -0.1, -0.4, -0.75];
