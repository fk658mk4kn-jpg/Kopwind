/**
 * lib/geld.js
 *
 * Geld en werk (v3.39.0 "Harmattan"). Alle bedragen en data komen uit
 * officiele bronnen; zie
 * LOGBOEK Run 19. Bijwerken zodra er nieuwe data zijn; de tests
 * waarschuwen als een tabel opraakt.
 */

import { ymd, plusDagen, weekdag, vergelijk, dagenTussen, uitSleutel, vrijeDagen, sleutel } from "./aftellen/datums.js";

/* ------------------------------------------------------------------ */
/* Toeslagen (Belastingdienst, pagina Betaaldatums toeslagen)          */
/* ------------------------------------------------------------------ */

/** Gepubliceerde betaaldata; `voor` is de maand waarvoor de toeslag is. */
export const TOESLAG_DATA = [
  { datum: "2026-11-20", voor: "december 2026" },
  { datum: "2026-12-21", voor: "januari 2027" },
];

export function volgendeToeslag(vandaagDag) {
  const s = sleutel(vandaagDag);
  return TOESLAG_DATA.find((t) => t.datum >= s) ?? null;
}

/* ------------------------------------------------------------------ */
/* Minimumloon (Rijksoverheid, bedragen minimumloon 2027)              */
/* ------------------------------------------------------------------ */

export const MINIMUMLOON = {
  geldigVanaf: "2027-01-01",
  perUur: [
    { leeftijd: "21 jaar en ouder", bedrag: 15.29 },
    { leeftijd: "20 jaar", bedrag: 13.38 },
    { leeftijd: "19 jaar", bedrag: 11.47 },
    { leeftijd: "18 jaar", bedrag: 9.56 },
    { leeftijd: "17 jaar", bedrag: 7.65 },
    { leeftijd: "16 jaar", bedrag: 6.12 },
    { leeftijd: "15 jaar", bedrag: 4.59 },
  ],
};

/** Bruto per maand bij een aantal uur per week (52 weken, 12 maanden). */
export function maandloon(perUur, urenPerWeek) {
  return Math.round(((perUur * urenPerWeek * 52) / 12) * 100) / 100;
}

/* ------------------------------------------------------------------ */
/* AOW-leeftijd (Rijksoverheid, vastgesteld tot en met 2032)           */
/* ------------------------------------------------------------------ */

/** AOW-leeftijd in maanden per kalenderjaar waarin je hem bereikt. */
export const AOW_LEEFTIJD = {
  2026: 67 * 12,
  2027: 67 * 12,
  2028: 67 * 12 + 3,
  2029: 67 * 12 + 3,
  2030: 67 * 12 + 3,
  2031: 67 * 12 + 3,
  2032: 67 * 12 + 3,
};
export const AOW_LAATST_VASTGESTELD = 2032;

function plusMaanden(d, maanden) {
  const totaal = d.j * 12 + (d.m - 1) + maanden;
  const j = Math.floor(totaal / 12);
  const m = (totaal % 12) + 1;
  const laatste = new Date(Date.UTC(j, m, 0)).getUTCDate();
  return ymd(j, m, Math.min(d.d, laatste));
}

/**
 * De AOW-datum bij een geboortedatum: de eerste dag waarop iemand de
 * AOW-leeftijd bereikt die geldt in het jaar waarin dat gebeurt. Null
 * als dat jaar nog niet is vastgesteld.
 */
export function aowDatum(geboren) {
  for (const [jaar, maanden] of Object.entries(AOW_LEEFTIJD)) {
    const d = plusMaanden(geboren, maanden);
    if (d.j === Number(jaar)) return { datum: d, maanden };
  }
  const vroegst = plusMaanden(geboren, 67 * 12);
  if (vroegst.j < 2026) return { datum: vroegst, maanden: null, eerder: true };
  return null;
}

/* ------------------------------------------------------------------ */
/* Kinderbijslag (SVB: na afloop van elk kwartaal)                     */
/* ------------------------------------------------------------------ */

