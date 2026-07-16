/**
 * lib/tools/strandweer.js
 *
 * De strandcheck als overlay op de gedeelde weerbasis (v3.15.0
 * "Marin"). Strandweer vraagt meer dan zon: warm genoeg (gevoel rond de
 * 20 of hoger), niet te veel wind (boven windkracht 4 wordt het strand
 * een zandstraal) en een droog blok van een paar uur. De zon telt hier
 * zwaarder mee dan bij het terras, en de windgrens ligt lager omdat er
 * aan zee geen luwte is.
 *
 * Let op de kustregel: aan zee waait het vrijwel altijd een windkracht
 * harder dan landinwaarts. Zoek daarom op je badplaats zelf, of zet de
 * windgrens strenger als je een binnenlandse stad gebruikt.
 */

import { clamp, lerp, maakScore, adviesVoorScore } from "../engine/score.js";
import { jaVoor } from "../engine/schaal.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";

import { kies } from "../i18n/locale.js";

/** Alle teksten van de strandcheck, per taal. */
const T = kies({
  nl: {
    slug: "strandweer",
    naam: "Is het strandweer vandaag?",
    korteVraag: "Is het strandweer vandaag?",
    meldingKort: "Strandcheck",
    cta: "Check het strand",
    navLabel: "Strand",
    diepte: "Warmte, wind en zon voor een middag aan zee.",
    locatieHint: "Zoek je badplaats, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect strandweer", goed: "Prima strandweer", twijfelachtig: "Kan, in de luwte", matig: "Alleen voor wandelaars", "zeer-slecht": "Geen stranddag" },
    adviesLabels: { goed: "strandweer", matig: "kan, met een windscherm", slecht: "geen strandweer" },
    legenda: { links: "strand overslaan", rechts: "strandweer" },
    redenNat: "te nat voor het strand",
    redenFrisMax: (g) => `te fris voor het strand (gevoel maximaal ${g} graden)`,
    redenGeenBlok: "geen bruikbaar blok (wind of buien zitten dwars)",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur)`,
    redenFris: (g) => `fris voor het strand: gevoel komt niet boven de ${g} graden`,
    redenWind: (w) => `stevige wind (${w} km/u): stuivend zand`,
    redenBuien: "buien rond het beste blok",
    redenBewolkt: "weinig zon bij het beste blok",
    metric: (uur, g) => `Lekkerste stranduur rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima strandweer: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste stranduren: ${tijd}.`,
    statusGeweest: "Het beste strandweer is voor vandaag geweest.",
    statusNiks: "Vandaag wordt het niks op het strand.",
    toekomstBeste: (tijd) => `Beste strandblok: ${tijd}.`,
    toekomstGeen: "Geen strandweer.",
    instWarmVraag: "Wanneer is het jou warm genoeg?",
    instWarmKeuzes: ["Ik lig er snel", "Gemiddeld", "Alleen bij echt zomers weer"],
    instWindVraag: "Hoeveel wind is ok\u00e9?",
    instWindKeuzes: ["Ik zoek een duinpan op", "Gemiddeld", "Stuifzand verpest het snel"],
    instDagStart: "Vroegste strandtijd",
    instDagEind: "Laatste strandtijd",
    instUur: "uur",
    instUitleg:
      "Ideaal strandweer is 22 graden gevoel of meer met zon en weinig wind. Boven windkracht 4 gaat het zand stuiven; de windgrens ligt daarom lager dan bij het terras. Zoek op je badplaats zelf: aan zee waait het vrijwel altijd een windkracht harder dan landinwaarts.",
  },
  en: {
    slug: "beach-weather",
    naam: "Beach weather today?",
    korteVraag: "Beach weather today?",
    meldingKort: "Beach check",
    cta: "Check the beach",
    navLabel: "Beach",
    diepte: "Warmth, wind and sun for an afternoon at the seaside.",
    locatieHint: "Search your seaside town, that's enough...",
    schaalLabels: { ideaal: "Perfect beach weather", goed: "Good beach weather", twijfelachtig: "Doable, find shelter", matig: "Walkers only", "zeer-slecht": "Not a beach day" },
    adviesLabels: { goed: "beach weather", matig: "doable with a windbreak", slecht: "no beach weather" },
    legenda: { links: "skip the beach", rechts: "beach weather" },
    redenNat: "too wet for the beach",
    redenFrisMax: (g) => `too chilly for the beach (feels like ${g} degrees at best)`,
    redenGeenBlok: "no usable window (wind or showers get in the way)",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short window (${u} hours)`,
    redenFris: (g) => `chilly for the beach: feels-like tops out at ${g} degrees`,
    redenWind: (w) => `strong wind (${w} km/h): flying sand`,
    redenBuien: "showers around the best window",
    redenBewolkt: "little sun during the best window",
    metric: (uur, g) => `Nicest beach hour around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good beach weather right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best beach hours: ${tijd}.`,
    statusGeweest: "The best beach weather has been and gone today.",
    statusNiks: "The beach isn't happening today.",
    toekomstBeste: (tijd) => `Best beach window: ${tijd}.`,
    toekomstGeen: "No beach weather.",
    instWarmVraag: "When is it warm enough for you?",
    instWarmKeuzes: ["I'm on the sand early", "Average", "Only in proper summer weather"],
    instWindVraag: "How much wind is fine?",
    instWindKeuzes: ["I find a sheltered spot", "Average", "Flying sand ruins it fast"],
    instDagStart: "Earliest beach time",
    instDagEind: "Latest beach time",
    instUur: "h",
    instUitleg:
      "Ideal beach weather is a feels-like of 22 degrees or more with sun and little wind. Above wind force 4 the sand starts to fly, so the wind limit sits lower than for the patio. Search your seaside town itself: at the coast the wind is almost always one force stronger than inland.",
  },
});

