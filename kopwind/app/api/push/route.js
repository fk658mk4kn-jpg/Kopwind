/**
 * app/api/push/route.js
 *
 * Push-abonnementen per apparaat, gekoppeld aan een synccode.
 * POST { code, subscription }  -> abonneren
 * DELETE { code, endpoint }    -> opzeggen
 * GET                          -> { publicKey } voor de client
 */

import { dbGeconfigureerd, dbSelect, dbUpsert, dbDelete } from "@/lib/server/db";
import { hashCode } from "@/lib/server/codes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? process.env.VAPID_PUBLIC_KEY;
  if (!publicKey) {
    return Response.json(
      { error: "Push is nog niet geconfigureerd (VAPID-sleutels ontbreken)." },
      { status: 501 }
    );
  }
  return Response.json({ publicKey });
}

export async function POST(request) {
  if (!dbGeconfigureerd()) {
    return Response.json({ error: "Database niet geconfigureerd." }, { status: 501 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }
  const { code, subscription } = body ?? {};
  if (!code || !subscription?.endpoint) {
    return Response.json({ error: "code en subscription zijn verplicht." }, { status: 400 });
  }
  try {
    const hash = hashCode(code);
    const rows = await dbSelect(`profielen?code_hash=eq.${hash}&select=code_hash`);
    if (!rows.length) {
      return Response.json({ error: "Onbekende synccode." }, { status: 404 });
    }
    await dbUpsert("push_abos", [
      { endpoint: subscription.endpoint, code_hash: hash, subscription },
    ]);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      { error: "Kon abonnement niet opslaan.", detail: String(e) },
      { status: 502 }
    );
  }
}

export async function DELETE(request) {
  if (!dbGeconfigureerd()) {
    return Response.json({ error: "Database niet geconfigureerd." }, { status: 501 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }
  const { endpoint } = body ?? {};
  if (!endpoint) {
    return Response.json({ error: "endpoint is verplicht." }, { status: 400 });
  }
  try {
    await dbDelete(`push_abos?endpoint=eq.${encodeURIComponent(endpoint)}`);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json(
      { error: "Kon abonnement niet opzeggen.", detail: String(e) },
      { status: 502 }
    );
  }
}
