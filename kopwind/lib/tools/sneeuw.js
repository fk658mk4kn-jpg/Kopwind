/**
 * lib/tools/sneeuw.js
 *
 * De sneeuwcheck (v3.36.0 "Bise"): gaat het sneeuwen, wanneer begint het
 * en hoeveel komt er? Waar de sneeuwpretcheck kijkt naar wat er al ligt,
 * kijkt deze naar wat er valt (snowfall per uur) en of natte sneeuw of
 * ijzel-achtige neerslag rond het vriespunt meespeelt.
 *
 * Polariteit zoals storm en de buitenkraan: groen betekent geen sneeuw
 * van betekenis, rood een flink pak. Het schaalwoord zegt wat er komt.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "gaat-het-sneeuwen",
    naam: "Gaat het vandaag sneeuwen?",
    korteVraag: "Gaat het sneeuwen?",
    meldingKort: "Sneeuwcheck",
    cta: "Check de sneeuw",
    navLabel: "Sneeuw",
    diepte: "Wanneer de eerste vlokken vallen en hoeveel centimeter erbij komt, per uur.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Geen sneeuw", goed: "Geen sneeuw van betekenis", twijfelachtig: "Een paar vlokken", matig: "Sneeuw verwacht", "zeer-slecht": "Flinke sneeuwval" },
    adviesLabels: { goed: "geen sneeuw", matig: "een paar vlokken", slecht: "sneeuw" },
    legenda: { links: "geen sneeuw", rechts: "flinke sneeuw" },
    statusGeen: "Geen sneeuw verwacht in dit deel van de dag.",
    statusNat: (uur) => `Rond ${uur}:00 natte sneeuw of sneeuw met regen. Het blijft niet liggen, maar fietspaden en bruggen kunnen glad worden.`,
    statusVlokken: (uur, cm) => `Rond ${uur}:00 vallen er wat vlokken, in totaal niet meer dan ${cm} cm.`,
    statusLaag: (uur, cm) => `Vanaf ongeveer ${uur}:00 sneeuw, in totaal rond ${cm} cm. Reken op gladheid.`,
    statusFlink: (uur, cm) => `Flinke sneeuwval vanaf ongeveer ${uur}:00, zo'n ${cm} cm. Houd rekening met gladde wegen en vertraging.`,
    redenGeen: "geen sneeuw in de verwachting",
    redenNat: "natte sneeuw rond het vriespunt",
    redenVlokken: (cm) => `wat sneeuw (${cm} cm)`,
    redenLaag: (cm) => `sneeuw (${cm} cm)`,
    redenFlink: (cm) => `flink pak sneeuw (${cm} cm)`,
    redenLigt: (cm) => `er ligt al een sneeuwdek (${cm} cm)`,
    redenOnderGrens: "minder dan jouw grens",
    metricSneeuw: (cm, uur) => `Verwachte sneeuw: ${cm} cm, de eerste vlokken rond ${uur}:00.`,
    metricGeen: "Geen sneeuw in de verwachting voor deze dag.",
    instGrensVraag: "Vanaf wanneer telt het voor jou als sneeuw?",
    instGrensKeuzes: ["De eerste vlokken", "Een laagje (vanaf 1 cm)", "Een flink pak (vanaf 5 cm)"],
    instDagdeelVraag: "Welk deel van de dag?",
    instDagdeelKeuzes: ["De hele dag", "Overdag (8 tot 18 uur)", "De spitsen (7-9 en 16-19 uur)"],
    instNatVraag: "Natte sneeuw meetellen?",
    instNatKeuzes: ["Ja, ik wil het weten", "Nee, alleen echte sneeuw"],
    instUitleg:
      "De check telt per uur de verwachte sneeuw in centimeters op en zoekt het eerste uur met vlokken. Natte sneeuw (neerslag rond het vriespunt die niet als sneeuw blijft liggen) telt mee als je dat aanzet, omdat juist die fietspaden en bruggen glad kan maken. Je grens bepaalt vanaf hoeveel centimeter het oordeel echt omslaat.",
  },
  en: {
    slug: "will-it-snow",
    naam: "Will it snow today?",
    korteVraag: "Will it snow?",
    meldingKort: "Snow check",
    cta: "Check the snow",
    navLabel: "Snow",
    diepte: "When the first flakes fall and how many centimetres are added, per hour.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "No snow", goed: "No snow to speak of", twijfelachtig: "A few flakes", matig: "Snow expected", "zeer-slecht": "Heavy snowfall" },
    adviesLabels: { goed: "no snow", matig: "a few flakes", slecht: "snow" },
    legenda: { links: "no snow", rechts: "heavy snow" },
    statusGeen: "No snow expected in this part of the day.",
    statusNat: (uur) => `Around ${uur}:00 wet snow or sleet. It won't settle, but cycle paths and bridges can get slippery.`,
    statusVlokken: (uur, cm) => `Around ${uur}:00 a few flakes, no more than ${cm} cm in total.`,
    statusLaag: (uur, cm) => `Snow from about ${uur}:00, around ${cm} cm in total. Expect slippery roads.`,
    statusFlink: (uur, cm) => `Heavy snowfall from about ${uur}:00, some ${cm} cm. Expect slippery roads and delays.`,
    redenGeen: "no snow in the forecast",
    redenNat: "wet snow around freezing",
    redenVlokken: (cm) => `some snow (${cm} cm)`,
    redenLaag: (cm) => `snow (${cm} cm)`,
    redenFlink: (cm) => `heavy snow (${cm} cm)`,
    redenLigt: (cm) => `snow already on the ground (${cm} cm)`,
    redenOnderGrens: "below your threshold",
    metricSneeuw: (cm, uur) => `Expected snow: ${cm} cm, first flakes around ${uur}:00.`,
    metricGeen: "No snow in the forecast for this day.",
    instGrensVraag: "From when does it count as snow for you?",
    instGrensKeuzes: ["The first flakes", "A layer (from 1 cm)", "A proper blanket (from 5 cm)"],
    instDagdeelVraag: "Which part of the day?",
    instDagdeelKeuzes: ["The whole day", "Daytime (8 to 18)", "Rush hours (7-9 and 16-19)"],
    instNatVraag: "Count wet snow?",
    instNatKeuzes: ["Yes, tell me", "No, only real snow"],
    instUitleg:
      "The check adds up the expected snow per hour in centimetres and finds the first hour with flakes. Wet snow (precipitation around freezing that doesn't settle) counts if you switch it on, because that is what makes cycle paths and bridges slippery. Your threshold sets from how many centimetres the verdict really tips.",
  },
});

export const SNEEUW_CHECK_DEFAULTS = { grens: 1, dagdeel: 0, nat: 0 };
const GRENS_CM = [0.1, 1, 5];

function inDagdeel(uur, dagdeel) {
  if (dagdeel === 1) return uur >= 8 && uur <= 18;
  if (dagdeel === 2) return (uur >= 7 && uur <= 9) || (uur >= 16 && uur <= 19);
  return true;
}

/** Natte sneeuw: neerslag rond het vriespunt zonder (veel) sneeuwval. */
function isNat(u) {
  return (u.neerslag ?? 0) >= 0.1 && (u.sneeuw ?? 0) < 0.1 && (u.temp ?? 9) <= 2 && (u.temp ?? -9) >= -1;
}

