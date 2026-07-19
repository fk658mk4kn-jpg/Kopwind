/**
 * lib/advice.js
 *
 * Pijnscore (0 tot 100, hoger is vervelender om te fietsen) per rit en het
 * dagadvies. Puur en testbaar. Naar de gebruiker toe wordt de score getoond
 * als rapportcijfer (zie fmtCijfer in lib/format.js): score 0 is een 10,
 * score 30 een 7,0, score 60 een 4,0.
 *
 * De score is bewust continu vanaf lichte wind. In een eerdere versie
 * telde alleen het ritgemiddelde boven een harde drempel; dan kreeg een rit
 * met "1,9 km merkbare tegenwind" alsnog score 0 en dat voelde kapot.
 * Nu tellen ook de tegenwindstukken zelf mee, zodat cijfer en toelichting
 * altijd hetzelfde verhaal vertellen.
 *
 * Cijfer-ankers (v2.1.0 "Mistral", tegen score-inflatie): 10 = rugwind of
 * luw, droog en mild; 7 = merkbare tegenwind maar droog; 5 = stevige
 * tegenwind of een serieuze buienkans; 3 = stevige tegenwind plus regen;
 * 0-2 = storm of zware regen. De middenmoot hoort 5-7 te zijn; 9,5-10 is
 * gereserveerd voor bijna-perfect.
 */

export const DEFAULT_THRESHOLDS = {
  tegenwindMatig: 12, // km/u kopwind waarboven een stuk als merkbaar telt
  tegenwindZwaar: 22, // km/u kopwind waarboven het echt pijn doet
  neerslagKans: 60, // % waarboven regen gaat meetellen
  neerslagMm: 1.0, // mm/u waarboven regen zwaar meetelt
  gevoelMin: 0, // graden gevoelstemperatuur waaronder extra punten
  segmentLengte: 300, // meter per routesegment
};

import { lerp, clamp } from "./engine/score.js";

/**
 * Berekent de pijnscore van een rit op basis van de metrics uit analyzeLeg.
 *
 * @returns {{score: number, redenen: string[]}}
 */
