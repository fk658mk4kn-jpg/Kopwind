/**
 * lib/tools/schaatsen.js
 *
 * De natuurijscheck (v3.29.0 "Ghibli"). De gevoeligste check van de
 * site: mensen zakken elk jaar door het ijs. De motor doet daarom twee
 * dingen bewust NIET: hij meet geen ijsdikte (dat kan een weermodel
 * niet) en hij zegt nooit op eigen gezag dat het ijs betrouwbaar is.
 * Wat hij wel kan: het vorstpotentieel van de komende dagen wegen (de
 * vorstsom van de etmaalgemiddelden) en eerlijk zeggen of er ijsgroei
 * aan zit te komen, hoe ver het weg is, of dat de dooi het verhaal
 * bederft. Elke ja-achtige zin verwijst naar de ijsclub en de lokale
 * dikte als enige echte graadmeter.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "schaatsen",
    naam: "Komt er natuurijs aan?",
    korteVraag: "Komt er natuurijs aan?",
    meldingKort: "Natuurijscheck",
    cta: "Check de vorst",
    navLabel: "Natuurijs",
    diepte: "De vorstsom van de komende dagen: komt er ijsgroei aan of bederft de dooi het?",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Serieuze ijsgroei op komst", goed: "Vorst zet door", twijfelachtig: "Lichte vorst, geduld", matig: "Te zacht voor ijsgroei", "zeer-slecht": "Geen natuurijs in zicht" },
    adviesLabels: { goed: "ijsgroei op komst", matig: "lichte vorst, geduld", slecht: "geen natuurijs in zicht" },
    legenda: { links: "geen ijs", rechts: "ijsgroei" },
    statusGroei: (som) => `Serieuze ijsgroei op komst (vorstsom ${som} over de komende dagen). Of het ijs al draagt bepaalt alleen de ijsclub of een lokale dikte-meting: pas vanaf zo'n 10 tot 13 centimeter zwart ijs.`,
    statusZet: (som) => `De vorst zet door (vorstsom ${som}), maar ijs heeft dagen nodig. Volg de ijsclub en waag je niet op ongemeten ijs.`,
    statusLicht: "Lichte nachtvorst: goed voor een eerste vliesje, niet voor draagbaar ijs. Geduld.",
    statusDooi: (t) => `Dooi (het loopt op tot zo'n ${t} graden): bestaand ijs wordt onbetrouwbaar, juist nu extra oppassen.`,
    statusNiks: "Geen natuurijs in zicht: het blijft er te zacht voor.",
    statusSeizoen: "Buiten het natuurijsseizoen. Zodra er een vorstperiode aankomt zie je dat hier als eerste.",
    redenVorstsom: (som) => `vorstsom komende dagen: ${som}`,
    redenDooi: "dooi op komst: bestaand ijs verzwakt",
    redenZacht: "etmaalgemiddelden boven nul",
    redenSeizoen: "buiten het natuurijsseizoen",
    metricSom: (som, dagen) => `Vorstsom komende ${dagen} dagen: ${som} (som van de etmaalgemiddelden onder nul).`,
    instIjsVraag: "Waar hoop je te schaatsen?",
    instIjsKeuzes: ["Ondergelopen weiland (snelst ijs)", "Sloot of vaart", "Plas of meer (traagst)"],
    instKinderenVraag: "Gaan er kinderen mee?",
    instKinderenKeuzes: ["Nee", "Ja, extra voorzichtig"],
    instWanneerVraag: "Waar kijk je naar?",
    instWanneerKeuzes: ["De komende dagen", "Alleen dit weekend"],
    instUitleg:
      "Deze check meet geen ijsdikte; dat kan geen weermodel. Hij weegt het vorstpotentieel: de som van de etmaalgemiddelden onder nul over de komende dagen. Ondergelopen weilanden dragen het eerst, diepe plassen het laatst. Het enige echte ja komt van de ijsclub of een eigen meting: 10 tot 13 centimeter zwart ijs, en met kinderen liever meer.",
  },
  en: {
    slug: "ice-skating",
    naam: "Is natural ice on the way?",
    korteVraag: "Natural ice on the way?",
    meldingKort: "Natural ice check",
    cta: "Check the frost",
    navLabel: "Natural ice",
    diepte: "The frost sum of the coming days: is ice growth coming or does thaw spoil it?",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Serious ice growth coming", goed: "Frost holding on", twijfelachtig: "Light frost, patience", matig: "Too mild for ice growth", "zeer-slecht": "No natural ice in sight" },
    adviesLabels: { goed: "ice growth coming", matig: "light frost, patience", slecht: "no natural ice in sight" },
    legenda: { links: "no ice", rechts: "ice growth" },
    statusGroei: (som) => `Serious ice growth coming (frost sum ${som} over the coming days). Whether the ice carries is decided only by the ice club or a local thickness check: from about 10 to 13 centimetres of black ice.`,
    statusZet: (som) => `Frost is holding (frost sum ${som}), but ice needs days. Follow the ice club and stay off unmeasured ice.`,
    statusLicht: "Light night frost: good for a first film, not for bearing ice. Patience.",
    statusDooi: (t) => `Thaw (rising to about ${t} degrees): existing ice turns unreliable, extra care right now.`,
    statusNiks: "No natural ice in sight: it stays too mild.",
    statusSeizoen: "Outside the natural ice season. The moment a frost spell approaches, you'll see it here first.",
    redenVorstsom: (som) => `frost sum coming days: ${som}`,
    redenDooi: "thaw coming: existing ice weakens",
    redenZacht: "daily averages above zero",
    redenSeizoen: "outside the natural ice season",
    metricSom: (som, dagen) => `Frost sum next ${dagen} days: ${som} (sum of sub-zero daily averages).`,
    instIjsVraag: "Where do you hope to skate?",
    instIjsKeuzes: ["Flooded meadow (fastest ice)", "Ditch or canal", "Lake (slowest)"],
    instKinderenVraag: "Are children coming along?",
    instKinderenKeuzes: ["No", "Yes, extra careful"],
    instWanneerVraag: "What are you watching?",
    instWanneerKeuzes: ["The coming days", "This weekend only"],
    instUitleg:
      "This check measures no ice thickness; no weather model can. It weighs frost potential: the sum of sub-zero daily averages over the coming days. Flooded meadows carry first, deep lakes last. The only real yes comes from the ice club or your own measurement: 10 to 13 centimetres of black ice, more with children.",
  },
});

export const SCHAATS_DEFAULTS = { ijs: 0, kinderen: 0, venster: 0 };
// ijs: -1 weiland, 0 sloot, 1 plas.

export function overlay(hourly, nu = new Date(), instellingen = SCHAATS_DEFAULTS) {
  const inst = { ...SCHAATS_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const vandaagKey = dagKeyVan(nu);
  const datums = [...perDag.keys()].filter((d) => d >= vandaagKey).sort().slice(0, 5);

  // Etmaalgemiddelden per dag, voor de vorstsom-vooruitblik.
  const etmaal = new Map();
  for (const d of datums) {
    const uren = perDag.get(d) ?? [];
    if (!uren.length) continue;
    etmaal.set(d, uren.reduce((a, u) => a + (u.temp ?? 0), 0) / uren.length);
  }

  const dagenUit = [];
  for (const datum of datums) {
    const uren = perDag.get(datum) ?? [];
    if (!uren.length) continue;
    const datumObj = new Date(`${datum}T12:00:00`);
    const maand = datumObj.getMonth() + 1;
    const inSeizoen = maand === 12 || maand <= 2 || maand === 11 || maand === 3;

    // Vorstsom vanaf deze dag: som van etmaalgemiddelden onder nul.
    const vanaf = datums.filter((d) => d >= datum);
    let som = 0;
    for (const d of vanaf) {
      const g = etmaal.get(d);
      if (g != null && g < 0) som += g;
    }
    som = Math.round(som);
    const eigenEtmaal = etmaal.get(datum) ?? 5;
    const maxTemp = Math.max(...uren.map((u) => u.temp ?? 0));
    // Plas vraagt meer vorst dan weiland voordat groei "serieus" heet.
    const groeiGrens = inst.ijs === -1 ? -8 : inst.ijs === 1 ? -16 : -12;
    const strenger = inst.kinderen === 1 ? 0.8 : 1;

    const factoren = [];
    let zin;
    if (!inSeizoen && eigenEtmaal > 0) {
      factoren.push({ punten: 78, reden: T.redenSeizoen });
      zin = T.statusSeizoen;
    } else if (eigenEtmaal > 2) {
      factoren.push({ punten: 70, reden: T.redenZacht });
      zin = som < 0 ? T.statusDooi(Math.round(maxTemp)) : T.statusNiks;
      if (som < 0) factoren.push({ punten: 8, reden: T.redenDooi });
    } else if (som <= groeiGrens * strenger) {
      factoren.push({ punten: 18, reden: T.redenVorstsom(som) });
      zin = T.statusGroei(som);
    } else if (som <= -4) {
      factoren.push({ punten: 38, reden: T.redenVorstsom(som) });
      zin = T.statusZet(som);
    } else if (som < 0) {
      factoren.push({ punten: 52, reden: T.redenVorstsom(som) });
      zin = T.statusLicht;
    } else {
      factoren.push({ punten: 66, reden: T.redenZacht });
      zin = T.statusNiks;
    }

    const { score, redenen } = maakScore(factoren);
    const conditie = { score, redenen, advies: adviesVoorScore(score, schaatsen.adviesLabels) };

    dagenUit.push({
      datum,
      antwoord: { ja: score < 45, zin },
      uren: uren.map((u) => ({
        uur: u.uur,
        score: (u.temp ?? 5) <= -3 ? 90 : (u.temp ?? 5) <= 0 ? 65 : 15,
        nat: (u.neerslag ?? 0) > 0.1,
      })),
      venster: null,
      metric: { zin: T.metricSom(som, vanaf.length) },
      conditie,
      status: { soort: "info", zin },
    });
  }

  return { dagen: dagenUit };
}

export const schaatsen = {
  id: "schaatsen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#44607A",
  locatieHint: T.locatieHint,
  icoon: "schaats",
  categorieId: "winter",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: SCHAATS_DEFAULTS },
  instellingen: {
    defaults: SCHAATS_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "ijs",
        vraag: T.instIjsVraag,
        keuzes: [
          { label: T.instIjsKeuzes[0], zet: { ijs: -1 } },
          { label: T.instIjsKeuzes[1], zet: { ijs: 0 } },
          { label: T.instIjsKeuzes[2], zet: { ijs: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "kinderen",
        vraag: T.instKinderenVraag,
        keuzes: [
          { label: T.instKinderenKeuzes[0], zet: { kinderen: 0 } },
          { label: T.instKinderenKeuzes[1], zet: { kinderen: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "venster",
        vraag: T.instWanneerVraag,
        keuzes: [
          { label: T.instWanneerKeuzes[0], zet: { venster: 0 } },
          { label: T.instWanneerKeuzes[1], zet: { venster: 1 } },
        ],
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
