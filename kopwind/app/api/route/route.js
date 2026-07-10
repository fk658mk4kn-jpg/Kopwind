/**
 * app/api/route/route.js
 *
 * Fietsroutes tussen twee punten, inclusief alternatieven zodat de app kan
 * laten zien of een andere route minder tegenwind heeft. Twee backends:
 * - Default: publieke OSRM-fietsrouter van FOSSGIS (geen key nodig).
 * - Met ORS_API_KEY in .env.local: OpenRouteService cycling-regular.
 *
 * Body: { from: [lat, lon], to: [lat, lon] }
 * Respons: { routes: [ { coords: [[lat, lon], ...], distance, duration }, ... ] }
 * De eerste route is de snelste; daarna maximaal twee alternatieven.
 */

export const dynamic = "force-dynamic";

const MAX_ROUTES = 3;

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
    const routes = key ? await viaOrs(from, to, key) : await viaOsrm(from, to);
    return Response.json({ routes: routes.slice(0, MAX_ROUTES) });
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
    `?overview=full&geometries=geojson&alternatives=3`;
  const res = await fetch(url, { headers: { "User-Agent": "kopwind-persoonlijk" } });
  if (!res.ok) throw new Error(`OSRM gaf ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data.routes) || !data.routes.length) {
    throw new Error("OSRM vond geen route.");
  }
  return data.routes.map((r) => ({
    coords: r.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
    distance: r.distance,
    duration: r.duration,
  }));
}

async function viaOrs(from, to, key) {
  const coordinates = [
    [from[1], from[0]],
    [to[1], to[0]],
  ];
  // Eerst met alternatieven; bij korte ritten kan ORS dat weigeren, dan zonder.
  let data = await orsCall(coordinates, key, true);
  if (!data) data = await orsCall(coordinates, key, false);
  if (!data || !Array.isArray(data.features) || !data.features.length) {
    throw new Error("OpenRouteService vond geen route.");
  }
  return data.features.map((f) => ({
    coords: f.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
    distance: f.properties.summary.distance,
    duration: f.properties.summary.duration,
  }));
}

async function orsCall(coordinates, key, metAlternatieven) {
  const payload = { coordinates };
  if (metAlternatieven) {
    payload.alternative_routes = { target_count: 3, share_factor: 0.6, weight_factor: 1.6 };
  }
  const res = await fetch(
    "https://api.openrouteservice.org/v2/directions/cycling-regular/geojson",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: key },
      body: JSON.stringify(payload),
    }
  );
  if (!res.ok) return null;
  return res.json();
}
