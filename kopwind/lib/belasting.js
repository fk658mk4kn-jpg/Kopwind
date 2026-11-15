/**
 * lib/belasting.js
 *
 * Fase van het aangifteseizoen inkomstenbelasting (v3.38.0): voor 1 mei
 * loopt de aangifte over vorig jaar, van 1 mei tot 1 september het
 * uitstel, daarna telt de pagina af naar de volgende 1 mei.
 */

import { ymd, vergelijk } from "./aftellen/datums.js";

export function aangifteFase(nu) {
  const mei = ymd(nu.j, 5, 1);
  const sept = ymd(nu.j, 9, 1);
  if (vergelijk(nu, mei) < 0) return { soort: "aangifte", doel: mei, belastingjaar: nu.j - 1 };
  if (vergelijk(nu, sept) < 0) return { soort: "uitstel", doel: sept, belastingjaar: nu.j - 1 };
  return { soort: "volgend", doel: ymd(nu.j + 1, 5, 1), belastingjaar: nu.j };
}

/**
 * Wanneer je de uitslag van je aangifte inkomstenbelasting kunt
 * verwachten (v3.40.0). Belastingdienst: aangifte voor 1 april geeft
 * bericht voor 1 juli; daarna streeft zij naar bericht binnen drie
 * maanden na de aangifte.
 */
export function teruggaveFase(nu) {
  const maart = ymd(nu.j, 3, 1);
  const april = ymd(nu.j, 4, 1);
  const juli = ymd(nu.j, 7, 1);
  if (vergelijk(nu, maart) < 0) return { soort: "voor-seizoen", start: maart, april, juli, belastingjaar: nu.j - 1 };
  if (vergelijk(nu, april) < 0) return { soort: "voor-april", start: maart, april, juli, belastingjaar: nu.j - 1 };
  if (vergelijk(nu, juli) < 0) return { soort: "na-april", start: maart, april, juli, belastingjaar: nu.j - 1 };
  return { soort: "na-juli", start: ymd(nu.j + 1, 3, 1), april: ymd(nu.j + 1, 4, 1), juli: ymd(nu.j + 1, 7, 1), belastingjaar: nu.j };
}
