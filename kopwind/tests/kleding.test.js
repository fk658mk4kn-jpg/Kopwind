import test from "node:test";
import assert from "node:assert/strict";
import { overlay, laagVoor, uurComfort } from "../lib/tools/kleding.js";

function maakHourly(datum, per) {
  const h = {
    time: [], temperature_2m: [], apparent_temperature: [], precipitation: [],
    precipitation_probability: [], wind_speed_10m: [], wind_gusts_10m: [],
    relative_humidity_2m: [], cloud_cover: [], is_day: [],
  };
  for (let uur = 0; uur < 24; uur++) {
    const w = per(uur);
    h.time.push(`${datum}T${String(uur).padStart(2, "0")}:00`);
    h.temperature_2m.push(w.temp ?? w.gevoel);
    h.apparent_temperature.push(w.gevoel);
    h.precipitation.push(w.neerslag ?? 0);
    h.precipitation_probability.push(w.kans ?? 10);
    h.wind_speed_10m.push(w.wind ?? 10);
    h.wind_gusts_10m.push(w.stoten ?? 20);
    h.relative_humidity_2m.push(70);
    h.cloud_cover.push(50);
    h.is_day.push(uur >= 7 && uur <= 21 ? 1 : 0);
  }
  return h;
}

const cijfer = (dag) => (100 - dag.conditie.score) / 10;

test("warme stabiele dag: korte broek en een hoog comfortcijfer", () => {
  const hourly = maakHourly("2026-07-12", () => ({ gevoel: 21 }));
  const dag = overlay(hourly, new Date(2026, 6, 12, 8, 0)).dagen[0];
  assert.match(dag.status.zin, /korte broek/);
  assert.ok(cijfer(dag) >= 8, `kreeg ${cijfer(dag)}`);
  assert.equal(dag.conditie.advies, "makkelijke keuze");
  assert.equal(dag.antwoord.ja, null, "kleding heeft geen kan-vraag");
  assert.equal(dag.outfit.laagIndex, 0);
  assert.equal(dag.outfit.regen, false);
});

test("laagjesdag: koude ochtend, warme middag, koele avond geeft meeneem-advies", () => {
  const hourly = maakHourly("2026-07-12", (uur) => ({
    gevoel: uur < 10 ? 9 : uur < 18 ? 18 : 12,
  }));
  const dag = overlay(hourly, new Date(2026, 6, 12, 7, 0)).dagen[0];
  assert.match(dag.status.zin, /Neem .* mee/);
  assert.ok(dag.conditie.redenen.some((r) => r.includes("verschil")), dag.conditie.redenen.join());
  assert.match(dag.metric.zin, /Gevoelstemperatuur vandaag/);
});

test("regen in de middag: de zin noemt de regenjas en de timing", () => {
  const hourly = maakHourly("2026-07-12", (uur) => ({
    gevoel: 15,
    neerslag: uur === 14 || uur === 15 ? 0.6 : 0,
    kans: uur === 14 || uur === 15 ? 85 : 15,
  }));
  const dag = overlay(hourly, new Date(2026, 6, 12, 8, 0)).dagen[0];
  assert.match(dag.status.zin, /regenjas of paraplu/);
  assert.match(dag.status.zin, /rond 14:00/);
  assert.equal(dag.outfit.regen, true);
});

test("gure natte winterdag: laag cijfer en winterjas", () => {
  const hourly = maakHourly("2026-07-12", () => ({ gevoel: 2, neerslag: 0.4, kans: 80, stoten: 55 }));
  const dag = overlay(hourly, new Date(2026, 6, 12, 8, 0)).dagen[0];
  assert.ok(cijfer(dag) <= 4, `kreeg ${cijfer(dag)}`);
  assert.match(dag.status.zin, /winterjas/);
  assert.equal(dag.conditie.advies, "gure dag");
});

test("laagVoor: de grenzen schuiven mee met de instellingen", () => {
  assert.equal(laagVoor(21).advies, "korte broek en T-shirt");
  assert.equal(laagVoor(12).advies, "trui of vest");
  assert.equal(laagVoor(21, { warmGrens: 20, koudGrens: 11 }).advies.includes("korte broek"), false);
});

test("uurComfort: nat en gure stoten drukken het comfort", () => {
  const droog = uurComfort({ gevoel: 18, neerslag: 0, kans: 10, stoten: 20 });
  const nat = uurComfort({ gevoel: 18, neerslag: 0.5, kans: 80, stoten: 20 });
  assert.ok(droog > nat + 25);
});
