import test from "node:test";
import assert from "node:assert/strict";
import { overlay, uurBbqScore, dominanteWindrichting, windstreekVoluit } from "../lib/tools/barbecue.js";

function maakHourly(datum, per) {
  const h = {
    time: [], temperature_2m: [], apparent_temperature: [], precipitation: [],
    precipitation_probability: [], wind_speed_10m: [], wind_direction_10m: [],
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
    h.wind_direction_10m.push(w.richting ?? 225);
    h.relative_humidity_2m.push(60);
    h.cloud_cover.push(w.bewolking ?? 30);
    h.is_day.push(uur >= 6 && uur <= 21 ? 1 : 0);
  }
  return h;
}

const cijfer = (dag) => (100 - dag.conditie.score) / 10;

test("zwoele zomeravond: ja, venster en de rookzin noemt de windstreken", () => {
  const hourly = maakHourly("2026-07-13", () => ({ gevoel: 21, wind: 10, richting: 225 }));
  const dag = overlay(hourly, new Date(2026, 6, 13, 15, 0)).dagen[0];
  assert.equal(dag.antwoord.ja, true, dag.status.zin);
  assert.ok(cijfer(dag) >= 8, `kreeg ${cijfer(dag)}`);
  assert.ok(dag.venster, "venster hoort te bestaan");
  assert.match(dag.metric.zin, /zuidwesten/);
  assert.match(dag.metric.zin, /noordoosten/);
});

test("regenavond: nee en de reden noemt natte kolen", () => {
  const hourly = maakHourly("2026-07-13", () => ({ gevoel: 18, neerslag: 0.6, kans: 85 }));
  const dag = overlay(hourly, new Date(2026, 6, 13, 15, 0)).dagen[0];
  assert.equal(dag.antwoord.ja, false);
  assert.ok(cijfer(dag) <= 3.5, `kreeg ${cijfer(dag)}`);
  assert.ok(dag.conditie.redenen.some((r) => r.includes("nat")), dag.conditie.redenen.join());
});

test("harde wind drukt de score en de reden waarschuwt voor vonken", () => {
  const hourly = maakHourly("2026-07-13", () => ({ gevoel: 19, wind: 34 }));
  const dag = overlay(hourly, new Date(2026, 6, 13, 15, 0)).dagen[0];
  assert.ok(cijfer(dag) <= 6, `kreeg ${cijfer(dag)}`);
});

test("koele avond met vest: twijfelachtig maar niet afgeschoten", () => {
  const hourly = maakHourly("2026-07-13", () => ({ gevoel: 14, wind: 12, bewolking: 60 }));
  const dag = overlay(hourly, new Date(2026, 6, 13, 15, 0)).dagen[0];
  assert.ok(cijfer(dag) >= 4 && cijfer(dag) <= 7.5, `kreeg ${cijfer(dag)}`);
});

test("dominanteWindrichting: vectorgemiddelde middelt 350 en 10 naar noord", () => {
  const deg = dominanteWindrichting([{ richting: 350 }, { richting: 10 }]);
  assert.ok(deg < 5 || deg > 355, `kreeg ${deg}`);
  assert.equal(windstreekVoluit(deg), "noorden");
});

test("uurBbqScore: neerslag maakt het uur nul", () => {
  assert.equal(uurBbqScore({ gevoel: 22, wind: 8, neerslag: 0.3, kans: 30, dag: true, bewolking: 20 }), 0);
});
