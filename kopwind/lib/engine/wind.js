import { kleurDivergerend } from "./kleuren.js";

/**
 * lib/engine/wind.js
 *
 * Pure rekenkern voor Kopwind. Geen React, geen fetch, volledig testbaar.
 *
 * Conventies:
 * - Coordinaten zijn [lat, lon].
 * - windFromDeg is meteorologisch: de richting waar de wind VANDAAN komt.
 *   Noordenwind = 0 graden en waait naar het zuiden.
 * - headwind > 0 betekent tegenwind, headwind < 0 betekent rugwind.
 * - crosswind > 0 betekent wind van rechts, < 0 wind van links.
 */

const R_AARDE = 6371000; // meter

export function toRad(deg) {
  return (deg * Math.PI) / 180;
}

export function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

/** Afstand in meters tussen twee [lat, lon] punten (haversine). */
export function haversine(a, b) {
  const [lat1, lon1] = a;
  const [lat2, lon2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R_AARDE * Math.asin(Math.min(1, Math.sqrt(s)));
}

/**
 * Rijrichting (bearing) in graden van punt a naar punt b.
 * 0 = noord, 90 = oost, 180 = zuid, 270 = west.
 */
export function bearing(a, b) {
  const [lat1, lon1] = a;
  const [lat2, lon2] = b;
  const f1 = toRad(lat1);
  const f2 = toRad(lat2);
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(f2);
  const x =
    Math.cos(f1) * Math.sin(f2) - Math.sin(f1) * Math.cos(f2) * Math.cos(dLon);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/**
 * Kop- en zijwindcomponent voor een rijrichting.
 *
 * kopwind = windsnelheid x cos(windrichting - rijrichting)
 * zijwind = windsnelheid x sin(windrichting - rijrichting)
 *
 * Voorbeeld: noordenwind (windFrom 0) terwijl je naar het noorden fietst
 * (bearing 0) geeft rel = 0, cos = 1, dus volle tegenwind. Klopt: de wind
 * komt uit het noorden en jij fietst er recht tegenin.
 *
 * @param {number} speedKmh windsnelheid
 * @param {number} windFromDeg meteorologische windrichting (vandaan)
 * @param {number} bearingDeg rijrichting
 * @returns {{headwind: number, crosswind: number}} zelfde eenheid als speedKmh
 */
export function windComponents(speedKmh, windFromDeg, bearingDeg) {
  const rel = toRad(windFromDeg - bearingDeg);
  return {
    headwind: speedKmh * Math.cos(rel),
    crosswind: speedKmh * Math.sin(rel),
  };
}

/**
 * Splitst een routegeometrie in segmenten van ongeveer targetMeters lang.
 * Opeenvolgende routepunten worden samengevoegd tot het segment de
 * doellengte haalt; het laatste segment mag korter zijn.
 *
 * @param {Array<[number, number]>} coords route als [lat, lon] punten
 * @param {number} targetMeters gewenste segmentlengte (default 300)
 * @returns {Array<{start, end, mid, distance, bearing, cumStart, cumEnd, coords}>}
 */
export function segmentizeRoute(coords, targetMeters = 300) {
  if (!Array.isArray(coords) || coords.length < 2) return [];
  const segments = [];
  let cum = 0;
  let segCoords = [coords[0]];
  let segDist = 0;

  const sluitAf = () => {
    if (segCoords.length < 2 || segDist <= 0) return;
    const start = segCoords[0];
    const end = segCoords[segCoords.length - 1];
    const mid = segCoords[Math.floor(segCoords.length / 2)];
    segments.push({
      start,
      end,
      mid,
      distance: segDist,
      bearing: bearing(start, end),
      cumStart: cum - segDist,
      cumEnd: cum,
      coords: segCoords,
    });
  };

  for (let i = 1; i < coords.length; i++) {
    const d = haversine(coords[i - 1], coords[i]);
    segDist += d;
    cum += d;
    segCoords.push(coords[i]);
    const laatste = i === coords.length - 1;
    if (segDist >= targetMeters || laatste) {
      sluitAf();
      segCoords = [coords[i]];
      segDist = 0;
    }
  }
  return segments;
}

/** Classificeert een kopwindwaarde tegen de drempels. */
export function classifyHeadwind(headwind, thresholds) {
  if (headwind >= thresholds.tegenwindZwaar) return "zwaar";
  if (headwind >= thresholds.tegenwindMatig) return "matig";
  if (headwind <= -thresholds.tegenwindMatig) return "rugwind";
  return "neutraal";
}

/**
 * Continue kleur voor een kopwindwaarde: diep groen (rugwind) via amber naar
 * diep rood (tegenwind). Hoog verzadigd en donker genoeg om over kaarttegels
 * leesbaar te blijven; op de kaart komt er nog een witte omranding onder.
 * x wordt geklemd op -1..1 met x = headwind / tegenwindZwaar.
 */
export function colorForHeadwind(headwind, thresholds) {
  const x = Math.max(-1, Math.min(1, headwind / thresholds.tegenwindZwaar));
  // Divergerend blauw (rugwind) <-> oranje (tegenwind), colorblind-veilig;
  // de ramp zelf staat in lib/engine/kleuren.js.
  return kleurDivergerend(x);
}

/**
 * Representatieve wind voor een hele etappe: afstandsgewogen gemiddelde
 * windsnelheid en een circulair gemiddelde van de windrichting (vandaan).
 * Handig voor het kompas op de kaart. null als er geen weerdata is.
 */
export function legWindSummary(segments) {
  let sSin = 0;
  let sCos = 0;
  let sSpeed = 0;
  let gewicht = 0;
  for (const s of segments) {
    if (!s.weer || s.weer.windFrom == null || s.weer.windSpeed == null) continue;
    const rad = toRad(s.weer.windFrom);
    sSin += Math.sin(rad) * s.distance;
    sCos += Math.cos(rad) * s.distance;
    sSpeed += s.weer.windSpeed * s.distance;
    gewicht += s.distance;
  }
  if (gewicht === 0) return null;
  const from = (toDeg(Math.atan2(sSin, sCos)) + 360) % 360;
  return { from, speed: sSpeed / gewicht };
}

/**
 * Rondt een Date af op het dichtstbijzijnde hele uur en geeft een sleutel
 * in lokale tijd: "YYYY-MM-DDTHH:00". Matcht het formaat van Open-Meteo
 * met timezone-parameter.
 */
export function hourKey(date) {
  const d = new Date(date.getTime() + 30 * 60 * 1000);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:00`;
}

/**
 * Indexeert het hourly-blok van Open-Meteo naar een lookup op uursleutel.
 * @param {object} hourly het "hourly" object uit de Open-Meteo respons
 * @returns {Object<string, {windSpeed, windFrom, gust, temp, gevoel, neerslag, neerslagKans, tijd}>}
 */
export function indexHourly(hourly) {
  const idx = {};
  if (!hourly || !Array.isArray(hourly.time)) return idx;
  for (let i = 0; i < hourly.time.length; i++) {
    idx[hourly.time[i]] = {
      tijd: hourly.time[i],
      windSpeed: hourly.wind_speed_10m?.[i] ?? null,
      windFrom: hourly.wind_direction_10m?.[i] ?? null,
      gust: hourly.wind_gusts_10m?.[i] ?? null,
      temp: hourly.temperature_2m?.[i] ?? null,
      gevoel: hourly.apparent_temperature?.[i] ?? null,
      neerslag: hourly.precipitation?.[i] ?? null,
      neerslagKans: hourly.precipitation_probability?.[i] ?? null,
    };
  }
  return idx;
}

/**
 * Analyseert een etappe: segmenteert de route, koppelt elk segment aan het
 * juiste voorspellingsuur op basis van de passagetijd, en berekent kop- en
 * zijwind per segment plus metrics voor de hele etappe.
 *
 * @param {object} p
 * @param {Array<[number, number]>} p.coords routegeometrie [lat, lon]
 * @param {number} p.distance totale afstand in meters (van de router)
 * @param {number} p.duration totale duur in seconden (van de router)
 * @param {Date} p.departure vertrektijd
 * @param {object} p.hourly Open-Meteo hourly-blok
 * @param {object} p.thresholds drempels (zie lib/advice.js)
 * @param {number} [p.segmentLength] segmentlengte in meters
 */
export function analyzeLeg({
  coords,
  distance,
  duration,
  departure,
  hourly,
  thresholds,
  segmentLength = 300,
}) {
  const hourIdx = indexHourly(hourly);
  const rawSegments = segmentizeRoute(coords, segmentLength);
  const totaal = rawSegments.length
    ? rawSegments[rawSegments.length - 1].cumEnd
    : 0;

  let missendWeer = false;
  const segments = rawSegments.map((seg) => {
    const fractie = totaal > 0 ? seg.cumStart / totaal : 0;
    const passage = new Date(departure.getTime() + duration * 1000 * fractie);
    const weer = hourIdx[hourKey(passage)] ?? null;
    if (!weer) missendWeer = true;

    let headwind = 0;
    let crosswind = 0;
    if (weer && weer.windSpeed != null && weer.windFrom != null) {
      const c = windComponents(weer.windSpeed, weer.windFrom, seg.bearing);
      headwind = c.headwind;
      crosswind = c.crosswind;
    }
    const klasse = classifyHeadwind(headwind, thresholds);
    return {
      ...seg,
      fractie,
      passage,
      weer,
      headwind,
      crosswind,
      klasse,
      kleur: colorForHeadwind(headwind, thresholds),
    };
  });

  // Afstandsgewogen metrics over de segmenten met weerdata.
  let som = 0;
  let somPos = 0;
  let gewicht = 0;
  let maxHead = -Infinity;
  let maxGust = 0;
  let neerslagKansMax = 0;
  let neerslagMmMax = 0;
  let gevoelMin = Infinity;
  let matigMeters = 0;
  let zwaarMeters = 0;

  for (const s of segments) {
    gewicht += s.distance;
    som += s.headwind * s.distance;
    somPos += Math.max(0, s.headwind) * s.distance;
    if (s.headwind > maxHead) maxHead = s.headwind;
    if (s.headwind >= thresholds.tegenwindMatig) matigMeters += s.distance;
    if (s.headwind >= thresholds.tegenwindZwaar) zwaarMeters += s.distance;
    if (s.weer) {
      if (s.weer.gust != null) maxGust = Math.max(maxGust, s.weer.gust);
      if (s.weer.neerslagKans != null)
        neerslagKansMax = Math.max(neerslagKansMax, s.weer.neerslagKans);
      if (s.weer.neerslag != null)
        neerslagMmMax = Math.max(neerslagMmMax, s.weer.neerslag);
      if (s.weer.gevoel != null) gevoelMin = Math.min(gevoelMin, s.weer.gevoel);
    }
  }

  const metrics = {
    meanHead: gewicht > 0 ? som / gewicht : 0,
    meanPosHead: gewicht > 0 ? somPos / gewicht : 0,
    maxHead: maxHead === -Infinity ? 0 : maxHead,
    maxGust,
    neerslagKansMax,
    neerslagMmMax,
    gevoelMin: gevoelMin === Infinity ? null : gevoelMin,
    matigMeters,
    zwaarMeters,
    fracMatig: gewicht > 0 ? matigMeters / gewicht : 0,
    fracZwaar: gewicht > 0 ? zwaarMeters / gewicht : 0,
    distance,
    duration,
    missendWeer,
  };

  return {
    segments,
    metrics,
    samenvatting: summarizeLegNL(segments, metrics, thresholds),
  };
}

/**
 * Nederlandse tekstsamenvatting van de windhinder op een etappe, in de stijl
 * van "2,5 km stevige tegenwind halverwege, verder rustig".
 */
export function summarizeLegNL(segments, metrics, thresholds) {
  if (!segments.length) return "Geen routegegevens.";
  const totaal = segments[segments.length - 1].cumEnd;

  // Aaneengesloten stukken met kopwind boven de matig-drempel opsporen.
  const stukken = [];
  let huidig = null;
  for (const s of segments) {
    if (s.headwind >= thresholds.tegenwindMatig) {
      if (!huidig) {
        huidig = { van: s.cumStart, tot: s.cumEnd, som: 0, gewicht: 0 };
      } else {
        huidig.tot = s.cumEnd;
      }
      huidig.som += s.headwind * s.distance;
      huidig.gewicht += s.distance;
    } else if (huidig) {
      stukken.push(huidig);
      huidig = null;
    }
  }
  if (huidig) stukken.push(huidig);

  if (!stukken.length) {
    if (metrics.meanHead <= -thresholds.tegenwindMatig) {
      return "Overwegend rugwind, lekker meepakken.";
    }
    return "Weinig windhinder op deze etappe.";
  }

  const totLastKm = stukken.reduce((a, s) => a + (s.tot - s.van), 0) / 1000;
  if (totLastKm / (totaal / 1000) > 0.8) {
    const gem = stukken.reduce((a, s) => a + s.som, 0) /
      stukken.reduce((a, s) => a + s.gewicht, 0);
    const zwaarte = gem >= thresholds.tegenwindZwaar ? "stevige" : "merkbare";
    return `Vrijwel de hele etappe ${zwaarte} tegenwind.`;
  }

  const fmtKm = (m) =>
    (m / 1000).toFixed(1).replace(".", ",").replace(/,0$/, "");

  const delen = stukken.slice(0, 2).map((stuk) => {
    const gem = stuk.som / stuk.gewicht;
    const zwaarte = gem >= thresholds.tegenwindZwaar ? "stevige" : "merkbare";
    const midden = (stuk.van + stuk.tot) / 2 / totaal;
    const plek =
      midden < 0.33
        ? "aan het begin"
        : midden < 0.66
          ? "halverwege"
          : "aan het eind";
    return `${fmtKm(stuk.tot - stuk.van)} km ${zwaarte} tegenwind ${plek}`;
  });

  const rest = stukken.length > 2 ? ` en nog ${stukken.length - 2} korter stuk(ken)` : "";
  return `${delen.join(", ")}${rest}, verder rustig.`;
}
