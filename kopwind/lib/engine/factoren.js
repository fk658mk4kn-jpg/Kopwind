/**
 * lib/engine/factoren.js
 *
 * De weerfactoren achter een oordeel, zichtbaar gemaakt (v3.5.0
 * "Tramontane"). Elke check weegt intern een handvol factoren
 * (temperatuur, wind, luchtvochtigheid, zon, neerslag); deze module
 * vertaalt de ruwe uurdata van het beste blok naar een 0-100 score per
 * factor plus een gewicht, zodat de UI balken kan tonen in de trant van
 * "Temperatuur 80 procent, Wind 20 procent".
 *
 * Bewust GESCHEIDEN van de overlays: die berekenen het echte oordeel en
 * zijn zwaar getest. Deze module raakt dat niet aan; hij leest dezelfde
 * inputs en geeft een uitlegbare benadering. Kleine verschillen met het
 * exacte oordeel zijn acceptabel, want dit is toelichting, geen tweede
 * waarheid.
 *
 * Score per factor: 100 = maximaal gunstig voor deze bezigheid, 0 =
 * maximaal ongunstig. Gewicht: hoe zwaar de factor meetelt voor deze
 * tool (samen ongeveer 100).
 */

import { clamp, lerp } from "./score.js";
import { bouwBasis, basisPerDag, dagKeyVan } from "./weerbasis.js";

/* ---- Losse factor-scores (0 gunstig .. 100 gunstig) ---- */

function tempComfort(gevoel, ideaal, onder, boven) {
  if (gevoel == null) return null;
  if (gevoel <= ideaal) return clamp(lerp(gevoel, onder, ideaal, 0, 100), 0, 100);
  return clamp(lerp(gevoel, ideaal, boven, 100, 20), 20, 100);
}

function windGunstig(wind, comfortabel, hard) {
  if (wind == null) return null;
  return clamp(lerp(wind, comfortabel, hard, 100, 0), 0, 100);
}

function windNuttig(wind, weinig, genoeg) {
  // Voor drogen: juist meer wind is beter.
  if (wind == null) return null;
  return clamp(lerp(wind, weinig, genoeg, 20, 100), 0, 100);
}

function vochtGunstig(rh, laag, hoog) {
  if (rh == null) return null;
  return clamp(lerp(rh, laag, hoog, 100, 0), 0, 100);
}

function zonGunstig(bewolking) {
  if (bewolking == null) return null;
  return clamp(100 - bewolking, 0, 100);
}

function droogGunstig(kans, neerslag) {
  const k = kans ?? 0;
  const mm = neerslag ?? 0;
  if (mm > 0.1) return clamp(30 - mm * 20, 0, 30);
  return clamp(100 - k, 0, 100);
}

function gem(uren, sel) {
  const w = uren.map(sel).filter((x) => x != null);
  if (!w.length) return null;
  return w.reduce((a, b) => a + b, 0) / w.length;
}

/**
 * Weegprofielen per tool-id: welke factoren tonen we, en hoe zwaar. De
 * `bereken` levert per factor de 0-100 gunstigheidsscore uit de
 * gemiddelden van het beste blok (of de dag).
 */
