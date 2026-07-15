/**
 * lib/tools/paraplu.js
 *
 * "Moet ik vandaag een paraplu meenemen?" (v3.6.0 "Bora"). De actie-
 * check uit het regen-cluster: geen voorspelling maar een beslissing.
 * Draait op de 15-minuten reeks (minutely) plus een instelbare
 * buitentijd (wanneer ben je op pad). Eigen client-component
 * (ParapluTool) die de analyse van lib/engine/minutely.js vertaalt naar
 * een simpel ja/nee met reden.
 */

import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "paraplu-mee",
    naam: "Moet ik vandaag een paraplu meenemen?",
    korteVraag: "Moet ik vandaag een paraplu mee?",
    cta: "Check de paraplu",
    navLabel: "Paraplu mee",
    diepte: "Wel of geen paraplu, op basis van regen, timing en jouw buitentijd.",
  },
  en: {
    slug: "umbrella-today",
    naam: "Do I need an umbrella today?",
    korteVraag: "Umbrella today?",
    cta: "Check the umbrella",
    navLabel: "Umbrella",
    diepte: "Umbrella or not, based on rain, timing and your time outside.",
  },
});

export const paraplu = {
  id: "paraplu",
  slug: T.slug,
  naam: T.naam,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#3C7DC4",
  icoon: "druppel",
  groep: "Elke dag",
  categorieId: "regen",
  soort: "advies",
  diepte: T.diepte,
  patroon: "A",
  inputType: "locatie",
  databron: "minutely",
  schaalLabels: { ideaal: "Laat maar thuis", goed: "Waarschijnlijk niet nodig", twijfelachtig: "Voor de zekerheid mee", matig: "Neem hem mee", "zeer-slecht": "Zeker meenemen" },
  adviesLabels: { goed: "thuislaten kan", matig: "twijfelgeval", slecht: "meenemen" },
  eigenComponent: "ParapluTool",
  bijgewerkt: "2026-07-14",
  affiliate: null,
};
