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
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";

const T = kies({
  nl: {
    slug: "paraplu-mee",
    naam: "Moet ik vandaag een paraplu mee?",
    korteVraag: "Moet ik vandaag een paraplu mee?",
    cta: "Check de paraplu",
    navLabel: "Paraplu mee",
    diepte: "Wel of geen paraplu, op basis van regen, timing en jouw buitentijd.",
    dagDroog: "Droog vandaag: de paraplu kan thuisblijven.",
    dagEenBui: (uur) => `Rond ${uur}:00 valt een bui: voor de zekerheid mee.`,
    dagPaarBuien: (n) => `Vandaag ${n} natte uren: neem hem mee.`,
    dagNat: "Natte dag: zeker meenemen.",
    redenDroog: "geen regen in de resterende uren",
    redenNat: (n) => `${n} natte uren verwacht`,
  },
  en: {
    slug: "umbrella-today",
    naam: "Do I need an umbrella today?",
    korteVraag: "Do I need an umbrella today?",
    cta: "Check the umbrella",
    navLabel: "Umbrella",
    diepte: "Umbrella or not, based on rain, timing and your time outside.",
    dagDroog: "Dry today: the umbrella can stay home.",
    dagEenBui: (uur) => `A shower falls around ${uur}:00: take it to be safe.`,
    dagPaarBuien: (n) => `${n} wet hours today: take it along.`,
    dagNat: "A wet day: definitely take it.",
    redenDroog: "no rain in the remaining hours",
    redenNat: (n) => `${n} wet hours expected`,
  },
});

/**
 * Dag-samenvatting-overlay (v3.25.0 "Pampero", besluit de eigenaar): de
 * eigen toolpagina blijft op de 15-minutenreeks draaien (ParapluTool),
 * maar voor de statusstip op home en alle-keuzehulpen vat deze overlay
 * de resterende uren samen tot een dagantwoord. Natte uren = neerslag
 * vanaf 0,2 mm of een kans van 60 procent of hoger, binnen 8:00-22:00.
 * Score is pijn (0..100, laag is goed), zoals overal.
 */
function dagOverlay(hourly, nu = new Date()) {
  const alle = bouwBasis(hourly);
  const perDag = basisPerDag(alle, 8, 23);
  const vandaag = perDag.get(dagKeyVan(nu)) ?? [];
  const uren = vandaag.filter((u) => u.uur >= nu.getHours());
  if (!uren.length) return { dagen: [null] };
  const nat = uren.filter((u) => (u.neerslag ?? 0) >= 0.2 || (u.kans ?? 0) >= 60);
  let score;
  let zin;
  const redenen = [];
  if (nat.length === 0) {
    score = 8;
    zin = T.dagDroog;
    redenen.push(T.redenDroog);
  } else if (nat.length === 1) {
    score = 38;
    zin = T.dagEenBui(nat[0].uur);
    redenen.push(T.redenNat(1));
  } else if (nat.length <= 3) {
    score = 55;
    zin = T.dagPaarBuien(nat.length);
    redenen.push(T.redenNat(nat.length));
  } else {
    score = 70;
    zin = T.dagNat;
    redenen.push(T.redenNat(nat.length));
  }
  return { dagen: [{ conditie: { score, redenen }, status: { soort: "info", zin } }] };
}

export const paraplu = {
  id: "paraplu",
  slug: T.slug,
  naam: T.naam,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#3C7DC4",
  icoon: "paraplu",
  categorieId: "regen",
  soort: "advies",
  diepte: T.diepte,
  patroon: "A",
  inputType: "locatie",
  databron: "minutely",
  schaalLabels: { ideaal: "Laat maar thuis", goed: "Waarschijnlijk niet nodig", twijfelachtig: "Voor de zekerheid mee", matig: "Neem hem mee", "zeer-slecht": "Zeker meenemen" },
  adviesLabels: { goed: "thuislaten kan", matig: "twijfelgeval", slecht: "meenemen" },
  eigenComponent: "ParapluTool",
  // Dag-samenvatting voor de statusstip (v3.25.0); de toolpagina zelf
  // blijft op de 15-minutenreeks draaien via ParapluTool.
  weerVelden: BASIS_VELDEN,
  overlay: dagOverlay,
  bijgewerkt: "2026-07-14",
  affiliate: null,
};
