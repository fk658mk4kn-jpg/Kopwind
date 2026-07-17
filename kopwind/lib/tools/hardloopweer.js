/**
 * lib/tools/hardloopweer.js
 *
 * De hardloopcheck als overlay op de gedeelde weerbasis (v3.15.0
 * "Marin"). Hardlopen kent een ander optimum dan terrassen: koel is
 * beter dan warm (ideaal ruwweg 8 tot 15 graden gevoel), lichte
 * motregen loopt prima weg, maar hitte en harde wind maken dezelfde
 * ronde zwaar. De check zoekt per dag het beste loopblok binnen jouw
 * looptijden.
 *
 * Per uur een loopscore 0..100: gevoelstemperatuur met een top rond
 * 8-15 (aflopend naar beide kanten, hard aflopend boven jouw
 * warmtegrens), windaftrek richting jouw windgrens, en een kleine
 * aftrek voor motregen. Echte regen of een hoge buienkans maakt het
 * uur ongeschikt.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay, topPijn } from "../engine/vensterTool.js";

import { kies } from "../i18n/locale.js";

/** Alle teksten van de hardloopcheck, per taal. */
const T = kies({
  nl: {
    slug: "hardloopweer",
    naam: "Is het hardloopweer vandaag?",
    korteVraag: "Is het hardloopweer vandaag?",
    meldingKort: "Hardloopcheck",
    cta: "Check het loopweer",
    navLabel: "Hardlopen",
    diepte: "Het beste loopblok op basis van gevoel, wind en regen.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect hardloopweer", goed: "Prima hardloopweer", twijfelachtig: "Kan, hou het rustig", matig: "Zwaar loopweer", "zeer-slecht": "Geen hardloopweer" },
    adviesLabels: { goed: "hardloopweer", matig: "kan, in een rustig tempo", slecht: "geen hardloopweer" },
    legenda: { links: "binnen trainen", rechts: "hardloopweer" },
    redenNat: "te nat om te lopen",
    redenHitte: (g) => `te warm voor een normale training (gevoel tot ${g} graden)`,
    redenGeenBlok: "geen bruikbaar loopblok (regen, hitte of wind zit dwars)",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur)`,
    redenWarm: (g) => `warm: gevoel loopt op tot ${g} graden, pas je tempo aan`,
    redenWind: (w) => `stevige wind (${w} km/u)`,
    redenBuien: "buien rond het beste blok",
    metric: (uur, g) => `Lekkerste loopuur rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima loopweer: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste loopuren: ${tijd}.`,
    statusGeweest: "Het beste loopweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het geen dag om buiten te lopen.",
    toekomstBeste: (tijd) => `Beste loopblok: ${tijd}.`,
    toekomstGeen: "Geen hardloopweer.",
    instWarmVraag: "Wanneer wordt lopen jou te warm?",
    instWarmKeuzes: ["Ik loop graag fris", "Gemiddeld", "Warmte deert me niet"],
    instWindVraag: "Hoeveel wind is ok\u00e9?",
    instWindKeuzes: ["Ik loop beschut", "Gemiddeld", "Wind stoort me snel"],
    instDagStart: "Vroegste looptijd",
    instDagEind: "Laatste looptijd",
    instUur: "uur",
    instUitleg:
      "Ideaal hardloopweer is koeler dan je denkt: 8 tot 15 graden gevoel, droog en weinig wind. Motregen telt licht mee, echte regen maakt een uur ongeschikt, en boven jouw warmtegrens zakt de score hard. De statusregel noemt het beste loopblok.",
  },
  en: {
    slug: "running-weather",
    naam: "Running weather today?",
    korteVraag: "Running weather today?",
    meldingKort: "Running check",
    cta: "Check the running weather",
    navLabel: "Running",
    diepte: "Your best running window from feel, wind and rain.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect running weather", goed: "Good running weather", twijfelachtig: "Doable, keep it easy", matig: "Tough running weather", "zeer-slecht": "No running weather" },
    adviesLabels: { goed: "running weather", matig: "doable at an easy pace", slecht: "no running weather" },
    legenda: { links: "train inside", rechts: "running weather" },
    redenNat: "too wet for a run",
    redenHitte: (g) => `too warm for a normal session (feels like up to ${g} degrees)`,
    redenGeenBlok: "no usable running window (rain, heat or wind gets in the way)",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short window (${u} hours)`,
    redenWarm: (g) => `warm: feels-like climbs to ${g} degrees, ease off the pace`,
    redenWind: (w) => `strong wind (${w} km/h)`,
    redenBuien: "showers around the best window",
    metric: (uur, g) => `Nicest running hour around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good running weather right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best running hours: ${tijd}.`,
    statusGeweest: "The best running weather has been and gone today.",
    statusNiks: "Today isn't a day for an outdoor run.",
    toekomstBeste: (tijd) => `Best running window: ${tijd}.`,
    toekomstGeen: "No running weather.",
    instWarmVraag: "When does running get too warm for you?",
    instWarmKeuzes: ["I like it cool", "Average", "Heat doesn't bother me"],
    instWindVraag: "How much wind is fine?",
    instWindKeuzes: ["My routes are sheltered", "Average", "Wind bothers me quickly"],
    instDagStart: "Earliest running time",
    instDagEind: "Latest running time",
    instUur: "h",
    instUitleg:
      "Ideal running weather is cooler than you think: 8 to 15 degrees feels-like, dry and little wind. Drizzle counts lightly, real rain rules an hour out, and above your heat limit the score drops fast. The status line names the best window.",
  },
});

