import test from "node:test";
import assert from "node:assert/strict";
import { BESLISSINGEN } from "../content/beslissingen.js";
import { CATEGORIEEN } from "../lib/categorieen.js";
import { TOOLS } from "../lib/tools/index.js";
import { VARIANTEN } from "../lib/varianten.js";
import { STOREFRONTS } from "../content/storefronts.js";

// De catalogus van /alle-checks volgt exact de vaste categorie-set
// (feedbackronde juli 2026, punt 1): geen eigen titels of indeling, en
// elke verwijzing (tool, variant, storefront-anker) moet bestaan.

const catIds = new Set(CATEGORIEEN.map((c) => c.id));
const toolIds = new Set(TOOLS.map((t) => t.id));
const variantIds = new Set(VARIANTEN.map((v) => v.id));

test("beslissingen: de indeling is exact de vaste categorie-set", () => {
  const ids = BESLISSINGEN.map((g) => g.id);
  assert.deepEqual(new Set(ids), catIds, "elke categorie precies een keer");
  assert.equal(ids.length, CATEGORIEEN.length);
  for (const g of BESLISSINGEN) {
    assert.ok(!g.titel, `${g.id}: geen eigen titel, die komt uit lib/categorieen`);
  }
});

test("beslissingen: elke live check staat in zijn eigen categorie", () => {
  for (const t of TOOLS) {
    const groep = BESLISSINGEN.find((g) => g.items.some((i) => i.toolId === t.id));
    assert.ok(groep, `${t.id} ontbreekt in de catalogus`);
    assert.equal(groep.id, t.categorieId, `${t.id} staat in ${groep.id}, hoort in ${t.categorieId}`);
  }
});

test("beslissingen: alle verwijzingen bestaan", () => {
  for (const g of BESLISSINGEN) {
    for (const item of g.items) {
      if (item.toolId) assert.ok(toolIds.has(item.toolId), `${g.id}: tool ${item.toolId} bestaat niet`);
      if (item.variantId) assert.ok(variantIds.has(item.variantId), `${g.id}: variant ${item.variantId} bestaat niet`);
      if (item.anker) {
        assert.ok(item.vraag, `${g.id}: anker-item zonder vraag`);
        const sf = STOREFRONTS[item.ankerCategorie];
        assert.ok(sf, `${g.id}: ankerCategorie ${item.ankerCategorie} heeft geen storefront`);
        assert.ok(
          sf.faq.some((f) => f.id === item.anker),
          `${g.id}: anker ${item.anker} staat niet in de faq van ${item.ankerCategorie}`
        );
      }
      if (!item.toolId && !item.variantId) {
        assert.ok(item.vraag, `${g.id}: item zonder vraag en zonder verwijzing`);
      }
    }
  }
});
