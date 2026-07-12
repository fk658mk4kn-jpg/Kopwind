/**
 * lib/engine/eenheden.js
 *
 * Eenheden-naad voor internationalisering (§14): intern rekenen we in
 * SI/metrisch; presentatie loopt via deze laag. NL is nu de enige locale;
 * een VS-locale voegt hier later °F, mijl en mph toe zonder dat de engine
 * of de tools veranderen.
 */

import { fmtKm, fmtDuur, fmtTijd, bft, kompas, fmtCijfer } from "../format.js";

export const LOCALE = "nl";

export const eenheden = {
  afstand: (meters) => fmtKm(meters),
  duur: (sec) => fmtDuur(sec),
  tijd: (date) => fmtTijd(date),
  temperatuur: (c) => `${Math.round(c)}\u00b0`,
  windKracht: (kmh) => `${bft(kmh)} Bft`,
  windRichting: (deg) => kompas(deg),
  cijfer: (score) => fmtCijfer(score),
};
