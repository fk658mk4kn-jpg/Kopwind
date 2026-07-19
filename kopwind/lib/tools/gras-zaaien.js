/**
 * lib/tools/gras-zaaien.js
 *
 * De zaaicheck voor het gazon (v3.28.0 "Ostria"). Gras zaaien is de
 * meest seizoensgebonden tuinklus van allemaal: het zaad kiemt pas als
 * de bodem boven de tien graden komt, en de twee echte vensters zijn
 * april-mei en (de beste) september tot half oktober. Binnen dat
 * venster beslist het weer: een zachte regenperiode vooruit is gratis
 * beregening, harde regen op de zaaidag spoelt het zaad weg, stevige
 * wind verwaait het, en een hete droge week laat kiemend gras
 * verdrogen tenzij je zelf sproeit.
 *
 * Bodemtemperatuur-proxy: het gemiddelde etmaalgevoel van de dag; de
 * bodem loopt daar in het voorjaar een paar dagen op achter, dus de
 * grens ligt bewust iets boven de kiemgrens. MAAND_ZAAI is de
 * kalenderlaag, zelfde patroon als de snoeicheck. Affiliate null
 * (gepauzeerd); graszaad is de sterkste kandidaat zodra de uitrol
 * aan gaat.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "gras-zaaien",
    naam: "Kan ik vandaag gras zaaien?",
    korteVraag: "Kan ik vandaag gras zaaien?",
    meldingKort: "Zaaicheck",
    cta: "Check de zaaidag",
    navLabel: "Gras zaaien",
    diepte: "Bodemwarmte, regen vooruit en het zaaiseizoen: de beste dag om het gazon te zaaien.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Prima zaaidag", goed: "Goed te doen", twijfelachtig: "Kan, met beleid", matig: "Liever wachten", "zeer-slecht": "Geen zaaidag" },
    adviesLabels: { goed: "zaaidag", matig: "kan, met beleid", slecht: "geen zaaidag" },
    legenda: { links: "wachten", rechts: "zaaien" },
    statusSeizoen: "Buiten het zaaiseizoen: het zaad blijft liggen of de jonge grasplant redt de winter niet. Wacht op het volgende venster.",
    statusKoud: (t) => `Nog te koud: met een etmaalgemiddelde rond ${t} graden kiemt graszaad niet of tergend traag.`,
    statusNatVandaag: "Vandaag niet zaaien: harde regen spoelt het zaad weg of slaat de grond dicht. Morgen of overmorgen is vaak beter.",
    statusWind: (w) => `Te veel wind om te zaaien (${w} km/u): het zaad waait weg voor het ligt.`,
    statusDroogHeet: "Zaaien kan, maar zonder regen in zicht moet je zelf twee weken vochtig houden. Sproei je niet, wacht dan op een zachtere periode.",
    statusIdeaal: "Prima zaaidag: de bodem is warm genoeg en er komt zachte regen aan die het kiembed vochtig houdt.",
    statusGoed: "Goede zaaidag: warm genoeg en rustig weer. Houd het kiembed de komende twee weken vochtig.",
    redenSeizoen: "buiten het zaaiseizoen (april-mei en september-half oktober)",
    redenKoud: (t) => `bodem nog te koud (etmaal rond ${t} graden)`,
    redenNat: "harde regen op de zaaidag",
    redenWind: (w) => `te veel wind (${w} km/u)`,
    redenRegenKomt: "zachte regen op komst: gratis beregening voor het kiembed",
    redenDroog: "geen regen in zicht: zelf vochtig houden",
    redenPrima: "warm genoeg en rustig zaaiweer",
    metricMaand: (zin) => zin,
    instKlusVraag: "Wat ga je doen?",
    instKlusKeuzes: ["Kale plekken doorzaaien", "Een nieuw gazon inzaaien"],
    instSproeiVraag: "Kun je zelf sproeien?",
    instSproeiKeuzes: ["Nee, de regen moet het doen", "Ja, ik houd het zelf vochtig"],
    instGrondVraag: "Wat voor grond heb je?",
    instGrondKeuzes: ["Zandgrond", "Gemengd of geen idee", "Kleigrond"],
    instUitleg:
      "Doorzaaien is vergevingsgezinder dan een heel nieuw gazon (het bestaande gras beschermt het kiembed). Kun je zelf sproeien, dan telt een droge periode veel minder zwaar. Zandgrond warmt in het voorjaar eerder op, klei houdt in het najaar langer warmte vast.",
  },
  en: {
    slug: "sowing-grass",
    naam: "Can I sow grass today?",
    korteVraag: "Can I sow grass today?",
    meldingKort: "Sowing check",
    cta: "Check the sowing day",
    navLabel: "Sowing grass",
    diepte: "Soil warmth, rain ahead and the sowing season: the best day to seed the lawn.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Fine sowing day", goed: "Good to go", twijfelachtig: "Doable with care", matig: "Better wait", "zeer-slecht": "No sowing day" },
    adviesLabels: { goed: "sowing day", matig: "doable with care", slecht: "no sowing day" },
    legenda: { links: "wait", rechts: "sow" },
    statusSeizoen: "Outside the sowing season: the seed just sits there or the young grass won't survive winter. Wait for the next window.",
    statusKoud: (t) => `Still too cold: with a daily average around ${t} degrees grass seed germinates barely or not at all.`,
    statusNatVandaag: "Don't sow today: hard rain washes the seed away or caps the soil. Tomorrow or the day after is often better.",
    statusWind: (w) => `Too much wind to sow (${w} km/h): the seed blows away before it lands.`,
    statusDroogHeet: "Sowing is possible, but with no rain in sight you'll need to keep it moist for two weeks yourself. If you won't sprinkle, wait for a softer spell.",
    statusIdeaal: "A fine sowing day: the soil is warm enough and soft rain is coming to keep the seedbed moist.",
    statusGoed: "A good sowing day: warm enough and calm. Keep the seedbed moist for the next two weeks.",
    redenSeizoen: "outside the sowing season (April-May and September-mid October)",
    redenKoud: (t) => `soil still too cold (daily average around ${t} degrees)`,
    redenNat: "hard rain on the sowing day",
    redenWind: (w) => `too much wind (${w} km/h)`,
    redenRegenKomt: "soft rain ahead: free irrigation for the seedbed",
    redenDroog: "no rain in sight: keep it moist yourself",
    redenPrima: "warm enough and calm sowing weather",
    metricMaand: (zin) => zin,
    instKlusVraag: "What's the job?",
    instKlusKeuzes: ["Overseeding bare patches", "Sowing a brand new lawn"],
    instSproeiVraag: "Can you sprinkle yourself?",
    instSproeiKeuzes: ["No, the rain has to do it", "Yes, I'll keep it moist"],
    instGrondVraag: "What soil do you have?",
    instGrondKeuzes: ["Sandy soil", "Mixed or no idea", "Clay soil"],
    instUitleg:
      "Overseeding is more forgiving than a brand new lawn (the existing grass shelters the seedbed). If you can sprinkle yourself, a dry spell counts far less. Sand warms up earlier in spring, clay holds warmth longer in autumn.",
  },
});

/** Zaaikalender per maand, kort en feitelijk. */
export const MAAND_ZAAI = kies({
  nl: {
    1: "Januari: geen zaaimaand; de bodem is koud en nat. Plan het voorjaarsvenster.",
    2: "Februari: nog te koud voor graszaad; wel de maand om kale plekken alvast in kaart te brengen.",
    3: "Maart: op zandgrond kan het eind van de maand nét, maar april is bijna altijd beter.",
    4: "April: het voorjaarsvenster opent zodra de bodem boven de tien graden komt.",
    5: "Mei: prima zaaimaand; hoe eerder in de maand, hoe minder last van vroege zomerdroogte.",
    6: "Juni: kan nog, maar jonge grasplanten hebben moeite met de eerste hitte; houd het vochtig.",
    7: "Juli: te heet en te droog voor zaaien; zonder dagelijkse beregening verdroogt het kiembed.",
    8: "Augustus: wacht tot eind van de maand; dan begint het beste zaaivenster van het jaar.",
    9: "September: de beste zaaimaand: warme bodem, koelere lucht en herfstregen doen het werk.",
    10: "Oktober: tot halverwege de maand kan het nog; daarna wordt de bodem te koud voor kieming.",
    11: "November: geen zaaimaand meer; jong gras redt de winter niet.",
    12: "December: winterrust voor het gazon; het volgende venster opent in april.",
  },
  en: {
    1: "January: not a sowing month; the soil is cold and wet. Plan the spring window.",
    2: "February: still too cold for grass seed; a good month to map the bare patches.",
    3: "March: on sandy soil late in the month is just about possible, but April is nearly always better.",
    4: "April: the spring window opens once the soil passes ten degrees.",
    5: "May: a fine sowing month; the earlier, the less trouble with early summer drought.",
    6: "June: still possible, but young grass struggles with the first heat; keep it moist.",
    7: "July: too hot and dry for sowing; without daily sprinkling the seedbed dries out.",
    8: "August: wait until the end of the month; then the best sowing window of the year begins.",
    9: "September: the best sowing month: warm soil, cooler air and autumn rain do the work.",
    10: "October: possible until mid-month; after that the soil turns too cold for germination.",
    11: "November: no longer a sowing month; young grass won't survive winter.",
    12: "December: winter rest for the lawn; the next window opens in April.",
  },
});

