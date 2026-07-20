/**
 * lib/tools/muggen.js
 *
 * De muggencheck (v3.31.0 "Sirocco"). Kun je vanavond rustig buiten
 * zitten of word je opgegeten? Muggen zijn het actiefst bij warm, vochtig
 * en windstil weer, vooral rond de schemering en dicht bij stilstaand
 * water. Wind boven een km/u of 12 legt ze zo goed als stil, en onder de
 * tien graden vliegen ze nauwelijks. De score is de muggenactiviteit
 * (hoog = plaag): een gunstig oordeel betekent dus WEINIG muggen. Een
 * inschatting op basis van het weer, geen exacte muggenteller.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "muggen",
    naam: "Is het muggenweer vanavond?",
    korteVraag: "Is het muggenweer vanavond?",
    meldingKort: "Muggencheck",
    cta: "Check de muggen",
    navLabel: "Muggenweer",
    diepte: "De muggenactiviteit: warm, vochtig en windstil rond de schemering is hun favoriet.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Muggenvrij", goed: "Weinig muggen", twijfelachtig: "Wat muggen", matig: "Veel muggen", "zeer-slecht": "Muggenplaag" },
    adviesLabels: { goed: "weinig muggen", matig: "wat muggen", slecht: "veel muggen" },
    legenda: { links: "muggenvrij", rechts: "muggenplaag" },
    statusWeinig: "Weinig muggen verwacht: je kunt rustig buiten zitten.",
    statusWat: "Wat muggen op komst: een kaars of wat spray houdt het aangenaam.",
    statusVeel: "Veel muggen vanavond: smeer je in of ga achter horren zitten.",
    statusPlaag: "Ideaal muggenweer, dus een plaag: warm, vochtig en windstil. Smeer je goed in.",
    statusKoud: "Te koud voor muggen: vanavond heb je er geen last van.",
    statusWind: "Te winderig voor muggen: die worden zo goed als weggeblazen.",
    redenWarm: (t) => `warm (rond ${t} graden): muggen zijn dan actief`,
    redenVocht: "hoge luchtvochtigheid: muggen houden ervan",
    redenWindstil: "vrijwel windstil: muggen kunnen goed vliegen",
    redenWater: "dicht bij stilstaand water: daar broeden ze",
    redenKoel: "koel weer legt de muggen grotendeels stil",
    redenWind: "de wind blaast de muggen weg",
    redenRegen: "in de regen vliegen ze nauwelijks",
    metricPiek: (uur) => `Piek rond ${uur}:00 (de schemering), dan zijn ze het actiefst.`,
    metricWeinig: "Weinig muggenactiviteit vanavond.",
    instPeriodeVraag: "Wanneer wil je buiten zijn?",
    instPeriodeKeuzes: ["Namiddag", "Avond en schemering", "Laat op de avond of nacht"],
    instGevoeligVraag: "Word je snel gestoken?",
    instGevoeligKeuzes: ["Niet echt", "Gemiddeld", "Ja, muggen vinden mij lekker"],
    instWaterVraag: "Zit je dicht bij water?",
    instWaterKeuzes: ["Nee", "Ja, bij een sloot, vijver of plas"],
    instUitleg:
      "De check schat de muggenactiviteit op het moment dat jij buiten bent. Muggen zijn het actiefst bij warm (boven een graad of vijftien), vochtig en windstil weer, vooral rond de schemering en dicht bij stilstaand water waar ze broeden. Wind boven de twaalf km/u legt ze grotendeels stil en onder de tien graden vliegen ze nauwelijks. De score is de activiteit: een gunstig oordeel betekent weinig muggen. Word je snel gestoken, dan schuift de check strenger.",
  },
  en: {
    slug: "mosquito-weather",
    naam: "Are the mosquitoes out tonight?",
    korteVraag: "Are the mosquitoes out tonight?",
    meldingKort: "Mosquito check",
    cta: "Check the mosquitoes",
    navLabel: "Mosquito weather",
    diepte: "Mosquito activity: warm, humid and still around dusk is their favourite.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Mosquito-free", goed: "Few mosquitoes", twijfelachtig: "Some mosquitoes", matig: "Lots of mosquitoes", "zeer-slecht": "A plague" },
    adviesLabels: { goed: "few mosquitoes", matig: "some mosquitoes", slecht: "lots of mosquitoes" },
    legenda: { links: "mosquito-free", rechts: "a plague" },
    statusWeinig: "Few mosquitoes expected: you can sit outside in peace.",
    statusWat: "Some mosquitoes on the way: a candle or a bit of spray keeps it pleasant.",
    statusVeel: "Lots of mosquitoes tonight: use repellent or sit behind screens.",
    statusPlaag: "Ideal mosquito weather, so a plague: warm, humid and still. Apply plenty of repellent.",
    statusKoud: "Too cold for mosquitoes: they won't bother you tonight.",
    statusWind: "Too windy for mosquitoes: they get all but blown away.",
    redenWarm: (t) => `warm (around ${t} degrees): mosquitoes are active then`,
    redenVocht: "high humidity: mosquitoes love it",
    redenWindstil: "virtually still: mosquitoes can fly well",
    redenWater: "close to standing water: that's where they breed",
    redenKoel: "cool weather keeps the mosquitoes mostly grounded",
    redenWind: "the wind blows the mosquitoes away",
    redenRegen: "they barely fly in the rain",
    metricPiek: (uur) => `Peak around ${uur}:00 (dusk), when they're most active.`,
    metricWeinig: "Little mosquito activity tonight.",
    instPeriodeVraag: "When do you want to be outside?",
    instPeriodeKeuzes: ["Late afternoon", "Evening and dusk", "Late evening or night"],
    instGevoeligVraag: "Do you get bitten easily?",
    instGevoeligKeuzes: ["Not really", "Average", "Yes, mosquitoes love me"],
    instWaterVraag: "Are you near water?",
    instWaterKeuzes: ["No", "Yes, by a ditch, pond or lake"],
    instUitleg:
      "The check estimates mosquito activity for when you're outside. Mosquitoes are most active in warm (above about fifteen degrees), humid and still weather, especially around dusk and close to standing water where they breed. Wind above twelve km/h mostly grounds them and below ten degrees they barely fly. The score is the activity: a favourable verdict means few mosquitoes. If you get bitten easily, the check shifts stricter.",
  },
});

export const MUGGEN_DEFAULTS = { periode: 1, gevoeligheid: 1, water: 0 };

export function overlay(hourly, nu = new Date(), instellingen = MUGGEN_DEFAULTS) {
  const inst = { ...MUGGEN_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const datums = [...perDag.keys()].filter((d) => d >= dagKeyVan(nu)).sort().slice(0, 5);

  const bereik = inst.periode === 0 ? [15, 19] : inst.periode === 2 ? [21, 27] : [18, 23];

  const dagenUit = [];
  for (const datum of datums) {
    const dagUren = perDag.get(datum) ?? [];
    if (!dagUren.length) continue;
    const uren = dagUren.filter((u) => u.uur >= bereik[0] && u.uur <= Math.min(23, bereik[1]));
    const venster = uren.length ? uren : dagUren.filter((u) => u.uur >= 18);
    if (!venster.length) continue;

    const avg = (f) => venster.reduce((a, u) => a + (f(u) ?? 0), 0) / venster.length;
    const t = avg((u) => u.temp);
    const rh = avg((u) => u.rh);
    const wind = avg((u) => u.wind);
    const regenHard = venster.some((u) => (u.neerslag ?? 0) > 0.4);

    let act = 0;
    const factoren = [];
    if (t >= 10) {
      const p = clamp(Math.round((t - 10) * 6), 0, 45);
      act += p;
      if (t >= 15) factoren.push({ punten: p, reden: T.redenWarm(Math.round(t)) });
    }
    if (rh >= 65) {
      const p = clamp(Math.round((rh - 65) * 0.9), 0, 25);
      act += p;
      if (p >= 8) factoren.push({ punten: p, reden: T.redenVocht });
    }
    if (wind <= 12) {
      const p = clamp(Math.round((12 - wind) * 2.2), 0, 22);
      act += p;
      if (p >= 8) factoren.push({ punten: p, reden: T.redenWindstil });
    } else {
      act -= clamp(Math.round((wind - 12) * 2.5), 0, 30);
    }
    if (inst.water === 1) {
      act += 10;
      factoren.push({ punten: 10, reden: T.redenWater });
    }
    if (regenHard) act -= 12;
    act += (inst.gevoeligheid - 1) * 8;

    const s = clamp(Math.round(act), 0, 100);

    let zin;
    if (t < 10) zin = T.statusKoud;
    else if (wind > 20) zin = T.statusWind;
    else if (s >= 78) zin = T.statusPlaag;
    else if (s >= 55) zin = T.statusVeel;
    else if (s >= 35) zin = T.statusWat;
    else zin = T.statusWeinig;

    // Reden-set opschonen: bij weinig muggen de koel/wind/regen-reden tonen.
    const redenen = factoren.length
      ? factoren.sort((a, b) => b.punten - a.punten).slice(0, 3).map((f) => f.reden)
      : [t < 10 ? T.redenKoel : wind > 12 ? T.redenWind : regenHard ? T.redenRegen : T.redenKoel];

    const conditie = { score: s, redenen, advies: adviesVoorScore(s, muggen.adviesLabels) };
    const piekUur = inst.periode === 2 ? 22 : inst.periode === 0 ? 18 : 21;
    const metricZin = s >= 35 ? T.metricPiek(String(piekUur).padStart(2, "0")) : T.metricWeinig;

    dagenUit.push({
      datum,
      antwoord: { ja: s < 45, zin },
      uren: venster.map((u) => {
        const tw = (u.temp ?? 0) < 10 ? 10 : clamp(Math.round((u.temp - 10) * 6 + (u.rh ?? 0 > 70 ? 15 : 0) - Math.max(0, (u.wind ?? 0) - 12) * 2.5), 0, 100);
        return { uur: u.uur, score: tw, nat: (u.neerslag ?? 0) > 0.1 };
      }),
      venster: null,
      metric: { zin: metricZin },
      conditie,
      status: { soort: "info", zin },
    });
  }

  return { dagen: dagenUit };
}

export const muggen = {
  id: "muggen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#D97C1B",
  locatieHint: T.locatieHint,
  icoon: "mug",
  categorieId: "gezondheid",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: MUGGEN_DEFAULTS },
  instellingen: {
    defaults: MUGGEN_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "periode",
        vraag: T.instPeriodeVraag,
        keuzes: [
          { label: T.instPeriodeKeuzes[0], zet: { periode: 0 } },
          { label: T.instPeriodeKeuzes[1], zet: { periode: 1 } },
          { label: T.instPeriodeKeuzes[2], zet: { periode: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "gevoeligheid",
        vraag: T.instGevoeligVraag,
        keuzes: [
          { label: T.instGevoeligKeuzes[0], zet: { gevoeligheid: 0 } },
          { label: T.instGevoeligKeuzes[1], zet: { gevoeligheid: 1 } },
          { label: T.instGevoeligKeuzes[2], zet: { gevoeligheid: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "water",
        vraag: T.instWaterVraag,
        keuzes: [
          { label: T.instWaterKeuzes[0], zet: { water: 0 } },
          { label: T.instWaterKeuzes[1], zet: { water: 1 } },
        ],
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-19",
  affiliate: {
    kop: { nl: "Muggenvrij buiten zitten", en: "Sit outside mosquito-free" },
    advies: {
      nl: "Op een muggenavond helpt een goede muggenspray (met DEET of icaridine) het meest; buiten houden een muggenkaars of een ventilator de boel op afstand, en binnen zijn horren de rust zelve. Ruim stilstaand water op in de tuin, dat is hun kraamkamer.",
      en: "On a mosquito night a good repellent (with DEET or icaridin) helps most; outdoors a citronella candle or a fan keeps them off, and indoors screens are the calmest solution. Clear standing water in the garden, that's their nursery.",
    },
    items: [
      { label: { nl: "Muggenspray en anti-muggen", en: "Repellent and anti-mosquito" }, url: "https://www.bol.com/nl/nl/s/?searchtext=muggenspray", partner: "bol.com" },
    ],
  },
};
