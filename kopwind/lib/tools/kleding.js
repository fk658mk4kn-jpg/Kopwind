/**
 * lib/tools/kleding.js
 *
 * De kledingcheck ("wat trek ik aan") als overlay op de gedeelde
 * weerbasis (Zephyr batch 1). Diepte boven een kaal advies: geen
 * momentopname maar een laagjes-advies over de dag heen, op basis van
 * gevoelstemperatuur, met "neem mee, want vanavond zakt het" en de
 * regen-timing erbij.
 *
 * Het comfortcijfer zegt hoe makkelijk de kledingkeuze vandaag is:
 * 10 = aangenaam en stabiel, rond de 6 = laagjesdag met flinke
 * verschillen, laag = guur en nat. De status is het advies zelf.
 */

import { clamp, lerp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";

import { kies } from "../i18n/locale.js";

/** Alle teksten van de kledingcheck, per taal. */
const T = kies({
  nl: {
    slug: "wat-trek-ik-aan",
    naam: "Wat trek ik vandaag aan?",
    korteVraag: "Wat trek ik vandaag aan?",
    meldingKort: "Kledingcheck",
    cta: "Check de outfit",
    navLabel: "Aankleden",
    diepte: "Gewoon praktisch advies voor buiten.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Makkelijke keuze", goed: "Vrij makkelijk", twijfelachtig: "Laagjesdag", matig: "Lastige dag", "zeer-slecht": "Gure dag" },
    adviesLabels: { goed: "makkelijke keuze", matig: "laagjesdag", slecht: "gure dag" },
    legenda: { links: "guur", rechts: "aangenaam" },
    lagen: [
      { advies: "korte broek en T-shirt", item: "een T-shirt" },
      { advies: "T-shirt, met een dun laagje voor de schaduw", item: "een dun laagje" },
      { advies: "trui of vest", item: "een trui" },
      { advies: "jas erbij", item: "een jas" },
      { advies: "winterjas, en een sjaal kan geen kwaad", item: "je winterjas" },
    ],
    vandaagPrefix: (advies) => `Vandaag: ${advies}`,
    vanavond: "vanavond",
    vanochtend: "vanochtend vroeg",
    neemMee: (item, wanneer, g) => `. Neem ${item} mee: ${wanneer} is het gevoel ${g} graden`,
    regenjas: (uur) => `. En de regenjas of paraplu: buien rond ${uur}:00`,
    redenSchommel: (a, b) => `flinke schommel door de dag (gevoel ${a} tot ${b} graden)`,
    redenRegen: (uur) => `regen rond ${uur}:00`,
    redenSpreiding: (min, max) => `groot verschil over de dag (gevoel ${min} tot ${max} graden)`,
    redenGuur: "de hele dag guur",
    metric: (min, max) => `Gevoelstemperatuur vandaag: ${min} tot ${max} graden.`,
    instWarmVraag: "Wanneer begint T-shirt-weer voor jou?",
    instKoudVraag: "Wanneer wil je een trui of meer?",
    instKeuzes: ["Warmbloedig", "Gemiddeld", "Koukleum"],
    instDagStart: "Dag begint om",
    instDagEind: "Dag eindigt om",
    instUur: "uur",
    instUitleg:
      "Het woord zegt hoe makkelijk de keuze is: Ideaal of Goed is een laag en klaar, Twijfelachtig een laagjesdag, Matig of slechter guur en nat. Het advies zelf staat er altijd in gewone taal bij.",
  },
  en: {
    slug: "what-to-wear",
    naam: "What to wear today?",
    korteVraag: "What to wear today?",
    meldingKort: "Outfit check",
    cta: "Check the outfit",
    navLabel: "What to wear",
    diepte: "Practical advice for heading outside.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Easy choice", goed: "Fairly easy", twijfelachtig: "Layer day", matig: "Tricky day", "zeer-slecht": "Bleak day" },
    adviesLabels: { goed: "easy choice", matig: "layer day", slecht: "bleak day" },
    legenda: { links: "bleak", rechts: "pleasant" },
    lagen: [
      { advies: "shorts and a T-shirt", item: "a T-shirt" },
      { advies: "a T-shirt, with a thin layer for the shade", item: "a thin layer" },
      { advies: "a jumper or cardigan", item: "a jumper" },
      { advies: "add a jacket", item: "a jacket" },
      { advies: "winter coat, and a scarf won't hurt", item: "your winter coat" },
    ],
    vandaagPrefix: (advies) => `Today: ${advies}`,
    vanavond: "tonight",
    vanochtend: "early this morning",
    neemMee: (item, wanneer, g) => `. Bring ${item}: ${wanneer} the feels-like is ${g} degrees`,
    regenjas: (uur) => `. And the rain jacket or umbrella: showers around ${uur}:00`,
    redenSchommel: (a, b) => `quite a swing through the day (feels like ${a} to ${b} degrees)`,
    redenRegen: (uur) => `rain around ${uur}:00`,
    redenSpreiding: (min, max) => `big swing across the day (feels like ${min} to ${max} degrees)`,
    redenGuur: "bleak all day",
    metric: (min, max) => `Feels-like today: ${min} to ${max} degrees.`,
    instWarmVraag: "When does T-shirt weather start for you?",
    instKoudVraag: "When do you want a jumper or more?",
    instKeuzes: ["Warm-blooded", "Average", "I feel the cold"],
    instDagStart: "Day starts at",
    instDagEind: "Day ends at",
    instUur: "h",
    instUitleg:
      "The word says how easy the choice is: Ideal or Good means one layer and done, Iffy is a layer day, Poor or worse is bleak and wet. The advice itself is always spelled out in plain words.",
  },
});

