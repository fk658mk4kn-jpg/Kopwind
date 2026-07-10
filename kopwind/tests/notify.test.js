import { test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeChainToToday,
  planTimes,
  dueNotifications,
  dagKey,
} from "../lib/notify.js";

test("normalizeChainToToday: kloktijd blijft, datum wordt vandaag", () => {
  const nu = new Date(2026, 6, 10, 6, 0);
  const uit = normalizeChainToToday(
    [
      { mode: "vertrek", tijd: "2026-07-08T07:15" },
      { mode: "auto", verblijfMin: 75 },
      { mode: "aankomst", tijd: "2026-07-08T17:30" },
    ],
    nu
  );
  assert.equal(uit[0].tijd, "2026-07-10T07:15");
  assert.equal(uit[1].tijd, undefined);
  assert.equal(uit[2].tijd, "2026-07-10T17:30");
});

test("planTimes: keten met vertrek, verblijf en aankomst rekent door", () => {
  const nu = new Date(2026, 6, 10, 6, 0);
  const opts = [
    { mode: "vertrek", tijd: "2026-07-10T07:00" },
    { mode: "auto", verblijfMin: 75 },
    { mode: "aankomst", tijd: "2026-07-10T18:00" },
  ];
  const durations = [1800, 1800, 3600]; // 30, 30, 60 minuten
  const t = planTimes(opts, durations, nu);

  assert.equal(t[0].departure.getHours(), 7);
  assert.equal(t[0].arrival.getMinutes(), 30);
  // Etappe 2: aankomst 07:30 plus 75 min verblijf = vertrek 08:45.
  assert.equal(t[1].departure.getHours(), 8);
  assert.equal(t[1].departure.getMinutes(), 45);
  // Etappe 3: aankomst 18:00 min 60 min reistijd = vertrek 17:00.
  assert.equal(t[2].departure.getHours(), 17);
  assert.equal(t[2].departure.getMinutes(), 0);
});

test("planTimes: auto als eerste etappe geeft geen vaste tijd", () => {
  const nu = new Date(2026, 6, 10, 6, 0);
  const t = planTimes([{ mode: "auto" }], [1800], nu);
  assert.equal(t[0].departure, null);
});

test("dueNotifications: ochtendbriefing binnen venster, een keer", () => {
  const settings = { ochtend: true, ochtendTijd: "07:00", vertrek: false };
  const times = [];

  // Te vroeg: niets.
  let due = dueNotifications({
    settings,
    log: {},
    times,
    nu: new Date(2026, 6, 10, 6, 59),
  });
  assert.equal(due.length, 0);

  // Om 07:05: briefing.
  const nu = new Date(2026, 6, 10, 7, 5);
  due = dueNotifications({ settings, log: {}, times, nu });
  assert.equal(due.length, 1);
  assert.equal(due[0].type, "ochtend");
  assert.equal(due[0].key, `${dagKey(nu)}:ochtend`);

  // Al gestuurd: dedupe.
  due = dueNotifications({ settings, log: { [due[0].key]: 1 }, times, nu });
  assert.equal(due.length, 0);

  // Meer dan 3 uur later: inhaalvenster voorbij.
  due = dueNotifications({
    settings,
    log: {},
    times,
    nu: new Date(2026, 6, 10, 10, 30),
  });
  assert.equal(due.length, 0);
});

test("dueNotifications: vertrekherinnering in het kwartier voor vertrek", () => {
  const settings = { ochtend: false, vertrek: true, vertrekMinuten: 15 };
  const dep = new Date(2026, 6, 10, 8, 0);
  const times = [{ departure: dep }];

  // 20 minuten voor vertrek: nog niets.
  let due = dueNotifications({
    settings,
    log: {},
    times,
    nu: new Date(2026, 6, 10, 7, 40),
  });
  assert.equal(due.length, 0);

  // 12 minuten voor vertrek: herinnering voor etappe 1.
  const nu = new Date(2026, 6, 10, 7, 48);
  due = dueNotifications({ settings, log: {}, times, nu });
  assert.equal(due.length, 1);
  assert.equal(due[0].type, "vertrek");
  assert.equal(due[0].legIdx, 0);

  // Na vertrek: niet meer melden.
  due = dueNotifications({
    settings,
    log: {},
    times,
    nu: new Date(2026, 6, 10, 8, 1),
  });
  assert.equal(due.length, 0);

  // Dedupe.
  due = dueNotifications({ settings, log: { [`${dagKey(nu)}:vertrek:0`]: 1 }, times, nu });
  assert.equal(due.length, 0);
});
