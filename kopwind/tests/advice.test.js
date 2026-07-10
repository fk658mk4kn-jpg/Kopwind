import { test } from "node:test";
import assert from "node:assert/strict";
import { painScore, legAdvies, dagAdvies, DEFAULT_THRESHOLDS } from "../lib/advice.js";

const T = DEFAULT_THRESHOLDS;

const basisMetrics = {
  meanHead: 0,
  meanPosHead: 0,
  maxHead: 0,
  maxGust: 0,
  neerslagKansMax: 0,
  neerslagMmMax: 0,
  gevoelMin: 12,
};

test("painScore: rustige dag geeft score 0 en advies fiets prima", () => {
  const { score, redenen } = painScore(basisMetrics, T);
  assert.equal(score, 0);
  assert.equal(redenen.length, 0);
  assert.equal(legAdvies(basisMetrics, T).advies, "fiets prima");
});

test("painScore: zware tegenwind kantelt naar scooter", () => {
  const m = { ...basisMetrics, meanPosHead: 25, maxHead: 30 };
  const { score } = painScore(m, T);
  assert.ok(score >= 60, `verwacht 60+, kreeg ${score}`);
  assert.equal(legAdvies(m, T).advies, "pak de scooter");
});

test("painScore: alleen 80% regenkans geeft precies fiets met tegenzin", () => {
  const m = { ...basisMetrics, neerslagKansMax: 80 };
  const { score } = painScore(m, T);
  assert.equal(score, 30, `lerp 60->100 geeft 20->40, dus 80% = 30, kreeg ${score}`);
  assert.equal(legAdvies(m, T).advies, "fiets met tegenzin");
});

test("painScore: regenkans onder de drempel telt niet mee", () => {
  const m = { ...basisMetrics, neerslagKansMax: 55 };
  assert.equal(painScore(m, T).score, 0);
  assert.equal(legAdvies(m, T).advies, "fiets prima");
});

test("dagAdvies: pakt de zwaarste etappe van de keten", () => {
  const legs = [
    {
      van: { naam: "Thuis" },
      naar: { naam: "Sportschool" },
      advies: { score: 10, redenen: [], advies: "fiets prima" },
    },
    {
      van: { naam: "Sportschool" },
      naar: { naam: "Werk" },
      advies: {
        score: 65,
        redenen: ["gemiddeld 24 km/u tegenwind op de tegenwindstukken"],
        advies: "pak de scooter",
      },
    },
  ];
  const dag = dagAdvies(legs);
  assert.equal(dag.score, 65);
  assert.equal(dag.advies, "pak de scooter");
  assert.equal(dag.worstIdx, 1);
  assert.ok(dag.uitleg.includes("Sportschool"), dag.uitleg);
});
