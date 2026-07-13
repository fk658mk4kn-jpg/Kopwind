/**
 * lib/engine/advies.js
 *
 * Gedeelde vertaalslag van score plus dominante factoren naar mensentaal.
 * Toolspecifieke bewoordingen komen uit de toolconfig; dit bestand houdt de
 * mechaniek gelijk over alle tools.
 */

import { maakScore, adviesVoorScore, cijferWaarde } from "./score.js";

/**
 * Volledig oordeel voor een tool: score, cijfer, label en redenen.
 * @param {Array} factoren zie maakScore
 * @param {{goed, matig, slecht}} labels
 */
export function maakOordeel(factoren, labels) {
  const { score, redenen } = maakScore(factoren);
  return {
    score,
    redenen,
    cijfer: cijferWaarde(score),
    advies: adviesVoorScore(score, labels),
  };
}

/** "Prima fietsdag \u00b7 goed: reden, reden." */
import { schaalVoor } from "./schaal.js";

export function oordeelZin(oordeel) {
  const kop = `${oordeel.advies} \u00b7 ${schaalVoor(oordeel.score).label.toLowerCase()}`;
  return oordeel.redenen.length ? `${kop}: ${oordeel.redenen.join(", ")}.` : kop;
}
