import test from "node:test";
import assert from "node:assert/strict";
import { regioOverlay } from "../lib/tools/fiets-naar-werk.js";
import { schaalVoor } from "../lib/engine/schaal.js";

/**
 * Fiets-regioverdict (v3.27.0): het locatie-oordeel zonder route, op
 * de spitsen (7-10 en 16-19). De zwaarste spits telt, consistent met
 * dagAdvies. Synthetische dagen leggen de kernscenario's vast.
 */

function maakDag({ wind = 10, regenUur = null, ochtendGevoel = 15 }) {
  const time = [];
  const temperature_2m = [];
  const apparent_temperature = [];
  const precipitation = [];
  const precipitation_probability = [];
  const wind_speed_10m = [];
  for (let u = 0; u < 24; u++) {
    time.push(`2026-07-17T${String(u).padStart(2, "0")}:00`);
    const temp = u < 10 ? ochtendGevoel : 18;
    temperature_2m.push(temp);
    apparent_temperature.push(temp);
    precipitation.push(u === regenUur ? 1.5 : 0);
    precipitation_probability.push(u === regenUur ? 90 : 5);
    wind_speed_10m.push(wind);
  }
  return { time, temperature_2m, apparent_temperature, precipitation, precipitation_probability, wind_speed_10m };
}

const OCHTEND = new Date("2026-07-17T06:30:00");

test("regioverdict: rustige dag is groen met een spits-zin", () => {
  const dag = regioOverlay(maakDag({}), OCHTEND).dagen[0];
  assert.equal(schaalVoor(dag.conditie.score).id, "ideaal");
  assert.equal(dag.antwoord.ja, true);
});

test("regioverdict: regen in de avondspits weegt door, ook 's ochtends al", () => {
  const dag = regioOverlay(maakDag({ regenUur: 17 }), OCHTEND).dagen[0];
  assert.ok(dag.conditie.score >= 28, `regen-spits hoort te wegen, kreeg ${dag.conditie.score}`);
  assert.ok(/17:00/.test(dag.status.zin), dag.status.zin);
});

test("regioverdict: om 12:00 telt de ochtendspits niet meer mee", () => {
  const middag = new Date("2026-07-17T12:00:00");
  const dag = regioOverlay(maakDag({ regenUur: 8 }), middag).dagen[0];
  assert.ok(!/08:00/.test(dag.status.zin), `voorbije spitsbui hoort weg: ${dag.status.zin}`);
});

test("regioverdict: na de avondspits zegt hij dat de spitsen voorbij zijn", () => {
  const avond = new Date("2026-07-17T20:30:00");
  const dag = regioOverlay(maakDag({}), avond).dagen[0];
  assert.equal(dag.status.soort, "nee");
});
