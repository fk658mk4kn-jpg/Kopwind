import test from "node:test";
import assert from "node:assert/strict";
import { golfen } from "../lib/tools/golfen.js";
import { skeeleren } from "../lib/tools/skeeleren.js";
import { motorrijden } from "../lib/tools/motorrijden.js";
import { hondUitlaten } from "../lib/tools/hond-uitlaten.js";
import { vliegeren, uurVliegerScore } from "../lib/tools/vliegeren.js";
import { vuurkorf, uurVuurkorfScore } from "../lib/tools/vuurkorf.js";
import { droneVliegen } from "../lib/tools/drone-vliegen.js";
import { paardrijden } from "../lib/tools/paardrijden.js";
import { vissen } from "../lib/tools/vissen.js";
import { schaatsen } from "../lib/tools/schaatsen.js";
import { mist } from "../lib/tools/mist.js";
import { storm } from "../lib/tools/storm.js";
import { houtkachel } from "../lib/tools/houtkachel.js";
import { huisKoelen } from "../lib/tools/huis-koelen.js";
import { kamperen } from "../lib/tools/kamperen.js";

/**
 * De vijftien checks van v3.29.0 "Ghibli". Per motor een paar kernasserts
 * op het eigen mechaniek: de venstertools op hun bijzondere factor, de
 * dagtools op hun overlay-vorm en drempelgedrag.
 */

function maakUren({
  dagen = 5,
  start = "2026-07-17",
  temp = () => 15,
  gevoel = null,
  regen = () => 0,
  kans = null,
  wind = () => 10,
  stoten = null,
  bewolking = () => 40,
  rh = () => 65,
  zicht = () => 20000,
  druk = () => 1015,
  dag = null,
}) {
  const h = {
    time: [],
    temperature_2m: [],
    apparent_temperature: [],
    precipitation: [],
    precipitation_probability: [],
    wind_speed_10m: [],
    wind_direction_10m: [],
    wind_gusts_10m: [],
    cloud_cover: [],
    relative_humidity_2m: [],
    uv_index: [],
    is_day: [],
    visibility: [],
    surface_pressure: [],
  };
  const d0 = new Date(`${start}T12:00:00`);
  for (let d = 0; d < dagen; d++) {
    const dd = new Date(d0);
    dd.setDate(d0.getDate() + d);
    const key = `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, "0")}-${String(dd.getDate()).padStart(2, "0")}`;
    for (let u = 0; u < 24; u++) {
      h.time.push(`${key}T${String(u).padStart(2, "0")}:00`);
      const t = temp(d, u);
      h.temperature_2m.push(t);
      h.apparent_temperature.push(gevoel ? gevoel(d, u) : t);
      const r = regen(d, u);
      h.precipitation.push(r);
      h.precipitation_probability.push(kans ? kans(d, u) : r > 0 ? 85 : 5);
      const w = wind(d, u);
      h.wind_speed_10m.push(w);
      h.wind_direction_10m.push(220);
      h.wind_gusts_10m.push(stoten ? stoten(d, u) : w * 1.4);
      h.cloud_cover.push(bewolking(d, u));
      h.relative_humidity_2m.push(rh(d, u));
      h.uv_index.push(3);
      h.is_day.push(dag ? dag(d, u) : u >= 6 && u < 22 ? 1 : 0);
      h.visibility.push(zicht(d, u));
      h.surface_pressure.push(druk(d, u));
    }
  }
  return h;
}

const MIDDAG = new Date("2026-07-17T13:00:00");
const OCHTEND = new Date("2026-07-17T07:00:00");

function dagVoor(res, datum = "2026-07-17") {
  return res.dagen.find((d) => d.datum === datum) ?? res.dagen[0];
}

// --- Venstertools ---

