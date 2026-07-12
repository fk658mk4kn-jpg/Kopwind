/**
 * lib/planner.js
 *
 * Rekent een keten van stops door tot een dagplan met etappes, weer,
 * windanalyse, routealternatieven en advies. Netwerktoegang loopt via
 * fetchImpl zodat de hele pijplijn testbaar is met een mock (zie lib/demo.js).
 *
 * De opzet is bewust in twee stukken:
 * - haalRuweEtappes: doet het netwerk (routes met alternatieven + weer).
 * - stelPlanSamen: puur rekenwerk gegeven een routekeuze per etappe.
 * Zo kan de interface van route wisselen zonder opnieuw te fetchen.
 */

import { analyzeLeg } from "./engine/wind.js";
import { legAdvies, dagAdvies, DEFAULT_THRESHOLDS } from "./advice.js";
import { afrondOpKwartier } from "./format.js";

/**
 * Haalt per etappe de routealternatieven en het weer op. Geen tijdrekenwerk.
 * @returns {Array<{van, naar, routes: Array<{coords, distance, duration}>, hourly}>}
 */
export async function haalRuweEtappes({
  stops,
  fetchImpl = (...a) => fetch(...a),
}) {
  if (!Array.isArray(stops) || stops.length < 2) {
    throw new Error("Voeg minstens twee stops toe.");
  }

  const legsRaw = [];
  for (let i = 0; i < stops.length - 1; i++) {
    const van = stops[i];
    const naar = stops[i + 1];

    const routeRes = await fetchImpl("/api/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: [van.lat, van.lon], to: [naar.lat, naar.lon] }),
    });
    if (!routeRes.ok) {
      throw new Error(`Route van ${van.naam} naar ${naar.naam} ophalen mislukt.`);
    }
    const routeData = await routeRes.json();
    // Nieuwe vorm { routes: [...] }, met tolerantie voor een losse route.
    const routes = Array.isArray(routeData.routes)
      ? routeData.routes
      : routeData.coords
        ? [routeData]
        : [];
    const primair = routes[0];
    if (!primair || !primair.coords || primair.coords.length < 2 || primair.distance < 50) {
      throw new Error(
        `${van.naam} en ${naar.naam} liggen op vrijwel dezelfde plek, daar valt weinig te plannen.`
      );
    }

    const mid = primair.coords[Math.floor(primair.coords.length / 2)];
    const weerRes = await fetchImpl(`/api/weather?lat=${mid[0]}&lon=${mid[1]}`);
    if (!weerRes.ok) {
      throw new Error(`Weer ophalen voor etappe ${i + 1} mislukt.`);
    }
    const weer = await weerRes.json();

    legsRaw.push({ van, naar, routes, hourly: weer.hourly });
  }
  return legsRaw;
}

/**
 * Stelt het dagplan samen gegeven de ruwe etappes en een routekeuze.
 * Puur en snel, zodat de interface direct kan herrekenen bij een routewissel.
 *
 * @param {object} p
 * @param {Array} p.legsRaw uit haalRuweEtappes
 * @param {Array} p.legOptions tijdopties per etappe
 * @param {Array<number>} [p.selection] gekozen route-index per etappe (default snelste, 0)
 * @param {object} [p.thresholds]
 * @param {Date} [p.nu]
 */
export function stelPlanSamen({
  legsRaw,
  legOptions,
  selection,
  thresholds = DEFAULT_THRESHOLDS,
  nu = new Date(),
}) {
  const legs = [];
  let vorigeAankomst = null;

  legsRaw.forEach((raw, i) => {
    const opties = legOptions?.[i] ?? { mode: "auto" };
    const maxIdx = raw.routes.length - 1;
    const selIdx = Math.max(0, Math.min(maxIdx, selection?.[i] ?? 0));

    // Vertrektijd hangt bij aankomstmodus af van de gekozen route.
    const selRoute = raw.routes[selIdx];
    const departure = resolveDeparture(opties, selRoute.duration, vorigeAankomst, nu);

    // Alle alternatieven op dezelfde vertrektijd analyseren, zodat je de
    // windscores eerlijk kunt vergelijken.
    const alternatieven = raw.routes.map((r, ri) => {
      const analyse = analyzeLeg({
        coords: r.coords,
        distance: r.distance,
        duration: r.duration,
        departure,
        hourly: raw.hourly,
        thresholds,
        segmentLength: thresholds.segmentLengte,
      });
      return {
        index: ri,
        coords: r.coords,
        distance: r.distance,
        duration: r.duration,
        segments: analyse.segments,
        metrics: analyse.metrics,
        samenvatting: analyse.samenvatting,
        advies: legAdvies(analyse.metrics, thresholds),
      };
    });

    const gekozen = alternatieven[selIdx];
    const arrival = new Date(departure.getTime() + gekozen.duration * 1000);
    vorigeAankomst = arrival;

    legs.push({
      van: raw.van,
      naar: raw.naar,
      departure,
      arrival,
      distance: gekozen.distance,
      duration: gekozen.duration,
      segments: gekozen.segments,
      metrics: gekozen.metrics,
      samenvatting: gekozen.samenvatting,
      advies: gekozen.advies,
      alternatieven,
      gekozenIndex: selIdx,
      warning: gekozen.metrics.missendWeer
        ? "Voor een deel van deze etappe is geen uurvoorspelling beschikbaar (Open-Meteo kijkt hier ongeveer 4 dagen vooruit)."
        : null,
    });
  });

  return { legs, dag: dagAdvies(legs) };
}

/**
 * Gemak: haalt op en stelt samen in een keer, met de snelste route per
 * etappe als default. Gebruikt door de meldingen en de tests.
 */
export async function berekenPlan({
  stops,
  legOptions,
  thresholds = DEFAULT_THRESHOLDS,
  fetchImpl = (...a) => fetch(...a),
  nu = new Date(),
  selection,
}) {
  const legsRaw = await haalRuweEtappes({ stops, fetchImpl });
  return stelPlanSamen({ legsRaw, legOptions, selection, thresholds, nu });
}

/**
 * Bepaalt de vertrektijd van een rit.
 * - mode "nu": direct vertrekken, de actuele situatie.
 * - mode "vertrek": de opgegeven tijd.
 * - mode "aankomst": opgegeven aankomsttijd min de reistijd.
 * - mode "auto": aankomst vorige rit plus verblijftijd, of nu afgerond
 *   op het eerstvolgende kwartier voor de eerste rit.
 */
export function resolveDeparture(opties, durationSec, vorigeAankomst, nu) {
  if (opties.mode === "nu") {
    return new Date(nu.getTime());
  }
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
