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
  // 1,9 km van de route met merkbare tegenwind. Het stuk telt mee in het
  // cijfer; waar en hoeveel wind er is staat sinds v3.7.2 in de
  // windsamenvatting (summarizeLegNL, getest in wind.test.js), niet meer
  // als losse reden hier. Zo tellen we die kilometers niet dubbel.
  const m = {
    ...basisMetrics,
    meanPosHead: 7,
    maxHead: 16,
    matigMeters: 1900,
    fracMatig: 1900 / 6500,
  };
  const { score } = painScore(m, T);
  assert.ok(score > 0 && score < 30, `mild maar niet nul, kreeg ${score}`);
  assert.equal(legAdvies(m, T).advies, "prima fietsdag");
});

test("painScore: 80% regenkans geeft een pittige rit", () => {
  const m = { ...basisMetrics, neerslagKansMax: 80 };
  const { score, redenen } = painScore(m, T);
  assert.equal(legAdvies(m, T).advies, "pittige rit");
  assert.ok(redenen.some((r) => r.includes("kans op neerslag")));
  assert.ok(score >= 30 && score < 45, `80% hoort rond de 6 te landen, kreeg ${score}`);
});

test("painScore: regenkans is gegradeerd, geen klif op de drempel", () => {
  const laag = painScore({ ...basisMetrics, neerslagKansMax: 20 }, T).score;
  const onder = painScore({ ...basisMetrics, neerslagKansMax: 55 }, T);
  const boven = painScore({ ...basisMetrics, neerslagKansMax: 62 }, T).score;
  assert.equal(laag, 0, "20% kans is gewoon Nederland");
  assert.ok(onder.score > 0 && onder.score < 20, "55% telt licht mee");
  assert.ok(!onder.redenen.some((r) => r.includes("kans")), "reden pas vanaf de drempel");
  assert.ok(boven - onder.score < 8, `geen sprong rond de drempel (${onder.score} -> ${boven})`);
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

test("dagAdvies: gebruikt de windsamenvatting van de zwaarste rit", () => {
  const legs = [
    {
      van: { naam: "Thuis" },
      naar: { naam: "Werk" },
      samenvatting: "2 km merkbare tegenwind aan het eind, verder rustig.",
      advies: { score: 40, redenen: ["60% kans op neerslag"], advies: "pittige rit" },
    },
  ];
  const dag = dagAdvies(legs);
  assert.ok(dag.uitleg.includes("2 km merkbare tegenwind"), dag.uitleg);
  assert.ok(dag.uitleg.includes("60% kans op neerslag"), dag.uitleg);
  assert.ok(!dag.uitleg.includes("tegenwind op de route"), `geen dubbele km-reden meer: ${dag.uitleg}`);
});
