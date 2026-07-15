import test from "node:test";
import assert from "node:assert/strict";
import {
  isoDag,
  migreerRouteSchema,
  dueBriefings,
  dueVertrek,
  drempelLaatDoor,
  schemaZin,
  dagKey,
} from "../lib/engine/meldingen.js";

test("isoDag: maandag is 1, zondag is 7", () => {
  assert.equal(isoDag(new Date(2026, 6, 6)), 1); // ma 6 juli 2026
  assert.equal(isoDag(new Date(2026, 6, 12)), 7); // zo 12 juli 2026
});

test("migreerRouteSchema: v1 naar het weekplan", () => {
  const s = migreerRouteSchema({
    ochtend: true,
    ochtendTijd: "06:45",
    vertrek: true,
    vertrekMinuten: 20,
  });
  // v1 kende geen dagen: elke dag aan, met de ochtendtijd als stuurtijd.
  for (let d = 1; d <= 7; d++) {
    assert.equal(s.week[String(d)].aan, true);
    assert.deepEqual(s.week[String(d)].tijden, ["06:45"]);
    assert.equal(s.week[String(d)].vertrekTijd, null);
  }
  assert.equal(s.vertrek.aan, true);
  assert.equal(s.vertrek.minuten, 20);
  assert.equal(s.drempel.modus, "altijd");
  // Een weekplan gaat er genormaliseerd doorheen.
  const nogEens = migreerRouteSchema(s);
  assert.deepEqual(nogEens.week["3"].tijden, ["06:45"]);
});

test("dueBriefings: dagenfilter blokkeert, meerdere tijden vuren in hun venster", () => {
  const maandag = new Date(2026, 6, 6, 7, 5);
  const schema = {
    dagen: [1, 3],
    briefing: { aan: true, tijden: ["07:00", "17:00"] },
  };
  const due = dueBriefings({ schema, log: {}, nu: maandag, prefix: "Woon-werk" });
  assert.equal(due.length, 1);
  assert.equal(due[0].key, `${dagKey(maandag)}:Woon-werk:briefing:07:00`);

  const avond = new Date(2026, 6, 6, 17, 2);
  const due2 = dueBriefings({ schema, log: {}, nu: avond });
  assert.equal(due2.length, 1);
  assert.match(due2[0].key, /:briefing:17:00$/);

  const dinsdag = new Date(2026, 6, 7, 7, 5);
  assert.equal(dueBriefings({ schema, log: {}, nu: dinsdag }).length, 0);
});

test("dueBriefings: log dedupliceert", () => {
  const nu = new Date(2026, 6, 6, 7, 5);
  const schema = { dagen: [1], briefing: { aan: true, tijden: ["07:00"] } };
  const eerste = dueBriefings({ schema, log: {}, nu });
  const log = { [eerste[0].key]: 1 };
  assert.equal(dueBriefings({ schema, log, nu }).length, 0);
});

test("dueVertrek: dagenfilter plus venster", () => {
  const maandag = new Date(2026, 6, 6, 7, 50);
  const vertrek = new Date(2026, 6, 6, 8, 0);
  const schema = { dagen: [1], vertrek: { aan: true, minuten: 15 } };
  const due = dueVertrek({ schema, times: [{ departure: vertrek }], log: {}, nu: maandag, prefix: "W" });
  assert.equal(due.length, 1);
  assert.equal(due[0].legIdx, 0);
  const zondag = new Date(2026, 6, 12, 7, 50);
  assert.equal(
    dueVertrek({ schema, times: [{ departure: new Date(2026, 6, 12, 8, 0) }], log: {}, nu: zondag }).length,
    0
  );
});

test("drempelLaatDoor: drie modi", () => {
  // score 40 = cijfer 6; score 10 = cijfer 9.
  assert.equal(drempelLaatDoor({ modus: "altijd" }, 90), true);
  assert.equal(drempelLaatDoor({ modus: "slecht", cijfer: 6.5 }, 40), true);
  assert.equal(drempelLaatDoor({ modus: "slecht", cijfer: 6.5 }, 10), false);
  assert.equal(drempelLaatDoor({ modus: "goed", cijfer: 7 }, 10), true);
  assert.equal(drempelLaatDoor({ modus: "goed", cijfer: 7 }, 40), false);
});

test("schemaZin: mensentaal met dagen, tijd en drempel", () => {
  const zin = schemaZin(
    {
      dagen: [1, 2, 3, 4, 5],
      briefing: { aan: true, tijden: ["07:00"] },
      vertrek: { aan: false, minuten: 15 },
      drempel: { modus: "slecht", cijfer: 6 },
    },
    "route"
  );
  assert.match(zin, /07:00/);
  assert.match(zin, /ma t\/m vr/);
  assert.match(zin, /6 of lager/);
});
