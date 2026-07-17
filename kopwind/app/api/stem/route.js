import { dbGeconfigureerd, dbSelect, dbInsert } from "@/lib/server/db";
import { TOOLS } from "@/lib/tools";

/**
 * app/api/stem/route.js
 *
 * De sociale laag (de "stemmen-naad" uit v2.0.0, nu echt): anonieme
 * duimpjes per tool per dag. Geen account, geen naam; alleen een random
 * apparaat-id uit localStorage voor dedupe (een stem per apparaat per
 * tool per dag, afgedwongen door een unique-constraint plus
 * ignore-duplicates bij het inserten).
 *
 * Tabel (eenmalig aanmaken in Supabase, SQL staat in de README):
 *   stemmen(id, tool_id, dag, stem, apparaat, created_at)
 */

export const dynamic = "force-dynamic";

const DAG_RE = /^\d{4}-\d{2}-\d{2}$/;

function geldigeTool(id) {
  return TOOLS.some((t) => t.id === id);
}

async function totalen(tool, dag) {
  const geldig = encodeURIComponent(tool);
  // Twee losse queries, parallel: de dagcijfers zoals altijd, plus een aparte
  // all-time-telling van de positieve stemmen. Die laatste is wat de gebruiker
  // ziet naast de duim omhoog (het totaal ooit, niet per dag). Bewust simpel
  // via de bewezen dbSelect-weg; bij veel volume kan dit later een
  // count=exact-aggregatie worden zodat er geen rijen meer opgehaald worden.
  const [dagRijen, positiefRijen] = await Promise.all([
    dbSelect(`stemmen?tool_id=eq.${geldig}&dag=eq.${dag}&select=stem`),
    dbSelect(`stemmen?tool_id=eq.${geldig}&stem=eq.1&select=stem`),
  ]);
  let omhoog = 0;
  let omlaag = 0;
  for (const r of dagRijen) {
    if (r.stem === 1) omhoog++;
    else if (r.stem === -1) omlaag++;
  }
  return { omhoog, omlaag, totaal: positiefRijen.length };
}

export async function GET(req) {
  if (!dbGeconfigureerd()) {
    return Response.json({ error: "Stemmen staat nog niet aan." }, { status: 503 });
  }
  const { searchParams } = new URL(req.url);

  // Populair-modus (v3.22.0): alle positieve stemmen ooit, per tool
  // geteld en aflopend gesorteerd. Voedt de "Populaire keuzehulpen" op
  // de homepage, die client-side herschikt op dit totaal. Eén query
  // over alleen de positieve rijen; de telling per tool gebeurt hier.
  // Bewust simpel via dbSelect; bij veel volume kan dit een
  // count=exact-aggregatie per tool worden.
  if (searchParams.get("populair")) {
    try {
      const rijen = await dbSelect(`stemmen?stem=eq.1&select=tool_id`);
      const per = new Map();
      for (const r of rijen) per.set(r.tool_id, (per.get(r.tool_id) ?? 0) + 1);
      const volgorde = [...per.entries()]
        .filter(([id]) => geldigeTool(id))
        .sort((a, b) => b[1] - a[1])
        .map(([id, aantal]) => ({ tool: id, positief: aantal }));
      return Response.json({ volgorde });
    } catch (e) {
      console.error("stem populair faalde:", e);
      return Response.json({ error: "Populair ophalen mislukt.", detail: String(e) }, { status: 502 });
    }
  }

  const tool = searchParams.get("tool") ?? "";
  const dag = searchParams.get("dag") ?? "";
  if (!geldigeTool(tool) || !DAG_RE.test(dag)) {
    return Response.json({ error: "Ongeldige tool of dag." }, { status: 400 });
  }
  try {
    return Response.json(await totalen(tool, dag));
  } catch (e) {
    // Detail in de log helpt bij de eerste setup (ontbrekende tabel,
    // verkeerde key). Zie AUDIT.md.
    console.error("stem GET faalde:", e);
    return Response.json({ error: "Stemmen ophalen mislukt.", detail: String(e) }, { status: 502 });
  }
}

export async function POST(req) {
  if (!dbGeconfigureerd()) {
    return Response.json({ error: "Stemmen staat nog niet aan." }, { status: 503 });
  }
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Geen geldige JSON." }, { status: 400 });
  }
  const { tool, dag, stem, apparaat } = body ?? {};
  if (
    !geldigeTool(tool) ||
    !DAG_RE.test(dag ?? "") ||
    ![1, -1].includes(stem) ||
    typeof apparaat !== "string" ||
    apparaat.length < 8 ||
    apparaat.length > 64
  ) {
    return Response.json({ error: "Ongeldige stem." }, { status: 400 });
  }
  try {
    await dbInsert(
      "stemmen",
      [{ tool_id: tool, dag, stem, apparaat }],
      { negeerDuplicaten: true }
    );
    return Response.json(await totalen(tool, dag));
  } catch {
    return Response.json({ error: "Stem opslaan mislukt." }, { status: 502 });
  }
}
