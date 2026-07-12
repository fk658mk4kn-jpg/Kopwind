import test from "node:test";
import assert from "node:assert/strict";
import { kleurDivergerend, kleurSequentieel, rampGradient } from "../lib/engine/kleuren.js";

test("kleurDivergerend: blauw bij rugwind, neutraal midden, oranje bij tegenwind, clamp", () => {
  assert.equal(kleurDivergerend(-1), "rgb(29 111 184)");
  assert.equal(kleurDivergerend(0), "rgb(242 240 234)");
  assert.equal(kleurDivergerend(1), "rgb(194 94 0)");
  assert.equal(kleurDivergerend(5), kleurDivergerend(1));
});

test("kleurSequentieel: donker bij slecht, licht geel bij goed", () => {
  assert.equal(kleurSequentieel(0), "rgb(0 32 77)");
  assert.equal(kleurSequentieel(1), "rgb(255 234 70)");
  assert.match(kleurSequentieel(0.5), /^rgb\(/);
});

test("rampGradient: bruikbare CSS-gradient per soort", () => {
  assert.match(rampGradient("wind"), /^linear-gradient\(90deg, #1D6FB8/);
  assert.match(rampGradient("goedheid"), /#FFEA46\)$/);
});
