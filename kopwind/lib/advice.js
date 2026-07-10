/**
 * lib/advice.js
 *
 * Pijnscore (0 tot 100) per etappe en het dagadvies. Puur en testbaar.
 * De drempels zijn configureerbaar via de instellingen in de app.
 */

export const DEFAULT_THRESHOLDS = {
  tegenwindMatig: 12, // km/u kopwind waarboven het merkbaar wordt
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
 * Berekent de pijnscore van een etappe op basis van de metrics uit
 * analyzeLeg. Hoger is vervelender om te fietsen.
 *
 * @returns {{score: number, redenen: string[]}}
 */
export function painScore(metrics, thresholds = DEFAULT_THRESHOLDS) {
  let score = 0;
  const redenen = [];
  const rond = (n) => Math.round(n);

  // Gemiddelde positieve kopwind: de basisvermoeidheid.
  if (metrics.meanPosHead >= thresholds.tegenwindMatig) {
    const punten = lerp(
      metrics.meanPosHead,
      thresholds.tegenwindMatig,
      thresholds.tegenwindZwaar,
      20,
      55
    );
    score += punten;
    redenen.push(
      `gemiddeld ${rond(metrics.meanPosHead)} km/u tegenwind op de tegenwindstukken`
    );
  }

  // Piek: een kort maar heftig stuk telt extra.
  if (metrics.maxHead >= thresholds.tegenwindZwaar) {
    const punten = lerp(
      metrics.maxHead,
      thresholds.tegenwindZwaar,
      thresholds.tegenwindZwaar + 15,
      5,
      15
    );
    score += punten;
    redenen.push(`piek van ${rond(metrics.maxHead)} km/u tegenwind`);
  }

  // Neerslagkans.
  if (metrics.neerslagKansMax >= thresholds.neerslagKans) {
    const punten = lerp(metrics.neerslagKansMax, thresholds.neerslagKans, 100, 20, 40);
    score += punten;
    redenen.push(`${rond(metrics.neerslagKansMax)}% kans op neerslag`);
  }

  // Hoeveelheid neerslag.
  if (metrics.neerslagMmMax >= thresholds.neerslagMm) {
    const punten = lerp(metrics.neerslagMmMax, thresholds.neerslagMm, 4, 10, 25);
    score += punten;
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

/** Vertaalt een pijnscore naar een advies. */
export function adviesVoorScore(score) {
  if (score >= 60) return "pak de scooter";
  if (score >= 30) return "fiets met tegenzin";
  return "fiets prima";
}

/** Advies voor een enkele etappe. */
export function legAdvies(metrics, thresholds = DEFAULT_THRESHOLDS) {
  const { score, redenen } = painScore(metrics, thresholds);
  return { score, redenen, advies: adviesVoorScore(score) };
}

/**
 * Dagadvies: je kiest een keer per dag tussen fiets en scooter, dus de
 * zwaarste etappe van de keten bepaalt het advies.
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
  const label = `${worst.van?.naam ?? "etappe " + (worstIdx + 1)} naar ${worst.naar?.naam ?? ""}`.trim();
  const uitleg = redenen.length
    ? `Zwaarste etappe: ${label} (${redenen.join(", ")}).`
    : `Alle etappes zijn goed te doen.`;
  return {
    score,
    advies: adviesVoorScore(score),
    worstIdx,
    uitleg,
  };
}
