/**
 * lib/tools/snoeien.js
 *
 * De snoeicheck (v3.27.0 "Solano", akkoord eigenaar). Anders dan de meeste
 * buitenchecks is snoeien geen uur-optimalisatie maar een dagbesluit
 * met twee lagen: het WEER (vorst rond de snoeidag laat wonden
 * bevriezen, natte dagen jagen schimmels in verse wonden, volle hitte
 * stresst de plant) en het SEIZOEN (wat je in februari fors terugsnoeit
 * laat je in oktober met rust). De motor rekent het weer; de
 * maandkalender geeft de seizoenscontext als metric-zin mee. Broedseizoen
 * (15 maart tot 15 juli, Wet natuurbescherming): wie hagen snoeit krijgt
 * dan een expliciete nestcontrole-noot.
 *
 * Vorstregel: niet alleen de dag zelf telt, ook de nacht erna (een
 * verse wond die 's nachts bevriest is de invalsroute voor ziektes),
 * dus de minimumtemperatuur leent de vroege uren van de volgende dag,
 * zelfde patroon als de krabcheck. Affiliate bewust null: de uitrol is
 * gepauzeerd (besluit 2026-07-17); het adviesveld kan later zonder
 * verbouwing aan.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "snoeien",
    naam: "Kan ik vandaag snoeien?",
    korteVraag: "Kan ik vandaag snoeien?",
    meldingKort: "Snoeicheck",
    cta: "Check de snoeidag",
    navLabel: "Snoeien",
    diepte: "Vorst, nat en hitte gewogen, met het snoeiseizoen van de maand erbij.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Prima snoeidag", goed: "Goed te doen", twijfelachtig: "Kan, met beleid", matig: "Liever een andere dag", "zeer-slecht": "Niet snoeien" },
    adviesLabels: { goed: "snoeidag", matig: "kan, met beleid", slecht: "geen snoeidag" },
    legenda: { links: "schaar laten hangen", rechts: "snoeidag" },
    redenVorst: (t) => `vorst rond de snoeidag (minimum ${t} graden): verse wonden bevriezen`,
    redenRandje: (t) => `minimum rond ${t} graden: aanvriezen van wonden is niet uitgesloten`,
    redenNat: "natte dag: schimmels krijgen vrij spel in verse snoeiwonden",
    redenLichtNat: "af en toe nat: snoei droge planten en ontsmet je gereedschap",
    redenHitte: (g) => `volle hitte (gevoel tot ${g} graden): snoeien stresst de plant extra`,
    redenPrima: "droog en mild: wonden drogen snel",
    statusVorst: "Niet snoeien: het vriest rond de snoeidag en verse wonden bevriezen.",
    statusNat: "Vandaag liever niet snoeien: op een natte dag krijgen schimmels vrij spel in verse wonden.",
    statusRandje: (t) => `Kan, met beleid: het minimum ligt rond ${t} graden, dus houd grote ingrepen nog even vast.`,
    statusHitte: "Kan, maar snoei in de ochtend of avond: volle hitte stresst de plant.",
    statusPrima: "Prima snoeidag: droog en mild, wonden drogen snel.",
    haagNoot: " Snoei je een haag: controleer eerst op bewoonde nesten (broedseizoen, Wet natuurbescherming).",
    metricMaand: (zin) => zin,
    instHaagVraag: "Snoei je ook hagen?",
    instHaagKeuzes: ["Nee", "Ja"],
    instKouVraag: "Hoe voorzichtig ben je met kou?",
    instKouKeuzes: ["Ik snoei door tot het echt vriest", "Gemiddeld", "Ik wacht ruim boven nul"],
    instHitteVraag: "Wanneer laat jij het bij hitte?",
    instHitteKeuzes: ["Boven de 26 stop ik", "Gemiddeld", "Hitte houdt me niet tegen"],
    instUitleg:
      "De check weegt vorst rond de snoeidag (ook de nacht erna), natte dagen en volle hitte. De maandzin vertelt wat het seizoen toelaat: de hoofdsnoei hoort in de late winter, voorjaarsbloeiers snoei je na de bloei, en van half maart tot half juli let je bij hagen op broedende vogels.",
  },
  en: {
    slug: "pruning",
    naam: "Can I prune today?",
    korteVraag: "Can I prune today?",
    meldingKort: "Pruning check",
    cta: "Check the pruning day",
    navLabel: "Pruning",
    diepte: "Frost, wet and heat weighed up, with the month's pruning season alongside.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Fine pruning day", goed: "Good to go", twijfelachtig: "Doable with care", matig: "Better another day", "zeer-slecht": "Don't prune" },
    adviesLabels: { goed: "pruning day", matig: "doable with care", slecht: "no pruning day" },
    legenda: { links: "leave the shears", rechts: "pruning day" },
    redenVorst: (t) => `frost around the pruning day (minimum ${t} degrees): fresh cuts freeze`,
    redenRandje: (t) => `minimum around ${t} degrees: freezing of fresh cuts can't be ruled out`,
    redenNat: "a wet day: fungi get free rein in fresh pruning cuts",
    redenLichtNat: "wet spells: prune dry plants and disinfect your tools",
    redenHitte: (g) => `full heat (feels like up to ${g} degrees): pruning adds stress to the plant`,
    redenPrima: "dry and mild: cuts dry quickly",
    statusVorst: "Don't prune: it freezes around the pruning day and fresh cuts freeze with it.",
    statusNat: "Better not prune today: on a wet day fungi get free rein in fresh cuts.",
    statusRandje: (t) => `Doable with care: the minimum sits around ${t} degrees, so hold off on big cuts.`,
    statusHitte: "Doable, but prune in the morning or evening: full heat stresses the plant.",
    statusPrima: "A fine pruning day: dry and mild, cuts dry quickly.",
    haagNoot: " Trimming a hedge? Check for occupied nests first (breeding season).",
    metricMaand: (zin) => zin,
    instHaagVraag: "Do you trim hedges too?",
    instHaagKeuzes: ["No", "Yes"],
    instKouVraag: "How careful are you with cold?",
    instKouKeuzes: ["I prune until it truly freezes", "Average", "I wait until well above zero"],
    instHitteVraag: "When does heat stop you?",
    instHitteKeuzes: ["Above 26 I stop", "Average", "Heat doesn't hold me back"],
    instUitleg:
      "The check weighs frost around the pruning day (including the night after), wet days and full heat. The month line tells you what the season allows: main pruning belongs in late winter, spring bloomers get cut after flowering, and from mid March to mid July watch for nesting birds in hedges.",
  },
});

/** Seizoenscontext per maand, feitelijk en kort. */
export const MAAND_ADVIES = kies({
  nl: {
    1: "Januari: hoofdsnoei van fruitbomen en zomerbloeiers kan op vorstvrije dagen; laat bevroren hout met rust.",
    2: "Februari: de klassieke snoeimaand voor rozen, zomerbloeiende heesters en fruit, zolang het niet vriest.",
    3: "Maart: laatste kans voor de hoofdsnoei; berk, esdoorn en druif bloeden nu en wachten tot de zomer. Het broedseizoen begint.",
    4: "April: voorjaarsbloeiers snoei je pas na de bloei; verder vooral lichte vormcorrecties.",
    5: "Mei: uitgebloeide voorjaarsbloeiers (forsythia, ribes) kunnen nu worden gesnoeid.",
    6: "Juni: de zomersnoei start; leibomen, te wild groen en de eerste haagbeurt.",
    7: "Juli: prima maand voor vormsnoei en het toppen van hagen; bloeders als berk en druif kunnen nu wel.",
    8: "Augustus: zomersnoei van appel en peer en de tweede haagbeurt; niet te laat in de maand voor tere soorten.",
    9: "September: terughoudend snoeien; nieuwe scheuten rijpen niet meer af voor de winter.",
    10: "Oktober: snoeirust; hooguit dood of hinderlijk hout, grote ingrepen wachten tot de late winter.",
    11: "November: alleen dood, ziek of gevaarlijk hout; de plant is in rust maar wonden helen traag.",
    12: "December: winterrust; laat de schaar hangen behalve voor stormschade en plan de hoofdsnoei voor februari.",
  },
  en: {
    1: "January: main pruning of fruit trees and summer bloomers works on frost-free days; leave frozen wood alone.",
    2: "February: the classic pruning month for roses, summer-flowering shrubs and fruit, as long as it doesn't freeze.",
    3: "March: last call for main pruning; birch, maple and grape bleed now and wait until summer. Breeding season begins.",
    4: "April: prune spring bloomers only after flowering; otherwise mostly light shaping.",
    5: "May: spring bloomers that have finished flowering (forsythia, ribes) can be pruned now.",
    6: "June: summer pruning starts; espaliers, unruly growth and the first hedge trim.",
    7: "July: a fine month for shaping and topping hedges; bleeders like birch and grape are fine now.",
    8: "August: summer pruning of apple and pear plus the second hedge trim; not too late in the month for tender kinds.",
    9: "September: prune sparingly; new shoots won't harden off before winter.",
    10: "October: pruning rest; dead or bothersome wood at most, big cuts wait for late winter.",
    11: "November: only dead, diseased or dangerous wood; the plant rests but wounds heal slowly.",
    12: "December: winter rest; leave the shears except for storm damage and plan the main prune for February.",
  },
});

