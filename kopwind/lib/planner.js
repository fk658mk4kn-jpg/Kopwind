/**
 * lib/planner.js
 *
 * Rekent een keten van stops door tot een dagplan met etappes, weer,
 * windanalyse en advies. Netwerktoegang loopt via fetchImpl zodat de
 * hele pijplijn testbaar is met een mock (zie lib/demo.js).
 */

import { analyzeLeg } from "./wind.js";
import { legAdvies, dagAdvies, DEFAULT_THRESHOLDS } from "./advice.js";
import { afrondOpKwartier } from "./format.js";

/**
 * @param {object} p
 * @param {Array<{naam: string, lat: number, lon: number}>} p.stops minimaal 2
 * @param {Array<{mode: "auto"|"vertrek"|"aankomst", tijd?: string, verblijfMin?: number}>} p.legOptions
 *   opties voor etappe i (van stop i naar stop i+1); tijd is een
 *   datetime-local string voor de modes vertrek en aankomst
 * @param {object} [p.thresholds]
 * @param {Function} [p.fetchImpl]
 * @param {Date} [p.nu]
 */
export async function berekenPlan({
  stops,
  legOptions,
  thresholds = DEFAULT_THRESHOLDS,
  fetchImpl = (...a) => fetch(...a),
  nu = new Date(),
}) {
  if (!Array.isArray(stops) || stops.length < 2) {
    throw new Error("Voeg minstens twee stops toe.");
  }

  const legs = [];
  let vorigeAankomst = null;

  for (let i = 0; i < stops.length - 1; i++) {
    const van = stops[i];
    const naar = stops[i + 1];
    const opties = legOptions?.[i] ?? { mode: "auto" };

    // 1. Route ophalen.
    const routeRes = await fetchImpl("/api/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: [van.lat, van.lon], to: [naar.lat, naar.lon] }),
    });
    if (!routeRes.ok) {
      throw new Error(`Route van ${van.naam} naar ${naar.naam} ophalen mislukt.`);
    }
    const route = await routeRes.json();
    if (!route.coords || route.coords.length < 2 || route.distance < 50) {
      throw new Error(
        `${van.naam} en ${naar.naam} liggen op vrijwel dezelfde plek, daar valt weinig te plannen.`
      );
    }

    // 2. Vertrektijd bepalen.
    const departure = resolveDeparture(opties, route.duration, vorigeAankomst, nu);
    const arrival = new Date(departure.getTime() + route.duration * 1000);
    vorigeAankomst = arrival;

    // 3. Weer op het middelpunt van de route.
    const mid = route.coords[Math.floor(route.coords.length / 2)];
    const weerRes = await fetchImpl(`/api/weather?lat=${mid[0]}&lon=${mid[1]}`);
    if (!weerRes.ok) {
      throw new Error(`Weer ophalen voor etappe ${i + 1} mislukt.`);
    }
    const weer = await weerRes.json();

    // 4. Analyse en advies.
    const analyse = analyzeLeg({
      coords: route.coords,
      distance: route.distance,
      duration: route.duration,
      departure,
      hourly: weer.hourly,
      thresholds,
      segmentLength: thresholds.segmentLengte,
    });
    const advies = legAdvies(analyse.metrics, thresholds);

    legs.push({
      van,
      naar,
      departure,
      arrival,
      distance: route.distance,
      duration: route.duration,
      segments: analyse.segments,
      metrics: analyse.metrics,
      samenvatting: analyse.samenvatting,
      advies,
      warning: analyse.metrics.missendWeer
        ? "Voor een deel van deze etappe is geen uurvoorspelling beschikbaar (Open-Meteo kijkt hier ongeveer 4 dagen vooruit)."
        : null,
    });
  }

  return { legs, dag: dagAdvies(legs) };
}

/**
 * Bepaalt de vertrektijd van een etappe.
 * - mode "vertrek": de opgegeven tijd.
 * - mode "aankomst": opgegeven aankomsttijd min de reistijd.
 * - mode "auto": aankomst vorige etappe plus verblijftijd, of nu afgerond
 *   op het eerstvolgende kwartier voor de eerste etappe.
 */
export function resolveDeparture(opties, durationSec, vorigeAankomst, nu) {
  if (opties.mode === "vertrek" && opties.tijd) {
    return new Date(opties.tijd);
  }
  if (opties.mode === "aankomst" && opties.tijd) {
    return new Date(new Date(opties.tijd).getTime() - durationSec * 1000);
  }
  if (vorigeAankomst) {
    const verblijf = Number.isFinite(opties.verblijfMin) ? opties.verblijfMin : 45;
    return new Date(vorigeAankomst.getTime() + verblijf * 60 * 1000);
  }
  return afrondOpKwartier(nu);
}
