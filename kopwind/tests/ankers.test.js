import test from "node:test";
import assert from "node:assert/strict";
import { painScore, legAdvies, DEFAULT_THRESHOLDS } from "../lib/advice.js";
import { cijferWaarde } from "../lib/engine/score.js";

/**
 * P0-A acceptatietests (fiets): de verankerde curve. 10 = rugwind/luw,
 * droog, mild; 7 = merkbare tegenwind maar droog; 5 = stevige tegenwind of
 * serieuze buienkans; 3 = stevige tegenwind plus regen. Middenmoot 5-7,
 * 9,5-10 gereserveerd, en cijfers spreiden over de bandbreedte.
 */

const T = DEFAULT_THRESHOLDS;
const kaal = {
  meanPosHead: 0, fracMatig: 0, fracZwaar: 0, matigMeters: 0, zwaarMeters: 0,
  maxHead: 0, neerslagKansMax: 0, neerslagMmMax: 0, gevoelMin: 15, maxGust: 20,
};

test("anker 10: luw, droog en mild is 9 of hoger, licht briesje geen 10", () => {
  assert.ok(cijferWaarde(painScore(kaal, T).score) >= 9.5);
  const briesje = painScore({ ...kaal, meanPosHead: 8, maxHead: 12 }, T).score;
  assert.ok(cijferWaarde(briesje) >= 8.5 && cijferWaarde(briesje) < 10);
});

test("anker 7: merkbare tegenwind (matig-drempel), droog", () => {
  const m = {
    ...kaal,
    meanPosHead: T.tegenwindMatig,
    fracMatig: 0.5,
    matigMeters: 2500,
    maxHead: T.tegenwindMatig + 5,
  };
  const c = cijferWaarde(painScore(m, T).score);
  assert.ok(c >= 6 && c <= 7.8, `merkbare tegenwind hoort rond de 7, kreeg ${c}`);
});

test("anker 5: stevige tegenwind, droog", () => {
  const m = {
    ...kaal,
    meanPosHead: 18,
    fracMatig: 0.4,
    fracZwaar: 0.35,
    zwaarMeters: 1800,
    maxHead: 26,
  };
  const c = cijferWaarde(painScore(m, T).score);
  assert.ok(c >= 4 && c <= 6, `stevige tegenwind hoort rond de 5, kreeg ${c}`);
});

test("anker 3 en lager: stevige tegenwind plus regen", () => {
  const m = {
    ...kaal,
    meanPosHead: 19,
    fracZwaar: 0.5,
    zwaarMeters: 3000,
    maxHead: 30,
    neerslagKansMax: 75,
    neerslagMmMax: 1.2,
  };
  const { score } = painScore(m, T);
  assert.ok(cijferWaarde(score) <= 3.5, `kreeg ${cijferWaarde(score)}`);
  assert.equal(legAdvies(m, T).advies, "liever niet fietsen");
});

test("spreiding: vijf gevarieerde dagen zijn niet allemaal 9 of hoger", () => {
  const dagen = [
    kaal,
    { ...kaal, meanPosHead: 10, maxHead: 14 },
    { ...kaal, meanPosHead: T.tegenwindMatig + 2, fracMatig: 0.5, matigMeters: 2000, maxHead: 20 },
    { ...kaal, meanPosHead: 18, fracZwaar: 0.3, zwaarMeters: 1500, maxHead: 26, neerslagKansMax: 45 },
    { ...kaal, meanPosHead: 21, fracZwaar: 0.5, zwaarMeters: 3000, maxHead: 32, neerslagKansMax: 80, neerslagMmMax: 1.5 },
  ];
  const cijfers = dagen.map((d) => cijferWaarde(painScore(d, T).score));
  assert.ok(cijfers.filter((c) => c >= 9).length <= 2, `te veel negens: ${cijfers}`);
  assert.ok(Math.max(...cijfers) >= 9);
  assert.ok(Math.min(...cijfers) <= 4);
  assert.ok(cijfers.some((c) => c > 4 && c < 8.5), "middenmoot bestaat");
});