const PROFIELEN = {
  terras: {
    factoren: [
      { id: "temp", gewicht: 45, score: (u) => tempComfort(gem(u, (x) => x.gevoel), 23, 8, 32) },
      { id: "wind", gewicht: 25, score: (u) => windGunstig(gem(u, (x) => x.wind), 8, 35) },
      { id: "zon", gewicht: 20, score: (u) => zonGunstig(gem(u, (x) => x.bewolking)) },
      { id: "droog", gewicht: 10, score: (u) => droogGunstig(gem(u, (x) => x.kans), gem(u, (x) => x.neerslag)) },
    ],
  },
  barbecue: {
    factoren: [
      { id: "droog", gewicht: 40, score: (u) => droogGunstig(gem(u, (x) => x.kans), gem(u, (x) => x.neerslag)) },
      { id: "temp", gewicht: 30, score: (u) => tempComfort(gem(u, (x) => x.gevoel), 20, 8, 30) },
      { id: "wind", gewicht: 30, score: (u) => windGunstig(gem(u, (x) => x.wind), 8, 30) },
    ],
  },
  "was-buiten-drogen": {
    factoren: [
      { id: "vocht", gewicht: 40, score: (u) => vochtGunstig(gem(u, (x) => x.rh), 45, 90) },
      { id: "wind", gewicht: 30, score: (u) => windNuttig(gem(u, (x) => x.wind), 3, 25) },
      { id: "temp", gewicht: 15, score: (u) => tempComfort(gem(u, (x) => x.gevoel), 22, 2, 30) },
      { id: "droog", gewicht: 15, score: (u) => droogGunstig(gem(u, (x) => x.kans), gem(u, (x) => x.neerslag)) },
    ],
  },
  "fiets-naar-werk": {
    factoren: [
      { id: "droog", gewicht: 40, score: (u) => droogGunstig(gem(u, (x) => x.kans), gem(u, (x) => x.neerslag)) },
      { id: "wind", gewicht: 35, score: (u) => windGunstig(gem(u, (x) => x.wind), 10, 45) },
      { id: "temp", gewicht: 25, score: (u) => tempComfort(gem(u, (x) => x.gevoel), 16, -8, 28) },
    ],
  },
  "wat-trek-ik-aan": {
    factoren: [
      { id: "temp", gewicht: 55, score: (u) => tempComfort(gem(u, (x) => x.gevoel), 20, -5, 30) },
      { id: "wind", gewicht: 25, score: (u) => windGunstig(gem(u, (x) => x.wind), 8, 40) },
      { id: "droog", gewicht: 20, score: (u) => droogGunstig(gem(u, (x) => x.kans), gem(u, (x) => x.neerslag)) },
    ],
  },
  zonkracht: {
    factoren: [
      { id: "uv", gewicht: 70, score: (u) => clamp(100 - lerp(gem(u, (x) => x.uv) ?? 0, 0, 9, 0, 100), 0, 100) },
      { id: "zon", gewicht: 30, score: (u) => zonGunstig(gem(u, (x) => x.bewolking)) },
    ],
  },
};

/**
 * Berekent de factorbalken voor een tool en een dag-index uit de ruwe
 * hourly. Geeft null als de tool geen profiel heeft (bv. hooikoorts,
 * dat een eigen databron met eigen uitleg heeft).
 *
 * @returns {null | { factoren: Array<{id, gewicht, score}> }}
 */
export function factorenVoor(toolId, hourly, dagIndex = 0, venster = null) {
  const profiel = PROFIELEN[toolId];
  if (!profiel || !hourly?.time?.length) return null;

  const basis = bouwBasis(hourly);
  const perDag = basisPerDag(basis, 0, 24);
  const dagen = [...perDag.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
  const dag = dagen[dagIndex];
  if (!dag) return null;
  let uren = dag[1];

  // Als er een venster is, wegen we de factoren over dat blok: dat is
  // waar de gebruiker daadwerkelijk buiten is.
  if (venster && Number.isFinite(venster.van) && Number.isFinite(venster.tot)) {
    const inBlok = uren.filter((u) => u.uur >= venster.van && u.uur < venster.tot);
    if (inBlok.length) uren = inBlok;
  } else {
    // Anders de daglichturen, niet de nacht.
    const overdag = uren.filter((u) => u.dag);
    if (overdag.length) uren = overdag;
  }

  const factoren = profiel.factoren
    .map((f) => ({ id: f.id, gewicht: f.gewicht, score: Math.round(f.score(uren) ?? 0) }))
    .filter((f) => Number.isFinite(f.score));

  return factoren.length ? { factoren } : null;
}
