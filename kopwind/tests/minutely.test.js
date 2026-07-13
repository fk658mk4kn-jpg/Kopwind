import test from "node:test";
import assert from "node:assert/strict";
import { analyseerMinutely } from "../lib/engine/minutely.js";

function reeks(startISO, mmPer) {
  // 48 kwartieren vanaf startISO
  const time = [];
  const precipitation = [];
  const precipitation_probability = [];
  let t = new Date(startISO);
  for (let i = 0; i < 48; i++) {
    time.push(t.toISOString().slice(0, 16));
    const mm = mmPer(i);
    precipitation.push(mm);
    precipitation_probability.push(mm > 0 ? 80 : 10);
    t = new Date(t.getTime() + 15 * 60 * 1000);
  }
  return { time, precipitation, precipitation_probability };
}

test("droog nu, bui over een uur: eersteRegen en binnenEenUur kloppen", () => {
  const nu = new Date("2026-07-13T12:00:00");
  // kwartier 4 (een uur later) begint regen
  const m = reeks("2026-07-13T12:00", (i) => (i >= 4 && i <= 8 ? 0.8 : 0));
  const r = analyseerMinutely(m, nu);
  assert.equal(r.nuNat, false);
  assert.ok(r.eersteRegen, "eersteRegen hoort gevuld");
  assert.equal(r.binnenEenUur, true, "regen begint precies op het uur");
  assert.ok(r.piek && r.piek.mm >= 0.8);
});

test("volledig droog: geen regen, niets binnen een uur", () => {
  const nu = new Date("2026-07-13T12:00:00");
  const m = reeks("2026-07-13T12:00", () => 0);
  const r = analyseerMinutely(m, nu);
  assert.equal(r.nuNat, false);
  assert.equal(r.eersteRegen, null);
  assert.equal(r.binnenEenUur, false);
  assert.equal(r.piek, null);
});

test("regen nu, droog over een uur: eersteDroog wordt gevonden", () => {
  const nu = new Date("2026-07-13T12:00:00");
  // eerste vier kwartier nat, daarna droog
  const m = reeks("2026-07-13T12:00", (i) => (i < 4 ? 1.2 : 0));
  const r = analyseerMinutely(m, nu);
  assert.equal(r.nuNat, true);
  assert.ok(r.eersteDroog, "eersteDroog hoort gevuld");
});

test("verleden kwartieren worden genegeerd", () => {
  const nu = new Date("2026-07-13T12:00:00");
  const m = reeks("2026-07-13T10:00", (i) => (i < 4 ? 2 : 0)); // regen in het verleden
  const r = analyseerMinutely(m, nu);
  // De regen zat 2 uur terug, dus nu droog en geen eersteRegen
  assert.equal(r.nuNat, false);
  assert.equal(r.eersteRegen, null);
});
