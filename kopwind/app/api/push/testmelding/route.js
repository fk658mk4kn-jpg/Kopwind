/**
 * app/api/push/testmelding/route.js
 *
 * Stuurt direct een testmelding naar alle apparaten van een profiel, zodat
 * je op je telefoon kunt zien dat de keten werkt.
 * POST { code }
 */

import { dbGeconfigureerd, dbSelect } from "@/lib/server/db";
import { verstuurNaarAbos, pushGeconfigureerd } from "@/lib/server/push";
import { hashCode } from "@/lib/server/codes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  if (!dbGeconfigureerd() || !pushGeconfigureerd()) {
    return Response.json(
      { error: "Push is nog niet geconfigureerd op de server." },
      { status: 501 }
    );
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }
  const { code } = body ?? {};
  if (!code) return Response.json({ error: "code is verplicht." }, { status: 400 });

  try {
    const abos = await dbSelect(
      `push_abos?code_hash=eq.${hashCode(code)}&select=endpoint,subscription`
    );
    if (!abos.length) {
      return Response.json(
        { error: "Geen apparaten gekoppeld voor deze code." },
        { status: 404 }
      );
    }
    const ok = await verstuurNaarAbos(abos, {
      title: "Fietscheck testmelding",
      body: "Werkt. Zo komen je ochtendbriefing en vertrekherinneringen binnen.",
      tag: "test",
    });
    return Response.json({ verzonden: ok, apparaten: abos.length });
  } catch (e) {
    return Response.json(
      { error: "Testmelding versturen mislukt.", detail: String(e) },
      { status: 502 }
    );
  }
}
