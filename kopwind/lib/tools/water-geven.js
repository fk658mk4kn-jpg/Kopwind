/**
 * lib/tools/water-geven.js
 *
 * De gietcheck (v3.28.0 "Ostria"). De vraag is omgekeerd aan de meeste
 * checks: het beste antwoord is vaak NEE. Komt er binnen anderhalve
 * dag serieuze regen, dan doet die het werk en bespaart de check
 * water, tijd en geld. Moet er wel gegoten worden, dan is het moment
 * het halve advies: in de ochtend of avond verdampt het water niet
 * meteen en krijgen de wortels het echt. De score is urgentie als
 * pijn: regen op komst is ideaal (niets doen), een hete droge dag
 * duwt richting "vanavond gieten".
 *
 * Zonder bodemvochtdata blijft dit een weerredenering: regen vooruit,
 * hitte en wind (die droogt mee). De instellingen verschuiven de
 * drempels: potten drogen sneller dan borders, en een gazon mag bij
 * droogte gewoon geel worden. Affiliate null (gepauzeerd).
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "water-geven",
    naam: "Moet ik vandaag water geven?",
    korteVraag: "Moet ik de planten water geven?",
    meldingKort: "Gietcheck",
    cta: "Check de gieter",
    navLabel: "Water geven",
    diepte: "Regen op komst, hitte en wind gewogen: gieten, of doet de regen het werk?",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Regen doet het werk", goed: "Alleen de potten", twijfelachtig: "Pas geplant? Geef water", matig: "Vanavond gieten", "zeer-slecht": "Gieter verplicht" },
    adviesLabels: { goed: "de regen regelt het", matig: "potten en pas geplant", slecht: "vanavond gieten" },
    legenda: { links: "gieten", rechts: "regen regelt het" },
    statusRegen: (mm) => `Niet gieten: er komt zo'n ${mm} mm regen aan, die doet het werk voor je.`,
    statusBeetjeRegen: (mm) => `Alleen de potten en wat pas geplant is: er komt rond ${mm} mm regen, voor de borders is dat genoeg.`,
    statusMild: "Geen giethaast: geef alleen potten en pas geplante planten wat water.",
    statusDroog: "Vanavond gieten: het blijft droog en de tuin verdampt vandaag flink.",
    statusHeet: (g) => `Gieter verplicht: heet (gevoel ${g} graden) en geen regen in zicht. Geef ruim water, liefst vanavond.`,
    redenRegenKomt: (mm) => `er komt ${mm} mm regen aan`,
    redenDroog: "geen regen van betekenis in anderhalve dag",
    redenHeet: (g) => `heet en droog (gevoel tot ${g} graden)`,
    redenWind: "de wind droogt de tuin extra uit",
    metricAvond: "Beste moment: vanavond na 19:00, dan verdampt het water niet meteen.",
    metricOchtend: "Beste moment: morgenochtend voor 9:00, dan kan het water de grond in voor de zon er staat.",
    instTuinVraag: "Hoe snel droogt jouw tuin uit?",
    instTuinKeuzes: ["Veel schaduw of klei", "Gemiddeld", "Volle zon op zandgrond"],
    instMomentVraag: "Wanneer geef je het liefst water?",
    instMomentKeuzes: ["'s Ochtends vroeg", "'s Avonds"],
    instWatVraag: "Wat water je vooral?",
    instWatKeuzes: ["Vooral potten en bakken", "Borders en potten", "Vooral het gazon"],
    instUitleg:
      "De check kijkt anderhalve dag vooruit: komt er serieuze regen, dan hoef je niet te gieten. Potten drogen sneller uit dan borders en tellen strenger; een gazon mag bij droogte geel worden en telt juist milder. De momentregel blijft altijd: ochtend of avond, niet in de volle zon.",
  },
  en: {
    slug: "watering",
    naam: "Should I water the garden today?",
    korteVraag: "Should I water the plants?",
    meldingKort: "Watering check",
    cta: "Check the watering can",
    navLabel: "Watering",
    diepte: "Rain ahead, heat and wind weighed: water now, or does the rain do the work?",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Rain does the work", goed: "Pots only", twijfelachtig: "Just planted? Water it", matig: "Water tonight", "zeer-slecht": "Watering can required" },
    adviesLabels: { goed: "the rain sorts it", matig: "pots and new plantings", slecht: "water tonight" },
    legenda: { links: "water", rechts: "rain sorts it" },
    statusRegen: (mm) => `Don't water: about ${mm} mm of rain is coming, it does the work for you.`,
    statusBeetjeRegen: (mm) => `Only pots and recent plantings: around ${mm} mm of rain is coming, enough for the borders.`,
    statusMild: "No watering rush: give only pots and recent plantings a drink.",
    statusDroog: "Water tonight: it stays dry and the garden loses plenty today.",
    statusHeet: (g) => `Watering can required: hot (feels like ${g} degrees) and no rain in sight. Water generously, preferably tonight.`,
    redenRegenKomt: (mm) => `${mm} mm of rain is on the way`,
    redenDroog: "no meaningful rain within a day and a half",
    redenHeet: (g) => `hot and dry (feels like up to ${g} degrees)`,
    redenWind: "the wind dries the garden further",
    metricAvond: "Best moment: tonight after 19:00, so the water doesn't evaporate on the spot.",
    metricOchtend: "Best moment: tomorrow morning before 9:00, so the water soaks in before the sun arrives.",
    instTuinVraag: "How fast does your garden dry out?",
    instTuinKeuzes: ["Lots of shade or clay", "Average", "Full sun on sandy soil"],
    instMomentVraag: "When do you prefer to water?",
    instMomentKeuzes: ["Early morning", "In the evening"],
    instWatVraag: "What do you mostly water?",
    instWatKeuzes: ["Mostly pots and planters", "Borders and pots", "Mostly the lawn"],
    instUitleg:
      "The check looks a day and a half ahead: with serious rain coming you don't need to water. Pots dry out faster than borders and count stricter; a lawn may yellow in drought and counts milder. The timing rule always stands: morning or evening, never in full sun.",
  },
});

export const WATER_DEFAULTS = { tuintype: 0, moment: 1, wat: 0 };
// tuintype: -1 schaduw/klei, 0 gemiddeld, 1 volle zon op zand.
// moment: 0 ochtend, 1 avond. wat: -1 potten, 0 borders, 1 gazon.

export function overlay(hourly, nu = new Date(), instellingen = WATER_DEFAULTS) {
  const inst = { ...WATER_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const vandaagKey = dagKeyVan(nu);

  // Doorlopende urenlijst voor de vooruitblik over daggrenzen heen.
  const alle = basis.filter((u) => u.datum >= vandaagKey);
  const datums = [...new Set(alle.map((u) => u.datum))].sort().slice(0, 5);

  const dagenUit = [];
  for (const datum of datums) {
    const isVandaag = datum === vandaagKey;
    const startIdx = alle.findIndex(
      (u) => u.datum === datum && (!isVandaag || u.uur >= nu.getHours())
    );
    if (startIdx === -1) continue;
    const blik = alle.slice(startIdx, startIdx + 36);
    if (blik.length < 6) continue;
    const dagUren = alle.filter((u) => u.datum === datum);

    const regenKomend = Math.round(blik.reduce((a, u) => a + (u.neerslag ?? 0), 0) * 10) / 10;
    const maxGevoel = Math.round(Math.max(...dagUren.map((u) => u.gevoel ?? u.temp ?? 0)));
    const gemWind = dagUren.reduce((a, u) => a + (u.wind ?? 0), 0) / Math.max(dagUren.length, 1);

    let pijn;
    const factoren = [];
    let zin;
    if (regenKomend >= 5) {
      pijn = 10;
      zin = T.statusRegen(Math.round(regenKomend));
      factoren.push({ punten: pijn, reden: T.redenRegenKomt(Math.round(regenKomend)) });
    } else if (regenKomend >= 2) {
      pijn = 24;
      zin = T.statusBeetjeRegen(Math.round(regenKomend));
      factoren.push({ punten: pijn, reden: T.redenRegenKomt(Math.round(regenKomend)) });
    } else {
      pijn = 35 + clamp((maxGevoel - 22) * 2.2, 0, 28);
      const heet = maxGevoel >= 27;
      factoren.push({
        punten: Math.round(pijn),
        reden: heet ? T.redenHeet(maxGevoel) : T.redenDroog,
      });
      if (gemWind >= 18) {
        pijn += 6;
        factoren.push({ punten: 6, reden: T.redenWind });
      }
      // Zin en schaal rijmen: "gieter verplicht" pas op zeer-slecht
      // niveau, daaronder "vanavond gieten".
      zin = pijn >= 62 ? T.statusHeet(maxGevoel) : pijn >= 45 ? T.statusDroog : T.statusMild;
    }
    // Tuintype en wat-je-watert verschuiven de urgentie.
    pijn += inst.tuintype * 6;
    pijn += inst.wat === -1 ? 8 : inst.wat === 1 ? -8 : 0;
    pijn = clamp(Math.round(pijn), 0, 100);

    // De redenen komen uit de factoren; de score is de verschoven pijn
    // (tuintype en wat-je-watert zitten niet in de factorpunten, wel in
    // het eindcijfer).
    const { redenen } = maakScore(factoren);
    const conditie = { score: pijn, redenen, advies: adviesVoorScore(pijn, waterGeven.adviesLabels) };

    const metric = pijn >= 30 ? { zin: inst.moment === 1 ? T.metricAvond : T.metricOchtend } : null;

    dagenUit.push({
      datum,
      antwoord: { ja: pijn >= 45, zin },
      uren: dagUren.map((u) => ({
        uur: u.uur,
        score: (u.neerslag ?? 0) > 0.1 ? 95 : (u.gevoel ?? u.temp ?? 15) >= 27 ? 25 : 70,
        nat: (u.neerslag ?? 0) > 0.1,
      })),
      venster: null,
      metric,
      conditie,
      status: { soort: "info", zin },
    });
  }

  return { dagen: dagenUit };
}

export const waterGeven = {
  id: "water-geven",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#5A7D3C",
  locatieHint: T.locatieHint,
  icoon: "gieter",
  categorieId: "tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: WATER_DEFAULTS },
  instellingen: {
    defaults: WATER_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "tuintype",
        vraag: T.instTuinVraag,
        keuzes: [
          { label: T.instTuinKeuzes[0], zet: { tuintype: -1 } },
          { label: T.instTuinKeuzes[1], zet: { tuintype: 0 } },
          { label: T.instTuinKeuzes[2], zet: { tuintype: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "moment",
        vraag: T.instMomentVraag,
        keuzes: [
          { label: T.instMomentKeuzes[0], zet: { moment: 0 } },
          { label: T.instMomentKeuzes[1], zet: { moment: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "wat",
        vraag: T.instWatVraag,
        keuzes: [
          { label: T.instWatKeuzes[0], zet: { wat: -1 } },
          { label: T.instWatKeuzes[1], zet: { wat: 0 } },
          { label: T.instWatKeuzes[2], zet: { wat: 1 } },
        ],
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
