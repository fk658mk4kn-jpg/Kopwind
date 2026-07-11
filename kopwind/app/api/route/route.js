/**
 * app/api/route/route.js
 *
 * Fietsroutes tussen twee punten, inclusief alternatieven. De echte logica
 * zit in lib/server/externe.js en wordt gedeeld met de meldingen-cron.
 *
 * Body: { from: [lat, lon], to: [lat, lon] }
 * Respons: { routes: [ { coords: [[lat, lon], ...], distance, duration }, ... ] }
 */

import { haalRoutes } from "@/lib/server/externe";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Ongeldige aanvraag." }, { status: 400 });
  }
  const { from, to } = body ?? {};
  if (!isPunt(from) || !isPunt(to)) {
    return Response.json({ error: "from en to moeten [lat, lon] zijn." }, { status: 400 });
  }

  try {
    const routes = await haalRoutes(from, to);
    return Response.json({ routes });
  } catch (e) {
    return Response.json(
      { error: "Routering niet bereikbaar. Probeer het zo nog eens.", detail: String(e) },
      { status: 502 }
    );
  }
}

function isPunt(p) {
  return (
    Array.isArray(p) &&
    p.length === 2 &&
    Number.isFinite(p[0]) &&
    Number.isFinite(p[1])
  );
}
