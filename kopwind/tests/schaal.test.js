import test from "node:test";
import assert from "node:assert/strict";
import { schaalVoor, jaVoor, kleurVoorSchaal, SCHAAL } from "../lib/engine/schaal.js";

test("schaalVoor: vijf woorden op de juiste grenzen", () => {
  assert.equal(schaalVoor(5).label, "Ideaal");
  assert.equal(schaalVoor(12).label, "Goed");
  assert.equal(schaalVoor(29.9).label, "Goed");
  assert.equal(schaalVoor(30).label, "Twijfelachtig");
  assert.equal(schaalVoor(45).label, "Matig");
  assert.equal(schaalVoor(62).label, "Zeer slecht");
  assert.equal(schaalVoor(100).label, "Zeer slecht");
  assert.equal(SCHAAL.length, 5);
});

test("jaVoor: tot en met Twijfelachtig is het ja", () => {
  assert.equal(jaVoor(44.9), true);
  assert.equal(jaVoor(45), false);
});

test("kleurVoorSchaal: groen, oranje, rood", () => {
  assert.equal(kleurVoorSchaal("ideaal"), "groen");
  assert.equal(kleurVoorSchaal("goed"), "groen");
  assert.equal(kleurVoorSchaal("twijfelachtig"), "oranje");
  assert.equal(kleurVoorSchaal("matig"), "rood");
  assert.equal(kleurVoorSchaal("zeer-slecht"), "rood");
});
