/** Selector: uitleg-artikelen in de taal van deze deployment. */
import { LOCALE } from "../lib/i18n/locale.js";
import { UITLEG as nl, vindArtikel as vindNl } from "./uitleg.nl.js";
import { UITLEG as en, vindArtikel as vindEn } from "./uitleg.en.js";

export const UITLEG = LOCALE === "en" ? en : nl;
export const vindArtikel = LOCALE === "en" ? vindEn : vindNl;
