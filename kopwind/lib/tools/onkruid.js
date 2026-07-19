/**
 * lib/tools/onkruid.js
 *
 * De onkruidcheck (v3.28.0 "Ostria"). De originele hoek: er zijn twee
 * methoden met TEGENGESTELDE weerwensen. Schoffelen (en branden) wil
 * een droge, liefst zonnige dag zodat het losgeschoffelde onkruid op
 * de grond verdroogt; regen kort erna laat het gewoon herwortelen.
 * Wieden (met de hand trekken) wil juist vochtige, zachte grond: dan
 * komt de wortel heel mee, en uit droge zomerharde grond breekt hij
 * af. De motor scoort beide en adviseert de methode van de dag; wie
 * een vaste methode instelt krijgt alleen dat oordeel.
 *
 * Brander-instelling: onkruidbranden bij stevige wind is vragen om
 * ellende (vonken, en de vlam wil niet op het onkruid blijven), dus
 * dan hangt er een veiligheidsnoot aan het antwoord. Affiliate null:
 * uitrol gepauzeerd; schoffels en voegkrabbers staan klaar als
 * kandidaat zodra die aan gaat.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "onkruid",
    naam: "Kan ik vandaag onkruid aanpakken?",
    korteVraag: "Kan ik vandaag onkruid aanpakken?",
    meldingKort: "Onkruidcheck",
    cta: "Check de onkruiddag",
    navLabel: "Onkruid",
    diepte: "Schoffelen wil droog en zon, wieden wil vochtige grond: de check kiest de methode van de dag.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Prima onkruiddag", goed: "Goed te doen", twijfelachtig: "Kan, met beleid", matig: "Weinig zinvol vandaag", "zeer-slecht": "Laat het onkruid staan" },
    adviesLabels: { goed: "onkruiddag", matig: "kan, met beleid", slecht: "geen onkruiddag" },
    legenda: { links: "laten staan", rechts: "aanpakken" },
    statusSchoffel: "Schoffeldag: droog en licht genoeg, het losgeschoffelde onkruid verdroogt op de grond.",
    statusWied: "Wieddag: de grond is vochtig, wortels komen makkelijk en heel mee.",
    statusSchoffelLater: (regenUur) => `Schoffelen kan, maar rond ${regenUur}:00 komt regen: wat je nu losschoffelt, wortelt dan gewoon weer aan. Wieden is vandaag de betere keuze.`,
    statusNat: "Vandaag even niet: het regent te veel om buiten zinvol aan het onkruid te werken.",
    statusDroogHard: "De grond is zomerhard: wieden breekt de wortels af. Schoffelen of wachten op een bui is nu slimmer.",
    statusVorst: "Laat het onkruid staan: bij vorst groeit het toch niet en de grond laat zich niet bewerken.",
    redenSchoffelWeer: "droog met zon: geschoffeld onkruid verdroogt",
    redenRegenKomt: (uur) => `regen op komst rond ${uur}:00: losgeschoffeld onkruid wortelt weer aan`,
    redenVochtig: "vochtige grond: wortels komen heel mee",
    redenDroogHard: "droge, harde grond: wortels breken bij het trekken",
    redenNat: "te nat om buiten te werken",
    redenVorst: "bevroren grond",
    branderNoot: (w) => ` Laat de brander vandaag staan: met ${w} km/u wind is dat geen doen.`,
    instMethodeVraag: "Hoe pak jij onkruid aan?",
    instMethodeKeuzes: ["Vooral schoffelen", "Maakt niet uit", "Vooral wieden (met de hand)"],
    instGrondVraag: "Wat voor grond heb je?",
    instGrondKeuzes: ["Zandgrond", "Gemengd of geen idee", "Kleigrond"],
    instBranderVraag: "Gebruik je een onkruidbrander?",
    instBranderKeuzes: ["Nee", "Ja"],
    instUitleg:
      "Schoffelen en wieden willen tegengesteld weer: droog en zonnig tegenover vochtige grond. Op 'maakt niet uit' adviseert de check de methode van de dag. Kleigrond wordt bij droogte sneller te hard om te wieden; de brander krijgt een windwaarschuwing.",
  },
  en: {
    slug: "weeding",
    naam: "Can I tackle the weeds today?",
    korteVraag: "Can I tackle the weeds today?",
    meldingKort: "Weeding check",
    cta: "Check the weeding day",
    navLabel: "Weeding",
    diepte: "Hoeing wants dry and sunny, hand-weeding wants moist soil: the check picks the method of the day.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Fine weeding day", goed: "Good to go", twijfelachtig: "Doable with care", matig: "Little point today", "zeer-slecht": "Leave the weeds be" },
    adviesLabels: { goed: "weeding day", matig: "doable with care", slecht: "no weeding day" },
    legenda: { links: "leave them", rechts: "tackle them" },
    statusSchoffel: "Hoeing day: dry and bright enough, hoed weeds shrivel where they lie.",
    statusWied: "Hand-weeding day: the soil is moist, roots come out whole and easily.",
    statusSchoffelLater: (regenUur) => `Hoeing works, but rain arrives around ${regenUur}:00: whatever you hoe loose simply roots again. Hand-weeding is the better pick today.`,
    statusNat: "Not today: it rains too much to do useful weeding outside.",
    statusDroogHard: "The soil is summer-hard: pulling snaps the roots. Hoeing or waiting for a shower is smarter now.",
    statusVorst: "Leave the weeds be: in frost they don't grow anyway and the soil won't be worked.",
    redenSchoffelWeer: "dry with sun: hoed weeds shrivel",
    redenRegenKomt: (uur) => `rain coming around ${uur}:00: hoed weeds root again`,
    redenVochtig: "moist soil: roots come out whole",
    redenDroogHard: "dry, hard soil: roots snap when pulling",
    redenNat: "too wet to work outside",
    redenVorst: "frozen ground",
    branderNoot: (w) => ` Leave the weed burner today: at ${w} km/h of wind that's no good.`,
    instMethodeVraag: "How do you tackle weeds?",
    instMethodeKeuzes: ["Mostly hoeing", "Either way", "Mostly hand-weeding"],
    instGrondVraag: "What soil do you have?",
    instGrondKeuzes: ["Sandy soil", "Mixed or no idea", "Clay soil"],
    instBranderVraag: "Do you use a weed burner?",
    instBranderKeuzes: ["No", "Yes"],
    instUitleg:
      "Hoeing and hand-weeding want opposite weather: dry and sunny versus moist soil. On 'either way' the check advises the method of the day. Clay turns too hard for pulling in drought sooner; the burner gets a wind warning.",
  },
});

export const ONKRUID_DEFAULTS = { methode: 0, grond: 0, brander: 0 };
// methode: -1 schoffelen, 0 allebei, 1 wieden. grond: -1 zand, 0 gemengd, 1 klei.

function werkUren(uren, uurNu) {
  return uren.filter((u) => u.uur >= Math.max(8, uurNu) && u.uur < 20);
}

export function overlay(hourly, nu = new Date(), instellingen = ONKRUID_DEFAULTS) {
  const inst = { ...ONKRUID_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const vandaagKey = dagKeyVan(nu);
  const datums = [...perDag.keys()].filter((d) => d >= vandaagKey).sort().slice(0, 5);

  const dagenUit = [];
  for (const datum of datums) {
    const alleUren = perDag.get(datum) ?? [];
    if (!alleUren.length) continue;
    const isVandaag = datum === vandaagKey;
    const uurNu = isVandaag ? nu.getHours() : 0;
    const uren = werkUren(alleUren, uurNu);
    if (!uren.length && isVandaag) continue;
    const bron = uren.length ? uren : werkUren(alleUren, 0);

    const minTemp = Math.min(...alleUren.map((u) => u.temp ?? u.gevoel ?? 99));
    const natNu = bron.filter((u) => (u.neerslag ?? 0) > 0.1).length;
    const regenSom = bron.reduce((a, u) => a + (u.neerslag ?? 0), 0);
    const eersteBui = bron.find((u) => (u.neerslag ?? 0) >= 0.3 || (u.kans ?? 0) >= 70) ?? null;
    const zonnig = bron.reduce((a, u) => a + (u.bewolking ?? 60), 0) / bron.length <= 55;
    const maxGevoel = Math.max(...bron.map((u) => u.gevoel ?? u.temp ?? 0));
    const gemWind = Math.round(bron.reduce((a, u) => a + (u.wind ?? 0), 0) / bron.length);
    // Vocht-proxy zonder bodemdata: regen eerder op de dag, een nat
    // uur, of een klamme dag (hoge RV zonder zon).
    const eerderNat = alleUren.some((u) => u.uur < uurNu && (u.neerslag ?? 0) > 0.2);
    const rvHoog = bron.reduce((a, u) => a + (u.rh ?? 60), 0) / bron.length >= 78;
    const grondVochtig = eerderNat || natNu > 0 || rvHoog;
    const zomerHard = !grondVochtig && maxGevoel >= 24;

    // Schoffelpijn: wil droog + zon + geen regen erna. Op vochtige
    // grond verdroogt geschoffeld onkruid niet en wortelt het weer
    // aan, dus dan wint wieden.
    let schoffel = zonnig ? 8 : 18;
    if (grondVochtig) schoffel += 14;
    if (eersteBui) schoffel += 30;
    if (regenSom >= 1.5 || natNu >= 3) schoffel = 65;
    // Wiedpijn: wil vochtige grond.
    let wied = grondVochtig ? 10 : 30;
    if (zomerHard) wied = inst.grond === 1 ? 55 : 45;
    if (regenSom >= 2.5 || natNu >= 4) wied = 60;
    if (minTemp <= 0) {
      schoffel = 75;
      wied = 75;
    }
    schoffel = clamp(schoffel, 0, 100);
    wied = clamp(wied, 0, 100);

    const keuzeWied = inst.methode === 1 || (inst.methode === 0 && wied < schoffel);
    const pijn = inst.methode === -1 ? schoffel : inst.methode === 1 ? wied : Math.min(schoffel, wied);

    const factoren = [];
    let zin;
    if (minTemp <= 0) {
      zin = T.statusVorst;
      factoren.push({ punten: pijn, reden: T.redenVorst });
    } else if (regenSom >= 2.5 || natNu >= 4) {
      zin = T.statusNat;
      factoren.push({ punten: pijn, reden: T.redenNat });
    } else if (keuzeWied) {
      if (zomerHard && inst.methode === 1) {
        zin = T.statusDroogHard;
        factoren.push({ punten: pijn, reden: T.redenDroogHard });
      } else {
        zin = T.statusWied;
        factoren.push({ punten: pijn, reden: T.redenVochtig });
      }
    } else if (eersteBui && inst.methode === -1) {
      zin = T.statusSchoffelLater(String(eersteBui.uur).padStart(2, "0"));
      factoren.push({ punten: pijn, reden: T.redenRegenKomt(String(eersteBui.uur).padStart(2, "0")) });
    } else {
      zin = T.statusSchoffel;
      factoren.push({ punten: pijn, reden: T.redenSchoffelWeer });
    }
    if (inst.brander === 1 && gemWind >= 20 && minTemp > 0) {
      zin += T.branderNoot(gemWind);
    }

    const { score, redenen } = maakScore(factoren);
    const conditie = { score, redenen, advies: adviesVoorScore(score, onkruid.adviesLabels) };

    dagenUit.push({
      datum,
      antwoord: { ja: score < 45, zin },
      uren: bron.map((u) => ({
        uur: u.uur,
        score: (u.neerslag ?? 0) > 0.1 ? 0 : (u.bewolking ?? 60) <= 55 ? 95 : 70,
        nat: (u.neerslag ?? 0) > 0.1,
      })),
      venster: null,
      metric: null,
      conditie,
      status: { soort: "info", zin },
    });
  }

  return { dagen: dagenUit };
}

export const onkruid = {
  id: "onkruid",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#5A7D3C",
  locatieHint: T.locatieHint,
  icoon: "schoffel",
  categorieId: "tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: ONKRUID_DEFAULTS },
  instellingen: {
    defaults: ONKRUID_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "methode",
        vraag: T.instMethodeVraag,
        keuzes: [
          { label: T.instMethodeKeuzes[0], zet: { methode: -1 } },
          { label: T.instMethodeKeuzes[1], zet: { methode: 0 } },
          { label: T.instMethodeKeuzes[2], zet: { methode: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "grond",
        vraag: T.instGrondVraag,
        keuzes: [
          { label: T.instGrondKeuzes[0], zet: { grond: -1 } },
          { label: T.instGrondKeuzes[1], zet: { grond: 0 } },
          { label: T.instGrondKeuzes[2], zet: { grond: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "brander",
        vraag: T.instBranderVraag,
        keuzes: [
          { label: T.instBranderKeuzes[0], zet: { brander: 0 } },
          { label: T.instBranderKeuzes[1], zet: { brander: 1 } },
        ],
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
