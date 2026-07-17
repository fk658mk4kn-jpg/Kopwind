/**
 * lib/tools/sterrenkijken.js
 *
 * De sterrencheck (v3.17.0 "Passaat"), een avondmodel: per dag worden
 * de uren 21 tot 24 beoordeeld op bewolking (de baas), neerslag en
 * schemering (op lichte zomeravonden is de hemel om 22 uur nog niet
 * donker; het daglicht-veld verklikt dat). De maanfase rekenen we
 * lokaal uit met de synodische maand: een (bijna) volle maan
 * overstraalt zwakke sterren en de Melkweg, en kost punten met een
 * eerlijke reden erbij.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { jaVoor } from "../engine/schaal.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "sterrenkijken",
    naam: "Is het sterrenkijkweer vanavond?",
    korteVraag: "Is het sterrenkijkweer vanavond?",
    meldingKort: "Sterrencheck",
    cta: "Check de avondlucht",
    navLabel: "Sterrenkijken",
    diepte: "Heldere lucht, de maanfase en het donkerste uur.",
    locatieHint: "Zoek je stad of een donkere plek...",
    schaalLabels: { ideaal: "Heldere sterrenhemel", goed: "Goed sterrenkijkweer", twijfelachtig: "Wisselend wolkendek", matig: "Veel bewolking", "zeer-slecht": "Dichte bewolking" },
    adviesLabels: { goed: "sterrenkijkweer", matig: "kan, tussen de wolken door", slecht: "geen sterrenkijkweer" },
    legenda: { links: "bewolkt", rechts: "heldere hemel" },
    redenBewolkt: (p) => `veel bewolking vanavond (rond ${p}%)`,
    redenWisselend: (p) => `wisselend wolkendek (rond ${p}%)`,
    redenNat: "neerslag in de avond",
    redenMaan: "een (bijna) volle maan overstraalt zwakke sterren",
    redenSchemer: "lichte zomeravond: echt donker wordt het pas laat",
    redenHelder: (p) => `nagenoeg heldere hemel (bewolking rond ${p}%)`,
    metric: (uur, p) => `Helderste uur rond ${uur}:00 (bewolking ${p}%).`,
    statusJaVandaag: (uur) => `Goede avond om sterren te kijken: het helderst rond ${uur}:00.`,
    statusTwijfelVandaag: "Wisselend: pak de heldere gaten tussen de wolken.",
    statusNeeVandaag: "Vanavond geen sterrenhemel: te veel bewolking.",
    statusJa: (uur) => `Die avond goed sterrenkijkweer, het helderst rond ${uur}:00.`,
    statusTwijfel: "Die avond wisselend wolkendek.",
    statusNee: "Die avond te veel bewolking.",
    instStartLabel: "Kijken vanaf",
    instEindLabel: "Kijken tot",
    instMaanVraag: "Wat wil je zien?",
    instMaanKeuzes: ["Zwakke sterren en Melkweg", "Gewoon een mooie hemel"],
    instUur: "uur",
    instUitleg:
      "Bewolking is de baas: onder de 25% is de hemel bruikbaar helder. De maan telt mee als je voor zwakke sterren en de Melkweg gaat; rond volle maan verzuipt dat in het licht. En op zomeravonden is het om 22:00 vaak nog schemerig: echt donker begint pas later. Zoek voor het mooiste beeld een plek buiten de stadsverlichting.",
  },
  en: {
    slug: "stargazing",
    naam: "Good stargazing tonight?",
    korteVraag: "Good stargazing tonight?",
    meldingKort: "Stargazing check",
    cta: "Check the night sky",
    navLabel: "Stargazing",
    diepte: "Clear skies, the moon phase and the darkest hour.",
    locatieHint: "Search your town or a dark spot...",
    schaalLabels: { ideaal: "Crystal-clear night sky", goed: "Good stargazing weather", twijfelachtig: "Broken cloud", matig: "Mostly cloudy", "zeer-slecht": "Overcast" },
    adviesLabels: { goed: "stargazing weather", matig: "doable between clouds", slecht: "no stargazing weather" },
    legenda: { links: "overcast", rechts: "clear sky" },
    redenBewolkt: (p) => `a lot of cloud tonight (around ${p}%)`,
    redenWisselend: (p) => `broken cloud (around ${p}%)`,
    redenNat: "precipitation in the evening",
    redenMaan: "a (nearly) full moon outshines faint stars",
    redenSchemer: "light summer evening: real darkness comes late",
    redenHelder: (p) => `virtually clear sky (cloud around ${p}%)`,
    metric: (uur, p) => `Clearest hour around ${uur}:00 (cloud ${p}%).`,
    statusJaVandaag: (uur) => `Good night for stargazing: clearest around ${uur}:00.`,
    statusTwijfelVandaag: "Mixed: catch the clear gaps between the clouds.",
    statusNeeVandaag: "No starry sky tonight: too much cloud.",
    statusJa: (uur) => `Good stargazing that night, clearest around ${uur}:00.`,
    statusTwijfel: "Broken cloud that night.",
    statusNee: "Too much cloud that night.",
    instStartLabel: "Watching from",
    instEindLabel: "Watching until",
    instMaanVraag: "What do you want to see?",
    instMaanKeuzes: ["Faint stars and the Milky Way", "Just a nice sky"],
    instUur: "h",
    instUitleg:
      "Cloud cover rules: below 25% the sky is usably clear. The moon matters if you're after faint stars and the Milky Way; around full moon those drown in the glow. And on summer evenings it's often still twilight at 22:00: real darkness starts later. For the best view, find a spot away from city lights.",
  },
});

export const STERREN_DEFAULTS = {
  dagStart: 21,
  dagEind: 24,
  deepSky: false,
};

/**
 * Verlichtingsfractie van de maan (0 = nieuw, 1 = vol), lokaal
 * berekend met de synodische maand van 29,53 dagen vanaf de nieuwe
 * maan van 6 januari 2000, 18:14 UTC. Ruim nauwkeurig genoeg om te
 * weten of de maan stoort.
 */