const KWARTAAL_MAANDEN = [1, 4, 7, 10];

/** De eerstvolgende betaalmaand (januari, april, juli, oktober) en het kwartaal waarover. */
export function volgendeKinderbijslag(vandaagDag) {
  for (let i = 0; i < 5; i++) {
    const totaal = vandaagDag.j * 12 + (vandaagDag.m - 1) + i;
    const j = Math.floor(totaal / 12);
    const m = (totaal % 12) + 1;
    if (KWARTAAL_MAANDEN.includes(m)) {
      const kwartaal = m === 1 ? 4 : (m - 1) / 3;
      return { maand: ymd(j, m, 1), over: `kwartaal ${kwartaal} van ${m === 1 ? j - 1 : j}` };
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Salarisdag                                                          */
/* ------------------------------------------------------------------ */

/**
 * Valt de salarisdag in een weekend of op een feestdag, dan betalen
 * veel werkgevers de laatste werkdag ervoor. Dat is gebruik, geen wet.
 */
export function salarisDatum(j, m, dag = 25) {
  const laatste = new Date(Date.UTC(j, m, 0)).getUTCDate();
  let d = ymd(j, m, Math.min(dag, laatste));
  const vrij = vrijeDagen(j);
  while (weekdag(d) === 0 || weekdag(d) === 6 || vrij.has(sleutel(d))) d = plusDagen(d, -1);
  return d;
}

export { vergelijk, dagenTussen, uitSleutel };

/* ------------------------------------------------------------------ */
/* v3.40.0: zorg, reiskosten en belastingteruggave                     */
/* ------------------------------------------------------------------ */

/** Verplicht eigen risico per jaar (18 jaar en ouder). */
export const EIGEN_RISICO = { 2025: 385, 2026: 385, 2027: 400 };

/** Wat je zelf betaalt bij zorgkosten die onder het eigen risico vallen. */
export function eigenRisicoVerbruik(kosten, al = 0, eigenRisico = 400) {
  const rest = Math.max(0, eigenRisico - Math.max(0, al));
  const zelf = Math.min(Math.max(0, kosten), rest);
  return { zelf, verzekeraar: Math.max(0, kosten - zelf), restNa: rest - zelf };
}

/** Onbelaste kilometervergoeding per kilometer. */
export const KM_VERGOEDING = { 2025: 0.23, 2026: 0.25, 2027: 0.25 };

/**
 * Onbelaste reiskosten bij een vast aantal dagen per week. Voor een vaste
 * vergoeding rekent de Belastingdienst met 214 reisdagen per jaar bij vijf
 * dagen per week, naar rato bij minder dagen.
 */
export function reiskosten(enkeleReisKm, dagenPerWeek, perKm) {
  const perDag = enkeleReisKm * 2 * perKm;
  const dagen = (214 * dagenPerWeek) / 5;
  return { perDag, dagen, perJaar: perDag * dagen, perMaand: (perDag * dagen) / 12 };
}

/**
 * Overstapseizoen zorgverzekering. Tot en met 31 december opzeggen (of een
 * nieuwe polis afsluiten, die zegt de oude op); tot en met 31 januari mag
 * je nog een nieuwe polis afsluiten met terugwerkende kracht tot 1 januari.
 */
export function zorgOverstap(nu) {
  const dec = ymd(nu.m === 1 ? nu.j - 1 : nu.j, 12, 31);
  const jan = ymd(dec.j + 1, 1, 31);
  if (nu.m === 1) return { fase: "januari", opzeggen: dec, nieuwePolis: jan, polisJaar: dec.j + 1 };
  if (nu.m >= 11) return { fase: "seizoen", opzeggen: dec, nieuwePolis: jan, polisJaar: dec.j + 1 };
  return { fase: "buiten", opzeggen: dec, nieuwePolis: jan, polisJaar: dec.j + 1 };
}