export const STRAND_DEFAULTS = {
  minGevoel: 19, // vanaf hier wordt liggen prettig
  maxWind: 20, // km/u; boven kracht 4 stuift het zand
  dagStart: 10,
  dagEind: 20,
};

const MIN_VENSTER_UREN = 2;
const BRUIKBAAR_VANAF = 40;

/** Strandscore van een enkel basis-uur, 0..100. */
export function uurStrandScore(u, inst = STRAND_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.05 || (u.kans ?? 0) >= 55) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 10;
  const gevoelF = clamp(lerp(gevoel, inst.minGevoel - 4, 26, 0, 1), 0, 1);
  const wind = u.wind ?? 0;
  const windF = clamp(1 - Math.max(0, wind - inst.maxWind * 0.4) / (inst.maxWind * 1.2), 0.15, 1);
  const zon = u.dag && u.bewolking != null ? (u.bewolking <= 40 ? 16 : u.bewolking <= 70 ? 6 : 0) : 0;
  return clamp(Math.round(84 * gevoelF * windF + zon), 0, 100);
}

function besteBlok(uren) {
  const blokken = [];
  let blok = [];
  for (const u of uren) {
    if (u.score >= BRUIKBAAR_VANAF) {
      blok.push(u);
    } else if (blok.length) {
      blokken.push(blok);
      blok = [];
    }
  }
  if (blok.length) blokken.push(blok);
  let beste = null;
  for (const b of blokken) {
    if (b.length < MIN_VENSTER_UREN) continue;
    const gemiddeld = b.reduce((a, u) => a + u.score, 0) / b.length;
    if (!beste || gemiddeld * b.length > beste.gemiddeld * beste.uren) {
      beste = { van: b[0].uur, tot: b[b.length - 1].uur + 1, uren: b.length, gemiddeld, blok: b };
    }
  }
  return beste;
}

function topPijn(gemiddeld) {
  const ANKERS = [
    [85, 0],
    [72, 8],
    [58, 20],
    [45, 35],
    [30, 52],
  ];
  if (gemiddeld >= ANKERS[0][0]) return 0;
  for (let i = 0; i < ANKERS.length - 1; i++) {
    const [x1, y1] = ANKERS[i];
    const [x0, y0] = ANKERS[i + 1];
    if (gemiddeld >= x0) return Math.round(lerp(gemiddeld, x0, x1, y0, y1));
  }
  return 55;
}

const pad2 = (n) => String(n).padStart(2, "0");

function statusVandaag(venster, nu) {
  if (!venster) return { soort: "nee", zin: T.statusNiks };
  const uurNu = nu.getHours();
  const tijd = `${pad2(venster.van)}:00-${pad2(venster.tot)}:00`;
  if (uurNu >= venster.tot) return { soort: "geweest", zin: T.statusGeweest };
  if (uurNu >= venster.van) return { soort: "nu", zin: T.statusNu(`${pad2(venster.tot)}:00`) };
  return { soort: "later", zin: T.statusBeste(tijd) };
}

function statusToekomst(venster) {
  if (!venster) return { soort: "nee", zin: T.toekomstGeen };
  return {
    soort: "info",
    zin: T.toekomstBeste(`${pad2(venster.van)}:00-${pad2(venster.tot)}:00`),
  };
}

