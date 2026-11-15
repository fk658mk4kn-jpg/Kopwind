/**
 * tests/v337.test.js
 *
 * v3.37.0 "Föhn": maanfasen, weeknummers, feestdagen, werkdagen,
 * leeftijd en verjaardag, de noorderlichtparser (oud en nieuw
 * NOAA-formaat) en de integriteit van de rekenpagina's.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fasenTussen, fasenInJaar, maanNu } from "../lib/maan.js";
import {
  ymd, isoWeek, maandagVanWeek, wekenInJaar, feestdagenLijst, werkdagenTussen, werkdagenPerMaand,
  kalenderVerschil, volgendeVerjaardag, amsterdamTijdstip,
} from "../lib/aftellen/datums.js";
import { parseKp, nachten, kpOordeel } from "../lib/noorderlicht.js";
import { REKENHULPEN } from "../lib/rekenhulpen.js";
import { REKEN_INHOUD } from "../content/rekenhulpen.js";
import { AFTELLERS, vindAftellerOpId, volgende, aftelMeta } from "../lib/aftellen/index.js";
import { alleToolSlugs } from "../lib/tools/index.js";
import { CATEGORIEEN } from "../lib/categorieen.js";
import { VARIANTEN } from "../lib/varianten.js";
import { TOOLS } from "../lib/tools/index.js";

const MIN = 60000;
const iso = (d) => `${d.j}-${d.m}-${d.d}`;

test("maanfasen binnen een paar minuten van gepubliceerde tijden", () => {
  const eclips = fasenTussen(Date.UTC(2024, 3, 7), Date.UTC(2024, 3, 9)).find((f) => f.soort === 0);
  assert.ok(Math.abs(eclips.tijdstip - Date.UTC(2024, 3, 8, 18, 21)) < 3 * MIN);
  const vol = fasenTussen(Date.UTC(2025, 0, 12), Date.UTC(2025, 0, 15)).find((f) => f.soort === 2);
  assert.ok(Math.abs(vol.tijdstip - Date.UTC(2025, 0, 13, 22, 27)) < 3 * MIN);
});

test("maan: twaalf of dertien volle manen per jaar, blauwe maan 2026", () => {
  assert.equal(fasenInJaar(2026).length, 13);
  assert.equal(fasenInJaar(2027).length, 12);
  assert.equal(maanNu(Date.UTC(2025, 0, 13, 22, 30)).naam, "Volle maan");
  assert.ok(maanNu(Date.UTC(2024, 3, 8, 19)).verlicht <= 1);
});

test("ISO-weeknummers rond de jaargrens", () => {
  assert.deepEqual(isoWeek(ymd(2026, 1, 1)), { jaar: 2026, week: 1 });
  assert.deepEqual(isoWeek(ymd(2027, 1, 1)), { jaar: 2026, week: 53 });
  assert.deepEqual(isoWeek(ymd(2027, 1, 4)), { jaar: 2027, week: 1 });
  assert.deepEqual(isoWeek(ymd(2024, 12, 30)), { jaar: 2025, week: 1 });
  assert.equal(iso(maandagVanWeek(2026, 1)), "2025-12-29");
  assert.equal(wekenInJaar(2026), 53);
  assert.equal(wekenInJaar(2027), 52);
});

test("feestdagen: elf per jaar, Goede Vrijdag als werkdag, lustrum", () => {
  const f = feestdagenLijst(2027);
  assert.equal(f.length, 11);
  assert.equal(iso(f.find((x) => x.id === "goede-vrijdag").datum), "2027-3-26");
  assert.equal(f.find((x) => x.id === "bevrijdingsdag").vrij, "lustrum");
  assert.equal(feestdagenLijst(2030).find((x) => x.id === "bevrijdingsdag").vrij, "ja");
});

test("werkdagen per jaar en tussen datums", () => {
  assert.equal(werkdagenPerMaand(2027).reduce((a, m) => a + m.werkdagen, 0), 256);
  assert.equal(werkdagenPerMaand(2026).reduce((a, m) => a + m.werkdagen, 0), 255);
  assert.equal(werkdagenTussen(ymd(2026, 11, 16), ymd(2026, 11, 20)), 5);
  assert.equal(werkdagenTussen(ymd(2026, 12, 21), ymd(2026, 12, 31)), 8);
  assert.equal(werkdagenTussen(ymd(2026, 12, 31), ymd(2026, 12, 1)), 0);
});

test("kalenderverschil en verjaardag (ook 29 februari)", () => {
  assert.deepEqual(kalenderVerschil(ymd(2026, 1, 15), ymd(2026, 3, 15)), { jaren: 0, maanden: 2, dagen: 0 });
  assert.deepEqual(kalenderVerschil(ymd(2000, 2, 29), ymd(2026, 11, 15)), { jaren: 26, maanden: 8, dagen: 17 });
  const v = volgendeVerjaardag(ymd(2000, 2, 29), ymd(2026, 11, 15));
  assert.equal(iso(v.datum), "2027-2-28");
  assert.equal(v.wordt, 27);
  assert.equal(volgendeVerjaardag(ymd(1990, 11, 15), ymd(2026, 11, 15)).dagen, 0);
});

const OUD = [
  ["time_tag", "kp", "observed", "noaa_scale"],
  ["2026-11-15 00:00:00", "2.67", "observed", null],
  ["2026-11-15 18:00:00", "5.33", "predicted", "G1"],
  ["2026-11-15 21:00:00", "6.00", "predicted", "G2"],
  ["2026-11-16 03:00:00", "7.33", "predicted", "G3"],
  ["2026-11-16 12:00:00", "3.00", "predicted", null],
  ["2026-11-16 21:00:00", "4.00", "predicted", null],
];
const NIEUW = OUD.slice(1).map((r) => ({ time_tag: r[0], kp: Number(r[1]), observed: r[2], noaa_scale: r[3] }));

test("noorderlicht: oud en nieuw NOAA-formaat geven hetzelfde", () => {
  const a = parseKp(OUD);
  assert.equal(a.length, 6);
  assert.deepEqual(a, parseKp(NIEUW));
  assert.deepEqual(parseKp(null), []);
  assert.deepEqual(parseKp([]), []);
});

test("noorderlicht: per nacht de hoogste Kp, 03:00 UTC hoort bij de avond ervoor", () => {
  const n = nachten(parseKp(OUD), Date.UTC(2026, 10, 15, 12));
  assert.equal(n[0].datum, "2026-11-15");
  assert.equal(n[0].kp, 7.33);
  assert.equal(n[1].datum, "2026-11-16");
  assert.equal(n[1].kp, 4);
});

test("noorderlicht: drempels voor Nederland", () => {
  assert.equal(kpOordeel(4.67).niveau, 0);
  assert.equal(kpOordeel(5).niveau, 1);
  assert.equal(kpOordeel(6.33).niveau, 2);
  assert.equal(kpOordeel(7).niveau, 3);
});

test("rekenpagina's: route, teksten en geen slugbotsing", () => {
  const bezet = new Set([
    ...alleToolSlugs(), ...CATEGORIEEN.map((c) => c.slug), ...VARIANTEN.map((v) => v.slug), ...AFTELLERS.map((a) => a.slug),
  ]);
  for (const r of REKENHULPEN) {
    assert.ok(existsSync(`app/${r.slug}/page.js`), `geen route voor ${r.slug}`);
    assert.ok(!bezet.has(r.slug), `slug botst: ${r.slug}`);
    const i = REKEN_INHOUD[r.id];
    assert.ok(i && i.h1 && i.intro && i.blokken.length >= 2 && i.faq.length >= 3, `tekst ${r.id}`);
  }
});

test("rekenteksten: inline links wijzen naar bestaande checks", async () => {
  const { parseInlineLinks } = await import("../lib/inlineLinks.js");
  const ids = new Set(TOOLS.map((t) => t.id));
  for (const i of Object.values(REKEN_INHOUD)) {
    for (const t of [i.intro, ...i.blokken.map((b) => b.tekst), ...i.faq.map((f) => f.a)]) {
      for (const d of parseInlineLinks(t)) {
        if (d.type === "tool") assert.ok(ids.has(d.toolId), d.toolId);
      }
    }
  }
});

test("nieuwe tellers: volle maan met exacte tijd, IJsheiligen als periode", () => {
  const nu = amsterdamTijdstip(ymd(2026, 11, 15), 12, 0);
  const vm = volgende(vindAftellerOpId("volle-maan"), nu)[0];
  assert.equal(iso(vm.start), "2026-11-24");
  assert.ok(Math.abs(vm.doelTijdstip - Date.UTC(2026, 10, 24, 14, 53)) < 3 * MIN);
  const ij = volgende(vindAftellerOpId("ijsheiligen"), amsterdamTijdstip(ymd(2027, 5, 13), 12, 0))[0];
  assert.equal(ij.bezig, true);
  for (const id of ["sint-maarten", "dierendag", "ijsheiligen", "perseiden", "volle-maan", "zonsopkomst"]) {
    const t = aftelMeta(vindAftellerOpId(id), nu).title;
    assert.ok(t.length > 20 && t.length < 70, `${id}: ${t}`);
  }
});
