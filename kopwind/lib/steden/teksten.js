/**
 * lib/steden/teksten.js
 *
 * Per-stad tekstvariatie voor de programmatische pagina's. Geen dunne
 * doorway-pagina's: de tekst is gebouwd uit echte stadseigenschappen
 * (ligging, provincie, buursteden, afstand tot de kust), niet dezelfde
 * alinea met alleen de stadsnaam vervangen.
 */

import { STEDEN } from "./nl.js";
import { haversine, bearing } from "../engine/wind.js";
import { kompas } from "../format.js";

const LIGGING_FIETS = {
  kust: (s) =>
    `${s.naam} ligt dicht bij de Noordzee: de overheersende zuidwestenwind komt hier vrijwel ongeremd binnen, dus op ritten richting zee of langs open water telt de windrichting extra zwaar.`,
  rivier: (s) =>
    `In ${s.naam} vang je op de bruggen en langs de rivier de meeste wind: open water remt niets af, en juist die stukken kleuren op de kaart vaak amber of rood.`,
  veluwe: (s) =>
    `Rond ${s.naam} geeft het bos van de Veluwe op veel routes luwte; fiets je de open kant op, dan verandert dezelfde windkracht ineens in stevige tegenwind.`,
  heuvels: (s) =>
    `${s.naam} is een van de weinige plekken in Nederland waar hoogte meetelt; deze check rekent vlak, dus tel bij klimritten zelf wat extra zwaarte op bij het cijfer.`,
  polder: (s) =>
    `${s.naam} ligt in open polderland: weinig beschutting, dus het verschil tussen wind mee en wind tegen is hier groter dan gemiddeld. Vertrektijd kiezen loont.`,
  binnenland: (s) =>
    `${s.naam} ligt beschut in het binnenland, maar de zuidwestenwind blijft de baas: op noordoost-zuidwest-routes maakt de rijrichting het verschil tussen een 8 en een 5.`,
};

const LIGGING_WAS = {
  kust: (s) =>
    `Aan de kust bij ${s.naam} droogt de was snel zodra het droog is: er staat bijna altijd wind. Let vooral op de buien die vanaf zee binnenkomen.`,
  rivier: (s) =>
    `Langs het water in ${s.naam} is de lucht 's ochtends vaak vochtiger; het droogvenster begint hier meestal wat later op de dag.`,
  veluwe: (s) =>
    `In de luwte rond ${s.naam} waait het minder; de was droogt er vooral op temperatuur en lage luchtvochtigheid, dus de middaguren zijn je vriend.`,
  heuvels: (s) =>
    `In ${s.naam} kan het weer per dal verschillen; de check rekent met het dichtstbijzijnde weermodelpunt, dus kijk vooral naar het uurvenster.`,
  polder: (s) =>
    `In het open land rond ${s.naam} is wind de grote droger: zelfs bij hogere luchtvochtigheid krijgt de was er flink wat lucht.`,
  binnenland: (s) =>
    `In ${s.naam} bepalen luchtvochtigheid en temperatuur het tempo; op windstille dagen duurt drogen er merkbaar langer dan de kaart doet vermoeden.`,
};

export function buurSteden(stad, n = 4) {
  return STEDEN.filter((s) => s.slug !== stad.slug)
    .map((s) => ({ ...s, afstand: haversine([stad.lat, stad.lon], [s.lat, s.lon]) }))
    .sort((a, b) => a.afstand - b.afstand)
    .slice(0, n);
}

export function stadTekst(toolId, stad) {
  const buren = buurSteden(stad, 3)
    .map((b) => b.naam)
    .join(", ");
  const basis =
    toolId === "fiets-naar-werk"
      ? LIGGING_FIETS[stad.ligging](stad)
      : LIGGING_WAS[stad.ligging](stad);
  const context =
    toolId === "fiets-naar-werk"
      ? `De check hieronder staat al ingesteld op ${stad.naam} (${stad.provincie}): vul je werkadres aan en je ziet per stuk route hoeveel wind je tegen hebt, met een rapportcijfer per rit. Vergelijkbare checks zijn er voor ${buren}.`
      : `De check hieronder staat al op ${stad.naam} (${stad.provincie}): je ziet direct het droogvenster van vandaag en de komende dagen. Ook beschikbaar voor ${buren}.`;
  return [basis, context];
}

/** Route-paar tekst: afstand plus overheersende windrichting op de as. */
export function paarTekst(van, naar) {
  const meters = haversine([van.lat, van.lon], [naar.lat, naar.lon]);
  const km = Math.round(meters / 1000);
  const richting = kompas(bearing([van.lat, van.lon], [naar.lat, naar.lon]));
  const zw = ["ZW", "WZW", "ZZW", "W", "Z"].includes(richting);
  const windzin = zw
    ? `Je fietst overwegend richting het ${richting.toLowerCase()}en, dus met de gebruikelijke zuidwestenwind heb je op de heenweg vaak wind tegen en op de terugweg mee.`
    : `Je fietst overwegend richting het ${richting.toLowerCase()}en; met de gebruikelijke zuidwestenwind valt de heenweg dan vaak mee en is de terugweg het zwaarst.`;
  return [
    `Hemelsbreed is ${van.naam} naar ${naar.naam} ongeveer ${km} km; over de fietsroute komt daar meestal 10 tot 25 procent bij. ${windzin}`,
    `De check hieronder staat al ingesteld van ${van.naam}-centrum naar ${naar.naam}-centrum. Pas de adressen aan naar je eigen vertrek- en aankomstpunt voor het echte plaatje, inclusief alternatieve routes met minder tegenwind.`,
  ];
}
