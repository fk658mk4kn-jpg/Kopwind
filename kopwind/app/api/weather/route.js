/**
 * app/api/weather/route.js
 *
 * Uurvoorspelling van Open-Meteo voor een punt. Geen key nodig.
 * ?lat=..&lon=..
 * Respons: het "hourly" blok van Open-Meteo, ongewijzigd doorgegeven.
 */

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return Response.json({ error: "lat en lon zijn verplicht." }, { status: 400 });
  }

  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&hourly=temperature_2m,apparent_temperature,precipitation,precipitation_probability,` +
    `wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
    `&wind_speed_unit=kmh&timezone=Europe%2FAmsterdam&forecast_days=4`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo gaf ${res.status}`);
    const data = await res.json();
    return Response.json({ hourly: data.hourly });
  } catch (e) {
    return Response.json(
      { error: "Weerdienst niet bereikbaar. Probeer het zo nog eens.", detail: String(e) },
      { status: 502 }
    );
  }
}
