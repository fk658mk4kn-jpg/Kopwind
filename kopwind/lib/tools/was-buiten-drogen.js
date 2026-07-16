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

import { kies } from "../i18n/locale.js";

/** Alle teksten van de wascheck, per taal. */
const T = kies({
  nl: {
    slug: "was-buiten-drogen",
    naam: "Kan de was vandaag buiten?",
    korteVraag: "Kan de was vandaag buiten?",
    meldingKort: "Wascheck",
    cta: "Check de was",
    navLabel: "De was",
    diepte: "Droogt het echt, en wanneer hang je het best op?",
    locatieHint: "Zoek je adres of stad...",
    schaalLabels: { ideaal: "Hang maar op", goed: "Goed droogweer", twijfelachtig: "Kan net", matig: "Wordt lastig", "zeer-slecht": "Binnen houden" },
    adviesLabels: { goed: "drooghangdag", matig: "kan, met geduld", slecht: "binnen drogen" },
    legenda: { links: "blijft nat", rechts: "droogt snel" },
    redenTeNat: "het is te nat: geen bruikbaar droog blok",
    redenGeenBlok: "geen aaneengesloten droge uren",
    redenTraag: (u) => `drogen gaat traag bij dit weer (\u00b1${u} u)`,
    redenNatDeel: (p) => `een flink deel van de dag is nat (${p}%)`,
    redenBuienRond: "buien rond het droge blok",
    metric: (u) => `Drogen duurt bij dit weer \u00b1${u} uur.`,
    morgenGoed: " Hang 'm morgenvroeg op, dan lukt het wel.",
    morgenSlecht: " Morgen ziet er ook niet best uit; check de dagen erna.",
    statusNatBinnen: "Vandaag binnen drogen: het blijft nat.",
    statusVoorbij: "Vandaag zit erop; buiten drogen lukt niet meer.",
    statusTeKort: "Vandaag binnen drogen: geen droog blok dat lang genoeg is.",
    statusTraag: (u) => `Buiten wordt 'ie vandaag niet droog: drogen duurt \u00b1${u} uur bij dit weer.`,
    nu: "nu",
    vanaf: (tijd) => `vanaf ${tijd}`,
    statusHang: (wanneer, klaar) => `Hang 'm ${wanneer} op: rond ${klaar} droog.`,
    statusTeLaat: (uren, droog) => `Vandaag te laat: nog \u00b1${uren} u bruikbaar en drogen duurt \u00b1${droog} u.`,
    toekomstBinnen: "Binnen drogen.",
    toekomstTeKort: (tijd) => `Droog blok ${tijd}, maar te kort om alles droog te krijgen.`,
    toekomstBeste: (tijd, droog) => `Beste blok: ${tijd}, drogen duurt \u00b1${droog} u.`,
    instDagStart: "Ophangen kan vanaf",
    instDagEind: "Ophangen kan tot",
    instUur: "uur",
    instBuienVraag: "Hoeveel buienrisico wil je nemen?",
    instBuienKeuzes: ["Risico nemen mag", "Gemiddeld", "Liever zeker droog"],
    instUitleg:
      "Ideaal is warm, luchtig en droog. Droog maar koel en vochtig wordt Goed of Twijfelachtig, want drogen gaat dan traag. Nat is Matig of slechter. Of je het nu nog redt staat los daarvan in de statusregel.",
  },
  en: {
    slug: "dry-laundry-outside",
    naam: "Dry the laundry outside today?",
    korteVraag: "Dry the laundry outside today?",
    meldingKort: "Laundry check",
    cta: "Check the laundry",
    navLabel: "Laundry",
    diepte: "Does it actually dry, and when should you hang it out?",
    locatieHint: "Search your address or town...",
    schaalLabels: { ideaal: "Hang it out", goed: "Good drying weather", twijfelachtig: "Just about", matig: "Tricky", "zeer-slecht": "Keep it inside" },
    adviesLabels: { goed: "drying day", matig: "doable, with patience", slecht: "dry inside" },
    legenda: { links: "stays wet", rechts: "dries fast" },
    redenTeNat: "too wet: no usable dry window",
    redenGeenBlok: "no consecutive dry hours",
    redenTraag: (u) => `drying is slow in this weather (about ${u} h)`,
    redenNatDeel: (p) => `a large part of the day is wet (${p}%)`,
    redenBuienRond: "showers around the dry window",
    metric: (u) => `Drying takes about ${u} hours in this weather.`,
    morgenGoed: " Hang it out early tomorrow and you're fine.",
    morgenSlecht: " Tomorrow doesn't look great either; check the days after.",
    statusNatBinnen: "Dry inside today: it stays wet.",
    statusVoorbij: "That's it for today; outdoor drying won't happen anymore.",
    statusTeKort: "Dry inside today: no dry window long enough.",
    statusTraag: (u) => `It won't get dry outside today: drying takes about ${u} hours in this weather.`,
    nu: "now",
    vanaf: (tijd) => `from ${tijd}`,
    statusHang: (wanneer, klaar) => `Hang it out ${wanneer}: dry around ${klaar}.`,
    statusTeLaat: (uren, droog) => `Too late today: about ${uren} h left and drying takes about ${droog} h.`,
    toekomstBinnen: "Dry inside.",
    toekomstTeKort: (tijd) => `Dry window ${tijd}, but too short to get everything dry.`,
    toekomstBeste: (tijd, droog) => `Best window: ${tijd}, drying takes about ${droog} h.`,
    instDagStart: "Hanging out possible from",
    instDagEind: "Hanging out possible until",
    instUur: "h",
    instBuienVraag: "How much shower risk are you willing to take?",
    instBuienKeuzes: ["I will take a chance", "Average", "Rather safely dry"],
    instUitleg:
      "Ideal is warm, breezy and dry. Dry but cool and humid comes out Good or Iffy, because drying goes slowly. Wet is Poor or worse. Whether you can still make it today is a separate status line.",
  },
});

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
        reden: regent ? T.redenTeNat : T.redenGeenBlok,
      });
    } else {
      factoren.push({
        punten: droogtijdPijn(droogtijd),
        reden: droogtijd >= 5 ? T.redenTraag(fmtUren(droogtijd)) : null,
      });
      factoren.push({
        punten: natPijn(fractieNat),
        reden: fractieNat >= 0.4 ? T.redenNatDeel(Math.round(fractieNat * 100)) : null,
      });
      if (uren.some((u) => u.nat && (u.uur < venster.van || u.uur >= venster.tot))) {
        factoren.push({ punten: 4, reden: T.redenBuienRond });
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
      metric: droogtijd ? { zin: T.metric(fmtUren(droogtijd)) } : null,
      conditie,
      status,
    };
  });

  // Morgen-hint in de status van vandaag, nu we morgen kennen.
  if (dagenUit[0]?.status?.soort === "te-laat" && dagenUit[1]) {
    const morgen = dagenUit[1];
    dagenUit[0].status.zin +=
      morgen.venster && morgen.conditie.score < 50 ? T.morgenGoed : T.morgenSlecht;
  }

  return {
    legenda: T.legenda,
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
      zin: regende ? T.statusNatBinnen : T.statusVoorbij,
    };
  }
  const blokNu = besteBlok(resterend, 1);
  if (blokNu.uren < MIN_VENSTER_UREN) {
    return { soort: "nee", zin: T.statusTeKort };
  }
  const droogtijdNu = geschatteDroogtijd(blokNu.gemiddeld);
  if (droogtijdNu != null && droogtijdNu > dagLengte) {
    return {
      soort: "traag",
      zin: T.statusTraag(fmtUren(droogtijdNu)),
    };
  }
  if (droogtijdNu != null && blokNu.uren >= droogtijdNu) {
    const start = Math.max(blokNu.van, nu.getHours());
    const klaar = fmtTijdUit(start + droogtijdNu);
    const wanneer = blokNu.van <= nu.getHours() ? T.nu : T.vanaf(`${String(blokNu.van).padStart(2, "0")}:00`);
    return {
      soort: blokNu.van <= nu.getHours() ? "nu" : "later",
      zin: T.statusHang(wanneer, klaar),
    };
  }
  return {
    soort: "te-laat",
    zin: T.statusTeLaat(blokNu.uren, fmtUren(droogtijdNu)),
  };
}

