/**
 * lib/tools/fiets-naar-werk.js
 *
 * De vlaggendrager als registerconfiguratie. De diepe route/wind/keten-
 * logica blijft in lib/planner.js en lib/advice.js (goed getest); deze
 * config koppelt hem aan het register zodat pagina's, meldingen en SEO
 * hem op dezelfde manier behandelen als elke andere tool.
 */

import { kies } from "../i18n/locale.js";
import { DEFAULT_THRESHOLDS } from "../advice.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { clamp } from "../engine/score.js";

const REGIO_T = kies({
  nl: {
    droog: (w) => `Rustig fietsweer in de spits (wind rond ${w} km/u).`,
    wind: (w) => `Stevige wind in de spits (${w} km/u): reken op merkbare tegenwind op open stukken.`,
    nat: (uur) => `Rond ${uur}:00 valt regen in de spits: regenjas mee of vertrek plannen.`,
    natEnWind: (w, uur) => `Pittige spits: wind rond ${w} km/u en regen rond ${uur}:00.`,
    koud: (g) => `Koud in de ochtendspits (gevoel ${g} graden): handschoenen zijn geen luxe.`,
    voorbij: "De spitsen zijn voor vandaag geweest.",
    redenWind: (w) => `wind rond ${w} km/u in de spits`,
    redenNat: (uur) => `regen rond ${uur}:00`,
    redenKoud: (g) => `gevoel ${g} graden in de ochtend`,
    redenRustig: "weinig wind en droog in de spitsuren",
  },
  en: {
    droog: (w) => `Calm cycling weather at rush hour (wind around ${w} km/h).`,
    wind: (w) => `Strong wind at rush hour (${w} km/h): expect a real headwind on open stretches.`,
    nat: (uur) => `Rain falls around ${uur}:00 in the rush: pack a rain jacket or plan around it.`,
    natEnWind: (w, uur) => `A tough rush hour: wind around ${w} km/h and rain around ${uur}:00.`,
    koud: (g) => `Cold in the morning rush (feels like ${g} degrees): gloves are no luxury.`,
    voorbij: "Today's rush hours have been and gone.",
    redenWind: (w) => `wind around ${w} km/h at rush hour`,
    redenNat: (uur) => `rain around ${uur}:00`,
    redenKoud: (g) => `feels like ${g} degrees in the morning`,
    redenRustig: "little wind and dry during rush hours",
  },
});

/**
 * Regio-dagverdict (v3.27.0 "Solano", akkoord eigenaar): een locatie-
 * gebaseerd fietsoordeel ZONDER route, voor drie plekken die de
 * routecheck nooit kon bedienen: de statusstip op home en
 * alle-keuzehulpen, het server-antwoordblok op de stadpagina's, en
 * meldingen. Geen rijrichting (die vraagt een route; de kaarttool
 * hieronder doet dat), wel de essentie van forenzen: hoe zijn de
 * SPITSEN. Ochtendspits 7-9 en avondspits 16-19; de zwaarste telt,
 * consistent met dagAdvies ("de zwaarste rit bepaalt"). Score is
 * pijn (0..100).
 */
function spitsPijn(uren) {
  if (!uren.length) return null;
  const gemWind = uren.reduce((a, u) => a + (u.wind ?? 0), 0) / uren.length;
  const nat = uren.find((u) => (u.neerslag ?? 0) >= 0.2 || (u.kans ?? 0) >= 60) ?? null;
  const minGevoel = Math.min(...uren.map((u) => u.gevoel ?? u.temp ?? 15));
  let pijn = clamp(Math.round((gemWind - 15) * 1.8), 0, 40);
  if (nat) pijn += 28;
  if (minGevoel < 0) pijn += 18;
  else if (minGevoel < 5) pijn += 8;
  return { pijn: clamp(pijn, 0, 100), gemWind: Math.round(gemWind), nat, minGevoel: Math.round(minGevoel) };
}

