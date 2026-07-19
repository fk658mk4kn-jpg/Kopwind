import test from "node:test";
import assert from "node:assert/strict";
import { kleding } from "../lib/tools/kleding.js";

/**
 * Verleden-lekken in het kledingadvies (v3.26.0, feedback Martijn):
 * om 20:00 hoort het advies over de avond te gaan, niet over een
 * voorbije warme middag; "vanochtend vroeg een jas" en een bui van
 * 08:00 horen dan uit de zin. Testdag: bui om 08:00, warme middag
 * (20 graden), frisse avond (10 graden).
 */

function maakDag() {
  const time = [];
  const temperature_2m = [];
  const apparent_temperature = [];
  const precipitation = [];
  for (let u = 0; u < 24; u++) {
    time.push(`2026-07-17T${String(u).padStart(2, "0")}:00`);
    const temp = u < 12 ? 12 : u < 18 ? 20 : 10;
    temperature_2m.push(temp);
    apparent_temperature.push(temp);
    precipitation.push(u === 8 ? 1.5 : 0);
  }
  return { time, temperature_2m, apparent_temperature, precipitation };
}

test("kleding om 09:00: middag is de hoofdlaag, ochtendbui telt mee", () => {
  const dag = kleding.overlay(maakDag(), new Date("2026-07-17T07:30:00")).dagen[0];
  // Middag 20 graden: hoofdlaag T-shirt-met-laagje of lichter.
  assert.ok(dag.outfit.laagIndex <= 1, `verwachtte zomerse hoofdlaag, kreeg ${dag.outfit.laagIndex}`);
  assert.ok(/08:00/.test(dag.antwoord.zin), `bui van 08:00 hoort in de ochtendzin: ${dag.antwoord.zin}`);
});

test("kleding om 20:00: avond is de hoofdlaag, ochtend en bui zijn weg", () => {
  const dag = kleding.overlay(maakDag(), new Date("2026-07-17T20:00:00")).dagen[0];
  // Avond 10 graden: trui of meer.
  assert.ok(dag.outfit.laagIndex >= 2, `verwachtte een frisse avondlaag, kreeg ${dag.outfit.laagIndex}`);
  assert.ok(!dag.antwoord.zin.includes("vanochtend"), `geen ochtendadvies om 20:00: ${dag.antwoord.zin}`);
  assert.ok(!/08:00/.test(dag.antwoord.zin), `voorbije bui hoort niet in de zin: ${dag.antwoord.zin}`);
});

test("kleding: morgen-dagen houden het volledige dagbeeld", () => {
  const dagen = kleding.overlay(maakDag(), new Date("2026-07-16T21:00:00")).dagen;
  const morgen = dagen.find((d) => d.datum === "2026-07-17");
  assert.ok(morgen, "testdag hoort als toekomstdag mee te draaien");
  assert.ok(morgen.outfit.laagIndex <= 1, "toekomstdag rekent met de middag");
});
