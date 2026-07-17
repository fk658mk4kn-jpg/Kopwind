import test from "node:test";
import assert from "node:assert/strict";
import { TOOLS } from "../lib/tools/index.js";
import { VARIANTEN } from "../lib/varianten.js";
import { STAD_TEMPLATES_RUW, ANKER_TERM_RUW } from "../lib/steden/stadTemplates.js";

/**
 * Bewaakt de per-stad SEO-teksten (v3.23.0). Aanleiding: de oude
 * fallback leende het was-drogen-template, waardoor ~200 stadpagina's
 * de verkeerde title, description en h1 droegen. Deze test dwingt af:
 * - elke geregistreerde tool heeft een EIGEN template, in beide talen
 *   (het generieke vangnet in titelVoor mag alleen een toekomstige,
 *   nog niet geregistreerde tool opvangen);
 * - templates leveren de drie velden en verwerken de stadnaam;
 * - elke tool en elke variant heeft een ankerterm voor de
 *   stedenknoppen, in beide talen.
 */

test("stad-templates: elke tool heeft een eigen template in NL en EN", () => {
  const problemen = [];
  for (const taal of ["nl", "en"]) {
    const map = STAD_TEMPLATES_RUW[taal];
    for (const t of TOOLS) {
      const maak = map[t.id];
      if (typeof maak !== "function") {
        problemen.push(`${taal}: ${t.id} mist een stad-template`);
        continue;
      }
      const uit = maak("Teststad");
      for (const veld of ["title", "description", "h1"]) {
        if (typeof uit[veld] !== "string" || !uit[veld].includes("Teststad")) {
          problemen.push(`${taal}: ${t.id}.${veld} ontbreekt of verwerkt de stadnaam niet`);
        }
      }
    }
    // Geen zwerf-entries voor ids die niet bestaan (typefout-vangnet).
    const bekend = new Set(TOOLS.map((t) => t.id));
    for (const id of Object.keys(map)) {
      if (!bekend.has(id)) problemen.push(`${taal}: template voor onbekende tool ${id}`);
    }
  }
  assert.deepEqual(problemen, []);
});

test("stad-ankers: elke tool en variant heeft een ankerterm in NL en EN", () => {
  const problemen = [];
  const ids = [...TOOLS.map((t) => t.id), ...VARIANTEN.map((v) => v.id)];
  for (const taal of ["nl", "en"]) {
    const map = ANKER_TERM_RUW[taal];
    for (const id of ids) {
      if (typeof map[id] !== "string" || !map[id]) {
        problemen.push(`${taal}: ${id} mist een ankerterm`);
      }
    }
  }
  assert.deepEqual(problemen, []);
});