export function maanFractie(datum) {
  const ref = Date.UTC(2000, 0, 6, 18, 14);
  const synodisch = 29.530588;
  const dagen = (datum.getTime() - ref) / 86400000;
  const fase = ((dagen % synodisch) + synodisch) % synodisch;
  return (1 - Math.cos((2 * Math.PI * fase) / synodisch)) / 2;
}

function uurSterrenScore(u) {
  if ((u.neerslag ?? 0) > 0.05) return 0;
  const bewolking = u.bewolking ?? 60;
  let score = clamp(Math.round(100 - bewolking), 0, 100);
  if (u.dag) score = Math.round(score * 0.4); // schemering: nog geen echte nacht
  return score;
}

export function overlay(hourly, nu = new Date(), instellingen = STERREN_DEFAULTS) {
  const inst = { ...STERREN_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, inst.dagStart, inst.dagEind);
  const vandaagKey = dagKeyVan(nu);

  const dagen = [];
  for (const [datum, dagUren] of perDag) {
    if (datum < vandaagKey) continue;
    dagen.push({ datum, dagUren });
  }
  dagen.sort((a, b) => (a.datum < b.datum ? -1 : 1));

  const dagenUit = dagen.slice(0, 5).map(({ datum, dagUren }) => {
    const uren = dagUren.map((u) => ({
      ...u,
      score: uurSterrenScore(u),
      nat: (u.neerslag ?? 0) > 0.05,
    }));
    const gemBewolking = Math.round(
      dagUren.reduce((a, u) => a + (u.bewolking ?? 60), 0) / dagUren.length
    );
    const natUren = uren.filter((u) => u.nat).length;
    const schemer = dagUren.some((u) => u.dag);
    const maan = maanFractie(new Date(`${datum}T22:00:00`));
    const maanStoort = inst.deepSky && maan >= 0.75;

    const factoren = [];
    if (natUren > 0) factoren.push({ punten: 30, reden: T.redenNat });
    if (gemBewolking >= 65) {
      factoren.push({ punten: 60, reden: T.redenBewolkt(gemBewolking) });
    } else if (gemBewolking >= 30) {
      factoren.push({ punten: 28, reden: T.redenWisselend(gemBewolking) });
    } else {
      factoren.push({ punten: Math.round(gemBewolking * 0.5), reden: gemBewolking <= 15 ? T.redenHelder(gemBewolking) : null });
    }
    if (maanStoort) factoren.push({ punten: 18, reden: T.redenMaan });
    if (schemer) factoren.push({ punten: 10, reden: T.redenSchemer });

    const { score, redenen } = maakScore(factoren);
    const conditie = { score, redenen, advies: adviesVoorScore(score, sterrenkijken.adviesLabels) };

    const top = uren.reduce((a, u) => (u.score > a.score ? u : a), uren[0]);
    const ja = jaVoor(score);
    const twijfel = !ja && score >= 45;

    const isVandaag = datum === vandaagKey;
    const topUur = String(top?.uur ?? 23).padStart(2, "0");
    const zin = ja
      ? (isVandaag ? T.statusJaVandaag : T.statusJa)(topUur)
      : twijfel
        ? isVandaag
          ? T.statusTwijfelVandaag
          : T.statusTwijfel
        : isVandaag
          ? T.statusNeeVandaag
          : T.statusNee;
    const status = { soort: "info", zin };

    return {
      datum,
      antwoord: { ja, zin },
      uren: uren.map((u) => ({ uur: u.uur, score: u.score, nat: u.nat })),
      venster: null,
      metric: top ? { zin: T.metric(topUur, Math.round(top.bewolking ?? 0)) } : null,
      conditie,
      status,
    };
  });

  return { dagen: dagenUit };
}

export const sterrenkijken = {
  id: "sterrenkijken",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#C24E3F",
  locatieHint: T.locatieHint,
  icoon: "ster",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: STERREN_DEFAULTS },
  instellingen: {
    defaults: STERREN_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "doel",
        vraag: T.instMaanVraag,
        keuzes: [
          { label: T.instMaanKeuzes[0], zet: { deepSky: true } },
          { label: T.instMaanKeuzes[1], zet: { deepSky: false } },
        ],
      },
      { key: "dagStart", label: T.instStartLabel, eenheid: T.instUur, step: 1, min: 20, max: 23 },
      { key: "dagEind", label: T.instEindLabel, eenheid: T.instUur, step: 1, min: 22, max: 24 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-16",
  affiliate: null,
};
