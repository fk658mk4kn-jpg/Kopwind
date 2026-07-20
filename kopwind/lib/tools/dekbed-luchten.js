/**
 * lib/tools/dekbed-luchten.js
 *
 * De dekbedcheck (v3.33.0 "Autan"). Dekbed, kussens of beddengoed buiten
 * luchten wil droge, liefst zonnige lucht met een lage luchtvochtigheid:
 * dan trekt vocht eruit, verdwijnt de muffe lucht en helpt de zon tegen
 * huisstofmijt. Regen is de spelbreker, en op een klamme, mistige dag
 * wordt het buiten alleen maar vochtiger. De motor zoekt het droogste,
 * zonnigste blok van de dag.
 */

import { clamp, lerp } from "../engine/score.js";
import { BASIS_VELDEN } from "../engine/weerbasis.js";
import { maakVensterOverlay } from "../engine/vensterTool.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "dekbed-luchten",
    naam: "Kan ik mijn dekbed buiten luchten?",
    korteVraag: "Kan ik mijn dekbed buiten luchten?",
    meldingKort: "Dekbedcheck",
    cta: "Check het luchtweer",
    navLabel: "Dekbed luchten",
    diepte: "Het droogste, zonnigste blok: droge lucht trekt vocht eruit, de zon helpt tegen huisstofmijt.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Perfect luchtweer", goed: "Prima om te luchten", twijfelachtig: "Kan, maar het is klam", matig: "Te vochtig", "zeer-slecht": "Laat binnen" },
    adviesLabels: { goed: "luchtweer", matig: "kan, maar klam", slecht: "laat binnen" },
    legenda: { links: "laat binnen", rechts: "luchtweer" },
    redenNat: "regen: nat beddengoed is het tegenovergestelde van luchten",
    redenGeenBlok: "geen droog blok met droge lucht vandaag",
    redenMatigBlok: (g, w) => "het beste blok is klam: er trekt weinig vocht uit",
    redenKortBlok: (u) => `maar een kort droog blok (${u} uur)`,
    redenBuien: "buien rond het beste blok",
    redenVochtig: (rh) => `hoge luchtvochtigheid (rond ${rh}%): buiten wordt het niet droger`,
    redenGeenZon: "weinig zon: dan blijft het effect tegen huisstofmijt beperkt",
    redenWind: (w) => `harde wind (rond ${w} km/u): zet spullen goed vast`,
    metric: (uur) => `Droogste, zonnigste moment: rond ${uur}:00.`,
    statusNu: (tijd) => `Nu prima om te luchten: het droge blok loopt tot ${tijd}.`,
    statusBeste: (tijd) => `Droogste, zonnigste uren: ${tijd}.`,
    statusGeweest: "Het beste luchtweer is voor vandaag geweest.",
    statusNiks: "Vandaag is het te vochtig om beddengoed buiten te luchten.",
    toekomstBeste: (tijd) => `Droogste blok: ${tijd}.`,
    toekomstGeen: "Geen luchtweer.",
    instWatVraag: "Wat lucht je?",
    instWatKeuzes: ["Dekbed of kussens", "Beddengoed en lakens", "Matras of topper"],
    instDrogeVraag: "Hoe fris moet het worden?",
    instDrogeKeuzes: ["Even opfrissen", "Normaal", "Echt vochtvrij"],
    instDagStart: "Vroegste tijd",
    instDagEind: "Laatste tijd",
    instUur: "uur",
    instUitleg:
      "De check zoekt het droogste en zonnigste blok van de dag. Luchten werkt het best bij een lage luchtvochtigheid: dan trekt vocht uit dekbed en kussens en verdwijnt de muffe lucht. Zon helpt daarbij en werkt tegen huisstofmijt. Op een klamme of mistige dag wordt het buiten juist vochtiger, dus dan is binnen laten beter. Een matras of topper vraagt een langere, drogere periode dan even een dekbed opfrissen; stel dat in, dan schuift de check mee.",
  },
  en: {
    slug: "airing-bedding",
    naam: "Can I air my duvet outside?",
    korteVraag: "Can I air my duvet outside?",
    meldingKort: "Bedding check",
    cta: "Check the airing weather",
    navLabel: "Airing bedding",
    diepte: "The driest, sunniest window: dry air pulls out moisture, the sun helps against dust mites.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Perfect airing weather", goed: "Fine to air", twijfelachtig: "Doable, but muggy", matig: "Too humid", "zeer-slecht": "Keep inside" },
    adviesLabels: { goed: "airing weather", matig: "doable, but muggy", slecht: "keep inside" },
    legenda: { links: "keep inside", rechts: "airing weather" },
    redenNat: "rain: wet bedding is the opposite of airing",
    redenGeenBlok: "no dry window with dry air today",
    redenMatigBlok: (g, w) => "the best window is muggy: little moisture is drawn out",
    redenKortBlok: (u) => `only a short dry window (${u} hours)`,
    redenBuien: "showers around the best window",
    redenVochtig: (rh) => `high humidity (around ${rh}%): it won't get drier outside`,
    redenGeenZon: "little sun: the effect against dust mites stays limited",
    redenWind: (w) => `strong wind (around ${w} km/h): secure things well`,
    metric: (uur) => `Driest, sunniest moment: around ${uur}:00.`,
    statusNu: (tijd) => `Fine to air now: the dry window runs until ${tijd}.`,
    statusBeste: (tijd) => `Driest, sunniest hours: ${tijd}.`,
    statusGeweest: "The best airing weather has been and gone today.",
    statusNiks: "Today is too humid to air bedding outside.",
    toekomstBeste: (tijd) => `Driest window: ${tijd}.`,
    toekomstGeen: "No airing weather.",
    instWatVraag: "What are you airing?",
    instWatKeuzes: ["Duvet or pillows", "Bedding and sheets", "Mattress or topper"],
    instDrogeVraag: "How fresh should it get?",
    instDrogeKeuzes: ["Just a freshen-up", "Normal", "Really moisture-free"],
    instDagStart: "Earliest time",
    instDagEind: "Latest time",
    instUur: "h",
    instUitleg:
      "The check finds the driest and sunniest window of the day. Airing works best at low humidity: moisture is drawn from duvet and pillows and the musty smell disappears. Sun helps and works against dust mites. On a muggy or foggy day it gets more humid outside, so keeping things inside is better. A mattress or topper needs a longer, drier spell than a quick duvet freshen-up; set that and the check adjusts.",
  },
});