export function overlay(hourly, nu = new Date(), instellingen = STRAND_DEFAULTS) {
  const inst = { ...STRAND_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, inst.dagStart, inst.dagEind);
  const vandaagKey = dagKeyVan(nu);

  const dagen = [];
  for (const [datum, dagUren] of perDag) {
    if (datum < vandaagKey) continue;
    const uren = dagUren.map((u) => ({
      ...u,
      score: uurStrandScore(u, inst),
      nat: (u.neerslag ?? 0) > 0.05,
    }));
    dagen.push({ datum, uren });
  }
  dagen.sort((a, b) => (a.datum < b.datum ? -1 : 1));

  const dagenUit = dagen.slice(0, 5).map(({ datum, uren }) => {
    const venster = besteBlok(uren);
    const maxGevoel = Math.max(...uren.map((u) => u.gevoel ?? -99));
    const natUren = uren.filter((u) => u.nat).length;

    const factoren = [];
    if (!venster) {
      const regent = natUren > 0;
      factoren.push({
        punten: 72,
        reden: regent
          ? T.redenNat
          : maxGevoel < inst.minGevoel
            ? T.redenFrisMax(Math.round(maxGevoel))
            : T.redenGeenBlok,
      });
      if (maxGevoel < inst.minGevoel - 5) factoren.push({ punten: 10, reden: null });
    } else {
      const blokGevoel = Math.round(venster.blok.reduce((a, u) => a + (u.gevoel ?? u.temp ?? 0), 0) / venster.uren);
      const blokWind = Math.round(venster.blok.reduce((a, u) => a + (u.wind ?? 0), 0) / venster.uren);
      const kwaliteit = topPijn(venster.gemiddeld);
      factoren.push({ punten: kwaliteit, reden: kwaliteit >= 18 ? T.redenMatigBlok(blokGevoel, blokWind) : null });
      factoren.push({
        punten: Math.round(lerp(venster.uren, 6, 2, 0, 20)),
        reden: venster.uren <= 3 ? T.redenKortBlok(venster.uren) : null,
      });
      if (maxGevoel < inst.minGevoel + 2) {
        factoren.push({ punten: 8, reden: T.redenFris(Math.round(maxGevoel)) });
      }
      const gemWind = venster.blok.reduce((a, u) => a + (u.wind ?? 0), 0) / venster.uren;
      if (gemWind > inst.maxWind * 0.75) {
        factoren.push({ punten: 8, reden: T.redenWind(Math.round(gemWind)) });
      }
      const gemBewolking = venster.blok.reduce((a, u) => a + (u.bewolking ?? 50), 0) / venster.uren;
      if (gemBewolking > 70) {
        factoren.push({ punten: 6, reden: T.redenBewolkt });
      }
      if (natUren > 0) {
        factoren.push({ punten: 5, reden: T.redenBuien });
      }
    }
    const { score, redenen } = maakScore(factoren);
    const conditie = { score, redenen, advies: adviesVoorScore(score, strandweer.adviesLabels) };

    const isVandaag = datum === vandaagKey;
    const status = isVandaag ? statusVandaag(venster, nu) : statusToekomst(venster);

    const top = venster
      ? venster.blok.reduce((a, u) => (u.score > a.score ? u : a), venster.blok[0])
      : null;

    const antwoord = {
      ja: isVandaag
        ? ["nu", "later"].includes(status.soort)
        : status.soort === "info" && jaVoor(score),
      zin: status.zin,
    };

    return {
      datum,
      antwoord,
      uren: uren.map((u) => ({ uur: u.uur, score: u.score, nat: u.nat })),
      venster: venster ? { van: venster.van, tot: venster.tot, uren: venster.uren } : null,
      metric: top
        ? { zin: T.metric(pad2(top.uur), Math.round(top.gevoel ?? top.temp ?? 0)) }
        : null,
      conditie,
      status,
    };
  });

  return { dagen: dagenUit };
}

export const strandweer = {
  id: "strandweer",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#C24E3F",
  locatieHint: T.locatieHint,
  icoon: "strandbal",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: STRAND_DEFAULTS },
  instellingen: {
    defaults: STRAND_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "warmte",
        vraag: T.instWarmVraag,
        keuzes: [
          { label: T.instWarmKeuzes[0], zet: { minGevoel: 17 } },
          { label: T.instWarmKeuzes[1], zet: { minGevoel: 19 } },
          { label: T.instWarmKeuzes[2], zet: { minGevoel: 22 } },
        ],
      },
      {
        type: "keuze",
        id: "wind",
        vraag: T.instWindVraag,
        keuzes: [
          { label: T.instWindKeuzes[0], zet: { maxWind: 25 } },
          { label: T.instWindKeuzes[1], zet: { maxWind: 20 } },
          { label: T.instWindKeuzes[2], zet: { maxWind: 15 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 8, max: 14 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 16, max: 22 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-16",
  affiliate: null,
};
