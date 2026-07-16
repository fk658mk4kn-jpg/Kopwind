/**
 * lib/tools/auto-wassen.js
 *
 * De autowascheck als overlay op de gedeelde weerbasis (v3.16.0
 * "Maestro"). Een goede wasdag vraagt een droog blok van een paar uur
 * (wassen plus opdrogen), geen vorst (bevriezend spoelwater) en liefst
 * geen felle zon op de lak: die droogt het sop te snel en laat strepen
 * en kalkvlekken achter. Wind mag, tot het stof gaat opwaaien.
 */

import { clamp, lerp, maakScore, adviesVoorScore } from "../engine/score.js";
import { jaVoor } from "../engine/schaal.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";

import { kies } from "../i18n/locale.js";

/** Alle teksten van de autowascheck, per taal. */
const T = kies({
  nl: {
    slug: "auto-wassen",
    naam: "Kan ik de auto wassen vandaag?",
    korteVraag: "Kan ik de auto wassen vandaag?",
    meldingKort: "Autowascheck",
    cta: "Check de wasdag",
    navLabel: "Auto wassen",
    diepte: "Een droog blok, geen vorst en niet te felle zon.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfecte wasdag", goed: "Prima wasdag", twijfelachtig: "Kan, droog snel na", matig: "Liever een andere dag", "zeer-slecht": "Geen wasdag" },
    adviesLabels: { goed: "een goede wasdag", matig: "kan, met een snelle droogdoek", slecht: "geen wasdag" },
    legenda: { links: "andere dag", rechts: "wasdag" },
    redenNat: "te nat: regen spoelt het werk weg",
    redenVorst: "vorst: spoelwater bevriest op de lak en de ruiten",
    redenGeenBlok: "geen droog blok van een paar uur",
    redenMatigBlok: (g) => `het beste blok is maar matig (rond ${g} graden)`,
    redenKortBlok: (u) => `maar een kort droog blok (${u} uur)`,
    redenZon: "felle zon op de lak: sop droogt te snel (strepen)",
    redenWind: (w) => `stevige wind (${w} km/u): stof waait op het natte werk`,
    redenKoud: (g) => `koud voor een wasbeurt (rond ${g} graden)`,
    metric: (uur) => `Beste moment rond ${uur}:00 (droog en zachte lucht).`,
    statusNu: (tijd) => `Nu een prima moment: het droge blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste wasblok: ${tijd}.`,
    statusGeweest: "Het beste wasblok is voor vandaag geweest.",
    statusNiks: "Vandaag is geen dag om de auto te wassen.",
    toekomstBeste: (tijd) => `Beste wasblok: ${tijd}.`,
    toekomstGeen: "Geen wasdag.",
    instZonVraag: "Waar was je de auto?",
    instZonKeuzes: ["In de schaduw of garagebox", "Gewoon buiten"],
    instDagStart: "Vroegste wastijd",
    instDagEind: "Laatste wastijd",
    instUur: "uur",
    instUitleg:
      "Een goede wasdag heeft een droog blok van minstens twee uur, geen vorst en liefst een graad of 8 tot 20. Felle zon telt tegen: sop droogt dan te snel en laat strepen achter. Was je in de schaduw? Zet dat in de instellingen, dan telt de zon niet mee.",
  },
  en: {
    slug: "wash-the-car",
    naam: "Wash the car today?",
    korteVraag: "Wash the car today?",
    meldingKort: "Car wash check",
    cta: "Check the wash day",
    navLabel: "Car wash",
    diepte: "A dry window, no frost and not too much sun.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect wash day", goed: "Good wash day", twijfelachtig: "Doable, dry off quickly", matig: "Better another day", "zeer-slecht": "Not a wash day" },
    adviesLabels: { goed: "a good wash day", matig: "doable with a quick drying cloth", slecht: "not a wash day" },
    legenda: { links: "another day", rechts: "wash day" },
    redenNat: "too wet: rain rinses your work away",
    redenVorst: "frost: rinse water freezes on the paint and windows",
    redenGeenBlok: "no dry window of a few hours",
    redenMatigBlok: (g) => `the best window is only so-so (around ${g} degrees)`,
    redenKortBlok: (u) => `only a short dry window (${u} hours)`,
    redenZon: "harsh sun on the paint: suds dry too fast (streaks)",
    redenWind: (w) => `strong wind (${w} km/h): dust blows onto the wet work`,
    redenKoud: (g) => `cold for a wash (around ${g} degrees)`,
    metric: (uur) => `Best moment around ${uur}:00 (dry and mild).`,
    statusNu: (tijd) => `Good moment right now: the dry window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best wash window: ${tijd}.`,
    statusGeweest: "The best wash window has been and gone today.",
    statusNiks: "Today isn't a day to wash the car.",
    toekomstBeste: (tijd) => `Best wash window: ${tijd}.`,
    toekomstGeen: "Not a wash day.",
    instZonVraag: "Where do you wash the car?",
    instZonKeuzes: ["In the shade or a carport", "Out in the open"],
    instDagStart: "Earliest wash time",
    instDagEind: "Latest wash time",
    instUur: "h",
    instUitleg:
      "A good wash day has a dry window of at least two hours, no frost and ideally 8 to 20 degrees. Harsh sun counts against: suds dry too fast and leave streaks. Washing in the shade? Set that in the settings and the sun won't count.",
  },
});

