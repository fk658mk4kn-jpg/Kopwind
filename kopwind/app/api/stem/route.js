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
  const rijen = await dbSelect(
    `stemmen?tool_id=eq.${encodeURIComponent(tool)}&dag=eq.${dag}&select=stem`
  );
  let omhoog = 0;
  let omlaag = 0;
  for (const r of rijen) {
    if (r.stem === 1) omhoog++;
    else if (r.stem === -1) omlaag++;
  }
  return { omhoog, omlaag };
}

export async function GET(req) {
  if (!dbGeconfigureerd()) {
    return Response.json({ error: "Stemmen staat nog niet aan." }, { status: 503 });
  }
  const { searchParams } = new URL(req.url);
  const tool = searchParams.get("tool") ?? "";
  const dag = searchParams.get("dag") ?? "";
  if (!geldigeTool(tool) || !DAG_RE.test(dag)) {
    return Response.json({ error: "Ongeldige tool of dag." }, { status: 400 });
  }
  try {
    return Response.json(await totalen(tool, dag));
  } catch {
    return Response.json({ error: "Stemmen ophalen mislukt." }, { status: 502 });
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
