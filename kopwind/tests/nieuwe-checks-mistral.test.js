import test from "node:test";
import assert from "node:assert/strict";
import { buitenSchilderen } from "../lib/tools/buiten-schilderen.js";
import { houtBehandelen } from "../lib/tools/hout-behandelen.js";
import { terrasReinigen } from "../lib/tools/terras-reinigen.js";
import { plantenBeschermen } from "../lib/tools/planten-beschermen.js";
import { sneeuwpret } from "../lib/tools/sneeuwpret.js";
import { strooien } from "../lib/tools/strooien.js";

/**
 * De zes checks van v3.30.0 "Mistral" (huis/tuinonderhoud + winter).
 * Per motor een paar kernasserts op het eigen mechaniek.
 */

function maakUren({
  dagen = 3,
  start = "2026-07-17",
  temp = () => 15,
  gevoel = null,
  regen = () => 0,
  kans = null,
  wind = () => 10,
  bewolking = () => 40,
  rh = () => 65,
  sneeuw = () => 0,
  sneeuwdek = () => 0,
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
    snowfall: [],
    snow_depth: [],
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
      h.wind_gusts_10m.push(w * 1.4);
      h.cloud_cover.push(bewolking(d, u));
      h.relative_humidity_2m.push(rh(d, u));
      h.uv_index.push(3);
      h.is_day.push(dag ? dag(d, u) : u >= 6 && u < 22 ? 1 : 0);
      h.snowfall.push(sneeuw(d, u));
      h.snow_depth.push(sneeuwdek(d, u));
    }
  }
  return h;
}

const MIDDAG = new Date("2026-07-17T13:00:00");
function dagVoor(res, datum = "2026-07-17") {
  return res.dagen.find((d) => d.datum === datum) ?? res.dagen[0];
}

// --- buiten-schilderen (venster) ---

test("schilderen: droge milde dag is ja, regen kort na het blok drukt", () => {
  const goed = buitenSchilderen.overlay(
    maakUren({ temp: () => 16, rh: () => 60 }),
    MIDDAG,
    buitenSchilderen.instellingen.defaults,
  );
  // Droog 's ochtends, regen vanaf 13:00: beste blok is de ochtend, met
  // naregen-straf.
  const naRegen = buitenSchilderen.overlay(
    maakUren({ temp: () => 16, rh: () => 60, regen: (d, u) => (u >= 13 && u <= 17 ? 0.6 : 0), kans: (d, u) => (u >= 13 && u <= 17 ? 85 : 5) }),
    MIDDAG,
    buitenSchilderen.instellingen.defaults,
  );
  assert.ok(dagVoor(goed).conditie.score < 45, "droge milde dag is schilderweer");
  assert.ok(dagVoor(naRegen).conditie.score > dagVoor(goed).conditie.score, "regen na het blok verhoogt de pijn");
});

// --- hout-behandelen (venster + opdroog) ---

test("hout-behandelen: nat hout van ochtendregen krijgt opdroogstraf", () => {
  const droog = houtBehandelen.overlay(
    maakUren({ temp: () => 17, rh: () => 60 }),
    MIDDAG,
    houtBehandelen.instellingen.defaults,
  );
  const natHout = houtBehandelen.overlay(
    maakUren({ temp: () => 17, rh: () => 70, regen: (d, u) => (u >= 6 && u <= 9 ? 0.8 : 0) }),
    MIDDAG,
    houtBehandelen.instellingen.defaults,
  );
  assert.ok(dagVoor(droog).conditie.score < 45, "droog hout op een milde dag is ja");
  assert.ok(dagVoor(natHout).conditie.score > dagVoor(droog).conditie.score, "ochtendregen maakt het hout nat");
});

// --- terras-reinigen (venster, vorst hard) ---

test("terras-reinigen: vorst is nee, milde dag is ja", () => {
  const vorst = terrasReinigen.overlay(
    maakUren({ temp: () => 0, gevoel: () => -2 }),
    MIDDAG,
    terrasReinigen.instellingen.defaults,
  );
  const mild = terrasReinigen.overlay(
    maakUren({ temp: () => 14, rh: () => 60 }),
    MIDDAG,
    terrasReinigen.instellingen.defaults,
  );
  assert.ok(dagVoor(vorst).conditie.score >= 45, "vorst is geen reinigweer");
  assert.ok(dagVoor(mild).conditie.score < 45, "milde droge dag is reinigweer");
});

// --- planten-beschermen (nacht, inverse polariteit, stralingsvorst) ---