export const SNOEI_DEFAULTS = { snoeitHagen: 0, randjeGrens: 3, hitteGrens: 28 };

/** Broedseizoen: 15 maart tot en met 15 juli. */
export function inBroedseizoen(d) {
  const m = d.getMonth() + 1;
  const dag = d.getDate();
  if (m === 3) return dag >= 15;
  if (m === 7) return dag <= 15;
  return m > 3 && m < 7;
}

function uurSnoeiScore(u) {
  const temp = u.temp ?? u.gevoel ?? 10;
  const nat = (u.neerslag ?? 0) > 0.1 || (u.kans ?? 0) >= 70;
  if (nat || temp <= 0) return 0;
  if (temp <= 3 || (u.neerslag ?? 0) > 0.03) return 55;
  return 95;
}

export function overlay(hourly, nu = new Date(), instellingen = SNOEI_DEFAULTS) {
  const inst = { ...SNOEI_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const perOchtend = basisPerDag(basis, 0, 9);
  const vandaagKey = dagKeyVan(nu);
  const datums = [...perDag.keys()].filter((d) => d >= vandaagKey).sort().slice(0, 5);

  const dagenUit = [];
  for (let i = 0; i < datums.length; i++) {
    const datum = datums[i];
    const dagUren = perDag.get(datum) ?? [];
    if (!dagUren.length) continue;
    // De nacht erna telt mee voor de vorstregel.
    const volgendeOchtend = perOchtend.get(datums[i + 1]) ?? [];
    const rond = [...dagUren, ...volgendeOchtend];
    const minTemp = Math.round(Math.min(...rond.map((u) => u.temp ?? u.gevoel ?? 99)));
    const maxGevoel = Math.round(Math.max(...dagUren.map((u) => u.gevoel ?? u.temp ?? -99)));
    const neerslagSom = dagUren.reduce((a, u) => a + (u.neerslag ?? 0), 0);
    const natteUren = dagUren.filter((u) => (u.neerslag ?? 0) > 0.1).length;
    const nat = neerslagSom >= 1.5 || natteUren >= 3;
    const lichtNat = !nat && (neerslagSom >= 0.3 || natteUren >= 1);

    const factoren = [];
    let zin;
    if (minTemp <= 0) {
      factoren.push({ punten: 70, reden: T.redenVorst(minTemp) });
      zin = T.statusVorst;
    } else if (nat) {
      factoren.push({ punten: 50, reden: T.redenNat });
      zin = T.statusNat;
    } else if (minTemp <= inst.randjeGrens) {
      factoren.push({ punten: 40, reden: T.redenRandje(minTemp) });
      zin = T.statusRandje(minTemp);
    } else if (maxGevoel >= inst.hitteGrens) {
      factoren.push({ punten: 32, reden: T.redenHitte(maxGevoel) });
      zin = T.statusHitte;
    } else {
      factoren.push({ punten: lichtNat ? 20 : 8, reden: lichtNat ? T.redenLichtNat : T.redenPrima });
      zin = T.statusPrima;
    }
    if (lichtNat && (minTemp <= inst.randjeGrens || maxGevoel >= inst.hitteGrens)) {
      factoren.push({ punten: 10, reden: T.redenLichtNat });
    }

    const datumObj = new Date(`${datum}T12:00:00`);
    const broed = inBroedseizoen(datumObj);
    if (inst.snoeitHagen && broed) {
      zin += T.haagNoot;
    }

    const { score, redenen } = maakScore(factoren);
    const conditie = { score, redenen, advies: adviesVoorScore(score, snoeien.adviesLabels) };
    const maandZin = MAAND_ADVIES[datumObj.getMonth() + 1];

    dagenUit.push({
      datum,
      antwoord: { ja: score < 45, zin },
      uren: dagUren.map((u) => ({ uur: u.uur, score: uurSnoeiScore(u), nat: (u.neerslag ?? 0) > 0.1 })),
      venster: null,
      metric: { zin: T.metricMaand(maandZin) },
      conditie,
      status: { soort: "info", zin },
    });
  }

  return { dagen: dagenUit };
}

export const snoeien = {
  id: "snoeien",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#5A7D3C",
  locatieHint: T.locatieHint,
  icoon: "snoeischaar",
  categorieId: "tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: SNOEI_DEFAULTS },
  instellingen: {
    defaults: SNOEI_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "haag",
        vraag: T.instHaagVraag,
        keuzes: [
          { label: T.instHaagKeuzes[0], zet: { snoeitHagen: 0 } },
          { label: T.instHaagKeuzes[1], zet: { snoeitHagen: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "kou",
        vraag: T.instKouVraag,
        keuzes: [
          { label: T.instKouKeuzes[0], zet: { randjeGrens: 2 } },
          { label: T.instKouKeuzes[1], zet: { randjeGrens: 3 } },
          { label: T.instKouKeuzes[2], zet: { randjeGrens: 5 } },
        ],
      },
      {
        type: "keuze",
        id: "hitte",
        vraag: T.instHitteVraag,
        keuzes: [
          { label: T.instHitteKeuzes[0], zet: { hitteGrens: 26 } },
          { label: T.instHitteKeuzes[1], zet: { hitteGrens: 28 } },
          { label: T.instHitteKeuzes[2], zet: { hitteGrens: 31 } },
        ],
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