export const HARDLOOP_DEFAULTS = {
  maxGevoel: 25, // daarboven wordt een normale training zwaar
  maxWind: 28, // km/u; hardlopen verdraagt meer wind dan een terras
  dagStart: 6,
  dagEind: 22,
};

const MIN_VENSTER_UREN = 1;
const BRUIKBAAR_VANAF = 40;

/** Loopscore van een enkel basis-uur, 0..100. */
export function uurLoopScore(u, inst = HARDLOOP_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.2 || (u.kans ?? 0) >= 70) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 10;
  let tempF;
  if (gevoel <= 15) {
    tempF = clamp(lerp(gevoel, -4, 8, 0.2, 1), 0.2, 1);
  } else {
    tempF = clamp(lerp(gevoel, 15, inst.maxGevoel + 6, 1, 0.08), 0.08, 1);
  }
  const wind = u.wind ?? 0;
  const windF = clamp(1 - Math.max(0, wind - inst.maxWind * 0.5) / (inst.maxWind * 1.6), 0.3, 1);
  const motregenF = (u.neerslag ?? 0) > 0.05 ? 0.85 : 1;
  return clamp(Math.round(96 * tempF * windF * motregenF), 0, 100);
}

/**
 * Sinds v3.18.0 draait de hardloopcheck op de gedeelde venstermotor.
 * De eigen identiteit zit in de factorenopbouw: warm weegt zwaar (10
 * punten zodra het richting jouw grens kruipt), wind licht (6) en
 * buien het lichtst (4), want een spatje regen deert een loper
 * weinig. Het venster mag een uur kort zijn.
 */
export const overlay = maakVensterOverlay({
  defaults: HARDLOOP_DEFAULTS,
  uurScore: uurLoopScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 1,
  dagFactoren: ({ uren, venster, inst }) => {
    const maxGevoel = Math.max(...uren.map((u) => u.gevoel ?? -99));
    const natUren = uren.filter((u) => u.nat).length;
    const factoren = [];
    if (!venster) {
      const regent = natUren > uren.length / 3;
      factoren.push({
        punten: 72,
        reden: regent
          ? T.redenNat
          : maxGevoel > inst.maxGevoel + 4
            ? T.redenHitte(Math.round(maxGevoel))
            : T.redenGeenBlok,
      });
    } else {
      const blokGevoel = Math.round(venster.blok.reduce((a, u) => a + (u.gevoel ?? u.temp ?? 0), 0) / venster.uren);
      const blokWind = Math.round(venster.blok.reduce((a, u) => a + (u.wind ?? 0), 0) / venster.uren);
      const kwaliteit = topPijn(venster.gemiddeld);
      factoren.push({ punten: kwaliteit, reden: kwaliteit >= 18 ? T.redenMatigBlok(blokGevoel, blokWind) : null });
      factoren.push({
        punten: Math.round(lerp(venster.uren, 6, 1, 0, 18)),
        reden: venster.uren <= 2 ? T.redenKortBlok(venster.uren) : null,
      });
      if (maxGevoel > inst.maxGevoel - 3) {
        factoren.push({ punten: 10, reden: T.redenWarm(Math.round(maxGevoel)) });
      }
      const gemWind = venster.blok.reduce((a, u) => a + (u.wind ?? 0), 0) / venster.uren;
      if (gemWind > inst.maxWind * 0.8) {
        factoren.push({ punten: 6, reden: T.redenWind(Math.round(gemWind)) });
      }
      if (natUren > 0) {
        factoren.push({ punten: 4, reden: T.redenBuien });
      }
    }
    return factoren;
  },
});

export const hardloopweer = {
  id: "hardloopweer",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#2F7D62",
  locatieHint: T.locatieHint,
  icoon: "hardloopschoen",
  categorieId: "sport",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: HARDLOOP_DEFAULTS },
  instellingen: {
    defaults: HARDLOOP_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "warmte",
        vraag: T.instWarmVraag,
        keuzes: [
          { label: T.instWarmKeuzes[0], zet: { maxGevoel: 22 } },
          { label: T.instWarmKeuzes[1], zet: { maxGevoel: 25 } },
          { label: T.instWarmKeuzes[2], zet: { maxGevoel: 28 } },
        ],
      },
      {
        type: "keuze",
        id: "wind",
        vraag: T.instWindVraag,
        keuzes: [
          { label: T.instWindKeuzes[0], zet: { maxWind: 34 } },
          { label: T.instWindKeuzes[1], zet: { maxWind: 28 } },
          { label: T.instWindKeuzes[2], zet: { maxWind: 22 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 5, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 16, max: 23 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-16",
  affiliate: null,
};
