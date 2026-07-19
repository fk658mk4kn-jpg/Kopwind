/**
 * lib/tools/gladheid.js
 *
 * De gladheidscheck als overlay op de gedeelde weerbasis (v3.16.0
 * "Maestro"). Beoordeelt per dag het gladheidsrisico in de nacht en
 * ochtend (de uren 0 tot 10): bevriezende natte wegen of ijzel (nat
 * plus temperatuur rond of onder nul) en grondvorst na een heldere,
 * windstille nacht, waarbij het wegdek kouder wordt dan de lucht.
 *
 * Eerlijke kanttekening, ook in de content: er is geen
 * wegdektemperatuur beschikbaar (Open-Meteo meet de lucht), dus dit is
 * een goede benadering, geen strooiwagen-informatie. Conventie als bij
 * de zonkrachtcheck: conditie.score is pijn (laag = geen gedoe),
 * antwoord.ja = "ja, glad".
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";

import { kies } from "../i18n/locale.js";

/** Alle teksten van de gladheidscheck, per taal. */
const T = kies({
  nl: {
    slug: "gladheid",
    naam: "Is het glad op de weg?",
    korteVraag: "Is het glad op de weg?",
    meldingKort: "Gladheidscheck",
    cta: "Check de wegen",
    navLabel: "Gladheid",
    diepte: "IJzel, bevroren wegen en grondvorst, per ochtend.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Geen gladheid verwacht", goed: "Vrijwel geen risico", twijfelachtig: "Plaatselijk glad mogelijk", matig: "Kans op gladheid", "zeer-slecht": "IJzelrisico: pas op" },
    adviesLabels: { goed: "geen gladheid", matig: "plaatselijk glad mogelijk", slecht: "kans op gladheid" },
    legenda: { links: "glad", rechts: "vrije wegen" },
    redenIJzel: (t) => `nat wegdek bij ${t} graden: bevriezing of ijzel`,
    redenGrondvorst: (t) => `heldere, stille nacht rond ${t} graden: het wegdek wordt kouder dan de lucht`,
    redenKoudDroog: (t) => `koud (minimum ${t} graden) maar droog: hooguit plaatselijk glad`,
    redenRandje: (t) => `nat bij ${t} graden: bruggen en viaducten kunnen kouder zijn`,
    redenVrij: (t) => `te zacht voor gladheid (minimum ${t} graden)`,
    metric: (t, nat) => `Minimum in de ochtend: ${t} graden, wegdek ${nat ? "nat" : "droog"}.`,
    statusJaVandaag: (t) => `Kans op gladheid vanochtend (rond ${t} graden): bruggen en viaducten eerst, pas je snelheid aan.`,
    statusTwijfelVandaag: (t) => `Plaatselijk glad mogelijk vanochtend (rond ${t} graden), vooral op bruggen en fietspaden.`,
    statusNeeVandaag: (t) => `Geen gladheid verwacht vandaag (minimum ${t} graden).`,
    statusJa: (t) => `Kans op gladheid die ochtend (rond ${t} graden).`,
    statusTwijfel: (t) => `Plaatselijk glad mogelijk die ochtend (rond ${t} graden).`,
    statusNee: (t) => `Geen gladheid verwacht (minimum ${t} graden).`,
    instEindLabel: "Beoordeel de ochtend tot",
    instUur: "uur",
    instVervoerVraag: "Waarmee ben je onderweg?",
    instVervoerKeuzes: ["Auto", "Fiets (paden worden minder gestrooid)"],
    instGevoeligVraag: "Wanneer wil je een ja horen?",
    instGevoeligKeuzes: ["Waarschuw me snel", "Gemiddeld", "Alleen bij serieuze kans"],
    instUitleg:
      "De check kijkt naar de nacht en ochtend: nat wegdek rond of onder nul betekent bevriezing of ijzel, en na een heldere windstille nacht kan grondvorst het wegdek kouder maken dan de lucht (dan is het glad bij plusgraden). Let op: er bestaat geen openbaar wegdek-thermometertje per straat; dit is een goede benadering, geen strooibericht.",
  },
  en: {
    slug: "icy-roads",
    naam: "Are the roads icy?",
    korteVraag: "Are the roads icy?",
    meldingKort: "Ice check",
    cta: "Check the roads",
    navLabel: "Icy roads",
    diepte: "Black ice, frozen roads and ground frost, per morning.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "No ice expected", goed: "Hardly any risk", twijfelachtig: "Locally slippery possible", matig: "Chance of icy roads", "zeer-slecht": "Black ice risk: careful" },
    adviesLabels: { goed: "no ice", matig: "locally slippery possible", slecht: "chance of icy roads" },
    legenda: { links: "icy", rechts: "clear roads" },
    redenIJzel: (t) => `wet roads at ${t} degrees: freezing or black ice`,
    redenGrondvorst: (t) => `clear, calm night around ${t} degrees: the road surface gets colder than the air`,
    redenKoudDroog: (t) => `cold (minimum ${t} degrees) but dry: at most locally slippery`,
    redenRandje: (t) => `wet at ${t} degrees: bridges and viaducts can run colder`,
    redenVrij: (t) => `too mild for ice (minimum ${t} degrees)`,
    metric: (t, nat) => `Morning minimum: ${t} degrees, roads ${nat ? "wet" : "dry"}.`,
    statusJaVandaag: (t) => `Chance of icy roads this morning (around ${t} degrees): bridges and viaducts first, adjust your speed.`,
    statusTwijfelVandaag: (t) => `Locally slippery possible this morning (around ${t} degrees), especially bridges and bike paths.`,
    statusNeeVandaag: (t) => `No ice expected today (minimum ${t} degrees).`,
    statusJa: (t) => `Chance of icy roads that morning (around ${t} degrees).`,
    statusTwijfel: (t) => `Locally slippery possible that morning (around ${t} degrees).`,
    statusNee: (t) => `No ice expected (minimum ${t} degrees).`,
    instEindLabel: "Assess the morning until",
    instUur: "h",
    instVervoerVraag: "How do you travel?",
    instVervoerKeuzes: ["Car", "Bike (paths get gritted less)"],
    instGevoeligVraag: "When do you want a yes?",
    instGevoeligKeuzes: ["Warn me early", "Average", "Only when likely"],
    instUitleg:
      "The check looks at the night and morning: wet roads around or below zero mean freezing or black ice, and after a clear calm night ground frost can make the surface colder than the air (icy at plus degrees). Note: there is no public road-surface thermometer per street; this is a good approximation, not a gritting bulletin.",
  },
});