export const KLEDING_DEFAULTS = {
  warmGrens: 16, // T-shirt kan vanaf dit gevoel
  koudGrens: 11, // onder dit gevoel wil je een trui of meer
  dagStart: 7,
  dagEind: 23,
};

const GRENZEN = [
  (i) => i.warmGrens + 5,
  (i) => i.warmGrens,
  (i) => i.koudGrens,
  (i) => i.koudGrens - 6,
  () => -99,
];

const LAGEN = GRENZEN.map((min, i) => ({ min, ...T.lagen[i] }));

export function laagVoor(gevoel, inst = KLEDING_DEFAULTS) {
  const idx = LAGEN.findIndex((l) => gevoel >= l.min(inst));
  return { ...LAGEN[idx], index: idx };
}

/** Comfort van een enkel basis-uur, 0..100 (18 graden gevoel = ideaal). */
export function uurComfort(u) {
  const gevoel = u.gevoel ?? u.temp ?? 10;
  let c = 100 - clamp(Math.abs(gevoel - 18) * 5.5, 0, 55);
  if ((u.neerslag ?? 0) > 0.1) c -= 38;
  else if ((u.kans ?? 0) >= 60) c -= 15;
  if ((u.stoten ?? 0) >= 45) c -= Math.min(12, ((u.stoten ?? 45) - 45) / 2 + 4);
  return clamp(Math.round(c), 0, 100);
}

function dagdeel(uren, van, tot) {
  const deel = uren.filter((u) => u.uur >= van && u.uur < tot);
  if (!deel.length) return null;
  const gevoelens = deel.map((u) => u.gevoel ?? u.temp ?? 10);
  return {
    min: Math.min(...gevoelens),
    max: Math.max(...gevoelens),
    natUur: deel.find((u) => u.nat)?.uur ?? null,
  };
}

