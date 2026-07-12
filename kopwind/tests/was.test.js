import test from "node:test";
import assert from "node:assert/strict";
import {
  uurDroogkracht,
  berekenDroogdagen,
} from "../lib/tools/was-buiten-drogen.js";

// Bouwt een synthetisch Open-Meteo hourly-blok voor 1 dag.
function maakHourly(datum, per) {
  const h = {
    time: [],
    temperature_2m: [],
    precipitation: [],
    precipitation_probability: [],
    wind_speed_10m: [],
    relative_humidity_2m: [],
  };
  for (let uur = 0; uur < 24; uur++) {
    const w = per(uur);
    h.time.push(`${datum}T${String(uur).padStart(2, "0")}:00`);
    h.temperature_2m.push(w.temp);
    h.precipitation.push(w.neerslag);
    h.precipitation_probability.push(w.kans);
    h.wind_speed_10m.push(w.wind);
    h.relative_humidity_2m.push(w.rh);
  }
  return h;
}

const NU = new Date(2026, 6, 11, 7, 0); // za 11 juli, 07:00

test("uurDroogkracht: regen of hoge buienkans maakt het uur ongeschikt", () => {
  assert.equal(uurDroogkracht({ rh: 50, temp: 20, wind: 20, neerslag: 0.5, neerslagKans: 0 }), 0);
  assert.equal(uurDroogkracht({ rh: 50, temp: 20, wind: 20, neerslag: 0, neerslagKans: 60 }), 0);
});

test("uurDroogkracht: wind helpt, vochtige lucht remt", () => {
  const basis = { temp: 18, neerslag: 0, neerslagKans: 10 };
  const metWind = uurDroogkracht({ ...basis, rh: 60, wind: 20 });
  const zonderWind = uurDroogkracht({ ...basis, rh: 60, wind: 0 });
  const vochtig = uurDroogkracht({ ...basis, rh: 90, wind: 20 });
  assert.ok(metWind > zonderWind, "wind geeft een bonus");
  assert.ok(vochtig < metWind, "hoge luchtvochtigheid drukt de droogkracht");
});

test("regendag: laag cijfer en samenvatting zegt binnen drogen (cijfer en tekst consistent)", () => {
  const hourly = maakHourly("2026-07-11", () => ({
    temp: 15, neerslag: 1.2, kans: 90, wind: 10, rh: 95,
  }));
  const [dag] = berekenDroogdagen(hourly, NU);
  assert.equal(dag.venster, null);
  assert.ok(dag.oordeel.score >= 60, "pijnscore hoort hoog te zijn");
  assert.equal(dag.oordeel.advies, "binnen drogen vandaag");
  assert.match(dag.samenvatting, /binnen drogen/i);
});

test("droge winderige dag: hoog cijfer en samenvatting noemt het venster (cijfer en tekst consistent)", () => {
  const hourly = maakHourly("2026-07-11", () => ({
    temp: 18, neerslag: 0, kans: 5, wind: 18, rh: 55,
  }));
  const [dag] = berekenDroogdagen(hourly, NU);
  assert.ok(dag.venster, "er hoort een venster te zijn");
  assert.ok(dag.oordeel.score < 30, `pijnscore hoort laag te zijn, was ${dag.oordeel.score}`);
  assert.equal(dag.oordeel.advies, "drooghangdag");
  assert.match(dag.samenvatting, /tussen \d{2}:00 en \d{2}:00/);
  assert.ok(dag.droogUren > 0, "geschatte droogtijd aanwezig");
});

test("regressie: als de samenvatting zegt buiten hangen, is het advies nooit binnen drogen", () => {
  const hourly = maakHourly("2026-07-11", (uur) => ({
    temp: 16,
    neerslag: uur >= 16 ? 0.8 : 0,
    kans: uur >= 16 ? 80 : 10,
    wind: 12,
    rh: 68,
  }));
  const [dag] = berekenDroogdagen(hourly, NU);
  if (/hang de was buiten/i.test(dag.samenvatting)) {
    assert.notEqual(dag.oordeel.advies, "binnen drogen vandaag");
    assert.ok(dag.oordeel.score < 60);
  }
});

test("vandaag telt alleen resterende uren mee", () => {
  const laat = new Date(2026, 6, 11, 18, 0);
  const hourly = maakHourly("2026-07-11", () => ({
    temp: 18, neerslag: 0, kans: 5, wind: 18, rh: 55,
  }));
  const [dag] = berekenDroogdagen(hourly, laat);
  // Om 18:00 resteren de uren 18 en 19: te kort voor een venster van 3 uur.
  assert.equal(dag.venster, null);
});