export const GLADHEID_DEFAULTS = {
  dagStart: 0,
  dagEind: 10,
  risicoJa: 40, // vanaf dit risico wordt het antwoord "ja, glad"
  fiets: false, // fietspaden worden minder gestrooid: iets gevoeliger
};

/** Gladheidsrisico (0..100) voor de nacht- en ochtenduren van een dag. */
function dagRisico(uren, inst) {
  const minTemp = Math.min(...uren.map((u) => u.temp ?? u.gevoel ?? 99));
  if (minTemp > 3) return { risico: 0, minTemp };
  const natUren = uren.filter((u) => (u.neerslag ?? 0) > 0.05).length;
  const gemBewolking = uren.reduce((a, u) => a + (u.bewolking ?? 60), 0) / uren.length;
  const gemWind = uren.reduce((a, u) => a + (u.wind ?? 10), 0) / uren.length;
  let risico;
  if (minTemp <= 1 && natUren > 0) {
    risico = 75 + (minTemp <= -1 ? 10 : 0);
  } else if (minTemp <= 0 && gemBewolking <= 40 && gemWind < 12) {
    risico = 48;
  } else if (minTemp <= 1) {
    risico = 26;
  } else {
    risico = natUren > 0 ? 20 : 8;
  }
  if (inst.fiets && risico > 0 && risico < 70) risico += 8;
  return { risico: clamp(risico, 0, 100), minTemp, natUren };
}

