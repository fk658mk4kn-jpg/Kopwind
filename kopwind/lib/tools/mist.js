/**
 * lib/tools/mist.js
 *
 * De mistcheck (v3.29.0 "Ghibli"). De eerste check met het zichtveld:
 * de vraag is niet of het mistig wordt maar of JOUW rit erdoor
 * geraakt wordt en wanneer het optrekt. De motor kijkt naar het zicht
 * in het gekozen spitsvenster (KNMI-achtige klassen: onder de 200
 * meter dichte mist, onder een kilometer mist, onder vijf kilometer
 * nevel) en geeft als metric het uur waarop het zicht weer boven de
 * vijf kilometer komt: het antwoord op "kan ik beter even wachten?".
 */

import { clamp, maakScore, adviesVoorScore } from "../engine/score.js";
import { bouwBasis, basisPerDag, dagKeyVan, BASIS_VELDEN } from "../engine/weerbasis.js";
import { kies } from "../i18n/locale.js";

const T = kies({
  nl: {
    slug: "mist",
    naam: "Is het mistig vanochtend?",
    korteVraag: "Is het mistig vanochtend?",
    meldingKort: "Mistcheck",
    cta: "Check het zicht",
    navLabel: "Mist",
    diepte: "Zicht in jouw spits, met het uur waarop de mist optrekt.",
    locatieHint: "Zoek je stad, dat is genoeg...",
    schaalLabels: { ideaal: "Vrij zicht", goed: "Goed zicht", twijfelachtig: "Nevelig", matig: "Mist in de spits", "zeer-slecht": "Dichte mist" },
    adviesLabels: { goed: "vrij zicht", matig: "nevelig, pas je aan", slecht: "mist: houd afstand of wacht" },
    legenda: { links: "dichte mist", rechts: "vrij zicht" },
    statusDicht: (m) => `Dichte mist in jouw venster (zicht rond ${m} meter): mistlampen aan, snelheid fors terug, of wacht tot het optrekt.`,
    statusMist: (m) => `Mist in jouw venster (zicht rond ${m} meter): reken op vertraging en houd extra afstand.`,
    statusNevel: "Nevelig in jouw venster: het zicht is beperkt maar werkbaar.",
    statusVrij: "Vrij zicht in jouw venster: geen mist van betekenis.",
    redenDicht: (m) => `dichte mist (zicht rond ${m} meter)`,
    redenMist: (m) => `mist (zicht rond ${m} meter)`,
    redenNevel: "nevel (zicht onder de vijf kilometer)",
    redenVrij: "vrij zicht",
    metricOptrekken: (uur) => `De mist trekt op rond ${uur}:00 (zicht weer ruim).`,
    metricBlijft: "Het zicht blijft in dit venster beperkt; later op de dag wordt het beter.",
    metricVrij: "Het zicht is en blijft ruim.",
    instWanneerVraag: "Wanneer rij je?",
    instWanneerKeuzes: ["Ochtendspits", "Avond en nacht", "Beide"],
    instVervoerVraag: "Hoe reis je?",
    instVervoerKeuzes: ["Auto, veel snelweg", "Auto, binnenwegen", "Fiets of scooter"],
    instRouteVraag: "Door open of bebouwd gebied?",
    instRouteKeuzes: ["Open polder of langs water", "Gemengd", "Vooral bebouwd"],
    instUitleg:
      "De check kijkt naar het verwachte zicht in jouw reisvenster: onder de 200 meter is dichte mist, onder een kilometer mist, onder vijf kilometer nevel. Op de snelweg weegt mist het zwaarst (snelheidsverschillen), in open polder en langs water hangt hij het langst. De metric vertelt wanneer het optrekt: soms is een half uur wachten de beste route.",
  },
  en: {
    slug: "fog",
    naam: "Is it foggy this morning?",
    korteVraag: "Foggy this morning?",
    meldingKort: "Fog check",
    cta: "Check visibility",
    navLabel: "Fog",
    diepte: "Visibility in your commute, with the hour the fog lifts.",
    locatieHint: "Search your town, that's enough...",
    schaalLabels: { ideaal: "Clear view", goed: "Good visibility", twijfelachtig: "Hazy", matig: "Fog in the commute", "zeer-slecht": "Dense fog" },
    adviesLabels: { goed: "clear view", matig: "hazy, adjust", slecht: "fog: keep distance or wait" },
    legenda: { links: "dense fog", rechts: "clear view" },
    statusDicht: (m) => `Dense fog in your window (visibility around ${m} metres): fog lights on, speed way down, or wait until it lifts.`,
    statusMist: (m) => `Fog in your window (visibility around ${m} metres): expect delays and keep extra distance.`,
    statusNevel: "Hazy in your window: visibility is limited but workable.",
    statusVrij: "Clear view in your window: no fog of note.",
    redenDicht: (m) => `dense fog (visibility around ${m} metres)`,
    redenMist: (m) => `fog (visibility around ${m} metres)`,
    redenNevel: "haze (visibility under five kilometres)",
    redenVrij: "clear view",
    metricOptrekken: (uur) => `The fog lifts around ${uur}:00 (visibility opens up).`,
    metricBlijft: "Visibility stays limited in this window; it improves later in the day.",
    metricVrij: "Visibility is and stays wide.",
    instWanneerVraag: "When do you travel?",
    instWanneerKeuzes: ["Morning rush", "Evening and night", "Both"],
    instVervoerVraag: "How do you travel?",
    instVervoerKeuzes: ["Car, mostly motorway", "Car, local roads", "Bike or scooter"],
    instRouteVraag: "Through open or built-up country?",
    instRouteKeuzes: ["Open polder or along water", "Mixed", "Mostly built-up"],
    instUitleg:
      "The check looks at expected visibility in your travel window: under 200 metres is dense fog, under a kilometre fog, under five kilometres haze. On the motorway fog weighs heaviest (speed differences), in open polder and along water it lingers longest. The metric tells you when it lifts: sometimes waiting half an hour is the best route.",
  },
});

