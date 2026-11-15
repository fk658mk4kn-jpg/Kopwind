/**
 * tests/v338.test.js
 *
 * v3.38.0 "Tramontana": getij, hittegolf, onweer, ramadan, belasting en
 * de integriteit van de gidspagina's.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { getijPerioden } from "../lib/getij.js";
import { fasenTussen } from "../lib/maan.js";
import { dagMaxima, toetsHittegolf } from "../lib/hittegolf.js";
import { onweerPerDag, urenTekst } from "../lib/onweer.js";
import { RAMADAN, huidigeRamadan } from "../lib/ramadan.js";
import { aangifteFase } from "../lib/belasting.js";
import { ymd, dagenTussen, uitSleutel } from "../lib/aftellen/datums.js";
import { WEER_VELDEN } from "../lib/engine/weather.js";
import { REKENHULPEN, REKEN_GROEPEN } from "../lib/rekenhulpen.js";
import { REKEN_INHOUD } from "../content/rekenhulpen.js";

const DAG = 86400000;

test("getij: springtij twee dagen na nieuwe en volle maan, afwisselend met doodtij", () => {
  const nu = Date.UTC(2026, 10, 15, 12);
  const p = getijPerioden(nu, 6);
  for (let i = 1; i < p.length; i++) assert.notEqual(p[i].soort, p[i - 1].soort);
  const vol = fasenTussen(nu, nu + 20 * DAG).find((f) => f.soort === 2);
  const spring = p.find((x) => x.soort === "springtij" && x.maan === "Volle maan");
  assert.equal(spring.tijdstip - vol.tijdstip, 2 * DAG);
});

test("hittegolf: definitie van vijf zomerse dagen met drie tropische", () => {
  const reeks = (maxen) => maxen.map((max, i) => ({ datum: `2026-07-${String(i + 1).padStart(2, "0")}`, max }));
  assert.equal(toetsHittegolf(reeks([26, 31, 32, 30, 27])).hittegolf, true);
  assert.equal(toetsHittegolf(reeks([26, 31, 32, 24, 30, 27])).hittegolf, false);
  assert.equal(toetsHittegolf(reeks([26, 31, 28, 27, 29, 25])).hittegolf, false);
  const h = { time: ["2026-07-01T10:00", "2026-07-01T15:00", "2026-07-02T15:00"], temperature_2m: [20, 29.6, 31] };
  assert.deepEqual(dagMaxima(h), [{ datum: "2026-07-01", max: 29.6 }, { datum: "2026-07-02", max: 31 }]);
});

test("onweer: weercode weegt zwaarder dan CAPE, hagel herkend", () => {
  const h = {
    time: ["2026-07-01T15:00", "2026-07-01T16:00", "2026-07-02T15:00", "2026-07-03T15:00"],
    weather_code: [95, 99, 3, 2],
    cape: [900, 1100, 1200, 100],
  };
  const d = onweerPerDag(h);
  assert.equal(d[0].oordeel.niveau, 2);
  assert.equal(d[0].hagel, true);
  assert.equal(d[1].oordeel.niveau, 1);
  assert.equal(d[2].oordeel.niveau, 0);
  assert.equal(urenTekst([15, 16]), "15:00 tot 17:00");
  assert.ok(WEER_VELDEN.includes("weather_code") && WEER_VELDEN.includes("cape"));
});

test("ramadan: 29 of 30 dagen, Suikerfeest na de laatste vastendag", () => {
  for (const r of RAMADAN) {
    const start = uitSleutel(r.start);
    assert.equal(dagenTussen(start, uitSleutel(r.eindVroeg)) + 1, 29);
    assert.equal(dagenTussen(start, uitSleutel(r.eindLaat)) + 1, 30);
    assert.equal(dagenTussen(uitSleutel(r.eindVroeg), uitSleutel(r.suikerfeest[0])), 1);
  }
  assert.equal(huidigeRamadan("2026-11-15").jaar, 2027);
  assert.equal(huidigeRamadan("2027-03-10"), null);
});

test("ramadan-data raken niet ongemerkt op", () => {
  const laatste = RAMADAN.map((r) => r.eindLaat).sort().at(-1);
  // Rood een maand voor de data opraken: tijd om het volgende jaar toe te voegen.
  const grens = new Date(Date.now() + 30 * DAG).toISOString().slice(0, 10);
  assert.ok(laatste > grens, `Ramadan-data lopen tot ${laatste}; voeg het volgende jaar toe.`);
});

test("belasting: aangifte voor 1 mei, uitstel tot 1 september, daarna volgend jaar", () => {
  assert.deepEqual(aangifteFase(ymd(2027, 3, 15)), { soort: "aangifte", doel: ymd(2027, 5, 1), belastingjaar: 2026 });
  assert.equal(aangifteFase(ymd(2027, 5, 1)).soort, "uitstel");
  assert.deepEqual(aangifteFase(ymd(2026, 11, 15)).doel, ymd(2027, 5, 1));
});

test("gidspagina's: elke groep gevuld, rijke teksten", () => {
  for (const g of REKEN_GROEPEN) assert.ok(REKENHULPEN.some((r) => r.groep === g.id), g.id);
  for (const id of ["stroomprijs", "vakantiegeld", "belasting", "ramadan", "getij", "zeewater", "hittegolf", "onweer", "dagen-langer", "vrije-dag"]) {
    const i = REKEN_INHOUD[id];
    assert.ok(i.blokken.length >= 4 && i.faq.length >= 5, `${id}: te dun`);
    const woorden = [i.intro, ...i.blokken.map((b) => b.tekst), ...i.faq.map((f) => f.a)].join(" ").split(/\s+/).length;
    assert.ok(woorden >= 400, `${id}: ${woorden} woorden`);
  }
});
