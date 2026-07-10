/**
 * app/api/geocode/route.js
 *
 * Dunne proxy naar Photon (komoot). Twee modes:
 * - ?q=zoektekst           autocomplete, met bias naar het midden van NL
 * - ?lat=..&lon=..         reverse geocoding (huidige locatie naar naam)
 *
 * Geen API-key nodig. Fair-use: publieke instance, prima voor persoonlijk
 * gebruik.
 */

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  try {
    if (lat && lon) {
      const url = `https://photon.komoot.io/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
      const res = await fetch(url, { headers: { "User-Agent": "kopwind-persoonlijk" } });
      if (!res.ok) throw new Error(`Photon reverse gaf ${res.status}`);
      const data = await res.json();
      return Response.json({ results: mapFeatures(data.features).slice(0, 1) });
    }

    if (!q || q.trim().length < 3) {
      return Response.json({ results: [] });
    }

    const url =
      `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}` +
      `&limit=6&lat=52.1&lon=5.3`; // bias naar het midden van Nederland
    const res = await fetch(url, { headers: { "User-Agent": "kopwind-persoonlijk" } });
    if (!res.ok) throw new Error(`Photon gaf ${res.status}`);
    const data = await res.json();
    return Response.json({ results: mapFeatures(data.features) });
  } catch (e) {
    return Response.json(
      { error: "Geocoding niet bereikbaar. Probeer het zo nog eens.", detail: String(e) },
      { status: 502 }
    );
  }
}

function mapFeatures(features) {
  if (!Array.isArray(features)) return [];
  return features
    .filter((f) => f?.geometry?.coordinates)
    .map((f) => {
      const p = f.properties ?? {};
      const delen = [
        p.name,
        [p.street, p.housenumber].filter(Boolean).join(" "),
        p.city ?? p.town ?? p.village,
      ].filter(Boolean);
      // Ontdubbelen als name gelijk is aan de straat.
      const label = [...new Set(delen)].join(", ") || "Onbekende plek";
      return {
        naam: label,
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0],
      };
    });
}
