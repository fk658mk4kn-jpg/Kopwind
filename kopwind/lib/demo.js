/**
 * lib/demo.js
 *
 * Demoketen door Rotterdam met kunstmatige wind. Draait door exact dezelfde
 * rekenpijplijn als echte data (via demoFetch) en dient meteen als
 * integratietest. Zo zie je de app werken zonder een adres in te vullen.
 */

import { haversine } from "./engine/wind.js";

export const DEMO_STOPS = [
  { naam: "Thuis (demo)", lat: 51.9236, lon: 4.503 },
  { naam: "Sportschool (demo)", lat: 51.9155, lon: 4.4718 },
  { naam: "Thuis (demo)", lat: 51.9236, lon: 4.503 },
  { naam: "Werk (demo)", lat: 51.9525, lon: 4.439 },
];

export function demoLegOptions(nu = new Date()) {
  const d = new Date(nu.getTime());
  d.setHours(7, 0, 0, 0);
  const p = (n) => String(n).padStart(2, "0");
  const tijd = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T07:00`;
  return [
    { mode: "vertrek", tijd },
    { mode: "auto", verblijfMin: 75 },
    { mode: "auto", verblijfMin: 40 },
  ];
}

/**
 * Bouwt een routegeometrie tussen twee punten: 48 punten op een lichte
 * sinusboog, zodat de bearing per segment een beetje varieert.
 *
 * @param {number} amplitude grootte van de boog (default 0.004); groter geeft
 *   een langere, meer westwaartse route met andere windexpositie
 */
export function demoRoute(from, to, amplitude = 0.004) {
  const N = 48;
  const coords = [];
  // Loodrechte richting voor de boog.
  const dLat = to[0] - from[0];
  const dLon = to[1] - from[1];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1);
    const boog = Math.sin(t * Math.PI) * amplitude;
    coords.push([
      from[0] + dLat * t + -dLon * boog,
      from[1] + dLon * t + dLat * boog,
    ]);
  }
  let distance = 0;
  for (let i = 1; i < coords.length; i++) {
    distance += haversine(coords[i - 1], coords[i]);
  }
  const duration = distance / (18 / 3.6); // 18 km/u fietstempo
  return { coords, distance, duration };
}

/**
 * 48 uur kunstmatig weer vanaf vandaag 00:00 lokale tijd. Wind uit het
 * zuidwesten (225 graden), stevig in de ochtend- en avondspits, rustiger
 * overdag. Regenkans loopt op na 15:00.
 */
export function demoHourly(nu = new Date()) {
  const start = new Date(nu.getTime());
  start.setHours(0, 0, 0, 0);
  const p = (n) => String(n).padStart(2, "0");
  const time = [];
  const wind_speed_10m = [];
  const wind_direction_10m = [];
  const wind_gusts_10m = [];
  const temperature_2m = [];
  const apparent_temperature = [];
  const precipitation = [];
  const precipitation_probability = [];

  for (let i = 0; i < 48; i++) {
    const d = new Date(start.getTime() + i * 3600 * 1000);
    const uur = d.getHours();
    time.push(
      `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:00`
    );
    const spitsOchtend = uur >= 6 && uur <= 9;
    const spitsAvond = uur >= 16 && uur <= 19;
    const snelheid = spitsOchtend ? 26 : spitsAvond ? 29 : 19;
    wind_speed_10m.push(snelheid);
    wind_direction_10m.push(225);
    wind_gusts_10m.push(snelheid + 15);
    temperature_2m.push(uur < 10 ? 11 : 15);
    apparent_temperature.push(uur < 10 ? 8 : 13);
    const regen = uur >= 18 && uur <= 21;
    precipitation.push(regen ? 0.6 : 0);
    precipitation_probability.push(uur >= 15 ? 65 : 20);
  }

  return {
    time,
    wind_speed_10m,
    wind_direction_10m,
    wind_gusts_10m,
    temperature_2m,
    apparent_temperature,
    precipitation,
    precipitation_probability,
  };
}

/**
 * Mock-fetch met dezelfde interface als de echte API-routes, zodat
 * berekenPlan er ongewijzigd doorheen kan. De routelaag geeft twee
 * alternatieven terug (snelste plus een ruimere boog met andere
 * windexpositie), zodat je de routevergelijking in de demo ziet werken.
 */
export function demoFetch(nu = new Date()) {
  const hourly = demoHourly(nu);
  return async (url, opts) => {
    if (typeof url === "string" && url.startsWith("/api/route")) {
      const body = JSON.parse(opts.body);
      return respond({
        routes: [
          demoRoute(body.from, body.to, 0.004),
          demoRoute(body.from, body.to, -0.02),
        ],
      });
    }
    if (typeof url === "string" && url.startsWith("/api/weather")) {
      return respond({ hourly });
    }
    return { ok: false, status: 404, json: async () => ({}) };
  };
}

function respond(data) {
  return { ok: true, status: 200, json: async () => data };
}
