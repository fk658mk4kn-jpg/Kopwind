/** Selector: hubteksten in de taal van deze deployment. */
import { LOCALE } from "../lib/i18n/locale.js";
import { hub as nl } from "./hub.nl.js";
import { hub as en } from "./hub.en.js";

export const hub = LOCALE === "en" ? en : nl;