export function painScore(metrics, thresholds = DEFAULT_THRESHOLDS) {
  let score = 0;
  const redenen = [];
  const rond = (n) => Math.round(n);

  // Ankers (v2.1.0 "Mistral"): 10 = rugwind of luw, droog en mild;
  // 7 = merkbare tegenwind (rond de matig-drempel) maar droog;
  // 5 = stevige tegenwind of een serieuze buienkans;
  // 3 en lager = stevige tegenwind plus regen, of storm.

  // Tegenwind: continu vanaf 5 km/u, gekalibreerd zodat de matig-drempel
  // rond de 7 landt en de zwaar-drempel diep in de 2-3.
  if (metrics.meanPosHead >= 5) {
    score += lerp(metrics.meanPosHead, 5, thresholds.tegenwindZwaar, 0, 60);
    if (metrics.meanPosHead > thresholds.tegenwindZwaar) {
      score += lerp(metrics.meanPosHead, thresholds.tegenwindZwaar, thresholds.tegenwindZwaar + 12, 0, 15);
    }
    if (metrics.meanPosHead >= thresholds.tegenwindMatig) {
      redenen.push(`gemiddeld ${rond(metrics.meanPosHead)} km/u wind tegen`);
    }
  }

  // Tegenwindstukken: het deel van de route met merkbare of stevige
  // tegenwind telt mee in het cijfer, ook als het ritgemiddelde laag
  // blijft. De losse "X km tegenwind op de route"-reden staat hier bewust
  // NIET meer: de windsamenvatting (summarizeLegNL) vertelt al waar en
  // hoeveel wind er is, per stuk. Die twee naast elkaar tonen (som versus
  // losse stukken, bv. 2,3 km tegenover 0,3 km plus 2 km) las tegenstrijdig.
  const fracMatig = metrics.fracMatig ?? 0;
  const fracZwaar = metrics.fracZwaar ?? 0;
  if (fracMatig > 0) score += fracMatig * 10;
  if (fracZwaar > 0) score += fracZwaar * 8;

  // Piek: een kort maar heftig stuk telt extra.
  if (metrics.maxHead >= thresholds.tegenwindZwaar) {
    score += lerp(
      metrics.maxHead,
      thresholds.tegenwindZwaar,
      thresholds.tegenwindZwaar + 15,
      4,
      10
    );
    redenen.push(`piek van ${rond(metrics.maxHead)} km/u tegenwind`);
  }

  // Neerslagkans: gegradeerd vanaf 30% (geen klif meer op de drempel);
  // de reden verschijnt vanaf de ingestelde drempel.
  if ((metrics.neerslagKansMax ?? 0) >= 30) {
    score += lerp(metrics.neerslagKansMax, 30, 100, 0, 42);
    if (metrics.neerslagKansMax >= thresholds.neerslagKans) {
      redenen.push(`${rond(metrics.neerslagKansMax)}% kans op neerslag`);
    }
  }

  // Hoeveelheid neerslag: gegradeerd vanaf motregen.
  if ((metrics.neerslagMmMax ?? 0) >= 0.15) {
    score += lerp(metrics.neerslagMmMax, 0.15, 4, 3, 28);
    if (metrics.neerslagMmMax >= thresholds.neerslagMm) {
      redenen.push(
        `tot ${metrics.neerslagMmMax.toFixed(1).replace(".", ",")} mm neerslag per uur`
      );
    }
  }

  // Koud aanvoelen: gegradeerd onder de 10 graden gevoel, zwaarder onder
  // de ingestelde grens.
  if (metrics.gevoelMin != null && metrics.gevoelMin < 10) {
    score += lerp(metrics.gevoelMin, 10, thresholds.gevoelMin, 0, 8);
    if (metrics.gevoelMin < thresholds.gevoelMin) {
      score += lerp(metrics.gevoelMin, thresholds.gevoelMin, thresholds.gevoelMin - 8, 4, 14);
      redenen.push(`gevoelstemperatuur ${rond(metrics.gevoelMin)} graden`);
    }
  }

  // Windstoten: gegradeerd vanaf 45 km/u.
  if ((metrics.maxGust ?? 0) >= 45) {
    score += lerp(metrics.maxGust, 45, 80, 2, 14);
    if (metrics.maxGust >= 60) {
      redenen.push(`windstoten tot ${rond(metrics.maxGust)} km/u`);
    }
  }

  return { score: Math.min(100, Math.round(score)), redenen, factoren: factorenVoorRit(metrics, thresholds) };
}

/**
 * De weerfactoren achter een ritscore als balkjes (fase 2, v3.20.0),
 * in dezelfde vorm als FactorBalken elders op de site verwacht:
 * {id, gewicht, score}, score 0..100 gunstig. Bewust een AFGELEIDE
 * benadering naast painScore, niet een herberekening: kleine
 * afwijkingen van het exacte cijfer zijn acceptabel, dit is
 * toelichting, geen tweede waarheid (zelfde uitgangspunt als
 * lib/engine/factoren.js). Vier factoren, gewicht in lijn met hun
 * aandeel in de formule hierboven: tegenwind en droog wegen het
 * zwaarst, temperatuur minder, windstoten het lichtst.
 */
function factorenVoorRit(metrics, thresholds) {
  const tegenwindGunstig = clamp(
    100 -
      lerp(metrics.meanPosHead ?? 0, 0, thresholds.tegenwindZwaar + 12, 0, 100) -
      (metrics.fracZwaar ?? 0) * 20 -
      (metrics.fracMatig ?? 0) * 8,
    0,
    100
  );
  const droogGunstig = clamp(
    100 -
      lerp(metrics.neerslagKansMax ?? 0, 0, 100, 0, 65) -
      lerp(metrics.neerslagMmMax ?? 0, 0, 4, 0, 35),
    0,
    100
  );
  const tempGunstig =
    metrics.gevoelMin == null
      ? 100
      : clamp(lerp(metrics.gevoelMin, thresholds.gevoelMin - 8, 10, 20, 100), 0, 100);
  const stotenGunstig = clamp(100 - lerp(metrics.maxGust ?? 0, 45, 80, 0, 100), 0, 100);

  return [
    { id: "tegenwind", gewicht: 35, score: Math.round(tegenwindGunstig) },
    { id: "droog", gewicht: 35, score: Math.round(droogGunstig) },
    { id: "temp", gewicht: 20, score: Math.round(tempGunstig) },
    { id: "stoten", gewicht: 10, score: Math.round(stotenGunstig) },
  ];
}

