/**
 * lib/tools/krabben.js
 *
 * De krabcheck als overlay op de gedeelde weerbasis (v3.16.0
 * "Maestro"). Beantwoordt de avondvraag "moet ik morgen krabben?":
 * elke dag in het rijtje beoordeelt de NACHT ERNA (de uren 0 tot 8 van
 * de volgende kalenderdag). De tab "vandaag" geeft dus het antwoord
 * voor morgenochtend; dat staat expliciet in elke statuszin.
 *
 * Het risico op een bevroren ruit is het grootst bij een heldere,
 * windstille nacht (uitstraling: de ruit wordt kouder dan de lucht) met
 * een minimum rond of onder het vriespunt. Een carport halveert het
 * risico ruwweg; binnen geparkeerd is het antwoord altijd nee.
 * Conventie als bij de zonkrachtcheck: hoge score = geen gedoe, en
 * antwoord.ja betekent "ja, krabben".
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";

import { kies } from "../i18n/locale.js";

/** Alle teksten van de krabcheck, per taal. */
const T = kies({
  nl: {
    slug: "krabben",
    naam: "Moet ik morgen krabben?",
    korteVraag: "Moet ik morgen krabben?",
    meldingKort: "Krabcheck",
    cta: "Check de ruiten",
    navLabel: "Krabben",
    diepte: "Het vriesrisico voor de ruiten, per nacht vooruit.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Geen krabber nodig", goed: "Waarschijnlijk ijsvrij", twijfelachtig: "Leg de krabber klaar", matig: "Grote kans op krabben", "zeer-slecht": "Zeker krabben (of dek af)" },
    adviesLabels: { goed: "geen krabwerk", matig: "misschien krabben", slecht: "krabben geblazen" },
    legenda: { links: "krabben", rechts: "ijsvrij" },
    redenVorst: (t) => `het koelt af tot ${t} graden`,
    redenHelder: "heldere nacht: de ruit wordt kouder dan de lucht",
    redenStil: "weinig wind: de kou blijft op de ruit liggen",
    redenRandje: (t) => `minimum rond ${t} graden: aanvriezen kan bij opklaringen`,
    redenBeschut: "de carport houdt de ergste aanslag tegen",
    redenBinnen: "de auto staat binnen",
    redenZacht: (t) => `zachte nacht (minimum ${t} graden)`,
    metric: (t, helder) => `Minimum komende nacht: ${t} graden${helder ? ", heldere hemel" : ""}.`,
    statusJaVandaag: (t) => `Morgenochtend krabben: het koelt af tot ${t} graden.`,
    statusTwijfelVandaag: (t) => `Leg de krabber klaar: minimum rond ${t} graden, aanvriezen kan bij opklaringen.`,
    statusNeeVandaag: (t) => `Morgenochtend geen krabber nodig (minimum ${t} graden).`,
    statusJa: (t) => `Die ochtend krabben: het koelt af tot ${t} graden.`,
    statusTwijfel: (t) => `Krabber bij de hand die ochtend: minimum rond ${t} graden.`,
    statusNee: (t) => `Geen krabber nodig die ochtend (minimum ${t} graden).`,
    statusBinnen: "De auto staat binnen: nooit krabben.",
    instPlekVraag: "Waar staat de auto 's nachts?",
    instPlekKeuzes: ["Buiten", "Onder een carport", "Binnen (garage)"],
    instGevoeligVraag: "Wanneer wil je een ja horen?",
    instGevoeligKeuzes: ["Waarschuw me snel", "Gemiddeld", "Alleen bij grote kans"],
    instGrensLabel: "Aanvriesgrens van de ruit",
    instGraden: "graden",
    instUitleg:
      "Elke dag toont het krab-advies voor de ochtend erna: de tab vandaag beantwoordt dus \u201cmoet ik morgen krabben\u201d. Het risico is het grootst bij een heldere, windstille nacht rond of onder nul; de ruit wordt dan kouder dan de lucht en kan zelfs bij een paar graden boven nul aanvriezen. Een carport scheelt veel, binnen parkeren alles.",
  },
  en: {
    slug: "windscreen-frost",
    naam: "Scrape the car tomorrow?",
    korteVraag: "Scrape the car tomorrow?",
    meldingKort: "Frost check",
    cta: "Check the windscreen",
    navLabel: "Scraping",
    diepte: "The frost risk for your windscreen, night by night.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "No scraper needed", goed: "Probably ice-free", twijfelachtig: "Keep the scraper handy", matig: "Good chance of scraping", "zeer-slecht": "Definitely scraping (or cover up)" },
    adviesLabels: { goed: "no scraping", matig: "possibly scraping", slecht: "scraping time" },
    legenda: { links: "scraping", rechts: "ice-free" },
    redenVorst: (t) => `it cools down to ${t} degrees`,
    redenHelder: "clear night: the windscreen gets colder than the air",
    redenStil: "little wind: the cold settles on the glass",
    redenRandje: (t) => `minimum around ${t} degrees: frost can form under clear spells`,
    redenBeschut: "the carport keeps the worst off",
    redenBinnen: "the car is parked inside",
    redenZacht: (t) => `mild night (minimum ${t} degrees)`,
    metric: (t, helder) => `Minimum tonight: ${t} degrees${helder ? ", clear sky" : ""}.`,
    statusJaVandaag: (t) => `Scraping tomorrow morning: it cools down to ${t} degrees.`,
    statusTwijfelVandaag: (t) => `Keep the scraper handy: minimum around ${t} degrees, frost possible under clear spells.`,
    statusNeeVandaag: (t) => `No scraper needed tomorrow morning (minimum ${t} degrees).`,
    statusJa: (t) => `Scraping that morning: it cools down to ${t} degrees.`,
    statusTwijfel: (t) => `Scraper within reach that morning: minimum around ${t} degrees.`,
    statusNee: (t) => `No scraper needed that morning (minimum ${t} degrees).`,
    statusBinnen: "The car is parked inside: never any scraping.",
    instPlekVraag: "Where does the car spend the night?",
    instPlekKeuzes: ["Outside", "Under a carport", "Inside (garage)"],
    instGevoeligVraag: "When do you want a yes?",
    instGevoeligKeuzes: ["Warn me early", "Average", "Only when likely"],
    instGrensLabel: "Windscreen frost threshold",
    instGraden: "degrees",
    instUitleg:
      "Each day shows the scraping advice for the morning after it: the today tab answers \u201cdo I scrape tomorrow\u201d. The risk peaks on a clear, calm night around or below zero; the glass then gets colder than the air and can frost over even a few degrees above freezing. A carport helps a lot, parking inside settles it.",
  },
});

