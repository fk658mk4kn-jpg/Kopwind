/**
 * lib/tools/kamperen.js
 *
 * De kampeercheck (v3.29.0 "Ghibli"). De enige check waar de NACHT
 * het oordeel draagt: een stralende dag met een gierende of ijskoude
 * nacht is een slechte kampeerdag. Per dag beoordeelt de motor de
 * nacht die erop volgt (minimumgevoel, nachtregen, windstoten op de
 * tent) plus een opzetvenster: een droog blok voor acht uur 's avonds
 * om de tent staand en droog te krijgen. Wie er al staat, kan het
 * opzetvenster uitzetten en krijgt puur het nachtoordeel.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "kamperen",
    naam: "Is het kampeerweer vannacht?",
    korteVraag: "Is het kampeerweer vannacht?",
    meldingKort: "Kampeercheck",
    cta: "Check de nacht",
    navLabel: "Kamperen",
    diepte: "De enige check waar de nacht telt: tentnacht plus droog opzetvenster.",
    locatieHint: "Zoek je stad of de camping, dat is genoeg...",
    schaalLabels: { ideaal: "Perfecte kampeernacht", goed: "Prima kampeernacht", twijfelachtig: "Kan, pak warm in", matig: "Onrustige nacht", "zeer-slecht": "Geen tentweer" },
    adviesLabels: { goed: "kampeerweer", matig: "kan, pak warm in", slecht: "geen tentweer" },
    legenda: { links: "tent blijft in de zak", rechts: "kampeerweer" },
    statusPrima: (min) => `Prima kampeernacht: droog, rustig en een minimum rond ${min} graden.`,
    statusKoud: (min) => `Koude nacht op komst (minimum rond ${min} graden): kan, met een goede slaapmat en warme slaapzak. Isolatie onder je telt dubbel.`,
    statusNat: (mm) => `Natte nacht (zo'n ${mm} mm): controleer het buitendoek en de haringen, en zet de bagage los van de tentwand.`,
    statusStormig: (s) => `Windstoten tot ${s} km/u vannacht: scheerlijnen strak, extra haringen, en een festivaltentje redt dit niet.`,
    statusOpzetNat: "De nacht zelf valt mee, maar droog opzetten wordt lastig: er is voor acht uur geen droog blok van betekenis.",
    redenPrima: "droge, rustige nacht",
    redenKoud: (min) => `koude nacht (minimum rond ${min} graden)`,
    redenNat: (mm) => `nachtregen (${mm} mm)`,
    redenStoten: (s) => `windstoten tot ${s} km/u op de tent`,
    redenOpzet: "geen droog opzetvenster voor 20:00",
    metricOpzet: (uur) => `Droogste opzetmoment: rond ${uur}:00.`,
    metricStaat: "Opzetvenster niet nodig: je staat er al.",
    metricGeenOpzet: "Geen droog opzetblok voor 20:00.",
    instTentVraag: "Wat voor tent?",
    instTentKeuzes: ["Festivaltentje", "Gewone koepel- of tunneltent", "Storm-vaste trekkerstent"],
    instComfortVraag: "Hoe koud mag de nacht worden?",
    instComfortKeuzes: ["Ik slaap snel koud (10 graden)", "Gemiddeld (6 graden)", "Koude nachten deren me niet (2 graden)"],
    instStaVraag: "Sta je er al?",
    instStaKeuzes: ["Nee, ik moet nog opzetten", "Ja, de tent staat"],
    instUitleg:
      "De check beoordeelt per dag de nacht die erop volgt: het minimumgevoel, de nachtregen en de windstoten op het doek. Daarnaast zoekt hij een droog opzetblok voor acht uur 's avonds; wie er al staat zet dat uit. Een festivaltentje krijgt strengere stootgrenzen dan een trekkerstent, en je eigen kougrens bepaalt wanneer een heldere nacht te fris wordt.",
  },
  en: {
    slug: "camping",
    naam: "Is it camping weather tonight?",
    korteVraag: "Camping weather tonight?",
    meldingKort: "Camping check",
    cta: "Check the night",
    navLabel: "Camping",
    diepte: "The only check where the night counts: tent night plus a dry pitching window.",
    locatieHint: "Search your town or the campsite...",
    schaalLabels: { ideaal: "Perfect camping night", goed: "Good camping night", twijfelachtig: "Doable, pack warm", matig: "A restless night", "zeer-slecht": "No tent weather" },
    adviesLabels: { goed: "camping weather", matig: "doable, pack warm", slecht: "no tent weather" },
    legenda: { links: "tent stays packed", rechts: "camping weather" },
    statusPrima: (min) => `A fine camping night: dry, calm and a minimum around ${min} degrees.`,
    statusKoud: (min) => `A cold night coming (minimum around ${min} degrees): doable with a good mat and warm bag. Insulation underneath counts double.`,
    statusNat: (mm) => `A wet night (about ${mm} mm): check the flysheet and pegs, and keep bags off the tent wall.`,
    statusStormig: (s) => `Gusts up to ${s} km/h tonight: guy lines tight, extra pegs, and a festival tent won't survive this.`,
    statusOpzetNat: "The night itself is fine, but pitching dry gets tricky: no dry block of note before eight.",
    redenPrima: "a dry, calm night",
    redenKoud: (min) => `a cold night (minimum around ${min} degrees)`,
    redenNat: (mm) => `night rain (${mm} mm)`,
    redenStoten: (s) => `gusts up to ${s} km/h on the tent`,
    redenOpzet: "no dry pitching window before 20:00",
    metricOpzet: (uur) => `Driest pitching moment: around ${uur}:00.`,
    metricStaat: "No pitching window needed: you're already set up.",
    metricGeenOpzet: "No dry pitching block before 20:00.",
    instTentVraag: "What kind of tent?",
    instTentKeuzes: ["Festival tent", "Regular dome or tunnel tent", "Storm-proof trekking tent"],
    instComfortVraag: "How cold may the night get?",
    instComfortKeuzes: ["I get cold fast (10 degrees)", "Average (6 degrees)", "Cold nights don't faze me (2 degrees)"],
    instStaVraag: "Already pitched?",
    instStaKeuzes: ["No, still need to pitch", "Yes, the tent is up"],
    instUitleg:
      "The check judges, per day, the night that follows: minimum feels-like, night rain and gusts on the canvas. It also finds a dry pitching block before eight in the evening; if you're already set up, that's off. A festival tent gets stricter gust limits than a trekking tent, and your own cold limit decides when a clear night turns too fresh.",
  },
});

export const KAMPEER_DEFAULTS = { stootGrens: 55, komfort: 6, staat: 0 };

export function overlay(hourly, nu = new Date(), instellingen = KAMPEER_DEFAULTS) {
  const inst = { ...KAMPEER_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const vandaagKey = dagKeyVan(nu);
  const alle = basis.filter((u) => u.datum >= vandaagKey);
  const datums = [...perDag.keys()].filter((d) => d >= vandaagKey).sort().slice(0, 5);

  const dagenUit = [];
  for (const datum of datums) {
    const dagUren = perDag.get(datum) ?? [];
    if (!dagUren.length) continue;

    // De nacht die op deze dag volgt: 22:00 tot 08:00 de volgende ochtend.
    const startIdx = alle.findIndex((u) => u.datum === datum && u.uur >= 22);
    const nacht = startIdx === -1 ? [] : alle.slice(startIdx, startIdx + 10);
    if (!nacht.length) continue;

    const minGevoel = Math.round(Math.min(...nacht.map((u) => u.gevoel ?? u.temp ?? 99)));
    const nachtRegen = Math.round(nacht.reduce((a, u) => a + (u.neerslag ?? 0), 0) * 10) / 10;
    const piekStoten = Math.round(Math.max(...nacht.map((u) => u.stoten ?? 0)));

    // Opzetvenster: droog blok van minstens twee uur tussen nu/14:00 en 20:00.
    const isVandaag = datum === vandaagKey;
    const opzetUren = dagUren.filter(
      (u) => u.uur >= (isVandaag ? Math.max(nu.getHours(), 12) : 12) && u.uur < 20
    );
    let opzetUur = null;
    for (let i = 0; i < opzetUren.length - 1; i++) {
      if ((opzetUren[i].neerslag ?? 0) <= 0.05 && (opzetUren[i + 1].neerslag ?? 0) <= 0.05) {
        opzetUur = opzetUren[i].uur;
        break;
      }
    }

    const factoren = [];
    let zin;
    if (piekStoten >= inst.stootGrens) {
      factoren.push({ punten: piekStoten >= inst.stootGrens + 20 ? 62 : 45, reden: T.redenStoten(piekStoten) });
      zin = T.statusStormig(piekStoten);
    } else if (nachtRegen >= 3) {
      factoren.push({ punten: nachtRegen >= 8 ? 48 : 32, reden: T.redenNat(Math.round(nachtRegen)) });
      zin = T.statusNat(Math.round(nachtRegen));
    } else if (minGevoel < inst.komfort - 3) {
      factoren.push({ punten: 52, reden: T.redenKoud(minGevoel) });
      zin = T.statusKoud(minGevoel);
    } else if (minGevoel < inst.komfort) {
      factoren.push({ punten: 34, reden: T.redenKoud(minGevoel) });
      zin = T.statusKoud(minGevoel);
    } else {
      factoren.push({ punten: 10, reden: T.redenPrima });
      zin = T.statusPrima(minGevoel);
    }
    if (inst.staat === 0 && opzetUur == null) {
      factoren.push({ punten: 14, reden: T.redenOpzet });
      if (factoren[0].punten <= 12) zin = T.statusOpzetNat;
    }

    let metricZin;
    if (inst.staat === 1) metricZin = T.metricStaat;
    else if (opzetUur != null) metricZin = T.metricOpzet(String(opzetUur).padStart(2, "0"));
    else metricZin = T.metricGeenOpzet;

    const { score, redenen } = maakScore(factoren);
    const conditie = { score: clamp(score, 0, 100), redenen, advies: adviesVoorScore(clamp(score, 0, 100), kamperen.adviesLabels) };

    dagenUit.push({
      datum,
      antwoord: { ja: score < 45, zin },
      uren: nacht.map((u) => ({
        uur: u.uur,
        score: (u.neerslag ?? 0) > 0.3 ? 15 : (u.stoten ?? 0) >= inst.stootGrens ? 20 : (u.gevoel ?? 10) < inst.komfort ? 55 : 90,
        nat: (u.neerslag ?? 0) > 0.1,
      })),
      venster: null,
      metric: { zin: metricZin },
      conditie,
      status: { soort: "info", zin },
    });
  }

  return { dagen: dagenUit };
}

export const kamperen = {
  id: "kamperen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#C24E3F",
  locatieHint: T.locatieHint,
  icoon: "tent",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: KAMPEER_DEFAULTS },
  instellingen: {
    defaults: KAMPEER_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "tent",
        vraag: T.instTentVraag,
        keuzes: [
          { label: T.instTentKeuzes[0], zet: { stootGrens: 45 } },
          { label: T.instTentKeuzes[1], zet: { stootGrens: 55 } },
          { label: T.instTentKeuzes[2], zet: { stootGrens: 70 } },
        ],
      },
      {
        type: "keuze",
        id: "komfort",
        vraag: T.instComfortVraag,
        keuzes: [
          { label: T.instComfortKeuzes[0], zet: { komfort: 10 } },
          { label: T.instComfortKeuzes[1], zet: { komfort: 6 } },
          { label: T.instComfortKeuzes[2], zet: { komfort: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "staat",
        vraag: T.instStaVraag,
        keuzes: [
          { label: T.instStaKeuzes[0], zet: { staat: 0 } },
          { label: T.instStaKeuzes[1], zet: { staat: 1 } },
        ],
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
