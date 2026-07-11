/**
 * app/api/sync/route.js
 *
 * Synchronisatie tussen apparaten met een unieke code, zonder account.
 * De code is het geheim: wie hem kent, is de gebruiker. Server slaat
 * alleen een sha256-hash van de code op.
 *
 * POST           -> nieuw profiel, geeft { code } terug
 * GET ?code=...  -> { data, updatedAt } of 404
 * PUT { code, data } -> overschrijft (last write wins)
 */

import { dbGeconfigureerd, dbSelect, dbInsert, dbPatch } from "@/lib/server/db";
import { maakCode, hashCode } from "@/lib/server/codes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function nietGeconfigureerd() {
  return Response.json(
    {
      error:
        "Synchronisatie is nog niet geconfigureerd op de server (SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY ontbreken).",
    },
    { status: 501 }
  );
}

export async function POST() {
  if (!dbGeconfigureerd()) return nietGeconfigureerd();
  try {
    const code = maakCode();
    await dbInsert("profielen", [{ code_hash: hashCode(code), data: {} }]);
    return Response.json({ code });
  } catch (e) {
    return Response.json(
      { error: "Kon geen synccode aanmaken.", detail: String(e) },
      { status: 502 }
    );
  }
}

export async function GET(request) {
  if (!dbGeconfigureerd()) return nietGeconfigureerd();
  const code = new URL(request.url).searchParams.get("code");
  if (!code) return Response.json({ error: "code is verplicht." }, { status: 400 });
  try {
    const rows = await dbSelect(
      `profielen?code_hash=eq.${hashCode(code)}&select=data,updated_at`
    );
    if (!rows.length) {
      return Response.json({ error: "Onbekende synccode." }, { status: 404 });
    }
    return Response.json({ data: rows[0].data ?? {}, updatedAt: rows[0].updated_at });
  } catch (e) {
    return Response.json(
      { error: "Kon profiel niet laden.", detail: String(e) },
      { status: 502 }
    );
  }
}

export async function PUT(request) {
  if (!dbGeconfigureerd()) return nietGeconfigureerd();
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }
  const { code, data } = body ?? {};
  if (!code || typeof data !== "object") {
    return Response.json({ error: "code en data zijn verplicht." }, { status: 400 });
  }
  try {
    const hash = hashCode(code);
    const rows = await dbSelect(`profielen?code_hash=eq.${hash}&select=code_hash`);
    if (!rows.length) {
      return Response.json({ error: "Onbekende synccode." }, { status: 404 });
    }
    await dbPatch(`profielen?code_hash=eq.${hash}`, {
      data,
      updated_at: new Date().toISOString(),
    });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      { error: "Kon profiel niet opslaan.", detail: String(e) },
      { status: 502 }
    );
  }
}
