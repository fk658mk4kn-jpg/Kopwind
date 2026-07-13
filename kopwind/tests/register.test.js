import test from "node:test";
import assert from "node:assert/strict";
import { TOOLS, vindTool, valideerRegister, migreerThresholds } from "../lib/tools/index.js";

test("register: alle geregistreerde tools zijn geldig", () => {
  assert.deepEqual(valideerRegister(TOOLS), []);
  assert.ok(TOOLS.length >= 2, "minimaal fiets en was");
});

test("register: vindTool op slug", () => {
  assert.equal(vindTool("fietsen-naar-werk").id, "fiets-naar-werk");
  assert.equal(vindTool("was-buiten-drogen").inputType, "locatie");
  assert.equal(vindTool("bestaat-niet"), null);
});

test("register: validatie vangt kapotte configuraties", () => {
  const fouten = valideerRegister([
    { id: "x", slug: "x", naam: "X", korteVraag: "?", patroon: "Z", inputType: "route", adviesLabels: { goed: "a", matig: "b" } },
    { id: "y", slug: "x", naam: "Y", korteVraag: "?", patroon: "A", inputType: "locatie", adviesLabels: { goed: "a", matig: "b", slecht: "c" } },
  ]);
  assert.ok(fouten.some((f) => f.includes("onbekend patroon")));
  assert.ok(fouten.some((f) => f.includes("dubbele slug")));
  assert.ok(fouten.some((f) => f.includes("adviesLabel slecht")));
});

test("migreerThresholds: oud plat fiets-object wordt per-tool, per-tool blijft", () => {
  const oud = { tegenwindMatig: 14, segmentLengte: 400 };
  assert.deepEqual(migreerThresholds(oud), { "fiets-naar-werk": oud });
  const nieuw = { "was-buiten-drogen": { buiKans: 40 } };
  assert.deepEqual(migreerThresholds(nieuw), nieuw);
  assert.deepEqual(migreerThresholds(null), {});
  assert.deepEqual(migreerThresholds({ iets: 1 }), {});
});

test("instellingen: elke tool declareert zijn eigen drempels met defaults", () => {
  for (const t of TOOLS) {
    // Tools met een eigen client-component (nowcast-checks zoals
    // regentiming en paraplu) hebben geen instelbare drempels.
    if (t.eigenComponent) continue;
    assert.ok(t.instellingen?.velden?.length >= 3, `${t.id} heeft instelvelden`);
    for (const v of t.instellingen.velden) {
      if (v.type === "keuze") {
        // Mensentaal-veld: elke keuze zet bestaande drempel-keys.
        assert.ok(v.vraag && v.keuzes?.length >= 2, `${t.id}.${v.id}: vraag en keuzes`);
        for (const k of v.keuzes) {
          for (const key of Object.keys(k.zet)) {
            assert.ok(key in t.instellingen.defaults, `${t.id}.${v.id}: ${key} heeft een default`);
          }
        }
      } else {
        assert.ok(v.key in t.instellingen.defaults, `${t.id}.${v.key} heeft een default`);
      }
    }
    // Precies een keuze per keuze-veld matcht de defaults (de middenstand).
    for (const v of t.instellingen.velden.filter((x) => x.type === "keuze")) {
      const past = v.keuzes.filter((k) =>
        Object.entries(k.zet).every(([key, w]) => t.instellingen.defaults[key] === w)
      );
      assert.equal(past.length, 1, `${t.id}.${v.id}: een keuze hoort de standaard te zijn`);
    }
  }
});
