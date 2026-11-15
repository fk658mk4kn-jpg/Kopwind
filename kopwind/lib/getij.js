/**
 * lib/getij.js
 *
 * Springtij en doodtij langs de Nederlandse kust (v3.38.0), afgeleid uit
 * de maanfasen. Springtij valt aan onze kust ongeveer twee dagen na
 * nieuwe en volle maan, doodtij ongeveer twee dagen na het eerste en
 * laatste kwartier (de "ouderdom" van het getij). Dit geeft de periode,
 * geen exacte hoogwatertijden: die publiceert Rijkswaterstaat per plek.
 */

import { fasenTussen } from "./maan.js";

const DAG_MS = 86400000;
export const GETIJ_VERTRAGING_DAGEN = 2;

export function getijPerioden(nu = Date.now(), aantal = 6) {
  return fasenTussen(nu - 3 * DAG_MS, nu + 70 * DAG_MS)
    .map((f) => ({
      soort: f.soort === 0 || f.soort === 2 ? "springtij" : "doodtij",
      maan: f.naam,
      tijdstip: f.tijdstip + GETIJ_VERTRAGING_DAGEN * DAG_MS,
    }))
    .filter((p) => p.tijdstip > nu - DAG_MS)
    .slice(0, aantal);
}

/** Hoogwater schuift elke dag ongeveer 50 minuten op (halve maandag van 24 uur 50). */
export const HOOGWATER_SCHUIF_MIN = 50;
