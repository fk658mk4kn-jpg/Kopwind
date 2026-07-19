import test from "node:test";
import assert from "node:assert/strict";
import { onkruid } from "../lib/tools/onkruid.js";
import { waterGeven } from "../lib/tools/water-geven.js";
import { grasZaaien, inZaaiseizoen } from "../lib/tools/gras-zaaien.js";
import { schaalVoor } from "../lib/engine/schaal.js";

/**
 * De drie tuintools van v3.28.0. Elke motor heeft een eigen hoek:
 * onkruid kiest de METHODE van de dag (schoffelen wil droog en zon,
 * wieden vochtige grond), water geven is urgentie als pijn (regen op
 * komst betekent niets doen), gras zaaien is kalender plus weer.
 */

function maakUren({
  dagen = 3,
  start = "2026-07-17",
  temp = () => 18,
  regen = () => 0,
  wind = () => 10,
  bewolking = () => 30,
  rh = () => 60,
}) {
  const h = {
    time: [],
    temperature_2m: [],
    apparent_temperature: [],
    precipitation: [],
    precipitation_probability: [],
    wind_speed_10m: [],
    cloud_cover: [],
    relative_humidity_2m: [],
  };
  const d0 = new Date(`${start}T12:00:00`);
  for (let d = 0; d < dagen; d++) {
    const dag = new Date(d0);
    dag.setDate(d0.getDate() + d);
    const key = `${dag.getFullYear()}-${String(dag.getMonth() + 1).padStart(2, "0")}-${String(dag.getDate()).padStart(2, "0")}`;
    for (let u = 0; u < 24; u++) {
      h.time.push(`${key}T${String(u).padStart(2, "0")}:00`);
      h.temperature_2m.push(temp(d, u));
      h.apparent_temperature.push(temp(d, u));
      h.precipitation.push(regen(d, u));
      h.precipitation_probability.push(regen(d, u) > 0 ? 85 : 5);
      h.wind_speed_10m.push(wind(d, u));
      h.cloud_cover.push(bewolking(d, u));
      h.relative_humidity_2m.push(rh(d, u));
    }
  }
  return h;
}

const OCHTEND = new Date("2026-07-17T08:00:00");

test("onkruid: droge zonnige dag is een schoffeldag", () => {
  const dag = onkruid.overlay(maakUren({}), OCHTEND).dagen[0];
  assert.equal(dag.antwoord.ja, true);
  assert.ok(/[Ss]choffel/.test(dag.antwoord.zin), dag.antwoord.zin);
  assert.equal(schaalVoor(dag.conditie.score).id, "ideaal");
});

test("onkruid: na regen eerder op de dag wint wieden", () => {
  const h = maakUren({ regen: (d, u) => (d === 0 && u >= 5 && u < 7 ? 1.2 : 0) });
  const middag = new Date("2026-07-17T11:00:00");
  const dag = onkruid.overlay(h, middag).dagen[0];
  assert.ok(/[Ww]ied/.test(dag.antwoord.zin), dag.antwoord.zin);
  assert.equal(dag.antwoord.ja, true);
});

test("onkruid: vaste schoffelaar krijgt de bui-waarschuwing met uur", () => {
  const h = maakUren({ regen: (d, u) => (d === 0 && u === 15 ? 1.5 : 0) });
  const dag = onkruid.overlay(h, OCHTEND, { methode: -1 }).dagen[0];
  assert.ok(/15:00/.test(dag.antwoord.zin), dag.antwoord.zin);
});

test("onkruid: bij vorst blijft alles staan", () => {
  const h = maakUren({ start: "2026-01-10", temp: () => -2 });
  const dag = onkruid.overlay(h, new Date("2026-01-10T09:00:00")).dagen[0];
  assert.equal(dag.antwoord.ja, false);
  assert.ok(dag.conditie.score >= 62);
});

test("water geven: met flinke regen op komst blijft de gieter binnen", () => {
  const h = maakUren({ regen: (d, u) => (d === 0 && u >= 18 && u < 22 ? 1.5 : 0) });
  const dag = waterGeven.overlay(h, OCHTEND).dagen[0];
  assert.equal(dag.antwoord.ja, false);
  assert.equal(schaalVoor(dag.conditie.score).id, "ideaal");
});

test("water geven: heet en droog betekent vanavond gieten, met moment-advies", () => {
  const h = maakUren({ temp: () => 30 });
  const dag = waterGeven.overlay(h, OCHTEND).dagen[0];
  assert.equal(dag.antwoord.ja, true);
  assert.ok(dag.conditie.score >= 45, `verwachtte gieturgentie, kreeg ${dag.conditie.score}`);
  assert.ok(/19:00/.test(dag.metric.zin), dag.metric.zin);
});

test("water geven: potten tellen strenger dan het gazon", () => {
  const h = maakUren({ temp: () => 24 });
  const potten = waterGeven.overlay(h, OCHTEND, { wat: -1 }).dagen[0];
  const gazon = waterGeven.overlay(h, OCHTEND, { wat: 1 }).dagen[0];
  assert.ok(potten.conditie.score > gazon.conditie.score);
});

test("gras zaaien: half juli is buiten het seizoen", () => {
  const dag = grasZaaien.overlay(maakUren({}), OCHTEND).dagen[0];
  assert.equal(dag.antwoord.ja, false);
  assert.ok(dag.conditie.score >= 62, `${dag.conditie.score}`);
  assert.ok(/Juli/.test(dag.metric.zin), dag.metric.zin);
});

test("gras zaaien: milde septemberdag met zachte regen vooruit is ideaal", () => {
  const h = maakUren({
    start: "2026-09-10",
    temp: () => 16,
    regen: (d, u) => (d === 1 && u >= 6 && u < 12 ? 0.7 : 0),
  });
  const dag = grasZaaien.overlay(h, new Date("2026-09-10T08:00:00")).dagen[0];
  assert.equal(dag.antwoord.ja, true);
  assert.equal(schaalVoor(dag.conditie.score).id, "ideaal");
  assert.ok(/regen/i.test(dag.antwoord.zin), dag.antwoord.zin);
});

test("zaaiseizoen: de randen kloppen, met grond-nuance", () => {
  assert.equal(inZaaiseizoen(new Date("2026-09-24")), true);
  assert.equal(inZaaiseizoen(new Date("2026-10-16"), 0), false);
  assert.equal(inZaaiseizoen(new Date("2026-10-20"), 1), true);
  assert.equal(inZaaiseizoen(new Date("2026-03-25"), -1), true);
  assert.equal(inZaaiseizoen(new Date("2026-03-24"), -1), false);
  assert.equal(inZaaiseizoen(new Date("2026-03-25"), 0), false);
});
