/**
 * lib/tools/skeeleren.js
 *
 * De skeelercheck (v3.29.0 "Ghibli"). Skeeleren is de meest
 * wegdek-gevoelige sport op de site: op nat asfalt grippen de wieltjes
 * niet en remmen wordt gokken, dus elke vorm van neerslag is hard
 * einde verhaal, ook motregen. Wind telt zwaarder dan bij hardlopen
 * (hogere snelheid, geen stuur om je aan vast te houden) en na een
 * bui heeft het wegdek een paar uur nodig om op te drogen; dat laatste
 * krijgt een eigen dagfactor.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "skeeleren",
    naam: "Kan ik vandaag skeeleren?",
    korteVraag: "Kan ik vandaag skeeleren?",
    meldingKort: "Skeelercheck",
    cta: "Check het rondje",
    navLabel: "Skeeleren",
    diepte: "Droog wegdek is alles: de check is streng op elke vorm van nat.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect skeelerweer", goed: "Prima skeelerweer", twijfelachtig: "Kan, blijf scherp", matig: "Riskant wegdek", "zeer-slecht": "Geen skeelerweer" },
    adviesLabels: { goed: "skeelerweer", matig: "kan, blijf scherp", slecht: "geen skeelerweer" },
    legenda: { links: "skates laten staan", rechts: "skeelerweer" },
    redenNat: "nat wegdek: geen grip en remmen wordt gokken",
    redenGeenBlok: "geen droog blok met werkbare wind",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur)`,
    redenBuien: "buien rond het beste blok: het wegdek blijft verraderlijk",
    redenWind: (w) => `stevige wind (${w} km/u): zwaar tegen, hard mee`,
    redenOpdrogen: "het wegdek moet na de regen van vanochtend eerst opdrogen",
    metric: (uur, g) => `Beste skeeleruur rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima skeelerweer: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste skeeleruren: ${tijd}.`,
    statusGeweest: "Het beste skeelerweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het geen dag om te skeeleren.",
    toekomstBeste: (tijd) => `Beste skeelerblok: ${tijd}.`,
    toekomstGeen: "Geen skeelerweer.",
    instWindVraag: "Waar skeeler je meestal?",
    instWindKeuzes: ["Beschut (park, bos)", "Gemengd", "Open dijk of polder"],
    instTempoVraag: "Hoe fanatiek ga je?",
    instTempoKeuzes: ["Rustig toertje", "Gemiddeld", "Training op tempo"],
    instDagStart: "Vroegste skeelertijd",
    instDagEind: "Laatste skeelertijd",
    instUur: "uur",
    instUitleg:
      "Elke vorm van neerslag betekent nee: nat asfalt en skeelerwieltjes gaan niet samen, en na een bui heeft het wegdek een paar uur nodig om op te drogen. Wind telt op tempo zwaarder mee dan bij een toertje. Ideaal is droog, 8 tot 24 graden gevoel en niet te veel wind.",
  },
  en: {
    slug: "inline-skating",
    naam: "Can I skate today?",
    korteVraag: "Can I inline skate today?",
    meldingKort: "Skating check",
    cta: "Check the loop",
    navLabel: "Inline skating",
    diepte: "Dry tarmac is everything: the check is strict on any wet.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect skating weather", goed: "Good skating weather", twijfelachtig: "Doable, stay sharp", matig: "Risky surface", "zeer-slecht": "No skating weather" },
    adviesLabels: { goed: "skating weather", matig: "doable, stay sharp", slecht: "no skating weather" },
    legenda: { links: "leave the skates", rechts: "skating weather" },
    redenNat: "wet tarmac: no grip and braking becomes a gamble",
    redenGeenBlok: "no dry window with workable wind",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short window (${u} hours)`,
    redenBuien: "showers around the best window: the surface stays treacherous",
    redenWind: (w) => `strong wind (${w} km/h): heavy against, fast along`,
    redenOpdrogen: "the surface needs to dry after this morning's rain first",
    metric: (uur, g) => `Best skating hour around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good skating weather right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best skating hours: ${tijd}.`,
    statusGeweest: "The best skating weather has been and gone today.",
    statusNiks: "Today isn't a day for skating.",
    toekomstBeste: (tijd) => `Best skating window: ${tijd}.`,
    toekomstGeen: "No skating weather.",
    instWindVraag: "Where do you usually skate?",
    instWindKeuzes: ["Sheltered (park, woods)", "Mixed", "Open dyke or polder"],
    instTempoVraag: "How serious do you go?",
    instTempoKeuzes: ["Easy tour", "Average", "Training at pace"],
    instDagStart: "Earliest skating time",
    instDagEind: "Latest skating time",
    instUur: "h",
    instUitleg:
      "Any precipitation means no: wet tarmac and skate wheels don't mix, and after a shower the surface needs a few hours to dry. Wind counts heavier at pace than on an easy tour. Ideal is dry, 8 to 24 degrees feels-like and modest wind.",
  },
});

export const SKEELER_DEFAULTS = {
  maxWind: 30,
  tempo: 0,
  dagStart: 8,
  dagEind: 21,
};

export function uurSkeelerScore(u, inst = SKEELER_DEFAULTS) {
  // Nat is hard nee, motregen bijna: grip is alles.
  if ((u.neerslag ?? 0) > 0.15 || (u.kans ?? 0) >= 70) return 0;
  if ((u.neerslag ?? 0) > 0.03) return 12;
  const gevoel = u.gevoel ?? u.temp ?? 12;
  let tempF;
  if (gevoel <= 16) {
    tempF = clamp(lerp(gevoel, 0, 10, 0.35, 1), 0.35, 1);
  } else {
    tempF = clamp(lerp(gevoel, 22, 32, 1, 0.35), 0.35, 1);
  }
  const wind = u.wind ?? 0;
  const windDrempel = inst.tempo === 1 ? inst.maxWind * 0.35 : inst.maxWind * 0.5;
  const windF = clamp(1 - Math.max(0, wind - windDrempel) / inst.maxWind, 0.15, 1);
  return clamp(Math.round(95 * tempF * windF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: SKEELER_DEFAULTS,
  uurScore: uurSkeelerScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 1,
  extraFactoren: ({ uren, venster }) => {
    // Opdroogfactor: regen eerder op de dag maakt het wegdek nog uren
    // verraderlijk, ook als de lucht alweer droog is.
    if (!venster) return [];
    const natUren = uren.filter((u) => (u.neerslag ?? 0) > 0.2).map((u) => u.uur);
    if (!natUren.length) return [];
    const laatstNat = Math.max(...natUren);
    if (venster.van - laatstNat >= 0 && venster.van - laatstNat < 3) {
      return [{ punten: 14, reden: T.redenOpdrogen }];
    }
    return [];
  },
});

export const skeeleren = {
  id: "skeeleren",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#2F7D62",
  locatieHint: T.locatieHint,
  icoon: "skeeler",
  categorieId: "sport",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: SKEELER_DEFAULTS },
  instellingen: {
    defaults: SKEELER_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "wind",
        vraag: T.instWindVraag,
        keuzes: [
          { label: T.instWindKeuzes[0], zet: { maxWind: 36 } },
          { label: T.instWindKeuzes[1], zet: { maxWind: 30 } },
          { label: T.instWindKeuzes[2], zet: { maxWind: 24 } },
        ],
      },
      {
        type: "keuze",
        id: "tempo",
        vraag: T.instTempoVraag,
        keuzes: [
          { label: T.instTempoKeuzes[0], zet: { tempo: -1 } },
          { label: T.instTempoKeuzes[1], zet: { tempo: 0 } },
          { label: T.instTempoKeuzes[2], zet: { tempo: 1 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 6, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 16, max: 23 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