test("planten-beschermen: warme nacht is veilig (ja), koude heldere nacht niet", () => {
  const warm = plantenBeschermen.overlay(
    maakUren({ temp: () => 9, bewolking: () => 80, wind: () => 15 }),
    MIDDAG,
    plantenBeschermen.instellingen.defaults,
  );
  const koudHelder = plantenBeschermen.overlay(
    maakUren({ temp: (d, u) => (u >= 20 || u < 8 ? 0 : 6), bewolking: () => 15, wind: () => 4 }),
    MIDDAG,
    plantenBeschermen.instellingen.defaults,
  );
  const w = dagVoor(warm);
  assert.ok(w.conditie.score < 45 && w.antwoord.ja === true, "warme nacht: geen bescherming nodig");
  assert.ok(dagVoor(koudHelder).conditie.score >= 45, "koude heldere nacht: bescherming nodig");
});

test("planten-beschermen: gevoelige zaailing lijdt eerder dan winterharde plant", () => {
  const uren = maakUren({ temp: (d, u) => (u >= 20 || u < 8 ? 2 : 8), bewolking: () => 30, wind: () => 6 });
  const winterhard = dagVoor(plantenBeschermen.overlay(uren, MIDDAG, { gevoeligheid: 0, standplaats: 1, afdekking: 0 }));
  const zaailing = dagVoor(plantenBeschermen.overlay(uren, MIDDAG, { gevoeligheid: 2, standplaats: 1, afdekking: 0 }));
  assert.ok(zaailing.conditie.score > winterhard.conditie.score, "zaailing gevoeliger dan winterhard");
});

// --- sneeuwpret (sneeuwdek) ---

test("sneeuwpret: geen sneeuw is nee, mooi koud pak is ja", () => {
  const geen = sneeuwpret.overlay(
    maakUren({ temp: () => 3, sneeuwdek: () => 0 }),
    MIDDAG,
    sneeuwpret.instellingen.defaults,
  );
  const pak = sneeuwpret.overlay(
    maakUren({ temp: () => -2, sneeuwdek: () => 0.12, sneeuw: (d, u) => (u === 8 ? 1 : 0) }),
    MIDDAG,
    sneeuwpret.instellingen.defaults,
  );
  assert.ok(dagVoor(geen).conditie.score >= 45, "geen sneeuw is geen sneeuwpret");
  assert.ok(dagVoor(pak).conditie.score < 45, "koud pak sneeuw is sneeuwpret");
});

test("sneeuwpret: dooi maakt van een pak sneeuw blubber", () => {
  const dooi = sneeuwpret.overlay(
    maakUren({ temp: (d, u) => (u >= 11 && u <= 15 ? 6 : 2), sneeuwdek: () => 0.1 }),
    MIDDAG,
    sneeuwpret.instellingen.defaults,
  );
  const koud = sneeuwpret.overlay(
    maakUren({ temp: () => -3, sneeuwdek: () => 0.1 }),
    MIDDAG,
    sneeuwpret.instellingen.defaults,
  );
  assert.ok(dagVoor(dooi).conditie.score > dagVoor(koud).conditie.score, "dooi verlaagt de sneeuwpret");
});

// --- strooien (nacht, vorst op nat) ---

test("strooien: vorst op natte tegels vraagt actie, zachte droge nacht niet", () => {
  const strooiNacht = strooien.overlay(
    maakUren({ temp: (d, u) => (u >= 20 || u < 8 ? -3 : 2), regen: (d, u) => (u >= 18 && u <= 21 ? 0.5 : 0) }),
    MIDDAG,
    strooien.instellingen.defaults,
  );
  const rustig = strooien.overlay(
    maakUren({ temp: () => 6, rh: () => 60 }),
    MIDDAG,
    strooien.instellingen.defaults,
  );
  assert.ok(dagVoor(strooiNacht).conditie.score >= 45, "aanvriezende natte tegels: strooien");
  assert.ok(dagVoor(rustig).conditie.score < 45, "zachte droge nacht: niets te doen");
});

test("strooien: nachtsneeuw vraagt om ruimen", () => {
  const sneeuwNacht = strooien.overlay(
    maakUren({ temp: (d, u) => (u >= 20 || u < 8 ? -1 : 1), sneeuw: (d, u) => (u >= 22 || u < 6 ? 1.2 : 0) }),
    MIDDAG,
    strooien.instellingen.defaults,
  );
  assert.ok(dagVoor(sneeuwNacht).conditie.score >= 45, "verse nachtsneeuw: ruimen");
});
