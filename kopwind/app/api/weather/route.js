/**
 * app/api/weather/route.js
 *
 * Uurvoorspelling van Open-Meteo voor een punt. Geen key nodig. De echte
 * aanroep zit in lib/server/externe.js en wordt gedeeld met de cron.
 * ?lat=..&lon=..
 */

import { haalHourly } from "@/lib/server/externe";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return Response.json({ error: "lat en lon zijn verplicht." }, { status: 400 });
  }

  try {
    const hourly = await haalHourly(lat, lon);
    return Response.json({ hourly });
  } catch (e) {
    return Response.json(
      { error: "Weerdienst niet bereikbaar. Probeer het zo nog eens.", detail: String(e) },
      { status: 502 }
    );
  }
}