/**
 * Vertaalt een pijnscore naar een fietsadvies (3-woordige fietstaal).
 * SINDS v3.20.0 BEWUST NIET MEER IN DE UI: de badge gebruikt de
 * vijfschaal (VerdictBadge/labelVoor), consistent met de rest van de
 * site. Dit veld leeft door als intern contract: tests
 * (tests/advice.test.js) en drempellogica leunen erop. Niet opnieuw
 * renderen; audit v3.23.0 bevestigde dat geen component het toont.
 */
export function adviesVoorScore(score) {
  if (score >= 60) return "liever niet fietsen";
  if (score >= 30) return "pittige rit";
  return "prima fietsdag";
}

/** Advies voor een enkele rit. */
export function legAdvies(metrics, thresholds = DEFAULT_THRESHOLDS) {
  const { score, redenen, factoren } = painScore(metrics, thresholds);
  return { score, redenen, factoren, advies: adviesVoorScore(score) };
}

/**
 * Cijferdrempels, expliciet en op een plek (fase 2, v3.20.0): welk
 * cijfer bij welk advies hoort. Dezelfde grenzen als adviesVoorScore
 * hierboven, alleen dan voor de gebruiker uitgeschreven. cijferWaarde
 * (lib/engine/score.js) rekent score naar cijfer met dezelfde formule
 * als fmtCijfer in lib/format.js.
 */
export const CIJFERDREMPELS = {
  prima: 7.0, // score < 30
  pittig: 4.0, // score < 60
  // score >= 60: liever niet fietsen
};

/**
 * Dagadvies: je kiest een keer per dag of de fiets meegaat, dus de zwaarste
 * rit van de keten (heen, terug en eventuele tussenstops) bepaalt het advies.
 *
 * @param {Array<{advies: {score, redenen, advies}, van, naar}>} legs
 */
export function dagAdvies(legs) {
  if (!legs.length) return null;
  let worstIdx = 0;
  for (let i = 1; i < legs.length; i++) {
    if (legs[i].advies.score > legs[worstIdx].advies.score) worstIdx = i;
  }
  const worst = legs[worstIdx];
  const score = worst.advies.score;
  const redenen = worst.advies.redenen ?? [];
  const label = `${worst.van?.naam ?? "rit " + (worstIdx + 1)} naar ${worst.naar?.naam ?? ""}`.trim();

  // De windsamenvatting van de zwaarste rit is de bron voor het
  // windverhaal (summarizeLegNL); de overige redenen (regen, kou, stoten,
  // gemiddelde of piekwind) vullen aan. Zo vertelt de dagbanner hetzelfde
  // verhaal als de kaart eronder, zonder de kilometers dubbel te tellen.
  const wind = typeof worst.samenvatting === "string" ? worst.samenvatting.trim() : "";
  const extra = redenen.length ? ` ${hoofdletter(redenen.join(", "))}.` : "";

  // Bij een enkele rit is "zwaarste rit"-taal onzin (feedback v3.26.0):
  // dan is de uitleg gewoon het verhaal van die ene rit.
  const enkel = legs.length === 1;
  let uitleg;
  if (!wind && !redenen.length) {
    uitleg = enkel ? "Deze rit is goed te doen." : "Alle ritten zijn goed te doen.";
  } else if (!wind) {
    // Geen samenvatting beschikbaar (bv. handmatige legs in een test): oude vorm.
    uitleg = enkel ? `${hoofdletter(redenen.join(", "))}.` : `Zwaarste rit: ${label} (${redenen.join(", ")}).`;
  } else {
    uitleg = enkel ? `${wind}${extra}` : `Zwaarste rit: ${label}. ${wind}${extra}`;
  }

  return {
    score,
    advies: adviesVoorScore(score),
    ja: score < 45, // zelfde jaVoor-grens als de rest van de site
    aantal: legs.length,
    worstIdx,
    worstLabel: label,
    redenen,
    windZin: wind || null,
    factoren: worst.advies.factoren ?? [],
    uitleg,
  };
}

function hoofdletter(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
