/**
 * app/api/lucht/route.js
 *
 * Pollenreeksen van de Open-Meteo Air Quality API voor een punt. Zelfde
 * contract als /api/weather: ?lat=..&lon=..&velden=a,b&dagen=5. Velden
 * gevalideerd tegen de whitelist in lib/engine/lucht.js.
 */

import { haalLuchtHourly } from "@/lib/server/externe";
import { valideerLuchtVelden } from "@/lib/engine/lucht";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return Response.json({ error: "lat en lon zijn verplicht." }, { status: 400 });
  }
  const veldenParam = searchParams.get("velden");
  const velden = valideerLuchtVelden(veldenParam ? veldenParam.split(",") : undefined);
  const dagen = searchParams.get("dagen") ?? undefined;
  try {
    const hourly = await haalLuchtHourly(lat, lon, velden, dagen);
    return Response.json({ hourly });
  } catch (e) {
    return Response.json(
      { error: "Pollendienst niet bereikbaar. Probeer het zo nog eens.", detail: String(e) },
      { status: 502 }
    );
  }
}
