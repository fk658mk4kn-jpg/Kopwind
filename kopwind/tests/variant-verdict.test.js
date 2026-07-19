import test from "node:test";
import assert from "node:assert/strict";
import { VARIANTEN, variantVerdict } from "../lib/varianten.js";

/**
 * Variant-verdicts (v3.24.0): het ja/nee-antwoord per kledingvariant,
 * afgeleid van de middag-hoofdlaag (laagIndex) die de kledingcheck
 * zelf kiest. Synthetische dagobjecten per laag, zodat de mapping
 * laag -> antwoord vastligt en niet stil kan verschuiven.
 * Laagindexen: 0 korte broek en T-shirt, 1 T-shirt met laagje,
 * 2 trui, 3 jas, 4 winterjas.
 */

function dag(laagIndex, { regen = false, warmsteGevoel = 20 } = {}) {
  return { outfit: { laagIndex, regen, koudsteGevoel: 5, warmsteGevoel } };
}

test("variantVerdict: korte broek volgt de laagkeuze", () => {
  assert.equal(variantVerdict("korte-broek", dag(0)).ja, true);
  assert.equal(variantVerdict("korte-broek", dag(1)).ja, "twijfel");
  assert.equal(variantVerdict("korte-broek", dag(2)).ja, false);
});

test("variantVerdict: t-shirt met twijfelband op de middagpiek", () => {
  assert.equal(variantVerdict("t-shirt", dag(0)).ja, true);
  assert.equal(variantVerdict("t-shirt", dag(1)).ja, true);
  assert.equal(variantVerdict("t-shirt", dag(2, { warmsteGevoel: 17 })).ja, "twijfel");
  assert.equal(variantVerdict("t-shirt", dag(2, { warmsteGevoel: 12 })).ja, false);
});

test("variantVerdict: jas, met regen als doorslag bij truiweer", () => {
  assert.equal(variantVerdict("jas", dag(1)).ja, false);
  assert.equal(variantVerdict("jas", dag(2)).ja, "twijfel");
  assert.equal(variantVerdict("jas", dag(2, { regen: true })).ja, true);
  assert.equal(variantVerdict("jas", dag(3)).ja, true);
  assert.equal(variantVerdict("jas", dag(4)).conditie.score, 62);
});

test("variantVerdict: scores zijn pijnscores en landen op de juiste schaal", async () => {
  // Regressietest op de v3.24-bug: scores stonden op een hoog-is-goed
  // schaal waardoor elke stip groen kleurde. De schaal rekent in pijn
  // (laag is goed): gunstig hoort ideaal te zijn, twijfel
  // twijfelachtig, ongunstig matig.
  const { schaalVoor } = await import("../lib/engine/schaal.js");
  assert.equal(schaalVoor(variantVerdict("korte-broek", dag(0)).conditie.score).id, "ideaal");
  assert.equal(schaalVoor(variantVerdict("korte-broek", dag(1)).conditie.score).id, "twijfelachtig");
  assert.equal(schaalVoor(variantVerdict("korte-broek", dag(2)).conditie.score).id, "matig");
  assert.equal(schaalVoor(variantVerdict("jas", dag(3)).conditie.score).id, "twijfelachtig");
  assert.equal(schaalVoor(variantVerdict("jas", dag(4)).conditie.score).id, "zeer-slecht");
  assert.equal(schaalVoor(variantVerdict("jas", dag(1)).conditie.score).id, "ideaal");
});

test("variantVerdict: elke geregistreerde variant heeft een tak", () => {
  // Een nieuwe variant zonder verdictlogica mag niet stil door de
  // stip-laag glippen: dan hoort deze test te falen.
  for (const v of VARIANTEN) {
    const uit = variantVerdict(v.id, dag(2));
    assert.ok(uit && typeof uit.conditie?.score === "number", `${v.id} mist een verdict-tak`);
    assert.ok(uit.zin && uit.variantLabel, `${v.id} mist zin of label`);
  }
});

test("variantVerdict: onbruikbare invoer geeft null", () => {
  assert.equal(variantVerdict("jas", null), null);
  assert.equal(variantVerdict("jas", { outfit: {} }), null);
  assert.equal(variantVerdict("bestaat-niet", dag(2)), null);
});
