/**
 * lib/tools/houtkachel.js
 *
 * De stookcheck (v3.29.0 "Ghibli"). Gemodelleerd op de logica achter
 * het stookalert: bij windstil weer met vochtige lucht blijft rook in
 * de straat hangen en zitten de buren (en je eigen longen) erin. De
 * ideale stookavond heeft juist een matige wind die de rook afvoert;
 * heel harde wind geeft valwind en terugslag in het kanaal. De motor
 * beoordeelt de avonduren en geeft het beste stookmoment als de
 * omstandigheden binnen de avond nog verbeteren. Pelletkachels stoten
 * veel minder uit en tellen milder.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "houtkachel",
    naam: "Kan de houtkachel aan vanavond?",
    korteVraag: "Kan de kachel aan vanavond?",
    meldingKort: "Stookcheck",
    cta: "Check de stookavond",
    navLabel: "Houtkachel",
    diepte: "Stookalert-logica: bij windstil vochtig weer blijft de rook in de straat hangen.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Prima stookavond", goed: "Goede stookavond", twijfelachtig: "Kan, stook schoon", matig: "Ongunstig stookweer", "zeer-slecht": "Vanavond niet stoken" },
    adviesLabels: { goed: "stookavond", matig: "kan, stook schoon", slecht: "vanavond niet stoken" },
    legenda: { links: "niet stoken", rechts: "stookavond" },
    statusHangt: "Vanavond niet stoken: het is vrijwel windstil en vochtig, de rook blijft in de straat hangen en trekt bij de buren naar binnen.",
    statusMatig: "Ongunstig stookweer: er staat weinig wind, dus de rook voert traag af. Als je stookt, stook dan kort en schoon (droog hout, snel op temperatuur).",
    statusGoed: "Goede stookavond: de wind voert de rook netjes af.",
    statusHardeWind: (s) => `Stevige wind (stoten tot ${s} km/u): kans op valwind en terugslag in het kanaal. Houd het vuur klein of sla over.`,
    redenHangt: "vrijwel windstil en vochtig: rook blijft hangen",
    redenWeinigWind: "weinig wind: trage rookafvoer",
    redenGoedeWind: "matige wind: goede rookafvoer",
    redenHardeWind: (s) => `harde windstoten (${s} km/u): terugslagrisico`,
    redenPellet: "pelletkachel: veel schonere verbranding",
    metricBeter: (uur) => `Beste stookmoment na ${uur}:00 (de wind trekt dan aan).`,
    metricHeleAvond: "De omstandigheden blijven de hele avond gelijk.",
    instBebouwingVraag: "Hoe dicht is de bebouwing?",
    instBebouwingKeuzes: ["Rijtjeshuizen, dicht op elkaar", "Ruimer opgezet", "Vrijstaand of buitenaf"],
    instKachelVraag: "Wat stook je?",
    instKachelKeuzes: ["Open haard", "Houtkachel", "Pelletkachel"],
    instMomentVraag: "Wanneer stook je meestal?",
    instMomentKeuzes: ["Vroege avond", "Late avond"],
    instUitleg:
      "De check volgt de logica van het stookalert: bij windstil, vochtig weer stapelt houtrook zich op in de straat en is stoken echt af te raden, zeker in dichte bebouwing. Een matige wind is juist ideaal (goede afvoer), harde windstoten geven terugslagrisico. Een open haard stookt het vuilst, een pelletkachel het schoonst; de grenzen schuiven mee.",
  },
  en: {
    slug: "wood-stove",
    naam: "Can the wood stove go on tonight?",
    korteVraag: "Stove on tonight?",
    meldingKort: "Stove check",
    cta: "Check the evening",
    navLabel: "Wood stove",
    diepte: "Smog-alert logic: in calm, humid weather smoke hangs in the street.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Fine stove evening", goed: "Good stove evening", twijfelachtig: "Doable, burn clean", matig: "Poor burning weather", "zeer-slecht": "Don't burn tonight" },
    adviesLabels: { goed: "stove evening", matig: "doable, burn clean", slecht: "don't burn tonight" },
    legenda: { links: "don't burn", rechts: "stove evening" },
    statusHangt: "Don't burn tonight: it's nearly calm and humid, smoke hangs in the street and drifts into the neighbours' homes.",
    statusMatig: "Poor burning weather: little wind, so smoke disperses slowly. If you burn, keep it short and clean (dry wood, quickly up to temperature).",
    statusGoed: "A good stove evening: the wind carries the smoke away nicely.",
    statusHardeWind: (s) => `Strong wind (gusts to ${s} km/h): risk of downdraught and backdraft in the flue. Keep the fire small or skip.`,
    redenHangt: "nearly calm and humid: smoke lingers",
    redenWeinigWind: "little wind: slow smoke dispersal",
    redenGoedeWind: "moderate wind: good dispersal",
    redenHardeWind: (s) => `hard gusts (${s} km/h): backdraft risk`,
    redenPellet: "pellet stove: much cleaner burn",
    metricBeter: (uur) => `Best burning moment after ${uur}:00 (wind picks up then).`,
    metricHeleAvond: "Conditions stay the same all evening.",
    instBebouwingVraag: "How dense is the housing?",
    instBebouwingKeuzes: ["Terraced, close together", "More spacious", "Detached or rural"],
    instKachelVraag: "What do you burn?",
    instKachelKeuzes: ["Open fireplace", "Wood stove", "Pellet stove"],
    instMomentVraag: "When do you usually burn?",
    instMomentKeuzes: ["Early evening", "Late evening"],
    instUitleg:
      "The check follows smog-alert logic: in calm, humid weather wood smoke piles up in the street and burning is genuinely discouraged, especially in dense housing. Moderate wind is ideal (good dispersal), hard gusts bring backdraft risk. An open fireplace burns dirtiest, a pellet stove cleanest; the limits shift along.",
  },
});

export const KACHEL_DEFAULTS = { bebouwing: 0, kachel: 1, moment: 0 };
// kachel: 0 open haard, 1 houtkachel, 2 pellet.

export function overlay(hourly, nu = new Date(), instellingen = KACHEL_DEFAULTS) {
  const inst = { ...KACHEL_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const vandaagKey = dagKeyVan(nu);
  const datums = [...perDag.keys()].filter((d) => d >= vandaagKey).sort().slice(0, 5);

  const dagenUit = [];
  for (const datum of datums) {
    const alleUren = perDag.get(datum) ?? [];
    if (!alleUren.length) continue;
    const avond = alleUren.filter((u) => u.uur >= (inst.moment === 1 ? 20 : 18) && u.uur <= 23);
    if (!avond.length) continue;

    const gemWind = avond.reduce((a, u) => a + (u.wind ?? 0), 0) / avond.length;
    const gemRh = avond.reduce((a, u) => a + (u.rh ?? 70), 0) / avond.length;
    const piekStoten = Math.round(Math.max(...avond.map((u) => u.stoten ?? 0)));
    // Open haard vuiler, pellet schoner; dichte bebouwing strenger.
    const kachelF = inst.kachel === 0 ? 1.15 : inst.kachel === 2 ? 0.55 : 1;
    const buurtF = inst.bebouwing === 0 ? 1.15 : inst.bebouwing === 2 ? 0.8 : 1;

    const factoren = [];
    let zin;
    if (gemWind < 8 && gemRh >= 85) {
      factoren.push({ punten: Math.round(62 * kachelF * buurtF), reden: T.redenHangt });
      zin = T.statusHangt;
    } else if (gemWind < 10) {
      factoren.push({ punten: Math.round(42 * kachelF * buurtF), reden: T.redenWeinigWind });
      zin = T.statusMatig;
    } else if (piekStoten >= 65) {
      factoren.push({ punten: 36, reden: T.redenHardeWind(piekStoten) });
      zin = T.statusHardeWind(piekStoten);
    } else {
      factoren.push({ punten: 10, reden: T.redenGoedeWind });
      zin = T.statusGoed;
    }
    if (inst.kachel === 2) {
      factoren.push({ punten: -4, reden: T.redenPellet });
    }

    // Beste stookmoment: eerste avonduur waarop de wind boven de 10 komt.
    let metricZin = T.metricHeleAvond;
    if (gemWind < 10) {
      const beter = avond.find((u) => (u.wind ?? 0) >= 10);
      if (beter) metricZin = T.metricBeter(String(beter.uur).padStart(2, "0"));
    }

    const { score, redenen } = maakScore(factoren);
    const conditie = { score: clamp(score, 0, 100), redenen, advies: adviesVoorScore(clamp(score, 0, 100), houtkachel.adviesLabels) };

    dagenUit.push({
      datum,
      antwoord: { ja: score < 45, zin },
      uren: avond.map((u) => ({
        uur: u.uur,
        score: (u.wind ?? 0) < 8 && (u.rh ?? 70) >= 85 ? 15 : (u.wind ?? 0) < 10 ? 45 : (u.stoten ?? 0) >= 65 ? 40 : 90,
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

export const houtkachel = {
  id: "houtkachel",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#8C6239",
  locatieHint: T.locatieHint,
  icoon: "kachel",
  categorieId: "huis-tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: KACHEL_DEFAULTS },
  instellingen: {
    defaults: KACHEL_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "bebouwing",
        vraag: T.instBebouwingVraag,
        keuzes: [
          { label: T.instBebouwingKeuzes[0], zet: { bebouwing: 0 } },
          { label: T.instBebouwingKeuzes[1], zet: { bebouwing: 1 } },
          { label: T.instBebouwingKeuzes[2], zet: { bebouwing: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "kachel",
        vraag: T.instKachelVraag,
        keuzes: [
          { label: T.instKachelKeuzes[0], zet: { kachel: 0 } },
          { label: T.instKachelKeuzes[1], zet: { kachel: 1 } },
          { label: T.instKachelKeuzes[2], zet: { kachel: 2 } },
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
  affiliate: null,
};