export function regioOverlay(hourly, nu = new Date()) {
  const alle = bouwBasis(hourly);
  const vandaagKey = dagKeyVan(nu);
  const dagenUit = [];
  const datums = [...basisPerDag(alle, 0, 24).keys()].filter((d) => d >= vandaagKey).sort().slice(0, 5);
  const perOchtend = basisPerDag(alle, 7, 10);
  const perAvond = basisPerDag(alle, 16, 19);
  for (const datum of datums) {
    const isVandaag = datum === vandaagKey;
    const uurNu = isVandaag ? nu.getHours() : 0;
    const ochtend = (perOchtend.get(datum) ?? []).filter((u) => u.uur >= uurNu);
    const avond = (perAvond.get(datum) ?? []).filter((u) => u.uur >= uurNu);
    const o = spitsPijn(ochtend);
    const a = spitsPijn(avond);
    if (!o && !a) {
      if (isVandaag) {
        dagenUit.push({
          datum,
          antwoord: { ja: null, zin: REGIO_T.voorbij },
          conditie: { score: 30, redenen: [] },
          status: { soort: "nee", zin: REGIO_T.voorbij },
        });
      }
      continue;
    }
    const zwaarste = !a || (o && o.pijn >= a.pijn) ? o : a;
    const score = zwaarste.pijn;
    const redenen = [];
    let zin;
    const natUur = zwaarste.nat ? String(zwaarste.nat.uur).padStart(2, "0") : null;
    if (zwaarste.nat && zwaarste.gemWind >= 25) {
      zin = REGIO_T.natEnWind(zwaarste.gemWind, natUur);
      redenen.push(REGIO_T.redenWind(zwaarste.gemWind), REGIO_T.redenNat(natUur));
    } else if (zwaarste.nat) {
      zin = REGIO_T.nat(natUur);
      redenen.push(REGIO_T.redenNat(natUur));
    } else if (zwaarste.gemWind >= 25) {
      zin = REGIO_T.wind(zwaarste.gemWind);
      redenen.push(REGIO_T.redenWind(zwaarste.gemWind));
    } else if (o && o.minGevoel < 5) {
      zin = REGIO_T.koud(o.minGevoel);
      redenen.push(REGIO_T.redenKoud(o.minGevoel));
    } else {
      zin = REGIO_T.droog(zwaarste.gemWind);
      redenen.push(REGIO_T.redenRustig);
    }
    dagenUit.push({
      datum,
      antwoord: { ja: score < 45, zin },
      conditie: { score, redenen },
      status: { soort: "info", zin },
    });
  }
  return { dagen: dagenUit };
}

