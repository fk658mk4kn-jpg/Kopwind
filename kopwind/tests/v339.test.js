/**
 * tests/v339.test.js
 *
 * v3.39.0 "Harmattan": betaaldata, minimumloon, AOW-leeftijd, salarisdag,
 * schrikkeljaren, dag van het jaar, verduisteringen en de Keukenhof.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { aowDatum, salarisDatum, maandloon, volgendeKinderbijslag, volgendeToeslag, TOESLAG_DATA } from "../lib/geld.js";
import { ECLIPSEN, komendeEclipsen } from "../lib/eclipsen.js";
import { KEUKENHOF, huidigeKeukenhof } from "../lib/evenementen.js";
import { ymd, isSchrikkeljaar, dagVanJaar, dagenInJaar, volgendSchrikkeljaar, vandaag, sleutel, dagenTussen, uitSleutel } from "../lib/aftellen/datums.js";
import { REKEN_INHOUD } from "../content/rekenhulpen.js";

const NIEUW = ["toeslagen", "kinderbijslag", "minimumloon", "aow", "salaris", "uren", "schrikkeljaar", "dag-van-jaar", "verduistering", "keukenhof"];

test("AOW-datum volgt de wettelijke tabel", () => {
  assert.equal(sleutel(aowDatum(ymd(1961, 1, 15)).datum), "2028-04-15");
  assert.equal(aowDatum(ymd(1960, 6, 1)).maanden, 804);
  assert.equal(aowDatum(ymd(1966, 1, 1)), null);
  assert.ok(aowDatum(ymd(1950, 1, 1)).eerder);
});

test("salarisdag schuift naar de werkdag ervoor", () => {
  assert.equal(sleutel(salarisDatum(2026, 12)), "2026-12-24");
  assert.equal(sleutel(salarisDatum(2027, 4)), "2027-04-23"); // 25 april 2027 is een zondag
});

test("maandloon rekent met 52 weken", () => {
  assert.equal(maandloon(15.29, 36), Math.round(((15.29 * 36 * 52) / 12) * 100) / 100);
});

test("kinderbijslag komt in januari, april, juli of oktober", () => {
  const v = volgendeKinderbijslag(ymd(2026, 11, 15));
  assert.equal(sleutel(v.maand), "2027-01-01");
  assert.match(v.over, /kwartaal 4 van 2026/);
  assert.equal(volgendeKinderbijslag(ymd(2027, 4, 10)).maand.m, 4);
});

test("toeslag: eerstvolgende datum uit de lijst", () => {
  assert.equal(volgendeToeslag(ymd(2026, 11, 15)).datum, TOESLAG_DATA[0].datum);
});

test("schrikkeljaren en dag van het jaar", () => {
  assert.ok(isSchrikkeljaar(2028));
  assert.ok(isSchrikkeljaar(2000));
  assert.ok(!isSchrikkeljaar(2100));
  assert.equal(volgendSchrikkeljaar(2026), 2028);
  assert.equal(dagVanJaar(ymd(2026, 1, 1)), 1);
  assert.equal(dagVanJaar(ymd(2028, 12, 31)), 366);
  assert.equal(dagenInJaar(2027), 365);
});

test("Keukenhof en verduisteringen", () => {
  assert.equal(huidigeKeukenhof("2026-11-15").jaar, 2027);
  assert.equal(komendeEclipsen("2026-11-15")[0].datum, ECLIPSEN[0].datum);
});

test("tijdgebonden data raken niet ongemerkt op", () => {
  const nu = vandaag();
  const marge = (s) => dagenTussen(nu, uitSleutel(s));
  assert.ok(marge(TOESLAG_DATA.at(-1).datum) > -30, "toeslagdata aanvullen (Belastingdienst)");
  assert.ok(marge(KEUKENHOF.at(-1).tot) > -120, "Keukenhof-data volgend seizoen aanvullen");
  assert.ok(marge(ECLIPSEN.at(-1).datum) > 365, "verduisteringslijst verlengen");
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