export function overlay(hourly, nu = new Date(), instellingen = KLEDING_DEFAULTS) {
  const inst = { ...KLEDING_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, inst.dagStart, inst.dagEind);
  const vandaagKey = dagKeyVan(nu);

  const dagen = [];
  for (const [datum, dagUren] of perDag) {
    if (datum < vandaagKey) continue;
    const uren = dagUren.map((u) => ({
      ...u,
      score: uurComfort(u),
      nat: (u.neerslag ?? 0) > 0.1,
    }));
    dagen.push({ datum, uren });
  }
  dagen.sort((a, b) => (a.datum < b.datum ? -1 : 1));

  const dagenUit = dagen.slice(0, 5).map(({ datum, uren }) => {
    const gevoelens = uren.map((u) => u.gevoel ?? u.temp ?? 10);
    const minG = Math.min(...gevoelens);
    const maxG = Math.max(...gevoelens);
    const spreiding = maxG - minG;
    const natUren = uren.filter((u) => u.nat);
    const fractieNat = natUren.length / Math.max(uren.length, 1);

    // Comfortcijfer: hoe makkelijk is de keuze vandaag.
    const gemAfwijking = gevoelens.reduce((a, g) => a + Math.abs(g - 18), 0) / gevoelens.length;
    const factoren = [
      {
        punten: Math.round(clamp(gemAfwijking * 4, 0, 42)),
        reden: spreiding >= 7 ? T.redenSchommel(Math.round(minG), Math.round(maxG)) : null,
      },
      {
        punten: Math.round(lerp(fractieNat, 0.05, 0.6, 0, 30)),
        reden: natUren.length ? T.redenRegen(String(natUren[0].uur).padStart(2, "0")) : null,
      },
      {
        punten: spreiding >= 7 ? Math.round(lerp(spreiding, 7, 14, 6, 16)) : 0,
        reden: spreiding >= 7 ? T.redenSpreiding(Math.round(minG), Math.round(maxG)) : null,
      },
      {
        punten: maxG < 8 ? 10 : 0,
        reden: maxG < 8 ? T.redenGuur : null,
      },
    ];
    const { score, redenen } = maakScore(factoren);
    const conditie = { score, redenen, advies: adviesVoorScore(score, kleding.adviesLabels) };

    // Het advies zelf: hoofdlaag op de middag, meeneem-advies uit de
    // koudere dagdelen, regen-timing erbij.
    const ochtend = dagdeel(uren, inst.dagStart, 12);
    const middag = dagdeel(uren, 12, 18) ?? ochtend;
    const avond = dagdeel(uren, 18, inst.dagEind);

    const hoofd = laagVoor(middag?.min ?? minG, inst);
    let zin = T.vandaagPrefix(hoofd.advies);
    const koudsteAndere = [ochtend, avond]
      .filter(Boolean)
      .map((d) => ({ ...d, laag: laagVoor(d.min, inst) }))
      .filter((d) => d.laag.index > hoofd.index)
      .sort((a, b) => b.laag.index - a.laag.index)[0];
    if (koudsteAndere) {
      const wanneer = koudsteAndere === avond ? T.vanavond : T.vanochtend;
      zin += T.neemMee(koudsteAndere.laag.item, wanneer, Math.round(koudsteAndere.min));
    }
    if (natUren.length) {
      zin += T.regenjas(String(natUren[0].uur).padStart(2, "0"));
    }
    zin += ".";

    // Venster: wanneer kan de korte broek (of het lekkerste blok).
    let venster = null;
    let blok = [];
    for (const u of uren) {
      if ((u.gevoel ?? u.temp ?? 0) >= inst.warmGrens + 5 && !u.nat) {
        blok.push(u);
      } else {
        if (blok.length >= 2 && (!venster || blok.length > venster.uren)) {
          venster = { van: blok[0].uur, tot: blok[blok.length - 1].uur + 1, uren: blok.length };
        }
        blok = [];
      }
    }
    if (blok.length >= 2 && (!venster || blok.length > venster.uren)) {
      venster = { van: blok[0].uur, tot: blok[blok.length - 1].uur + 1, uren: blok.length };
    }

    return {
      datum,
      antwoord: { ja: null, zin },
      outfit: {
        laagIndex: hoofd.index,
        regen: natUren.length > 0,
        koudsteGevoel: Math.round(minG),
        warmsteGevoel: Math.round(maxG),
      },
      uren: uren.map((u) => ({ uur: u.uur, score: u.score, nat: u.nat })),
      venster,
      metric: { zin: T.metric(Math.round(minG), Math.round(maxG)) },
      conditie,
      status: { soort: "info", zin },
    };
  });

  return {
    legenda: T.legenda,
    dagen: dagenUit,
  };
}

export const kleding = {
  id: "wat-trek-ik-aan",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#3D6E96",
  locatieHint: T.locatieHint,
  icoon: "shirt",
  categorieId: "kleding",
  diepte: T.diepte,
  soort: "advies",
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: KLEDING_DEFAULTS },
  instellingen: {
    defaults: KLEDING_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "warm",
        vraag: T.instWarmVraag,
        keuzes: [
          { label: T.instKeuzes[0], zet: { warmGrens: 14 } },
          { label: T.instKeuzes[1], zet: { warmGrens: 16 } },
          { label: T.instKeuzes[2], zet: { warmGrens: 18 } },
        ],
      },
      {
        type: "keuze",
        id: "koud",
        vraag: T.instKoudVraag,
        keuzes: [
          { label: T.instKeuzes[0], zet: { koudGrens: 8 } },
          { label: T.instKeuzes[1], zet: { koudGrens: 11 } },
          { label: T.instKeuzes[2], zet: { koudGrens: 13 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 5, max: 10 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 18, max: 24 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-13",
  affiliate: null,
};
