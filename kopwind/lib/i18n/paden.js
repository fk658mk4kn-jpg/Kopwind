/**
 * lib/i18n/paden.js
 *
 * Interne paden per taal. De fysieke mappen blijven Nederlands
 * (app/uitleg, app/over, ...); op de Engelse site zorgen rewrites in
 * next.config dat de Engelse paden op dezelfde pagina's uitkomen. Links
 * en canonicals horen altijd via PAD te lopen.
 */
import { kies } from "./locale.js";

export const PAD = kies({
  nl: {
    uitleg: "/uitleg",
    alleChecks: "/alle-checks",
    over: "/over",
    bronnen: "/bronnen",
    privacy: "/privacy",
    voorwaarden: "/voorwaarden",
    changelog: "/changelog",
  },
  en: {
    uitleg: "/explainers",
    alleChecks: "/all-checks",
    over: "/about",
    bronnen: "/sources",
    privacy: "/privacy",
    voorwaarden: "/terms",
    changelog: "/changelog",
  },
});
