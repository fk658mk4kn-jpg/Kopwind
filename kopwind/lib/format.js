/**
 * lib/format.js
 *
 * Kleine presentatiehulpjes, los van de rekenkern.
 */

const BFT_GRENZEN = [1, 5, 11, 19, 28, 38, 49, 61, 74, 88, 102, 117];

/** Windsnelheid in km/u naar Beaufort. */
export function bft(kmh) {
  let b = 0;
  for (const grens of BFT_GRENZEN) {
    if (kmh >= grens) b++;
    else break;
  }
  return b;
}

const KOMPAS = [
  "N", "NNO", "NO", "ONO", "O", "OZO", "ZO", "ZZO",
  "Z", "ZZW", "ZW", "WZW", "W", "WNW", "NW", "NNW",
];

/** Meteorologische windrichting in graden naar kompasrichting. */
export function kompas(deg) {
  if (deg == null) return "?";
  const i = Math.round((((deg % 360) + 360) % 360) / 22.5) % 16;
  return KOMPAS[i];
}

/** Meters naar km met komma, bv. 3,4 km. */
export function fmtKm(meters) {
  const km = meters / 1000;
  const s = km >= 10 ? km.toFixed(0) : km.toFixed(1).replace(/\.0$/, "");
  return `${s.replace(".", ",")} km`;
}

/** Seconden naar "18 min" of "1 u 05". */
export function fmtDuur(seconden) {
  const min = Math.round(seconden / 60);
  if (min < 60) return `${min} min`;
  const u = Math.floor(min / 60);
  const rest = min % 60;
  return `${u} u ${String(rest).padStart(2, "0")}`;
}

/** Date naar "07:15". */
export function fmtTijd(date) {
  const p = (n) => String(n).padStart(2, "0");
  return `${p(date.getHours())}:${p(date.getMinutes())}`;
}

/** Date naar waarde voor <input type="datetime-local">. */
export function toLocalInput(date) {
  const p = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}T${p(date.getHours())}:${p(date.getMinutes())}`;
}

/** Rondt omhoog af op het eerstvolgende kwartier. */
export function afrondOpKwartier(date) {
  const d = new Date(date.getTime());
  d.setSeconds(0, 0);
  const rest = d.getMinutes() % 15;
  if (rest !== 0) d.setMinutes(d.getMinutes() + (15 - rest));
  return d;
}