export const AUTOWAS_DEFAULTS = {
  maxWind: 30, // km/u; daarboven waait stof op het natte werk
  schaduw: false,
  dagStart: 8,
  dagEind: 20,
};

const MIN_VENSTER_UREN = 2;
const BRUIKBAAR_VANAF = 40;

/** Wasscore van een enkel basis-uur, 0..100. */
export function uurWasScore(u, inst = AUTOWAS_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.05 || (u.kans ?? 0) >= 55) return 0;
  const temp = u.temp ?? u.gevoel ?? 10;
  if (temp <= 0.5) return 0; // spoelwater bevriest
  const tempF = clamp(lerp(temp, 2, 10, 0.35, 1), 0.35, 1) * clamp(lerp(temp, 24, 32, 1, 0.7), 0.7, 1);
  const wind = u.wind ?? 0;
  const windF = clamp(1 - Math.max(0, wind - inst.maxWind * 0.6) / (inst.maxWind * 1.5), 0.35, 1);
  const felleZon = !inst.schaduw && u.dag && u.bewolking != null && u.bewolking < 30;
  const zonF = felleZon ? 0.72 : 1;
  return clamp(Math.round(92 * tempF * windF * zonF), 0, 100);
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

export function overlay(hourly, nu = new Date(), instellingen = AUTOWAS_DEFAULTS) {
  const inst = { ...AUTOWAS_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, inst.dagStart, inst.dagEind);
  const vandaagKey = dagKeyVan(nu);

  const dagen = [];
  for (const [datum, dagUren] of perDag) {
    if (datum < vandaagKey) continue;
    const uren = dagUren.map((u) => ({
      ...u,
      score: uurWasScore(u, inst),
      nat: (u.neerslag ?? 0) > 0.05,
    }));
    dagen.push({ datum, uren });
  }
  dagen.sort((a, b) => (a.datum < b.datum ? -1 : 1));

  const dagenUit = dagen.slice(0, 5).map(({ datum, uren }) => {
    const venster = besteBlok(uren);
    const minTemp = Math.min(...uren.map((u) => u.temp ?? u.gevoel ?? 99));
    const maxTemp = Math.max(...uren.map((u) => u.temp ?? u.gevoel ?? -99));
    const natUren = uren.filter((u) => u.nat).length;

    const factoren = [];
    if (!venster) {
      factoren.push({
        punten: 72,
        reden:
          minTemp <= 0.5
            ? T.redenVorst
            : natUren > uren.length / 3
              ? T.redenNat
              : T.redenGeenBlok,
      });
      if (maxTemp < 5) factoren.push({ punten: 10, reden: T.redenKoud(Math.round(maxTemp)) });
    } else {
      const blokTemp = Math.round(venster.blok.reduce((a, u) => a + (u.temp ?? u.gevoel ?? 0), 0) / venster.uren);
      const kwaliteit = topPijn(venster.gemiddeld);
      factoren.push({ punten: kwaliteit, reden: kwaliteit >= 18 ? T.redenMatigBlok(blokTemp) : null });
      factoren.push({
        punten: Math.round(lerp(venster.uren, 6, 2, 0, 20)),
        reden: venster.uren <= 3 ? T.redenKortBlok(venster.uren) : null,
      });
      const felleZonUren = inst.schaduw
        ? 0
        : venster.blok.filter((u) => u.dag && u.bewolking != null && u.bewolking < 30).length;
      if (felleZonUren > venster.uren / 2) {
        factoren.push({ punten: 10, reden: T.redenZon });
      }
      const gemWind = venster.blok.reduce((a, u) => a + (u.wind ?? 0), 0) / venster.uren;
      if (gemWind > inst.maxWind * 0.8) {
        factoren.push({ punten: 7, reden: T.redenWind(Math.round(gemWind)) });
      }
      if (natUren > 0) {
        factoren.push({ punten: 5, reden: T.redenNat });
      }
      if (blokTemp < 6) {
        factoren.push({ punten: 6, reden: T.redenKoud(blokTemp) });
      }
    }
    const { score, redenen } = maakScore(factoren);
    const conditie = { score, redenen, advies: adviesVoorScore(score, autoWassen.adviesLabels) };

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
      metric: top ? { zin: T.metric(pad2(top.uur)) } : null,
      conditie,
      status,
    };
  });

  return { dagen: dagenUit };
}

export const autoWassen = {
  id: "auto-wassen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#8C6239",
  locatieHint: T.locatieHint,
  icoon: "auto",
  categorieId: "huis-tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: AUTOWAS_DEFAULTS },
  instellingen: {
    defaults: AUTOWAS_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "zon",
        vraag: T.instZonVraag,
        keuzes: [
          { label: T.instZonKeuzes[0], zet: { schaduw: true } },
          { label: T.instZonKeuzes[1], zet: { schaduw: false } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 7, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 16, max: 22 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-16",
  affiliate: null,
};
