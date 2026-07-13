/**
 * lib/brand.js
 *
 * Merkgegevens per taal. NL: "Kan het vandaag?". EN: "Good day for it?",
 * de idiomatische paraplu boven vragen als "Can I bike to work today?".
 * Andere EN-naam gewenst? Dit is de enige plek die je aanpast.
 */
import { kies } from "./i18n/locale.js";

export const HUB_NAAM = kies({ nl: "Kan het vandaag?", en: "Good day for it?" });
export const HUB_KORT = kies({ nl: "Kan het?", en: "Good day?" });
export const HUB_CLAIM = kies({
  nl: "Kan ik vandaag fietsen, de was buiten hangen of het terras op? Live antwoord voor jouw stad, met het beste moment erbij.",
  en: "Can I bike to work, dry laundry outside or fire up the barbecue today? A live answer for your city, with the best time window included.",
});

/** Korte app-naam voor pushmeldingen ("Kan het? · Fietscheck"). */
export const APP_KORT = HUB_KORT;

/**
 * Demo-windstrip voor de OG-afbeelding: een herkenbaar dagverloop
 * (rustig, aantrekkend, stevig, afzwakkend) als merkvormtaal.
 */
export const WINDSTRIP_DEMO = [0.15, 0.2, 0.3, 0.45, 0.65, 0.8, 0.7, 0.5, 0.35, 0.25, 0.2, 0.15];
