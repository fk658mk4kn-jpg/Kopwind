import test from "node:test";
import assert from "node:assert/strict";
import { factorenVoor } from "../lib/engine/factoren.js";

function maakHourly(datum, per) {
  const h = {
    time: [], temperature_2m: [], apparent_temperature: [], precipitation: [],
    precipitation_probability: [], wind_speed_10m: [], wind_direction_10m: [],
    wind_gusts_10m: [], relative_humidity_2m: [], cloud_cover: [], uv_index: [], is_day: [],
  };
  for (let uur = 0; uur < 24; uur++) {
    const w = per(uur);
    h.time.push(`${datum}T${String(uur).padStart(2, "0")}:00`);
    h.temperature_2m.push(w.temp ?? 20);
    h.apparent_temperature.push(w.gevoel ?? w.temp ?? 20);
    h.precipitation.push(w.neerslag ?? 0);
    h.precipitation_probability.push(w.kans ?? 5);
    h.wind_speed_10m.push(w.wind ?? 10);
    h.wind_direction_10m.push(225);
    h.wind_gusts_10m.push((w.wind ?? 10) + 6);
    h.relative_humidity_2m.push(w.rh ?? 55);
    h.cloud_cover.push(w.bewolking ?? 20);
    h.uv_index.push(w.uv ?? 0);
    h.is_day.push(uur >= 6 && uur <= 21 ? 1 : 0);
  }
  return h;
}

test("terras: warme zonnige dag geeft hoge temp- en zon-score", () => {
  const hourly = maakHourly("2026-07-13", () => ({ gevoel: 24, wind: 8, bewolking: 10 }));
  const res = factorenVoor("terras", hourly, 0, { van: 12, tot: 20 });
  assert.ok(res, "profiel hoort te bestaan");
  const temp = res.factoren.find((f) => f.id === "temp");
  const zon = res.factoren.find((f) => f.id === "zon");
  assert.ok(temp.score >= 90, `temp ${temp.score}`);
  assert.ok(zon.score >= 85, `zon ${zon.score}`);
  const som = res.factoren.reduce((a, f) => a + f.gewicht, 0);
  assert.equal(som, 100, "gewichten tellen op tot 100");
});

test("was: droge winderige lucht scoort hoog op vocht en wind", () => {
  const hourly = maakHourly("2026-07-13", () => ({ rh: 48, wind: 24, gevoel: 16 }));
  const res = factorenVoor("was-buiten-drogen", hourly, 0);
  const vocht = res.factoren.find((f) => f.id === "vocht");
  const wind = res.factoren.find((f) => f.id === "wind");
  assert.ok(vocht.score >= 85, `vocht ${vocht.score}`);
  assert.ok(wind.score >= 85, `wind ${wind.score}`);
});

test("was: klamme windstille lucht scoort laag op vocht en wind", () => {
  const hourly = maakHourly("2026-07-13", () => ({ rh: 92, wind: 2, gevoel: 20 }));
  const res = factorenVoor("was-buiten-drogen", hourly, 0);
  const vocht = res.factoren.find((f) => f.id === "vocht");
  const wind = res.factoren.find((f) => f.id === "wind");
  assert.ok(vocht.score <= 15, `vocht ${vocht.score}`);
  assert.ok(wind.score <= 30, `wind ${wind.score}`);
});

test("zonkracht: felle zon geeft LAGE uv-gunstigheid (waarschuwing)", () => {
  const hourly = maakHourly("2026-07-13", (u) => ({ uv: u > 10 && u < 16 ? 7 : 1, bewolking: 10 }));
  const res = factorenVoor("zonkracht", hourly, 0, { van: 11, tot: 16 });
  const uv = res.factoren.find((f) => f.id === "uv");
  assert.ok(uv.score <= 30, `uv-gunstigheid ${uv.score} hoort laag`);
});

test("geen profiel (hooikoorts) geeft null", () => {
  const hourly = maakHourly("2026-07-13", () => ({}));
  assert.equal(factorenVoor("hooikoorts", hourly, 0), null);
});
