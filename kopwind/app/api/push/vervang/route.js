/**
 * app/api/push/vervang/route.js
 *
 * POST { oudEndpoint, subscription }
 *
 * Neemt een door de browser vernieuwd push-abonnement over: de rij met
 * het oude endpoint krijgt het nieuwe endpoint en de nieuwe
 * subscription, met behoud van code en instellingen. Wordt aangeroepen
 * door de pushsubscriptionchange-handler in de service worker; daar is
 * geen synccode beschikbaar, dus het oude endpoint is de sleutel.
 */

import { dbGeconfigureerd, dbPatch } from "@/lib/server/db";

export async function POST(request) {
  if (!dbGeconfigureerd()) {
    return Response.json({ error: "Database is niet geconfigureerd." }, { status: 503 });
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ongeldige JSON." }, { status: 400 });
  }
  const { oudEndpoint, subscription } = body ?? {};
  const nieuwEndpoint = subscription?.endpoint;
  if (!oudEndpoint || !nieuwEndpoint || !subscription?.keys) {
    return Response.json({ error: "oudEndpoint en een volledige subscription zijn verplicht." }, { status: 400 });
  }
  try {
    await dbPatch(`push_abos?endpoint=eq.${encodeURIComponent(oudEndpoint)}`, {
      endpoint: nieuwEndpoint,
      subscription,
    });
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: "Vervangen mislukt.", detail: String(e) }, { status: 500 });
  }
}
