/**
 * tests/v336.test.js
 *
 * v3.36.0 "Bise": de sneeuwcheck, de stadschakelaar, de seizoenslijst op
 * de homepage, de witte-kerstpagina en de widgetregel.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { overlay, sneeuw } from "../lib/tools/sneeuw.js";
import { TOOLS } from "../lib/tools/index.js";
import { STEDEN } from "../lib/steden/nl.js";
import {
  stadIndexeerbaar, routeIndexeerbaar, stadIndexBeperkt, INDEX_STEDEN, INDEX_CHECKS,
} from "../lib/seo/indexering.js";
import { SEIZOEN_POPULAIR, seizoenVanMaand, huidigSeizoen } from "../lib/seizoen.js";
import { vindAftellerOpId, widgetRegel, volgende, aftelMeta } from "../lib/aftellen/index.js";
import { amsterdamTijdstip, ymd } from "../lib/aftellen/datums.js";
import { inhoudVoorTool } from "../content/index.js";

/** Synthetische uurreeks: een dag, met per uur sneeuw (cm) en temperatuur. */
function dag(datum, { sneeuwPerUur = () => 0, temp = () => 0, regen = () => 0 } = {}) {
  const h = { time: [], temperature_2m: [], precipitation: [], snowfall: [], snow_depth: [] };
  for (let u = 0; u < 24; u++) {
    h.time.push(`${datum}T${String(u).padStart(2, "0")}:00`);
    h.temperature_2m.push(temp(u));
    h.snowfall.push(sneeuwPerUur(u));
    h.precipitation.push(regen(u) + sneeuwPerUur(u) / 0.7);
    h.snow_depth.push(0);
  }
  return h;
}
const NU = new Date(2026, 11, 10, 0, 0);

test("sneeuwcheck: geen sneeuw is groen", () => {
  const d = overlay(dag("2026-12-10"), NU).dagen[0];
  assert.equal(d.antwoord.ja, true);
  assert.ok(d.conditie.score < 30);
});

test("sneeuwcheck: flink pak is rood en noemt het eerste uur", () => {
  const d = overlay(dag("2026-12-10", { sneeuwPerUur: (u) => (u >= 15 && u < 20 ? 1.2 : 0), temp: () => -1 }), NU).dagen[0];
  assert.ok(d.conditie.score >= 80, `score ${d.conditie.score}`);
  assert.match(d.antwoord.zin, /15:00/);
  assert.match(d.metric.zin, /6 cm/);
});

test("sneeuwcheck: natte sneeuw telt alleen als die aanstaat", () => {
  const h = dag("2026-12-10", { temp: () => 1, regen: (u) => (u === 8 ? 0.5 : 0) });
  const met = overlay(h, NU, { nat: 0 }).dagen[0];
  const zonder = overlay(h, NU, { nat: 1 }).dagen[0];
  assert.ok(met.conditie.score > zonder.conditie.score);
  assert.match(met.antwoord.zin, /08:00/);
});

test("sneeuwcheck: onder de eigen grens slaat het oordeel niet om", () => {
  const h = dag("2026-12-10", { sneeuwPerUur: (u) => (u >= 10 && u < 13 ? 0.6 : 0), temp: () => 0 });
  const laag = overlay(h, NU, { grens: 0 }).dagen[0];
  const hoog = overlay(h, NU, { grens: 2 }).dagen[0];
  assert.ok(laag.conditie.score >= 60);
  assert.ok(hoog.conditie.score <= 28);
});

test("sneeuwcheck staat in het register met NL-content en het vlok-icoon", () => {
  assert.ok(TOOLS.find((t) => t.id === "sneeuw"));
  assert.equal(sneeuw.icoon, "vlok");
  const inhoud = inhoudVoorTool("gaat-het-sneeuwen");
  assert.ok(inhoud && inhoud.blokken.length >= 3 && inhoud.faq.length >= 4);
});

test("stadschakelaar: standaard uit, aan met de env-variabele", () => {
  assert.equal(stadIndexBeperkt({}), false);
  assert.equal(stadIndexBeperkt({ STAD_INDEX_BEPERKT: "1" }), true);
  assert.equal(stadIndexeerbaar("muggen", "emmen", false), true);
  assert.equal(stadIndexeerbaar("muggen", "amsterdam", true), false);
  assert.equal(stadIndexeerbaar("terras", "emmen", true), false);
  assert.equal(stadIndexeerbaar("terras", "amsterdam", true), true);
  assert.equal(routeIndexeerbaar(true), false);
  assert.equal(routeIndexeerbaar(false), true);
});

test("stadschakelaar: lijsten verwijzen naar bestaande steden en checks", () => {
  const steden = new Set(STEDEN.map((s) => s.slug));
  const ids = new Set(TOOLS.map((t) => t.id));
  for (const s of INDEX_STEDEN) assert.ok(steden.has(s), s);
  for (const c of INDEX_CHECKS) assert.ok(ids.has(c), c);
  assert.equal(INDEX_STEDEN.length * INDEX_CHECKS.length, 100);
});

test("seizoenslijsten: zes bestaande checks per seizoen", () => {
  const ids = new Set(TOOLS.map((t) => t.id));
  for (const [s, lijst] of Object.entries(SEIZOEN_POPULAIR)) {
    assert.equal(lijst.length, 6, s);
    for (const id of lijst) assert.ok(ids.has(id), `${s}: ${id}`);
  }
  assert.equal(seizoenVanMaand(11), "herfst");
  assert.equal(seizoenVanMaand(12), "winter");
  assert.equal(seizoenVanMaand(2), "winter");
  assert.equal(seizoenVanMaand(7), "zomer");
  assert.equal(huidigSeizoen(amsterdamTijdstip(ymd(2026, 12, 1), 0, 30)), "winter");
});

test("witte kerst: telt naar 25 december en loopt t/m Tweede Kerstdag", () => {
  const w = vindAftellerOpId("witte-kerst");
  const op26 = volgende(w, amsterdamTijdstip(ymd(2026, 12, 26), 12, 0))[0];
  assert.equal(op26.bezig, true);
  assert.equal(op26.start.d, 25);
  assert.match(aftelMeta(w, amsterdamTijdstip(ymd(2026, 12, 20), 12, 0)).title, /De verwachting/);
  assert.match(aftelMeta(w, amsterdamTijdstip(ymd(2026, 11, 15), 12, 0)).title, /Nog 40 dagen/);
});

test("widgetregel: dagen, vandaag en vakantieregio", () => {
  const k = vindAftellerOpId("kerst");
  assert.deepEqual(widgetRegel(k, amsterdamTijdstip(ymd(2026, 12, 24), 12, 0)), { dagen: 1, regel: "nog 1 dag tot kerst" });
  assert.equal(widgetRegel(k, amsterdamTijdstip(ymd(2026, 12, 25), 12, 0)).regel, "Vandaag is het kerst");
  const z = widgetRegel(vindAftellerOpId("zomervakantie"), amsterdamTijdstip(ymd(2027, 7, 1), 12, 0));
  assert.match(z.regel, /regio noord/);
});
