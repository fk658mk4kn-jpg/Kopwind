/**
 * lib/engine/drogen.js
 *
 * De droogsnelheid-helper (Zephyr item 1): hoe snel droogt textiel buiten
 * bij dit weer. Warm plus wind plus droge lucht plus zon = sneller droog.
 * Wordt gedeeld door de wascheck (en straks alles wat droogtijd nodig
 * heeft, zoals autowassen).
 */

import { clamp } from "./score.js";

/** Som van droogkracht die een gemiddelde was nodig heeft om droog te zijn. */
export const DROOG_BUDGET = 260;

/**
 * Droogsnelheid van een enkel basis-uur, 0..100. Nul bij neerslag of een
 * buienkans boven de grens; anders het product van luchtvochtigheid (de
 * motor), temperatuur (traag onder de 5 graden), wind (bonus) en een
 * zonbonus bij een heldere daglicht-hemel.
 */
export function droogsnelheid(u, buiKans = 55) {
  if ((u.neerslag ?? 0) > 0.1 || (u.kans ?? 0) >= buiKans) return 0;
  const vocht = clamp((92 - (u.rh ?? 85)) / (92 - 45), 0, 1);
  const tempF = clamp(((u.temp ?? 10) + 2) / 20, 0.25, 1.2);
  const windF = 0.7 + clamp((u.wind ?? 0) / 25, 0, 1) * 0.6;
  const zonF = u.dag && u.bewolking != null && u.bewolking <= 40 ? 1.1 : 1;
  return clamp(Math.round(100 * vocht * tempF * windF * zonF), 0, 100);
}

/**
 * Geschatte droogtijd in uren bij een gemiddelde droogsnelheid. Kan langer
 * zijn dan de dag: dat oordeel (past het nog?) ligt bij de status, niet
 * bij deze schatting.
 */
export function geschatteDroogtijd(gemiddeldeKracht) {
  if (!gemiddeldeKracht || gemiddeldeKracht <= 0) return null;
  return clamp(DROOG_BUDGET / Math.max(gemiddeldeKracht, 12), 1.5, 24);
}

/** Weergave: 3.4142 -> "3,4", 3.0 -> "3". */
export function fmtUren(uren) {
  if (uren == null) return "";
  return uren.toFixed(1).replace(".", ",").replace(/,0$/, "");
}
