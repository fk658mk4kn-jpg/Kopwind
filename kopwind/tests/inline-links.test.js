import test from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { TOOLS } from "../lib/tools/index.js";
import { VARIANTEN } from "../lib/varianten.js";
import { inhoudVoorTool } from "../content/index.js";
import { STOREFRONTS } from "../content/storefronts.js";
import { CATEGORIEEN } from "../lib/categorieen.js";
import { inlineLinkDoelen } from "../lib/inlineLinks.js";

/**
 * Integriteit van de in-tekst linknotatie [label](tool:id) en
 * [label](hub:categorie-id#anker) in blokken en FAQ (laag D van de
 * SEO-run, v3.20.0). Elk doel moet bestaan; een anker moet echt in de
 * FAQ van die hub staan. Draait voor NL in-process en voor EN via een
 * kindproces (de taal wordt bij import gebakken, zie i18n.test.js).
 */

function verzamelTeksten() {
  const teksten = [];
  for (const t of [...TOOLS, ...VARIANTEN.map((v) => ({ slug: v.slug }))]) {
    const inhoud = inhoudVoorTool(t.slug);
    if (!inhoud) continue;
    for (const b of inhoud.blokken ?? []) teksten.push({ bron: `tool:${t.slug}#${b.kop}`, tekst: b.tekst });
    for (const f of inhoud.faq ?? []) teksten.push({ bron: `tool:${t.slug}#${f.v}`, tekst: f.a });
  }
  for (const [catId, sf] of Object.entries(STOREFRONTS)) {
    for (const f of sf.faq ?? []) teksten.push({ bron: `hub:${catId}#${f.v}`, tekst: f.a });
  }
  return teksten;
}

function valideer(teksten, toolIds, catIds, ankersPerCat) {
  const problemen = [];
  for (const { bron, tekst } of teksten) {
    for (const doel of inlineLinkDoelen(tekst)) {
      if (doel.type === "tool") {
        if (!toolIds.has(doel.toolId)) problemen.push(`${bron}: tool ${doel.toolId} bestaat niet`);
      } else {
        if (!catIds.has(doel.categorieId)) {
          problemen.push(`${bron}: hub ${doel.categorieId} bestaat niet`);
        } else if (doel.anker && !ankersPerCat.get(doel.categorieId)?.has(doel.anker)) {
          problemen.push(`${bron}: anker ${doel.anker} staat niet in de faq van ${doel.categorieId}`);
        }
      }
    }
  }
  return problemen;
}

test("inline links (NL): elk [label](tool:id) en [label](hub:id#anker) bestaat", () => {
  const toolIds = new Set([...TOOLS.map((t) => t.id), ...VARIANTEN.map((v) => v.id)]);
  const catIds = new Set(CATEGORIEEN.map((c) => c.id));
  const ankersPerCat = new Map(
    Object.entries(STOREFRONTS).map(([id, sf]) => [id, new Set((sf.faq ?? []).map((f) => f.id))])
  );
  const problemen = valideer(verzamelTeksten(), toolIds, catIds, ankersPerCat);
  assert.deepEqual(problemen, []);
});

test("inline links: minstens een deel van de content gebruikt de notatie", () => {
  // Geen loze motor: als niemand ooit [label](tool:...) gebruikt, is er
  // iets misgegaan bij het toepassen (bijvoorbeeld een verkeerd escape-
  // teken in een content-string).
  const totaal = verzamelTeksten().reduce((n, { tekst }) => n + inlineLinkDoelen(tekst).length, 0);
  assert.ok(totaal >= 10, `verwacht meerdere inline links, vond ${totaal}`);
});

test("inline links (EN): elk [label](tool:id) en [label](hub:id#anker) bestaat", () => {
  const script = `
    Promise.all([
      import('./lib/tools/index.js'),
      import('./lib/varianten.js'),
      import('./content/index.js'),
      import('./content/storefronts.js'),
      import('./lib/categorieen.js'),
      import('./lib/inlineLinks.js'),
    ]).then(([toolsMod, varMod, contentMod, sfMod, catMod, linkMod]) => {
      const { TOOLS } = toolsMod;
      const { VARIANTEN } = varMod;
      const { inhoudVoorTool } = contentMod;
      const { STOREFRONTS } = sfMod;
      const { CATEGORIEEN } = catMod;
      const { inlineLinkDoelen } = linkMod;

      const teksten = [];
      for (const t of [...TOOLS, ...VARIANTEN.map((v) => ({ slug: v.slug }))]) {
        const inhoud = inhoudVoorTool(t.slug);
        if (!inhoud) continue;
        for (const b of inhoud.blokken ?? []) teksten.push({ bron: 'tool:' + t.slug, tekst: b.tekst });
        for (const f of inhoud.faq ?? []) teksten.push({ bron: 'tool:' + t.slug, tekst: f.a });
      }
      for (const [catId, sf] of Object.entries(STOREFRONTS)) {
        for (const f of sf.faq ?? []) teksten.push({ bron: 'hub:' + catId, tekst: f.a });
      }

      const toolIds = new Set([...TOOLS.map((t) => t.id), ...VARIANTEN.map((v) => v.id)]);
      const catIds = new Set(CATEGORIEEN.map((c) => c.id));
      const ankersPerCat = new Map(Object.entries(STOREFRONTS).map(([id, sf]) => [id, new Set((sf.faq ?? []).map((f) => f.id))]));

      const problemen = [];
      for (const { bron, tekst } of teksten) {
        for (const doel of inlineLinkDoelen(tekst)) {
          if (doel.type === 'tool') {
            if (!toolIds.has(doel.toolId)) problemen.push(bron + ': tool ' + doel.toolId + ' bestaat niet');
          } else {
            if (!catIds.has(doel.categorieId)) problemen.push(bron + ': hub ' + doel.categorieId + ' bestaat niet');
            else if (doel.anker && !(ankersPerCat.get(doel.categorieId)?.has(doel.anker))) {
              problemen.push(bron + ': anker ' + doel.anker + ' staat niet in de faq van ' + doel.categorieId);
            }
          }
        }
      }
      console.log(JSON.stringify(problemen));
    });
  `;
  const uit = execSync(`node -e "${script.replace(/"/g, '\\"')}"`, {
    env: { ...process.env, NEXT_PUBLIC_SITE_LOCALE: "en" },
    encoding: "utf8",
  }).trim();
  assert.deepEqual(JSON.parse(uit), []);
});
