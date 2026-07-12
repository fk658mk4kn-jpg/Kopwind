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

/** "Prima fietsdag \u00b7 8,9 \u2014 reden, reden." */
export function oordeelZin(oordeel, fmtCijfer) {
  const kop = `${oordeel.advies} \u00b7 ${fmtCijfer(oordeel.score)}`;
  return oordeel.redenen.length ? `${kop} \u2014 ${oordeel.redenen.join(", ")}.` : kop;
}
