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

function maakMeerdaags(startDatum, dagenSpecs) {
  const alles = { time: [], temperature_2m: [], precipitation: [], precipitation_probability: [], wind_speed_10m: [], relative_humidity_2m: [] };
  const d0 = new Date(`${startDatum}T00:00:00`);
  dagenSpecs.forEach((per, di) => {
    const d = new Date(d0.getTime() + di * 24 * 3600 * 1000);
    const p = (n) => String(n).padStart(2, "0");
    const datum = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    const dag = maakHourly(datum, per);
    for (const k of Object.keys(alles)) alles[k].push(...dag[k]);
  });
  return alles;
}

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


/* P0-A acceptatietests (was): de verankerde curve. */

test("anker Apeldoorn: droogvenster van 3 uur geeft hooguit 6,5 en de tekst zegt krap", () => {
  // Sterk drogend maar kort venster, zoals het Apeldoorn-geval uit de audit.
  const hourly = maakHourly("2026-07-11", (uur) => ({
    temp: 19,
    neerslag: uur >= 9 && uur < 12 ? 0 : 0.6,
    kans: uur >= 9 && uur < 12 ? 10 : 80,
    wind: 20,
    rh: 50,
  }));
  const [dag] = berekenDroogdagen(hourly, NU);
  assert.equal(dag.venster.uren, 3);
  const cijfer = (100 - dag.oordeel.score) / 10;
  assert.ok(cijfer <= 6.5, `3 uur venster hoort <= 6,5, kreeg ${cijfer}`);
  assert.ok(cijfer >= 3.5, `maar niet als een regendag, kreeg ${cijfer}`);
  assert.ok(dag.oordeel.redenen.some((r) => r.includes("krap venster")));
});

test("anker: venster te kort om droog te krijgen landt rond de 3", () => {
  const hourly = maakHourly("2026-07-11", (uur) => ({
    temp: 15,
    neerslag: uur >= 10 && uur < 13 ? 0 : 0.6,
    kans: uur >= 10 && uur < 13 ? 15 : 80,
    wind: 8,
    rh: 74,
  }));
  const [dag] = berekenDroogdagen(hourly, NU);
  assert.ok(dag.venster && dag.droogUren == null, "venster bestaat maar is te kort");
  const cijfer = (100 - dag.oordeel.score) / 10;
  assert.ok(cijfer >= 2.5 && cijfer <= 4, `hoort rond de 3, kreeg ${cijfer}`);
  assert.match(dag.samenvatting, /te kort/);
  assert.equal(dag.oordeel.advies, "binnen drogen vandaag");
});

test("anker: minder dan 2 bruikbare uren geeft hooguit een 4", () => {
  const hourly = maakHourly("2026-07-11", (uur) => ({
    temp: 16,
    neerslag: uur === 13 ? 0 : 0.8,
    kans: uur === 13 ? 10 : 85,
    wind: 12,
    rh: 70,
  }));
  const [dag] = berekenDroogdagen(hourly, NU);
  assert.equal(dag.venster, null);
  assert.ok((100 - dag.oordeel.score) / 10 <= 4);
});

test("anker: volledig droge, luwe, milde dag is 9 of hoger", () => {
  const hourly = maakHourly("2026-07-11", () => ({
    temp: 19, neerslag: 0, kans: 5, wind: 9, rh: 55,
  }));
  const [dag] = berekenDroogdagen(hourly, NU);
  assert.ok((100 - dag.oordeel.score) / 10 >= 9);
});

test("spreiding: vijf gevarieerde dagen zijn niet allemaal 9 of hoger", () => {
  const droog = () => ({ temp: 19, neerslag: 0, kans: 5, wind: 12, rh: 55 });
  const regen = () => ({ temp: 14, neerslag: 1.0, kans: 90, wind: 10, rh: 92 });
  const krap = (uur) => (uur >= 10 && uur < 13 ? droog() : regen());
  const vochtigStil = () => ({ temp: 16, neerslag: 0, kans: 15, wind: 4, rh: 82 });
  const halfje = (uur) => (uur < 14 ? droog() : regen());
  const hourly = maakMeerdaags("2026-07-11", [droog, regen, krap, vochtigStil, halfje]);
  const dagen = berekenDroogdagen(hourly, NU);
  assert.equal(dagen.length, 5);
  const cijfers = dagen.map((d) => (100 - d.oordeel.score) / 10);
  assert.ok(cijfers.filter((c) => c >= 9).length <= 2, `te veel negens: ${cijfers}`);
  assert.ok(Math.min(...cijfers) <= 4, `de regendag hoort laag: ${cijfers}`);
  assert.ok(cijfers.some((c) => c > 4 && c < 8.5), `middenmoot bestaat: ${cijfers}`);
});

test("consistentie-cap: past de droogtijd in het venster, dan nooit binnen drogen als advies", () => {
  // Matig venster van 5 uur, matige droogkracht, buien eromheen.
  const hourly = maakHourly("2026-07-11", (uur) => ({
    temp: 18,
    neerslag: uur >= 9 && uur < 14 ? 0 : 0.7,
    kans: uur >= 9 && uur < 14 ? 20 : 85,
    wind: 14,
    rh: 65,
  }));
  const [dag] = berekenDroogdagen(hourly, NU);
  if (dag.droogUren != null) {
    assert.match(dag.samenvatting, /hang de was buiten/i);
    assert.notEqual(dag.oordeel.advies, "binnen drogen vandaag");
    assert.ok(dag.oordeel.score <= 58);
  }
});
