import test from "node:test";
import assert from "node:assert/strict";
import {
  maakScore,
  adviesVoorScore,
  cijferWaarde,
  kleurSchaal,
  lerp,
  clamp,
} from "../lib/engine/score.js";

test("maakScore: telt punten op, filtert lege redenen, plafond 100", () => {
  const { score, redenen } = maakScore([
    { punten: 40, reden: "veel tegenwind" },
    { punten: 30, reden: null },
    { punten: 50, reden: "stortbui" },
  ]);
  assert.equal(score, 100);
  assert.deepEqual(redenen, ["veel tegenwind", "stortbui"]);
});

test("maakScore: negatieve of ongeldige factoren tellen niet mee", () => {
  const { score } = maakScore([{ punten: -10 }, { punten: NaN }, { punten: 12 }]);
  assert.equal(score, 12);
});

test("adviesVoorScore: labels per drempel", () => {
  const labels = { goed: "top", matig: "mwah", slecht: "nee" };
  assert.equal(adviesVoorScore(0, labels), "top");
  assert.equal(adviesVoorScore(29, labels), "top");
  assert.equal(adviesVoorScore(30, labels), "mwah");
  assert.equal(adviesVoorScore(60, labels), "nee");
});

test("cijferWaarde: 10 bij score 0, ondergrens 1", () => {
  assert.equal(cijferWaarde(0), 10);
  assert.equal(cijferWaarde(30), 7);
  assert.equal(cijferWaarde(100), 1);
});

test("kleurSchaal: geldige hsl over het hele bereik en clamp", () => {
  for (const x of [-2, -1, 0, 0.5, 1, 2]) {
    assert.match(kleurSchaal(x), /^hsl\(\d+ 88% \d+%\)$/);
  }
  assert.equal(kleurSchaal(5), kleurSchaal(1));
});

test("lerp en clamp: basisgedrag", () => {
  assert.equal(lerp(5, 0, 10, 0, 100), 50);
  assert.equal(lerp(-5, 0, 10, 0, 100), 0);
  assert.equal(clamp(15, 0, 10), 10);
});
