import test from "node:test";
import assert from "node:assert/strict";
import { overlay, klasseVoor } from "../lib/tools/hooikoorts.js";

function maakHourly(datum, per) {
  const h = { time: [], grass_pollen: [], birch_pollen: [], alder_pollen: [] };
  for (let uur = 0; uur < 24; uur++) {
    const w = per(uur);
    h.time.push(`${datum}T${String(uur).padStart(2, "0")}:00`);
    h.grass_pollen.push(w.gras ?? 0);
    h.birch_pollen.push(w.berk ?? 0);
    h.alder_pollen.push(w.els ?? 0);
  }
  return h;
}

test("grasdag in juli: last, redenen en het rustigste blok in de ochtend", () => {
  const hourly = maakHourly("2026-07-13", (u) => ({ gras: u < 8 ? 8 : u < 12 ? 60 : 140 }));
  const dag = overlay(hourly, new Date(2026, 6, 13, 9, 0)).dagen[0];
  assert.equal(dag.antwoord.ja, true);
  assert.match(dag.antwoord.zin, /graspollen/);
  assert.match(dag.antwoord.zin, /Rustigste blok: 00:00-08:00/);
  assert.ok(dag.conditie.redenen.some((r) => r.includes("graspollen pieken op 140")), dag.conditie.redenen.join());
  assert.ok(dag.conditie.score >= 45, `pijnscore ${dag.conditie.score}`);
  assert.match(dag.metric.zin, /Gras: hoog \(140\/m/);
});

test("buiten het seizoen: eerlijk 'geen pollen' in plaats van een leeg antwoord", () => {
  const hourly = maakHourly("2026-07-13", () => ({}));
  const dag = overlay(hourly, new Date(2026, 6, 13, 9, 0)).dagen[0];
  assert.equal(dag.antwoord.ja, false);
  assert.match(dag.antwoord.zin, /seizoen is voorbij of nog niet begonnen/);
  assert.ok(dag.conditie.score <= 12);
});

test("gevoeligheid verschuift de grens: factor 0.7 maakt van laag matig", () => {
  assert.equal(klasseVoor("gras", 25, 1), 0);
  assert.equal(klasseVoor("gras", 25, 0.7), 1);
});

test("focus op bomen dempt gras", () => {
  const hourly = maakHourly("2026-07-13", () => ({ gras: 70 }));
  const alles = overlay(hourly, new Date(2026, 6, 13, 9, 0), { factor: 1, focus: "alles" }).dagen[0];
  const bomen = overlay(hourly, new Date(2026, 6, 13, 9, 0), { factor: 1, focus: "bomen" }).dagen[0];
  assert.equal(alles.antwoord.ja, true);
  assert.equal(bomen.antwoord.ja, false);
});

test("twee soorten tegelijk: de tweede komt in de redenen", () => {
  const hourly = maakHourly("2026-04-15", () => ({ berk: 500, els: 220 }));
  const dag = overlay(hourly, new Date(2026, 3, 15, 9, 0)).dagen[0];
  assert.ok(dag.conditie.redenen.some((r) => r.includes("ook els")), dag.conditie.redenen.join());
});
