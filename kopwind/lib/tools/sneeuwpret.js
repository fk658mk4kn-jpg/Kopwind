/**
 * lib/tools/sneeuwpret.js
 *
 * De sneeuwpretcheck (v3.30.0 "Mistral"): kan er vandaag gesleed,
 * sneeuwpopgebouwd of gewoon in de sneeuw gespeeld worden? De enige
 * check die het sneeuwdek gebruikt (snow_depth) plus de verse sneeuw
 * (snowfall). De vraag is tweeledig: ligt er genoeg sneeuw, en is het
 * koud genoeg dat het blijft liggen in plaats van wegsmelten tot blubber.
 * Sleeen wil een steviger, dieper pak; een sneeuwpop wil juist plakkerige
 * sneeuw rond het vriespunt.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "sneeuwpret",
    naam: "Kan er vandaag gesleed worden?",
    korteVraag: "Is er sneeuwpret vandaag?",
    meldingKort: "Sneeuwpretcheck",
    cta: "Check de sneeuw",
    navLabel: "Sneeuwpret",
    diepte: "De enige check met het sneeuwdek: ligt er genoeg en blijft het liggen?",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfecte sneeuwpret", goed: "Prima sneeuwpret", twijfelachtig: "Kan, maar mager", matig: "Nauwelijks sneeuw", "zeer-slecht": "Geen sneeuwpret" },
    adviesLabels: { goed: "sneeuwpret", matig: "kan, maar mager", slecht: "geen sneeuwpret" },
    legenda: { links: "geen sneeuw", rechts: "sneeuwpret" },
    statusGeen: "Er ligt (bijna) geen sneeuw: vandaag wordt het niks met de slee.",
    statusMager: (cm) => `Maar een dun laagje (rond ${cm} cm): genoeg voor een sneeuwballengevecht, te weinig om lekker te sleeen.`,
    statusGoed: (cm) => `Prima sneeuwpret: er ligt zo'n ${cm} cm en het blijft liggen. Pak de slee.`,
    statusBlubber: (cm) => `Er ligt ${cm} cm, maar het dooit: de sneeuw wordt nat en zwaar. Ga vroeg, voordat het blubber wordt.`,
    statusRegen: "Regen op de sneeuw: het wordt een natte, blubberige bedoening.",
    redenGeen: "geen of nauwelijks sneeuwdek",
    redenMager: (cm) => `dun sneeuwdek (${cm} cm)`,
    redenGoed: (cm) => `mooi sneeuwdek (${cm} cm)`,
    redenVers: "verse sneeuw gevallen",
    redenDooi: "het dooit overdag: de sneeuw wordt nat en zwaar",
    redenRegen: "regen op de sneeuw",
    metricDek: (cm, uur) => `Sneeuwdek rond ${cm} cm. Beste moment: rond ${uur}:00, als het het koudst is.`,
    metricGeen: "Geen sneeuw van betekenis vandaag.",
    instActiviteitVraag: "Wat wil je doen?",
    instActiviteitKeuzes: ["Sleeen (wil dieper pak)", "Sneeuwpop of iglo", "Gewoon spelen in de sneeuw"],
    instBehoefteVraag: "Hoeveel sneeuw wil je minimaal?",
    instBehoefteKeuzes: ["Een laagje is genoeg", "Gemiddeld", "Pas bij een flink pak"],
    instKinderenVraag: "Gaan er kinderen mee?",
    instKinderenKeuzes: ["Nee", "Ja"],
    instUitleg:
      "De check gebruikt het verwachte sneeuwdek en de verse sneeuw. Voor sneeuwpret ligt er idealiter minstens een paar centimeter, en blijft het overdag rond of onder het vriespunt zodat het niet wegsmelt tot blubber. Sleeen wil een steviger, dieper pak (en een helling); een sneeuwpop lukt het best met plakkerige sneeuw net rond nul. Regen op sneeuw maakt er een natte bedoening van.",
  },
  en: {
    slug: "snow-play",
    naam: "Can we go sledding today?",
    korteVraag: "Snow fun today?",
    meldingKort: "Snow play check",
    cta: "Check the snow",
    navLabel: "Snow play",
    diepte: "The only check with the snow layer: is there enough and will it stay?",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect snow fun", goed: "Good snow fun", twijfelachtig: "Doable but thin", matig: "Barely any snow", "zeer-slecht": "No snow fun" },
    adviesLabels: { goed: "snow fun", matig: "doable but thin", slecht: "no snow fun" },
    legenda: { links: "no snow", rechts: "snow fun" },
    statusGeen: "There's (almost) no snow: no luck with the sledge today.",
    statusMager: (cm) => `Only a thin layer (around ${cm} cm): enough for a snowball fight, too little for proper sledding.`,
    statusGoed: (cm) => `Great snow fun: about ${cm} cm and it's staying. Grab the sledge.`,
    statusBlubber: (cm) => `There's ${cm} cm, but it's thawing: the snow turns wet and heavy. Go early, before it turns to slush.`,
    statusRegen: "Rain on the snow: it'll be a wet, slushy affair.",
    redenGeen: "no or barely any snow layer",
    redenMager: (cm) => `thin snow layer (${cm} cm)`,
    redenGoed: (cm) => `good snow layer (${cm} cm)`,
    redenVers: "fresh snow has fallen",
    redenDooi: "it thaws during the day: the snow turns wet and heavy",
    redenRegen: "rain on the snow",
    metricDek: (cm, uur) => `Snow layer around ${cm} cm. Best moment: around ${uur}:00, when it's coldest.`,
    metricGeen: "No snow of note today.",
    instActiviteitVraag: "What do you want to do?",
    instActiviteitKeuzes: ["Sledding (wants a deeper layer)", "Snowman or igloo", "Just play in the snow"],
    instBehoefteVraag: "How much snow do you want at least?",
    instBehoefteKeuzes: ["A layer is enough", "Average", "Only a proper blanket"],
    instKinderenVraag: "Are children coming?",
    instKinderenKeuzes: ["No", "Yes"],
    instUitleg:
      "The check uses the expected snow layer and fresh snowfall. For snow play you ideally want at least a few centimetres, staying around or below freezing so it doesn't melt to slush. Sledding wants a firmer, deeper layer (and a slope); a snowman works best with sticky snow near zero. Rain on snow turns it into a wet mess.",
  },
});

export const SNEEUW_DEFAULTS = { activiteit: 2, behoefte: 1, kinderen: 1 };
// activiteit: 0 sleeen, 1 sneeuwpop, 2 algemeen.

export function overlay(hourly, nu = new Date(), instellingen = SNEEUW_DEFAULTS) {
  const inst = { ...SNEEUW_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const vandaagKey = dagKeyVan(nu);
  const datums = [...perDag.keys()].filter((d) => d >= vandaagKey).sort().slice(0, 5);

  // Minimaal sneeuwdek (meter). Sleeen wil meer, kinderen spelen in minder.
  let drempel = inst.behoefte === 0 ? 0.02 : inst.behoefte === 2 ? 0.1 : 0.05;
  if (inst.activiteit === 0) drempel += 0.03;
  if (inst.kinderen === 1) drempel = Math.max(0.02, drempel - 0.01);

  const dagenUit = [];
  for (const datum of datums) {
    const alleUren = perDag.get(datum) ?? [];
    if (!alleUren.length) continue;
    const overdag = alleUren.filter((u) => u.uur >= 9 && u.uur <= 17);
    const uren = overdag.length ? overdag : alleUren;

    const maxDek = Math.max(...uren.map((u) => u.sneeuwdek ?? 0));
    const versCm = Math.round(uren.reduce((a, u) => a + (u.sneeuw ?? 0), 0) * 10) / 10;
    const dekCm = Math.round(maxDek * 100);
    const maxTemp = Math.max(...uren.map((u) => u.temp ?? -99));
    const regenOpSneeuw = uren.some((u) => (u.neerslag ?? 0) > 0.3 && (u.temp ?? 0) > 0.5);
    // Koudste daglichtuur als beste moment.
    const koudste = uren.reduce((a, u) => ((u.temp ?? 99) < (a.temp ?? 99) ? u : a), uren[0]);

    const factoren = [];
    let zin;
    const genoeg = maxDek >= drempel || versCm >= 3;
    if (!genoeg && maxDek < 0.02) {
      factoren.push({ punten: 82, reden: T.redenGeen });
      zin = T.statusGeen;
    } else if (!genoeg) {
      factoren.push({ punten: 52, reden: T.redenMager(dekCm) });
      zin = T.statusMager(dekCm);
    } else if (regenOpSneeuw) {
      factoren.push({ punten: 45, reden: T.redenRegen });
      zin = T.statusRegen;
    } else if (maxTemp > 4) {
      factoren.push({ punten: 34, reden: T.redenDooi });
      zin = T.statusBlubber(dekCm);
    } else {
      factoren.push({ punten: 8, reden: T.redenGoed(dekCm) });
      zin = T.statusGoed(dekCm);
      if (versCm >= 2) factoren.push({ punten: -4, reden: T.redenVers });
    }

    const { score, redenen } = maakScore(factoren);
    const s = clamp(score, 0, 100);
    const conditie = { score: s, redenen, advies: adviesVoorScore(s, sneeuwpret.adviesLabels) };
    const metricZin = maxDek >= 0.02
      ? T.metricDek(dekCm, String(koudste.uur).padStart(2, "0"))
      : T.metricGeen;

    dagenUit.push({
      datum,
      antwoord: { ja: s < 45, zin },
      uren: uren.map((u) => ({
        uur: u.uur,
        score:
          (u.sneeuwdek ?? 0) < 0.02
            ? 82
            : (u.neerslag ?? 0) > 0.3 && (u.temp ?? 0) > 0.5
            ? 45
            : (u.temp ?? 0) > 4
            ? 40
            : 12,
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

export const sneeuwpret = {
  id: "sneeuwpret",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#44607A",
  locatieHint: T.locatieHint,
  icoon: "slee",
  categorieId: "winter",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: [...BASIS_VELDEN, "snowfall", "snow_depth"],
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: SNEEUW_DEFAULTS },
  instellingen: {
    defaults: SNEEUW_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "activiteit",
        vraag: T.instActiviteitVraag,
        keuzes: [
          { label: T.instActiviteitKeuzes[0], zet: { activiteit: 0 } },
          { label: T.instActiviteitKeuzes[1], zet: { activiteit: 1 } },
          { label: T.instActiviteitKeuzes[2], zet: { activiteit: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "behoefte",
        vraag: T.instBehoefteVraag,
        keuzes: [
          { label: T.instBehoefteKeuzes[0], zet: { behoefte: 0 } },
          { label: T.instBehoefteKeuzes[1], zet: { behoefte: 1 } },
          { label: T.instBehoefteKeuzes[2], zet: { behoefte: 2 } },
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
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
