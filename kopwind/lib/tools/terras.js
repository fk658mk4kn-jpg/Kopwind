/**
 * lib/tools/terras.js
 *
 * De terrascheck als overlay op de gedeelde weerbasis (Zephyr batch 1).
 * Diepte boven een kaal ja/nee: niet alleen of je op het terras kunt,
 * maar wanneer de beste uren zijn, of de zon er dan op staat en of de
 * wind is gaan liggen.
 *
 * Per uur een terrasscore 0..100 uit gevoelstemperatuur (de motor), wind
 * (aftrek richting je windgrens) en een zonbonus bij daglicht met weinig
 * bewolking; neerslag of een hoge buienkans maakt het uur ongeschikt.
 *
 * Conditie-ankers: 10 = 22 graden of meer gevoel, zon, zwak windje;
 * 7 = rond de 18 met wat bewolking; 5 = fris of stevige wind; laag = nat
 * of te koud. De status vertelt tijd-bewust wat je ermee kunt: "beste
 * terrasuren 15:00-18:00, met zon" of "vandaag wordt het niks, morgen
 * vanaf 14:00 wel".
 */

import { clamp, lerp, maakScore, adviesVoorScore } from "../engine/score.js";
import { jaVoor } from "../engine/schaal.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";

import { kies } from "../i18n/locale.js";

/** Alle teksten van de terrascheck, per taal. */
const T = kies({
  nl: {
    slug: "terrasweer",
    naam: "Kan ik vandaag op het terras zitten?",
    korteVraag: "Kan ik vandaag op het terras zitten?",
    meldingKort: "Terrascheck",
    cta: "Check het terras",
    navLabel: "Terras",
    diepte: "Zon, wind en temperatuur zonder gedoe.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Heerlijk terrasweer", goed: "Prima terrasweer", twijfelachtig: "Prima uit de wind", matig: "Alleen met jas", "zeer-slecht": "Geen terrasdag" },
    adviesLabels: { goed: "terrasweer", matig: "kan, met een vestje", slecht: "geen terrasweer" },
    legenda: { links: "binnen blijven", rechts: "terrasweer" },
    redenNat: "te nat voor het terras",
    redenFrisMax: (g) => `te fris (gevoel maximaal ${g} graden)`,
    redenGeenBlok: "geen bruikbaar blok (wind en buienkans zitten dwars)",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur)`,
    redenFris: (g) => `fris: gevoel komt niet boven de ${g} graden`,
    redenWind: (w) => `stevige wind (${w} km/u)`,
    redenBuien: "buien rond het beste blok",
    metric: (uur, g) => `Lekkerste moment rond ${uur}:00 (gevoel ${g} graden).`,
    morgenWel: (t) => ` Morgen vanaf ${t}:00 kan het wel.`,
    metZon: ", met zon",
    zonVanaf: (t) => `, zon vanaf ${t}:00`,
    windLigt: ", de wind is dan gaan liggen",
    statusBeste: (tijd, zon, wind) => `Beste terrasuren: ${tijd}${zon}${wind}.`,
    statusGeweest: "Het beste terrasweer is voor vandaag geweest.",
    statusNiks: "Vandaag wordt het niks op het terras.",
    toekomstBeste: (tijd) => `Beste blok: ${tijd}.`,
    toekomstGeen: "Geen terrasweer.",
    instGevoelVraag: "Wanneer vind jij het terrasweer?",
    instGevoelKeuzes: ["Ik zit er snel", "Gemiddeld", "Mag best warm zijn"],
    instWindVraag: "Hoeveel wind is ok\u00e9?",
    instWindKeuzes: ["Mijn plek ligt uit de wind", "Gemiddeld", "Snel te winderig"],
    instDagStart: "Terras open vanaf",
    instDagEind: "Terras dicht om",
    instUur: "uur",
    instUitleg:
      "Ideaal is 22 graden gevoel met zon en een zwak windje. Rond de 18 met wat bewolking is Goed, fris of vlagerig wordt Twijfelachtig. De statusregel noemt de beste uren.",
  },
  en: {
    slug: "patio-weather",
    naam: "Sit outside today?",
    korteVraag: "Sit outside today?",
    meldingKort: "Patio check",
    cta: "Check the patio",
    navLabel: "Patio",
    diepte: "Sun, wind and temperature, no fuss.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect patio weather", goed: "Good patio weather", twijfelachtig: "Fine out of the wind", matig: "Coat territory", "zeer-slecht": "Not a patio day" },
    adviesLabels: { goed: "patio weather", matig: "doable with a cardigan", slecht: "no patio weather" },
    legenda: { links: "stay inside", rechts: "patio weather" },
    redenNat: "too wet for sitting outside",
    redenFrisMax: (g) => `too chilly (feels like ${g} degrees at best)`,
    redenGeenBlok: "no usable window (wind and shower risk get in the way)",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short window (${u} hours)`,
    redenFris: (g) => `chilly: feels-like tops out at ${g} degrees`,
    redenWind: (w) => `strong wind (${w} km/h)`,
    redenBuien: "showers around the best window",
    metric: (uur, g) => `Nicest moment around ${uur}:00 (feels like ${g} degrees).`,
    morgenWel: (t) => ` Tomorrow from ${t}:00 works though.`,
    metZon: ", with sun",
    zonVanaf: (t) => `, sun from ${t}:00`,
    windLigt: ", the wind will have died down by then",
    statusBeste: (tijd, zon, wind) => `Best patio hours: ${tijd}${zon}${wind}.`,
    statusGeweest: "The best patio weather has been and gone today.",
    statusNiks: "The patio isn't happening today.",
    toekomstBeste: (tijd) => `Best window: ${tijd}.`,
    toekomstGeen: "No patio weather.",
    instGevoelVraag: "When does it count as patio weather for you?",
    instGevoelKeuzes: ["I'm out there early", "Average", "I like it properly warm"],
    instWindVraag: "How much wind is fine?",
    instWindKeuzes: ["My spot is sheltered", "Average", "Wind bothers me quickly"],
    instDagStart: "Patio opens at",
    instDagEind: "Patio closes at",
    instUur: "h",
    instUitleg:
      "Ideal is a feels-like of 22 degrees with sun and a light breeze. Around 18 with some cloud is Good; chilly or gusty comes out Iffy. The status line names the best hours.",
  },
});

