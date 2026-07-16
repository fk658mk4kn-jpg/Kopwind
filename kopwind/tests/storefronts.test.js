import test from "node:test";
import assert from "node:assert/strict";
import { STOREFRONTS } from "../content/storefronts.js";
import { CATEGORIEEN } from "../lib/categorieen.js";
import { TOOLS } from "../lib/tools/index.js";
import { VARIANTEN } from "../lib/varianten.js";

// Het storefront-format (PLAYBOOK sectie 11) als afdwinger: er is EEN
// template en elke categorie vult hem volledig (de template-audit van
// juli 2026 vond drie varianten naast elkaar; dat kan hierna niet meer).
// Elke storefront heeft alle blokken, de koppen volgen het vaste
// sjabloon met invulwoord, en elke verwijzing (tool, variant, anker,
// gerelateerd) bestaat.

const categorieIds = new Set(CATEGORIEEN.map((c) => c.id));
const toolIds = new Set(TOOLS.map((t) => t.id));
const variantIds = new Set(VARIANTEN.map((v) => v.id));
const BLOKKEN = ["voorWie", "keuzehulp", "beslislogica", "situaties", "seizoen", "faq", "gerelateerd"];

test("storefronts: elke categorie heeft een volledige storefront (een template)", () => {
  for (const c of CATEGORIEEN) {
    const sf = STOREFRONTS[c.id];
    assert.ok(sf, `categorie ${c.id} heeft geen storefront`);
    for (const blok of BLOKKEN) {
      assert.ok(sf[blok], `${c.id}: blok ${blok} ontbreekt`);
    }
    assert.ok(sf.voorWie.regels.length >= 2, `${c.id}: voorWie heeft minimaal twee regels`);
    assert.ok(sf.keuzehulp.keuzes.length >= 3, `${c.id}: keuzehulp heeft minimaal drie keuzes`);
    assert.ok(sf.beslislogica.punten.length >= 4, `${c.id}: beslislogica heeft minimaal vier punten`);
    assert.ok(sf.situaties.items.length >= 4, `${c.id}: situaties heeft minimaal vier items`);
    assert.equal(sf.seizoen.items.length, 4, `${c.id}: seizoen heeft precies vier items`);
    assert.ok(sf.faq.length >= 3, `${c.id}: faq heeft minimaal drie vragen`);
  }
  for (const id of Object.keys(STOREFRONTS)) {
    assert.ok(categorieIds.has(id), `storefront ${id} is geen categorie`);
  }
});

test("storefronts: koppen volgen het vaste sjabloon met invulwoord", () => {
  for (const [id, sf] of Object.entries(STOREFRONTS)) {
    assert.equal(sf.voorWie.kop, "Voor wie is deze pagina?", `${id}: voorWie-kop wijkt af`);
    assert.match(sf.keuzehulp.kop, / kiezen: wat wil je weten\?$/, `${id}: keuzehulp-kop volgt het sjabloon niet`);
    assert.match(sf.beslislogica.kop, /^Waar hangt .+ van af\?$/, `${id}: beslislogica-kop volgt het sjabloon niet`);
    assert.equal(sf.situaties.kop, "Veelvoorkomende situaties", `${id}: situaties-kop wijkt af`);
    assert.match(sf.seizoen.kop, / per seizoen in Nederland$/, `${id}: seizoen-kop volgt het sjabloon niet`);
  }
});

test("storefronts: faq-ankers zijn uniek, kebab-case en compleet", () => {
  for (const [id, sf] of Object.entries(STOREFRONTS)) {
    const ids = sf.faq.map((f) => f.id);
    assert.equal(new Set(ids).size, ids.length, `${id}: dubbele faq-ankers`);
    for (const f of sf.faq) {
      assert.ok(f.id && f.v && f.a, `${id}: faq-item mist id, vraag of antwoord`);
      assert.match(f.id, /^[a-z0-9]+(-[a-z0-9]+)*$/, `${id}: faq-anker ${f.id} is geen kebab-case`);
    }
  }
});

test("storefronts: keuzehulp verwijst naar een tool, variant of eigen faq-anker", () => {
  for (const [id, sf] of Object.entries(STOREFRONTS)) {
    const ankers = new Set(sf.faq.map((f) => f.id));
    for (const k of sf.keuzehulp.keuzes) {
      assert.ok(k.situatie, `${id}: keuze zonder situatie`);
      if (k.toolId) {
        assert.ok(toolIds.has(k.toolId), `${id}: keuzehulp-tool ${k.toolId} bestaat niet`);
      } else if (k.variantId) {
        assert.ok(variantIds.has(k.variantId), `${id}: keuzehulp-variant ${k.variantId} bestaat niet`);
      } else {
        assert.ok(ankers.has(k.anchor), `${id}: keuzehulp-anker ${k.anchor} staat niet in de eigen faq`);
        assert.ok(k.linkTekst, `${id}: anker-keuze zonder linkTekst`);
      }
    }
  }
});

test("storefronts: gerelateerd bevat 2-3 bestaande, andere categorieen", () => {
  for (const [id, sf] of Object.entries(STOREFRONTS)) {
    assert.ok(sf.gerelateerd.length >= 2 && sf.gerelateerd.length <= 3, `${id}: gerelateerd moet 2-3 items hebben`);
    for (const g of sf.gerelateerd) {
      assert.ok(categorieIds.has(g), `${id}: gerelateerd ${g} bestaat niet`);
      assert.notEqual(g, id, `${id}: gerelateerd verwijst naar zichzelf`);
    }
  }
});
