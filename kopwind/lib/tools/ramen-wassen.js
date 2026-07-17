/**
 * lib/tools/ramen-wassen.js
 *
 * De ramencheck op de gedeelde venstermotor (v3.17.0 "Passaat"). Het
 * zusje van de autowascheck: droog werk, geen vorst, en vooral geen
 * felle zon op het glas, want dan droogt het sop op voordat je zeemt
 * en kijk je de rest van de week tegen strepen aan. Bewolkt en droog
 * is de perfecte zeemdag.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "ramen-wassen",
    naam: "Kan ik mijn ramen wassen vandaag?",
    korteVraag: "Kan ik mijn ramen wassen vandaag?",
    meldingKort: "Ramencheck",
    cta: "Check de zeemdag",
    navLabel: "Ramen wassen",
    diepte: "Droog, geen vorst en geen felle zon op het glas.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfecte zeemdag", goed: "Prima zeemdag", twijfelachtig: "Kan, snel nazemen", matig: "Strepenrisico", "zeer-slecht": "Geen zeemdag" },
    adviesLabels: { goed: "een goede zeemdag", matig: "kan, met snel nazemen", slecht: "geen zeemdag" },
    legenda: { links: "andere dag", rechts: "zeemdag" },
    redenNat: "te nat: regen maakt het zeemwerk zinloos",
    redenVorst: "vorst: sop en spoelwater bevriezen op het glas",
    redenGeenBlok: "geen droog blok om te zemen",
    redenMatigBlok: (g) => `het beste blok is maar matig (rond ${g} graden)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenZon: "felle zon op het glas: sop droogt te snel (strepen)",
    redenWind: (w) => `stevige wind (${w} km/u): stof waait op het natte glas`,
    metric: (uur) => `Beste zeemmoment rond ${uur}:00 (droog en zonder felle zon).`,
    statusNu: (tijd) => `Nu een prima zeemmoment: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste zeemblok: ${tijd}.`,
    statusGeweest: "Het beste zeemblok is voor vandaag geweest.",
    statusNiks: "Vandaag laat je de zeem hangen.",
    toekomstBeste: (tijd) => `Beste zeemblok: ${tijd}.`,
    toekomstGeen: "Geen zeemdag.",
    instZonVraag: "Hoe liggen je ramen?",
    instZonKeuzes: ["Vooral schaduwkant", "Volle zon op de ramen"],
    instDagStart: "Vroegste zeemtijd",
    instDagEind: "Laatste zeemtijd",
    instUur: "uur",
    instUitleg:
      "Zemen wil een droog blok zonder vorst en zonder felle zon op het glas: zonlicht droogt het sop op voordat je zeemt en dat geeft strepen. Bewolkt en droog is ideaal; motregen kan nog net. Liggen je ramen vooral op de schaduwkant? Zet dat in de instellingen.",
  },
  en: {
    slug: "clean-the-windows",
    naam: "Clean the windows today?",
    korteVraag: "Clean the windows today?",
    meldingKort: "Window check",
    cta: "Check the squeegee day",
    navLabel: "Windows",
    diepte: "Dry, no frost and no harsh sun on the glass.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect squeegee day", goed: "Good squeegee day", twijfelachtig: "Doable, squeegee fast", matig: "Streak risk", "zeer-slecht": "Not a squeegee day" },
    adviesLabels: { goed: "a good squeegee day", matig: "doable, squeegee quickly", slecht: "not a squeegee day" },
    legenda: { links: "another day", rechts: "squeegee day" },
    redenNat: "too wet: rain makes the work pointless",
    redenVorst: "frost: suds and rinse water freeze on the glass",
    redenGeenBlok: "no dry window for the job",
    redenMatigBlok: (g) => `the best window is only so-so (around ${g} degrees)`,
    redenKortBlok: (u) => `only a short window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenZon: "harsh sun on the glass: suds dry too fast (streaks)",
    redenWind: (w) => `strong wind (${w} km/h): dust blows onto the wet glass`,
    metric: (uur) => `Best squeegee moment around ${uur}:00 (dry, no harsh sun).`,
    statusNu: (tijd) => `Good squeegee moment right now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best squeegee window: ${tijd}.`,
    statusGeweest: "The best squeegee window has been and gone today.",
    statusNiks: "Leave the squeegee today.",
    toekomstBeste: (tijd) => `Best squeegee window: ${tijd}.`,
    toekomstGeen: "Not a squeegee day.",
    instZonVraag: "How do your windows face?",
    instZonKeuzes: ["Mostly the shaded side", "Full sun on the windows"],
    instDagStart: "Earliest squeegee time",
    instDagEind: "Latest squeegee time",
    instUur: "h",
    instUitleg:
      "Window cleaning wants a dry window without frost and without harsh sun on the glass: sunlight dries the suds before you squeegee, and that means streaks. Overcast and dry is ideal; drizzle just about works. Windows mostly on the shaded side? Set that in the settings.",
  },
});

export const RAMEN_DEFAULTS = {
  maxWind: 28,
  schaduw: false,
  dagStart: 8,
  dagEind: 20,
};

export function uurRamenScore(u, inst = RAMEN_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.1 || (u.kans ?? 0) >= 55) return 0;
  const temp = u.temp ?? u.gevoel ?? 10;
  if (temp <= 0.5) return 0;
  const tempF = clamp(lerp(temp, 2, 9, 0.4, 1), 0.4, 1);
  const wind = u.wind ?? 0;
  const windF = clamp(1 - Math.max(0, wind - inst.maxWind * 0.6) / (inst.maxWind * 1.5), 0.4, 1);
  const felleZon = !inst.schaduw && u.dag && u.bewolking != null && u.bewolking < 30;
  const zonF = felleZon ? 0.7 : 1;
  const motregenF = (u.neerslag ?? 0) > 0.05 ? 0.9 : 1;
  return clamp(Math.round(94 * tempF * windF * zonF * motregenF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: RAMEN_DEFAULTS,
  uurScore: uurRamenScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 1,
  geenBlokReden: ({ uren, natVeel }) => {
    const minTemp = Math.min(...uren.map((u) => u.temp ?? u.gevoel ?? 99));
    if (minTemp <= 0.5) return T.redenVorst;
    return natVeel ? T.redenNat : T.redenGeenBlok;
  },
  extraFactoren: ({ venster, inst }) => {
    if (!venster || inst.schaduw) return [];
    const felleZonUren = venster.blok.filter(
      (u) => u.dag && u.bewolking != null && u.bewolking < 30
    ).length;
    if (felleZonUren > venster.uren / 2) {
      return [{ punten: 10, reden: T.redenZon }];
    }
    return [];
  },
});

export const ramenWassen = {
  id: "ramen-wassen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#8C6239",
  locatieHint: T.locatieHint,
  icoon: "raam",
  categorieId: "huis-tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: RAMEN_DEFAULTS },
  instellingen: {
    defaults: RAMEN_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "zon",
        vraag: T.instZonVraag,
        keuzes: [
          { label: T.instZonKeuzes[0], zet: { schaduw: true } },
          { label: T.instZonKeuzes[1], zet: { schaduw: false } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 7, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 16, max: 22 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-16",
  affiliate: null,
};
