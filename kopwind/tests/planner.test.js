import { test } from "node:test";
import assert from "node:assert/strict";
import { berekenPlan, resolveDeparture } from "../lib/planner.js";
import { DEMO_STOPS, demoLegOptions, demoFetch } from "../lib/demo.js";
import { DEFAULT_THRESHOLDS } from "../lib/advice.js";

test("resolveDeparture: vertrekken nu gebruikt de actuele tijd exact", () => {
  const nu = new Date(2026, 6, 10, 8, 7, 30);
  const d = resolveDeparture({ mode: "nu" }, 1800, null, nu);
  assert.equal(d.getTime(), nu.getTime());
});

test("resolveDeparture: aankomsttijd min reistijd is vertrektijd", () => {
  const d = resolveDeparture(
    { mode: "aankomst", tijd: "2026-07-09T09:00" },
    1800,
    null,
    new Date()
  );
  assert.equal(d.getHours(), 8);
  assert.equal(d.getMinutes(), 30);
});

test("berekenPlan: demoketen levert drie etappes met kloppende tijden en wind", async () => {
  const nu = new Date(2026, 6, 9, 6, 0);
  const plan = await berekenPlan({
    stops: DEMO_STOPS,
    legOptions: demoLegOptions(nu),
    thresholds: DEFAULT_THRESHOLDS,
    fetchImpl: demoFetch(nu),
    nu,
  });

  assert.equal(plan.legs.length, 3, "drie etappes uit vier stops");
  const [l1, l2, l3] = plan.legs;

  // Ketenlogica: vertrek etappe 2 is aankomst etappe 1 plus 75 minuten.
  const verwacht = l1.arrival.getTime() + 75 * 60 * 1000;
  assert.equal(l2.departure.getTime(), verwacht, "verblijftijd exact toegepast");
  assert.ok(l3.departure.getTime() > l2.arrival.getTime(), "keten loopt door");

  // Windlogica met zuidwestenwind (uit 225 graden):
  // etappe 1 gaat naar het zuidwesten, dus tegenwind.
  assert.ok(
    l1.metrics.meanHead > 10,
    `etappe 1 tegenwind, kreeg ${l1.metrics.meanHead.toFixed(1)}`
  );
  // etappe 2 gaat terug naar het noordoosten, dus rugwind.
  assert.ok(
    l2.metrics.meanHead < -10,
    `etappe 2 rugwind, kreeg ${l2.metrics.meanHead.toFixed(1)}`
  );

  // Elke etappe heeft segmenten met kleur en passagetijd.
  for (const leg of plan.legs) {
    assert.ok(leg.segments.length > 1, "meerdere segmenten");
    for (const s of leg.segments) {
      assert.ok(typeof s.kleur === "string" && s.kleur.startsWith("hsl"));
      assert.ok(s.passage instanceof Date);
    }
    assert.ok(typeof leg.samenvatting === "string" && leg.samenvatting.length > 0);
  }

  // Dagadvies is de zwaarste etappe.
  const maxScore = Math.max(...plan.legs.map((l) => l.advies.score));
  assert.equal(plan.dag.score, maxScore, "dagscore = max etappescore");
});

test("berekenPlan: stops op dezelfde plek geven een duidelijke fout", async () => {
  const nu = new Date(2026, 6, 9, 6, 0);
  const stops = [
    { naam: "A", lat: 51.92, lon: 4.5 },
    { naam: "B", lat: 51.92, lon: 4.5 },
  ];
  await assert.rejects(
    berekenPlan({
      stops,
      legOptions: [{ mode: "auto" }],
      fetchImpl: demoFetch(nu),
      nu,
    }),
    /dezelfde plek/
  );
});
