/**
 * lib/tools/hout-behandelen.js
 *
 * De houtbehandelcheck (v3.30.0 "Mistral"): beitsen, oliën of lakken
 * van een schutting, vlonder of tuinmeubels. Verschilt bewust van de
 * schildercheck op twee punten. Ten eerste moet het HOUT droog zijn:
 * beits en olie trekken niet in nat hout, dus regen in de uren VOOR
 * het klussen telt zwaar mee (het hout moet eerst opdrogen). Ten tweede
 * heeft de laag langer nodig om in te trekken en te drogen, dus regen
 * na afloop weegt strenger. Niet in de volle zon (beits droogt dan aan
 * het oppervlak op voordat hij intrekt).
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "hout-behandelen",
    naam: "Kan ik vandaag hout behandelen?",
    korteVraag: "Kan ik beitsen of oliën vandaag?",
    meldingKort: "Beitscheck",
    cta: "Check het klusweer",
    navLabel: "Hout behandelen",
    diepte: "Beitsen, oliën of lakken: het hout moet droog zijn en droog blijven.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect klusweer", goed: "Prima klusweer", twijfelachtig: "Kan, als het hout droog is", matig: "Lastig klusweer", "zeer-slecht": "Laat de beits staan" },
    adviesLabels: { goed: "klusweer", matig: "kan, met beleid", slecht: "geen klusweer" },
    legenda: { links: "beits blijft dicht", rechts: "klusweer" },
    redenNat: "te nat: beits en olie trekken niet in nat hout",
    redenGeenBlok: "geen droog blok met werkbare temperatuur",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenHoutNat: "het hout is nog nat van de regen van vanochtend: eerst laten opdrogen",
    redenNaRegen: "er komt regen kort na het blok: beits en olie hebben uren nodig om in te trekken",
    redenVochtig: (rh) => `hoge luchtvochtigheid (${rh}%): de laag droogt traag en blijft plakkerig`,
    redenHeet: (g) => `warm en zonnig (gevoel tot ${g} graden): beits droogt aan het oppervlak voordat hij intrekt`,
    metric: (uur, g) => `Beste klusmoment rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima klusweer: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste klusuren: ${tijd}.`,
    statusGeweest: "Het beste klusweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het geen dag om hout te behandelen.",
    toekomstBeste: (tijd) => `Beste klusblok: ${tijd}.`,
    toekomstGeen: "Geen klusweer.",
    instProductVraag: "Wat breng je aan?",
    instProductKeuzes: ["Beits (dekkend of transparant)", "Houtolie", "Lak of vernis"],
    instHoutVraag: "Waar staat het hout?",
    instHoutKeuzes: ["In de zon", "Half beschaduwd", "In de schaduw (droogt traag)"],
    instDagStart: "Vroegste starttijd",
    instDagEind: "Laatste starttijd",
    instUur: "uur",
    instUitleg:
      "Anders dan verf trekken beits en olie in het hout, en dat lukt alleen als het hout droog is. Regen van eerder op de dag telt daarom mee: nat hout moet eerst opdrogen (reken op een halve dag zon). De laag heeft na afloop uren nodig om in te trekken, dus regen kort erna is funest. Werk niet in de volle zon: dan droogt beits aan het oppervlak op voordat hij intrekt. Hout in de schaduw droogt trager, houd daar rekening mee.",
  },
  en: {
    slug: "wood-treatment",
    naam: "Can I treat wood today?",
    korteVraag: "Can I stain or oil wood today?",
    meldingKort: "Staining check",
    cta: "Check the job weather",
    navLabel: "Wood treatment",
    diepte: "Staining, oiling or varnishing: the wood must be dry and stay dry.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect job weather", goed: "Good job weather", twijfelachtig: "Doable if the wood is dry", matig: "Tricky job weather", "zeer-slecht": "Leave the stain" },
    adviesLabels: { goed: "job weather", matig: "doable with care", slecht: "no job weather" },
    legenda: { links: "stain stays shut", rechts: "job weather" },
    redenNat: "too wet: stain and oil won't soak into wet wood",
    redenGeenBlok: "no dry window with workable temperature",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenHoutNat: "the wood is still wet from this morning's rain: let it dry first",
    redenNaRegen: "rain comes shortly after: stain and oil need hours to soak in",
    redenVochtig: (rh) => `high humidity (${rh}%): the coat dries slowly and stays tacky`,
    redenHeet: (g) => `warm and sunny (feels like up to ${g} degrees): stain skins over before it soaks in`,
    metric: (uur, g) => `Best job moment around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good job weather now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best job hours: ${tijd}.`,
    statusGeweest: "The best job weather has been and gone today.",
    statusNiks: "Today isn't a day to treat wood.",
    toekomstBeste: (tijd) => `Best job window: ${tijd}.`,
    toekomstGeen: "No job weather.",
    instProductVraag: "What are you applying?",
    instProductKeuzes: ["Stain (opaque or transparent)", "Wood oil", "Varnish or lacquer"],
    instHoutVraag: "Where is the wood?",
    instHoutKeuzes: ["In the sun", "Partly shaded", "In the shade (dries slowly)"],
    instDagStart: "Earliest start",
    instDagEind: "Latest start",
    instUur: "h",
    instUitleg:
      "Unlike paint, stain and oil soak into the wood, which only works if the wood is dry. Earlier rain counts: wet wood must dry first (reckon on half a day of sun). The coat needs hours to soak in afterwards, so rain soon after is fatal. Don't work in blazing sun: stain skins over before it soaks in. Wood in the shade dries slower.",
  },
});

export const HOUT_DEFAULTS = {
  product: 0, // 0 beits, 1 olie, 2 lak
  standplaats: 1, // 0 zon, 1 half, 2 schaduw
  dagStart: 9,
  dagEind: 17,
};

export function uurHoutScore(u, inst = HOUT_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.1 || (u.kans ?? 0) >= 60) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 12;
  let tempF;
  if (gevoel <= 10) {
    tempF = clamp(lerp(gevoel, 3, 12, 0.15, 1), 0.15, 1);
  } else {
    tempF = clamp(lerp(gevoel, 22, 32, 1, 0.45), 0.45, 1);
  }
  const rh = u.rh ?? 70;
  const vochtF = rh <= 85 ? 1 : clamp(lerp(rh, 85, 98, 1, 0.4), 0.4, 1);
  // Beits en olie mogen niet in de knallende zon; lak is minder gevoelig.
  const zonGevoelig = inst.product !== 2;
  const zonHeet = zonGevoelig && gevoel >= 23 && u.dag && (u.bewolking ?? 50) < 35;
  const zonF = zonHeet ? 0.78 : 1;
  return clamp(Math.round(95 * tempF * vochtF * zonF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: HOUT_DEFAULTS,
  uurScore: uurHoutScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 2,
  extraFactoren: ({ uren, venster, inst }) => {
    if (!venster) return [];
    const uit = [];
    // Hout nog nat: regen in de uren VOOR het blok. Schaduwhout droogt
    // trager, dus daar telt eerdere regen langer door.
    const opdroogUren = inst.standplaats === 2 ? 5 : inst.standplaats === 0 ? 2 : 3;
    const voorUren = uren.filter((u) => u.uur < venster.van && u.uur >= venster.van - opdroogUren);
    if (voorUren.some((u) => (u.neerslag ?? 0) > 0.3)) {
      uit.push({ punten: 22, reden: T.redenHoutNat });
    }
    // Regen kort na het blok: beits/olie moet intrekken (strenger dan verf).
    const naUren = uren.filter((u) => u.uur > venster.tot && u.uur <= venster.tot + 6);
    if (naUren.some((u) => (u.neerslag ?? 0) > 0.2 || (u.kans ?? 0) >= 60)) {
      uit.push({ punten: 34, reden: T.redenNaRegen });
    }
    const gemRh = Math.round(venster.blok.reduce((a, u) => a + (u.rh ?? 70), 0) / venster.uren);
    if (gemRh > 88) {
      uit.push({ punten: 12, reden: T.redenVochtig(gemRh) });
    }
    const maxGevoel = Math.round(Math.max(...venster.blok.map((u) => u.gevoel ?? u.temp ?? 0)));
    const zonnig = venster.blok.some((u) => u.dag && (u.bewolking ?? 50) < 35);
    if (inst.product !== 2 && maxGevoel >= 25 && zonnig) {
      uit.push({ punten: 10, reden: T.redenHeet(maxGevoel) });
    }
    return uit;
  },
});

export const houtBehandelen = {
  id: "hout-behandelen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#8C6239",
  locatieHint: T.locatieHint,
  icoon: "beitskwast",
  categorieId: "huis-tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: HOUT_DEFAULTS },
  instellingen: {
    defaults: HOUT_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "product",
        vraag: T.instProductVraag,
        keuzes: [
          { label: T.instProductKeuzes[0], zet: { product: 0 } },
          { label: T.instProductKeuzes[1], zet: { product: 1 } },
          { label: T.instProductKeuzes[2], zet: { product: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "standplaats",
        vraag: T.instHoutVraag,
        keuzes: [
          { label: T.instHoutKeuzes[0], zet: { standplaats: 0 } },
          { label: T.instHoutKeuzes[1], zet: { standplaats: 1 } },
          { label: T.instHoutKeuzes[2], zet: { standplaats: 2 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 7, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 14, max: 20 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