export const KRAB_DEFAULTS = {
  beschut: 0, // 0 = buiten, 1 = carport, 2 = binnen
  risicoJa: 45, // vanaf dit risico wordt het antwoord "ja, krabben"
  grensTemp: 1.5, // onder dit minimum begint de aanvrieszone van de ruit
};

/** Risico op een bevroren ruit (0..100) voor een set nachturen. */
function nachtRisico(uren, inst) {
  if (inst.beschut >= 2) return 0;
  const minTemp = Math.min(...uren.map((u) => u.temp ?? u.gevoel ?? 99));
  if (minTemp > 4) return 0;
  const gemBewolking = uren.reduce((a, u) => a + (u.bewolking ?? 60), 0) / uren.length;
  const gemWind = uren.reduce((a, u) => a + (u.wind ?? 10), 0) / uren.length;
  const helder = gemBewolking <= 40;
  const stil = gemWind < 12;
  let risico;
  if (minTemp > inst.grensTemp) {
    risico = helder && stil ? 22 : 6;
  } else {
    risico = 45;
    if (helder) risico += 25;
    if (stil) risico += 15;
    if (minTemp <= -2) risico += 15;
  }
  if (inst.beschut === 1) risico = Math.round(risico * 0.5);
  return clamp(risico, 0, 100);
}

/** Uurscore voor de uurbalk: hoog = ijsvrij. */
function uurKrabScore(u) {
  const t = u.temp ?? u.gevoel ?? 10;
  if (t <= 0) return 12;
  if (t <= 1.5) return 38;
  if (t <= 3) return 68;
  return 96;
}

