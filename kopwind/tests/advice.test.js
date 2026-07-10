import { test } from "node:test";
import assert from "node:assert/strict";
import { painScore, legAdvies, dagAdvies, DEFAULT_THRESHOLDS } from "../lib/advice.js";
import { fmtCijfer } from "../lib/format.js";

const T = DEFAULT_THRESHOLDS;

const basisMetrics = {
  meanHead: 0,
  meanPosHead: 0,
  maxHead: 0,
  maxGust: 0,
  neerslagKansMax: 0,
  neerslagMmMax: 0,
  gevoelMin: 12,
  matigMeters: 0,
  zwaarMeters: 0,
  fracMatig: 0,
  fracZwaar: 0,
};

test("painScore: rustige dag geeft score 0, cijfer 10, prima fietsdag", () => {
  const { score, redenen } = painScore(basisMetrics, T);
  assert.equal(score, 0);
  assert.equal(redenen.length, 0);
  assert.equal(fmtCijfer(score), "10");
  assert.equal(legAdvies(basisMetrics, T).advies, "prima fietsdag");
});

test("painScore: zware tegenwind kantelt naar liever niet fietsen", () => {
  const m = { ...basisMetrics, meanPosHead: 25, maxHead: 30 };
  const { score } = painScore(m, T);
  assert.ok(score >= 60, `verwacht 60+, kreeg ${score}`);
  assert.equal(legAdvies(m, T).advies, "liever niet fietsen");
});

test("painScore: korte tegenwindstukken drukken het cijfer wel, maar mild", () => {
  // De situatie uit de praktijk: ritgemiddelde laag (7 km/u), maar wel
  // 1,9 km van de route met merkbare tegenwind. Vroeger gaf dit score 0
  // naast een tekst over tegenwind; nu telt het mee.
  const m = {
    ...basisMetrics,
    meanPosHead: 7,
    maxHead: 16,
    matigMeters: 1900,
    fracMatig: 1900 / 6500,
  };
  const { score, redenen } = painScore(m, T);
  assert.ok(score > 0 && score < 30, `mild maar niet nul, kreeg ${score}`);
  assert.equal(legAdvies(m, T).advies, "prima fietsdag");
  assert.ok(
    redenen.some((r) => r.includes("1,9 km") && r.includes("tegenwind")),
    `reden benoemt het stuk, kreeg: ${redenen.join(" | ")}`
  );
});

test("painScore: alleen 80% regenkans geeft precies een pittige rit (7,0)", () => {
  const m = { ...basisMetrics, neerslagKansMax: 80 };
  const { score } = painScore(m, T);
  assert.equal(score, 30, `lerp 60->100 geeft 20->40, dus 80% = 30, kreeg ${score}`);
  assert.equal(fmtCijfer(score), "7");
  assert.equal(legAdvies(m, T).advies, "pittige rit");
});

test("painScore: regenkans onder de drempel telt niet mee", () => {
  const m = { ...basisMetrics, neerslagKansMax: 55 };
  assert.equal(painScore(m, T).score, 0);
  assert.equal(legAdvies(m, T).advies, "prima fietsdag");
});

test("fmtCijfer: score naar rapportcijfer met komma", () => {
  assert.equal(fmtCijfer(0), "10");
  assert.equal(fmtCijfer(30), "7");
  assert.equal(fmtCijfer(37), "6,3");
  assert.equal(fmtCijfer(60), "4");
  assert.equal(fmtCijfer(100), "1");
});

test("dagAdvies: pakt de zwaarste rit van de keten", () => {
  const legs = [
    {
      van: { naam: "Thuis" },
      naar: { naam: "Sportschool" },
      advies: { score: 10, redenen: [], advies: "prima fietsdag" },
    },
    {
      van: { naam: "Sportschool" },
      naar: { naam: "Werk" },
      advies: {
        score: 65,
        redenen: ["gemiddeld 24 km/u wind tegen"],
        advies: "liever niet fietsen",
      },
    },
  ];
  const dag = dagAdvies(legs);
  assert.equal(dag.score, 65);
  assert.equal(dag.advies, "liever niet fietsen");
  assert.equal(dag.worstIdx, 1);
  assert.ok(dag.uitleg.includes("Sportschool"), dag.uitleg);
});
