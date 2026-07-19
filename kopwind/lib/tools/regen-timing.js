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
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";

const T = kies({
  nl: {
    slug: "wanneer-gaat-het-regenen",
    naam: "Wanneer gaat het regenen vandaag?",
    korteVraag: "Wanneer gaat het regenen vandaag?",
    cta: "Check de regentiming",
    navLabel: "Regentiming",
    diepte: "De eerstvolgende bui, de piek en het eerstvolgende droge blok.",
    dagGeenRegen: "Vandaag geen regen verwacht.",
    dagLaat: (uur) => `Voorlopig droog: eerste bui rond ${uur}:00.`,
    dagSnel: (uur) => `Bui op komst rond ${uur}:00.`,
    dagNuNat: (uur) => `Het regent nu; droog vanaf ongeveer ${uur}:00.`,
    dagNatBlijft: "Het regent nu en dat blijft voorlopig zo.",
    redenDroog: "geen natte uren meer vandaag",
    redenEerste: (uur) => `eerste natte uur rond ${uur}:00`,
  },
  en: {
    slug: "when-will-it-rain",
    naam: "When will it rain today?",
    korteVraag: "When will it rain today?",
    cta: "Check the rain timing",
    navLabel: "Rain timing",
    diepte: "The next shower, the peak and the next dry window.",
    dagGeenRegen: "No rain expected today.",
    dagLaat: (uur) => `Dry for now: first shower around ${uur}:00.`,
    dagSnel: (uur) => `Shower on the way around ${uur}:00.`,
    dagNuNat: (uur) => `It's raining now; dry from around ${uur}:00.`,
    dagNatBlijft: "It's raining now and that will last a while.",
    redenDroog: "no more wet hours today",
    redenEerste: (uur) => `first wet hour around ${uur}:00`,
  },
});

/**
 * Dag-samenvatting-overlay (v3.25.0 "Pampero", besluit Martijn): het
 * dagkarakter voor de statusstip. De toolpagina zelf blijft de
 * 15-minutenreeks gebruiken (RegenTimingTool); dit is de grove
 * uur-versie voor home en alle-keuzehulpen. Score is pijn (0..100):
 * hoe eerder en natter, hoe hoger.
 */
function dagOverlay(hourly, nu = new Date()) {
  const alle = bouwBasis(hourly);
  const perDag = basisPerDag(alle, 0, 24);
  const vandaag = perDag.get(dagKeyVan(nu)) ?? [];
  const uren = vandaag.filter((u) => u.uur >= nu.getHours());
  if (!uren.length) return { dagen: [null] };
  const isNat = (u) => (u.neerslag ?? 0) >= 0.2 || (u.kans ?? 0) >= 60;
  const eersteNat = uren.find(isNat) ?? null;
  let score;
  let zin;
  const redenen = [];
  if (!eersteNat) {
    score = 8;
    zin = T.dagGeenRegen;
    redenen.push(T.redenDroog);
  } else if (eersteNat.uur <= nu.getHours()) {
    const eersteDroog = uren.find((u) => !isNat(u)) ?? null;
    score = 70;
    zin = eersteDroog ? T.dagNuNat(eersteDroog.uur) : T.dagNatBlijft;
    redenen.push(T.redenEerste(eersteNat.uur));
  } else if (eersteNat.uur - nu.getHours() >= 4) {
    score = 25;
    zin = T.dagLaat(eersteNat.uur);
    redenen.push(T.redenEerste(eersteNat.uur));
  } else {
    score = 50;
    zin = T.dagSnel(eersteNat.uur);
    redenen.push(T.redenEerste(eersteNat.uur));
  }
  return { dagen: [{ conditie: { score, redenen }, status: { soort: "info", zin } }] };
}

export const regenTiming = {
  id: "regen-timing",
  slug: T.slug,
  naam: T.naam,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#3C7DC4",
  icoon: "klok",
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
  weerVelden: BASIS_VELDEN,
  overlay: dagOverlay,
  bijgewerkt: "2026-07-13",
  affiliate: null,
};
