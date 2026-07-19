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
import { hardloopweer } from "./hardloopweer.js";
import { wielrennen } from "./wielrennen.js";
import { strandweer } from "./strandweer.js";
import { autoWassen } from "./auto-wassen.js";
import { krabben } from "./krabben.js";
import { gladheid } from "./gladheid.js";
import { wandelen } from "./wandelen.js";
import { buitenSporten } from "./buiten-sporten.js";
import { padelOfTennis } from "./padel-of-tennis.js";
import { suppenOfKajakken } from "./suppen-of-kajakken.js";
import { picknickweer } from "./picknickweer.js";
import { buitenZwemmen } from "./buiten-zwemmen.js";
import { sterrenkijken } from "./sterrenkijken.js";
import { grasmaaien } from "./grasmaaien.js";
import { snoeien } from "./snoeien.js";
import { onkruid } from "./onkruid.js";
import { waterGeven } from "./water-geven.js";
import { grasZaaien } from "./gras-zaaien.js";
import { golfen } from "./golfen.js";
import { skeeleren } from "./skeeleren.js";
import { motorrijden } from "./motorrijden.js";
import { hondUitlaten } from "./hond-uitlaten.js";
import { vliegeren } from "./vliegeren.js";
import { vuurkorf } from "./vuurkorf.js";
import { droneVliegen } from "./drone-vliegen.js";
import { paardrijden } from "./paardrijden.js";
import { vissen } from "./vissen.js";
import { schaatsen } from "./schaatsen.js";
import { mist } from "./mist.js";
import { storm } from "./storm.js";
import { houtkachel } from "./houtkachel.js";
import { huisKoelen } from "./huis-koelen.js";
import { kamperen } from "./kamperen.js";
import { ramenWassen } from "./ramen-wassen.js";
import { zonnepanelen } from "./zonnepanelen.js";
import { CATEGORIEEN } from "../categorieen.js";
import { wasBuitenDrogen } from "./was-buiten-drogen.js";
import { kleding } from "./kleding.js";
import { terras } from "./terras.js";
import { barbecue } from "./barbecue.js";
import { zonkracht } from "./zonkracht.js";
import { hooikoorts } from "./hooikoorts.js";
import { regenTiming } from "./regen-timing.js";
import { paraplu } from "./paraplu.js";
// v3.30.0 "Mistral": huis/tuinonderhoud + winter
import { buitenSchilderen } from "./buiten-schilderen.js";
import { houtBehandelen } from "./hout-behandelen.js";
import { terrasReinigen } from "./terras-reinigen.js";
import { plantenBeschermen } from "./planten-beschermen.js";
import { sneeuwpret } from "./sneeuwpret.js";
import { strooien } from "./strooien.js";
import { VARIANTEN, maakPseudoTool } from "../varianten.js";

export const TOOLS = [
  // Sport
  fietsNaarWerk,
  hardloopweer,
  wielrennen,
  wandelen,
  buitenSporten,
  padelOfTennis,
  // Huis en tuin
  wasBuitenDrogen,
  autoWassen,
  grasmaaien,
  snoeien,
  onkruid,
  waterGeven,
  grasZaaien,
  golfen,
  skeeleren,
  motorrijden,
  hondUitlaten,
  vliegeren,
  vuurkorf,
  droneVliegen,
  paardrijden,
  vissen,
  schaatsen,
  mist,
  storm,
  houtkachel,
  huisKoelen,
  kamperen,
  ramenWassen,
  zonnepanelen,
  buitenSchilderen,
  houtBehandelen,
  terrasReinigen,
  plantenBeschermen,
  // Kleding
  kleding,
  // Buiten
  terras,
  barbecue,
  strandweer,
  picknickweer,
  buitenZwemmen,
  suppenOfKajakken,
  sterrenkijken,
  // Zon en gezondheid
  zonkracht,
  hooikoorts,
  // Regen
  regenTiming,
  paraplu,
  // Winter
  krabben,
  gladheid,
  sneeuwpret,
  strooien,
];

