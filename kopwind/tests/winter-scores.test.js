import test from "node:test";
import assert from "node:assert/strict";
import { krabben } from "../lib/tools/krabben.js";
import { gladheid } from "../lib/tools/gladheid.js";
import { schaalVoor } from "../lib/engine/schaal.js";

/**
 * Regressietest op de v3.26.0-bugfix: krabben en gladheid leverden hun
 * dagscore als 100 minus risico (hoog is goed), terwijl de hele site op
 * pijn rekent (laag is goed). Gevolg in juli: "Zeker krabben (of dek
 * af)" bij 16 graden. Synthetische nachten leggen beide richtingen
 * vast. De krabcheck beoordeelt per dag de nacht ERNA (uren 0-8 van de
 * volgende kalenderdag), dus de testdata vult twee etmalen.
 */

function maakNacht({ minTemp, bewolking = 20, wind = 6, neerslag = 0 }) {
  const time = [];
  const temperature_2m = [];
  const apparent_temperature = [];
  const precipitation = [];
  const cloud_cover = [];
  const wind_speed_10m = [];
  for (const dag of ["2026-07-17", "2026-07-18"]) {
    for (let u = 0; u < 24; u++) {
      time.push(`${dag}T${String(u).padStart(2, "0")}:00`);
      // De vroege uren dragen het minimum; overdag warmer.
      const t = u < 8 ? minTemp : minTemp + 8;
      temperature_2m.push(t);
      apparent_temperature.push(t);
      precipitation.push(u < 8 ? neerslag : 0);
      cloud_cover.push(bewolking);
      wind_speed_10m.push(wind);
    }
  }
  return { time, temperature_2m, apparent_temperature, precipitation, cloud_cover, wind_speed_10m };
}

const NU = new Date("2026-07-17T21:00:00");

test("krabben: zachte zomernacht is ideaal, geen krabadvies", () => {
  const dag = krabben.overlay(maakNacht({ minTemp: 16 }), NU).dagen[0];
  assert.equal(dag.antwoord.ja, false);
  assert.equal(schaalVoor(dag.conditie.score).id, "ideaal");
  assert.equal(dag.conditie.advies, krabben.adviesLabels.goed);
});

test("krabben: heldere stille vriesnacht geeft krabadvies met hoge pijn", () => {
  const dag = krabben.overlay(maakNacht({ minTemp: -3 }), NU).dagen[0];
  assert.equal(dag.antwoord.ja, true);
  assert.ok(dag.conditie.score >= 62, `vriesnacht hoort zwaar te wegen, kreeg ${dag.conditie.score}`);
  assert.equal(dag.conditie.advies, krabben.adviesLabels.slecht);
});

test("gladheid: warme nacht is ideaal, natte vriesnacht zeer glad", () => {
  const warm = gladheid.overlay(maakNacht({ minTemp: 14, neerslag: 0.4 }), NU).dagen[0];
  assert.equal(schaalVoor(warm.conditie.score).id, "ideaal");
  const ijzel = gladheid.overlay(maakNacht({ minTemp: -1, neerslag: 0.4, bewolking: 80 }), NU).dagen[0];
  assert.equal(ijzel.antwoord.ja, true);
  assert.ok(ijzel.conditie.score >= 62, `ijzelnacht hoort zwaar te wegen, kreeg ${ijzel.conditie.score}`);
});