function uurScore(u, natTelt) {
  const cm = u.sneeuw ?? 0;
  if (cm >= 0.5) return 80;
  if (cm >= 0.1) return 55;
  if (natTelt && isNat(u)) return 40;
  return 8;
}

export function overlay(hourly, nu = new Date(), instellingen = SNEEUW_CHECK_DEFAULTS) {
  const inst = { ...SNEEUW_CHECK_DEFAULTS, ...(instellingen ?? {}) };
  const natTelt = inst.nat === 0;
  const grensCm = GRENS_CM[inst.grens] ?? 1;
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const vandaagKey = dagKeyVan(nu);
  const datums = [...perDag.keys()].filter((d) => d >= vandaagKey).sort().slice(0, 5);

  const dagenUit = [];
  for (const datum of datums) {
    const alleUren = perDag.get(datum) ?? [];
    let uren = alleUren.filter((u) => inDagdeel(u.uur, inst.dagdeel));
    // Vandaag telt alleen wat nog komt.
    if (datum === vandaagKey) {
      const nuUur = nu.getHours();
      const rest = uren.filter((u) => u.uur >= nuUur);
      if (rest.length) uren = rest;
    }
    if (!uren.length) continue;

    const totaal = Math.round(uren.reduce((a, u) => a + (u.sneeuw ?? 0), 0) * 10) / 10;
    const eerste = uren.find((u) => (u.sneeuw ?? 0) >= 0.1) ?? (natTelt ? uren.find(isNat) : null);
    const natUren = natTelt ? uren.filter(isNat).length : 0;
    const dekCm = Math.round(Math.max(0, ...uren.map((u) => u.sneeuwdek ?? 0)) * 100);
    const uur = eerste ? String(eerste.uur).padStart(2, "0") : null;

    const factoren = [];
    let zin;
    if (totaal >= 5) {
      factoren.push({ punten: 85, reden: T.redenFlink(totaal) });
      zin = T.statusFlink(uur, totaal);
    } else if (totaal >= 1) {
      factoren.push({ punten: 65, reden: T.redenLaag(totaal) });
      zin = T.statusLaag(uur, totaal);
    } else if (totaal >= 0.1) {
      factoren.push({ punten: 46, reden: T.redenVlokken(Math.max(totaal, 0.1)) });
      zin = T.statusVlokken(uur, Math.max(1, Math.ceil(totaal)));
    } else if (natUren > 0) {
      factoren.push({ punten: 36, reden: T.redenNat });
      zin = T.statusNat(uur);
    } else {
      factoren.push({ punten: 6, reden: T.redenGeen });
      zin = T.statusGeen;
    }
    if (dekCm >= 1 && totaal < 1) factoren.push({ punten: 6, reden: T.redenLigt(dekCm) });

    let { score, redenen } = maakScore(factoren);
    // Onder de eigen grens slaat het oordeel niet om naar rood of oranje.
    if (totaal > 0 && totaal < grensCm && score > 28) {
      score = 28;
      redenen = [...redenen, T.redenOnderGrens];
    }
    const s = clamp(score, 0, 100);
    const conditie = { score: s, redenen, advies: adviesVoorScore(s, sneeuw.adviesLabels) };

    dagenUit.push({
      datum,
      antwoord: { ja: s < 45, zin },
      uren: uren.map((u) => ({
        uur: u.uur,
        score: uurScore(u, natTelt),
        nat: (u.neerslag ?? 0) > 0.1,
      })),
      venster: null,
      metric: { zin: eerste && totaal >= 0.1 ? T.metricSneeuw(totaal, uur) : T.metricGeen },
      conditie,
      status: { soort: "info", zin },
    });
  }

  return { dagen: dagenUit, legenda: T.legenda };
}

export const sneeuw = {
  id: "sneeuw",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#44607A",
  locatieHint: T.locatieHint,
  icoon: "vlok",
  categorieId: "winter",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: [...BASIS_VELDEN, "snowfall", "snow_depth"],
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: SNEEUW_CHECK_DEFAULTS },
  instellingen: {
    defaults: SNEEUW_CHECK_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "grens",
        vraag: T.instGrensVraag,
        keuzes: T.instGrensKeuzes.map((label, i) => ({ label, zet: { grens: i } })),
      },
      {
        type: "keuze",
        id: "dagdeel",
        vraag: T.instDagdeelVraag,
        keuzes: T.instDagdeelKeuzes.map((label, i) => ({ label, zet: { dagdeel: i } })),
      },
      {
        type: "keuze",
        id: "nat",
        vraag: T.instNatVraag,
        keuzes: T.instNatKeuzes.map((label, i) => ({ label, zet: { nat: i } })),
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-11-15",
  affiliate: null,
};
