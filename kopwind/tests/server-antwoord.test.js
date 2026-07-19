import test from "node:test";
import assert from "node:assert/strict";
import { bouwStadAntwoord } from "../lib/steden/serverAntwoord.js";
import { wandelen } from "../lib/tools/wandelen.js";
import { fietsNaarWerk } from "../lib/tools/fiets-naar-werk.js";
import { paraplu } from "../lib/tools/paraplu.js";

/**
 * Server-antwoordblok (v3.27.0): de pure opbouwfunctie levert voor
 * elke overlay-tool een badge-label, kleur en kernzin op
 * standaardinstellingen; kapotte invoer geeft null (het blok faalt
 * stil). De servercomponent zelf is alleen fetch plus opmaak.
 */

function maakDag() {
  const time = [];
  const temperature_2m = [];
  const apparent_temperature = [];
  const precipitation = [];
  const precipitation_probability = [];
  const wind_speed_10m = [];
  for (let u = 0; u < 24; u++) {
    time.push(`2026-07-17T${String(u).padStart(2, "0")}:00`);
    temperature_2m.push(16);
    apparent_temperature.push(16);
    precipitation.push(0);
    precipitation_probability.push(5);
    wind_speed_10m.push(10);
  }
  return { time, temperature_2m, apparent_temperature, precipitation, precipitation_probability, wind_speed_10m };
}

const NU = new Date("2026-07-17T09:00:00");

test("serverantwoord: venstermotor-tool levert label, kleur en zin", () => {
  const uit = bouwStadAntwoord(wandelen, maakDag(), NU);
  assert.ok(uit, "verwachtte een antwoordblok");
  assert.ok(uit.label.length > 3 && uit.zin.length > 10, JSON.stringify(uit));
  assert.ok(["groen", "oranje", "rood"].some((k) => uit.kleur.includes(k)) || uit.kleur.length > 0);
});

test("serverantwoord: het fiets-regioverdict draagt het stadblok van de fietscheck", () => {
  const uit = bouwStadAntwoord(fietsNaarWerk, maakDag(), NU);
  assert.ok(uit, "fiets hoort sinds het regioverdict een serverantwoord te hebben");
  assert.ok(uit.zin.length > 10, uit.zin);
});

test("serverantwoord: nowcast-dagoverlay werkt ook (paraplu)", () => {
  const uit = bouwStadAntwoord(paraplu, maakDag(), NU);
  assert.ok(uit && uit.zin.length > 5, JSON.stringify(uit));
});

test("serverantwoord: kapotte invoer faalt stil naar null", () => {
  assert.equal(bouwStadAntwoord(wandelen, null, NU), null);
  assert.equal(bouwStadAntwoord({ overlay: () => { throw new Error("boem"); }, schaalLabels: {} }, maakDag(), NU), null);
  assert.equal(bouwStadAntwoord({ schaalLabels: {} }, maakDag(), NU), null);
});
