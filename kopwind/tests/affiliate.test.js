import test from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { TOOLS } from "../lib/tools/index.js";
import { affiliateProblemen } from "../lib/affiliate.js";

/**
 * Integriteit van de affiliate-adviesblokken (v3.22.0). Elk
 * tool.affiliate dat is ingevuld moet het schema volgen: tweetalige
 * kop en advies, 1 tot 4 items met een https-url en een winkelnaam.
 * null (geen blok) is prima. Draait NL in-process en EN via een
 * kindproces, want de tool-strings worden bij import per taal gebakken.
 */

test("affiliate (NL): elk ingevuld blok volgt het schema", () => {
  const problemen = [];
  for (const t of TOOLS) problemen.push(...affiliateProblemen(t.id, t.affiliate));
  assert.deepEqual(problemen, []);
});

test("affiliate: er is minstens een tool met een adviesblok", () => {
  // Anders is de hele feature per ongeluk uitgeschakeld.
  const met = TOOLS.filter((t) => t.affiliate != null).length;
  assert.ok(met >= 1, `verwacht minstens een affiliate-blok, vond ${met}`);
});

test("affiliate (EN): elk ingevuld blok volgt het schema", () => {
  const script = `
    Promise.all([
      import('./lib/tools/index.js'),
      import('./lib/affiliate.js'),
    ]).then(([toolsMod, affMod]) => {
      const { TOOLS } = toolsMod;
      const { affiliateProblemen } = affMod;
      const problemen = [];
      for (const t of TOOLS) problemen.push(...affiliateProblemen(t.id, t.affiliate));
      console.log(JSON.stringify(problemen));
    });
  `;
  const uit = execSync(`node -e "${script.replace(/"/g, '\\"')}"`, {
    env: { ...process.env, NEXT_PUBLIC_SITE_LOCALE: "en" },
    encoding: "utf8",
  }).trim();
  assert.deepEqual(JSON.parse(uit), []);
});