export function overlay(hourly, nu = new Date(), instellingen = KRAB_DEFAULTS) {
  const inst = { ...KRAB_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  // De vroege uren (0-8) per kalenderdag; dag D leent de ochtend van D+1.
  const perDag = basisPerDag(basis, 0, 8);
  const vandaagKey = dagKeyVan(nu);

  const datums = [...perDag.keys()].filter((d) => d >= vandaagKey).sort();
  const dagenUit = [];
  for (let i = 0; i < datums.length - 1 && dagenUit.length < 4; i++) {
    const datum = datums[i];
    const ochtend = perDag.get(datums[i + 1]) ?? [];
    if (!ochtend.length) continue;
    const uren = ochtend.map((u) => ({
      ...u,
      score: inst.beschut >= 2 ? 100 : uurKrabScore(u),
      nat: (u.neerslag ?? 0) > 0.05,
    }));
    const minTemp = Math.round(Math.min(...ochtend.map((u) => u.temp ?? u.gevoel ?? 99)));
    const gemBewolking = ochtend.reduce((a, u) => a + (u.bewolking ?? 60), 0) / ochtend.length;
    const helder = gemBewolking <= 40;
    const risico = nachtRisico(ochtend, inst);
    const score = 100 - risico;
    const ja = risico >= inst.risicoJa;
    const twijfel = !ja && risico >= 20;

    const factoren = [];
    if (inst.beschut >= 2) {
      factoren.push({ punten: 0, reden: T.redenBinnen });
    } else if (ja) {
      factoren.push({ punten: risico, reden: T.redenVorst(minTemp) });
      if (helder) factoren.push({ punten: 0, reden: T.redenHelder });
      if (inst.beschut === 1) factoren.push({ punten: 0, reden: T.redenBeschut });
    } else if (twijfel) {
      factoren.push({ punten: risico, reden: T.redenRandje(minTemp) });
      if (helder) factoren.push({ punten: 0, reden: T.redenHelder });
    } else {
      factoren.push({ punten: risico, reden: T.redenZacht(minTemp) });
    }
    const { redenen } = maakScore(factoren);
    const conditie = { score, redenen, advies: adviesVoorScore(score, krabben.adviesLabels) };

    const isVandaag = datum === vandaagKey;
    const zin =
      inst.beschut >= 2
        ? T.statusBinnen
        : ja
          ? (isVandaag ? T.statusJaVandaag : T.statusJa)(minTemp)
          : twijfel
            ? (isVandaag ? T.statusTwijfelVandaag : T.statusTwijfel)(minTemp)
            : (isVandaag ? T.statusNeeVandaag : T.statusNee)(minTemp);
    const status = { soort: "info", zin };

    dagenUit.push({
      datum,
      antwoord: { ja, zin },
      uren: uren.map((u) => ({ uur: u.uur, score: u.score, nat: u.nat })),
      venster: null,
      metric: { zin: T.metric(minTemp, helder) },
      conditie,
      status,
    });
  }

  return { dagen: dagenUit };
}

export const krabben = {
  id: "krabben",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#44607A",
  locatieHint: T.locatieHint,
  icoon: "krabber",
  categorieId: "winter",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: KRAB_DEFAULTS },
  instellingen: {
    defaults: KRAB_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "plek",
        vraag: T.instPlekVraag,
        keuzes: [
          { label: T.instPlekKeuzes[0], zet: { beschut: 0 } },
          { label: T.instPlekKeuzes[1], zet: { beschut: 1 } },
          { label: T.instPlekKeuzes[2], zet: { beschut: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "gevoelig",
        vraag: T.instGevoeligVraag,
        keuzes: [
          { label: T.instGevoeligKeuzes[0], zet: { risicoJa: 35 } },
          { label: T.instGevoeligKeuzes[1], zet: { risicoJa: 45 } },
          { label: T.instGevoeligKeuzes[2], zet: { risicoJa: 55 } },
        ],
      },
      { key: "grensTemp", label: T.instGrensLabel, eenheid: T.instGraden, step: 0.5, min: 0.5, max: 4 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-16",
  affiliate: null,
};
