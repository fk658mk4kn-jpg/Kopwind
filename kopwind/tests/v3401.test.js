/**
 * tests/v3401.test.js
 *
 * v3.40.1: geen dubbele vragen of kopjes binnen een pagina, en geen ruwe
 * linknotatie in teksten die zonder TekstMetLinks worden gerenderd.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { REKEN_INHOUD } from "../content/rekenhulpen.js";
import { GIDS_INHOUD } from "../content/gidsen.js";

test("geen dubbele vragen of kopjes per rekenpagina", () => {
  const fouten = [];
  for (const [id, i] of Object.entries(REKEN_INHOUD)) {
    for (const [soort, lijst] of [["faq", i.faq.map((f) => f.v)], ["blok", (i.blokken ?? []).map((b) => b.kop)]]) {
      const dubbel = lijst.filter((x, k) => lijst.indexOf(x) !== k);
      if (dubbel.length) fouten.push(`${id} ${soort}: ${dubbel.join(", ")}`);
    }
  }
  assert.deepEqual(fouten, []);
  assert.ok(GIDS_INHOUD);
});

test("FAQ-antwoorden lopen altijd via TekstMetLinks of platteTekst", () => {
  const bestanden = ["app/page.js", "app/[tool]/page.js", "app/[tool]/[stad]/page.js", "app/hoeveel-dagen-tot/page.js"];
  for (const b of bestanden) {
    const s = readFileSync(b, "utf8");
    assert.ok(!/<p>\{f\.a\}<\/p>/.test(s), `${b}: ruwe f.a in de HTML`);
    assert.ok(!/text: f\.a\b/.test(s), `${b}: ruwe f.a in JSON-LD`);
  }
});