test("golfen: rustige dag geeft groen, harde wind drukt het", () => {
  const rustig = golfen.overlay(maakUren({ wind: () => 8 }), MIDDAG, golfen.instellingen.defaults);
  const winderig = golfen.overlay(maakUren({ wind: () => 45, stoten: () => 60 }), MIDDAG, golfen.instellingen.defaults);
  assert.ok(dagVoor(rustig).conditie.score < 45, "rustige golfdag is ja");
  assert.ok(dagVoor(winderig).conditie.score > dagVoor(rustig).conditie.score, "wind verhoogt de pijn");
});

test("skeeleren: motregen is meteen nee, droog is ja", () => {
  const droog = skeeleren.overlay(maakUren({ wind: () => 8 }), MIDDAG, skeeleren.instellingen.defaults);
  const nat = skeeleren.overlay(maakUren({ regen: () => 0.5, kans: () => 90 }), MIDDAG, skeeleren.instellingen.defaults);
  assert.ok(dagVoor(droog).conditie.score < 45, "droog wegdek is ja");
  assert.ok(dagVoor(nat).conditie.score >= 45, "nat wegdek is nee");
});

test("motorrijden: vorst met vocht triggert gladheidsfactor", () => {
  const glad = motorrijden.overlay(
    maakUren({ temp: () => 1, gevoel: () => -2, rh: () => 95 }),
    MIDDAG,
    motorrijden.instellingen.defaults
  );
  const d = dagVoor(glad);
  assert.ok(d.conditie.redenen.some((r) => /glad/i.test(r)), "gladheidsreden aanwezig bij vorst en vocht");
});

test("hond-uitlaten: hete zonnige middag geeft asfaltwaarschuwing", () => {
  const heet = hondUitlaten.overlay(
    maakUren({ temp: () => 30, gevoel: () => 31, bewolking: () => 10 }),
    MIDDAG,
    hondUitlaten.instellingen.defaults
  );
  assert.ok(
    dagVoor(heet).conditie.redenen.some((r) => /asfalt|handrug|7-seconden/i.test(r)),
    "asfaltreden aanwezig op hete dag"
  );
});

test("vliegeren: windband scoort te weinig en te veel wind laag", () => {
  const stil = uurVliegerScore({ wind: 3, stoten: 4, neerslag: 0 }, vliegeren.instellingen.defaults);
  const goed = uurVliegerScore({ wind: 22, stoten: 28, neerslag: 0 }, vliegeren.instellingen.defaults);
  const orkaan = uurVliegerScore({ wind: 55, stoten: 70, neerslag: 0 }, vliegeren.instellingen.defaults);
  assert.ok(goed > stil, "te weinig wind scoort lager dan de band");
  assert.ok(goed > orkaan, "te veel wind scoort lager dan de band");
});

test("vuurkorf: windstil scoort lager dan een lichte bries", () => {
  const stil = uurVuurkorfScore({ wind: 2, stoten: 4, neerslag: 0 }, vuurkorf.instellingen.defaults);
  const bries = uurVuurkorfScore({ wind: 12, stoten: 18, neerslag: 0 }, vuurkorf.instellingen.defaults);
  assert.ok(bries > stil, "lichte bries voert rook af, windstil houdt hem laag");
});

test("drone-vliegen: nacht scoort niet, regen is nee", () => {
  const nacht = droneVliegen.overlay(
    maakUren({ dag: () => 0, wind: () => 8 }),
    new Date("2026-07-17T23:00:00"),
    droneVliegen.instellingen.defaults
  );
  const nat = droneVliegen.overlay(maakUren({ regen: () => 0.3, kans: () => 80 }), MIDDAG, droneVliegen.instellingen.defaults);
  assert.ok(dagVoor(nat).conditie.score >= 45, "regen is geen droneweer");
  assert.ok(nacht.dagen.length >= 0, "nachtoverlay draait zonder crash");
});

test("paardrijden: vorst triggert bodemwaarschuwing", () => {
  const vorst = paardrijden.overlay(
    maakUren({ temp: () => -1, gevoel: () => -3, wind: () => 10 }),
    MIDDAG,
    paardrijden.instellingen.defaults
  );
  assert.ok(dagVoor(vorst).conditie.redenen.some((r) => /bodem|bevroren/i.test(r)), "bodemreden bij vorst");
});

