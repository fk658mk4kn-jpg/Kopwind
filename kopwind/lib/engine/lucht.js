/**
 * lib/engine/lucht.js
 *
 * Luchtkwaliteit-laag (v3.4.0 "Ponente"): pollen uit de Open-Meteo Air
 * Quality API (CAMS Europa, 11 km). Zelfde vorm als de weer-laag: een
 * whitelist, een client-helper naar onze eigen API-route, en de route
 * praat met de externe dienst.
 */

export const LUCHT_VELDEN = ["grass_pollen", "birch_pollen", "alder_pollen"];

export function valideerLuchtVelden(velden) {
  const set = new Set(LUCHT_VELDEN);
  const goed = (velden ?? []).filter((v) => set.has(v));
  return goed.length ? goed : [...LUCHT_VELDEN];
}

/** Client-helper: pollenreeksen via onze eigen route. */
export async function haalLucht(lat, lon, velden = LUCHT_VELDEN, dagen = 5) {
  const url =
    `/api/lucht?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}` +
    `&velden=${encodeURIComponent(valideerLuchtVelden(velden).join(","))}` +
    `&dagen=${encodeURIComponent(dagen)}`;
  const res = await fetch(url);
  if (!res.ok) {
    let boodschap = `Luchtdienst gaf ${res.status}`;
    try {
      const data = await res.json();
      if (data?.error) boodschap = data.error;
    } catch {
      // Zonder JSON-body houden we de statusmelding.
    }
    throw new Error(boodschap);
  }
  const data = await res.json();
  return data.hourly;
}
