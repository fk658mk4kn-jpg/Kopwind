/**
 * lib/tools/zonnepanelen.js
 *
 * De panelencheck (v3.17.0 "Passaat"), een dagmodel in plaats van een
 * venstermodel: de vraag is niet "wanneer kan ik naar buiten" maar
 * "wat voor opbrengstdag wordt dit". De score is een relatieve
 * dag-indicatie op basis van bewolking en daglengte; bewust geen kWh
 * en geen paneelvermogen, want dat verschilt per dak en per
 * installatie. Het zonnigste blok wordt wel benoemd: dat is het moment
 * voor de wasmachine, de vaatwasser of het laden van de auto.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { jaVoor } from "../engine/schaal.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const pad2 = (n) => String(n).padStart(2, "0");

const T = kies({
  nl: {
    slug: "zonnepanelen",
    naam: "Leveren mijn zonnepanelen vandaag veel op?",
    korteVraag: "Leveren mijn zonnepanelen vandaag veel op?",
    meldingKort: "Panelencheck",
    cta: "Check de opbrengstdag",
    navLabel: "Zonnepanelen",
    diepte: "Wat voor opbrengstdag het wordt, en wanneer het zonnigste blok valt.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Topdag voor de panelen", goed: "Goede opbrengstdag", twijfelachtig: "Wisselvallige opbrengst", matig: "Magere opbrengst", "zeer-slecht": "Mager: dik wolkendek" },
    adviesLabels: { goed: "een goede opbrengstdag", matig: "een wisselvallige opbrengstdag", slecht: "een magere opbrengstdag" },
    legenda: { links: "dik wolkendek", rechts: "volle zon" },
    redenHelder: (p) => `vrijwel onbewolkte dag (bewolking rond ${p}%)`,
    redenWisselend: (p) => `wisselend wolkendek drukt de opbrengst (rond ${p}%)`,
    redenBewolkt: (p) => `dik wolkendek: weinig direct zonlicht (rond ${p}%)`,
    redenKorteDag: (u) => `korte dag: maar ${u} uur daglicht`,
    metric: (van, tot) => `Zonnigste blok ${van}:00-${tot}:00: het moment voor wasmachine of laden.`,
    metricUur: (uur) => `Zonnigste moment rond ${uur}:00.`,
    statusJaVandaag: (van, tot) => `Goede opbrengstdag: plan grootverbruikers in het blok ${van}:00-${tot}:00.`,
    statusTwijfelVandaag: "Wisselvallige opbrengst: pak het zonnigste blok voor de wasmachine.",
    statusNeeVandaag: "Magere opbrengstdag: het wolkendek houdt de zon tegen.",
    statusJa: (van, tot) => `Die dag een goede opbrengst, zonnigste blok ${van}:00-${tot}:00.`,
    statusTwijfel: "Die dag wisselvallige opbrengst.",
    statusNee: "Die dag magere opbrengst.",
    instOrientatieVraag: "Hoe liggen je panelen?",
    instOrientatieKeuzes: ["Op het zuiden", "Oost-west"],
    instDagStart: "Meetellen vanaf",
    instDagEind: "Meetellen tot",
    instUur: "uur",
    instUitleg:
      "De check geeft een relatieve dag-indicatie op basis van bewolking en daglengte, geen kWh: dat hangt af van je dak, het aantal panelen en de omvormer. Panelen op het zuiden pieken rond het middaguur; een oost-westopstelling verdeelt de opbrengst over de dag. De statusregel noemt het zonnigste blok: het moment voor wasmachine, vaatwasser of het laden van de auto.",
  },
  en: {
    slug: "solar-panels",
    naam: "Big solar yield today?",
    korteVraag: "Big solar yield today?",
    meldingKort: "Solar check",
    cta: "Check the yield day",
    navLabel: "Solar panels",
    diepte: "What kind of yield day it will be, and when the sunniest block falls.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Top day for the panels", goed: "Good yield day", twijfelachtig: "Patchy yield", matig: "Meagre yield", "zeer-slecht": "Meagre: thick cloud deck" },
    adviesLabels: { goed: "a good yield day", matig: "a patchy yield day", slecht: "a meagre yield day" },
    legenda: { links: "thick cloud", rechts: "full sun" },
    redenHelder: (p) => `virtually cloudless day (cloud around ${p}%)`,
    redenWisselend: (p) => `broken cloud cuts the yield (around ${p}%)`,
    redenBewolkt: (p) => `thick cloud deck: little direct sunlight (around ${p}%)`,
    redenKorteDag: (u) => `short day: only ${u} hours of daylight`,
    metric: (van, tot) => `Sunniest block ${van}:00-${tot}:00: the moment for laundry or charging.`,
    metricUur: (uur) => `Sunniest moment around ${uur}:00.`,
    statusJaVandaag: (van, tot) => `Good yield day: plan heavy appliances in the ${van}:00-${tot}:00 block.`,
    statusTwijfelVandaag: "Patchy yield: use the sunniest block for the washing machine.",
    statusNeeVandaag: "Meagre yield day: the cloud deck blocks the sun.",
    statusJa: (van, tot) => `A good yield that day, sunniest block ${van}:00-${tot}:00.`,
    statusTwijfel: "Patchy yield that day.",
    statusNee: "Meagre yield that day.",
    instOrientatieVraag: "How do your panels face?",
    instOrientatieKeuzes: ["South-facing", "East-west"],
    instDagStart: "Count from",
    instDagEind: "Count until",
    instUur: "h",
    instUitleg:
      "The check gives a relative day indication based on cloud cover and day length, not kWh: that depends on your roof, panel count and inverter. South-facing panels peak around midday; an east-west setup spreads the yield across the day. The status line names the sunniest block: the moment for laundry, dishwasher or charging the car.",
  },
});

export const PANEEL_DEFAULTS = {
  zuid: true,
  dagStart: 8,
  dagEind: 20,
};

/** Zonfactor per uur: 1 bij strakblauw, 0 bij dicht wolkendek of nacht. */
export function uurZonFactor(u) {
  if (!u.dag) return 0;
  return clamp(1 - (u.bewolking ?? 60) / 100, 0, 1);
}

