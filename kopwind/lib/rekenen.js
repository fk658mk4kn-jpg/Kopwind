/**
 * lib/rekenen.js
 *
 * Pure rekenkernen voor v3.40.0 "Sirocco": procenten, btw, Romeinse
 * cijfers en vakantiedagen. Geen afhankelijkheden, alles getest in
 * tests/v340.test.js.
 */

import { plusDagen, weekdag, vrijeDagen, sleutel, ymd } from "./aftellen/datums.js";

const r2 = (n) => Math.round(n * 100) / 100;

/* ------------------------------ procenten ------------------------------ */

/** x procent van y. */
export const procentVan = (x, y) => (x / 100) * y;
/** Hoeveel procent is a van b. */
export const welkProcent = (a, b) => (b === 0 ? null : (a / b) * 100);
/** Procentuele verandering van oud naar nieuw. */
export const procentVerandering = (oud, nieuw) => (oud === 0 ? null : ((nieuw - oud) / oud) * 100);
/** Bedrag na een stijging (positief) of korting (negatief) in procenten. */
export const naProcent = (bedrag, pct) => bedrag * (1 + pct / 100);

/* --------------------------------- btw --------------------------------- */

export const BTW_TARIEVEN = [
  { pct: 21, naam: "Algemeen tarief", voorbeelden: "De meeste producten en diensten, en sinds 1 januari 2026 ook hotelovernachtingen en vakantieverblijven" },
  { pct: 9, naam: "Verlaagd tarief", voorbeelden: "Eten en drinken (zonder alcohol), boeken, medicijnen, kapper, fietsreparatie, sport en cultuur" },
  { pct: 0, naam: "Nultarief", voorbeelden: "Export buiten de EU en levering aan bedrijven in andere EU-landen" },
];

/** Van een bedrag zonder btw naar het bedrag met btw. */
export function btwErbij(excl, pct) {
  const btw = excl * (pct / 100);
  return { excl: r2(excl), btw: r2(btw), incl: r2(excl + btw) };
}

/** Van een bedrag inclusief btw terug naar het bedrag zonder btw. */
export function btwEraf(incl, pct) {
  const excl = incl / (1 + pct / 100);
  return { excl: r2(excl), btw: r2(incl - excl), incl: r2(incl) };
}

/* --------------------------- Romeinse cijfers --------------------------- */

const ROMEINS = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"],
  [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

/** 1 tot en met 3999 naar Romeinse cijfers, anders null. */
export function naarRomeins(n) {
  if (!Number.isInteger(n) || n < 1 || n > 3999) return null;
  let uit = "";
  for (const [w, t] of ROMEINS) while (n >= w) { uit += t; n -= w; }
  return uit;
}

/** Romeinse cijfers naar een getal; null als de schrijfwijze niet klopt. */
export function vanRomeins(s) {
  const t = String(s).trim().toUpperCase();
  if (!/^[MDCLXVI]+$/.test(t)) return null;
  const w = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
  let som = 0;
  for (let i = 0; i < t.length; i++) {
    const a = w[t[i]];
    const b = w[t[i + 1]] ?? 0;
    som += a < b ? -a : a;
  }
  return naarRomeins(som) === t ? som : null;
}

/* ----------------------------- vakantiedagen ---------------------------- */

/**
 * Wettelijke vakantie-uren: vier keer het aantal uren per week, per heel
 * jaar. Bij een deel van het jaar naar rato van de maanden.
 */
export function wettelijkeVakantie(urenPerWeek, dagenPerWeek = 5, maanden = 12) {
  const uren = 4 * urenPerWeek * (Math.min(12, Math.max(0, maanden)) / 12);
  const urenPerDag = dagenPerWeek > 0 ? urenPerWeek / dagenPerWeek : 0;
  return { uren: r2(uren), dagen: urenPerDag ? r2(uren / urenPerDag) : 0 };
}

/* ---------------------------- datum rekenen ---------------------------- */


/** Dezelfde dag n maanden later (of eerder); bestaat die niet, de laatste dag. */
export function plusMaandenDatum({ j, m, d }, n) {
  const t = (j * 12 + (m - 1)) + n;
  const nj = Math.floor(t / 12);
  const nm = (t % 12 + 12) % 12 + 1;
  const laatste = new Date(Date.UTC(nj, nm, 0)).getUTCDate();
  return ymd(nj, nm, Math.min(d, laatste));
}

/** n werkdagen verder (of terug), zonder weekend en officiele vrije dagen. */
export function plusWerkdagen(datum, n) {
  const stap = n < 0 ? -1 : 1;
  let rest = Math.abs(n);
  let d = datum;
  const cache = new Map();
  while (rest > 0) {
    d = plusDagen(d, stap);
    const wd = weekdag(d);
    if (wd === 0 || wd === 6) continue;
    if (!cache.has(d.j)) cache.set(d.j, vrijeDagen(d.j));
    if (cache.get(d.j).has(sleutel(d))) continue;
    rest--;
  }
  return d;
}
