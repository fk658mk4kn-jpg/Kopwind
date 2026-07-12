/**
 * app/api/weather/route.js
 *
 * Uurvoorspelling van Open-Meteo voor een punt. Geen key nodig. De echte
 * aanroep zit in lib/server/externe.js en wordt gedeeld met de cron.
 * ?lat=..&lon=..&velden=a,b,c&dagen=5
 * Velden zijn optioneel en worden gevalideerd tegen de whitelist in
 * lib/engine/weather.js; standaard is de fiets-set.
 */

import { haalHourly } from "@/lib/server/externe";
import { valideerVelden } from "@/lib/engine/weather";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return Response.json({ error: "lat en lon zijn verplicht." }, { status: 400 });
  }

  const veldenParam = searchParams.get("velden");
  const velden = veldenParam ? valideerVelden(veldenParam.split(",")) : undefined;
  const dagen = searchParams.get("dagen") ?? undefined;

  try {
    const hourly = await haalHourly(lat, lon, velden, dagen);
    return Response.json({ hourly });
  } catch (e) {
    return Response.json(
      { error: "Weerdienst niet bereikbaar. Probeer het zo nog eens.", detail: String(e) },
      { status: 502 }
    );
  }
}
