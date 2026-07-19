/**
 * lib/tools/huis-koelen.js
 *
 * De koelcheck (v3.29.0 "Ghibli"). Bij warm weer is de vraag niet OF
 * je moet koelen maar WANNEER de ramen open en dicht moeten: overdag
 * alles dicht (ramen, gordijnen, zonwering) zodra het buiten warmer is
 * dan binnen, en 's avonds en 's nachts juist alles tegen elkaar open
 * om de koelte binnen te halen. De motor berekent per dag het
 * spui-venster (de uren onder de 20 graden) en scoort de dag op hoe
 * zwaar het koelen wordt: een tropennacht is de echte boosdoener,
 * want dan valt er niets binnen te halen.
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "huis-koelen",
    naam: "Hoe houd ik het huis koel vandaag?",
    korteVraag: "Hoe houd ik het huis koel?",
    meldingKort: "Koelcheck",
    cta: "Check het koelplan",
    navLabel: "Huis koelen",
    diepte: "Wanneer de ramen open en dicht moeten: het spui-venster per dag.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Geen koelbeleid nodig", goed: "Makkelijk koel te houden", twijfelachtig: "Overdag dicht, avond open", matig: "Zware koeldag", "zeer-slecht": "Tropennacht: alles uit de kast" },
    adviesLabels: { goed: "geen koelbeleid nodig", matig: "overdag dicht, avond open", slecht: "zware koeldag" },
    legenda: { links: "zwaar te koelen", rechts: "koel huis" },
    statusMild: "Geen koelbeleid nodig: het wordt niet warm genoeg om het huis op te warmen.",
    statusWarm: (open) => `Warm vandaag: ramen, gordijnen en zonwering overdag dicht, en ${open} alles tegen elkaar open om de koelte binnen te halen.`,
    statusHeet: (open) => `Heet vandaag: houd alles dicht en verduisterd zolang het buiten warmer is dan binnen. Spuien kan ${open}.`,
    statusTropen: (min) => `Tropennacht op komst (minimum rond ${min} graden): er valt 's nachts weinig koelte te halen. Verduister overdag maximaal, richt een ventilator op jezelf (niet op de kamer) en koel desnoods een slaapplek beneden.`,
    redenMild: "geen serieuze warmte",
    redenWarm: (t) => `warme dag (gevoel tot ${t} graden)`,
    redenHeet: (t) => `hete dag (gevoel tot ${t} graden)`,
    redenTropen: (min) => `tropennacht (minimum rond ${min} graden)`,
    redenZonwering: "zonder zonwering warmt het glas het huis extra op",
    metricVenster: (van, tot) => `Spui-venster: zet alles open van ${van}:00 tot ${tot}:00.`,
    metricGeen: "Geen bruikbaar koel venster: het koelt nauwelijks af.",
    metricNiks: "Geen koelvenster nodig vandaag.",
    instWoningVraag: "Wat voor woning?",
    instWoningKeuzes: ["Bovenwoning of onder het dak", "Tussenwoning", "Hoekhuis of vrijstaand"],
    instZonweringVraag: "Heb je buitenzonwering (screens, luifel)?",
    instZonweringKeuzes: ["Nee", "Ja"],
    instSlaapVraag: "Waar slaap je?",
    instSlaapKeuzes: ["Zolder of dakkamer", "Verdieping", "Begane grond"],
    instUitleg:
      "De vuistregel: dicht zodra het buiten warmer is dan binnen, open zodra het buiten koeler is. De check berekent dat spui-venster per dag (de uren onder de 20 graden) en weegt hoe zwaar de koeldag wordt. Een tropennacht is de echte boosdoener: dan valt er niets binnen te halen. Onder het dak en zonder buitenzonwering telt alles een maat zwaarder.",
  },
  en: {
    slug: "cooling-the-house",
    naam: "How do I keep the house cool today?",
    korteVraag: "How to keep the house cool?",
    meldingKort: "Cooling check",
    cta: "Check the cooling plan",
    navLabel: "Cooling the house",
    diepte: "When windows open and close: the flush window per day.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "No cooling plan needed", goed: "Easy to keep cool", twijfelachtig: "Closed by day, open at night", matig: "A heavy cooling day", "zeer-slecht": "Tropical night: all hands on deck" },
    adviesLabels: { goed: "no cooling plan needed", matig: "closed by day, open at night", slecht: "heavy cooling day" },
    legenda: { links: "hard to cool", rechts: "cool house" },
    statusMild: "No cooling plan needed: it won't get warm enough to heat up the house.",
    statusWarm: (open) => `Warm today: windows, curtains and shades closed by day, and ${open} open everything up to pull the cool air in.`,
    statusHeet: (open) => `Hot today: keep everything closed and darkened while it's warmer outside than in. Flushing works ${open}.`,
    statusTropen: (min) => `Tropical night coming (minimum around ${min} degrees): little coolness to harvest at night. Darken maximally by day, aim a fan at yourself (not the room) and consider a downstairs sleeping spot.`,
    redenMild: "no serious heat",
    redenWarm: (t) => `warm day (feels like up to ${t} degrees)`,
    redenHeet: (t) => `hot day (feels like up to ${t} degrees)`,
    redenTropen: (min) => `tropical night (minimum around ${min} degrees)`,
    redenZonwering: "without exterior shading the glass heats the house further",
    metricVenster: (van, tot) => `Flush window: open everything from ${van}:00 to ${tot}:00.`,
    metricGeen: "No usable flush window: it barely cools down.",
    metricNiks: "No flush window needed today.",
    instWoningVraag: "What kind of home?",
    instWoningKeuzes: ["Top-floor flat or under the roof", "Terraced house", "Corner or detached"],
    instZonweringVraag: "Exterior shading (screens, awning)?",
    instZonweringKeuzes: ["No", "Yes"],
    instSlaapVraag: "Where do you sleep?",
    instSlaapKeuzes: ["Attic or roof room", "Upper floor", "Ground floor"],
    instUitleg:
      "The rule of thumb: close up the moment it's warmer outside than in, open up the moment it's cooler. The check computes that flush window per day (the hours below 20 degrees) and weighs how heavy the cooling day gets. A tropical night is the real culprit: nothing to harvest then. Under the roof and without exterior shading everything counts a size heavier.",
  },
});

export const KOEL_DEFAULTS = { woning: 1, zonwering: 0, slaap: 1 };

export function overlay(hourly, nu = new Date(), instellingen = KOEL_DEFAULTS) {
  const inst = { ...KOEL_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const vandaagKey = dagKeyVan(nu);
  const alle = basis.filter((u) => u.datum >= vandaagKey);
  const datums = [...perDag.keys()].filter((d) => d >= vandaagKey).sort().slice(0, 5);

  const dagenUit = [];
  for (const datum of datums) {
    const uren = perDag.get(datum) ?? [];
    if (!uren.length) continue;

    const maxGevoel = Math.round(Math.max(...uren.map((u) => u.gevoel ?? u.temp ?? 0)));
    // Nachtminimum: de nacht die op deze dag volgt (22:00 tot 08:00 D+1).
    const startIdx = alle.findIndex((u) => u.datum === datum && u.uur >= 22);
    const nacht = startIdx === -1 ? [] : alle.slice(startIdx, startIdx + 10);
    const minNacht = nacht.length ? Math.round(Math.min(...nacht.map((u) => u.temp ?? 99))) : null;

    // Spui-venster: aaneengesloten koele uren (onder de 20) in avond en nacht.
    const koel = nacht.filter((u) => (u.temp ?? 99) < 20);
    let venster = null;
    if (koel.length >= 2) {
      venster = { van: koel[0].uur, tot: koel[koel.length - 1].uur };
    }
    const vensterStr = venster
      ? `${String(venster.van).padStart(2, "0")}:00`
      : null;

    const zwaarte = (inst.woning === 0 ? 1.15 : inst.woning === 2 ? 0.9 : 1) * (inst.slaap === 0 ? 1.1 : 1);

    const factoren = [];
    let zin;
    if (maxGevoel < 25) {
      factoren.push({ punten: 8, reden: T.redenMild });
      zin = T.statusMild;
    } else if (minNacht != null && minNacht >= 20) {
      factoren.push({ punten: Math.round(62 * zwaarte), reden: T.redenTropen(minNacht) });
      zin = T.statusTropen(minNacht);
    } else if (maxGevoel >= 30) {
      factoren.push({ punten: Math.round(46 * zwaarte), reden: T.redenHeet(maxGevoel) });
      zin = T.statusHeet(vensterStr ? kies({ nl: `vanaf ${vensterStr}`, en: `from ${vensterStr}` }) : kies({ nl: "pas diep in de nacht", en: "only deep in the night" }));
    } else {
      factoren.push({ punten: Math.round(28 * zwaarte), reden: T.redenWarm(maxGevoel) });
      zin = T.statusWarm(vensterStr ? kies({ nl: `vanaf ${vensterStr}`, en: `from ${vensterStr}` }) : kies({ nl: "'s nachts", en: "at night" }));
    }
    if (maxGevoel >= 27 && inst.zonwering === 0) {
      factoren.push({ punten: 8, reden: T.redenZonwering });
    }

    let metricZin = T.metricNiks;
    if (maxGevoel >= 25) {
      metricZin = venster
        ? T.metricVenster(String(venster.van).padStart(2, "0"), String(venster.tot).padStart(2, "0"))
        : T.metricGeen;
    }

    const { score, redenen } = maakScore(factoren);
    const conditie = { score: clamp(score, 0, 100), redenen, advies: adviesVoorScore(clamp(score, 0, 100), huisKoelen.adviesLabels) };

    dagenUit.push({
      datum,
      antwoord: { ja: score < 45, zin },
      uren: uren.map((u) => ({
        uur: u.uur,
        score: (u.temp ?? 15) < 20 ? 90 : (u.temp ?? 15) < 25 ? 65 : (u.temp ?? 15) < 30 ? 35 : 10,
        nat: (u.neerslag ?? 0) > 0.1,
      })),
      venster: null,
      metric: { zin: metricZin },
      conditie,
      status: { soort: "info", zin },
    });
  }

  return { dagen: dagenUit };
}

export const huisKoelen = {
  id: "huis-koelen",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#8C6239",
  locatieHint: T.locatieHint,
  icoon: "koelte",
  categorieId: "huis-tuin",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: BASIS_VELDEN,
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: KOEL_DEFAULTS },
  instellingen: {
    defaults: KOEL_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "woning",
        vraag: T.instWoningVraag,
        keuzes: [
          { label: T.instWoningKeuzes[0], zet: { woning: 0 } },
          { label: T.instWoningKeuzes[1], zet: { woning: 1 } },
          { label: T.instWoningKeuzes[2], zet: { woning: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "zonwering",
        vraag: T.instZonweringVraag,
        keuzes: [
          { label: T.instZonweringKeuzes[0], zet: { zonwering: 0 } },
          { label: T.instZonweringKeuzes[1], zet: { zonwering: 1 } },
        ],
      },
      {
        type: "keuze",
        id: "slaap",
        vraag: T.instSlaapVraag,
        keuzes: [
          { label: T.instSlaapKeuzes[0], zet: { slaap: 0 } },
          { label: T.instSlaapKeuzes[1], zet: { slaap: 1 } },
          { label: T.instSlaapKeuzes[2], zet: { slaap: 2 } },
        ],
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
