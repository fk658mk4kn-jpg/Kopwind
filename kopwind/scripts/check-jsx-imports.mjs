/**
 * scripts/check-jsx-imports.mjs
 *
 * Vangt ontbrekende component-imports die de build niet ziet maar die
 * client-side crashen (ReferenceError: X is not defined). Voor elk .js
 * met JSX: elk <Hoofdletter-component moet geimporteerd, lokaal
 * gedefinieerd of een bekende HTML/SVG-tag zijn.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const NEGEER = new Set(["React", "Fragment"]);
const mappen = ["components", "app"];
const fouten = [];

function loop(dir) {
  for (const naam of readdirSync(dir)) {
    const pad = join(dir, naam);
    const st = statSync(pad);
    if (st.isDirectory()) loop(pad);
    else if (naam.endsWith(".js")) controleer(pad);
  }
}

function stripCommentaar(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");
}

function controleer(pad) {
  const src = stripCommentaar(readFileSync(pad, "utf8"));
  const refs = [...src.matchAll(/<([A-Z][A-Za-z0-9]+)[\s/>]/g)].map((m) => m[1]);
  for (const comp of new Set(refs)) {
    if (NEGEER.has(comp)) continue;
    const re = new RegExp(`import[^;\\n]*\\b${comp}\\b|function ${comp}\\b|const ${comp}\\s*=|${comp}\\s*=\\s*\\(`);
    if (!re.test(src)) fouten.push(`${pad}: <${comp}> is niet geimporteerd of gedefinieerd`);
  }
}

// Tweede pas: gedeelde helper-functies die zonder import gebruikt worden.
// Vangt de cron-klasse bugs (schaalVoor zonder import) die de JSX-pas mist.
const HELPERS = [
  "schaalVoor", "labelVoor", "jaVoor", "kleurVoorSchaal",
  "fmtCijfer", "fmtTijd", "fmtKm", "fmtDuur", "fmtUren",
  "kleurSequentieel", "tekstKleurVoor", "bft", "kompas",
  "droogsnelheid", "geschatteDroogtijd", "dagKeyVan", "bouwBasis",
];

function controleerHelpers(pad) {
  const src = stripCommentaar(readFileSync(pad, "utf8"));
  for (const h of HELPERS) {
    const gebruikt = new RegExp(`\\b${h}\\s*\\(`).test(src);
    if (!gebruikt) continue;
    const gedekt = new RegExp(`import[^;\\n]*\\b${h}\\b|function ${h}\\b|const ${h}\\s*=`).test(src);
    if (!gedekt) fouten.push(`${pad}: ${h}() wordt gebruikt maar niet geimporteerd`);
  }
}

function loopHelpers(dir) {
  for (const naam of readdirSync(dir)) {
    const pad = join(dir, naam);
    const st = statSync(pad);
    if (st.isDirectory()) loopHelpers(pad);
    else if (naam.endsWith(".js") && !pad.includes("lib/format") && !pad.includes("lib/engine")) controleerHelpers(pad);
  }
}

for (const m of mappen) loop(m);
for (const m of ["components", "app", "lib/tools", "lib/server"]) loopHelpers(m);
if (fouten.length) {
  console.error("Ontbrekende component-imports:\n" + fouten.map((f) => "  " + f).join("\n"));
  process.exit(1);
}
console.log("JSX-imports OK");
