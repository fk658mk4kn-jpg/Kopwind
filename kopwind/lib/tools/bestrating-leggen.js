/**
 * lib/tools/bestrating-leggen.js
 *
 * De bestratingcheck (v3.33.0 "Autan"). Tegels, klinkers of stapstenen
 * leggen wil een droge, werkbare dag: je legt in een droog bed, en zeker
 * bij voegen met voegmortel of het inspoelen van voegzand mag het tijdens
 * en kort erna niet regenen. Vorst is uit den boze als je met mortel of
 * stabilisatie werkt. De motor zoekt het beste, droogste blok en let op
 * regen kort na het blok en op nachtvorst.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "bestrating-leggen",
    naam: "Kan ik bestrating leggen?",
    korteVraag: "Kan ik bestrating leggen?",
    meldingKort: "Bestratingcheck",
    cta: "Check het bestratingsweer",
    navLabel: "Bestrating leggen",
    diepte: "Het beste droge blok: droog tijdens en na, werkbare temperatuur en geen nachtvorst.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect bestratingsweer", goed: "Prima om te leggen", twijfelachtig: "Kan, houd de lucht in de gaten", matig: "Lastig bestratingsweer", "zeer-slecht": "Niet leggen" },
    adviesLabels: { goed: "bestratingsweer", matig: "kan, met beleid", slecht: "niet leggen" },
    legenda: { links: "laat de stenen liggen", rechts: "bestratingsweer" },
    redenNat: "te nat: je legt in een droog bed, niet in de modder",
    redenGeenBlok: "geen droog blok met werkbare temperatuur",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort droog blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenWind: (w) => `harde wind (rond ${w} km/u): stof en zand waaien weg`,
    redenNaRegen: "regen kort na het blok: voegmortel of ingespoeld voegzand spoelt uit",
    redenVorst: "nachtvorst op komst: met mortel of stabilisatie is dat schadelijk",
    redenKoud: (g) => `koud (gevoel ${g} graden): mortel en stabilisatie binden traag`,
    metric: (uur, g) => `Beste legmoment rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima om te leggen: het droge blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste leguren: ${tijd}.`,
    statusGeweest: "Het beste bestratingsweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het geen dag om bestrating te leggen.",
    toekomstBeste: (tijd) => `Beste droge blok: ${tijd}.`,
    toekomstGeen: "Geen bestratingsweer.",
    instMethodeVraag: "Hoe leg je?",
    instMethodeKeuzes: ["In zand (los)", "In split of stabilisatie", "Met voegmortel"],
    instKouVraag: "Vanaf welke temperatuur werk je?",
    instKouKeuzes: ["Pas vanaf 10 graden", "Vanaf 5 graden", "Ook net boven nul"],
    instDagStart: "Vroegste starttijd",
    instDagEind: "Laatste starttijd",
    instUur: "uur",
    instUitleg:
      "De check zoekt een droog blok met een werkbare temperatuur. Leg je los in zand, dan is regen kort erna minder erg; werk je met split, stabilisatie of voegmortel, dan mag het tijdens en kort na het leggen niet regenen, anders spoelt het uit of bindt het slecht. Nachtvorst is schadelijk zodra er mortel of stabilisatie in het spel is. Harde wind blaast zand en stof weg. Stel je methode en je ondergrens in, dan schuift de check mee.",
  },
  en: {
    slug: "laying-paving",
    naam: "Can I lay paving today?",
    korteVraag: "Can I lay paving today?",
    meldingKort: "Paving check",
    cta: "Check the paving weather",
    navLabel: "Laying paving",
    diepte: "The best dry window: dry during and after, workable temperature and no night frost.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect paving weather", goed: "Fine to lay", twijfelachtig: "Doable, watch the sky", matig: "Tricky paving weather", "zeer-slecht": "Don't lay" },
    adviesLabels: { goed: "paving weather", matig: "doable with care", slecht: "don't lay" },
    legenda: { links: "leave the stones", rechts: "paving weather" },
    redenNat: "too wet: you lay in a dry bed, not in mud",
    redenGeenBlok: "no dry window with workable temperature",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short dry window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenWind: (w) => `strong wind (around ${w} km/h): dust and sand blow away`,
    redenNaRegen: "rain shortly after the window: jointing mortar or swept-in sand washes out",
    redenVorst: "night frost coming: with mortar or stabilisation that's damaging",
    redenKoud: (g) => `cold (feels like ${g} degrees): mortar and stabilisation set slowly`,
    metric: (uur, g) => `Best laying moment around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Fine to lay now: the dry window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best laying hours: ${tijd}.`,
    statusGeweest: "The best paving weather has been and gone today.",
    statusNiks: "Today isn't a day for laying paving.",
    toekomstBeste: (tijd) => `Best dry window: ${tijd}.`,
    toekomstGeen: "No paving weather.",
    instMethodeVraag: "How are you laying?",
    instMethodeKeuzes: ["In sand (loose)", "In grit or stabilisation", "With jointing mortar"],
    instKouVraag: "From what temperature do you work?",
    instKouKeuzes: ["Only from 10 degrees", "From 5 degrees", "Even just above zero"],
    instDagStart: "Earliest start",
    instDagEind: "Latest start",
    instUur: "h",
    instUitleg:
      "The check finds a dry window at a workable temperature. If you lay loose in sand, rain soon after matters less; with grit, stabilisation or jointing mortar it must not rain during or shortly after laying, or it washes out or sets poorly. Night frost is damaging once mortar or stabilisation is involved. Strong wind blows sand and dust away. Set your method and lower limit and the check adjusts.",
  },
});

export const BESTRATING_DEFAULTS = { methode: 1, minTemp: 5, dagStart: 8, dagEind: 18 };

export function uurBestratingScore(u, inst = BESTRATING_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.1 || (u.kans ?? 0) >= 60) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 12;
  const tempF = clamp(lerp(gevoel, inst.minTemp - 5, inst.minTemp + 4, 0.1, 1), 0.1, 1);
  const windF = clamp(1 - Math.max(0, (u.wind ?? 0) - 32) / 45, 0.6, 1);
  return clamp(Math.round(96 * tempF * windF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: BESTRATING_DEFAULTS,
  uurScore: uurBestratingScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 2,
  extraFactoren: ({ uren, venster, inst }) => {
    if (!venster) return [];
    const uit = [];
    // Met mortel of stabilisatie: regen kort na het blok spoelt uit.
    if (inst.methode >= 1) {
      const naUren = uren.filter((u) => u.uur > venster.tot && u.uur <= venster.tot + 5);
      if (naUren.some((u) => (u.neerslag ?? 0) > 0.2 || (u.kans ?? 0) >= 65)) {
        uit.push({ punten: 26, reden: T.redenNaRegen });
      }
    }
    const minGevoel = Math.round(Math.min(...venster.blok.map((u) => u.gevoel ?? u.temp ?? 99)));
    if (minGevoel < inst.minTemp) uit.push({ punten: 12, reden: T.redenKoud(minGevoel) });
    // Nachtvorst na een mortel-/stabilisatieklus.
    if (inst.methode >= 1) {
      const naNacht = uren.filter((u) => u.uur >= 22 || u.uur <= 6);
      if (naNacht.some((u) => (u.temp ?? 10) < 0)) uit.push({ punten: 16, reden: T.redenVorst });
    }
    return uit;
  },
});

export const bestratingLeggen = {
  id: "bestrating-leggen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#8C6239",
  locatieHint: T.locatieHint,
  icoon: "tegels",
  categorieId: "huis-tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: BESTRATING_DEFAULTS },
  instellingen: {
    defaults: BESTRATING_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "methode",
        vraag: T.instMethodeVraag,
        keuzes: [
          { label: T.instMethodeKeuzes[0], zet: { methode: 0 } },
          { label: T.instMethodeKeuzes[1], zet: { methode: 1 } },
          { label: T.instMethodeKeuzes[2], zet: { methode: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "kou",
        vraag: T.instKouVraag,
        keuzes: [
          { label: T.instKouKeuzes[0], zet: { minTemp: 10 } },
          { label: T.instKouKeuzes[1], zet: { minTemp: 5 } },
          { label: T.instKouKeuzes[2], zet: { minTemp: 1 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 7, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 14, max: 20 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-19",
  affiliate: {
    kop: { nl: "Zelf bestraten", en: "Laying paving yourself" },
    advies: {
      nl: "Voor een strak resultaat: een trilplaat (vaak te huur) verdicht de ondergrond, een rubberen hamer en een waterpas houden het vlak, en voegsplit of voegmortel maakt het af. Een straatkoffer met knieschot scheelt je rug.",
      en: "For a tidy result: a plate compactor (often rentable) firms the base, a rubber mallet and a level keep it flat, and jointing grit or mortar finishes it. Knee pads save your back.",
    },
    items: [
      { label: { nl: "Straatgereedschap", en: "Paving tools" }, url: "https://www.bol.com/nl/nl/s/?searchtext=straatgereedschap", partner: "bol.com" },
    ],
  },
};
