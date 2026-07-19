/**
 * lib/tools/strooien.js
 *
 * De strooicheck (v3.30.0 "Mistral"): moet ik vanavond of vannacht
 * strooien of sneeuwruimen op mijn eigen stoep en oprit? Bewust iets
 * anders dan de gladheidscheck: die gaat over jouw reisrisico onderweg,
 * deze over de proactieve actie thuis. De motor kijkt naar de nacht die
 * volgt: vriest het en is het oppervlak nat (recente neerslag of hoge
 * luchtvochtigheid), dan vriezen natte tegels aan en is preventief
 * strooien slim. Valt er 's nachts sneeuw, dan is het ruimen. En hij
 * noemt het beste strooimoment: net voordat het onder nul zakt.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "strooien",
    naam: "Moet ik vannacht strooien?",
    korteVraag: "Moet ik vannacht strooien?",
    meldingKort: "Strooicheck",
    cta: "Check de strooinacht",
    navLabel: "Strooien",
    diepte: "De nacht beoordeeld: aanvriezende tegels of verse sneeuw op je eigen paden.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Niets te doen", goed: "Rustige nacht", twijfelachtig: "Houd het in de gaten", matig: "Strooien of ruimen aan te raden", "zeer-slecht": "Strooi en ruim op tijd" },
    adviesLabels: { goed: "niets te doen", matig: "strooien aan te raden", slecht: "strooi en ruim op tijd" },
    legenda: { links: "strooien en ruimen", rechts: "niets te doen" },
    statusNiets: (min) => `Rustige nacht (minimum rond ${min} graden, droog): niets te strooien of te ruimen.`,
    statusVorstDroog: (min) => `Het vriest licht (rond ${min} graden), maar de tegels zijn droog: strooien is meestal niet nodig. Houd natte plekken en bruggen in de gaten.`,
    statusStrooien: (min, uur) => `Aanvriezende gladheid op komst (rond ${min} graden, natte tegels). Strooi je stoep en oprit het best rond ${uur}:00, net voordat het onder nul zakt.`,
    statusSneeuw: (cm) => `Er valt vannacht sneeuw (rond ${cm} cm): ruim de stoep 's ochtends vroeg en strooi daarna, dan blijft hij begaanbaar.`,
    statusBeide: (cm) => `Sneeuw (rond ${cm} cm) en vorst vannacht: ruim vroeg en strooi na, anders vriest de aangetrapte sneeuw vast tot ijs.`,
    redenNiets: "geen vorst of sneeuw van betekenis",
    redenVorstDroog: (min) => `lichte vorst (rond ${min} graden) op droge tegels`,
    redenStrooien: (min) => `aanvriezende natte tegels (rond ${min} graden)`,
    redenSneeuw: (cm) => `verse sneeuw (rond ${cm} cm)`,
    redenNatDag: "de tegels zijn nat van de regen van vandaag en gaan vannacht aanvriezen",
    metricMoment: (uur) => `Beste strooimoment: rond ${uur}:00, vlak voordat de temperatuur onder nul zakt.`,
    metricGeen: "Geen strooimoment nodig vannacht.",
    instDoelVraag: "Waar wil je op letten?",
    instDoelKeuzes: ["Alleen gladheid voorkomen", "Alleen sneeuw ruimen", "Allebei"],
    instOppervlakVraag: "Hoe groot is het oppervlak?",
    instOppervlakKeuzes: ["Klein (alleen de stoep)", "Gemiddeld (stoep en oprit)", "Groot (lange oprit of pad)"],
    instMomentVraag: "Wanneer moet het begaanbaar zijn?",
    instMomentKeuzes: ["Voor de ochtendspits", "Pas overdag"],
    instUitleg:
      "Deze check gaat niet over de weg (dat is de gladheidscheck), maar over je eigen stoep en oprit. Hij beoordeelt de komende nacht: vriest het en zijn de tegels nat van regen of dauw, dan vriezen ze aan en is preventief strooien slim, het best net voordat het onder nul zakt. Op droge tegels bij lichte vorst hoeft dat meestal niet. Valt er sneeuw, dan is vroeg ruimen en daarna strooien het handigst, anders trap je de sneeuw vast tot ijs. In Nederland ben je als bewoner mede verantwoordelijk voor een begaanbare stoep.",
  },
  en: {
    slug: "gritting",
    naam: "Should I grit tonight?",
    korteVraag: "Should I grit tonight?",
    meldingKort: "Gritting check",
    cta: "Check the gritting night",
    navLabel: "Gritting",
    diepte: "The night judged: freezing tiles or fresh snow on your own paths.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Nothing to do", goed: "Quiet night", twijfelachtig: "Keep an eye out", matig: "Gritting or clearing advised", "zeer-slecht": "Grit and clear in good time" },
    adviesLabels: { goed: "nothing to do", matig: "gritting advised", slecht: "grit and clear in good time" },
    legenda: { links: "grit and clear", rechts: "nothing to do" },
    statusNiets: (min) => `Quiet night (minimum around ${min} degrees, dry): nothing to grit or clear.`,
    statusVorstDroog: (min) => `Light frost (around ${min} degrees), but the tiles are dry: gritting usually isn't needed. Watch damp spots and bridges.`,
    statusStrooien: (min, uur) => `Freezing slipperiness ahead (around ${min} degrees, wet tiles). Best grit your path around ${uur}:00, just before it drops below zero.`,
    statusSneeuw: (cm) => `Snow falls tonight (around ${cm} cm): clear the pavement early morning and grit after, to keep it passable.`,
    statusBeide: (cm) => `Snow (around ${cm} cm) and frost tonight: clear early and grit after, or trodden snow freezes to ice.`,
    redenNiets: "no frost or snow of note",
    redenVorstDroog: (min) => `light frost (around ${min} degrees) on dry tiles`,
    redenStrooien: (min) => `freezing wet tiles (around ${min} degrees)`,
    redenSneeuw: (cm) => `fresh snow (around ${cm} cm)`,
    redenNatDag: "the tiles are wet from today's rain and will freeze tonight",
    metricMoment: (uur) => `Best gritting moment: around ${uur}:00, just before the temperature drops below zero.`,
    metricGeen: "No gritting moment needed tonight.",
    instDoelVraag: "What do you want to watch?",
    instDoelKeuzes: ["Only prevent slipperiness", "Only clear snow", "Both"],
    instOppervlakVraag: "How large is the surface?",
    instOppervlakKeuzes: ["Small (just the pavement)", "Medium (pavement and drive)", "Large (long drive or path)"],
    instMomentVraag: "When must it be passable?",
    instMomentKeuzes: ["Before the morning rush", "Only during the day"],
    instUitleg:
      "This check isn't about the road (that's the slipperiness check), but about your own pavement and drive. It judges the coming night: if it freezes and the tiles are wet from rain or dew, they'll freeze over and preventive gritting is smart, best just before it drops below zero. On dry tiles in light frost that usually isn't needed. If snow falls, clearing early and gritting after works best, or you tread the snow into ice.",
  },
});

export const STROOI_DEFAULTS = { doel: 2, oppervlak: 1, moment: 0 };
// doel: 0 preventief strooien, 1 sneeuw ruimen, 2 beide.

export function overlay(hourly, nu = new Date(), instellingen = STROOI_DEFAULTS) {
  const inst = { ...STROOI_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const vandaagKey = dagKeyVan(nu);
  const alle = basis.filter((u) => u.datum >= vandaagKey);
  const datums = [...perDag.keys()].filter((d) => d >= vandaagKey).sort().slice(0, 5);

  const dagenUit = [];
  for (const datum of datums) {
    const dagUren = perDag.get(datum) ?? [];
    if (!dagUren.length) continue;
    const startIdx = alle.findIndex((u) => u.datum === datum && u.uur >= 20);
    const nacht = startIdx === -1 ? [] : alle.slice(startIdx, startIdx + 12);
    if (!nacht.length) continue;

    const minTemp = Math.min(...nacht.map((u) => u.temp ?? 99));
    const snowCm = Math.round(nacht.reduce((a, u) => a + (u.sneeuw ?? 0), 0) * 10) / 10;
    // Nat oppervlak: neerslag in de nacht, of hoge luchtvochtigheid rond
    // het vriespunt (dauw/rijp), of de tegels waren nat van de dag.
    const nachtNat = nacht.some((u) => (u.neerslag ?? 0) > 0.2);
    const rijp = nacht.some((u) => (u.rh ?? 0) >= 92 && (u.temp ?? 9) <= 2);
    const dagNat = dagUren.some((u) => (u.neerslag ?? 0) > 0.5 && u.uur >= 12);
    const natOppervlak = nachtNat || rijp || dagNat;
    // Strooimoment: het uur vlak voordat de temperatuur onder nul zakt.
    const eersteVorstIdx = nacht.findIndex((u) => (u.temp ?? 9) <= 0);
    const strooiUur = eersteVorstIdx > 0 ? nacht[eersteVorstIdx - 1].uur : nacht[0].uur;

    const factoren = [];
    let zin;
    const wilStrooien = inst.doel !== 1;
    const wilRuimen = inst.doel !== 0;

    let painGlad = 0;
    if (wilStrooien && minTemp <= 0 && (natOppervlak || minTemp <= -3)) {
      painGlad = minTemp <= -5 ? 70 : minTemp <= -2 ? 58 : 48;
    }
    let painSneeuw = 0;
    if (wilRuimen && snowCm >= 1) {
      painSneeuw = snowCm >= 5 ? 72 : snowCm >= 2 ? 58 : 46;
    }

    if (painSneeuw > 0 && painGlad > 0) {
      factoren.push({ punten: Math.max(painGlad, painSneeuw), reden: T.redenSneeuw(snowCm) });
      factoren.push({ punten: 6, reden: T.redenStrooien(Math.round(minTemp)) });
      zin = T.statusBeide(snowCm);
    } else if (painSneeuw > 0) {
      factoren.push({ punten: painSneeuw, reden: T.redenSneeuw(snowCm) });
      zin = T.statusSneeuw(snowCm);
    } else if (painGlad > 0) {
      factoren.push({ punten: painGlad, reden: T.redenStrooien(Math.round(minTemp)) });
      if (dagNat && !nachtNat) factoren.push({ punten: 4, reden: T.redenNatDag });
      zin = T.statusStrooien(Math.round(minTemp), String(strooiUur).padStart(2, "0"));
    } else if (wilStrooien && minTemp <= 0) {
      factoren.push({ punten: 22, reden: T.redenVorstDroog(Math.round(minTemp)) });
      zin = T.statusVorstDroog(Math.round(minTemp));
    } else {
      factoren.push({ punten: 8, reden: T.redenNiets });
      zin = T.statusNiets(Math.round(minTemp));
    }

    const { score, redenen } = maakScore(factoren);
    const s = clamp(score, 0, 100);
    const conditie = { score: s, redenen, advies: adviesVoorScore(s, strooien.adviesLabels) };
    const metricZin = s >= 45 && painGlad > 0
      ? T.metricMoment(String(strooiUur).padStart(2, "0"))
      : T.metricGeen;

    dagenUit.push({
      datum,
      antwoord: { ja: s < 45, zin },
      uren: nacht.map((u) => ({
        uur: u.uur,
        score:
          (u.sneeuw ?? 0) > 0.3
            ? 70
            : (u.temp ?? 9) <= 0 && ((u.neerslag ?? 0) > 0.1 || (u.rh ?? 0) >= 92)
            ? 60
            : (u.temp ?? 9) <= 0
            ? 30
            : 10,
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

export const strooien = {
  id: "strooien",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#44607A",
  locatieHint: T.locatieHint,
  icoon: "strooiwagen",
  categorieId: "winter",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: [...BASIS_VELDEN, "snowfall"],
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: STROOI_DEFAULTS },
  instellingen: {
    defaults: STROOI_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "doel",
        vraag: T.instDoelVraag,
        keuzes: [
          { label: T.instDoelKeuzes[0], zet: { doel: 0 } },
          { label: T.instDoelKeuzes[1], zet: { doel: 1 } },
          { label: T.instDoelKeuzes[2], zet: { doel: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "oppervlak",
        vraag: T.instOppervlakVraag,
        keuzes: [
          { label: T.instOppervlakKeuzes[0], zet: { oppervlak: 0 } },
          { label: T.instOppervlakKeuzes[1], zet: { oppervlak: 1 } },
          { label: T.instOppervlakKeuzes[2], zet: { oppervlak: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "moment",
        vraag: T.instMomentVraag,
        keuzes: [
          { label: T.instMomentKeuzes[0], zet: { moment: 0 } },
          { label: T.instMomentKeuzes[1], zet: { moment: 1 } },
        ],
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: {
    kop: { nl: "Op tijd gestrooid", en: "Gritted in time" },
    advies: {
      nl: "Wie voor de vorst strooit heeft de minste kans op gladde tegels; een emmer strooizout binnen handbereik en een schep voor de sneeuw zijn genoeg voor stoep en oprit. Strooi dun (een handvol per vierkante meter), meer werkt niet beter en is slecht voor je bestrating en de poten van huisdieren.",
      en: "Gritting before the frost gives the least chance of icy tiles; a bucket of grit within reach and a shovel for the snow are enough for pavement and driveway. Grit thinly, more doesn't work better.",
    },
    items: [
      { label: { nl: "Strooizout en sneeuwschep", en: "Grit and snow shovel" }, url: "https://www.bol.com/nl/nl/s/?searchtext=strooizout", partner: "bol.com" },
    ],
  },
};
