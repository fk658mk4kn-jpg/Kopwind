import test from "node:test";
import assert from "node:assert/strict";
import { wandelen } from "../lib/tools/wandelen.js";

/**
 * Hele-dag-dekking (v3.26.0): als het beste blok feitelijk het hele
 * dagvenster beslaat, hoort de statuszin "vrijwel de hele dag" te
 * zeggen in plaats van een kunstmatig eindtijdstip ("het blok loopt
 * tot 21:00"). Bij een echt begrensd blok blijft de tijd staan.
 */

function maakDag({ perfect }) {
  const time = [];
  const temperature_2m = [];
  const apparent_temperature = [];
  const precipitation = [];
  const precipitation_probability = [];
  const wind_speed_10m = [];
  for (let u = 0; u < 24; u++) {
    time.push(`2026-07-17T${String(u).padStart(2, "0")}:00`);
    // Perfect: de hele dag 15 graden en droog. Begrensd: alleen
    // 12:00-16:00 droog, daarbuiten stevige regen.
    const droogUur = perfect || (u >= 12 && u < 16);
    temperature_2m.push(15);
    apparent_temperature.push(15);
    precipitation.push(droogUur ? 0 : 2);
    precipitation_probability.push(droogUur ? 5 : 95);
    wind_speed_10m.push(8);
  }
  return { time, temperature_2m, apparent_temperature, precipitation, precipitation_probability, wind_speed_10m };
}

const NU = new Date("2026-07-17T09:00:00");

test("venstermotor: volle dekking zegt vrijwel de hele dag, zonder eindtijd", () => {
  const dag = wandelen.overlay(maakDag({ perfect: true }), NU).dagen[0];
  assert.ok(
    dag.status.zin.includes("Vrijwel de hele dag"),
    `verwachtte hele-dag-zin, kreeg: ${dag.status.zin}`
  );
  assert.ok(!/\d{2}:00/.test(dag.status.zin), "hele-dag-zin hoort geen tijdstip te dragen");
});

test("venstermotor: een begrensd blok houdt gewoon zijn tijden", () => {
  const dag = wandelen.overlay(maakDag({ perfect: false }), NU).dagen[0];
  assert.ok(/\d{2}:00/.test(dag.status.zin), `verwachtte een tijd, kreeg: ${dag.status.zin}`);
  assert.ok(!dag.status.zin.includes("Vrijwel de hele dag"));
});
