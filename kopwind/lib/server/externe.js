/**
 * lib/server/externe.js
 *
 * Directe aanroepen naar de externe diensten (OSRM of OpenRouteService,
 * Open-Meteo). Gedeeld door de API-routes (voor de browser) en de
 * meldingen-cron (die zelf rekent, want de telefoon-app is dan dicht).
 */

import { valideerVelden, STANDAARD_VELDEN } from "../engine/weather.js";

const MAX_ROUTES = 3;

/** Fietsroutes met alternatieven. from/to zijn [lat, lon]. */
export async function haalRoutes(from, to) {
  const key = process.env.ORS_API_KEY;
  const routes = key ? await viaOrs(from, to, key) : await viaOsrm(from, to);
  return routes.slice(0, MAX_ROUTES);
}

async function viaOsrm(from, to) {
  // OSRM verwacht lon,lat volgorde.
  const url =
    `https://routing.openstreetmap.de/routed-bike/route/v1/driving/` +
    `${from[1]},${from[0]};${to[1]},${to[0]}` +
    `?overview=full&geometries=geojson&alternatives=3`;
  const res = await fetch(url, { headers: { "User-Agent": "fietscheck-persoonlijk" } });
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

/**
 * Open-Meteo uurvoorspelling voor een punt. Tools declareren hun velden
 * (whitelist in lib/engine/weather.js); standaard is de fiets-set zodat
 * bestaande aanroepen ongewijzigd blijven.
 */
export async function haalHourly(lat, lon, velden = STANDAARD_VELDEN, dagen = 4) {
  const v = valideerVelden(velden).join(",");
  const d = Math.min(7, Math.max(1, Number(dagen) || 4));
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&hourly=${encodeURIComponent(v)}` +
    `&wind_speed_unit=kmh&timezone=Europe%2FAmsterdam&forecast_days=${d}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo gaf ${res.status}`);
  const data = await res.json();
  return data.hourly;
}

/**
 * fetchImpl voor berekenPlan op de server: vangt de interne API-paden af en
 * roept de externe diensten direct aan. Zo draait exact dezelfde pijplijn
 * als in de browser.
 */
/** Pollen-uurreeksen van de Open-Meteo Air Quality API (CAMS Europa). */
/** 15-minuten neerslagreeks (DWD ICON-D2 / Meteo-France AROME voor NL). */
export async function haalMinutely(lat, lon, dagen = 1) {
  const d = Math.min(2, Math.max(1, Number(dagen) || 1));
  const velden = "precipitation,precipitation_probability";
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&minutely_15=${encodeURIComponent(velden)}` +
    `&timezone=Europe%2FAmsterdam&forecast_days=${d}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo (minutely) gaf ${res.status}`);
  const data = await res.json();
  return data.minutely_15;
}

export async function haalLuchtHourly(lat, lon, velden, dagen = 5) {
  const v = (velden?.length ? velden : ["grass_pollen", "birch_pollen", "alder_pollen"]).join(",");
  const d = Math.min(7, Math.max(1, Number(dagen) || 5));
  const url =
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}` +
    `&hourly=${encodeURIComponent(v)}` +
    `&timezone=Europe%2FAmsterdam&forecast_days=${d}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Air Quality API gaf ${res.status}`);
  const data = await res.json();
  return data.hourly;
}

export function serverFetch() {
  return async (url, opts) => {
    try {
      if (typeof url === "string" && url.startsWith("/api/route")) {
        const body = JSON.parse(opts.body);
        const routes = await haalRoutes(body.from, body.to);
        return respond({ routes });
      }
      if (typeof url === "string" && url.startsWith("/api/weather")) {
        const u = new URL(url, "http://x");
        const hourly = await haalHourly(u.searchParams.get("lat"), u.searchParams.get("lon"));
        return respond({ hourly });
      }
    } catch (e) {
      return { ok: false, status: 502, json: async () => ({ error: String(e) }) };
    }
    return { ok: false, status: 404, json: async () => ({}) };
  };
}

function respond(data) {
  return { ok: true, status: 200, json: async () => data };
}

/**
 * "Nu" in Nederlandse wandkloktijd, ook als de server in UTC draait
 * (Vercel). Alle logica in de app rekent met lokale klokmethoden, dus met
 * deze verschoven Date klopt alles end-to-end.
 */
export function nuAmsterdam() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Amsterdam" }));
}
