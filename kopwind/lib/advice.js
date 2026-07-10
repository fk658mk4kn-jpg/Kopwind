/**
 * lib/advice.js
 *
 * Pijnscore (0 tot 100, hoger is vervelender om te fietsen) per rit en het
 * dagadvies. Puur en testbaar. Naar de gebruiker toe wordt de score getoond
 * als rapportcijfer (zie fmtCijfer in lib/format.js): score 0 is een 10,
 * score 30 een 7,0, score 60 een 4,0.
 *
 * De score is bewust continu vanaf lichte wind. In een eerdere versie
 * telde alleen het ritgemiddelde boven een harde drempel; dan kreeg een rit
 * met "1,9 km merkbare tegenwind" alsnog score 0 en dat voelde kapot.
 * Nu tellen ook de tegenwindstukken zelf mee, zodat cijfer en toelichting
 * altijd hetzelfde verhaal vertellen.
 */

export const DEFAULT_THRESHOLDS = {
  tegenwindMatig: 12, // km/u kopwind waarboven een stuk als merkbaar telt
  tegenwindZwaar: 22, // km/u kopwind waarboven het echt pijn doet
  neerslagKans: 60, // % waarboven regen gaat meetellen
  neerslagMm: 1.0, // mm/u waarboven regen zwaar meetelt
  gevoelMin: 0, // graden gevoelstemperatuur waaronder extra punten
  segmentLengte: 300, // meter per routesegment
};

function lerp(x, x0, x1, y0, y1) {
  if (x1 === x0) return y0;
  const t = Math.max(0, Math.min(1, (x - x0) / (x1 - x0)));
  return y0 + t * (y1 - y0);
}

/**
 * Berekent de pijnscore van een rit op basis van de metrics uit analyzeLeg.
 *
 * @returns {{score: number, redenen: string[]}}
 */
export function painScore(metrics, thresholds = DEFAULT_THRESHOLDS) {
  let score = 0;
  const redenen = [];
  const rond = (n) => Math.round(n);
  const km = (m) => (m / 1000).toFixed(1).replace(".", ",");

  // Basis: gemiddelde positieve kopwind over de rit, continu vanaf 5 km/u.
  if (metrics.meanPosHead >= 5) {
    score += lerp(metrics.meanPosHead, 5, thresholds.tegenwindZwaar, 0, 55);
    if (metrics.meanPosHead >= thresholds.tegenwindMatig) {
      redenen.push(`gemiddeld ${rond(metrics.meanPosHead)} km/u wind tegen`);
    }
  }

  // Tegenwindstukken: het deel van de route met merkbare of stevige
  // tegenwind telt mee, ook als het ritgemiddelde laag blijft.
  const fracMatig = metrics.fracMatig ?? 0;
  const fracZwaar = metrics.fracZwaar ?? 0;
  if (fracMatig > 0) score += fracMatig * 15;
  if (fracZwaar > 0) score += fracZwaar * 10;
  if ((metrics.zwaarMeters ?? 0) >= 300) {
    redenen.push(`${km(metrics.zwaarMeters)} km stevige tegenwind op de route`);
  } else if ((metrics.matigMeters ?? 0) >= 300) {
    redenen.push(`${km(metrics.matigMeters)} km merkbare tegenwind op de route`);
  }

  // Piek: een kort maar heftig stuk telt extra.
  if (metrics.maxHead >= thresholds.tegenwindZwaar) {
    score += lerp(
      metrics.maxHead,
      thresholds.tegenwindZwaar,
      thresholds.tegenwindZwaar + 15,
      5,
      15
    );
    redenen.push(`piek van ${rond(metrics.maxHead)} km/u tegenwind`);
  }

  // Neerslagkans.
  if (metrics.neerslagKansMax >= thresholds.neerslagKans) {
    score += lerp(metrics.neerslagKansMax, thresholds.neerslagKans, 100, 20, 40);
    redenen.push(`${rond(metrics.neerslagKansMax)}% kans op neerslag`);
  }

  // Hoeveelheid neerslag.
  if (metrics.neerslagMmMax >= thresholds.neerslagMm) {
    score += lerp(metrics.neerslagMmMax, thresholds.neerslagMm, 4, 10, 25);
    redenen.push(
      `tot ${metrics.neerslagMmMax.toFixed(1).replace(".", ",")} mm neerslag per uur`
    );
  }

  // Koud aanvoelen.
  if (metrics.gevoelMin != null && metrics.gevoelMin < thresholds.gevoelMin) {
    score += 10;
    redenen.push(`gevoelstemperatuur ${rond(metrics.gevoelMin)} graden`);
  }

  // Zware windstoten.
  if (metrics.maxGust >= 60) {
    score += 10;
    redenen.push(`windstoten tot ${rond(metrics.maxGust)} km/u`);
  }

  return { score: Math.min(100, Math.round(score)), redenen };
}

/** Vertaalt een pijnscore naar een fietsadvies. */
export function adviesVoorScore(score) {
  if (score >= 60) return "liever niet fietsen";
  if (score >= 30) return "pittige rit";
  return "prima fietsdag";
}

/** Advies voor een enkele rit. */
export function legAdvies(metrics, thresholds = DEFAULT_THRESHOLDS) {
  const { score, redenen } = painScore(metrics, thresholds);
  return { score, redenen, advies: adviesVoorScore(score) };
}

/**
 * Dagadvies: je kiest een keer per dag of de fiets meegaat, dus de zwaarste
 * rit van de keten (heen, terug en eventuele tussenstops) bepaalt het advies.
 *
 * @param {Array<{advies: {score, redenen, advies}, van, naar}>} legs
 */
export function dagAdvies(legs) {
  if (!legs.length) return null;
  let worstIdx = 0;
  for (let i = 1; i < legs.length; i++) {
    if (legs[i].advies.score > legs[worstIdx].advies.score) worstIdx = i;
  }
  const worst = legs[worstIdx];
  const score = worst.advies.score;
  const redenen = worst.advies.redenen;
  const label = `${worst.van?.naam ?? "rit " + (worstIdx + 1)} naar ${worst.naar?.naam ?? ""}`.trim();
  const uitleg = redenen.length
    ? `Zwaarste rit: ${label} (${redenen.join(", ")}).`
    : `Alle ritten zijn goed te doen.`;
  return {
    score,
    advies: adviesVoorScore(score),
    worstIdx,
    uitleg,
  };
}
