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

export const KLEDING_DEFAULTS = {
  warmGrens: 16, // T-shirt kan vanaf dit gevoel
  koudGrens: 11, // onder dit gevoel wil je een trui of meer
  dagStart: 7,
  dagEind: 23,
};

const LAGEN = [
  { min: (i) => i.warmGrens + 5, advies: "korte broek en T-shirt", item: "een T-shirt" },
  { min: (i) => i.warmGrens, advies: "T-shirt, met een dun laagje voor de schaduw", item: "een dun laagje" },
  { min: (i) => i.koudGrens, advies: "trui of vest", item: "een trui" },
  { min: (i) => i.koudGrens - 6, advies: "jas erbij", item: "een jas" },
  { min: () => -99, advies: "winterjas, en een sjaal kan geen kwaad", item: "je winterjas" },
];

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
      { punten: Math.round(clamp(gemAfwijking * 4, 0, 42)), reden: null },
      {
        punten: Math.round(lerp(fractieNat, 0.05, 0.6, 0, 30)),
        reden: natUren.length
          ? `regen rond ${String(natUren[0].uur).padStart(2, "0")}:00`
          : null,
      },
      {
        punten: spreiding >= 7 ? Math.round(lerp(spreiding, 7, 14, 6, 16)) : 0,
        reden:
          spreiding >= 7
            ? `groot verschil over de dag (gevoel ${Math.round(minG)} tot ${Math.round(maxG)} graden)`
            : null,
      },
      {
        punten: maxG < 8 ? 10 : 0,
        reden: maxG < 8 ? "de hele dag guur" : null,
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
    let zin = `Vandaag: ${hoofd.advies}`;
    const koudsteAndere = [ochtend, avond]
      .filter(Boolean)
      .map((d) => ({ ...d, laag: laagVoor(d.min, inst) }))
      .filter((d) => d.laag.index > hoofd.index)
      .sort((a, b) => b.laag.index - a.laag.index)[0];
    if (koudsteAndere) {
      const wanneer = koudsteAndere === avond ? "vanavond" : "vanochtend vroeg";
      zin += `. Neem ${koudsteAndere.laag.item} mee: ${wanneer} is het gevoel ${Math.round(koudsteAndere.min)} graden`;
    }
    if (natUren.length) {
      zin += `. En de regenjas of paraplu: buien rond ${String(natUren[0].uur).padStart(2, "0")}:00`;
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
      metric: { zin: `Gevoelstemperatuur vandaag: ${Math.round(minG)} tot ${Math.round(maxG)} graden.` },
      conditie,
      status: { soort: "info", zin },
    };
  });

  return {
    legenda: { links: "guur", rechts: "aangenaam" },
    dagen: dagenUit,
  };
}

export const kleding = {
  id: "wat-trek-ik-aan",
  slug: "wat-trek-ik-aan",
  naam: "Wat trek ik aan?",
  meldingKort: "Kledingcheck",
  korteVraag: "Wat trek ik vandaag aan?",
  cta: "Check je outfit",
  navLabel: "Aankleden",
  kleur: "#57794E",
  locatieHint: "Zoek je stad, dat is genoeg...",
  icoon: "shirt",
  groep: "Elke dag",
  diepte: "Wat je aantrekt, en wat je meeneemt voor vanavond.",
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: KLEDING_DEFAULTS },
  instellingen: {
    defaults: KLEDING_DEFAULTS,
    velden: [
      { key: "warmGrens", label: "T-shirt kan vanaf gevoels-", eenheid: "graden", step: 1, min: 12, max: 22 },
      { key: "koudGrens", label: "Trui of meer onder gevoels-", eenheid: "graden", step: 1, min: 4, max: 16 },
      { key: "dagStart", label: "Dag begint om", eenheid: "uur", step: 1, min: 5, max: 10 },
      { key: "dagEind", label: "Dag eindigt om", eenheid: "uur", step: 1, min: 18, max: 24 },
    ],
    uitleg:
      "Het woord zegt hoe makkelijk de keuze is: Ideaal of Goed is een laag en klaar, Twijfelachtig een laagjesdag, Matig of slechter guur en nat. Het advies zelf staat er altijd in gewone taal bij.",
  },
  adviesLabels: {
    goed: "makkelijke keuze",
    matig: "laagjesdag",
    slecht: "gure dag",
  },
  affiliate: null,
};
