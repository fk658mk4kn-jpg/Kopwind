import test from "node:test";
import assert from "node:assert/strict";
import { overlay, verbrandMinuten } from "../lib/tools/zonkracht.js";

function maakHourly(datum, uvVoor) {
  const h = {
    time: [], temperature_2m: [], apparent_temperature: [], precipitation: [],
    precipitation_probability: [], wind_speed_10m: [], wind_direction_10m: [],
    wind_gusts_10m: [], relative_humidity_2m: [], cloud_cover: [], uv_index: [], is_day: [],
  };
  for (let uur = 0; uur < 24; uur++) {
    h.time.push(`${datum}T${String(uur).padStart(2, "0")}:00`);
    h.temperature_2m.push(22);
    h.apparent_temperature.push(22);
    h.precipitation.push(0);
    h.precipitation_probability.push(5);
    h.wind_speed_10m.push(10);
    h.wind_direction_10m.push(225);
    h.wind_gusts_10m.push(15);
    h.relative_humidity_2m.push(55);
    h.cloud_cover.push(20);
    h.uv_index.push(uvVoor(uur));
    h.is_day.push(uur >= 6 && uur <= 21 ? 1 : 0);
  }
  return h;
}

const zomerUv = (uur) => Math.max(0, Math.round((7 * Math.exp(-((uur - 14) ** 2) / 14)) * 10) / 10);

test("felle zomerdag: smeren, venster en verbrandtijd in de zin", () => {
  const dag = overlay(maakHourly("2026-07-13", zomerUv), new Date(2026, 6, 13, 9, 0)).dagen[0];
  assert.equal(dag.antwoord.ja, true);
  assert.match(dag.antwoord.zin, /piekt om 14:00 op 7/);
  assert.match(dag.antwoord.zin, /minuten/);
  assert.ok(dag.venster && dag.venster.van <= 12 && dag.venster.tot >= 16, JSON.stringify(dag.venster));
  assert.ok(dag.conditie.score >= 45 && dag.conditie.score <= 62, `pijnscore ${dag.conditie.score} hoort in de Matig-band (rood-oranje)`);
  assert.match(dag.metric.zin, /licht/);
});

test("bewolkte winterdag: geen smeerplicht en een hoge (groene) score", () => {
  const dag = overlay(maakHourly("2026-07-13", (u) => (u >= 10 && u <= 15 ? 1.4 : 0)), new Date(2026, 6, 13, 9, 0)).dagen[0];
  assert.equal(dag.antwoord.ja, false);
  assert.ok(dag.conditie.score <= 12, `pijnscore ${dag.conditie.score} hoort Ideaal (groen) te zijn`);
  assert.equal(dag.venster, null);
});

test("na de piek verandert de zin maar blijft het antwoord ja", () => {
  const dag = overlay(maakHourly("2026-07-13", zomerUv), new Date(2026, 6, 13, 19, 30)).dagen[0];
  assert.equal(dag.antwoord.ja, true);
  assert.match(dag.antwoord.zin, /piek .* is geweest|blijft verstandig/);
});

test("verbrandMinuten: vuistregel per huidtype", () => {
  assert.equal(verbrandMinuten(7, 1), 10);
  assert.equal(verbrandMinuten(7, 2), 15);
  assert.equal(verbrandMinuten(7, 4), 30);
  assert.equal(verbrandMinuten(0, 2), null);
});

test("donker huidtype geeft langere verbrandtijd in de metric", () => {
  const dag = overlay(maakHourly("2026-07-13", zomerUv), new Date(2026, 6, 13, 9, 0), { huid: 4, smeerVanaf: 3 }).dagen[0];
  assert.match(dag.metric.zin, /donker/);
  assert.match(dag.metric.zin, /30 minuten/);
});