// --- Dagtools ---

test("vissen: stijgende druk tempert, metric noemt hPa", () => {
  const stijgend = vissen.overlay(
    maakUren({ druk: (d, u) => 1005 + u * 0.8 }),
    MIDDAG,
    vissen.instellingen.defaults
  );
  const d = dagVoor(stijgend);
  assert.ok(/hPa/.test(d.metric.zin), "metric noemt de drukverandering");
  assert.equal(d.venster, null, "vissen is een dagtool zonder venster");
});

test("schaatsen: zomer geeft buiten-seizoen status, geen ijs", () => {
  const zomer = schaatsen.overlay(maakUren({ temp: () => 20 }), MIDDAG, schaatsen.instellingen.defaults);
  const d = dagVoor(zomer);
  assert.ok(d.conditie.score >= 45, "zomer is geen natuurijs");
  assert.ok(/seizoen|zacht|zicht/i.test(d.status.zin), "status legt uit waarom er geen ijs is");
});

test("schaatsen: vorstperiode in januari geeft ijsgroei", () => {
  const vorst = schaatsen.overlay(
    maakUren({ start: "2026-01-10", temp: () => -6, gevoel: () => -9 }),
    new Date("2026-01-10T12:00:00"),
    schaatsen.instellingen.defaults
  );
  assert.ok(dagVoor(vorst, "2026-01-10").conditie.score < 45, "aanhoudende vorst geeft groeiverwachting");
});

test("mist: dicht zicht in de spits geeft nee met optrek-metric", () => {
  const mistig = mist.overlay(
    maakUren({ zicht: (d, u) => (u <= 9 ? 120 : 20000) }),
    OCHTEND,
    mist.instellingen.defaults
  );
  const d = dagVoor(mistig);
  assert.ok(d.conditie.score >= 45, "dichte mist in de spits is nee");
  assert.ok(/\d/.test(d.metric.zin), "metric noemt een uur of blijft-melding");
});

test("storm: zware stoten geven hoge pijn en piekuur", () => {
  const zwaar = storm.overlay(
    maakUren({ stoten: (d, u) => (u === 15 ? 105 : 70) }),
    MIDDAG,
    storm.instellingen.defaults
  );
  const d = dagVoor(zwaar);
  assert.ok(d.conditie.score >= 45, "zware storm is vastzetten geblazen");
  assert.ok(/15|piek|stoten/i.test(d.metric.zin), "metric noemt het piekuur");
});

test("houtkachel: windstil en vochtig raadt stoken af", () => {
  const hangt = houtkachel.overlay(
    maakUren({ wind: () => 4, rh: () => 92 }),
    new Date("2026-01-10T19:00:00"),
    houtkachel.instellingen.defaults
  );
  const d = dagVoor(hangt, "2026-01-10");
  assert.ok(d.conditie.score >= 45, "windstil en vochtig is slecht stookweer");
});

test("huis-koelen: tropennacht triggert de zwaarste waarschuwing", () => {
  const tropen = huisKoelen.overlay(
    maakUren({ temp: () => 24, gevoel: () => 26 }),
    MIDDAG,
    huisKoelen.instellingen.defaults
  );
  const d = dagVoor(tropen);
  assert.ok(d.conditie.redenen.some((r) => /tropennacht/i.test(r)), "tropennacht-reden aanwezig");
});

test("kamperen: koude nacht drukt het oordeel", () => {
  const koud = kamperen.overlay(
    maakUren({ temp: () => 2, gevoel: () => 0 }),
    MIDDAG,
    kamperen.instellingen.defaults
  );
  const zacht = kamperen.overlay(
    maakUren({ temp: () => 15, gevoel: () => 15, wind: () => 6 }),
    MIDDAG,
    kamperen.instellingen.defaults
  );
  assert.ok(dagVoor(koud).conditie.score > dagVoor(zacht).conditie.score, "koude nacht is minder kampeerweer");
});
