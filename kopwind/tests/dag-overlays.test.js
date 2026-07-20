import test from "node:test";
import assert from "node:assert/strict";
import { paraplu } from "../lib/tools/paraplu.js";
import { regenTiming } from "../lib/tools/regen-timing.js";
import { schaalVoor } from "../lib/engine/schaal.js";

/**
 * Dag-samenvatting-overlays (v3.25.0): paraplu en regen-timing kregen
 * een overlay voor de statusstip (besluit de eigenaar). Synthetische
 * Open-Meteo-uurdata (arrays per veld) voor een vaste dag; het
 * peilmoment is 9:00, zodat ochtend en middag allebei "resterend" zijn.
 */

function maakHourly(natteUren = []) {
  const time = [];
  const precipitation = [];
  const precipitation_probability = [];
  for (let u = 0; u < 24; u++) {
    time.push(`2026-07-17T${String(u).padStart(2, "0")}:00`);
    precipitation.push(natteUren.includes(u) ? 1.2 : 0);
    precipitation_probability.push(natteUren.includes(u) ? 90 : 5);
  }
  return { time, precipitation, precipitation_probability };
}

const NU = new Date("2026-07-17T09:00:00");

test("paraplu-overlay: droge dag is groen, natte dag matig of erger", () => {
  const droog = paraplu.overlay(maakHourly([]), NU).dagen[0];
  assert.equal(schaalVoor(droog.conditie.score).id, "ideaal");
  const eenBui = paraplu.overlay(maakHourly([15]), NU).dagen[0];
  assert.equal(schaalVoor(eenBui.conditie.score).id, "twijfelachtig");
  const nat = paraplu.overlay(maakHourly([10, 12, 14, 16, 18]), NU).dagen[0];
  assert.ok(nat.conditie.score >= 62, `natte dag hoort zwaar te wegen, kreeg ${nat.conditie.score}`);
});

test("paraplu-overlay: buien buiten het dagvenster tellen niet", () => {
  // Nachtelijke regen (2:00) raakt niemand die tussen 8 en 22 buiten is.
  const dag = paraplu.overlay(maakHourly([2]), NU).dagen[0];
  assert.equal(schaalVoor(dag.conditie.score).id, "ideaal");
});

test("regen-timing-overlay: dagkarakter volgt de eerste bui", () => {
  const droog = regenTiming.overlay(maakHourly([]), NU).dagen[0];
  assert.equal(schaalVoor(droog.conditie.score).id, "ideaal");
  const laat = regenTiming.overlay(maakHourly([16]), NU).dagen[0];
  assert.equal(schaalVoor(laat.conditie.score).id, "goed");
  const snel = regenTiming.overlay(maakHourly([11]), NU).dagen[0];
  assert.ok(snel.conditie.score > laat.conditie.score, "snelle bui weegt zwaarder dan late");
  const nuNat = regenTiming.overlay(maakHourly([9, 10]), NU).dagen[0];
  assert.ok(nuNat.conditie.score >= 62, `regen nu hoort zwaar te wegen, kreeg ${nuNat.conditie.score}`);
  assert.ok(nuNat.status.zin.includes("11:00"), "zin noemt het eerste droge uur");
});

test("dag-overlays: geen resterende uren geeft null-dag", () => {
  const laat = new Date("2026-07-17T23:30:00");
  assert.equal(paraplu.overlay(maakHourly([]), laat).dagen[0], null);
});
