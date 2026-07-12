import test from "node:test";
import assert from "node:assert/strict";
import { fietsNavUrls } from "../lib/engine/navigatie.js";

const A = { naam: "A", lat: 51.92, lon: 4.47 };
const B = { naam: "B", lat: 51.99, lon: 4.4 };
const C = { naam: "C", lat: 52.01, lon: 4.36 };

test("fietsNavUrls: Google in fietsmodus met waypoints, Apple begin naar eind", () => {
  const u = fietsNavUrls([A, B, C]);
  assert.match(u.google, /^https:\/\/www\.google\.com\/maps\/dir\/\?api=1/);
  assert.match(u.google, /travelmode=bicycling/);
  assert.match(u.google, /waypoints=51\.99%2C4\.4/);
  assert.match(u.apple, /^https:\/\/maps\.apple\.com\/\?saddr=51\.92%2C4\.47&daddr=52\.01%2C4\.36&dirflg=c$/);
  assert.equal(u.tussenstopsWeggevallen, true);
});

test("fietsNavUrls: zonder tussenstops geen waypoints en geen waarschuwing", () => {
  const u = fietsNavUrls([A, B]);
  assert.ok(!u.google.includes("waypoints"));
  assert.equal(u.tussenstopsWeggevallen, false);
  assert.equal(fietsNavUrls([A]), null);
});
