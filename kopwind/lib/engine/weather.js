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

/** Clientkant: uurdata ophalen via de eigen proxy. */
export async function haalWeer(lat, lon, velden = STANDAARD_VELDEN, dagen = 4) {
  const v = encodeURIComponent(valideerVelden(velden).join(","));
  const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}&velden=${v}&dagen=${dagen}`);
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error ?? "Weer ophalen mislukt.");
  }
  const data = await res.json();
  return data.hourly;
}
