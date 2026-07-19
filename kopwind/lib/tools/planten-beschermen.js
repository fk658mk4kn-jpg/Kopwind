/**
 * lib/tools/planten-beschermen.js
 *
 * De vorstbeschermingscheck (v3.30.0 "Mistral"): moet ik mijn planten
 * vannacht afdekken of naar binnen halen? De motor beoordeelt per dag
 * de nacht die erop volgt op het minimum, en verrekent stralingsvorst:
 * op een heldere, windstille nacht koelt de grond en het blad sterker
 * af dan de gemeten luchttemperatuur, soms enkele graden. Hoe gevoelig
 * de plant is bepaalt de drempel: kuipplanten en jonge zaailingen
 * lijden eerder dan winterharde borderplanten. Een groene uitslag
 * betekent: geen vorstschade te verwachten.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "planten-beschermen",
    naam: "Moet ik mijn planten beschermen vannacht?",
    korteVraag: "Vorstschade vannacht?",
    meldingKort: "Vorstcheck planten",
    cta: "Check de nachtvorst",
    navLabel: "Planten beschermen",
    diepte: "De nacht beoordeeld op vorst, inclusief stralingsvorst op heldere nachten.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Geen vorst, planten veilig", goed: "Nauwelijks risico", twijfelachtig: "Licht risico, dek gevoeligs af", matig: "Vorstschade dreigt", "zeer-slecht": "Serieuze vorst, haal ze binnen" },
    adviesLabels: { goed: "geen bescherming nodig", matig: "dek gevoelige planten af", slecht: "haal ze binnen of dek goed af" },
    legenda: { links: "vorstschade dreigt", rechts: "planten veilig" },
    statusVeilig: (min) => `Geen vorst vannacht (minimum rond ${min} graden): je planten kunnen gewoon buiten blijven.`,
    statusLicht: (min) => `Licht vorstrisico (effectief rond ${min} graden aan de grond): dek gevoelige kuip- en potplanten en jonge zaailingen af, de rest redt zich.`,
    statusMatig: (min) => `Vorstschade dreigt (effectief rond ${min} graden): dek gevoelige planten af met vorstdoek of jute, en zet potten tegen de gevel.`,
    statusStreng: (min) => `Serieuze vorst (effectief rond ${min} graden): haal kwetsbare kuipplanten naar binnen of naar de schuur, en pak de rest goed in.`,
    redenVeilig: "geen vorst in de nacht",
    redenLicht: (min) => `licht vorstrisico (effectief rond ${min} graden)`,
    redenMatig: (min) => `vorst aan de grond (effectief rond ${min} graden)`,
    redenStreng: (min) => `strenge vorst (effectief rond ${min} graden)`,
    redenStraling: "heldere, windstille nacht: aan de grond wordt het kouder dan de luchttemperatuur",
    metricMin: (min) => `Verwacht nachtminimum aan de grond: rond ${min} graden.`,
    metricDoek: "Heb je geen vorstdoek? Een oude laken, jute of omgekeerde emmer werkt ook, mits het het blad niet raakt.",
    instPlantVraag: "Wat wil je beschermen?",
    instPlantKeuzes: ["Winterharde borderplanten", "Kuipplanten (olijf, laurier)", "Zaailingen of mediterrane planten"],
    instStandVraag: "Waar staan ze?",
    instStandKeuzes: ["Beschut (tegen de gevel, onder afdak)", "Half open", "Open tuin of moestuin"],
    instDoekVraag: "Heb je afdekmateriaal bij de hand?",
    instDoekKeuzes: ["Ja, vorstdoek of jute", "Nee, nog niet"],
    instUitleg:
      "De check beoordeelt de komende nacht op vorst en houdt rekening met stralingsvorst: op een heldere, windstille nacht koelt het aan de grond enkele graden verder af dan de luchttemperatuur, dus een gemeten plus 2 kan aan de grond alsnog vorst zijn. Winterharde planten kunnen veel hebben; kuipplanten, jonge zaailingen en mediterrane planten lijden eerder. In het voorjaar is de late nachtvorst de sluipmoordenaar voor net uitgelopen groei.",
  },
  en: {
    slug: "frost-protection",
    naam: "Should I protect my plants tonight?",
    korteVraag: "Frost damage tonight?",
    meldingKort: "Plant frost check",
    cta: "Check the night frost",
    navLabel: "Frost protection",
    diepte: "The night judged for frost, including radiation frost on clear nights.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "No frost, plants safe", goed: "Barely any risk", twijfelachtig: "Slight risk, cover the tender ones", matig: "Frost damage looms", "zeer-slecht": "Serious frost, bring them in" },
    adviesLabels: { goed: "no protection needed", matig: "cover tender plants", slecht: "bring them in or cover well" },
    legenda: { links: "frost damage looms", rechts: "plants safe" },
    statusVeilig: (min) => `No frost tonight (minimum around ${min} degrees): your plants can stay outside.`,
    statusLicht: (min) => `Slight frost risk (around ${min} degrees at ground level): cover tender potted plants and young seedlings, the rest will manage.`,
    statusMatig: (min) => `Frost damage looms (around ${min} degrees): cover tender plants with fleece or hessian, and move pots against the wall.`,
    statusStreng: (min) => `Serious frost (around ${min} degrees): bring vulnerable potted plants inside or into the shed, and wrap the rest well.`,
    redenVeilig: "no frost in the night",
    redenLicht: (min) => `slight frost risk (around ${min} degrees)`,
    redenMatig: (min) => `ground frost (around ${min} degrees)`,
    redenStreng: (min) => `severe frost (around ${min} degrees)`,
    redenStraling: "clear, calm night: it gets colder at ground level than the air temperature",
    metricMin: (min) => `Expected night minimum at ground level: around ${min} degrees.`,
    metricDoek: "No fleece? An old sheet, hessian or an upturned bucket works too, as long as it doesn't touch the leaves.",
    instPlantVraag: "What do you want to protect?",
    instPlantKeuzes: ["Hardy border plants", "Potted plants (olive, bay)", "Seedlings or Mediterranean plants"],
    instStandVraag: "Where are they?",
    instStandKeuzes: ["Sheltered (against the wall, under cover)", "Half open", "Open garden or veg plot"],
    instDoekVraag: "Do you have covering material handy?",
    instDoekKeuzes: ["Yes, fleece or hessian", "No, not yet"],
    instUitleg:
      "The check judges the coming night for frost and accounts for radiation frost: on a clear, calm night it cools several degrees further at ground level than the air, so a measured plus 2 can still be frost at ground level. Hardy plants take a lot; potted plants, young seedlings and Mediterranean plants suffer sooner. In spring the late night frost is the silent killer of fresh growth.",
  },
});

export const PLANT_DEFAULTS = { gevoeligheid: 1, standplaats: 1, afdekking: 0 };
// gevoeligheid: 0 winterhard, 1 kuipplant, 2 zaailing/mediterraan.

export function overlay(hourly, nu = new Date(), instellingen = PLANT_DEFAULTS) {
  const inst = { ...PLANT_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const vandaagKey = dagKeyVan(nu);
  const alle = basis.filter((u) => u.datum >= vandaagKey);
  const datums = [...perDag.keys()].filter((d) => d >= vandaagKey).sort().slice(0, 5);

  // Drempel (luchttemperatuur) waarboven geen zorgen; hoe gevoeliger de
  // plant, hoe hoger. Winterhard pas bij strenge vorst.
  const zorgVanaf = inst.gevoeligheid === 0 ? -4 : inst.gevoeligheid === 2 ? 3 : 0;

  const dagenUit = [];
  for (const datum of datums) {
    const dagUren = perDag.get(datum) ?? [];
    if (!dagUren.length) continue;
    // De nacht die op deze dag volgt: 20:00 tot 08:00 de volgende ochtend.
    const startIdx = alle.findIndex((u) => u.datum === datum && u.uur >= 20);
    const nacht = startIdx === -1 ? [] : alle.slice(startIdx, startIdx + 12);
    if (!nacht.length) continue;

    const minLucht = Math.min(...nacht.map((u) => u.temp ?? 99));
    // Stralingsvorst: helder (weinig bewolking) en windstil rond het
    // koudste deel van de nacht. Dan ligt de grondtemperatuur lager.
    const koudste = nacht.reduce((a, u) => ((u.temp ?? 99) < (a.temp ?? 99) ? u : a), nacht[0]);
    const helder = (koudste.bewolking ?? 50) < 40;
    const windstil = (koudste.wind ?? 10) < 10;
    const straling = helder && windstil;
    const stralingsAftrek = straling ? (inst.standplaats === 2 ? 3.5 : inst.standplaats === 0 ? 1 : 2.5) : 0;
    const effMin = Math.round((minLucht - stralingsAftrek) * 10) / 10;
    const effMinToon = Math.round(effMin);

    const factoren = [];
    let zin;
    if (effMin > zorgVanaf) {
      factoren.push({ punten: 8, reden: T.redenVeilig });
      zin = T.statusVeilig(Math.round(minLucht));
    } else if (effMin > zorgVanaf - 2) {
      factoren.push({ punten: 34, reden: T.redenLicht(effMinToon) });
      zin = T.statusLicht(effMinToon);
    } else if (effMin > zorgVanaf - 5) {
      factoren.push({ punten: 55, reden: T.redenMatig(effMinToon) });
      zin = T.statusMatig(effMinToon);
    } else {
      factoren.push({ punten: 74, reden: T.redenStreng(effMinToon) });
      zin = T.statusStreng(effMinToon);
    }
    if (straling && effMin <= zorgVanaf) {
      factoren.push({ punten: 6, reden: T.redenStraling });
    }

    const { score, redenen } = maakScore(factoren);
    const veiligScore = clamp(score, 0, 100);
    const conditie = { score: veiligScore, redenen, advies: adviesVoorScore(veiligScore, plantenBeschermen.adviesLabels) };
    // Tip over afdekmateriaal alleen als er iets te beschermen valt en
    // de gebruiker nog geen doek heeft.
    const metricZin = veiligScore >= 30 && inst.afdekking === 1
      ? `${T.metricMin(effMinToon)} ${T.metricDoek}`
      : T.metricMin(effMinToon);

    dagenUit.push({
      datum,
      antwoord: { ja: veiligScore < 45, zin },
      uren: nacht.map((u) => ({
        uur: u.uur,
        score: (u.temp ?? 5) <= -3 ? 85 : (u.temp ?? 5) <= 0 ? 60 : (u.temp ?? 5) <= 3 ? 35 : 10,
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

export const plantenBeschermen = {
  id: "planten-beschermen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#5A7D3C",
  locatieHint: T.locatieHint,
  icoon: "plantkap",
  categorieId: "tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: PLANT_DEFAULTS },
  instellingen: {
    defaults: PLANT_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "gevoeligheid",
        vraag: T.instPlantVraag,
        keuzes: [
          { label: T.instPlantKeuzes[0], zet: { gevoeligheid: 0 } },
          { label: T.instPlantKeuzes[1], zet: { gevoeligheid: 1 } },
          { label: T.instPlantKeuzes[2], zet: { gevoeligheid: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "standplaats",
        vraag: T.instStandVraag,
        keuzes: [
          { label: T.instStandKeuzes[0], zet: { standplaats: 0 } },
          { label: T.instStandKeuzes[1], zet: { standplaats: 1 } },
          { label: T.instStandKeuzes[2], zet: { standplaats: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "afdekking",
        vraag: T.instDoekVraag,
        keuzes: [
          { label: T.instDoekKeuzes[0], zet: { afdekking: 0 } },
          { label: T.instDoekKeuzes[1], zet: { afdekking: 1 } },
        ],
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: {
    kop: { nl: "Voor de nacht dat het telt", en: "For the night that counts" },
    advies: {
      nl: "Vorstdoek of tuinvlies houdt een paar graden vast en laat lucht en licht door; leg het losjes over de plant, met wat lucht ertussen, en zet het vast tegen de wind. Voor kuipplanten helpen potvoeten (koude trekt uit de grond) en een plek dicht tegen de gevel. Doek dat je zo weer opbergt gaat jaren mee.",
      en: "Fleece holds a few degrees and lets air and light through; drape it loosely with some air underneath and pin it against the wind. For potted plants, pot feet and a spot against the wall help. Fleece you store away lasts for years.",
    },
    items: [
      { label: { nl: "Vorstdoek en tuinvlies", en: "Frost fleece" }, url: "https://www.bol.com/nl/nl/s/?searchtext=vorstdoek", partner: "bol.com" },
    ],
  },
};
