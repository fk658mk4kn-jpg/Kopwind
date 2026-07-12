/**
 * lib/tools/index.js
 *
 * HET REGISTER: single source of truth voor alle tools. Een nieuwe tool
 * toevoegen = een configuratiebestand schrijven en hier registreren; de
 * pagina's, sitemap, meldingen en hub volgen automatisch.
 *
 * Roadmap-stubs (bewust niet gebouwd, wel gereserveerd):
 *
 * PATROON B (vergelijk locaties): "Welke stad heeft vandaag het beste
 * terrasweer?" De engine haalt weer op voor een set steden (lib/steden),
 * scoort elke stad met dezelfde scoreConfig als een patroon-A-tool en
 * toont een rangschikking als lijst plus kaart. Vereist alleen: patroon
 * 'B' in de config, een rangschik-pagina-variant in app/[tool], en
 * batching in de weer-adapter. Geen enginewijziging.
 *
 * PATROON C (externe, niet-weer databron): "Vandaag voetbal?" Verdict op
 * basis van wedstrijd-fixtures en tv-zender. De adapter-vorm is er al
 * (lib/engine/weather.js is de eerste adapter; een fixtures-adapter komt
 * ernaast met dezelfde interface: haal(bron, params) -> data). NIET
 * bouwen voordat een legale, houdbare databron gevalideerd is: fixtures
 * zijn er via gratis sport-API's met limieten, maar "op welke zender" is
 * het licentiegevoelige stuk. Genoteerd in het logboek als geplande
 * pijler.
 */

import { fietsNaarWerk } from "./fiets-naar-werk.js";
import { wasBuitenDrogen } from "./was-buiten-drogen.js";

export const TOOLS = [fietsNaarWerk, wasBuitenDrogen];

export function vindTool(slug) {
  return TOOLS.find((t) => t.slug === slug) ?? null;
}

export function vindToolOpId(id) {
  return TOOLS.find((t) => t.id === id) ?? null;
}

/** Instellingen-metadata en defaults van een tool. */
export function instellingenVoor(toolId) {
  return vindToolOpId(toolId)?.instellingen ?? null;
}

export function defaultsVoor(toolId) {
  return instellingenVoor(toolId)?.defaults ?? {};
}

/**
 * Migreert het oude platte drempelobject (alleen fiets) naar het per-tool
 * formaat { toolId: { ... } }. Per-tool objecten gaan er ongewijzigd door.
 */
export function migreerThresholds(oud) {
  if (!oud || typeof oud !== "object") return {};
  if (TOOLS.some((t) => oud[t.id])) return oud;
  if ("tegenwindMatig" in oud || "segmentLengte" in oud) {
    return { "fiets-naar-werk": { ...oud } };
  }
  return {};
}

/** Validatie voor de registertest: elk verplicht veld aanwezig en uniek. */
export function valideerRegister(tools = TOOLS) {
  const fouten = [];
  const slugs = new Set();
  const VERPLICHT = ["id", "slug", "naam", "korteVraag", "patroon", "inputType", "adviesLabels"];
  for (const t of tools) {
    for (const v of VERPLICHT) {
      if (!t[v]) fouten.push(`${t.id ?? "?"}: veld ${v} ontbreekt`);
    }
    if (slugs.has(t.slug)) fouten.push(`dubbele slug: ${t.slug}`);
    slugs.add(t.slug);
    if (!["A", "B"].includes(t.patroon)) fouten.push(`${t.id}: onbekend patroon`);
    if (!["route", "locatie"].includes(t.inputType)) fouten.push(`${t.id}: onbekend inputType`);
    for (const k of ["goed", "matig", "slecht"]) {
      if (!t.adviesLabels?.[k]) fouten.push(`${t.id}: adviesLabel ${k} ontbreekt`);
    }
  }
  return fouten;
}
