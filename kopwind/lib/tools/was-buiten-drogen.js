/**
 * lib/tools/was-buiten-drogen.js
 *
 * De wascheck als overlay op de gedeelde weerbasis. Kern van v2.2.0
 * "Zephyr": het cijfer en de klok zijn uit elkaar getrokken.
 *
 * 1. CONDITIE-CIJFER: hoe goed zijn de omstandigheden om buiten te drogen,
 *    over de hele bruikbare dag (dagStart tot dagEind), los van hoe laat
 *    je kijkt. Ankers: 10 = warm, luchtig, droog, zon; 6-7 = droog maar
 *    koel/vochtig/weinig wind (drogen gaat traag); laag = nat.
 * 2. STATUS: kun je het nu of vandaag nog doen. Tijd-bewust: is er nog
 *    genoeg aaneengesloten droge tijd voor de geschatte droogtijd? Zo ja:
 *    "hang 'm nu op, rond HH:MM droog". Zo nee: "vandaag te laat, drogen
 *    duurt ±X uur, morgenvroeg lukt het wel." De status sloopt het cijfer
 *    dus niet meer: prima droogweer om 18:24 blijft een 8+.
 *
 * De droogsnelheid zelf (warm + wind + droge lucht + zon = sneller droog)
 * komt uit lib/engine/drogen.js en wordt letterlijk getoond: "drogen duurt
 * bij dit weer ±X uur".
 */

import { clamp, lerp, maakScore, adviesVoorScore } from "../engine/score.js";
import { jaVoor } from "../engine/schaal.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { droogsnelheid, geschatteDroogtijd, fmtUren } from "../engine/drogen.js";

export const WAS_VELDEN = BASIS_VELDEN;

export const WAS_DEFAULTS = {
  dagStart: 8, // ophangen kan vanaf dit uur
  dagEind: 20, // en tot dit uur
  buiKans: 55, // % buienkans waarboven een uur niet meetelt
};

const MIN_VENSTER_UREN = 2;

/** Vensterduur-ankers van de conditie: alleen echt natte dagen zakken diep. */
function droogtijdPijn(uren) {
  const ANKERS = [
    [2.5, 0],
    [3.5, 8],
    [5, 18],
    [8, 28],
    [12, 35],
  ];
  if (uren == null) return 35;
  if (uren <= ANKERS[0][0]) return 0;
  for (let i = 0; i < ANKERS.length - 1; i++) {
    const [x0, y0] = ANKERS[i];
    const [x1, y1] = ANKERS[i + 1];
    if (uren <= x1) return Math.round(lerp(uren, x0, x1, y0, y1));
  }
  return 35;
}

function natPijn(fractieNat) {
  const ANKERS = [
    [0, 0],
    [0.2, 8],
    [0.4, 22],
    [0.6, 45],
    [0.8, 62],
    [1, 78],
  ];
  for (let i = 0; i < ANKERS.length - 1; i++) {
    const [x0, y0] = ANKERS[i];
    const [x1, y1] = ANKERS[i + 1];
    if (fractieNat <= x1) return Math.round(lerp(fractieNat, x0, x1, y0, y1));
  }
  return 78;
}

