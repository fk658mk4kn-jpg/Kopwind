import test from "node:test";
import assert from "node:assert/strict";
import { TOOLS, vindTool, valideerRegister } from "../lib/tools/index.js";

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