export const ZAAI_DEFAULTS = { klus: 0, sproeien: 0, grond: 0 };
// klus: 0 doorzaaien, 1 nieuw gazon. sproeien: 0 nee, 1 ja.
// grond: -1 zand, 0 gemengd, 1 klei.

/** In het zaaiseizoen? Zand rekt het voorjaar iets op, klei het najaar. */
export function inZaaiseizoen(d, grond = 0) {
  const m = d.getMonth() + 1;
  const dag = d.getDate();
  if (m === 4 || m === 5 || m === 9) return true;
  if (m === 3 && grond === -1 && dag >= 25) return true;
  if (m === 6 && dag <= 10) return true;
  if (m === 8 && dag >= 25) return true;
  if (m === 10) return dag <= (grond === 1 ? 20 : 15);
  return false;
}

export function overlay(hourly, nu = new Date(), instellingen = ZAAI_DEFAULTS) {
  const inst = { ...ZAAI_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const vandaagKey = dagKeyVan(nu);
  const alle = basis.filter((u) => u.datum >= vandaagKey);
  const datums = [...perDag.keys()].filter((d) => d >= vandaagKey).sort().slice(0, 5);

  const dagenUit = [];
  for (const datum of datums) {
    const dagUren = perDag.get(datum) ?? [];
    if (!dagUren.length) continue;
    const datumObj = new Date(`${datum}T12:00:00`);

    const gemEtmaal = Math.round(
      dagUren.reduce((a, u) => a + (u.gevoel ?? u.temp ?? 10), 0) / dagUren.length
    );
    const regenVandaag = dagUren.reduce((a, u) => a + (u.neerslag ?? 0), 0);
    const zwareBui = dagUren.some((u) => (u.neerslag ?? 0) >= 2.5);
    const gemWind = Math.round(dagUren.reduce((a, u) => a + (u.wind ?? 0), 0) / dagUren.length);
    const startIdx = alle.findIndex((u) => u.datum === datum);
    const komend = alle.slice(startIdx, startIdx + 72);
    const regenKomend = komend.reduce((a, u) => a + (u.neerslag ?? 0), 0);
    const maxGevoel = Math.max(...dagUren.map((u) => u.gevoel ?? u.temp ?? 0));

    const nieuw = inst.klus === 1;
    const factoren = [];
    let zin;
    if (!inZaaiseizoen(datumObj, inst.grond)) {
      factoren.push({ punten: 70, reden: T.redenSeizoen });
      zin = T.statusSeizoen;
    } else if (gemEtmaal < (nieuw ? 11 : 10)) {
      factoren.push({ punten: 55, reden: T.redenKoud(gemEtmaal) });
      zin = T.statusKoud(gemEtmaal);
    } else if (zwareBui || regenVandaag >= 6) {
      factoren.push({ punten: nieuw ? 55 : 48, reden: T.redenNat });
      zin = T.statusNatVandaag;
    } else if (gemWind >= 28) {
      factoren.push({ punten: 46, reden: T.redenWind(gemWind) });
      zin = T.statusWind(gemWind);
    } else if (regenKomend < 2 && maxGevoel >= 24 && inst.sproeien === 0) {
      factoren.push({ punten: nieuw ? 52 : 44, reden: T.redenDroog });
      zin = T.statusDroogHeet;
    } else {
      const zachteRegen = regenKomend >= 3 && !zwareBui;
      factoren.push({
        punten: zachteRegen ? 8 : 16,
        reden: zachteRegen ? T.redenRegenKomt : T.redenPrima,
      });
      if (regenKomend < 2 && inst.sproeien === 0) {
        factoren.push({ punten: 12, reden: T.redenDroog });
      }
      zin = zachteRegen ? T.statusIdeaal : T.statusGoed;
    }

    const { score, redenen } = maakScore(factoren);
    const conditie = { score, redenen, advies: adviesVoorScore(score, grasZaaien.adviesLabels) };
    const maandZin = MAAND_ZAAI[datumObj.getMonth() + 1];

    dagenUit.push({
      datum,
      antwoord: { ja: score < 45, zin },
      uren: dagUren.map((u) => ({
        uur: u.uur,
        score: (u.neerslag ?? 0) >= 2 ? 20 : (u.wind ?? 0) >= 28 ? 40 : 85,
        nat: (u.neerslag ?? 0) > 0.1,
      })),
      venster: null,
      metric: { zin: T.metricMaand(maandZin) },
      conditie,
      status: { soort: "info", zin },
    });
  }

  return { dagen: dagenUit };
}

export const grasZaaien = {
  id: "gras-zaaien",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#5A7D3C",
  locatieHint: T.locatieHint,
  icoon: "graszaad",
  categorieId: "tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: ZAAI_DEFAULTS },
  instellingen: {
    defaults: ZAAI_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "klus",
        vraag: T.instKlusVraag,
        keuzes: [
          { label: T.instKlusKeuzes[0], zet: { klus: 0 } },
          { label: T.instKlusKeuzes[1], zet: { klus: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "sproeien",
        vraag: T.instSproeiVraag,
        keuzes: [
          { label: T.instSproeiKeuzes[0], zet: { sproeien: 0 } },
          { label: T.instSproeiKeuzes[1], zet: { sproeien: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "grond",
        vraag: T.instGrondVraag,
        keuzes: [
          { label: T.instGrondKeuzes[0], zet: { grond: -1 } },
          { label: T.instGrondKeuzes[1], zet: { grond: 0 } },
          { label: T.instGrondKeuzes[2], zet: { grond: 1 } },
        ],
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