function fmtTijdUit(uurDecimaal) {
  const totaalMinuten = Math.round((uurDecimaal * 60) / 15) * 15;
  const hh = Math.floor(totaalMinuten / 60);
  const mm = totaalMinuten % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function blokken(uren) {
  const res = [];
  let blok = [];
  for (const u of uren) {
    if (u.kracht > 0) {
      blok.push(u);
    } else if (blok.length) {
      res.push(blok);
      blok = [];
    }
  }
  if (blok.length) res.push(blok);
  return res;
}

function besteBlok(uren, minUren) {
  let beste = null;
  for (const b of blokken(uren)) {
    if (b.length < minUren) continue;
    const gemiddeld = b.reduce((a, u) => a + u.kracht, 0) / b.length;
    if (!beste || gemiddeld * b.length > beste.gemiddeld * beste.uren) {
      beste = { van: b[0].uur, tot: b[b.length - 1].uur + 1, uren: b.length, gemiddeld };
    }
  }
  return beste;
}

/**
 * De overlay: hourly plus instellingen erin, dagen met conditie, status,
 * venster, urenstrip en droogtijd eruit.
 */
export function overlay(hourly, nu = new Date(), instellingen = WAS_DEFAULTS) {
  const inst = { ...WAS_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, inst.dagStart, inst.dagEind);
  const vandaagKey = dagKeyVan(nu);
  const dagLengte = inst.dagEind - inst.dagStart;

  const dagen = [];
  for (const [datum, dagUren] of perDag) {
    if (datum < vandaagKey) continue;
    const uren = dagUren.map((u) => ({
      ...u,
      kracht: droogsnelheid(u, inst.buiKans),
      nat: (u.neerslag ?? 0) > 0.1,
    }));
    dagen.push({ datum, uren });
  }
  dagen.sort((a, b) => (a.datum < b.datum ? -1 : 1));
  const dagenUit = dagen.slice(0, 5).map(({ datum, uren }) => {
    // CONDITIE: over de hele bruikbare dag, los van de klok.
    const venster = besteBlok(uren, MIN_VENSTER_UREN);
    const droogtijd = venster ? geschatteDroogtijd(venster.gemiddeld) : null;
    const fractieNat = uren.filter((u) => u.kracht === 0).length / Math.max(uren.length, 1);

    const factoren = [];
    if (!venster) {
      const regent = uren.some((u) => u.nat);
      factoren.push({
        punten: 78,
        reden: regent ? "het is te nat: geen bruikbaar droog blok" : "geen aaneengesloten droge uren",
      });
    } else {
      factoren.push({
        punten: droogtijdPijn(droogtijd),
        reden: droogtijd >= 5 ? `drogen gaat traag bij dit weer (\u00b1${fmtUren(droogtijd)} u)` : null,
      });
      factoren.push({
        punten: natPijn(fractieNat),
        reden:
          fractieNat >= 0.4
            ? `een flink deel van de dag is nat (${Math.round(fractieNat * 100)}%)`
            : null,
      });
      if (uren.some((u) => u.nat && (u.uur < venster.van || u.uur >= venster.tot))) {
        factoren.push({ punten: 4, reden: "buien rond het droge blok" });
      }
    }
    let { score, redenen } = maakScore(factoren);
    // Consistentie: past de droogtijd in het venster, dan zegt het label
    // nooit "binnen drogen" terwijl de status "hang 'm op" adviseert.
    if (venster && droogtijd != null && droogtijd <= venster.uren && score > 58) {
      score = 58;
    }
    const conditie = {
      score,
      redenen,
      advies: adviesVoorScore(score, wasBuitenDrogen.adviesLabels),
    };

    // STATUS: tijd-bewust voor vandaag, informatief voor de rest.
    const isVandaag = datum === vandaagKey;
    const status = isVandaag
      ? statusVandaag(uren, nu, dagLengte, inst)
      : statusToekomst(venster, droogtijd);

    const antwoord = {
      ja: isVandaag
        ? ["nu", "later"].includes(status.soort)
        : status.soort === "info" && jaVoor(score),
      zin: status.zin,
    };

    return {
      datum,
      antwoord,
      uren: uren.map((u) => ({ uur: u.uur, score: u.kracht, nat: u.nat })),
      venster,
      droogtijd,
      metric: droogtijd
        ? { zin: `Drogen duurt bij dit weer \u00b1${fmtUren(droogtijd)} uur.` }
        : null,
      conditie,
      status,
    };
  });

  // Morgen-hint in de status van vandaag, nu we morgen kennen.
  if (dagenUit[0]?.status?.soort === "te-laat" && dagenUit[1]) {
    const morgen = dagenUit[1];
    dagenUit[0].status.zin +=
      morgen.venster && morgen.conditie.score < 50
        ? " Hang 'm morgenvroeg op, dan lukt het wel."
        : " Morgen ziet er ook niet best uit; check de dagen erna.";
  }

  return {
    legenda: { links: "blijft nat", rechts: "droogt snel" },
    dagen: dagenUit,
  };
}

function statusVandaag(uren, nu, dagLengte, inst) {
  const resterend = uren.filter((u) => u.uur >= nu.getHours());
  const droogResterend = resterend.filter((u) => u.kracht > 0);
  if (!resterend.length || !droogResterend.length) {
    const regende = uren.some((u) => u.nat);
    return {
      soort: "nee",
      zin: regende
        ? "Vandaag binnen drogen: het blijft nat."
        : "Vandaag zit erop; buiten drogen lukt niet meer.",
    };
  }
  const blokNu = besteBlok(resterend, 1);
  if (blokNu.uren < MIN_VENSTER_UREN) {
    return { soort: "nee", zin: "Vandaag binnen drogen: geen droog blok dat lang genoeg is." };
  }
  const droogtijdNu = geschatteDroogtijd(blokNu.gemiddeld);
  if (droogtijdNu != null && droogtijdNu > dagLengte) {
    return {
      soort: "traag",
      zin: `Buiten wordt 'ie vandaag niet droog: drogen duurt \u00b1${fmtUren(droogtijdNu)} uur bij dit weer.`,
    };
  }
  if (droogtijdNu != null && blokNu.uren >= droogtijdNu) {
    const start = Math.max(blokNu.van, nu.getHours());
    const klaar = fmtTijdUit(start + droogtijdNu);
    const wanneer = blokNu.van <= nu.getHours() ? "nu" : `vanaf ${String(blokNu.van).padStart(2, "0")}:00`;
    return {
      soort: blokNu.van <= nu.getHours() ? "nu" : "later",
      zin: `Hang 'm ${wanneer} op: rond ${klaar} droog.`,
    };
  }
  return {
    soort: "te-laat",
    zin: `Vandaag te laat: nog \u00b1${blokNu.uren} u bruikbaar en drogen duurt \u00b1${fmtUren(droogtijdNu)} u.`,
  };
}

function statusToekomst(venster, droogtijd) {
  if (!venster) return { soort: "nee", zin: "Binnen drogen." };
  const tijd = `${String(venster.van).padStart(2, "0")}:00-${String(venster.tot).padStart(2, "0")}:00`;
  if (droogtijd != null && droogtijd > venster.uren) {
    return { soort: "te-laat", zin: `Droog blok ${tijd}, maar te kort om alles droog te krijgen.` };
  }
  return { soort: "info", zin: `Beste blok: ${tijd}, drogen duurt \u00b1${fmtUren(droogtijd)} u.` };
}

/** Back-compat naam: geeft direct de dagenlijst van de overlay terug. */
export function berekenDroogdagen(hourly, nu = new Date(), instellingen = WAS_DEFAULTS) {
  return overlay(hourly, nu, instellingen).dagen;
}

export const wasBuitenDrogen = {
  id: "was-buiten-drogen",
  slug: "was-buiten-drogen",
  naam: "Vandaag de was buiten?",
  meldingKort: "Wascheck",
  korteVraag: "Kan de was vandaag buiten drogen?",
  cta: "Check de was",
  navLabel: "De was",
  locatieHint: "Zoek je adres of stad...",
  icoon: "druppel",
  groep: "Rondom huis",
  diepte: "Wanneer je ophangt en hoe lang het drogen duurt.",
  patroon: "A",
  inputType: "locatie",
  weerVelden: WAS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: WAS_DEFAULTS },
  instellingen: {
    defaults: WAS_DEFAULTS,
    velden: [
      { key: "dagStart", label: "Ophangen kan vanaf", eenheid: "uur", step: 1, min: 5, max: 12 },
      { key: "dagEind", label: "Ophangen kan tot", eenheid: "uur", step: 1, min: 14, max: 23 },
      { key: "buiKans", label: "Uur telt niet mee vanaf buienkans", eenheid: "%", step: 5, min: 20, max: 90 },
    ],
    uitleg:
      "Ideaal is warm, luchtig en droog. Droog maar koel en vochtig wordt Goed of Twijfelachtig, want drogen gaat dan traag. Nat is Matig of slechter. Of je het nu nog redt staat los daarvan in de statusregel.",
  },
  adviesLabels: {
    goed: "drooghangdag",
    matig: "kan, met geduld",
    slecht: "binnen drogen",
  },
  affiliate: null,
};
