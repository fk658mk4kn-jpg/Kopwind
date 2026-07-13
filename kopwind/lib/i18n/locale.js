/**
 * lib/i18n/locale.js
 *
 * De taal van deze deployment. Een build is volledig eentalig: het
 * NL-project draait zonder env (of met nl), het EN-project zet
 * NEXT_PUBLIC_SITE_LOCALE=en in Vercel. Modules lezen LOCALE bij import,
 * dus de statische build bakt de juiste taal in zonder runtime-switches.
 */
export const LOCALE = process.env.NEXT_PUBLIC_SITE_LOCALE === "en" ? "en" : "nl";
export const IS_EN = LOCALE === "en";

/** Kies per taal: kies({ nl: x, en: y }). */
export function kies(per) {
  return per[LOCALE];
}
