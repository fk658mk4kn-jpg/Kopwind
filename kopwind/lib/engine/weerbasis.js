/**
 * lib/engine/weerbasis.js
 *
 * De gedeelde weerbasis (architectuurpunt 1 van de Zephyr-briefing): elke
 * locatie-tool vraagt dezelfde veldenset op (dus 1 fetch en 1 cache-entry
 * per plek) en krijgt hier per uur een genormaliseerd basisobject terug.
 * Een tool is daarbovenop een dunne overlay: welke factoren tellen, met
 * welke drempels, welke afgeleide maat en welke woorden.
 */

export const BASIS_VELDEN = [
  "temperature_2m",
  "apparent_temperature",
  "precipitation",
  "precipitation_probability",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "relative_humidity_2m",
  "cloud_cover",
  "uv_index",
  "is_day",
];

/**
 * Zet een Open-Meteo hourly-blok om in een lijst basis-uren.
 * @returns {Array<{tijd,datum,uur,temp,gevoel,neerslag,kans,wind,stoten,richting,rh,bewolking,uv,dag}>}
 */
export function bouwBasis(hourly) {
  if (!hourly?.time?.length) return [];
  const uren = [];
  for (let i = 0; i < hourly.time.length; i++) {
    const [datum, tijd] = hourly.time[i].split("T");
    uren.push({
      tijd: hourly.time[i],
      datum,
      uur: Number(tijd.slice(0, 2)),
      temp: hourly.temperature_2m?.[i] ?? null,
      gevoel: hourly.apparent_temperature?.[i] ?? hourly.temperature_2m?.[i] ?? null,
      neerslag: hourly.precipitation?.[i] ?? 0,
      kans: hourly.precipitation_probability?.[i] ?? 0,
      wind: hourly.wind_speed_10m?.[i] ?? 0,
      stoten: hourly.wind_gusts_10m?.[i] ?? null,
      richting: hourly.wind_direction_10m?.[i] ?? null,
      rh: hourly.relative_humidity_2m?.[i] ?? null,
      bewolking: hourly.cloud_cover?.[i] ?? null,
      uv: hourly.uv_index?.[i] ?? null,
      dag: (hourly.is_day?.[i] ?? 1) === 1,
    });
  }
  return uren;
}

/** Groepeert basis-uren per datum, binnen een uurvenster. */
export function basisPerDag(uren, vanUur = 0, totUur = 24) {
  const per = new Map();
  for (const u of uren) {
    if (u.uur < vanUur || u.uur >= totUur) continue;
    if (!per.has(u.datum)) per.set(u.datum, []);
    per.get(u.datum).push(u);
  }
  return per;
}

/** Lokale dag-sleutel (YYYY-MM-DD) van een Date, in wandkloktijd. */
export function dagKeyVan(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
