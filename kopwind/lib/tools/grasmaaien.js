/**
 * lib/tools/grasmaaien.js
 *
 * De maaicheck op de gedeelde venstermotor (v3.17.0 "Passaat"). De
 * maaivraag is een droogtevraag: nat gras plakt, verstopt de maaier en
 * beschadigt de zode. Ochtenduren scoren lager (dauw), buien eerder op
 * de dag laten het gras nog uren nat na, en met een elektrische maaier
 * met snoer weegt dat allemaal zwaarder.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "grasmaaien",
    naam: "Kan ik grasmaaien vandaag?",
    korteVraag: "Kan ik grasmaaien vandaag?",
    meldingKort: "Maaicheck",
    cta: "Check het gras",
    navLabel: "Grasmaaien",
    diepte: "Droog gras en het beste maaimoment van de dag.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfecte maaidag", goed: "Goed te maaien", twijfelachtig: "Wacht op de middag", matig: "Gras waarschijnlijk te nat", "zeer-slecht": "Geen maaidag" },
    adviesLabels: { goed: "maaiweer", matig: "kan, later op de dag", slecht: "geen maaiweer" },
    legenda: { links: "maaier laten staan", rechts: "maaiweer" },
    redenNat: "te nat: nat gras plakt en verstopt de maaier",
    redenGeenBlok: "geen droog maaiblok vandaag",
    redenMatigBlok: (g) => `het beste blok is maar matig (rond ${g} graden)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenNatGras: "het gras is waarschijnlijk nog nat van eerdere buien",
    redenKoud: (g) => `koud voor het gazon (rond ${g} graden): gras groeit en herstelt dan nauwelijks`,
    metric: (uur) => `Beste maaimoment rond ${uur}:00 (gras dan het droogst).`,
    statusNu: (tijd) => `Nu een prima maaimoment: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste maaiblok: ${tijd}.`,
    statusGeweest: "Het beste maaimoment is voor vandaag geweest.",
    statusNiks: "Vandaag laat je de maaier staan.",
    toekomstBeste: (tijd) => `Beste maaiblok: ${tijd}.`,
    toekomstGeen: "Geen maaidag.",
    instMaaierVraag: "Waarmee maai je?",
    instMaaierKeuzes: ["Accu, benzine of robot", "Elektrisch met snoer"],
    instDagStart: "Niet maaien voor",
    instDagEind: "Laatste maaitijd",
    instUur: "uur",
    instUitleg:
      "Maaien wil droog gras: na de ochtenddauw en zonder buien in de uren ervoor. De namiddag van een droge dag is meestal goud. Met een elektrische maaier met snoer telt vocht extra zwaar (veiligheid en verstopping); zet dat in de instellingen.",
  },
  en: {
    slug: "mow-the-lawn",
    naam: "Mow the lawn today?",
    korteVraag: "Mow the lawn today?",
    meldingKort: "Mowing check",
    cta: "Check the lawn",
    navLabel: "Mowing",
    diepte: "Dry grass and the best mowing moment of the day.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect mowing day", goed: "Good for mowing", twijfelachtig: "Wait for the afternoon", matig: "Grass probably too wet", "zeer-slecht": "Not a mowing day" },
    adviesLabels: { goed: "mowing weather", matig: "doable later in the day", slecht: "no mowing weather" },
    legenda: { links: "leave the mower", rechts: "mowing weather" },
    redenNat: "too wet: wet grass sticks and clogs the mower",
    redenGeenBlok: "no dry mowing window today",
    redenMatigBlok: (g) => `the best window is only so-so (around ${g} degrees)`,
    redenKortBlok: (u) => `only a short window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenNatGras: "the grass is probably still wet from earlier showers",
    redenKoud: (g) => `cold for the lawn (around ${g} degrees): grass barely grows or recovers`,
    metric: (uur) => `Best mowing moment around ${uur}:00 (grass at its driest).`,
    statusNu: (tijd) => `Good mowing moment right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best mowing window: ${tijd}.`,
    statusGeweest: "The best mowing moment has been and gone today.",
    statusNiks: "Leave the mower today.",
    toekomstBeste: (tijd) => `Best mowing window: ${tijd}.`,
    toekomstGeen: "Not a mowing day.",
    instMaaierVraag: "What do you mow with?",
    instMaaierKeuzes: ["Battery, petrol or robot", "Corded electric"],
    instDagStart: "No mowing before",
    instDagEind: "Latest mowing time",
    instUur: "h",
    instUitleg:
      "Mowing wants dry grass: after the morning dew and without showers in the hours before. The late afternoon of a dry day is usually gold. With a corded electric mower moisture counts double (safety and clogging); set that in the settings.",
  },
});

export const MAAI_DEFAULTS = {
  elektrisch: false,
  dagStart: 9,
  dagEind: 20,
};

export function uurMaaiScore(u, inst = MAAI_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.05 || (u.kans ?? 0) >= (inst.elektrisch ? 45 : 60)) return 0;
  const temp = u.temp ?? u.gevoel ?? 10;
  if (temp <= 3) return 0; // bij (nacht)vorst laat je het gazon met rust
  const tempF = clamp(lerp(temp, 4, 12, 0.4, 1), 0.4, 1);
  const dauwF = u.uur < 10 ? (inst.elektrisch ? 0.65 : 0.8) : u.uur < 12 ? 0.92 : 1;
  return clamp(Math.round(96 * tempF * dauwF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: MAAI_DEFAULTS,
  uurScore: uurMaaiScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 1,
  extraFactoren: ({ uren, venster, inst }) => {
    const uit = [];
    if (venster) {
      const eerderNat = uren
        .filter((u) => u.uur < venster.van)
        .reduce((a, u) => a + (u.neerslag ?? 0), 0);
      if (eerderNat > 0.2) {
        uit.push({ punten: inst.elektrisch ? 12 : 8, reden: T.redenNatGras });
      }
      const blokTemp = Math.round(
        venster.blok.reduce((a, u) => a + (u.temp ?? u.gevoel ?? 0), 0) / venster.uren
      );
      if (blokTemp < 7) uit.push({ punten: 6, reden: T.redenKoud(blokTemp) });
    }
    return uit;
  },
});

export const grasmaaien = {
  id: "grasmaaien",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#5A7D3C",
  locatieHint: T.locatieHint,
  icoon: "gras",
  categorieId: "tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: MAAI_DEFAULTS },
  instellingen: {
    defaults: MAAI_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "maaier",
        vraag: T.instMaaierVraag,
        keuzes: [
          { label: T.instMaaierKeuzes[0], zet: { elektrisch: false } },
          { label: T.instMaaierKeuzes[1], zet: { elektrisch: true } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 8, max: 13 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 16, max: 21 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-16",
  affiliate: null,
};
