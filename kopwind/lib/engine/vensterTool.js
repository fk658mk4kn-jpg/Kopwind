/**
 * lib/engine/vensterTool.js
 *
 * De gedeelde venstermotor voor checks die per dag het beste blok
 * zoeken (v3.17.0 "Passaat"). Het patroon van de terrascheck, maar dan
 * een keer geschreven: uurscores, blokken bouwen, het beste blok
 * kiezen, standaardfactoren (blokkwaliteit, kort blok, buien, wind) en
 * de tijdbewuste status (nu, later, geweest, niks). Per tool leveren:
 * de uurscore, de teksten en eventueel extra factoren.
 *
 * De acht batch-3-venstertools bouwen hierop; de oudere venstertools
 * (terras, barbecue, was, hardloop, strand, autowas) hebben elk nog
 * hun eigen kopie van dit patroon en migreren later (zie backlog).
 */

import { lerp, maakScore, adviesVoorScore } from "./score.js";
import { jaVoor } from "./schaal.js";
import { bouwBasis, basisPerDag, dagKeyVan } from "./weerbasis.js";

const pad2 = (n) => String(n).padStart(2, "0");

function besteBlok(uren, minVensterUren, bruikbaarVanaf) {
  const blokken = [];
  let blok = [];
  for (const u of uren) {
    if (u.score >= bruikbaarVanaf) {
      blok.push(u);
    } else if (blok.length) {
      blokken.push(blok);
      blok = [];
    }
  }
  if (blok.length) blokken.push(blok);
  let beste = null;
  for (const b of blokken) {
    if (b.length < minVensterUren) continue;
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

/**
 * Bouwt een overlay-functie voor een venstertool.
 *
 * @param {object} cfg
 * @param {object} cfg.defaults drempels van de tool
 * @param {(u: object, inst: object) => number} cfg.uurScore uurscore 0..100
 * @param {object} cfg.teksten redenNat, redenGeenBlok, redenMatigBlok(g,w),
 *   redenKortBlok(u), redenBuien, redenWind?(w), statusNu(t),
 *   statusBeste(t), statusGeweest, statusNiks, toekomstBeste(t),
 *   toekomstGeen, metric(uur, gevoel)
 * @param {object} cfg.adviesLabels goed/matig/slecht van de tool
 * @param {number} [cfg.minVensterUren]
 * @param {number} [cfg.bruikbaarVanaf]
 * @param {(ctx: {uren: object[], venster: object|null, inst: object}) => Array}
 *   [cfg.extraFactoren] extra factoren per dag ({punten, reden})
 * @param {(ctx: {uren: object[], inst: object, natVeel: boolean}) => string}
 *   [cfg.geenBlokReden] eigen hoofdreden als er geen blok is
 */
export function maakVensterOverlay(cfg) {
  const {
    defaults,
    uurScore,
    teksten: T,
    adviesLabels,
    minVensterUren = 2,
    bruikbaarVanaf = 40,
    extraFactoren,
    geenBlokReden,
  } = cfg;

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

  return function overlay(hourly, nu = new Date(), instellingen = defaults) {
    const inst = { ...defaults, ...(instellingen ?? {}) };
    const basis = bouwBasis(hourly);
    const perDag = basisPerDag(basis, inst.dagStart, inst.dagEind);
    const vandaagKey = dagKeyVan(nu);

    const dagen = [];
    for (const [datum, dagUren] of perDag) {
      if (datum < vandaagKey) continue;
      const uren = dagUren.map((u) => ({
        ...u,
        score: uurScore(u, inst),
        nat: (u.neerslag ?? 0) > 0.05,
      }));
      dagen.push({ datum, uren });
    }
    dagen.sort((a, b) => (a.datum < b.datum ? -1 : 1));

    const dagenUit = dagen.slice(0, 5).map(({ datum, uren }) => {
      const venster = besteBlok(uren, minVensterUren, bruikbaarVanaf);
      const natUren = uren.filter((u) => u.nat).length;
      const natVeel = natUren > uren.length / 3;

      const factoren = [];
      if (!venster) {
        factoren.push({
          punten: 72,
          reden: geenBlokReden
            ? geenBlokReden({ uren, inst, natVeel })
            : natVeel
              ? T.redenNat
              : T.redenGeenBlok,
        });
      } else {
        const blokGevoel = Math.round(
          venster.blok.reduce((a, u) => a + (u.gevoel ?? u.temp ?? 0), 0) / venster.uren
        );
        const blokWind = Math.round(
          venster.blok.reduce((a, u) => a + (u.wind ?? 0), 0) / venster.uren
        );
        const kwaliteit = topPijn(venster.gemiddeld);
        factoren.push({
          punten: kwaliteit,
          reden: kwaliteit >= 18 ? T.redenMatigBlok(blokGevoel, blokWind) : null,
        });
        factoren.push({
          punten: Math.round(lerp(venster.uren, 6, minVensterUren, 0, 20)),
          reden: venster.uren <= minVensterUren + 1 ? T.redenKortBlok(venster.uren) : null,
        });
        if (T.redenWind && inst.maxWind && blokWind > inst.maxWind * 0.8) {
          factoren.push({ punten: 7, reden: T.redenWind(blokWind) });
        }
        if (natUren > 0) {
          factoren.push({ punten: 5, reden: T.redenBuien });
        }
      }
      if (extraFactoren) {
        factoren.push(...extraFactoren({ uren, venster, inst }));
      }

      const { score, redenen } = maakScore(factoren);
      const conditie = { score, redenen, advies: adviesVoorScore(score, adviesLabels) };

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
  };
}
