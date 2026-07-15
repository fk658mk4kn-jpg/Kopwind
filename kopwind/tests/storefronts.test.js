import test from "node:test";
import assert from "node:assert/strict";
import { STOREFRONTS } from "../content/storefronts.js";
import { CATEGORIEEN } from "../lib/categorieen.js";
import { TOOLS, toolsInCategorie } from "../lib/tools/index.js";

// Het storefront-format (PLAYBOOK sectie 11): elke storefront is
// configuratie uit vaste bouwblokken. Deze tests dwingen het format af:
// geldige categorie-ids, kloppende keuzehulp-verwijzingen (naar een live
// check of een FAQ-anker op dezelfde pagina), uniek anker per FAQ-item en
// een geldig gerelateerd-blok.

const categorieIds = new Set(CATEGORIEEN.map((c) => c.id));
const toolIds = new Set(TOOLS.map((t) => t.id));

test("storefronts: elke sleutel is een bestaande categorie", () => {
  for (const id of Object.keys(STOREFRONTS)) {
    assert.ok(categorieIds.has(id), `storefront ${id} is geen categorie`);
  }
});

test("storefronts: faq-ankers zijn uniek per storefront", () => {
  for (const [id, sf] of Object.entries(STOREFRONTS)) {
    const ids = (sf.faq ?? []).map((f) => f.id);
    assert.equal(new Set(ids).size, ids.length, `${id}: dubbele faq-ankers`);
    for (const f of sf.faq ?? []) {
      assert.ok(f.id && f.v && f.a, `${id}: faq-item mist id, vraag of antwoord`);
    }
  }
});

test("storefronts: keuzehulp verwijst naar een live check of een eigen faq-anker", () => {
  for (const [id, sf] of Object.entries(STOREFRONTS)) {
    if (!sf.keuzehulp) continue;
    const ankers = new Set((sf.faq ?? []).map((f) => f.id));
    for (const k of sf.keuzehulp.keuzes) {
      assert.ok(k.situatie, `${id}: keuze zonder situatie`);
      if (k.toolId) {
        assert.ok(toolIds.has(k.toolId), `${id}: keuzehulp-tool ${k.toolId} bestaat niet`);
      } else {
        assert.ok(ankers.has(k.anchor), `${id}: keuzehulp-anker ${k.anchor} staat niet in de eigen faq`);
        assert.ok(k.linkTekst, `${id}: anker-keuze zonder linkTekst`);
      }
    }
  }
});

test("storefronts: gerelateerd bevat 2-3 bestaande, andere categorieen", () => {
  for (const [id, sf] of Object.entries(STOREFRONTS)) {
    if (!sf.gerelateerd) continue;
    assert.ok(sf.gerelateerd.length >= 2 && sf.gerelateerd.length <= 3, `${id}: gerelateerd moet 2-3 items hebben`);
    for (const g of sf.gerelateerd) {
      assert.ok(categorieIds.has(g), `${id}: gerelateerd ${g} bestaat niet`);
      assert.notEqual(g, id, `${id}: gerelateerd verwijst naar zichzelf`);
    }
  }
});

test("huis-tuin: de eerste storefront heeft alle sectie-11-blokken", () => {
  const sf = STOREFRONTS["huis-tuin"];
  assert.ok(sf, "huis-tuin-storefront ontbreekt");
  for (const blok of ["voorWie", "keuzehulp", "beslislogica", "situaties", "seizoen", "faq", "gerelateerd"]) {
    assert.ok(sf[blok], `huis-tuin: blok ${blok} ontbreekt`);
  }
  // De keuzehulp routeert minimaal naar de live wascheck van de categorie.
  assert.ok(sf.keuzehulp.keuzes.some((k) => k.toolId === "was-buiten-drogen"));
  // En de categorie heeft die tool ook echt.
  assert.ok(toolsInCategorie("huis-tuin").some((t) => t.id === "was-buiten-drogen"));
});
