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

test("bolLink: zonder SiteId de gewone bol-link, met SiteId een partnerlink", async () => {
  // Zonder SiteId
  delete process.env.NEXT_PUBLIC_BOL_SITE_ID;
  const zonder = execSync(
    `node -e "import('./lib/affiliate.js').then(m => console.log(m.bolLink('https://www.bol.com/nl/nl/s/?searchtext=slee','sneeuwpret','sneeuwpret')))"`,
    { env: { ...process.env }, encoding: "utf8" }
  ).trim();
  assert.equal(zonder, "https://www.bol.com/nl/nl/s/?searchtext=slee");

  // Met SiteId: partnerlink met correcte encoding en subid
  const met = execSync(
    `node -e "import('./lib/affiliate.js').then(m => console.log(m.bolLink('https://www.bol.com/nl/nl/s/?searchtext=slee','sneeuwpret','sneeuwpret')))"`,
    { env: { ...process.env, NEXT_PUBLIC_BOL_SITE_ID: "99999" }, encoding: "utf8" }
  ).trim();
  assert.match(met, /^https:\/\/partner\.bol\.com\/click\/click\?/);
  assert.match(met, /s=99999/);
  assert.match(met, /subid=sneeuwpret/);
  assert.match(met, /url=https%3A%2F%2Fwww\.bol\.com/);
});

test("bolLink: laat niet-bol-links met rust", async () => {
  const uit = execSync(
    `node -e "import('./lib/affiliate.js').then(m => console.log(m.bolLink('https://www.gamma.nl/verf','x','x')))"`,
    { env: { ...process.env, NEXT_PUBLIC_BOL_SITE_ID: "99999" }, encoding: "utf8" }
  ).trim();
  assert.equal(uit, "https://www.gamma.nl/verf");
});
