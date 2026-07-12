/**
 * lib/engine/weather.js
 *
 * Weer als vervangbare adapter (Open-Meteo is de eerste bron). Een tool
 * declareert welke velden hij nodig heeft; de proxy valideert tegen deze
 * whitelist. Andere databronnen (bv. sportfixtures voor een patroon-C-tool)
 * krijgen later hun eigen adapter naast deze, met dezelfde schil eromheen.
 */

export const WEER_VELDEN = [
  "temperature_2m",
  "apparent_temperature",
  "precipitation",
  "precipitation_probability",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "relative_humidity_2m",
  "uv_index",
  "cloud_cover",
  "is_day",
];

export const STANDAARD_VELDEN = [
  "temperature_2m",
  "apparent_temperature",
  "precipitation",
  "precipitation_probability",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
];

export function valideerVelden(velden) {
  const uniek = [...new Set(velden ?? [])].filter((v) => WEER_VELDEN.includes(v));
  return uniek.length ? uniek : STANDAARD_VELDEN;
}

/**
 * Clientkant: uurdata ophalen via de eigen proxy, met een sessiecache van
 * tien minuten. Omdat alle locatie-tools dezelfde BASIS_VELDEN vragen,
 * delen de hub-hero en de tools per plek dezelfde fetch (architectuur:
 * weerbasis een keer per locatie, overlays erbovenop).
 */
const CACHE_MS = 10 * 60 * 1000;
const cache = new Map();

export async function haalWeer(lat, lon, velden = STANDAARD_VELDEN, dagen = 4) {
  const echte = valideerVelden(velden);
  const sleutel = `${Number(lat).toFixed(3)},${Number(lon).toFixed(3)}|${[...echte].sort().join(",")}|${dagen}`;
  const nu = Date.now();
  const hit = cache.get(sleutel);
  if (hit && nu - hit.tijd < CACHE_MS) return hit.hourly;

  const v = encodeURIComponent(echte.join(","));
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}&velden=${v}&dagen=${dagen}`);
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error ?? "Weer ophalen mislukt.");
  }
  const data = await res.json();
  cache.set(sleutel, { tijd: nu, hourly: data.hourly });
  if (cache.size > 30) cache.delete(cache.keys().next().value);
  return data.hourly;
}