export const MIST_DEFAULTS = { wanneer: 0, vervoer: 0, route: 1 };

function mistUren(uren, wanneer) {
  if (wanneer === 0) return uren.filter((u) => u.uur >= 5 && u.uur <= 10);
  if (wanneer === 1) return uren.filter((u) => u.uur >= 18 || u.uur <= 2);
  return uren.filter((u) => u.uur >= 5 && u.uur <= 10 || u.uur >= 18);
}

export function overlay(hourly, nu = new Date(), instellingen = MIST_DEFAULTS) {
  const inst = { ...MIST_DEFAULTS, ...(instellingen ?? {}) };
  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const vandaagKey = dagKeyVan(nu);
  const datums = [...perDag.keys()].filter((d) => d >= vandaagKey).sort().slice(0, 5);

  const dagenUit = [];
  for (const datum of datums) {
    const alleUren = perDag.get(datum) ?? [];
    if (!alleUren.length) continue;
    const uren = mistUren(alleUren, inst.wanneer);
    if (!uren.length) continue;

    const zichten = uren.map((u) => u.zicht).filter((z) => z != null);
    const minZicht = zichten.length ? Math.round(Math.min(...zichten)) : null;
    // Snelweg strenger, open gebied houdt mist langer vast.
    const zwaarte = (inst.vervoer === 0 ? 1.15 : inst.vervoer === 2 ? 0.9 : 1) * (inst.route === 0 ? 1.1 : 1);

    const factoren = [];
    let zin;
    if (minZicht == null) {
      factoren.push({ punten: 8, reden: T.redenVrij });
      zin = T.statusVrij;
    } else if (minZicht < 200) {
      factoren.push({ punten: Math.round(72 * zwaarte), reden: T.redenDicht(minZicht) });
      zin = T.statusDicht(minZicht);
    } else if (minZicht < 1000) {
      factoren.push({ punten: Math.round(48 * zwaarte), reden: T.redenMist(minZicht) });
      zin = T.statusMist(minZicht);
    } else if (minZicht < 5000) {
      factoren.push({ punten: Math.round(22 * zwaarte), reden: T.redenNevel });
      zin = T.statusNevel;
    } else {
      factoren.push({ punten: 6, reden: T.redenVrij });
      zin = T.statusVrij;
    }

    // Wanneer trekt het op: eerste uur na het venster-begin met ruim zicht.
    let metricZin = T.metricVrij;
    if (minZicht != null && minZicht < 5000) {
      const vrijUur = alleUren.find((u) => u.uur >= uren[0].uur && (u.zicht ?? 99999) >= 5000);
      metricZin = vrijUur ? T.metricOptrekken(String(vrijUur.uur).padStart(2, "0")) : T.metricBlijft;
    }

    const { score, redenen } = maakScore(factoren);
    const conditie = { score: clamp(score, 0, 100), redenen, advies: adviesVoorScore(clamp(score, 0, 100), mist.adviesLabels) };

    dagenUit.push({
      datum,
      antwoord: { ja: score < 45, zin },
      uren: uren.map((u) => ({
        uur: u.uur,
        score: u.zicht == null ? 80 : u.zicht < 200 ? 5 : u.zicht < 1000 ? 30 : u.zicht < 5000 ? 60 : 90,
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

export const mist = {
  id: "mist",
  slug: T.slug,
  naam: T.naam,
  meldingKort: T.meldingKort,
  korteVraag: T.korteVraag,
  cta: T.cta,
  navLabel: T.navLabel,
  kleur: "#44607A",
  locatieHint: T.locatieHint,
  icoon: "mistbank",
  categorieId: "winter",
  diepte: T.diepte,
  schaalLabels: T.schaalLabels,
  patroon: "A",
  inputType: "locatie",
  weerVelden: [...BASIS_VELDEN, "visibility"],
  weerDagen: 5,
  overlay,
  scoreConfig: { overlay, defaults: MIST_DEFAULTS },
  instellingen: {
    defaults: MIST_DEFAULTS,
    velden: [
      {
        type: "keuze",
        id: "wanneer",
        vraag: T.instWanneerVraag,
        keuzes: [
          { label: T.instWanneerKeuzes[0], zet: { wanneer: 0 } },
          { label: T.instWanneerKeuzes[1], zet: { wanneer: 1 } },
          { label: T.instWanneerKeuzes[2], zet: { wanneer: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "vervoer",
        vraag: T.instVervoerVraag,
        keuzes: [
          { label: T.instVervoerKeuzes[0], zet: { vervoer: 0 } },
          { label: T.instVervoerKeuzes[1], zet: { vervoer: 1 } },
          { label: T.instVervoerKeuzes[2], zet: { vervoer: 2 } },
        ],
      },
      {
        type: "keuze",
        id: "route",
        vraag: T.instRouteVraag,
        keuzes: [
          { label: T.instRouteKeuzes[0], zet: { route: 0 } },
          { label: T.instRouteKeuzes[1], zet: { route: 1 } },
          { label: T.instRouteKeuzes[2], zet: { route: 2 } },
        ],
      },
    ],
    uitleg: T.instUitleg,
  },
  adviesLabels: T.adviesLabels,
  bijgewerkt: "2026-07-18",
  affiliate: null,
};
