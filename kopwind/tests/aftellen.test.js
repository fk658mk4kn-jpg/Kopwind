/**
 * tests/aftellen.test.js
 *
 * De aftellers (v3.35.0 "Bise"): kalenderregels tegen bekende data,
 * zon en seizoenen tegen gepubliceerde tijden, de telling rond
 * jaargrenzen, de neerslaganalyse en de integriteit van het register.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ymd, pasen, koningsdag, nteWeekdag, seizoenDatum, zonTijden, tijdTekst, daglengte,
  amsterdamTijdstip, werkdagenTot, dagenTussen,
} from "../lib/aftellen/datums.js";
import {
  AFTELLERS, volgende, weekendStatus, vindAftellerOpId, aftelMeta,
} from "../lib/aftellen/index.js";
import { VAKANTIE_DATA } from "../lib/aftellen/vakanties.js";
import { analyseerNeerslag } from "../lib/aftellen/neerslag.js";
import { AFTEL_INHOUD } from "../content/aftellen.js";
import { alleToolSlugs, TOOLS } from "../lib/tools/index.js";
import { CATEGORIEEN } from "../lib/categorieen.js";
import { VARIANTEN } from "../lib/varianten.js";

const iso = (d) => `${d.j}-${d.m}-${d.d}`;
const op = (j, m, d, u = 12) => amsterdamTijdstip(ymd(j, m, d), u, 0);

test("Pasen klopt voor bekende jaren", () => {
  assert.equal(iso(pasen(2024)), "2024-3-31");
  assert.equal(iso(pasen(2025)), "2025-4-20");
  assert.equal(iso(pasen(2026)), "2026-4-5");
  assert.equal(iso(pasen(2027)), "2027-3-28");
  assert.equal(iso(pasen(2028)), "2028-4-16");
});

test("Koningsdag schuift naar zaterdag bij een zondag", () => {
  assert.equal(iso(koningsdag(2025)), "2025-4-26");
  assert.equal(iso(koningsdag(2027)), "2027-4-27");
});

test("weekdagregels: Moederdag, Vaderdag, klokwissels, Prinsjesdag", () => {
  assert.equal(iso(nteWeekdag(2027, 5, 0, 2)), "2027-5-9");
  assert.equal(iso(nteWeekdag(2027, 6, 0, 3)), "2027-6-20");
  assert.equal(iso(nteWeekdag(2027, 3, 0, -1)), "2027-3-28");
  assert.equal(iso(nteWeekdag(2026, 10, 0, -1)), "2026-10-25");
  assert.equal(iso(nteWeekdag(2027, 9, 2, 3)), "2027-9-21");
});

test("seizoenen vallen op de juiste Nederlandse datum", () => {
  assert.equal(iso(seizoenDatum("winter", 2026)), "2026-12-21");
  assert.equal(iso(seizoenDatum("lente", 2027)), "2027-3-20");
  assert.equal(iso(seizoenDatum("zomer", 2027)), "2027-6-21");
  assert.equal(iso(seizoenDatum("herfst", 2027)), "2027-9-23");
});

test("zon in De Bilt binnen enkele minuten van gepubliceerde tijden", () => {
  const winter = zonTijden(ymd(2026, 12, 21), 52.1, 5.18);
  assert.match(tijdTekst(winter.op), /^08:4[3-9]$/);
  assert.match(tijdTekst(winter.onder), /^16:(2[7-9]|3[0-3])$/);
  const zomer = zonTijden(ymd(2027, 6, 21), 52.1, 5.18);
  assert.match(tijdTekst(zomer.op), /^05:(1[6-9]|2[0-2])$/);
  assert.match(tijdTekst(zomer.onder), /^22:0[0-7]$/);
  assert.ok(daglengte(ymd(2027, 6, 21), 52.1, 5.18) > daglengte(ymd(2026, 12, 21), 52.1, 5.18) + 500);
});

test("tijdzone: zomertijd begint om 02:00 lokaal = 01:00 UTC", () => {
  assert.equal(new Date(amsterdamTijdstip(ymd(2027, 3, 28), 2, 0)).toISOString(), "2027-03-28T01:00:00.000Z");
  assert.equal(new Date(amsterdamTijdstip(ymd(2026, 12, 25), 0, 0)).toISOString(), "2026-12-24T23:00:00.000Z");
});

test("werkdagen slaan weekenden en feestdagen over", () => {
  // Van ma 21 dec 2026 tot ma 28 dec: di, wo, do = 3 (vr 25 en za/zo/26 vallen af).
  assert.equal(werkdagenTot(ymd(2026, 12, 21), ymd(2026, 12, 28)), 3);
  assert.equal(werkdagenTot(ymd(2026, 12, 21), ymd(2026, 12, 22)), 0);
});

test("kerst telt goed rond de jaargrens", () => {
  const kerst = vindAftellerOpId("kerst");
  assert.equal(volgende(kerst, op(2026, 12, 24))[0].dagen, 1);
  assert.equal(volgende(kerst, op(2026, 12, 25))[0].isVandaag, true);
  const daarna = volgende(kerst, op(2026, 12, 26))[0];
  assert.equal(iso(daarna.start), "2027-12-25");
});

test("oud en nieuw loopt tot middernacht en springt op 1 januari door", () => {
  const oen = vindAftellerOpId("oud-en-nieuw");
  const m = volgende(oen, op(2026, 12, 31, 23))[0];
  assert.equal(m.isVandaag, true);
  assert.equal(new Date(m.doelTijdstip).toISOString(), "2026-12-31T23:00:00.000Z");
  assert.equal(volgende(oen, op(2027, 1, 1, 1))[0].start.j, 2027);
});

test("carnaval is een periode van zondag tot dinsdag", () => {
  const c = vindAftellerOpId("carnaval");
  const m = volgende(c, op(2027, 2, 8))[0];
  assert.equal(m.bezig, true);
  assert.equal(iso(m.start), "2027-2-7");
  assert.equal(iso(m.eind), "2027-2-9");
});

test("vakanties: drie regio's, bezig-status en vervolgjaar", () => {
  const z = vindAftellerOpId("zomervakantie");
  const m = volgende(z, op(2027, 7, 20));
  assert.equal(m.length, 3);
  assert.equal(m.find((x) => x.label === "Regio noord").bezig, true);
  assert.equal(m.find((x) => x.label === "Regio zuid").bezig, false);
  const najaar = volgende(z, op(2027, 9, 10));
  assert.ok(najaar.every((x) => x.start.j === 2028));
});

test("vakantiedata zijn geldig en eind ligt na start", () => {
  for (const [naam, lijst] of Object.entries(VAKANTIE_DATA)) {
    for (const r of lijst) {
      const [a, b] = [r.start, r.eind].map((s) => s.split("-").map(Number));
      assert.ok(dagenTussen(ymd(...a), ymd(...b)) >= 8, `${naam} ${r.regio} ${r.start}`);
    }
  }
});

test("vakantiedata raken niet ongemerkt op (waarschuwing ruim vooraf)", () => {
  const laatste = Object.values(VAKANTIE_DATA).flat().map((r) => r.eind).sort().at(-1);
  // Faalt een jaar voor de data opraken: tijd om het volgende schooljaar toe te voegen.
  const grens = new Date(Date.now() + 365 * 86400000).toISOString().slice(0, 10);
  assert.ok(laatste > grens, `Vakantiedata lopen tot ${laatste}; voeg het volgende schooljaar toe.`);
});

test("weekend: vrijdagmiddag telt naar 17:00, zaterdag is weekend", () => {
  const vrOchtend = weekendStatus(op(2026, 11, 20, 9));
  assert.equal(vrOchtend.bezig, false);
  assert.equal(new Date(vrOchtend.doel).toISOString(), "2026-11-20T16:00:00.000Z");
  const za = weekendStatus(op(2026, 11, 21, 12));
  assert.equal(za.bezig, true);
  assert.equal(new Date(za.doel).toISOString(), "2026-11-22T23:00:00.000Z");
  const di = weekendStatus(op(2026, 11, 24, 12));
  assert.equal(new Date(di.doel).toISOString(), "2026-11-27T16:00:00.000Z");
});

test("neerslaganalyse: droog tot de bui, nat tot een droog uur", () => {
  const nu = op(2026, 11, 15, 12);
  const tijden = Array.from({ length: 12 }, (_, i) => {
    const t = new Date(nu + i * 15 * 60000);
    const w = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Amsterdam", dateStyle: "short", timeStyle: "short" }).format(t);
    return w.replace(" ", "T");
  });
  const droog = analyseerNeerslag({ time: tijden, precipitation: [0, 0, 0, 0.4, 0.5, 0, 0, 0, 0, 0, 0, 0] }, nu);
  assert.equal(droog.soort, "droog-tot");
  assert.equal(droog.tijdstip, nu + 45 * 60000);
  const nat = analyseerNeerslag({ time: tijden, precipitation: [0.5, 0.3, 0, 0.2, 0, 0, 0, 0, 0, 0, 0, 0] }, nu);
  assert.equal(nat.soort, "nat-tot");
  assert.equal(nat.tijdstip, nu + 60 * 60000);
  const geen = analyseerNeerslag({ time: tijden, precipitation: Array(12).fill(0) }, nu);
  assert.equal(geen.soort, "lang-droog");
});

test("register: unieke slugs, geen botsing met checks, compleet", () => {
  const slugs = AFTELLERS.map((a) => a.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  const bezet = new Set([...alleToolSlugs(), ...CATEGORIEEN.map((c) => c.slug), ...VARIANTEN.map((v) => v.slug)]);
  for (const s of slugs) assert.ok(!bezet.has(s), `slug botst: ${s}`);
  const toolIds = new Set(TOOLS.map((t) => t.id));
  for (const a of AFTELLERS) {
    assert.ok(AFTEL_INHOUD[a.id], `geen tekst voor ${a.id}`);
    assert.equal(AFTEL_INHOUD[a.id].blokken.length >= 2, true, a.id);
    assert.equal(AFTEL_INHOUD[a.id].faq.length >= 3, true, a.id);
    if (a.tool) assert.ok(toolIds.has(a.tool), `onbekende tool ${a.tool} bij ${a.id}`);
    for (const v of a.verwant) assert.ok(vindAftellerOpId(v), `onbekend verwant ${v} bij ${a.id}`);
    const meta = aftelMeta(a);
    assert.ok(meta.title.length > 20 && meta.title.length < 70, `title-lengte ${a.id}: ${meta.title}`);
  }
});

test("elke datumteller vindt een volgend moment, ook over twee jaar", () => {
  for (const nu of [Date.now(), op(2027, 12, 31, 22)]) {
    for (const a of AFTELLERS.filter((x) => x.soort === "datum")) {
      assert.equal(volgende(a, nu).length, 1, a.id);
    }
  }
});

test("inline links in de aftelteksten wijzen naar bestaande checks", async () => {
  const { parseInlineLinks } = await import("../lib/inlineLinks.js");
  const ids = new Set(TOOLS.map((t) => t.id));
  const teksten = Object.values(AFTEL_INHOUD).flatMap((i) => [
    i.intro, ...i.blokken.map((b) => b.tekst), ...i.faq.map((f) => f.a),
  ]);
  let aantal = 0;
  for (const t of teksten) {
    for (const d of parseInlineLinks(t)) {
      if (d.type === "tekst") continue;
      aantal++;
      assert.equal(d.type, "tool", `alleen tool-links verwacht: ${JSON.stringify(d)}`);
      assert.ok(ids.has(d.toolId), `onbekende tool-link ${d.toolId}`);
    }
  }
  assert.ok(aantal >= 20, `te weinig links: ${aantal}`);
});