export function vindTool(slug) {
  const direct = TOOLS.find((t) => t.slug === slug);
  if (direct) return direct;
  // Vraagpagina's (varianten) verschijnen op /slug als pseudo-tool op
  // hun oudertool: eigen slug, titel en content, gedeelde engine.
  const variant = VARIANTEN.find((v) => v.slug === slug);
  if (variant) {
    const ouder = TOOLS.find((t) => t.id === variant.ouderId);
    if (ouder) return maakPseudoTool(variant, ouder);
  }
  return null;
}

/** Alle slugs die als /slug-pagina bestaan: tools plus varianten. */
export function alleToolSlugs() {
  return [...TOOLS.map((t) => t.slug), ...VARIANTEN.map((v) => v.slug)];
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
  const iconen = new Map();
  const catKleuren = new Map();
  for (const c of CATEGORIEEN) {
    if (catKleuren.has(c.kleur)) {
      fouten.push(`categorie ${c.id}: kleur ${c.kleur} wordt al gebruikt door ${catKleuren.get(c.kleur)} (elke categorie een eigen kleur)`);
    }
    catKleuren.set(c.kleur, c.id);
  }
  const slugs = new Set();
  const categorieIds = new Set(CATEGORIEEN.map((c) => c.id));
  const VERPLICHT = ["id", "slug", "naam", "korteVraag", "patroon", "inputType", "adviesLabels", "cta", "navLabel", "kleur", "schaalLabels", "categorieId"];
  for (const t of tools) {
    for (const v of VERPLICHT) {
      if (!t[v]) fouten.push(`${t.id ?? "?"}: veld ${v} ontbreekt`);
    }
    if (slugs.has(t.slug)) fouten.push(`dubbele slug: ${t.slug}`);
    slugs.add(t.slug);
    if (!["A", "B"].includes(t.patroon)) fouten.push(`${t.id}: onbekend patroon`);
    if (!["route", "locatie"].includes(t.inputType)) fouten.push(`${t.id}: onbekend inputType`);
    if (t.categorieId && !categorieIds.has(t.categorieId)) {
      fouten.push(`${t.id}: categorieId ${t.categorieId} bestaat niet in CATEGORIEEN`);
    }
    const cat = CATEGORIEEN.find((c) => c.id === t.categorieId);
    if (cat && t.kleur !== cat.kleur) {
      fouten.push(`${t.id}: kleur ${t.kleur} wijkt af van categorie-kleur ${cat.kleur} (een accentkleur per categorie)`);
    }
    if (iconen.has(t.icoon)) {
      fouten.push(`${t.id}: icoon ${t.icoon} wordt al gebruikt door ${iconen.get(t.icoon)} (elke tool een eigen icoon)`);
    }
    iconen.set(t.icoon, t.id);
    for (const k of ["goed", "matig", "slecht"]) {
      if (!t.adviesLabels?.[k]) fouten.push(`${t.id}: adviesLabel ${k} ontbreekt`);
    }
    for (const s of ["ideaal", "goed", "twijfelachtig", "matig", "zeer-slecht"]) {
      if (!t.schaalLabels?.[s]) fouten.push(`${t.id}: schaalLabel ${s} ontbreekt`);
    }
  }
  return fouten;
}

/** Alle tools (geen varianten) die tot een categorie horen. */
export function toolsInCategorie(categorieId) {
  return TOOLS.filter((t) => t.categorieId === categorieId);
}

/**
 * De meest gebruikte checks, bovenaan het menu als Populair-blok
 * (feedbackronde juli 2026): kleding, paraplu en de fietscheck.
 */
// Maximaal zes (wens Martijn, juli 2026): de homepage en het menu tonen
// deze selectie onder "Populaire checks"; alle-checks is het volledige
// overzicht.
export const POPULAIRE_TOOL_IDS = ["wat-trek-ik-aan", "paraplu", "fiets-naar-werk", "terras", "was-buiten-drogen", "zonkracht"];
