/**
 * lib/tools/speeltuin.js
 *
 * De speeltuincheck (v3.33.0 "Autan"). Kan ik met de kinderen naar de
 * speeltuin? Je wilt een droog, aangenaam blok: droog is de harde eis,
 * en lekker weer betekent voor kinderen niet te koud en niet bloedheet.
 * Bij fel zonlicht is smeren en een pet het advies, en metalen glijbanen
 * en klimrekken worden in de volle zon snikheet. De motor zoekt het
 * fijnste, droogste blok om te gaan.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "speeltuin",
    naam: "Kan ik naar de speeltuin?",
    korteVraag: "Kan ik naar de speeltuin?",
    meldingKort: "Speeltuincheck",
    cta: "Check het speeltuinweer",
    navLabel: "Speeltuin",
    diepte: "Het fijnste droge blok om met de kinderen naar buiten te gaan.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect speeltuinweer", goed: "Prima om te gaan", twijfelachtig: "Kan, houd rekening met de kou of hitte", matig: "Minder fijn buiten", "zeer-slecht": "Blijf lekker binnen" },
    adviesLabels: { goed: "speeltuinweer", matig: "kan, met een jas of zonnehoed", slecht: "liever binnen" },
    legenda: { links: "binnen spelen", rechts: "speeltuinweer" },
    redenNat: "regen: natte glijbanen en schommels, dan is het binnen leuker",
    redenGeenBlok: "geen droog, aangenaam blok vandaag",
    redenMatigBlok: (g, w) => `het fijnste blok is maar matig (gevoel rond ${g} graden)`,
    redenKortBlok: (u) => `maar een kort droog blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenWind: (w) => `stevige wind (rond ${w} km/u): koud op een open speelplek`,
    redenKoud: (g) => `fris (gevoel ${g} graden): jassen en mutsen aan`,
    redenHeet: (g) => `heet (gevoel ${g} graden): metalen speeltoestellen worden snikheet, zoek schaduw`,
    redenUV: "felle zon: smeren en een petje of zonnehoed op",
    metric: (uur, g) => `Fijnste moment rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima om te gaan: het droge blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Fijnste, droogste uren: ${tijd}.`,
    statusGeweest: "Het fijnste speeltuinweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het buiten geen speeltuinweer.",
    toekomstBeste: (tijd) => `Fijnste blok: ${tijd}.`,
    toekomstGeen: "Geen speeltuinweer.",
    instLeeftijdVraag: "Voor wie is het?",
    instLeeftijdKeuzes: ["Kleintjes (peuters)", "Basisschoolleeftijd", "Grotere kinderen"],
    instGevoeligVraag: "Hoe gevoelig voor kou?",
    instGevoeligKeuzes: ["Snel koud", "Normaal", "Deert niet snel"],
    instDagStart: "Vroegste tijd",
    instDagEind: "Laatste tijd",
    instUur: "uur",
    instUitleg:
      "De check zoekt het fijnste, droogste blok van de dag. Droog is de harde eis: natte toestellen zijn glad en geen pret. Daarnaast telt de gevoelstemperatuur: kleintjes koelen sneller af, dus voor peuters schuift de ondergrens omhoog. Bij felle zon krijg je een smeer- en zonnehoedwaarschuwing, en bij hitte de tip dat metalen glijbanen en klimrekken heet worden en dat schaduw fijn is. Stel de leeftijd en de kougevoeligheid in, dan schuift de check mee.",
  },
  en: {
    slug: "playground",
    naam: "Can we go to the playground?",
    korteVraag: "Can we go to the playground?",
    meldingKort: "Playground check",
    cta: "Check the playground weather",
    navLabel: "Playground",
    diepte: "The nicest dry window to head outside with the kids.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect playground weather", goed: "Fine to go", twijfelachtig: "Doable, mind the cold or heat", matig: "Less pleasant outside", "zeer-slecht": "Stay inside" },
    adviesLabels: { goed: "playground weather", matig: "doable, with a coat or sun hat", slecht: "rather inside" },
    legenda: { links: "play inside", rechts: "playground weather" },
    redenNat: "rain: wet slides and swings, better inside then",
    redenGeenBlok: "no dry, pleasant window today",
    redenMatigBlok: (g, w) => `the nicest window is only so-so (feels like ${g} degrees)`,
    redenKortBlok: (u) => `only a short dry window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenWind: (w) => `stiff wind (around ${w} km/h): cold on an open playground`,
    redenKoud: (g) => `chilly (feels like ${g} degrees): coats and hats on`,
    redenHeet: (g) => `hot (feels like ${g} degrees): metal equipment gets scorching, find shade`,
    redenUV: "strong sun: sunscreen and a cap or sun hat",
    metric: (uur, g) => `Nicest moment around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Fine to go now: the dry window runs until ${tijd}.`,
    statusBeste: (tijd) => `Nicest, driest hours: ${tijd}.`,
    statusGeweest: "The nicest playground weather has been and gone today.",
    statusNiks: "Today isn't playground weather outside.",
    toekomstBeste: (tijd) => `Nicest window: ${tijd}.`,
    toekomstGeen: "No playground weather.",
    instLeeftijdVraag: "Who is it for?",
    instLeeftijdKeuzes: ["Little ones (toddlers)", "Primary-school age", "Older children"],
    instGevoeligVraag: "How cold-sensitive?",
    instGevoeligKeuzes: ["Chills quickly", "Normal", "Not easily bothered"],
    instDagStart: "Earliest time",
    instDagEind: "Latest time",
    instUur: "h",
    instUitleg:
      "The check finds the nicest, driest window of the day. Dry is the hard requirement: wet equipment is slippery and no fun. Feels-like temperature counts too: little ones cool down faster, so for toddlers the lower limit shifts up. Strong sun triggers a sunscreen and sun-hat warning, and heat brings the tip that metal slides and frames get hot and shade is welcome. Set the age and cold sensitivity and the check adjusts.",
  },
});

export const SPEELTUIN_DEFAULTS = { ondergrens: 10, dagStart: 9, dagEind: 18 };

export function uurSpeeltuinScore(u, inst = SPEELTUIN_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.1 || (u.kans ?? 0) >= 60) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 12;
  const onder = inst.ondergrens ?? 10;
  // Warmte-comfort: onder de ondergrens fris, rond 17-25 ideaal, boven 30 te heet.
  const koelF = clamp(lerp(gevoel, onder - 6, onder + 5, 0.15, 1), 0.15, 1);
  const heetF = clamp(lerp(gevoel, 28, 36, 1, 0.45), 0.45, 1);
  const windF = clamp(1 - Math.max(0, (u.wind ?? 0) - 30) / 50, 0.65, 1);
  return clamp(Math.round(96 * koelF * heetF * windF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: SPEELTUIN_DEFAULTS,
  uurScore: uurSpeeltuinScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 2,
  extraFactoren: ({ venster, inst }) => {
    if (!venster) return [];
    const uit = [];
    const minGevoel = Math.round(Math.min(...venster.blok.map((u) => u.gevoel ?? u.temp ?? 99)));
    const maxGevoel = Math.round(Math.max(...venster.blok.map((u) => u.gevoel ?? u.temp ?? -99)));
    const maxUV = Math.max(...venster.blok.map((u) => u.uv ?? 0));
    if (minGevoel < (inst.ondergrens ?? 10)) uit.push({ punten: 10, reden: T.redenKoud(minGevoel) });
    if (maxGevoel >= 30) uit.push({ punten: 12, reden: T.redenHeet(maxGevoel) });
    if (maxUV >= 6) uit.push({ punten: 8, reden: T.redenUV });
    return uit;
  },
});

export const speeltuin = {
  id: "speeltuin",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#C24E3F",
  locatieHint: T.locatieHint,
  icoon: "glijbaan",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: SPEELTUIN_DEFAULTS },
  instellingen: {
    defaults: SPEELTUIN_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "leeftijd",
        vraag: T.instLeeftijdVraag,
        keuzes: [
          { label: T.instLeeftijdKeuzes[0], zet: { ondergrens: 13 } },
          { label: T.instLeeftijdKeuzes[1], zet: { ondergrens: 10 } },
          { label: T.instLeeftijdKeuzes[2], zet: { ondergrens: 8 } },
        ],
      },
      {
        type: "keuze",
        id: "gevoelig",
        vraag: T.instGevoeligVraag,
        keuzes: [
          { label: T.instGevoeligKeuzes[0], zet: { ondergrens: 13 } },
          { label: T.instGevoeligKeuzes[1], zet: { ondergrens: 10 } },
          { label: T.instGevoeligKeuzes[2], zet: { ondergrens: 8 } },
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
    kop: { nl: "Klaar voor de speeltuin", en: "Ready for the playground" },
    advies: {
      nl: "Bij zon horen zonnebrand en een petje of zonnehoed; een drinkfles voorkomt gezeur halverwege. Voor de kleintjes is een lichte bodywarmer of windjack fijn als het toch fris tegenvalt.",
      en: "Sun means sunscreen and a cap or sun hat; a water bottle avoids halfway grumbles. For the little ones a light bodywarmer or windbreaker helps if it turns chilly.",
    },
    items: [
      { label: { nl: "Zonnebrand en zonnehoedjes", en: "Sunscreen and sun hats" }, url: "https://www.bol.com/nl/nl/s/?searchtext=kinderen+zonnebrand", partner: "bol.com" },
    ],
  },
};
