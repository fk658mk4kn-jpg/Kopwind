import { test } from "node:test";
import assert from "node:assert/strict";
import {
  bearing,
  haversine,
  windComponents,
  segmentizeRoute,
  hourKey,
  summarizeLegNL,
} from "../lib/wind.js";
import { DEFAULT_THRESHOLDS } from "../lib/advice.js";

const T = DEFAULT_THRESHOLDS;

test("bearing: noord, oost, zuid, west", () => {
  const a = [52.0, 5.0];
  assert.ok(Math.abs(bearing(a, [52.1, 5.0]) - 0) < 0.01, "noord");
  assert.ok(Math.abs(bearing(a, [52.0, 5.1]) - 90) < 1.5, "oost");
  assert.ok(Math.abs(bearing(a, [51.9, 5.0]) - 180) < 0.01, "zuid");
  assert.ok(Math.abs(bearing(a, [52.0, 4.9]) - 270) < 1.5, "west");
});

test("haversine: 1 graad breedte is ongeveer 111,2 km", () => {
  const d = haversine([52.0, 5.0], [53.0, 5.0]);
  assert.ok(Math.abs(d - 111195) < 300, `kreeg ${d}`);
});

test("windComponents: meteorologische conventie", () => {
  // Noordenwind (uit 0 graden) terwijl je naar het noorden fietst: volle tegenwind.
  let c = windComponents(20, 0, 0);
  assert.ok(Math.abs(c.headwind - 20) < 1e-9, "noordenwind noordwaarts = tegenwind");

  // Zelfde wind, naar het zuiden fietsen: volle rugwind.
  c = windComponents(20, 0, 180);
  assert.ok(Math.abs(c.headwind + 20) < 1e-9, "noordenwind zuidwaarts = rugwind");

  // Westenwind (uit 270), naar het oosten fietsen: rugwind.
  c = windComponents(20, 270, 90);
  assert.ok(Math.abs(c.headwind + 20) < 1e-9, "westenwind oostwaarts = rugwind");

  // Oostenwind (uit 90), naar het noorden fietsen: zijwind van rechts (positief).
  c = windComponents(20, 90, 0);
  assert.ok(Math.abs(c.headwind) < 1e-9, "geen kopwindcomponent");
  assert.ok(Math.abs(c.crosswind - 20) < 1e-9, "zijwind van rechts positief");
});

test("segmentizeRoute: bundelt punten tot doellengte", () => {
  // 10 punten noordwaarts, elk ongeveer 111 m uit elkaar.
  const coords = [];
  for (let i = 0; i < 10; i++) coords.push([52.0 + i * 0.001, 5.0]);
  const segs = segmentizeRoute(coords, 300);
  assert.equal(segs.length, 3, "9 x 111 m in stukken van ~300 m = 3 segmenten");
  const totaal = segs[segs.length - 1].cumEnd;
  const som = segs.reduce((a, s) => a + s.distance, 0);
  assert.ok(Math.abs(totaal - som) < 0.001, "cumulatief klopt met som");
  for (const s of segs) {
    assert.ok(Math.abs(s.bearing - 0) < 0.5, "alle segmenten wijzen noord");
  }
});

test("hourKey: rondt af op dichtstbijzijnde hele uur", () => {
  assert.equal(hourKey(new Date(2026, 6, 9, 7, 29)), "2026-07-09T07:00");
  assert.equal(hourKey(new Date(2026, 6, 9, 7, 31)), "2026-07-09T08:00");
});

test("summarizeLegNL: benoemt lengte, zwaarte en plek", () => {
  // Kunstmatige etappe van 7,5 km: 2,5 km tegenwind halverwege.
  const segs = [];
  let cum = 0;
  for (let i = 0; i < 15; i++) {
    const head = i >= 5 && i < 10 ? 18 : 2;
    segs.push({
      cumStart: cum,
      cumEnd: cum + 500,
      distance: 500,
      headwind: head,
    });
    cum += 500;
  }
  const metrics = { meanHead: 7 };
  const s = summarizeLegNL(segs, metrics, T);
  assert.ok(s.includes("2,5 km"), `lengte in tekst, kreeg: ${s}`);
  assert.ok(s.includes("merkbare tegenwind"), `zwaarte in tekst, kreeg: ${s}`);
  assert.ok(s.includes("halverwege"), `plek in tekst, kreeg: ${s}`);
});
