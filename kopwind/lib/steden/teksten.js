/**
 * lib/steden/teksten.js
 *
 * Per-stad tekstvariatie voor de programmatische pagina's. Geen dunne
 * doorway-pagina's: de tekst is gebouwd uit echte stadseigenschappen
 * (ligging, provincie, buursteden, afstand tot de kust), niet dezelfde
 * alinea met alleen de stadsnaam vervangen.
 *
 * Herbouwd in v3.27.0 "Solano" (audit plus akkoord eigenaar): het oude
 * bestand kende maar twee smaken (fiets en was) waardoor alle 22
 * andere tools de wastekst droegen ("het droogvenster van vandaag" op
 * de hardlooppagina), en het was NL-only waardoor de Engelse
 * stadpagina's Nederlandse tekst toonden. Nu: drie smaken (fiets, was,
 * algemeen weerkarakter) en alles tweetalig via kies().
 */

import { STEDEN } from "./nl.js";
import { haversine, bearing } from "../engine/wind.js";
import { kompas } from "../format.js";
import { kies } from "../i18n/locale.js";

const LIGGING_FIETS = {
  kust: kies({
    nl: (s) => `${s.naam} ligt dicht bij de Noordzee: de overheersende zuidwestenwind komt hier vrijwel ongeremd binnen, dus op ritten richting zee of langs open water telt de windrichting extra zwaar.`,
    en: (s) => `${s.naam} sits close to the North Sea: the prevailing southwesterly arrives here nearly unchecked, so on rides towards the coast or along open water the wind direction weighs extra heavy.`,
  }),
  rivier: kies({
    nl: (s) => `In ${s.naam} vang je op de bruggen en langs de rivier de meeste wind: open water remt niets af, en juist die stukken kleuren op de kaart vaak amber of rood.`,
    en: (s) => `In ${s.naam} the bridges and riverside catch the most wind: open water slows nothing down, and exactly those stretches often colour amber or red on the map.`,
  }),
  veluwe: kies({
    nl: (s) => `Rond ${s.naam} geeft het bos van de Veluwe op veel routes luwte; fiets je de open kant op, dan verandert dezelfde windkracht ineens in stevige tegenwind.`,
    en: (s) => `Around ${s.naam} the Veluwe woods shelter many routes; head out on the open side and the same wind force suddenly turns into a proper headwind.`,
  }),
  heuvels: kies({
    nl: (s) => `${s.naam} is een van de weinige plekken in Nederland waar hoogte meetelt; deze check rekent vlak, dus tel bij klimritten zelf wat extra zwaarte op bij het cijfer.`,
    en: (s) => `${s.naam} is one of the few places in the Netherlands where elevation matters; this check assumes flat roads, so add some extra effort to the score on climbing rides.`,
  }),
  polder: kies({
    nl: (s) => `${s.naam} ligt in open polderland: weinig beschutting, dus het verschil tussen wind mee en wind tegen is hier groter dan gemiddeld. Vertrektijd kiezen loont.`,
    en: (s) => `${s.naam} lies in open polder country: little shelter, so the gap between tailwind and headwind is bigger than average here. Picking your departure time pays off.`,
  }),
  binnenland: kies({
    nl: (s) => `${s.naam} ligt beschut in het binnenland, maar de zuidwestenwind blijft de baas: op noordoost-zuidwest-routes maakt de rijrichting het verschil tussen een 8 en een 5.`,
    en: (s) => `${s.naam} sits sheltered inland, but the southwesterly still rules: on northeast-southwest routes the riding direction makes the difference between an 8 and a 5.`,
  }),
};

const LIGGING_WAS = {
  kust: kies({
    nl: (s) => `Aan de kust bij ${s.naam} droogt de was snel zodra het droog is: er staat bijna altijd wind. Let vooral op de buien die vanaf zee binnenkomen.`,
    en: (s) => `On the coast near ${s.naam} laundry dries fast once the rain stays away: there is nearly always wind. Watch for the showers rolling in from the sea.`,
  }),
  rivier: kies({
    nl: (s) => `Langs het water in ${s.naam} is de lucht 's ochtends vaak vochtiger; het droogvenster begint hier meestal wat later op de dag.`,
    en: (s) => `Along the water in ${s.naam} the morning air is often more humid; the drying window here usually starts a little later in the day.`,
  }),
  veluwe: kies({
    nl: (s) => `In de luwte rond ${s.naam} waait het minder; de was droogt er vooral op temperatuur en lage luchtvochtigheid, dus de middaguren zijn je vriend.`,
    en: (s) => `In the shelter around ${s.naam} there is less wind; laundry dries mostly on temperature and low humidity, so the afternoon hours are your friend.`,
  }),
  heuvels: kies({
    nl: (s) => `In ${s.naam} kan het weer per dal verschillen; de check rekent met het dichtstbijzijnde weermodelpunt, dus kijk vooral naar het uurvenster.`,
    en: (s) => `In ${s.naam} the weather can differ per valley; the check uses the nearest weather model point, so pay most attention to the hourly window.`,
  }),
  polder: kies({
    nl: (s) => `In het open land rond ${s.naam} is wind de grote droger: zelfs bij hogere luchtvochtigheid krijgt de was er flink wat lucht.`,
    en: (s) => `In the open country around ${s.naam} wind is the big dryer: even with higher humidity the laundry gets plenty of air.`,
  }),
  binnenland: kies({
    nl: (s) => `In ${s.naam} bepalen luchtvochtigheid en temperatuur het tempo; op windstille dagen duurt drogen er merkbaar langer dan de kaart doet vermoeden.`,
    en: (s) => `In ${s.naam} humidity and temperature set the pace; on still days drying takes noticeably longer than the map suggests.`,
  }),
};

