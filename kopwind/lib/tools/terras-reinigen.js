/**
 * lib/tools/terras-reinigen.js
 *
 * De terrasreinigcheck (v3.30.0 "Mistral"): het terras, de oprit of de
 * gevel schoonmaken, meestal met de hogedrukreiniger. Je wordt toch
 * nat, dus lichte regen is geen ramp, maar hozen is zinloos en vorst is
 * een harde nee (water bevriest, en op glad ijs met een hogedrukspuit
 * werken is gevaarlijk). Wie na het reinigen wil impregneren of groene
 * aanslag wil laten inwerken, wil daarna droog weer; dat weegt de check
 * dan mee. Beste klus voor een milde, droge lentedag.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "terras-reinigen",
    naam: "Kan ik vandaag het terras reinigen?",
    korteVraag: "Kan ik vandaag het terras reinigen?",
    meldingKort: "Reinigcheck",
    cta: "Check het klusweer",
    navLabel: "Terras reinigen",
    diepte: "Terras, oprit of gevel schoonmaken: mild en niet vriezend is ideaal.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect reinigweer", goed: "Prima reinigweer", twijfelachtig: "Kan, je wordt nat", matig: "Onaangenaam reinigweer", "zeer-slecht": "Geen reinigweer" },
    adviesLabels: { goed: "reinigweer", matig: "kan, je wordt nat", slecht: "geen reinigweer" },
    legenda: { links: "spuit blijft in de schuur", rechts: "reinigweer" },
    redenNat: "hozende regen: schoonspuiten heeft dan weinig zin",
    redenGeenBlok: "geen werkbaar blok (vorst of hoosbuien)",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenVorst: "vorst: het spoelwater bevriest en de tegels worden glad",
    redenKoud: (g) => `koud en nat werk (gevoel ${g} graden): niet verboden, wel afzien`,
    redenNaRegen: "je wilde na afloop impregneren: daarvoor is het te nat, de tegels drogen niet op",
    redenWind: (w) => `stevige wind (${w} km/u): de nevel van de hogedrukspuit waait alle kanten op`,
    metric: (uur, g) => `Beste reinigmoment rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima reinigweer: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste reiniguren: ${tijd}.`,
    statusGeweest: "Het beste reinigweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het geen dag om buiten te reinigen.",
    toekomstBeste: (tijd) => `Beste reinigblok: ${tijd}.`,
    toekomstGeen: "Geen reinigweer.",
    instWatVraag: "Wat ga je reinigen?",
    instWatKeuzes: ["Terras of tegels", "Oprit of stoep", "Gevel of muur"],
    instNaVraag: "Wil je daarna impregneren of coaten?",
    instNaKeuzes: ["Nee, alleen schoonmaken", "Ja, het moet daarna droog blijven"],
    instDagStart: "Vroegste starttijd",
    instDagEind: "Laatste starttijd",
    instUur: "uur",
    instUitleg:
      "Met de hogedrukreiniger word je toch nat, dus lichte regen telt licht mee; hozen is zinloos en vorst is een harde nee (bevriezend spoelwater, gladde tegels). De check zoekt een mild, droog blok. Wil je na het reinigen impregneren of een coating aanbrengen, zet dat dan aan: dan moet het daarna droog blijven zodat de tegels opdrogen. Harde wind maakt de nevel van de spuit vervelend.",
  },
  en: {
    slug: "patio-cleaning",
    naam: "Can I clean the patio today?",
    korteVraag: "Can I clean the patio today?",
    meldingKort: "Cleaning check",
    cta: "Check the job weather",
    navLabel: "Patio cleaning",
    diepte: "Cleaning patio, driveway or facade: mild and not freezing is ideal.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect cleaning weather", goed: "Good cleaning weather", twijfelachtig: "Doable, you'll get wet", matig: "Unpleasant cleaning weather", "zeer-slecht": "No cleaning weather" },
    adviesLabels: { goed: "cleaning weather", matig: "doable, you'll get wet", slecht: "no cleaning weather" },
    legenda: { links: "washer stays in the shed", rechts: "cleaning weather" },
    redenNat: "pouring rain: pressure-washing makes little sense",
    redenGeenBlok: "no workable window (frost or downpours)",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenVorst: "frost: the rinse water freezes and the tiles turn slippery",
    redenKoud: (g) => `cold and wet work (feels like ${g} degrees): not forbidden, but miserable`,
    redenNaRegen: "you wanted to seal afterwards: too wet for that, the tiles won't dry",
    redenWind: (w) => `strong wind (${w} km/h): the spray mist blows everywhere`,
    metric: (uur, g) => `Best cleaning moment around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good cleaning weather now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best cleaning hours: ${tijd}.`,
    statusGeweest: "The best cleaning weather has been and gone today.",
    statusNiks: "Today isn't a day to clean outside.",
    toekomstBeste: (tijd) => `Best cleaning window: ${tijd}.`,
    toekomstGeen: "No cleaning weather.",
    instWatVraag: "What are you cleaning?",
    instWatKeuzes: ["Patio or tiles", "Driveway or pavement", "Facade or wall"],
    instNaVraag: "Sealing or coating afterwards?",
    instNaKeuzes: ["No, just cleaning", "Yes, it must stay dry after"],
    instDagStart: "Earliest start",
    instDagEind: "Latest start",
    instUur: "h",
    instUitleg:
      "With a pressure washer you get wet anyway, so light rain counts lightly; downpours are pointless and frost is a hard no (freezing rinse water, slippery tiles). The check finds a mild, dry window. If you want to seal or coat after cleaning, switch that on: it then needs to stay dry so the tiles dry out. Strong wind makes the spray mist a nuisance.",
  },
});

export const REINIG_DEFAULTS = {
  wat: 0, // 0 terras, 1 oprit, 2 gevel
  na: 0, // 0 alleen schoonmaken, 1 impregneren erna
  dagStart: 9,
  dagEind: 18,
};

export function uurReinigScore(u, inst = REINIG_DEFAULTS) {
  const gevoel = u.gevoel ?? u.temp ?? 10;
  // Vorst is een harde nee.
  if ((u.temp ?? 5) <= 0.5) return 0;
  // Wil je impregneren, dan moet het droog zijn; anders mag je nat worden.
  const n = u.neerslag ?? 0;
  let natF;
  if (inst.na === 1) {
    natF = n > 0.1 || (u.kans ?? 0) >= 60 ? 0.1 : 1;
  } else {
    natF = n > 2 ? 0.35 : n > 0.5 ? 0.7 : 1;
  }
  let tempF;
  if (gevoel <= 8) {
    tempF = clamp(lerp(gevoel, 0, 10, 0.35, 1), 0.35, 1);
  } else {
    tempF = clamp(lerp(gevoel, 26, 34, 1, 0.6), 0.6, 1);
  }
  const windF = clamp(1 - Math.max(0, (u.wind ?? 0) - 30) / 45, 0.55, 1);
  return clamp(Math.round(95 * natF * tempF * windF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: REINIG_DEFAULTS,
  uurScore: uurReinigScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 1,
  extraFactoren: ({ uren, venster, inst }) => {
    const uit = [];
    const minTemp = Math.min(...uren.map((u) => u.temp ?? 99));
    if (minTemp <= 0.5) {
      uit.push({ punten: 40, reden: T.redenVorst });
    }
    if (!venster) return uit;
    const gemGevoel = Math.round(venster.blok.reduce((a, u) => a + (u.gevoel ?? u.temp ?? 10), 0) / venster.uren);
    if (gemGevoel < 8 && minTemp > 0.5) {
      uit.push({ punten: 8, reden: T.redenKoud(gemGevoel) });
    }
    if (inst.na === 1) {
      const naUren = uren.filter((u) => u.uur > venster.tot && u.uur <= venster.tot + 5);
      if (naUren.some((u) => (u.neerslag ?? 0) > 0.2 || (u.kans ?? 0) >= 60)) {
        uit.push({ punten: 28, reden: T.redenNaRegen });
      }
    }
    const gemWind = Math.round(venster.blok.reduce((a, u) => a + (u.wind ?? 0), 0) / venster.uren);
    if (gemWind >= 35) {
      uit.push({ punten: 8, reden: T.redenWind(gemWind) });
    }
    return uit;
  },
});

export const terrasReinigen = {
  id: "terras-reinigen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#8C6239",
  locatieHint: T.locatieHint,
  icoon: "hogedrukspuit",
  categorieId: "huis-tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: REINIG_DEFAULTS },
  instellingen: {
    defaults: REINIG_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "wat",
        vraag: T.instWatVraag,
        keuzes: [
          { label: T.instWatKeuzes[0], zet: { wat: 0 } },
          { label: T.instWatKeuzes[1], zet: { wat: 1 } },
          { label: T.instWatKeuzes[2], zet: { wat: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "na",
        vraag: T.instNaVraag,
        keuzes: [
          { label: T.instNaKeuzes[0], zet: { na: 0 } },
          { label: T.instNaKeuzes[1], zet: { na: 1 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 7, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 14, max: 20 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: {
    kop: { nl: "Het terras schoon", en: "A clean patio" },
    advies: {
      nl: "Groene aanslag gaat er het makkelijkst af op een milde, droge dag: een terrasreiniger voor de aanslag en, voor het grovere werk, een hogedrukreiniger (houd afstand van voegen en zachte steen). Wil je de tegels daarna beschermen, dan is impregneermiddel op een droge dag de moeite waard.",
      en: "Green growth comes off easiest on a mild, dry day: a patio cleaner for the film and, for the heavier work, a pressure washer (keep your distance from joints and soft stone). To protect the tiles afterwards, an impregnator on a dry day is worthwhile.",
    },
    items: [
      { label: { nl: "Terrasreiniger", en: "Patio cleaner" }, url: "https://www.bol.com/nl/nl/s/?searchtext=terrasreiniger", partner: "bol.com" },
    ],
  },
};
