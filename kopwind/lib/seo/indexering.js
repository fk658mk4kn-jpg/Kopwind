/**
 * lib/seo/indexering.js
 *
 * Schakelaar voor het terugsnoeien van de stadpagina's (v3.36.0, uit
 * SEO-DIAGNOSE.md). Ruim tweeduizend stadpagina's delen 91 procent van
 * hun tekst; op een jong domein laat Google zulke pagina's liggen en dat
 * drukt het oordeel over de hele site.
 *
 * AAN ZETTEN: in Vercel onder Settings > Environment Variables de
 * variabele STAD_INDEX_BEPERKT=1 toevoegen en opnieuw deployen. UIT:
 * de variabele weghalen. Standaard staat hij uit en verandert er niets.
 *
 * Met de schakelaar aan:
 *  - blijven alleen INDEX_STEDEN maal INDEX_CHECKS indexeerbaar;
 *  - krijgen de andere stadpagina's en alle van-naar-routes noindex
 *    (follow blijft aan, zodat de links erop wel meetellen);
 *  - verdwijnen die pagina's uit de sitemap.
 * De pagina's zelf blijven gewoon bestaan en werken voor bezoekers.
 */

export function stadIndexBeperkt(env = process.env) {
  return env.STAD_INDEX_BEPERKT === "1";
}

/** De tien grootste steden uit lib/steden/nl.js. */
export const INDEX_STEDEN = [
  "amsterdam", "rotterdam", "den-haag", "utrecht", "eindhoven",
  "groningen", "tilburg", "almere", "breda", "nijmegen",
];

/** De tien checks met de meeste zoekvraag op stadniveau. */
export const INDEX_CHECKS = [
  "terras", "was-buiten-drogen", "fiets-naar-werk", "hardloopweer", "strandweer",
  "regen-timing", "paraplu", "wat-trek-ik-aan", "barbecue", "zonkracht",
];

export function stadIndexeerbaar(toolId, stadSlug, beperkt = stadIndexBeperkt()) {
  if (!beperkt) return true;
  return INDEX_CHECKS.includes(toolId) && INDEX_STEDEN.includes(stadSlug);
}

export function routeIndexeerbaar(beperkt = stadIndexBeperkt()) {
  return !beperkt;
}

export const NOINDEX = { index: false, follow: true };