/** Uurscore voor de uurbalk: hoog = vrije wegen. */
function uurGladScore(u) {
  const t = u.temp ?? u.gevoel ?? 10;
  const nat = (u.neerslag ?? 0) > 0.05;
  if (t <= 1 && nat) return 10;
  if (t <= 0) return 30;
  if (t <= 1) return 55;
  if (t <= 3) return nat ? 62 : 80;
  return 96;
}

export function overlay(hourly, nu = new Date(), instellingen = GLADHEID_DEFAULTS) {
  const inst = { ...GLADHEID_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, inst.dagStart, inst.dagEind);
  const vandaagKey = dagKeyVan(nu);

  const dagen = [];
  for (const [datum, dagUren] of perDag) {
    if (datum < vandaagKey) continue;
    dagen.push({ datum, dagUren });
  }
  dagen.sort((a, b) => (a.datum < b.datum ? -1 : 1));

  const dagenUit = dagen.slice(0, 5).map(({ datum, dagUren }) => {
    const uren = dagUren.map((u) => ({
      ...u,
      score: uurGladScore(u),
      nat: (u.neerslag ?? 0) > 0.05,
    }));
    const { risico, minTemp: ruwMin, natUren = 0 } = dagRisico(dagUren, inst);
    const minTemp = Math.round(ruwMin);
    // Bugfix v3.26.0: pijn-score, zie de krabcheck; de oude
    // 100-minus-risico draaide het stoplicht en het advieslabel om.
    const score = risico;
    const ja = risico >= inst.risicoJa;
    const twijfel = !ja && risico >= 20;

    const factoren = [];
    if (risico >= 70) {
      factoren.push({ punten: risico, reden: T.redenIJzel(minTemp) });
    } else if (ja) {
      factoren.push({ punten: risico, reden: T.redenGrondvorst(minTemp) });
    } else if (twijfel) {
      factoren.push({
        punten: risico,
        reden: natUren > 0 ? T.redenRandje(minTemp) : T.redenKoudDroog(minTemp),
      });
    } else {
      factoren.push({ punten: risico, reden: T.redenVrij(minTemp) });
    }
    const { redenen } = maakScore(factoren);
    const conditie = { score, redenen, advies: adviesVoorScore(score, gladheid.adviesLabels) };

    const isVandaag = datum === vandaagKey;
    const zin = ja
      ? (isVandaag ? T.statusJaVandaag : T.statusJa)(minTemp)
      : twijfel
        ? (isVandaag ? T.statusTwijfelVandaag : T.statusTwijfel)(minTemp)
        : (isVandaag ? T.statusNeeVandaag : T.statusNee)(minTemp);
    const status = { soort: "info", zin };

    return {
      datum,
      antwoord: { ja, zin },
      uren: uren.map((u) => ({ uur: u.uur, score: u.score, nat: u.nat })),
      venster: null,
      metric: { zin: T.metric(minTemp, natUren > 0) },
      conditie,
      status,
    };
  });

  return { dagen: dagenUit };
}

export const gladheid = {
  id: "gladheid",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#44607A",
  locatieHint: T.locatieHint,
  icoon: "slip",
  categorieId: "winter",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: GLADHEID_DEFAULTS },
  instellingen: {
    defaults: GLADHEID_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "vervoer",
        vraag: T.instVervoerVraag,
        keuzes: [
          { label: T.instVervoerKeuzes[0], zet: { fiets: false } },
          { label: T.instVervoerKeuzes[1], zet: { fiets: true } },
        ],
      },
      {
        type: "keuze",
        id: "gevoelig",
        vraag: T.instGevoeligVraag,
        keuzes: [
          { label: T.instGevoeligKeuzes[0], zet: { risicoJa: 30 } },
          { label: T.instGevoeligKeuzes[1], zet: { risicoJa: 40 } },
          { label: T.instGevoeligKeuzes[2], zet: { risicoJa: 50 } },
        ],
      },
      { key: "dagEind", label: T.instEindLabel, eenheid: T.instUur, step: 1, min: 8, max: 12 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-16",
  affiliate: null,
};
