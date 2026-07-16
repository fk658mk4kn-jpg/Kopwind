/**
 * lib/tools/regen-timing.js
 *
 * "Wanneer gaat het regenen vandaag?" (v3.6.0 "Bora"). De timing-check
 * uit het regen-cluster: draait op de 15-minuten neerslagreeks
 * (minutely_15) in plaats van uurdata, want de vraag is nowcast-achtig.
 * Eigen client-component (RegenTimingTool) omdat de UI anders is dan de
 * standaard 5-daagse dagkiezer: hier draait het om de eerstvolgende bui,
 * de piek en het eerstvolgende droge blok.
 *
 * Geen scoreConfig/overlay in de klassieke zin: de analyse zit in
 * lib/engine/minutely.js. Wel de registervelden zodat sitemap, menu en
 * categorie de tool kennen.
 */

import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "wanneer-gaat-het-regenen",
    naam: "Wanneer gaat het regenen vandaag?",
    korteVraag: "Wanneer gaat het regenen vandaag?",
    cta: "Bekijk de regentiming",
    navLabel: "Regentiming",
    diepte: "De eerstvolgende bui, de piek en het eerstvolgende droge blok.",
  },
  en: {
    slug: "when-will-it-rain",
    naam: "When will it rain today?",
    korteVraag: "When will it rain today?",
    cta: "See the rain timing",
    navLabel: "Rain timing",
    diepte: "The next shower, the peak and the next dry window.",
  },
});

export const regenTiming = {
  id: "regen-timing",
  slug: T.slug,
  naam: T.naam,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#3C7DC4",
  icoon: "druppel",
  categorieId: "regen",
  soort: "info",
  diepte: T.diepte,
  patroon: "A",
  inputType: "locatie",
  databron: "minutely",
  // Deze tool gebruikt een eigen client-component; de gedeelde
  // schaalLabels en adviesLabels zijn nodig voor registervalidatie.
  schaalLabels: { ideaal: "Lang droog", goed: "Voorlopig droog", twijfelachtig: "Bui op komst", matig: "Snel regen", "zeer-slecht": "Regen nu" },
  adviesLabels: { goed: "droog", matig: "bui op komst", slecht: "regen" },
  eigenComponent: "RegenTimingTool",
  bijgewerkt: "2026-07-13",
  affiliate: null,
};