export const TERRAS_DEFAULTS = {
  minGevoel: 16, // vanaf hier begint het lekker te worden
  maxWind: 22, // km/u, rond de 4 Bft; daarboven waait je biertje om
  dagStart: 10,
  dagEind: 22,
};

const MIN_VENSTER_UREN = 2;
const BRUIKBAAR_VANAF = 40; // uurscore waarboven een uur meetelt voor het venster

/** Terrasscore van een enkel basis-uur, 0..100. */
export function uurTerrasScore(u, inst = TERRAS_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.05 || (u.kans ?? 0) >= 60) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 10;
  const gevoelF = clamp(lerp(gevoel, inst.minGevoel - 6, 23, 0, 1), 0, 1);
  const wind = u.wind ?? 0;
  const windF = clamp(1 - Math.max(0, wind - inst.maxWind * 0.45) / (inst.maxWind * 1.4), 0.25, 1);
  const zon = u.dag && u.bewolking != null && u.bewolking <= 50 ? 12 : 0;
  return clamp(Math.round(88 * gevoelF * windF + zon), 0, 100);
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

export function overlay(hourly, nu = new Date(), instellingen = TERRAS_DEFAULTS) {
  const inst = { ...TERRAS_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, inst.dagStart, inst.dagEind);
  const vandaagKey = dagKeyVan(nu);

  const dagen = [];
  for (const [datum, dagUren] of perDag) {
    if (datum < vandaagKey) continue;
    const uren = dagUren.map((u) => ({
      ...u,
      score: uurTerrasScore(u, inst),
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
      if (maxGevoel < 18) {
        factoren.push({ punten: 8, reden: T.redenFris(Math.round(maxGevoel)) });
      }
      const gemWind = venster.blok.reduce((a, u) => a + (u.wind ?? 0), 0) / venster.uren;
      if (gemWind > inst.maxWind * 0.8) {
        factoren.push({ punten: 6, reden: T.redenWind(Math.round(gemWind)) });
      }
      if (natUren > 0) {
        factoren.push({ punten: 5, reden: T.redenBuien });
      }
    }
    const { score, redenen } = maakScore(factoren);
    const conditie = { score, redenen, advies: adviesVoorScore(score, terras.adviesLabels) };

    const isVandaag = datum === vandaagKey;
    const status = isVandaag ? statusVandaag(uren, nu, inst) : statusToekomst(venster);

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
        ? { zin: T.metric(String(top.uur).padStart(2, "0"), Math.round(top.gevoel)) }
        : null,
      conditie,
      status,
    };
  });

  if (dagenUit[0]?.status?.soort === "nee" && dagenUit[1]?.venster) {
    const v = dagenUit[1].venster;
    dagenUit[0].status.zin += T.morgenWel(String(v.van).padStart(2, "0"));
  }

  return {
    legenda: T.legenda,
    dagen: dagenUit,
  };
}

