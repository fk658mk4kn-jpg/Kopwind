/**
 * lib/engine/locatie.js
 *
 * Gedeelde locatielaag: adres zoeken en reverse geocoding via de eigen
 * Photon-proxy, huidige locatie via de browser, en favorietenlogica.
 * Elke tool die om een locatie vraagt gebruikt dit; het opgeloste
 * kernpijnpunt (locatie-invoer) blijft daarmee overal even goed.
 */

export async function zoekAdres(q) {
  if (!q || q.trim().length < 3) return [];
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ?? [];
}

export async function reverse(lat, lon) {
  const res = await fetch(`/api/geocode?lat=${lat}&lon=${lon}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.results?.[0] ?? null;
}

/** Huidige locatie als Promise van {naam, lat, lon}; werpt bij weigering. */
export function huidigeLocatie() {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocatie wordt niet ondersteund door deze browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        let naam = `Huidige locatie (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
        try {
          const r = await reverse(lat, lon);
          if (r?.naam) naam = r.naam;
        } catch {
          // Reverse geocoding is nice-to-have; coordinaten volstaan.
        }
        resolve({ naam, lat, lon });
      },
      () => reject(new Error("Kon je locatie niet bepalen. Geef de browser toestemming.")),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

export function isFavoriet(stop, presets) {
  if (!stop) return false;
  return (presets ?? []).some(
    (p) =>
      p.naam === stop.naam ||
      (Math.abs(p.lat - stop.lat) < 1e-4 && Math.abs(p.lon - stop.lon) < 1e-4)
  );
}
