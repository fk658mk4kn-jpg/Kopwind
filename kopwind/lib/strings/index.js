/** Kiest de strings-tabel van deze deployment. */
import { LOCALE } from "../i18n/locale.js";
import { S as nl } from "./nl.js";
import { S as en } from "./en.js";

export const S = LOCALE === "en" ? en : nl;
