/**
 * app/api/minutely/route.js
 *
 * 15-minuten neerslagvoorspelling voor een punt, voor de regen-timing-
 * check. ?lat=..&lon=..&dagen=1. Voor Centraal-Europa levert Open-Meteo
 * dit op basis van DWD ICON-D2 en Meteo-France AROME (echte nowcast, geen
 * interpolatie).
 */

import { haalMinutely } from "@/lib/server/externe";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return Response.json({ error: "lat en lon zijn verplicht." }, { status: 400 });
  }
  const dagen = searchParams.get("dagen") ?? undefined;
  try {
    const minutely = await haalMinutely(lat, lon, dagen);
    return Response.json({ minutely });
  } catch (e) {
    return Response.json(
      { error: "Neerslagdienst niet bereikbaar. Probeer het zo nog eens.", detail: String(e) },
      { status: 502 }
    );
  }
}