function zonStuk(blok) {
  const zonUren = blok.filter((u) => u.dag && u.bewolking != null && u.bewolking <= 50);
  if (!zonUren.length) return "";
  if (zonUren.length === blok.length) return T.metZon;
  return T.zonVanaf(String(zonUren[0].uur).padStart(2, "0"));
}

function statusVandaag(uren, nu, inst) {
  const resterend = uren.filter((u) => u.uur >= nu.getHours());
  const blok = besteBlok(resterend);
  if (!blok) {
    const eerder = besteBlok(uren);
    if (eerder && eerder.tot <= nu.getHours()) {
      return { soort: "nee", zin: T.statusGeweest };
    }
    return { soort: "nee", zin: T.statusNiks };
  }
  const tijd = `${String(Math.max(blok.van, nu.getHours())).padStart(2, "0")}:00-${String(blok.tot).padStart(2, "0")}:00`;
  const windDaalt =
    resterend.some((u) => u.uur < blok.van && (u.wind ?? 0) > inst.maxWind * 0.8) &&
    blok.blok.every((u) => (u.wind ?? 0) <= inst.maxWind * 0.8);
  return {
    soort: blok.van <= nu.getHours() ? "nu" : "later",
    zin: T.statusBeste(tijd, zonStuk(blok.blok), windDaalt ? T.windLigt : ""),
  };
}

function statusToekomst(venster) {
  if (!venster) return { soort: "nee", zin: T.toekomstGeen };
  return {
    soort: "info",
    zin: T.toekomstBeste(`${String(venster.van).padStart(2, "0")}:00-${String(venster.tot).padStart(2, "0")}:00`),
  };
}

export const terras = {
  id: "terras",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#B5691E",
  locatieHint: T.locatieHint,
  icoon: "parasol",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: TERRAS_DEFAULTS },
  instellingen: {
    defaults: TERRAS_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "gevoel",
        vraag: T.instGevoelVraag,
        keuzes: [
          { label: T.instGevoelKeuzes[0], zet: { minGevoel: 13 } },
          { label: T.instGevoelKeuzes[1], zet: { minGevoel: 16 } },
          { label: T.instGevoelKeuzes[2], zet: { minGevoel: 19 } },
        ],
      },
      {
        type: "keuze",
        id: "wind",
        vraag: T.instWindVraag,
        keuzes: [
          { label: T.instWindKeuzes[0], zet: { maxWind: 30 } },
          { label: T.instWindKeuzes[1], zet: { maxWind: 22 } },
          { label: T.instWindKeuzes[2], zet: { maxWind: 15 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 8, max: 14 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 16, max: 24 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-13",
  affiliate: null,
};
