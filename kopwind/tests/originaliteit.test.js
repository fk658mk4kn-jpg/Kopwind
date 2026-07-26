/**
 * tests/originaliteit.test.js
 *
 * Bewaakt de originaliteit van alle publieksteksten (v3.34.0 "Libeccio").
 *
 * Aanleiding: een auteursrechtklacht via Google (juli 2026) van een
 * concurrerende weerbeslissite. De teksten zijn daarop herschreven in
 * eigen stem; deze test voorkomt dat kenmerkende frases van die site
 * (of van welke concurrent dan ook) ooit terugsluipen in content,
 * strings of UI-teksten.
 *
 * Werkwijze: alle .js-bestanden in content/, lib/ en app/ plus de
 * componenten worden gelezen, comments worden gestript (die zijn niet
 * publiek), en daarna mag geen van de verboden frases voorkomen.
 * De merknaam van de concurrent wordt ook in comments geweerd.
 *
 * Schrijfwijzer bij een rode test: zie PLAYBOOK.md, sectie
 * "Originaliteit en concurrentie-afstand".
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const MAPPEN = ["content", "lib", "components", "app"];

/** Frases die kenmerkend zijn voor de concurrent of diens marketingframe. */
const VERBODEN = [
  "geen grafieken",
  "geen gedoe",
  "kort antwoord",
  "locatiegebonden",
  "op jouw locatie",
  "jouw exacte locatie",
  "at your location",
  "ja of nee",
  "yes or no",
  "duidelijk antwoord",
  "one clear answer",
  "helder ja",
  "helder antwoord",
  "twijfel je of",
  "je ziet meteen",
  "je ziet direct",
  "zie je meteen",
  "zie je direct",
  "instantly see",
  "draait niet alleen om",
  "beslissingshulp",
  "weerbeslissing",
  "weather decision",
  "klopte dit voor jou",
  "ook handig vandaag",
  "also handy today",
  "het weer twijfelt",
  "geen weerbericht",
  "not a weather report",
  "wat jij ermee kunt doen",
  "veel mensen zoeken op",
  "gewone weersites",
  "weerapp",
  "weather app",
];

/** Merknaam van de klager: nergens, ook niet in comments. */
const VERBODEN_OVERAL = ["nooryes"];

function alleJsBestanden(map, lijst = []) {
  for (const naam of readdirSync(map)) {
    if (["node_modules", ".next", ".git"].includes(naam)) continue;
    const pad = join(map, naam);
    if (statSync(pad).isDirectory()) alleJsBestanden(pad, lijst);
    else if (naam.endsWith(".js")) lijst.push(pad);
  }
  return lijst;
}

function zonderComments(tekst) {
  const zonderBlokken = tekst.replace(/\/\*[\s\S]*?\*\//g, "");
  return zonderBlokken
    .split("\n")
    .filter((r) => {
      const s = r.trim();
      return !s.startsWith("//") && !s.startsWith("*");
    })
    .join("\n");
}

test("publieksteksten bevatten geen concurrent-frases", () => {
  const fouten = [];
  for (const map of MAPPEN) {
    for (const pad of alleJsBestanden(map)) {
      const ruw = readFileSync(pad, "utf-8");
      const laag = ruw.toLowerCase();
      for (const frase of VERBODEN_OVERAL) {
        if (laag.includes(frase)) fouten.push(`${pad}: "${frase}" (ook in comments verboden)`);
      }
      const kaal = zonderComments(ruw).toLowerCase();
      for (const frase of VERBODEN) {
        if (kaal.includes(frase)) fouten.push(`${pad}: "${frase}"`);
      }
    }
  }
  assert.deepEqual(
    fouten,
    [],
    `Verboden frases gevonden (zie PLAYBOOK.md, Originaliteit):\n${fouten.join("\n")}`
  );
});