function zonnigsteBlok(uren) {
  const blokken = [];
  let blok = [];
  for (const u of uren) {
    if (u.dag && u.zonfactor >= 0.55) {
      blok.push(u);
    } else if (blok.length) {
      blokken.push(blok);
      blok = [];
    }
  }
  if (blok.length) blokken.push(blok);
  let beste = null;
  for (const b of blokken) {
    if (b.length < 2) continue;
    const som = b.reduce((a, u) => a + u.zonfactor, 0);
    if (!beste || som > beste.som) {
      beste = { van: b[0].uur, tot: b[b.length - 1].uur + 1, uren: b.length, som };
    }
  }
  return beste;
}

export function overlay(hourly, nu = new Date(), instellingen = PANEEL_DEFAULTS) {
  const inst = { ...PANEEL_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, inst.dagStart, inst.dagEind);
  const vandaagKey = dagKeyVan(nu);

  const dagen = [];
  for (const [datum, dagUren] of perDag) {
    if (datum < vandaagKey) continue;
    dagen.push({ datum, dagUren });
  }
  dagen.sort((a, b) => (a.datum < b.datum ? -1 : 1));

  const dagenUit = dagen.slice(0, 5).map(({ datum, dagUren }) => {
    const uren = dagUren.map((u) => ({
      ...u,
      zonfactor: uurZonFactor(u),
      nat: (u.neerslag ?? 0) > 0.05,
    }));
    const dagUrenLicht = uren.filter((u) => u.dag);

    // Gewogen gemiddelde zonfactor: zuid-panelen pieken rond het
    // middaguur, dus daar tellen de middaguren zwaarder; oost-west
    // telt alle daglichturen gelijk.
    let somGewicht = 0;
    let somFactor = 0;
    for (const u of dagUrenLicht) {
      const gewicht = inst.zuid && u.uur >= 11 && u.uur <= 15 ? 2 : 1;
      somGewicht += gewicht;
      somFactor += u.zonfactor * gewicht;
    }
    const gemFactor = somGewicht ? somFactor / somGewicht : 0;
    const gemBewolking = Math.round(
      dagUrenLicht.length
        ? dagUrenLicht.reduce((a, u) => a + (u.bewolking ?? 60), 0) / dagUrenLicht.length
        : 100
    );

    const factoren = [];
    if (gemFactor >= 0.75) {
      factoren.push({ punten: Math.round((1 - gemFactor) * 40), reden: T.redenHelder(gemBewolking) });
    } else if (gemFactor >= 0.45) {
      factoren.push({ punten: Math.round((1 - gemFactor) * 62), reden: T.redenWisselend(gemBewolking) });
    } else {
      factoren.push({ punten: Math.round((1 - gemFactor) * 78), reden: T.redenBewolkt(gemBewolking) });
    }
    if (dagUrenLicht.length > 0 && dagUrenLicht.length < 9) {
      factoren.push({ punten: 10, reden: T.redenKorteDag(dagUrenLicht.length) });
    }

    const { score, redenen } = maakScore(factoren);
    const conditie = { score, redenen, advies: adviesVoorScore(score, zonnepanelen.adviesLabels) };

    const blok = zonnigsteBlok(uren);
    const ja = jaVoor(score);
    const twijfel = !ja && score >= 45;
    const isVandaag = datum === vandaagKey;

    let zin;
    if (ja && blok) {
      zin = (isVandaag ? T.statusJaVandaag : T.statusJa)(pad2(blok.van), pad2(blok.tot));
    } else if (ja || twijfel) {
      zin = isVandaag ? T.statusTwijfelVandaag : T.statusTwijfel;
    } else {
      zin = isVandaag ? T.statusNeeVandaag : T.statusNee;
    }
    const status = { soort: "info", zin };

    const top = dagUrenLicht.length
      ? dagUrenLicht.reduce((a, u) => (u.zonfactor > a.zonfactor ? u : a), dagUrenLicht[0])
      : null;
    const metric = blok
      ? { zin: T.metric(pad2(blok.van), pad2(blok.tot)) }
      : top
        ? { zin: T.metricUur(pad2(top.uur)) }
        : null;

    return {
      datum,
      antwoord: { ja, zin },
      uren: uren.map((u) => ({ uur: u.uur, score: Math.round(u.zonfactor * 100), nat: u.nat })),
      venster: blok ? { van: blok.van, tot: blok.tot, uren: blok.uren } : null,
      metric,
      conditie,
      status,
    };
  });

  return { legenda: T.legenda, dagen: dagenUit };
}

export const zonnepanelen = {
  id: "zonnepanelen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#8C6239",
  locatieHint: T.locatieHint,
  icoon: "zonnepaneel",
  categorieId: "huis-tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: PANEEL_DEFAULTS },
  instellingen: {
    defaults: PANEEL_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "orientatie",
        vraag: T.instOrientatieVraag,
        keuzes: [
          { label: T.instOrientatieKeuzes[0], zet: { zuid: true } },
          { label: T.instOrientatieKeuzes[1], zet: { zuid: false } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 6, max: 10 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 17, max: 22 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-16",
  affiliate: null,
};
