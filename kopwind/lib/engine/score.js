/**
 * lib/engine/score.js
 *
 * Generieke scorekern voor alle tools. Een tool levert gewogen factoren
 * (punten plus een reden in mensentaal); de engine telt op tot een continue
 * pijnscore (0 tot 100, hoger is slechter) en vertaalt die naar een
 * rapportcijfer en een tekstlabel. De harde regel uit v1: cijfer en
 * toelichting vertellen altijd hetzelfde verhaal, want de redenen komen uit
 * dezelfde factoren als de punten.
 */

export function lerp(x, x0, x1, y0, y1) {
  if (x1 === x0) return y0;
  const t = Math.max(0, Math.min(1, (x - x0) / (x1 - x0)));
  return y0 + t * (y1 - y0);
}

export function clamp(x, lo, hi) {
  return Math.max(lo, Math.min(hi, x));
}

/**
 * Telt factoren op tot een pijnscore.
 * @param {Array<{punten: number, reden?: string|null}>} factoren
 * @returns {{score: number, redenen: string[]}}
 */
export function maakScore(factoren) {
  let score = 0;
  const redenen = [];
  for (const f of factoren ?? []) {
    if (!f || !Number.isFinite(f.punten) || f.punten <= 0) continue;
    score += f.punten;
    if (f.reden) redenen.push(f.reden);
  }
  return { score: Math.min(100, Math.round(score)), redenen };
}

/** Pijnscore naar rapportcijfer als getal (10 = perfect, ondergrens 1). */
export function cijferWaarde(score) {
  return clamp((100 - score) / 10, 1, 10);
}

/**
 * Vertaalt een pijnscore naar het tekstlabel van een tool.
 * @param {number} score pijnscore 0-100
 * @param {{goed: string, matig: string, slecht: string}} labels
 */
export function adviesVoorScore(score, labels) {
  if (score >= 60) return labels.slecht;
  if (score >= 30) return labels.matig;
  return labels.goed;
}

/**
 * Kleurschaal die de hele hub deelt (de signature-ramp van de windstrip):
 * x van -1 (goed, diep groen) via 0 (amber) naar 1 (slecht, diep rood).
 */
export function kleurSchaal(x) {
  const k = clamp(x, -1, 1);
  const hue = k <= 0 ? 45 + -k * 105 : 45 - k * 43;
  const licht = 44 - Math.abs(k) * 8;
  return `hsl(${Math.round(hue)} 88% ${Math.round(licht)}%)`;
}

/** Gemak: goedheid 0..1 (1 = perfect) naar dezelfde kleurschaal. */
export function kleurVoorGoedheid(goedheid) {
  return kleurSchaal(1 - 2 * clamp(goedheid, 0, 1));
}
