import test from "node:test";
import assert from "node:assert/strict";
import { siteUrl, LIVE_DOMEIN } from "../lib/site.js";

test("siteUrl: fallback is het live domein, nooit localhost", () => {
  assert.equal(siteUrl(undefined), LIVE_DOMEIN);
  assert.equal(siteUrl(""), LIVE_DOMEIN);
});

test("siteUrl: forceert https en strips trailing slash", () => {
  assert.equal(siteUrl("http://kanhetvandaag.nl/"), "https://kanhetvandaag.nl");
  assert.equal(siteUrl("kanhetvandaag.nl"), "https://kanhetvandaag.nl");
  assert.equal(siteUrl("https://www.kanhetvandaag.nl///"), "https://www.kanhetvandaag.nl");
});

test("siteUrl: localhost blijft http voor lokaal testen", () => {
  assert.equal(siteUrl("http://localhost:3000"), "http://localhost:3000");
});
