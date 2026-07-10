/**
 * app/api/route/route.js
 *
 * Fietsroute tussen twee punten. Twee backends:
 * - Default: publieke OSRM-fietsrouter van FOSSGIS (geen key nodig).
 * - Met ORS_API_KEY in .env.local: OpenRouteService cycling-regular.
 *
 * Body: { from: [lat, lon], to: [lat, lon] }
 * Respons: { coords: [[lat, lon], ...], distance: meters, duration: seconden }
 */

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
    const key = process.env.ORS_API_KEY;
    const route = key ? await viaOrs(from, to, key) : await viaOsrm(from, to);
    return Response.json(route);
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

async function viaOsrm(from, to) {
  // OSRM verwacht lon,lat volgorde.
  const url =
    `https://routing.openstreetmap.de/routed-bike/route/v1/driving/` +
    `${from[1]},${from[0]};${to[1]},${to[0]}` +
    `?overview=full&geometries=geojson`;
  const res = await fetch(url, { headers: { "User-Agent": "kopwind-persoonlijk" } });
  if (!res.ok) throw new Error(`OSRM gaf ${res.status}`);
  const data = await res.json();
  const r = data.routes?.[0];
  if (!r) throw new Error("OSRM vond geen route.");
  return {
    coords: r.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
    distance: r.distance,
    duration: r.duration,
    bron: "osrm",
  };
}

async function viaOrs(from, to, key) {
  const res = await fetch(
    "https://api.openrouteservice.org/v2/directions/cycling-regular/geojson",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: key,
      },
      body: JSON.stringify({
        coordinates: [
          [from[1], from[0]],
          [to[1], to[0]],
        ],
      }),
    }
  );
  if (!res.ok) throw new Error(`OpenRouteService gaf ${res.status}`);
  const data = await res.json();
  const f = data.features?.[0];
  if (!f) throw new Error("OpenRouteService vond geen route.");
  return {
    coords: f.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
    distance: f.properties.summary.distance,
    duration: f.properties.summary.duration,
    bron: "ors",
  };
}