/**
 * Tool-neutrale weerkarakter-teksten (v3.27.0): voor alle checks
 * zonder eigen smaak. Beschrijven wat de ligging met het weer doet,
 * zonder was- of fietsaannames.
 */
const LIGGING_ALGEMEEN = {
  kust: kies({
    nl: (s) => `${s.naam} ligt dicht bij zee: het waait er vaker en harder dan landinwaarts, buien komen van zee snel binnen, en de zeewind houdt zomerse middagen net wat koeler.`,
    en: (s) => `${s.naam} sits close to the sea: it is windier than inland, showers roll in quickly off the water, and the sea breeze keeps summer afternoons a touch cooler.`,
  }),
  rivier: kies({
    nl: (s) => `Bij het open water van ${s.naam} is de ochtendlucht vaak wat vochtiger en staat er langs de rivier meer wind dan in de beschutte straten erachter.`,
    en: (s) => `Near the open water of ${s.naam} the morning air is often a little more humid, and the riverside carries more wind than the sheltered streets behind it.`,
  }),
  veluwe: kies({
    nl: (s) => `Rond ${s.naam} dempt het bos van de Veluwe de wind merkbaar; nachten koelen er sneller af, dus het gevoelsverschil tussen ochtend en middag is hier groter dan gemiddeld.`,
    en: (s) => `Around ${s.naam} the Veluwe woods noticeably damp the wind; nights cool faster, so the feel gap between morning and afternoon is bigger than average here.`,
  }),
  heuvels: kies({
    nl: (s) => `In het heuvelland rond ${s.naam} kan het weer per dal verschillen; de check rekent met het dichtstbijzijnde weermodelpunt, dus het uurbeeld is leidend.`,
    en: (s) => `In the hills around ${s.naam} the weather can differ per valley; the check uses the nearest weather model point, so the hourly picture leads.`,
  }),
  polder: kies({
    nl: (s) => `${s.naam} ligt in open polderland: de wind krijgt er vrij spel en het gevoel ligt op winderige dagen merkbaar onder de thermometer.`,
    en: (s) => `${s.naam} lies in open polder country: the wind has free rein and on blustery days it feels noticeably colder than the thermometer says.`,
  }),
  binnenland: kies({
    nl: (s) => `${s.naam} ligt beschut in het binnenland: extremen zijn er milder, maar warme zomerdagen houden er 's avonds langer aan dan aan de kust.`,
    en: (s) => `${s.naam} sits sheltered inland: extremes are milder, but warm summer days linger into the evening longer than on the coast.`,
  }),
};

const CONTEXT = {
  fiets: kies({
    nl: (stad, buren) => `De check hieronder staat al ingesteld op ${stad.naam} (${stad.provincie}): vul je werkadres aan en je ziet per stuk route hoeveel wind je tegen hebt, met een rapportcijfer per rit. Vergelijkbare checks zijn er voor ${buren}.`,
    en: (stad, buren) => `The check below is already set to ${stad.naam} (${stad.provincie}): add your work address and you'll see the headwind per stretch of route, with a score per leg. Similar checks exist for ${buren}.`,
  }),
  was: kies({
    nl: (stad, buren) => `De check hieronder staat al op ${stad.naam} (${stad.provincie}): je ziet direct het droogvenster van vandaag en de komende dagen. Ook beschikbaar voor ${buren}.`,
    en: (stad, buren) => `The check below is already set to ${stad.naam} (${stad.provincie}): you'll instantly see today's drying window and the days ahead. Also available for ${buren}.`,
  }),
  algemeen: kies({
    nl: (stad, buren) => `De check hieronder staat al op ${stad.naam} (${stad.provincie}): je ziet direct het antwoord voor vandaag en de dagen erna, met het beste moment en de reden. Ook beschikbaar voor ${buren}.`,
    en: (stad, buren) => `The check below is already set to ${stad.naam} (${stad.provincie}): you'll instantly see the answer for today and the days ahead, with the best moment and the reason. Also available for ${buren}.`,
  }),
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
  const smaak =
    toolId === "fiets-naar-werk" ? "fiets" : toolId === "was-buiten-drogen" ? "was" : "algemeen";
  const liggingSet =
    smaak === "fiets" ? LIGGING_FIETS : smaak === "was" ? LIGGING_WAS : LIGGING_ALGEMEEN;
  const basis = liggingSet[stad.ligging](stad);
  const context = CONTEXT[smaak](stad, buren);
  return [basis, context];
}

/**
 * Route-paar tekst: afstand plus overheersende windrichting op de as.
 * Bewust NL-only: het van/naar-cluster bestaat alleen op de
 * Nederlandse site (zie BACKLOG, EN bijtrekken).
 */
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
