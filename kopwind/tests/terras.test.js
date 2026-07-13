import test from "node:test";
import assert from "node:assert/strict";
import { overlay, uurTerrasScore } from "../lib/tools/terras.js";

function maakHourly(datum, per) {
  const h = {
    time: [], temperature_2m: [], apparent_temperature: [], precipitation: [],
    precipitation_probability: [], wind_speed_10m: [], relative_humidity_2m: [],
    cloud_cover: [], is_day: [],
  };
  for (let uur = 0; uur < 24; uur++) {
    const w = per(uur);
    h.time.push(`${datum}T${String(uur).padStart(2, "0")}:00`);
    h.temperature_2m.push(w.temp);
    h.apparent_temperature.push(w.gevoel ?? w.temp);
    h.precipitation.push(w.neerslag ?? 0);
    h.precipitation_probability.push(w.kans ?? 10);
    h.wind_speed_10m.push(w.wind ?? 10);
    h.relative_humidity_2m.push(60);
    h.cloud_cover.push(w.bewolking ?? 40);
    h.is_day.push(uur >= 7 && uur <= 21 ? 1 : 0);
  }
  return h;
}

const cijfer = (dag) => (100 - dag.conditie.score) / 10;

test("zomerse dag: hoog cijfer, venster en beste-uren-status", () => {
  const hourly = maakHourly("2026-07-12", () => ({ gevoel: 24, temp: 25, wind: 8, bewolking: 15 }));
  const res = overlay(hourly, new Date(2026, 6, 12, 9, 0));
  const dag = res.dagen[0];
  assert.ok(cijfer(dag) >= 9, `kreeg ${cijfer(dag)}`);
  assert.ok(dag.venster, "venster hoort te bestaan");
  assert.match(dag.status.zin, /Beste terrasuren/);
  assert.match(dag.status.zin, /met zon/);
  assert.equal(dag.antwoord.ja, true);
});

test("regen de hele dag: laag cijfer en geen terrasweer", () => {
  const hourly = maakHourly("2026-07-12", () => ({ gevoel: 17, temp: 17, neerslag: 0.8, kans: 90 }));
  const dag = overlay(hourly, new Date(2026, 6, 12, 9, 0)).dagen[0];
  assert.ok(cijfer(dag) <= 3.5, `kreeg ${cijfer(dag)}`);
  assert.equal(dag.conditie.advies, "geen terrasweer");
  assert.equal(dag.antwoord.ja, false);
});

test("fris met wat zon: middenmoot, kan met een vestje", () => {
  const hourly = maakHourly("2026-07-12", () => ({ gevoel: 15, temp: 16, wind: 8, bewolking: 40 }));
  const dag = overlay(hourly, new Date(2026, 6, 12, 9, 0)).dagen[0];
  assert.ok(cijfer(dag) >= 4.5 && cijfer(dag) <= 7, `kreeg ${cijfer(dag)}`);
  assert.ok(dag.conditie.redenen.some((r) => r.includes("fris")));
});

test("stevige wind verpest het terras en de reden zegt dat", () => {
  const hourly = maakHourly("2026-07-12", () => ({ gevoel: 20, temp: 21, wind: 32, bewolking: 30 }));
  const dag = overlay(hourly, new Date(2026, 6, 12, 9, 0)).dagen[0];
  assert.ok(cijfer(dag) <= 5, `kreeg ${cijfer(dag)}`);
  assert.ok(dag.conditie.redenen.some((r) => r.includes("wind")), dag.conditie.redenen.join());
});

test("middag beter dan ochtend: het venster ligt in de middag", () => {
  const hourly = maakHourly("2026-07-12", (uur) => ({
    gevoel: uur < 14 ? 13 : 22,
    temp: uur < 14 ? 14 : 23,
    wind: uur < 14 ? 24 : 8,
    bewolking: uur < 14 ? 90 : 20,
  }));
  const dag = overlay(hourly, new Date(2026, 6, 12, 9, 0)).dagen[0];
  assert.ok(dag.venster.van >= 14, `venster begint om ${dag.venster.van}`);
});

test("uurTerrasScore: neerslag maakt het uur nul", () => {
  assert.equal(uurTerrasScore({ gevoel: 24, wind: 5, neerslag: 0.3, kans: 20, dag: true, bewolking: 10 }), 0);
});
