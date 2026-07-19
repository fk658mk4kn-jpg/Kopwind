/**
 * lib/tools/buiten-schilderen.js
 *
 * De buitenschildercheck (v3.30.0 "Mistral"). Buiten schilderen kent
 * een smal weervenster: het moet droog zijn tijdens het schilderen en
 * nog uren daarna (verf moet uitharden voor de volgende bui), de
 * temperatuur binnen de band van de verf (watergedragen wil zo'n 8 tot
 * 25 graden), niet te vochtig (hoge luchtvochtigheid vertraagt drogen)
 * en liefst niet in de volle knallende zon (dan droogt de verf te snel
 * en krijg je aanzetten). De motor zoekt het beste schilderblok en
 * straft regen kort na het blok apart.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "buiten-schilderen",
    naam: "Kan ik vandaag buiten schilderen?",
    korteVraag: "Kan ik vandaag buiten schilderen?",
    meldingKort: "Schildercheck",
    cta: "Check het schilderweer",
    navLabel: "Buiten schilderen",
    diepte: "Het beste schilderblok: droog tijdens en na, juiste temperatuur en niet te vochtig.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect schilderweer", goed: "Prima schilderweer", twijfelachtig: "Kan, houd de lucht in de gaten", matig: "Lastig schilderweer", "zeer-slecht": "Geen schilderweer" },
    adviesLabels: { goed: "schilderweer", matig: "kan, met beleid", slecht: "geen schilderweer" },
    legenda: { links: "kwast in de wei", rechts: "schilderweer" },
    redenNat: "te nat om te schilderen (verf hecht niet op vochtig oppervlak)",
    redenGeenBlok: "geen droog blok met werkbare temperatuur",
    redenMatigBlok: (g, w) => `het beste blok is maar matig (gevoel rond ${g} graden, wind ${w} km/u)`,
    redenKortBlok: (u) => `maar een kort blok (${u} uur): reken op een kleine klus`,
    redenBuien: "buien rond het beste blok",
    redenNaRegen: "er komt regen kort na het blok: de verf krijgt geen tijd om te drogen",
    redenVochtig: (rh) => `hoge luchtvochtigheid (${rh}%): de verf droogt traag en kan uitzakken`,
    redenHeet: (g) => `warm en zonnig (gevoel tot ${g} graden): verf droogt te snel, kans op aanzetten`,
    redenKoud: (g) => `koud voor verf (gevoel ${g} graden): watergedragen verf hardt onder de 8 graden slecht uit`,
    metric: (uur, g) => `Beste schildermoment rond ${uur}:00 (gevoel ${g} graden).`,
    statusNu: (tijd) => `Nu prima schilderweer: het blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Beste schilderuren: ${tijd}.`,
    statusGeweest: "Het beste schilderweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het geen dag om buiten te schilderen.",
    toekomstBeste: (tijd) => `Beste schilderblok: ${tijd}.`,
    toekomstGeen: "Geen schilderweer.",
    instVerfVraag: "Wat voor verf gebruik je?",
    instVerfKeuzes: ["Watergedragen (latex, acryl)", "Terpentinebasis (alkyd)"],
    instKouVraag: "Vanaf welke temperatuur wil je aan de slag?",
    instKouKeuzes: ["Pas vanaf 12 graden", "Vanaf 8 graden", "Ook bij 5 graden (speciale verf)"],
    instDagStart: "Vroegste starttijd",
    instDagEind: "Laatste starttijd",
    instUur: "uur",
    instUitleg:
      "De check zoekt een droog blok met de juiste temperatuur en houdt de uren erna in de gaten: valt er kort na het schilderen regen, dan krijgt de verf geen tijd om te drogen. Watergedragen verf wil zo'n 8 tot 25 graden en een lage luchtvochtigheid; terpentineverf verdraagt iets meer vocht maar droogt trager. Schilder niet in de knallende zon (aanzetten) en niet als er die nacht nog vorst komt.",
  },
  en: {
    slug: "exterior-painting",
    naam: "Can I paint outside today?",
    korteVraag: "Can I paint outside today?",
    meldingKort: "Painting check",
    cta: "Check the painting weather",
    navLabel: "Exterior painting",
    diepte: "The best painting window: dry during and after, right temperature, not too humid.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect painting weather", goed: "Good painting weather", twijfelachtig: "Doable, watch the sky", matig: "Tricky painting weather", "zeer-slecht": "No painting weather" },
    adviesLabels: { goed: "painting weather", matig: "doable with care", slecht: "no painting weather" },
    legenda: { links: "brush stays down", rechts: "painting weather" },
    redenNat: "too wet to paint (paint won't bond to a damp surface)",
    redenGeenBlok: "no dry window with workable temperature",
    redenMatigBlok: (g, w) => `the best window is only so-so (feels like ${g} degrees, wind ${w} km/h)`,
    redenKortBlok: (u) => `only a short window (${u} hours): count on a small job`,
    redenBuien: "showers around the best window",
    redenNaRegen: "rain comes shortly after the window: the paint gets no time to dry",
    redenVochtig: (rh) => `high humidity (${rh}%): paint dries slowly and may sag`,
    redenHeet: (g) => `warm and sunny (feels like up to ${g} degrees): paint dries too fast, lap marks`,
    redenKoud: (g) => `cold for paint (feels like ${g} degrees): water-based paint cures poorly below 8 degrees`,
    metric: (uur, g) => `Best painting moment around ${uur}:00 (feels like ${g} degrees).`,
    statusNu: (tijd) => `Good painting weather now: the window runs until ${tijd}.`,
    statusBeste: (tijd) => `Best painting hours: ${tijd}.`,
    statusGeweest: "The best painting weather has been and gone today.",
    statusNiks: "Today isn't a day for painting outside.",
    toekomstBeste: (tijd) => `Best painting window: ${tijd}.`,
    toekomstGeen: "No painting weather.",
    instVerfVraag: "What kind of paint?",
    instVerfKeuzes: ["Water-based (latex, acrylic)", "Solvent-based (alkyd)"],
    instKouVraag: "From what temperature will you start?",
    instKouKeuzes: ["Only from 12 degrees", "From 8 degrees", "Even at 5 degrees (special paint)"],
    instDagStart: "Earliest start",
    instDagEind: "Latest start",
    instUur: "h",
    instUitleg:
      "The check finds a dry window at the right temperature and watches the hours after: rain soon after painting leaves the paint no time to dry. Water-based paint wants 8 to 25 degrees and low humidity; solvent paint tolerates more damp but dries slower. Don't paint in blazing sun (lap marks) or when frost is due that night.",
  },
});

export const SCHILDER_DEFAULTS = {
  verftype: 0, // 0 watergedragen, 1 terpentine
  minTemp: 8,
  dagStart: 9,
  dagEind: 18,
};

export function uurSchilderScore(u, inst = SCHILDER_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.1 || (u.kans ?? 0) >= 60) return 0;
  const gevoel = u.gevoel ?? u.temp ?? 12;
  let tempF;
  if (gevoel <= inst.minTemp) {
    tempF = clamp(lerp(gevoel, inst.minTemp - 5, inst.minTemp + 4, 0.1, 1), 0.1, 1);
  } else {
    const bovengrens = inst.verftype === 1 ? 30 : 26;
    tempF = clamp(lerp(gevoel, bovengrens - 6, bovengrens + 4, 1, 0.4), 0.4, 1);
  }
  // Vocht: watergedragen verf is gevoeliger dan alkyd.
  const rh = u.rh ?? 70;
  const rhGrens = inst.verftype === 1 ? 90 : 82;
  const vochtF = rh <= rhGrens ? 1 : clamp(lerp(rh, rhGrens, 98, 1, 0.4), 0.4, 1);
  // Volle zon plus warmte: verf droogt te snel (aanzetten).
  const zonHeet = gevoel >= 24 && u.dag && (u.bewolking ?? 50) < 35;
  const zonF = zonHeet ? 0.8 : 1;
  const windF = clamp(1 - Math.max(0, (u.wind ?? 0) - 30) / 45, 0.6, 1);
  return clamp(Math.round(96 * tempF * vochtF * zonF * windF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: SCHILDER_DEFAULTS,
  uurScore: uurSchilderScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 2,
  extraFactoren: ({ uren, venster, inst }) => {
    if (!venster) return [];
    const uit = [];
    // Regen kort na het blok: verf krijgt geen droogtijd (kijk in de
    // resterende uren van de dag na het einde van het blok).
    const naUren = uren.filter((u) => u.uur > venster.tot && u.uur <= venster.tot + 5);
    if (naUren.some((u) => (u.neerslag ?? 0) > 0.2 || (u.kans ?? 0) >= 65)) {
      uit.push({ punten: 30, reden: T.redenNaRegen });
    }
    const gemRh = Math.round(venster.blok.reduce((a, u) => a + (u.rh ?? 70), 0) / venster.uren);
    const rhGrens = inst.verftype === 1 ? 90 : 82;
    if (gemRh > rhGrens + 4) {
      uit.push({ punten: 12, reden: T.redenVochtig(gemRh) });
    }
    const maxGevoel = Math.round(Math.max(...venster.blok.map((u) => u.gevoel ?? u.temp ?? 0)));
    const zonnig = venster.blok.some((u) => u.dag && (u.bewolking ?? 50) < 35);
    if (maxGevoel >= 26 && zonnig) {
      uit.push({ punten: 10, reden: T.redenHeet(maxGevoel) });
    }
    const minGevoel = Math.round(Math.min(...venster.blok.map((u) => u.gevoel ?? u.temp ?? 99)));
    if (minGevoel < inst.minTemp) {
      uit.push({ punten: 14, reden: T.redenKoud(minGevoel) });
    }
    return uit;
  },
});

export const buitenSchilderen = {
  id: "buiten-schilderen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#8C6239",
  locatieHint: T.locatieHint,
  icoon: "verfroller",
  categorieId: "huis-tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: SCHILDER_DEFAULTS },
  instellingen: {
    defaults: SCHILDER_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "verftype",
        vraag: T.instVerfVraag,
        keuzes: [
          { label: T.instVerfKeuzes[0], zet: { verftype: 0 } },
          { label: T.instVerfKeuzes[1], zet: { verftype: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "kou",
        vraag: T.instKouVraag,
        keuzes: [
          { label: T.instKouKeuzes[0], zet: { minTemp: 12 } },
          { label: T.instKouKeuzes[1], zet: { minTemp: 8 } },
          { label: T.instKouKeuzes[2], zet: { minTemp: 5 } },
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
