import { test } from "node:test";
import assert from "node:assert/strict";

import { restUrl } from "../lib/server/db.js";

// Regressie voor de PGRST125 "Invalid path specified in request URL": een
// trailing slash in SUPABASE_URL maakte "//rest/v1/...", wat de
// Supabase-gateway weigert. restUrl hoort die slash weg te halen, ongeacht
// hoe de env-var is ingevuld.

const bewaar = process.env.SUPABASE_URL;

test("restUrl: schone basis zonder trailing slash", () => {
  process.env.SUPABASE_URL = "https://ref.supabase.co";
  assert.equal(
    restUrl("stemmen?tool_id=eq.terras&select=stem"),
    "https://ref.supabase.co/rest/v1/stemmen?tool_id=eq.terras&select=stem"
  );
});

test("restUrl: strip een trailing slash", () => {
  process.env.SUPABASE_URL = "https://ref.supabase.co/";
  assert.equal(
    restUrl("stemmen?select=stem"),
    "https://ref.supabase.co/rest/v1/stemmen?select=stem"
  );
});

test("restUrl: strip meerdere trailing slashes", () => {
  process.env.SUPABASE_URL = "https://ref.supabase.co///";
  assert.equal(restUrl("push_abos"), "https://ref.supabase.co/rest/v1/push_abos");
});

test("restUrl: geen dubbele slash na het pad-scheidingsteken", () => {
  process.env.SUPABASE_URL = "https://ref.supabase.co/";
  const u = restUrl("melding_log");
  assert.ok(!u.replace("https://", "").includes("//"), `geen // in ${u}`);
});

// Zet de env terug zoals hij was, zodat andere tests er geen last van hebben.
process.on("exit", () => {
  if (bewaar === undefined) delete process.env.SUPABASE_URL;
  else process.env.SUPABASE_URL = bewaar;
});
