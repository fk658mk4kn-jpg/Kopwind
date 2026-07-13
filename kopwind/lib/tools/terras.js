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
          ? "te nat voor het terras"
          : maxGevoel < inst.minGevoel
            ? `te fris (gevoel maximaal ${Math.round(maxGevoel)} graden)`
            : "geen bruikbaar blok (wind en buienkans zitten dwars)",
      });
      if (maxGevoel < inst.minGevoel - 5) factoren.push({ punten: 10, reden: null });
    } else {
      factoren.push({ punten: topPijn(venster.gemiddeld), reden: null });
      factoren.push({
        punten: Math.round(lerp(venster.uren, 6, 2, 0, 20)),
        reden: venster.uren <= 3 ? `maar een kort blok (${venster.uren} uur)` : null,
      });
      if (maxGevoel < 18) {
        factoren.push({ punten: 8, reden: `fris: gevoel komt niet boven de ${Math.round(maxGevoel)} graden` });
      }
      const gemWind = venster.blok.reduce((a, u) => a + (u.wind ?? 0), 0) / venster.uren;
      if (gemWind > inst.maxWind * 0.8) {
        factoren.push({ punten: 6, reden: `stevige wind (${Math.round(gemWind)} km/u)` });
      }
      if (natUren > 0) {
        factoren.push({ punten: 5, reden: "buien rond het beste blok" });
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
        ? { zin: `Lekkerste moment rond ${String(top.uur).padStart(2, "0")}:00 (gevoel ${Math.round(top.gevoel)} graden).` }
        : null,
      conditie,
      status,
    };
  });

  if (dagenUit[0]?.status?.soort === "nee" && dagenUit[1]?.venster) {
    const v = dagenUit[1].venster;
    dagenUit[0].status.zin += ` Morgen vanaf ${String(v.van).padStart(2, "0")}:00 kan het wel.`;
  }

  return {
    legenda: { links: "binnen blijven", rechts: "terrasweer" },
    dagen: dagenUit,
  };
}

function zonStuk(blok) {
  const zonUren = blok.filter((u) => u.dag && u.bewolking != null && u.bewolking <= 50);
  if (!zonUren.length) return "";
  if (zonUren.length === blok.length) return ", met zon";
  return `, zon vanaf ${String(zonUren[0].uur).padStart(2, "0")}:00`;
}

function statusVandaag(uren, nu, inst) {
  const resterend = uren.filter((u) => u.uur >= nu.getHours());
  const blok = besteBlok(resterend);
  if (!blok) {
    const eerder = besteBlok(uren);
    if (eerder && eerder.tot <= nu.getHours()) {
      return { soort: "nee", zin: "Het beste terrasweer is voor vandaag geweest." };
    }
    return { soort: "nee", zin: "Vandaag wordt het niks op het terras." };
  }
  const tijd = `${String(Math.max(blok.van, nu.getHours())).padStart(2, "0")}:00-${String(blok.tot).padStart(2, "0")}:00`;
  const windDaalt =
    resterend.some((u) => u.uur < blok.van && (u.wind ?? 0) > inst.maxWind * 0.8) &&
    blok.blok.every((u) => (u.wind ?? 0) <= inst.maxWind * 0.8);
  return {
    soort: blok.van <= nu.getHours() ? "nu" : "later",
    zin: `Beste terrasuren: ${tijd}${zonStuk(blok.blok)}${windDaalt ? ", de wind is dan gaan liggen" : ""}.`,
  };
}

function statusToekomst(venster) {
  if (!venster) return { soort: "nee", zin: "Geen terrasweer." };
  return {
    soort: "info",
    zin: `Beste blok: ${String(venster.van).padStart(2, "0")}:00-${String(venster.tot).padStart(2, "0")}:00.`,
  };
}

export const terras = {
  id: "terras",
  slug: "terrasweer",
  naam: "Vandaag terras?",
  meldingKort: "Terrascheck",
  korteVraag: "Kan ik vandaag op het terras zitten?",
  cta: "Check het terras",
  navLabel: "Terras",
  locatieHint: "Zoek je stad, dat is genoeg...",
  icoon: "parasol",
  groep: "Rondom huis",
  diepte: "De beste uren, en of de zon er dan bij is.",
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: TERRAS_DEFAULTS },
  instellingen: {
    defaults: TERRAS_DEFAULTS,
    velden: [
      { key: "minGevoel", label: "Lekker vanaf gevoels-", eenheid: "graden", step: 1, min: 10, max: 24 },
      { key: "maxWind", label: "Te winderig vanaf", eenheid: "km/u", step: 2, min: 10, max: 40 },
      { key: "dagStart", label: "Terras open vanaf", eenheid: "uur", step: 1, min: 8, max: 14 },
      { key: "dagEind", label: "Terras dicht om", eenheid: "uur", step: 1, min: 16, max: 24 },
    ],
    uitleg:
      "Ideaal is 22 graden gevoel met zon en een zwak windje. Rond de 18 met wat bewolking is Goed, fris of vlagerig wordt Twijfelachtig. De statusregel noemt de beste uren.",
  },
  adviesLabels: {
    goed: "terrasweer",
    matig: "kan, met een vestje",
    slecht: "geen terrasweer",
  },
  affiliate: null,
};