export const DEKBED_DEFAULTS = { streng: 1, dagStart: 10, dagEind: 16 };

export function uurDekbedScore(u, inst = DEKBED_DEFAULTS) {
  if ((u.neerslag ?? 0) > 0.1 || (u.kans ?? 0) >= 55) return 0;
  const rh = u.rh ?? 70;
  // Lage luchtvochtigheid is goed; de strengheid verschuift de drempel.
  const rhHoog = inst.streng === 2 ? 70 : inst.streng === 0 ? 85 : 78;
  const rhF = clamp(lerp(rh, rhHoog, 45, 0.2, 1), 0.2, 1);
  // Zon-bonus via lage bewolking.
  const zonF = clamp(lerp(u.bewolking ?? 60, 90, 25, 0.7, 1.05), 0.7, 1.05);
  return clamp(Math.round(94 * rhF * zonF), 0, 100);
}

export const overlay = maakVensterOverlay({
  defaults: DEKBED_DEFAULTS,
  uurScore: uurDekbedScore,
  teksten: T,
  adviesLabels: T.adviesLabels,
  minVensterUren: 2,
  extraFactoren: ({ venster }) => {
    if (!venster) return [];
    const uit = [];
    const gemRh = Math.round(venster.blok.reduce((s, u) => s + (u.rh ?? 70), 0) / venster.blok.length);
    const gemBew = venster.blok.reduce((s, u) => s + (u.bewolking ?? 60), 0) / venster.blok.length;
    if (gemRh >= 80) uit.push({ punten: 18, reden: T.redenVochtig(gemRh) });
    if (gemBew >= 80) uit.push({ punten: 8, reden: T.redenGeenZon });
    return uit;
  },
});

export const dekbedLuchten = {
  id: "dekbed-luchten",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#8C6239",
  locatieHint: T.locatieHint,
  icoon: "dekbed",
  categorieId: "huis-tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: DEKBED_DEFAULTS },
  instellingen: {
    defaults: DEKBED_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "wat",
        vraag: T.instWatVraag,
        keuzes: [
          { label: T.instWatKeuzes[0], zet: { streng: 1 } },
          { label: T.instWatKeuzes[1], zet: { streng: 0 } },
          { label: T.instWatKeuzes[2], zet: { streng: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "droge",
        vraag: T.instDrogeVraag,
        keuzes: [
          { label: T.instDrogeKeuzes[0], zet: { streng: 0 } },
          { label: T.instDrogeKeuzes[1], zet: { streng: 1 } },
          { label: T.instDrogeKeuzes[2], zet: { streng: 2 } },
        ],
      },
      { key: "dagStart", label: T.instDagStart, eenheid: T.instUur, step: 1, min: 8, max: 12 },
      { key: "dagEind", label: T.instDagEind, eenheid: T.instUur, step: 1, min: 13, max: 19 },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-19",
  affiliate: {
    kop: { nl: "Fris beddengoed", en: "Fresh bedding" },
    advies: {
      nl: "Een stevig droogrek of een luchthaak aan de gevel houdt het dekbed van de grond, en een mattenklopper slaat stof en mijt eruit. Voor wie geen zon heeft, doet een dekbedstomer of een frisse dag met open ramen ook veel.",
      en: "A sturdy drying rack or a wall airer keeps the duvet off the ground, and a carpet beater knocks out dust and mites. If you have no sun, a garment steamer or a fresh day with open windows helps too.",
    },
    items: [
      { label: { nl: "Droogrek en mattenklopper", en: "Drying rack and carpet beater" }, url: "https://www.bol.com/nl/nl/s/?searchtext=droogrek", partner: "bol.com" },
    ],
  },
};