export const fietsNaarWerk = {
  id: "fiets-naar-werk",
  slug: kies({ nl: "fietsen-naar-werk", en: "bike-to-work" }),
  naam: kies({ nl: "Kan ik vandaag fietsen naar werk?", en: "Bike to work today?" }),
  meldingKort: kies({ nl: "Fietscheck", en: "Bike check" }),
  cta: kies({ nl: "Check de rit", en: "Check the ride" }),
  navLabel: kies({ nl: "Fietsen", en: "Cycling" }),
  kleur: "#2F7D62",
  icoon: "fiets",
  categorieId: "sport",
  diepte: kies({ nl: "Wind, regen en het beste vertrekmoment voor jouw rit.", en: "Wind, rain and the best time to set off." }),
  // Rit-labels (v3.26.0, feedback): een losse etappe is geen "fietsdag".
  // LegCard en de dagbanner-bij-een-rit gebruiken deze set; de
  // dag-schaalLabels hieronder blijven voor het dagoverkoepelende advies.
  ritSchaalLabels: kies({
    nl: { ideaal: "Ideaal voor deze rit", goed: "Goed te doen", twijfelachtig: "Twijfelachtig", matig: "Pittig maar te doen", "zeer-slecht": "Liever niet" },
    en: { ideaal: "Ideal for this leg", goed: "Good to go", twijfelachtig: "Iffy", matig: "Tough but doable", "zeer-slecht": "Better not" },
  }),
  schaalLabels: kies({
    nl: { ideaal: "Ideale fietsdag", goed: "Goed te doen", twijfelachtig: "Twijfelachtig", matig: "Liever later", "zeer-slecht": "Beter van niet" },
    en: { ideaal: "Ideal bike day", goed: "Good to go", twijfelachtig: "Iffy", matig: "Better later", "zeer-slecht": "Give it a miss" },
  }),
  vervoer: ["fiets"],
  korteVraag: kies({ nl: "Kan ik vandaag fietsen naar werk?", en: "Bike to work today?" }),
  patroon: "A",
  inputType: "route",
  weerVelden: [
    "temperature_2m",
    "apparent_temperature",
    "precipitation",
    "precipitation_probability",
    "wind_speed_10m",
    "wind_direction_10m",
    "wind_gusts_10m",
  ],
  scoreConfig: { thresholds: DEFAULT_THRESHOLDS },
  instellingen: {
    defaults: DEFAULT_THRESHOLDS,
    velden: [
      {
        type: "keuze",
        id: "wind",
        vraag: kies({ nl: "Hoe gevoelig ben je voor wind?", en: "How much does wind bother you?" }),
        keuzes: [
          { label: kies({ nl: "Nauwelijks", en: "Hardly" }), zet: { tegenwindMatig: 18, tegenwindZwaar: 30 } },
          { label: kies({ nl: "Gemiddeld", en: "Average" }), zet: { tegenwindMatig: 12, tegenwindZwaar: 22 } },
          { label: kies({ nl: "Best snel", en: "Quite quickly" }), zet: { tegenwindMatig: 8, tegenwindZwaar: 16 } },
        ],
      },
      {
        type: "keuze",
        id: "regen",
        vraag: kies({ nl: "Wanneer is regen voor jou te veel?", en: "When is rain too much for you?" }),
        keuzes: [
          { label: kies({ nl: "Paar druppels prima", en: "A few drops are fine" }), zet: { neerslagKans: 75, neerslagMm: 1.6 } },
          { label: kies({ nl: "Motregen is ok\u00e9", en: "Drizzle is okay" }), zet: { neerslagKans: 60, neerslagMm: 1.0 } },
          { label: kies({ nl: "Ik wil droog blijven", en: "I want to stay dry" }), zet: { neerslagKans: 45, neerslagMm: 0.5 } },
        ],
      },
      {
        type: "keuze",
        id: "kou",
        vraag: kies({ nl: "Wanneer is het te koud?", en: "When is it too cold?" }),
        keuzes: [
          { label: kies({ nl: "Ik fiets altijd door", en: "I ride through anything" }), zet: { gevoelMin: -8 } },
          { label: kies({ nl: "Onder nul wordt het guur", en: "Below zero gets grim" }), zet: { gevoelMin: 0 } },
          { label: kies({ nl: "Snel te koud", en: "Cold gets me quickly" }), zet: { gevoelMin: 5 } },
        ],
      },
      { key: "segmentLengte", label: kies({ nl: "Segmentlengte", en: "Segment length" }), eenheid: "m", step: 50, geavanceerd: true },
    ],
    uitleg: kies({
      nl: "Goed te doen is droog met hooguit merkbare tegenwind; Liever later betekent stevige wind of serieuze buienkans. Met deze keuzes bepaal je waar die grenzen voor jou liggen.",
      en: "Good to go means dry with at most noticeable headwind; Better later means strong wind or a serious shower risk. These choices set where those lines sit for you.",
    }),
  },
  adviesLabels: kies({
    nl: { goed: "prima fietsdag", matig: "pittige rit", slecht: "liever niet fietsen" },
    en: { goed: "fine bike day", matig: "tough ride", slecht: "rather not bike" },
  }),
  // Regio-verdict voor stip, stadblok en meldingen (v3.27.0); de
  // toolpagina zelf blijft de routecheck (inputType route wint in de
  // renderketen van page.js).
  weerVelden: BASIS_VELDEN,
  overlay: regioOverlay,
  bijgewerkt: "2026-07-13",
  affiliate: null,
};
