/**
 * lib/tools/beton-storten.js
 *
 * De betonstortcheck (v3.31.0 "Sirocco"). Beton storten is een
 * klus met een harde weer-randvoorwaarde: verse beton mag de eerste
 * nacht niet bevriezen (het water in het mengsel zet uit en verzwakt de
 * boel), dus de vorst van de komende nacht telt net zo zwaar als de dag.
 * Daarnaast spoelt een flinke bui vers cement uit het oppervlak, en
 * drogen hitte plus wind de boel te snel uit (krimpscheuren). De motor
 * kijkt vijf dagen vooruit en beoordeelt per dag de storttemperatuur, de
 * vorst van de nacht erna, de regen op de stortdag en de uitdroging.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "beton-storten",
    naam: "Kan ik vandaag beton storten?",
    korteVraag: "Kan ik vandaag beton storten?",
    meldingKort: "Betoncheck",
    cta: "Check het stortweer",
    navLabel: "Beton storten",
    diepte: "De storttemperatuur, de vorst van de nacht erna, regen op de stortdag en uitdroging.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect stortweer", goed: "Prima stortweer", twijfelachtig: "Kan, met maatregelen", matig: "Lastig stortweer", "zeer-slecht": "Niet storten" },
    adviesLabels: { goed: "stortweer", matig: "kan, met maatregelen", slecht: "niet storten" },
    legenda: { links: "laat de kuip staan", rechts: "stortweer" },
    statusGoed: "Prima dag om te storten: geen vorst in het vooruitzicht, droog genoeg en niet te snel drogend.",
    statusVorst: (t) => `Niet storten: de komende nacht koelt het naar ${t} graden en verse beton mag niet bevriezen.`,
    statusDagVorst: (t) => `Te koud om te storten: overdag rond ${t} graden, verse beton hardt dan slecht uit.`,
    statusRegen: "Storten afgeraden: er valt te veel regen op de stortdag, dat spoelt het verse cement uit.",
    statusHitte: (t) => `Kan storten, maar het wordt warm (tot ${t} graden) met wind: dek af en houd nat, anders krimpscheuren.`,
    statusMatig: "Storten kan, maar houd het weer in de gaten en neem maatregelen.",
    redenNachtvorst: (t) => `vorst de nacht na het storten (tot ${t} graden)`,
    redenDagKoud: (t) => `koud overdag (rond ${t} graden): beton hardt traag uit`,
    redenRegen: "flinke regen op de stortdag spoelt vers cement uit",
    redenHitte: (t) => `warm (tot ${t} graden) plus wind: snelle uitdroging en krimpscheuren`,
    redenGoed: "droog, geen vorst en een werkbare temperatuur",
    metricGoed: (t) => `Storttemperatuur rond ${t} graden, geen vorst de nacht erna.`,
    metricVorst: (t) => `Let op: de nacht na het storten zakt naar ${t} graden.`,
    instKlusVraag: "Wat stort je?",
    instKlusKeuzes: ["Fundering of vloer (dik)", "Bestrating of dunne laag"],
    instAfdekVraag: "Dek je de verse beton af?",
    instAfdekKeuzes: ["Nee", "Ja, met dekens of folie tegen lichte vorst"],
    instHitteVraag: "Hoe voorzichtig ben je met warmte?",
    instHitteKeuzes: ["Al voorzichtig vanaf warm", "Normaal", "Pas bij echt heet"],
    instUitleg:
      "De check beoordeelt per dag de storttemperatuur, de vorst van de nacht erna (verse beton mag niet bevriezen), de regen op de stortdag (die spoelt vers cement uit) en de uitdroging (warmte plus wind geeft krimpscheuren). Dek je af tegen lichte vorst, dan mag het net iets kouder. Een dunne laag of bestrating is gevoeliger voor snel drogen dan een dikke vloer.",
  },
  en: {
    slug: "pouring-concrete",
    naam: "Can I pour concrete today?",
    korteVraag: "Can I pour concrete today?",
    meldingKort: "Concrete check",
    cta: "Check the pouring weather",
    navLabel: "Pouring concrete",
    diepte: "The pouring temperature, frost the night after, rain on the pour day and drying out.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect pouring weather", goed: "Good pouring weather", twijfelachtig: "Doable with measures", matig: "Tricky pouring weather", "zeer-slecht": "Don't pour" },
    adviesLabels: { goed: "pouring weather", matig: "doable with measures", slecht: "don't pour" },
    legenda: { links: "leave the mixer", rechts: "pouring weather" },
    statusGoed: "Good day to pour: no frost ahead, dry enough and not drying too fast.",
    statusVorst: (t) => `Don't pour: the coming night drops to ${t} degrees and fresh concrete must not freeze.`,
    statusDagVorst: (t) => `Too cold to pour: around ${t} degrees during the day, fresh concrete cures poorly.`,
    statusRegen: "Pouring not advised: too much rain on the pour day washes out the fresh cement.",
    statusHitte: (t) => `You can pour, but it gets warm (up to ${t} degrees) with wind: cover and keep moist, or cracks.`,
    statusMatig: "Pouring is doable, but watch the weather and take measures.",
    redenNachtvorst: (t) => `frost the night after pouring (down to ${t} degrees)`,
    redenDagKoud: (t) => `cold during the day (around ${t} degrees): concrete cures slowly`,
    redenRegen: "heavy rain on the pour day washes out fresh cement",
    redenHitte: (t) => `warm (up to ${t} degrees) plus wind: fast drying and shrinkage cracks`,
    redenGoed: "dry, no frost and a workable temperature",
    metricGoed: (t) => `Pouring temperature around ${t} degrees, no frost the night after.`,
    metricVorst: (t) => `Note: the night after pouring drops to ${t} degrees.`,
    instKlusVraag: "What are you pouring?",
    instKlusKeuzes: ["Foundation or floor (thick)", "Paving or thin layer"],
    instAfdekVraag: "Will you cover the fresh concrete?",
    instAfdekKeuzes: ["No", "Yes, with blankets or foil against light frost"],
    instHitteVraag: "How careful are you with heat?",
    instHitteKeuzes: ["Careful from warm already", "Normal", "Only when really hot"],
    instUitleg:
      "The check judges the pouring temperature per day, the frost the night after (fresh concrete must not freeze), the rain on the pour day (which washes out fresh cement) and the drying out (heat plus wind gives shrinkage cracks). If you cover against light frost, it may be a touch colder. A thin layer or paving is more sensitive to fast drying than a thick floor.",
  },
});

export const BETON_DEFAULTS = { klus: 0, afdekken: 0, hitte: 1 };

export function overlay(hourly, nu = new Date(), instellingen = BETON_DEFAULTS) {
  const inst = { ...BETON_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const alle = basis.filter((u) => u.datum >= dagKeyVan(nu));
  const datums = [...perDag.keys()].filter((d) => d >= dagKeyVan(nu)).sort().slice(0, 5);

  const vorstGrens = inst.afdekken === 1 ? -2 : 1;
  const hitteGrens = inst.hitte === 0 ? 24 : inst.hitte === 2 ? 31 : 28;

  const dagenUit = [];
  for (const datum of datums) {
    const dagUren = perDag.get(datum) ?? [];
    if (!dagUren.length) continue;
    const werk = dagUren.filter((u) => u.uur >= 7 && u.uur <= 18);
    const uren = werk.length ? werk : dagUren;

    // Nacht na de stortdag: vanaf 20:00 die dag, 12 uur vooruit.
    const startIdx = alle.findIndex((u) => u.datum === datum && u.uur >= 20);
    const nacht = startIdx >= 0 ? alle.slice(startIdx, startIdx + 12) : [];
    const nachtMin = nacht.length ? Math.min(...nacht.map((u) => u.temp ?? 99)) : 99;
    const dagMin = Math.min(...uren.map((u) => u.temp ?? 99));
    const dagMax = Math.max(...uren.map((u) => u.temp ?? -99));
    const regenSom = uren.reduce((a, u) => a + (u.neerslag ?? 0), 0);
    const maxKans = Math.max(...uren.map((u) => u.kans ?? 0));
    const maxWind = Math.max(...uren.map((u) => u.wind ?? 0));

    const factoren = [];
    let zin;
    let metricZin;
    if (nachtMin < vorstGrens) {
      factoren.push({ punten: 88, reden: T.redenNachtvorst(Math.round(nachtMin)) });
      zin = T.statusVorst(Math.round(nachtMin));
      metricZin = T.metricVorst(Math.round(nachtMin));
    } else if (dagMin < vorstGrens) {
      factoren.push({ punten: 80, reden: T.redenDagKoud(Math.round(dagMin)) });
      zin = T.statusDagVorst(Math.round(dagMin));
      metricZin = T.metricVorst(Math.round(dagMin));
    } else if (regenSom > (inst.klus === 1 ? 0.8 : 1.5) || maxKans >= 75) {
      factoren.push({ punten: 66, reden: T.redenRegen });
      zin = T.statusRegen;
      metricZin = T.metricGoed(Math.round(dagMax));
    } else {
      factoren.push({ punten: 8, reden: T.redenGoed });
      zin = T.statusGoed;
      metricZin = T.metricGoed(Math.round(dagMax));
      const heet = dagMax >= hitteGrens && maxWind >= 20;
      if (heet) {
        const p = inst.klus === 1 ? 30 : 22;
        factoren.push({ punten: p, reden: T.redenHitte(Math.round(dagMax)) });
        zin = T.statusHitte(Math.round(dagMax));
      }
    }

    const { score, redenen } = maakScore(factoren);
    const s = clamp(score, 0, 100);
    const conditie = { score: s, redenen, advies: adviesVoorScore(s, betonStorten.adviesLabels) };
    if (s >= 45 && s < 70 && zin === T.statusGoed) zin = T.statusMatig;

    dagenUit.push({
      datum,
      antwoord: { ja: s < 45, zin },
      uren: uren.map((u) => ({
        uur: u.uur,
        score: (u.temp ?? 99) < vorstGrens ? 82 : (u.neerslag ?? 0) > 0.4 ? 62 : (u.temp ?? 0) >= hitteGrens ? 40 : 12,
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

export const betonStorten = {
  id: "beton-storten",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#8C6239",
  locatieHint: T.locatieHint,
  icoon: "kruiwagen",
  categorieId: "huis-tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: BETON_DEFAULTS },
  instellingen: {
    defaults: BETON_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "klus",
        vraag: T.instKlusVraag,
        keuzes: [
          { label: T.instKlusKeuzes[0], zet: { klus: 0 } },
          { label: T.instKlusKeuzes[1], zet: { klus: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "afdekken",
        vraag: T.instAfdekVraag,
        keuzes: [
          { label: T.instAfdekKeuzes[0], zet: { afdekken: 0 } },
          { label: T.instAfdekKeuzes[1], zet: { afdekken: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "hitte",
        vraag: T.instHitteVraag,
        keuzes: [
          { label: T.instHitteKeuzes[0], zet: { hitte: 0 } },
          { label: T.instHitteKeuzes[1], zet: { hitte: 1 } },
          { label: T.instHitteKeuzes[2], zet: { hitte: 2 } },
        ],
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-19",
  affiliate: {
    kop: { nl: "Zelf beton storten", en: "Pouring concrete yourself" },
    advies: {
      nl: "Voor een kleine klus red je je met zakken snelcement of stabilisatiemortel en een kuip of betonmolen; voor het afwerken een rei en een schuurspaan. Dek de verse beton af als er vorst of felle zon dreigt, dat scheelt scheuren.",
      en: "For a small job, bags of quick cement or mortar and a tub or mixer will do; for finishing a screed board and float. Cover the fresh concrete if frost or strong sun threatens, that saves cracks.",
    },
    items: [
      { label: { nl: "Cement en mortel", en: "Cement and mortar" }, url: "https://www.bol.com/nl/nl/s/?searchtext=snelcement", partner: "bol.com" },
    ],
  },
};
