/**
 * lib/tools/motorrijden.js
 *
 * De motorcheck (v3.29.0 "Ghibli"). Motorrijden is fietsen op snelheid:
 * dezelfde vijanden (nat, zijwind, kou) maar met andere drempels. Nat
 * wegdek betekent langere remweg en gladde belijning, windstoten duwen
 * je op de snelweg een halve rijstrook opzij, en de windchill op 100
 * km/u maakt van 8 graden gevoelstemperatuur een koude onderneming.
 * Onder de 3 graden komt gladheid om de hoek en gaat het oordeel hard
 * omlaag. Wie een regenpak op zak heeft krijgt mildere natstraffen.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "motorrijden",
    naam: "Kan ik vandaag motorrijden?",
    korteVraag: "Kan ik vandaag motorrijden?",
    meldingKort: "Motorcheck",
    cta: "Check de rit",
    navLabel: "Motorrijden",
    diepte: "Nat wegdek, windstoten en kou op snelheid: het beste blok voor een rit.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect motorweer", goed: "Prima motorweer", twijfelachtig: "Kan, met beleid", matig: "Onaangename rit", "zeer-slecht": "Geen motorweer" },
    adviesLabels: { goed: "motorweer", matig: "kan, met beleid", slecht: "geen motorweer" },
    legenda: { links: "motor laten staan", rechts: "motorweer" },
    redenNat: "nat wegdek: langere remweg en gladde belijning",
    redenGeenBlok: "geen bruikbaar rijblok (regen of wind zit dwars)",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenStoten: (s) => `windstoten tot ${s} km/u: op open stukken word je verzet`,
    redenGlad: "kans op gladheid: temperatuur rond of onder nul met vocht",
    redenKou: (g) => `koud op snelheid (gevoel ${g} graden, en de rijwind komt daar nog bovenop)`,
    metric: (uur, g) => `Beste vertrektijd rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima motorweer: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste rijuren: ${tijd}.`,
    statusGeweest: "Het beste motorweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het geen dag voor de motor.",
    toekomstBeste: (tijd) => `Beste rijblok: ${tijd}.`,
    toekomstGeen: "Geen motorweer.",
    instRegenVraag: "Regenpak standaard mee?",
    instRegenKeuzes: ["Nee, ik rij droog of niet", "Ja, regen rijd ik uit"],
    instKouVraag: "Wanneer wordt het je te koud?",
    instKouKeuzes: ["Onder de 10 sla ik over", "Gemiddeld", "Winterhandschoenen, dus rijden maar"],
    instDagStart: "Vroegste vertrektijd",
    instDagEind: "Laatste terugkomst",
    instUur: "uur",
    instUitleg:
      "De check zoekt het beste rijblok. Nat wegdek weegt zwaar (remweg, belijning), windstoten vanaf zo'n 50 km/u ook, en kou telt op snelheid dubbel: de rijwind haalt nog eens flink wat graden van het gevoel af. Onder de 3 graden met vocht rekent de check op gladheid en gaat het oordeel hard omlaag.",
  },
  en: {
    slug: "motorcycling",
    naam: "Can I ride the motorcycle today?",
    korteVraag: "Can I ride today?",
    meldingKort: "Motorcycle check",
    cta: "Check the ride",
    navLabel: "Motorcycling",
    diepte: "Wet tarmac, gusts and cold at speed: the best window for a ride.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect riding weather", goed: "Good riding weather", twijfelachtig: "Doable with care", matig: "An unpleasant ride", "zeer-slecht": "No riding weather" },
    adviesLabels: { goed: "riding weather", matig: "doable with care", slecht: "no riding weather" },
    legenda: { links: "leave the bike", rechts: "riding weather" },
    redenNat: "wet tarmac: longer braking and slippery markings",
    redenGeenBlok: "no usable riding window (rain or wind in the way)",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenStoten: (s) => `gusts up to ${s} km/h: open stretches will shove you around`,
    redenGlad: "risk of ice: temperature around or below zero with moisture",
    redenKou: (g) => `cold at speed (feels like ${g} degrees, and wind chill on top)`,
    metric: (uur, g) => `Best departure around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good riding weather right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best riding hours: ${tijd}.`,
    statusGeweest: "The best riding weather has been and gone today.",
    statusNiks: "Today isn't a day for the bike.",
    toekomstBeste: (tijd) => `Best riding window: ${tijd}.`,
    toekomstGeen: "No riding weather.",
    instRegenVraag: "Rain suit always packed?",
    instRegenKeuzes: ["No, I ride dry or not at all", "Yes, I ride out the rain"],
    instKouVraag: "When does it get too cold?",
    instKouKeuzes: ["Below 10 I skip", "Average", "Winter gloves, so ride on"],
    instDagStart: "Earliest departure",
    instDagEind: "Latest return",
    instUur: "h",
    instUitleg:
      "The check finds the best riding window. Wet tarmac weighs heavy (braking, markings), gusts from about 50 km/h too, and cold counts double at speed: wind chill takes several more degrees off. Below 3 degrees with moisture the check assumes ice risk and the verdict drops hard.",
  },
});

export const MOTOR_DEFAULTS = {
  regenpak: 0,
  minGevoel: 6,
  dagStart: 8,
  dagEind: 21,
};

export function uurMotorScore(u, inst = MOTOR_DEFAULTS) {
  const nat = (u.neerslag ?? 0) > 0.15 || (u.kans ?? 0) >= 70;
  if (nat && inst.regenpak !== 1) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 10;
  if (gevoel <= 2) return 5;
  let tempF;
  if (gevoel <= 18) {
    tempF = clamp(lerp(gevoel, inst.minGevoel - 4, inst.minGevoel + 8, 0.3, 1), 0.3, 1);
  } else {
    tempF = clamp(lerp(gevoel, 26, 36, 1, 0.55), 0.55, 1);
  }
  const stoten = u.stoten ?? (u.wind ?? 0) * 1.4;
  const stotenF = clamp(1 - Math.max(0, stoten - 40) / 55, 0.1, 1);
  const natF = nat ? 0.45 : (u.neerslag ?? 0) > 0.03 ? 0.75 : 1;
  return clamp(Math.round(95 * tempF * stotenF * natF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: MOTOR_DEFAULTS,
  uurScore: uurMotorScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 2,
  extraFactoren: ({ uren, venster }) => {
    const uit = [];
    const minTemp = Math.min(...uren.map((u) => u.temp ?? 99));
    const vochtig = uren.some((u) => (u.neerslag ?? 0) > 0.05 || (u.rh ?? 0) >= 92);
    if (minTemp <= 3 && vochtig) {
      uit.push({ punten: 40, reden: T.redenGlad });
    }
    const piekStoten = Math.max(...uren.map((u) => u.stoten ?? 0));
    if (piekStoten >= 60) {
      uit.push({ punten: 20, reden: T.redenStoten(Math.round(piekStoten)) });
    }
    if (venster) {
      const gemGevoel = venster.blok.reduce((a, u) => a + (u.gevoel ?? u.temp ?? 10), 0) / venster.uren;
      if (gemGevoel < 8 && minTemp > 3) {
        uit.push({ punten: 10, reden: T.redenKou(Math.round(gemGevoel)) });
      }
    }
    return uit;
  },
});

export const motorrijden = {
  id: "motorrijden",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#2F7D62",
  locatieHint: T.locatieHint,
  icoon: "motorfiets",
  categorieId: "sport",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: MOTOR_DEFAULTS },
  instellingen: {
    defaults: MOTOR_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "regenpak",
        vraag: T.instRegenVraag,
        keuzes: [
          { label: T.instRegenKeuzes[0], zet: { regenpak: 0 } },
          { label: T.instRegenKeuzes[1], zet: { regenpak: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "kou",
        vraag: T.instKouVraag,
        keuzes: [
          { label: T.instKouKeuzes[0], zet: { minGevoel: 10 } },
          { label: T.instKouKeuzes[1], zet: { minGevoel: 6 } },
          { label: T.instKouKeuzes[2], zet: { minGevoel: 1 } },
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
