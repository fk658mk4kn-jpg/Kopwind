import test from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { stadTekst } from "../lib/steden/teksten.js";
import { STEDEN } from "../lib/steden/nl.js";
import { TOOLS } from "../lib/tools/index.js";

/**
 * Stadtekst-fixpakket (v3.27.0, audit plus akkoord eigenaar): drie smaken in
 * plaats van twee, en tweetalig. De oude staat gaf ALLE niet-fiets-
 * tools de wastekst ("het droogvenster van vandaag" op de
 * hardlooppagina) en Nederlandse tekst op de Engelse stadpagina's.
 */

const amsterdam = STEDEN.find((s) => s.slug === "amsterdam") ?? STEDEN[0];

test("stadtekst: alleen de wascheck praat over het droogvenster", () => {
  for (const t of TOOLS) {
    const tekst = stadTekst(t.id, amsterdam).join(" ");
    if (t.id === "was-buiten-drogen") {
      assert.ok(/droogvenster|droogt/.test(tekst), "wascheck hoort zijn eigen smaak te houden");
    } else {
      assert.ok(!/droogvenster/.test(tekst), `${t.id} draagt de wastekst: ${tekst.slice(0, 90)}`);
    }
  }
});

test("stadtekst: fiets houdt routetaal, de rest krijgt weerkarakter", () => {
  const fiets = stadTekst("fiets-naar-werk", amsterdam).join(" ");
  assert.ok(/route|rit|werkadres/.test(fiets), fiets.slice(0, 90));
  const hardloop = stadTekst("hardloopweer", amsterdam).join(" ");
  assert.ok(/antwoord voor vandaag/.test(hardloop), hardloop.slice(0, 90));
});

test("stadtekst: elke ligging heeft alle drie de smaken", () => {
  const liggingen = [...new Set(STEDEN.map((s) => s.ligging))];
  for (const ligging of liggingen) {
    const stad = STEDEN.find((s) => s.ligging === ligging);
    for (const toolId of ["fiets-naar-werk", "was-buiten-drogen", "hardloopweer"]) {
      const [basis, context] = stadTekst(toolId, stad);
      assert.ok(basis?.length > 40 && context?.length > 40, `${ligging}/${toolId} mist tekst`);
    }
  }
});

function draaiEn(script) {
  return execSync(`node -e "${script.replace(/"/g, '\\"')}"`, {
    env: { ...process.env, NEXT_PUBLIC_SITE_LOCALE: "en" },
    encoding: "utf8",
  }).trim();
}

test("en-build: stadteksten zijn Engels, ook buiten fiets en was", () => {
  const uit = draaiEn(`
    Promise.all([import('./lib/steden/teksten.js'), import('./lib/steden/nl.js')]).then(([m, s]) => {
      const stad = s.STEDEN[0];
      console.log(m.stadTekst('hardloopweer', stad).join(' | '));
      console.log(m.stadTekst('was-buiten-drogen', stad).join(' | '));
    });
  `);
  assert.match(uit, /The check below is already set to/);
  assert.match(uit, /drying window/);
  assert.ok(!/droogvenster|De check hieronder/.test(uit), `NL lekt in EN: ${uit.slice(0, 120)}`);
});
