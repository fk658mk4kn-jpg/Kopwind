import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Regressietest op de Search Console-fout van juli 2026 ("Kan niet
 * doorgaan met validatieproces, Item: n.v.t."): handmatige
 * BreadcrumbList-schema's met RELATIEVE item-URL's naast het correcte
 * schema uit components/Broodkruimel.js. De regel: pagina's bouwen
 * geen eigen BreadcrumbList; alleen Broodkruimel.js mag dat, en die
 * maakt de URL's absoluut.
 */

function verzamelPages(map, uit = []) {
  for (const naam of readdirSync(map)) {
    const pad = join(map, naam);
    if (statSync(pad).isDirectory()) verzamelPages(pad, uit);
    else if (naam === "page.js") uit.push(pad);
  }
  return uit;
}

test("jsonld: geen handmatige BreadcrumbList buiten Broodkruimel.js", () => {
  for (const pad of verzamelPages("app")) {
    const bron = readFileSync(pad, "utf8");
    assert.ok(
      !bron.includes('"BreadcrumbList"'),
      `${pad} bouwt een eigen BreadcrumbList; gebruik het Broodkruimel-component`
    );
  }
});

test("jsonld: geen relatieve item-URL's in schema-bronnen", () => {
  for (const pad of verzamelPages("app")) {
    const bron = readFileSync(pad, "utf8");
    assert.ok(
      !/item: ["`]\//.test(bron),
      `${pad} zet een relatieve URL in een schema-item`
    );
  }
});
