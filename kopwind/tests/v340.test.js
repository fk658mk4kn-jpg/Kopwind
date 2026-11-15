/**
 * tests/v340.test.js
 *
 * v3.40.0 "Sirocco": procenten, btw, Romeinse cijfers, datum rekenen,
 * vakantiedagen, kilometervergoeding, eigen risico, zorg overstappen en
 * belastingteruggave.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { procentVan, welkProcent, procentVerandering, naProcent, btwErbij, btwEraf, naarRomeins, vanRomeins, wettelijkeVakantie, plusMaandenDatum, plusWerkdagen } from "../lib/rekenen.js";
import { EIGEN_RISICO, eigenRisicoVerbruik, KM_VERGOEDING, reiskosten, zorgOverstap } from "../lib/geld.js";
import { teruggaveFase } from "../lib/belasting.js";
import { ymd, sleutel, vandaag } from "../lib/aftellen/datums.js";
import { REKEN_INHOUD } from "../content/rekenhulpen.js";

const NIEUW = ["procenten", "btw", "datum-berekenen", "romeins", "zorg-overstappen", "eigen-risico", "kilometervergoeding", "vakantiedagen", "belastingteruggave", "vuurwerk"];
const dicht = (a, b) => Math.abs(a - b) < 1e-9;

test("procenten", () => {
  assert.equal(procentVan(15, 80), 12);
  assert.equal(welkProcent(12, 48), 25);
  assert.ok(dicht(procentVerandering(900, 945), 5));
  assert.ok(dicht(naProcent(60, -25), 45));
  assert.equal(welkProcent(1, 0), null);
});

test("btw erbij en eraf", () => {
  assert.deepEqual(btwErbij(400, 21), { excl: 400, btw: 84, incl: 484 });
  assert.deepEqual(btwEraf(121, 21), { excl: 100, btw: 21, incl: 121 });
  assert.deepEqual(btwEraf(100, 21), { excl: 82.64, btw: 17.36, incl: 100 });
  assert.deepEqual(btwEraf(109, 9), { excl: 100, btw: 9, incl: 109 });
});

test("Romeinse cijfers heen en terug", () => {
  assert.equal(naarRomeins(2026), "MMXXVI");
  assert.equal(naarRomeins(3999), "MMMCMXCIX");
  assert.equal(naarRomeins(49), "XLIX");
  assert.equal(naarRomeins(0), null);
  assert.equal(vanRomeins("mcmxlv"), 1945);
  assert.equal(vanRomeins("IIII"), null);
  assert.equal(vanRomeins("IC"), null);
  for (let n = 1; n <= 3999; n++) assert.equal(vanRomeins(naarRomeins(n)), n);
});

test("datum rekenen", () => {
  assert.equal(sleutel(plusMaandenDatum(ymd(2027, 1, 31), 1)), "2027-02-28");
  assert.equal(sleutel(plusMaandenDatum(ymd(2028, 1, 31), 1)), "2028-02-29");
  assert.equal(sleutel(plusMaandenDatum(ymd(2027, 1, 15), -2)), "2026-11-15");
  // 24 dec (do), 25 en 26 kerst, weekend 26-27, 28 dec maandag.
  assert.equal(sleutel(plusWerkdagen(ymd(2026, 12, 23), 3)), "2026-12-29");
  assert.equal(sleutel(plusWerkdagen(ymd(2026, 12, 29), -3)), "2026-12-23");
});

test("vakantiedagen", () => {
  assert.deepEqual(wettelijkeVakantie(40, 5), { uren: 160, dagen: 20 });
  assert.deepEqual(wettelijkeVakantie(24, 3), { uren: 96, dagen: 12 });
  assert.deepEqual(wettelijkeVakantie(40, 5, 6), { uren: 80, dagen: 10 });
});

test("reiskosten met 214 dagen", () => {
  const r = reiskosten(15, 5, 0.25);
  assert.equal(r.perDag, 7.5);
  assert.equal(r.perJaar, 1605);
  assert.equal(KM_VERGOEDING[2026], 0.25);
});

test("eigen risico", () => {
  assert.equal(EIGEN_RISICO[2027], 400);
  assert.deepEqual(eigenRisicoVerbruik(250, 0, 400), { zelf: 250, verzekeraar: 0, restNa: 150 });
  assert.deepEqual(eigenRisicoVerbruik(1000, 300, 400), { zelf: 100, verzekeraar: 900, restNa: 0 });
});

test("zorg overstappen en belastingteruggave", () => {
  const nov = zorgOverstap(ymd(2026, 11, 15));
  assert.equal(sleutel(nov.opzeggen), "2026-12-31");
  assert.equal(sleutel(nov.nieuwePolis), "2027-01-31");
  const jan = zorgOverstap(ymd(2027, 1, 10));
  assert.equal(jan.fase, "januari");
  assert.equal(sleutel(jan.nieuwePolis), "2027-01-31");
  assert.equal(teruggaveFase(ymd(2027, 3, 10)).soort, "voor-april");
  assert.equal(teruggaveFase(ymd(2026, 11, 15)).belastingjaar, 2026);
  assert.equal(sleutel(teruggaveFase(ymd(2026, 11, 15)).april), "2027-04-01");
});

test("bedragen niet ongemerkt verouderd", () => {
  const j = vandaag().j;
  assert.ok(EIGEN_RISICO[j], `eigen risico ${j} aanvullen`);
  assert.ok(KM_VERGOEDING[j], `kilometervergoeding ${j} aanvullen`);
});

test("nieuwe gidsen zijn contentrijk", () => {
  for (const id of NIEUW) {
    const i = REKEN_INHOUD[id];
    assert.ok(i, `${id} ontbreekt`);
    assert.ok(i.blokken.length >= 5, `${id}: blokken`);
    assert.ok(i.faq.length >= 5, `${id}: faq`);
    const woorden = [i.intro, ...i.blokken.map((b) => b.tekst), ...i.faq.map((f) => f.a)].join(" ").split(/\s+/).length;
    assert.ok(woorden >= 400, `${id}: ${woorden} woorden`);
  }
});
