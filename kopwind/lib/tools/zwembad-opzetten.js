/**
 * lib/tools/zwembad-opzetten.js
 *
 * De zwembadcheck (v3.31.0 "Sirocco"). Een opzet- of opblaaszwembad in de
 * tuin is pure zomerpret, maar alleen leuk als het warm genoeg is en de
 * zon het water (en de kinderen) opwarmt. De motor zoekt het warmste,
 * zonnigste blok van de dag. Gevoelstemperatuur is de hoofdfactor, de zon
 * warmt het water op, en een koude wind op een natte huid koelt snel af.
 * Regen bederft de pret. Voor (kleine) kinderen ligt de warmtegrens hoger
 * dan voor volwassenen.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "zwembad-opzetten",
    naam: "Kan ik het zwembad opzetten?",
    korteVraag: "Kan ik het zwembad opzetten?",
    meldingKort: "Zwembadcheck",
    cta: "Check het zwembadweer",
    navLabel: "Zwembad opzetten",
    diepte: "Het warmste, zonnigste blok: warm genoeg, zon op het water en geen koude wind.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect zwembadweer", goed: "Prima zwembadweer", twijfelachtig: "Kan, maar fris", matig: "Te koud voor het water", "zeer-slecht": "Geen zwembadweer" },
    adviesLabels: { goed: "zwembadweer", matig: "kan, maar fris", slecht: "geen zwembadweer" },
    legenda: { links: "laat het bad leeg", rechts: "zwembadweer" },
    redenNat: "regen: geen zwembadpret",
    redenGeenBlok: "geen warm, zonnig blok vandaag",
    redenMatigBlok: (g, w) => `het beste blok is aan de frisse kant (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort warm blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenWind: (w) => `koele wind (rond ${w} km/u) op een natte huid`,
    redenBewolkt: "veel bewolking: de zon warmt het water nauwelijks op",
    redenFris: (g) => `fris voor in het water (gevoel ${g} graden)`,
    metric: (uur, g) => `Warmste zwemmoment rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima zwembadweer: het warme blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Warmste zwemuren: ${tijd}.`,
    statusGeweest: "Het warmste zwembadweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het te koud om het zwembad op te zetten.",
    toekomstBeste: (tijd) => `Warmste zwemblok: ${tijd}.`,
    toekomstGeen: "Geen zwembadweer.",
    instWieVraag: "Wie gaat er zwemmen?",
    instWieKeuzes: ["Volwassenen", "Kinderen", "Kleine kinderen (peuters)"],
    instWindVraag: "Hoe gevoelig voor kou zijn jullie?",
    instWindKeuzes: ["Niet zo", "Gemiddeld", "Snel koud"],
    instDagStart: "Vroegste starttijd",
    instDagEind: "Laatste starttijd",
    instUur: "uur",
    instUitleg:
      "De check zoekt het warmste, zonnigste blok van de dag. De gevoelstemperatuur bepaalt of het lekker is in het water; voor kleine kinderen ligt die grens hoger, want zij koelen sneller af. De zon warmt het water op, dus een zonnig blok telt zwaarder dan een bewolkt blok bij dezelfde temperatuur. Een koude wind op een natte huid koelt snel af, en in de regen is er weinig aan. Een opblaasbad warmt trouwens sneller op dan een groot frame-bad.",
  },
  en: {
    slug: "setting-up-the-pool",
    naam: "Can I set up the pool?",
    korteVraag: "Can I set up the pool?",
    meldingKort: "Pool check",
    cta: "Check the pool weather",
    navLabel: "Setting up the pool",
    diepte: "The warmest, sunniest window: warm enough, sun on the water and no cold wind.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect pool weather", goed: "Good pool weather", twijfelachtig: "Doable but chilly", matig: "Too cold for the water", "zeer-slecht": "No pool weather" },
    adviesLabels: { goed: "pool weather", matig: "doable but chilly", slecht: "no pool weather" },
    legenda: { links: "leave the pool empty", rechts: "pool weather" },
    redenNat: "rain: no pool fun",
    redenGeenBlok: "no warm, sunny window today",
    redenMatigBlok: (g, w) => `the best window is on the chilly side (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short warm window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenWind: (w) => `cool wind (around ${w} km/h) on wet skin`,
    redenBewolkt: "lots of cloud: the sun barely warms the water",
    redenFris: (g) => `chilly for the water (feels like ${g} degrees)`,
    metric: (uur, g) => `Warmest swim moment around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good pool weather now: the warm window runs until ${tijd}.`,
    statusBeste: (tijd) => `Warmest swim hours: ${tijd}.`,
    statusGeweest: "The warmest pool weather has been and gone today.",
    statusNiks: "Today is too cold to set up the pool.",
    toekomstBeste: (tijd) => `Warmest swim window: ${tijd}.`,
    toekomstGeen: "No pool weather.",
    instWieVraag: "Who's going to swim?",
    instWieKeuzes: ["Adults", "Children", "Young children (toddlers)"],
    instWindVraag: "How sensitive to cold are you?",
    instWindKeuzes: ["Not very", "Average", "Cold quickly"],
    instDagStart: "Earliest start",
    instDagEind: "Latest start",
    instUur: "h",
    instUitleg:
      "The check finds the warmest, sunniest window of the day. The feels-like temperature decides whether the water is pleasant; for young children that limit is higher, as they cool down faster. The sun warms the water, so a sunny window counts more than a cloudy one at the same temperature. A cold wind on wet skin cools fast, and in the rain there's little fun. An inflatable pool warms up faster than a big frame pool.",
  },
});

export const ZWEMBAD_DEFAULTS = { minGevoel: 22, windmarge: 1, dagStart: 10, dagEind: 18 };

export function uurZwembadScore(u, inst = ZWEMBAD_DEFAULTS) {
  const g = u.gevoel ?? u.temp ?? 15;
  let warmF = clamp(lerp(g, inst.minGevoel - 6, inst.minGevoel + 3, 0.05, 1), 0.05, 1);
  if ((u.neerslag ?? 0) > 0.2 || (u.kans ?? 0) >= 60) warmF *= 0.4;
  const bew = u.bewolking ?? 60;
  const zonF = u.dag && bew < 40 ? 1 : bew < 70 ? 0.9 : 0.82;
  const wind = u.wind ?? 0;
  const windF = clamp(1 - Math.max(0, wind - 16 * (inst.windmarge ?? 1)) / 38, 0.55, 1);
  return clamp(Math.round(96 * warmF * zonF * windF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: ZWEMBAD_DEFAULTS,
  uurScore: uurZwembadScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 2,
  extraFactoren: ({ venster, inst }) => {
    if (!venster) return [];
    const uit = [];
    const gemBew = Math.round(venster.blok.reduce((a, u) => a + (u.bewolking ?? 60), 0) / venster.uren);
    if (gemBew >= 75) uit.push({ punten: 8, reden: T.redenBewolkt });
    const minGevoel = Math.round(Math.min(...venster.blok.map((u) => u.gevoel ?? u.temp ?? 99)));
    if (minGevoel < inst.minGevoel - 1) uit.push({ punten: 10, reden: T.redenFris(minGevoel) });
    return uit;
  },
});

export const zwembadOpzetten = {
  id: "zwembad-opzetten",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#C24E3F",
  locatieHint: T.locatieHint,
  icoon: "zwembad",
  categorieId: "buiten",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: ZWEMBAD_DEFAULTS },
  instellingen: {
    defaults: ZWEMBAD_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "wie",
        vraag: T.instWieVraag,
        keuzes: [
          { label: T.instWieKeuzes[0], zet: { minGevoel: 20 } },
          { label: T.instWieKeuzes[1], zet: { minGevoel: 22 } },
          { label: T.instWieKeuzes[2], zet: { minGevoel: 24 } },
        ],
      },
      {
        type: "keuze",
        id: "windgevoelig",
        vraag: T.instWindVraag,
        keuzes: [
          { label: T.instWindKeuzes[0], zet: { windmarge: 1.2 } },
          { label: T.instWindKeuzes[1], zet: { windmarge: 1 } },
          { label: T.instWindKeuzes[2], zet: { windmarge: 0.8 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 8, max: 13 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 15, max: 20 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-19",
  affiliate: {
    kop: { nl: "Klaar voor het zwembad", en: "Ready for the pool" },
    advies: {
      nl: "Een opblaas- of opzetzwembad warmt sneller op met een afdekzeil dat de warmte vasthoudt; een klein filterpompje houdt het water schoon. Een opblaasbad is 's ochtends zo opgezet en warmt sneller op dan een groot frame-bad.",
      en: "An inflatable or frame pool warms up faster with a cover that keeps the heat in; a small filter pump keeps the water clean. An inflatable pool is set up in a morning and warms faster than a big frame pool.",
    },
    items: [
      { label: { nl: "Zwembaden en afdekzeilen", en: "Pools and covers" }, url: "https://www.bol.com/nl/nl/s/?searchtext=zwembad", partner: "bol.com" },
    ],
  },
};
