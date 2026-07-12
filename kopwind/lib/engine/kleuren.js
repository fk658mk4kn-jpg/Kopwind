/**
 * lib/engine/kleuren.js
 *
 * Kleurbeleid van de hub (v2.1.0 "Mistral"), colorblind-veilig en gekozen
 * naar de datastructuur:
 *
 * - WIND is divergerend (rugwind, neutraal, tegenwind): blauw naar
 *   gebroken wit naar oranje. Blauw-oranje is het veilige divergerende
 *   paar; rood-groen is juist het slechtste voor rood-groen-kleurenblindheid.
 * - GOEDHEID (droogkracht, cijfer) is sequentieel: een perceptueel
 *   uniforme ramp op basis van cividis (donkerblauw naar geel), expliciet
 *   ontworpen voor kleurenblinden. Licht = goed, donker = slecht.
 *
 * Betekenis hangt nooit alleen aan kleur (WCAG 1.4.1): overal staat een
 * woordlabel en/of getal naast, en elke tool toont een legenda die de
 * betekenis van de ramp benoemt.
 */

import { clamp } from "./score.js";

function hex(kleur) {
  return [
    parseInt(kleur.slice(1, 3), 16),
    parseInt(kleur.slice(3, 5), 16),
    parseInt(kleur.slice(5, 7), 16),
  ];
}

function meng(stops, t) {
  const x = clamp(t, 0, 1) * (stops.length - 1);
  const i = Math.min(Math.floor(x), stops.length - 2);
  const f = x - i;
  const a = hex(stops[i]);
  const b = hex(stops[i + 1]);
  const c = a.map((v, k) => Math.round(v + (b[k] - v) * f));
  return `rgb(${c[0]} ${c[1]} ${c[2]})`;
}

// Divergerend blauw <-> oranje (ColorBrewer RdYlBu-familie zonder rood-groen).
const DIVERGEREND = ["#1D6FB8", "#7FB2DC", "#F2F0EA", "#F0A860", "#C25E00"];

// Sequentieel op cividis-stops: donker (slecht) naar licht geel (goed).
const SEQUENTIEEL = ["#00204D", "#31446B", "#666970", "#A69D75", "#E5CE55", "#FFEA46"];

/** Wind: x van -1 (rugwind, blauw) via 0 (neutraal) naar 1 (tegenwind, oranje). */
export function kleurDivergerend(x) {
  return meng(DIVERGEREND, (clamp(x, -1, 1) + 1) / 2);
}

/** Goedheid 0..1: 0 = slecht (donker), 1 = goed (licht geel). */
export function kleurSequentieel(goedheid) {
  return meng(SEQUENTIEEL, clamp(goedheid, 0, 1));
}

/** CSS-gradient van een ramp, voor legenda's. */
export function rampGradient(soort) {
  const stops = soort === "wind" ? DIVERGEREND : SEQUENTIEEL;
  return `linear-gradient(90deg, ${stops.join(", ")})`;
}
