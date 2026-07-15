import test from "node:test";
import assert from "node:assert/strict";
import {
  migreerRouteSchema,
  migreerToolSchema,
  dueBriefings,
  dueVertrek,
  pasVertrekTijdToe,
  vensterAdvies,
  schemaZin,
} from "../lib/engine/meldingen.js";

// Het weekplan (v3) is het meldingen-format: per weekdag eigen stuurtijden
// (wanneer de melding komt) en een eigen doelmoment (waarover het advies
// gaat). Deze tests dekken de migraties, de per-dag due-logica, de
// vertrektijd-override en het venster-advies.

test("migreerToolSchema: v2 (dagen plus tijden) naar het weekplan", () => {
  const s = migreerToolSchema({
    aan: true,
    locatie: { naam: "Thuis", lat: 52, lon: 4.5 },
    dagen: [6, 7],
    tijden: ["09:00"],
    drempel: { modus: "goed", cijfer: 7 },
  });
  assert.equal(s.aan, true);
  assert.equal(s.week["6"].aan, true);
  assert.equal(s.week["1"].aan, false);
  assert.deepEqual(s.week["7"].tijden, ["09:00"]);
  assert.equal(s.week["6"].doel.soort, "dag");
  // Weekplan gaat er genormaliseerd doorheen, inclusief venster-doel.
  s.week["6"].doel = { soort: "venster", van: "08:00", tot: "12:00" };
  const nogEens = migreerToolSchema(s);
  assert.deepEqual(nogEens.week["6"].doel, { soort: "venster", van: "08:00", tot: "12:00" });
});

test("dueBriefings: per weekdag verschillende stuurtijden en doelmoment", () => {
  const schema = migreerRouteSchema(null);
  schema.week["1"] = { aan: true, tijden: ["07:00"], vertrekTijd: "08:30" };
  schema.week["2"] = { aan: true, tijden: ["09:00"], vertrekTijd: null };

  const maandag = new Date(2026, 6, 6, 7, 4); // ma
  const dueMa = dueBriefings({ schema, log: {}, nu: maandag, prefix: "W" });
  assert.equal(dueMa.length, 1);
  assert.equal(dueMa[0].vertrekTijd, "08:30");

  // Op maandag om 9:02 vuurt alleen de maandag-tijd (07:00, via het
  // inhaalvenster van 3 uur); de dinsdag-tijd 09:00 lekt niet naar maandag.
  const maandagOchtend9 = new Date(2026, 6, 6, 9, 2);
  const dueInhaal = dueBriefings({ schema, log: {}, nu: maandagOchtend9 });
  assert.equal(dueInhaal.length, 1);
  assert.match(dueInhaal[0].key, /:briefing:07:00$/);

  const dinsdag = new Date(2026, 6, 7, 9, 2); // di
  const dueDi = dueBriefings({ schema, log: {}, nu: dinsdag });
  assert.equal(dueDi.length, 1);
  assert.equal(dueDi[0].vertrekTijd, null);
});

test("dueBriefings: tool-doel (venster) reist mee op het item", () => {
  const schema = migreerToolSchema(null);
  schema.aan = true;
  schema.week["1"] = {
    aan: true,
    tijden: ["07:30"],
    doel: { soort: "venster", van: "08:00", tot: "12:00" },
  };
  const maandag = new Date(2026, 6, 6, 7, 33);
  const due = dueBriefings({ schema, log: {}, nu: maandag, prefix: "tool_was" });
  assert.equal(due.length, 1);
  assert.deepEqual(due[0].doel, { soort: "venster", van: "08:00", tot: "12:00" });
});

test("dueVertrek: vuurt alleen op dagen die in het weekplan aan staan", () => {
  const schema = migreerRouteSchema(null);
  schema.vertrek = { aan: true, minuten: 15 };
  schema.week["1"].aan = true; // ma aan, rest default ma-vr aan maar zet za/zo expliciet uit
  schema.week["6"].aan = false;
  schema.week["7"].aan = false;

  const maandag = new Date(2026, 6, 6, 7, 50);
  const due = dueVertrek({
    schema,
    times: [{ departure: new Date(2026, 6, 6, 8, 0) }],
    log: {},
    nu: maandag,
  });
  assert.equal(due.length, 1);

  const zondag = new Date(2026, 6, 12, 7, 50);
  assert.equal(
    dueVertrek({
      schema,
      times: [{ departure: new Date(2026, 6, 12, 8, 0) }],
      log: {},
      nu: zondag,
    }).length,
    0
  );
});

test("pasVertrekTijdToe: eerste rit krijgt een vaste vertrektijd op vandaag", () => {
  const nu = new Date(2026, 6, 6, 7, 0);
  const uit = pasVertrekTijdToe([{ mode: "nu" }, { mode: "auto" }], "08:30", nu);
  assert.equal(uit[0].mode, "vertrek");
  assert.match(uit[0].tijd, /^2026-07-06T08:30/);
  assert.equal(uit[1].mode, "auto");
  // Lege keten: er komt een eerste rit met de tijd.
  const leeg = pasVertrekTijdToe([], "06:15", nu);
  assert.equal(leeg.length, 1);
  assert.match(leeg[0].tijd, /T06:15/);
  // Zonder tijd verandert er niets.
  const zelfde = [{ mode: "nu" }];
  assert.deepEqual(pasVertrekTijdToe(zelfde, null, nu), zelfde);
});

test("vensterAdvies: gemiddelde score en natte uren binnen het venster", () => {
  const uren = [
    { uur: 7, score: 80, nat: false },
    { uur: 8, score: 20, nat: false },
    { uur: 9, score: 40, nat: true },
    { uur: 10, score: 30, nat: false },
    { uur: 13, score: 90, nat: true },
  ];
  const v = vensterAdvies(uren, "08:00", "11:00");
  assert.equal(v.uren, 3);
  assert.equal(v.score, 30); // (20 + 40 + 30) / 3
  assert.equal(v.nat, true);
  // Buiten de beschikbare uren: null.
  assert.equal(vensterAdvies(uren, "02:00", "05:00"), null);
});

test("schemaZin: weekplan groepeert dagen en benoemt het doelmoment", () => {
  const schema = migreerRouteSchema(null);
  for (const d of [1, 2, 3, 4, 5]) {
    schema.week[String(d)] = { aan: true, tijden: ["07:00"], vertrekTijd: "08:30" };
  }
  schema.week["6"] = { aan: true, tijden: ["09:30"], vertrekTijd: null };
  const zin = schemaZin(schema, "route");
  assert.match(zin, /ma t\/m vr om 07:00, rit om 08:30/);
  assert.match(zin, /za om 09:30/);

  const tool = migreerToolSchema(null);
  tool.week["7"] = {
    aan: true,
    tijden: ["08:00"],
    doel: { soort: "venster", van: "10:00", tot: "14:00" },
  };
  for (let d = 1; d <= 6; d++) tool.week[String(d)].aan = false;
  const toolZin = schemaZin(tool, "tool");
  assert.match(toolZin, /zo om 08:00, over 10:00 tot 14:00/);
});