function statusToekomst(venster, droogtijd) {
  if (!venster) return { soort: "nee", zin: T.toekomstBinnen };
  const tijd = `${String(venster.van).padStart(2, "0")}:00-${String(venster.tot).padStart(2, "0")}:00`;
  if (droogtijd != null && droogtijd > venster.uren) {
    return { soort: "te-laat", zin: T.toekomstTeKort(tijd) };
  }
  return { soort: "info", zin: T.toekomstBeste(tijd, fmtUren(droogtijd)) };
}

/** Back-compat naam: geeft direct de dagenlijst van de overlay terug. */
export function berekenDroogdagen(hourly, nu = new Date(), instellingen = WAS_DEFAULTS) {
  return overlay(hourly, nu, instellingen).dagen;
}

export const wasBuitenDrogen = {
  id: "was-buiten-drogen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#4E9A86",
  locatieHint: T.locatieHint,
  icoon: "druppel",
  categorieId: "huis-tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: WAS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: WAS_DEFAULTS },
  instellingen: {
    defaults: WAS_DEFAULTS,
    velden: [
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 5, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 14, max: 23 },
      {
        type: "keuze",
        id: "buien",
        vraag: T.instBuienVraag,
        keuzes: [
          { label: T.instBuienKeuzes[0], zet: { buiKans: 70 } },
          { label: T.instBuienKeuzes[1], zet: { buiKans: 55 } },
          { label: T.instBuienKeuzes[2], zet: { buiKans: 40 } },
        ],
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-13",
  affiliate: null,
};
