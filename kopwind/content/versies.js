/** Selector: changelog-zinnen in de taal van deze deployment. */
import { LOCALE } from "../lib/i18n/locale.js";
import { VERSIES as nl } from "./versies.nl.js";
import { VERSIES as en } from "./versies.en.js";

export const VERSIES = LOCALE === "en" ? en : nl;
