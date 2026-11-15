/**
 * lib/aftellen/index.js
 *
 * Register van alle aftelpagina's (v3.35.0 "Bise"). Elke teller is een
 * eigen pagina op de root, net als de checks. Vier soorten:
 *
 *   datum     vaste of berekende dag (kerst, Pasen, Koningsdag, seizoenen)
 *   vakantie  schoolvakantie met een teller per regio
 *   weekend   live klok naar vrijdagmiddag
 *   zon       live zonsondergang en daglengte op jouw plek
 *   droog     live neerslagteller (15-minutendata)
 *
 * `weer: true` zet de weervooruitblik aan zodra de dag binnen het bereik
 * van de verwachting valt. `tool` koppelt aan een passende check.
 */

import {
  ymd, pasen, koningsdag, nteWeekdag, plusDagen, seizoenDatum, seizoenTijdstip,
  vandaag, vergelijk, dagenTussen, uitSleutel, amsterdamTijdstip, werkdagenTot,
} from "./datums.js";
import { fasenInJaar } from "../maan.js";
import { VAKANTIE_DATA, REGIO_NAAM } from "./vakanties.js";

const vast = (m, d) => (j) => [{ start: ymd(j, m, d) }];

export const AFTELLERS = [
  /* -------------------------------- feestdagen ------------------- */
  { id: "kerst", slug: "hoeveel-dagen-tot-kerst", naam: "kerst", titel: "Kerst", groep: "feest", soort: "datum", weer: true, tool: "wandelen", momenten: vast(12, 25), verwant: ["witte-kerst", "oud-en-nieuw", "kerstvakantie"] },
  { id: "witte-kerst", slug: "wordt-het-een-witte-kerst", naam: "kerst", titel: "Witte kerst", groep: "feest", soort: "datum", weer: true, sneeuw: true, tool: "sneeuw", vraag: "Wordt het een witte kerst?", momenten: (j) => [{ start: ymd(j, 12, 25), eind: ymd(j, 12, 26) }], verwant: ["kerst", "kerstvakantie", "winter"] },
  { id: "oud-en-nieuw", slug: "hoeveel-dagen-tot-oud-en-nieuw", naam: "oud en nieuw", titel: "Oud en nieuw", groep: "feest", soort: "datum", weer: true, tool: "storm", tijdDoel: { dagPlus: 1, u: 0, label: "middernacht" }, momenten: vast(12, 31), verwant: ["kerst", "kerstvakantie", "winter"] },
  { id: "sinterklaas", slug: "hoeveel-dagen-tot-sinterklaas", naam: "pakjesavond", titel: "Sinterklaas", groep: "feest", soort: "datum", weer: false, momenten: vast(12, 5), verwant: ["kerst", "black-friday", "oud-en-nieuw"] },
  { id: "koningsdag", slug: "hoeveel-dagen-tot-koningsdag", naam: "Koningsdag", titel: "Koningsdag", groep: "feest", soort: "datum", weer: true, tool: "terras", momenten: (j) => [{ start: koningsdag(j) }], verwant: ["bevrijdingsdag", "meivakantie", "pasen"] },
  { id: "bevrijdingsdag", slug: "hoeveel-dagen-tot-bevrijdingsdag", naam: "Bevrijdingsdag", titel: "Bevrijdingsdag", groep: "feest", soort: "datum", weer: true, tool: "terras", momenten: vast(5, 5), verwant: ["koningsdag", "hemelvaart", "meivakantie"] },
  { id: "pasen", slug: "hoeveel-dagen-tot-pasen", naam: "Pasen", titel: "Pasen", groep: "feest", soort: "datum", weer: true, tool: "wandelen", momenten: (j) => [{ start: pasen(j) }], verwant: ["carnaval", "koningsdag", "hemelvaart"] },
  { id: "hemelvaart", slug: "hoeveel-dagen-tot-hemelvaart", naam: "Hemelvaartsdag", titel: "Hemelvaart", groep: "feest", soort: "datum", weer: true, tool: "fiets-naar-werk", momenten: (j) => [{ start: plusDagen(pasen(j), 39) }], verwant: ["pinksteren", "pasen", "bevrijdingsdag"] },
  { id: "pinksteren", slug: "hoeveel-dagen-tot-pinksteren", naam: "Pinksteren", titel: "Pinksteren", groep: "feest", soort: "datum", weer: true, tool: "barbecue", momenten: (j) => [{ start: plusDagen(pasen(j), 49) }], verwant: ["hemelvaart", "vaderdag", "zomer"] },
  { id: "carnaval", slug: "hoeveel-dagen-tot-carnaval", naam: "carnaval", titel: "Carnaval", groep: "feest", soort: "datum", weer: true, tool: "wat-trek-ik-aan", momenten: (j) => [{ start: plusDagen(pasen(j), -49), eind: plusDagen(pasen(j), -47) }], verwant: ["voorjaarsvakantie", "valentijnsdag", "pasen"] },
  { id: "valentijnsdag", slug: "hoeveel-dagen-tot-valentijnsdag", naam: "Valentijnsdag", titel: "Valentijnsdag", groep: "feest", soort: "datum", weer: false, momenten: vast(2, 14), verwant: ["carnaval", "voorjaarsvakantie", "moederdag"] },
  { id: "moederdag", slug: "hoeveel-dagen-tot-moederdag", naam: "Moederdag", titel: "Moederdag", groep: "feest", soort: "datum", weer: true, tool: "terras", momenten: (j) => [{ start: nteWeekdag(j, 5, 0, 2) }], verwant: ["vaderdag", "koningsdag", "hemelvaart"] },
  { id: "vaderdag", slug: "hoeveel-dagen-tot-vaderdag", naam: "Vaderdag", titel: "Vaderdag", groep: "feest", soort: "datum", weer: true, tool: "barbecue", momenten: (j) => [{ start: nteWeekdag(j, 6, 0, 3) }], verwant: ["moederdag", "pinksteren", "zomer"] },
  { id: "halloween", slug: "hoeveel-dagen-tot-halloween", naam: "Halloween", titel: "Halloween", groep: "feest", soort: "datum", weer: true, tool: "paraplu", momenten: vast(10, 31), verwant: ["herfstvakantie", "klok-achteruit", "sinterklaas"] },
  { id: "black-friday", slug: "hoeveel-dagen-tot-black-friday", naam: "Black Friday", titel: "Black Friday", groep: "feest", soort: "datum", weer: false, momenten: (j) => [{ start: plusDagen(nteWeekdag(j, 11, 4, 4), 1) }], verwant: ["sinterklaas", "kerst", "weekend"] },
  { id: "prinsjesdag", slug: "hoeveel-dagen-tot-prinsjesdag", naam: "Prinsjesdag", titel: "Prinsjesdag", groep: "feest", soort: "datum", weer: true, tool: "paraplu", momenten: (j) => [{ start: nteWeekdag(j, 9, 2, 3) }], verwant: ["herfst", "herfstvakantie", "koningsdag"] },

  /* -------------------------------- schoolvakanties -------------- */
  { id: "zomervakantie", slug: "hoeveel-dagen-tot-de-zomervakantie", naam: "de zomervakantie", titel: "Zomervakantie", groep: "vakantie", soort: "vakantie", vakantie: "zomer", weer: true, tool: "strandweer", verwant: ["zomer", "meivakantie", "langste-dag"] },
  { id: "herfstvakantie", slug: "hoeveel-dagen-tot-de-herfstvakantie", naam: "de herfstvakantie", titel: "Herfstvakantie", groep: "vakantie", soort: "vakantie", vakantie: "herfst", weer: true, tool: "wandelen", verwant: ["herfst", "halloween", "klok-achteruit"] },
  { id: "kerstvakantie", slug: "hoeveel-dagen-tot-de-kerstvakantie", naam: "de kerstvakantie", titel: "Kerstvakantie", groep: "vakantie", soort: "vakantie", vakantie: "kerst", weer: true, tool: "schaatsen", verwant: ["kerst", "oud-en-nieuw", "voorjaarsvakantie"] },
  { id: "voorjaarsvakantie", slug: "hoeveel-dagen-tot-de-voorjaarsvakantie", naam: "de voorjaarsvakantie", titel: "Voorjaarsvakantie", groep: "vakantie", soort: "vakantie", vakantie: "voorjaar", weer: true, tool: "sneeuwpret", verwant: ["carnaval", "lente", "meivakantie"] },
  { id: "meivakantie", slug: "hoeveel-dagen-tot-de-meivakantie", naam: "de meivakantie", titel: "Meivakantie", groep: "vakantie", soort: "vakantie", vakantie: "mei", weer: true, tool: "terras", verwant: ["koningsdag", "bevrijdingsdag", "zomervakantie"] },

  /* -------------------------------- seizoenen en klok ------------ */
  { id: "lente", slug: "hoeveel-dagen-tot-de-lente", naam: "de lente", titel: "Lente", groep: "seizoen", soort: "datum", weer: true, tool: "terras", seizoen: "lente", momenten: (j) => [{ start: seizoenDatum("lente", j), tijdstip: seizoenTijdstip("lente", j) }], verwant: ["klok-vooruit", "zomer", "voorjaarsvakantie"] },
  { id: "zomer", slug: "hoeveel-dagen-tot-de-zomer", naam: "de zomer", titel: "Zomer", groep: "seizoen", soort: "datum", weer: true, tool: "strandweer", seizoen: "zomer", momenten: (j) => [{ start: seizoenDatum("zomer", j), tijdstip: seizoenTijdstip("zomer", j) }], verwant: ["langste-dag", "zomervakantie", "lente"] },
  { id: "herfst", slug: "hoeveel-dagen-tot-de-herfst", naam: "de herfst", titel: "Herfst", groep: "seizoen", soort: "datum", weer: true, tool: "storm", seizoen: "herfst", momenten: (j) => [{ start: seizoenDatum("herfst", j), tijdstip: seizoenTijdstip("herfst", j) }], verwant: ["klok-achteruit", "herfstvakantie", "winter"] },
  { id: "winter", slug: "hoeveel-dagen-tot-de-winter", naam: "de winter", titel: "Winter", groep: "seizoen", soort: "datum", weer: true, tool: "gladheid", seizoen: "winter", momenten: (j) => [{ start: seizoenDatum("winter", j), tijdstip: seizoenTijdstip("winter", j) }], verwant: ["kortste-dag", "kerst", "herfst"] },
  { id: "klok-vooruit", slug: "wanneer-gaat-de-klok-vooruit", naam: "de zomertijd", titel: "Zomertijd", groep: "seizoen", soort: "datum", weer: false, tijdDoel: { dagPlus: 0, u: 2, label: "02:00 uur" }, vraag: "Wanneer gaat de klok vooruit?", momenten: (j) => [{ start: nteWeekdag(j, 3, 0, -1) }], verwant: ["klok-achteruit", "lente", "langste-dag"] },
  { id: "klok-achteruit", slug: "wanneer-gaat-de-klok-achteruit", naam: "de wintertijd", titel: "Wintertijd", groep: "seizoen", soort: "datum", weer: false, tijdDoel: { dagPlus: 0, u: 3, label: "03:00 uur" }, vraag: "Wanneer gaat de klok achteruit?", momenten: (j) => [{ start: nteWeekdag(j, 10, 0, -1) }], verwant: ["klok-vooruit", "herfst", "kortste-dag"] },
  { id: "langste-dag", slug: "wanneer-is-de-langste-dag", naam: "de langste dag", titel: "Langste dag", groep: "seizoen", soort: "datum", weer: true, tool: "zonkracht", vraag: "Wanneer is de langste dag van het jaar?", daglicht: true, momenten: (j) => [{ start: seizoenDatum("zomer", j) }], verwant: ["kortste-dag", "zomer", "zonsondergang"] },
  { id: "kortste-dag", slug: "wanneer-is-de-kortste-dag", naam: "de kortste dag", titel: "Kortste dag", groep: "seizoen", soort: "datum", weer: true, tool: "gladheid", vraag: "Wanneer is de kortste dag van het jaar?", daglicht: true, momenten: (j) => [{ start: seizoenDatum("winter", j) }], verwant: ["langste-dag", "winter", "zonsondergang"] },

  { id: "sint-maarten", slug: "hoeveel-dagen-tot-sint-maarten", naam: "Sint-Maarten", titel: "Sint-Maarten", groep: "feest", soort: "datum", weer: true, tool: "paraplu", momenten: vast(11, 11), verwant: ["sinterklaas", "halloween", "kerst"] },
  { id: "dierendag", slug: "hoeveel-dagen-tot-dierendag", naam: "Dierendag", titel: "Dierendag", groep: "feest", soort: "datum", weer: true, tool: "hond-uitlaten", momenten: vast(10, 4), verwant: ["herfstvakantie", "halloween", "sint-maarten"] },
  { id: "ijsheiligen", slug: "wanneer-zijn-de-ijsheiligen", naam: "de IJsheiligen", titel: "IJsheiligen", groep: "seizoen", soort: "datum", weer: true, tool: "planten-beschermen", vraag: "Wanneer zijn de IJsheiligen?", geenWerkdagen: true, momenten: (j) => [{ start: ymd(j, 5, 11), eind: ymd(j, 5, 15) }], verwant: ["moederdag", "lente", "hemelvaart"] },
  { id: "perseiden", slug: "wanneer-zijn-de-perseiden", naam: "de Perseiden", titel: "Perseiden", groep: "seizoen", soort: "datum", weer: true, tool: "sterrenkijken", vraag: "Wanneer zijn de Perseiden (vallende sterren)?", geenWerkdagen: true, tijdDoel: { dagPlus: 0, u: 23, label: "de avond van 12 augustus" }, momenten: vast(8, 12), verwant: ["volle-maan", "zomervakantie", "langste-dag"] },
  { id: "volle-maan", slug: "wanneer-is-het-volle-maan", naam: "volle maan", titel: "Volle maan", groep: "seizoen", soort: "datum", weer: true, tool: "sterrenkijken", vraag: "Wanneer is het volle maan?", maan: true, geenWerkdagen: true, momenten: (j) => fasenInJaar(j, 2).map((f) => ({ start: vandaag(f.tijdstip), tijdstip: f.tijdstip })), verwant: ["perseiden", "zonsondergang", "kortste-dag"] },

  /* -------------------------------- nu en vandaag ---------------- */
  { id: "weekend", slug: "hoe-lang-nog-tot-het-weekend", naam: "het weekend", titel: "Weekend", groep: "nu", soort: "weekend", weer: true, tool: "terras", vraag: "Hoe lang nog tot het weekend?", verwant: ["zonsondergang", "droog", "black-friday"] },
  { id: "zonsondergang", slug: "hoe-laat-gaat-de-zon-onder", naam: "zonsondergang", titel: "Zonsondergang", groep: "nu", soort: "zon", weer: false, tool: "sterrenkijken", vraag: "Hoe laat gaat de zon onder vandaag?", verwant: ["zonsopkomst", "kortste-dag", "langste-dag"] },
  { id: "zonsopkomst", slug: "hoe-laat-komt-de-zon-op", naam: "zonsopkomst", titel: "Zonsopkomst", groep: "nu", soort: "zon", zonModus: "op", weer: false, tool: "krabben", vraag: "Hoe laat komt de zon op vandaag?", verwant: ["zonsondergang", "kortste-dag", "volle-maan"] },
  { id: "droog", slug: "hoe-lang-blijft-het-droog", naam: "de volgende bui", titel: "Droog", groep: "nu", soort: "droog", weer: false, tool: "regen-timing", vraag: "Hoe lang blijft het nog droog?", verwant: ["zonsondergang", "weekend", "herfst"] },
];

export const GROEPEN = [
  { id: "feest", titel: "Feestdagen en bijzondere dagen" },
  { id: "vakantie", titel: "Schoolvakanties" },
  { id: "seizoen", titel: "Seizoenen, klok, maan en sterren" },
  { id: "nu", titel: "Vandaag en nu" },
];

export function vindAfteller(slug) {
  return AFTELLERS.find((a) => a.slug === slug) ?? null;
}

export function vindAftellerOpId(id) {
  return AFTELLERS.find((a) => a.id === id) ?? null;
}

export function alleAftelSlugs() {
  return AFTELLERS.map((a) => a.slug);
}

/** De vraag als H1: expliciet, of afgeleid uit de naam. */
export function vraagVan(a) {
  return a.vraag ?? `Hoeveel dagen is het nog tot ${a.naam}?`;
}

/* ------------------------------------------------------------------ */
/* Telling                                                             */
/* ------------------------------------------------------------------ */

function maakMoment(a, m, nuDag, label) {
  const eind = m.eind ?? m.start;
  const td = a.tijdDoel;
  const doelDag = td ? plusDagen(m.start, td.dagPlus) : m.start;
  return {
    label: label ?? null,
    start: m.start,
    eind,
    dagen: dagenTussen(nuDag, m.start),
    weken: Math.floor(dagenTussen(nuDag, m.start) / 7),
    isVandaag: vergelijk(nuDag, m.start) === 0,
    bezig: vergelijk(nuDag, m.start) >= 0 && vergelijk(nuDag, eind) <= 0,
    nogDagenBezig: dagenTussen(nuDag, eind),
    doelTijdstip: m.tijdstip ?? amsterdamTijdstip(doelDag, td?.u ?? 0, 0),
    werkdagen: werkdagenTot(nuDag, m.start),
  };
}

/**
 * De eerstvolgende momenten voor een teller. Voor een datum-teller een
 * element; voor een vakantie een per regio (gesorteerd op startdatum).
 * Een moment dat vandaag nog loopt telt als eerstvolgende.
 */
export function volgende(a, nu = Date.now()) {
  const nuDag = vandaag(nu);
  if (a.soort === "vakantie") {
    const perRegio = new Map();
    for (const r of VAKANTIE_DATA[a.vakantie]) {
      const m = { start: uitSleutel(r.start), eind: uitSleutel(r.eind) };
      if (vergelijk(m.eind, nuDag) < 0) continue;
      const huidig = perRegio.get(r.regio);
      if (!huidig || vergelijk(m.start, huidig.start) < 0) perRegio.set(r.regio, m);
    }
    return ["noord", "midden", "zuid"]
      .filter((r) => perRegio.has(r))
      .map((r) => maakMoment(a, perRegio.get(r), nuDag, REGIO_NAAM[r]));
  }
  if (!a.momenten) return [];
  for (const j of [nuDag.j - 1, nuDag.j, nuDag.j + 1, nuDag.j + 2]) {
    for (const m of a.momenten(j)) {
      // Een moment telt tot en met zijn laatste dag; oud en nieuw (31
      // december, teller tot middernacht) springt dus op 1 januari door.
      if (vergelijk(m.eind ?? m.start, nuDag) >= 0) return [maakMoment(a, m, nuDag)];
    }
  }
  return [];
}

/** De komende n keren (voor de tabel "de komende jaren"). */
export function komende(a, n = 4, nu = Date.now()) {
  if (!a.momenten) return [];
  const nuDag = vandaag(nu);
  const lijst = [];
  for (let j = nuDag.j; lijst.length < n && j < nuDag.j + n + 2; j++) {
    for (const m of a.momenten(j)) {
      if (vergelijk(m.eind ?? m.start, nuDag) >= 0) lijst.push(m.start);
    }
  }
  return lijst.slice(0, n);
}

/** Volgende vrijdag 17:00 (of nu, als het al weekend is). */
export const WEEKEND_START_UUR = 17;

export function weekendStatus(nu = Date.now()) {
  const dag = vandaag(nu);
  const wd = new Date(Date.UTC(dag.j, dag.m - 1, dag.d)).getUTCDay();
  // Dagen terug naar de vrijdag van deze week (vr=0, za=1, zo=2).
  const sindsVrijdag = { 5: 0, 6: 1, 0: 2 }[wd];
  if (sindsVrijdag !== undefined) {
    const vrijdag = plusDagen(dag, -sindsVrijdag);
    const start = amsterdamTijdstip(vrijdag, WEEKEND_START_UUR, 0);
    const eind = amsterdamTijdstip(plusDagen(vrijdag, 3), 0, 0);
    if (nu >= start) return { bezig: true, doel: eind, start, eind };
  }
  const totVrijdag = (5 - wd + 7) % 7;
  const vrijdag = plusDagen(dag, totVrijdag);
  const start = amsterdamTijdstip(vrijdag, WEEKEND_START_UUR, 0);
  return { bezig: false, doel: start, start, eind: amsterdamTijdstip(plusDagen(vrijdag, 3), 0, 0) };
}

/* ------------------------------------------------------------------ */
/* Pad en metadata                                                     */
/* ------------------------------------------------------------------ */

export const AFTEL_HUB_PAD = "/hoeveel-dagen-tot";

const MAANDEN = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

/**
 * Title en description met de actuele stand erin: een zoeker ziet het
 * antwoord al in het zoekresultaat, wat de klikkans verhoogt. De route
 * revalideert elk uur, dus de telling in de title loopt mee.
 */
export function aftelMeta(a, nu = Date.now()) {
  const m = volgende(a, nu)[0];
  const datum = (d) => `${d.d} ${MAANDEN[d.m - 1]}`;
  if (a.soort === "weekend") {
    return {
      title: "Hoe lang nog tot het weekend? Live aftellen tot vrijdag 17:00",
      description: "Live klok tot vrijdagmiddag vijf uur, op de seconde, met het weer voor zaterdag en zondag zodra dat binnen bereik is.",
    };
  }
  if (a.soort === "zon" && a.zonModus === "op") {
    return {
      title: "Hoe laat komt de zon op vandaag? Per stad, met aftelklok",
      description: "Zonsopkomst voor vandaag en morgen, per stad of op je eigen plek, met daglengte, zonsondergang en een klok die aftelt tot de zon opkomt.",
    };
  }
  if (a.soort === "zon") {
    return {
      title: "Hoe laat gaat de zon onder vandaag? Per stad, met aftelklok",
      description: "Zonsondergang en zonsopkomst voor vandaag, per stad of op je eigen plek, met daglengte en een klok die aftelt tot de zon onder is.",
    };
  }
  if (a.soort === "droog") {
    return {
      title: "Hoe lang blijft het nog droog? Live tot de volgende bui",
      description: "Klok die aftelt tot de volgende bui op jouw plek, op basis van de neerslagverwachting per kwartier. Regent het al, dan tot het droog wordt.",
    };
  }
  if (!m) {
    return { title: vraagVan(a), description: AFTEL_KORT(a) };
  }
  if (a.soort === "vakantie") {
    return {
      title: `${vraagVan(a).replace("Hoeveel dagen is het nog tot", "Hoeveel dagen tot").replace("?", "")} ${m.start.j}? Per regio`,
      description: `Aftellen naar ${a.naam} ${m.start.j}, met een teller per regio (noord, midden, zuid), de officiele data en het aantal werkdagen.`,
    };
  }
  const jaar = m.start.j;
  if (a.daglicht) {
    return {
      title: `Wanneer is ${a.naam} van ${jaar}? ${datum(m.start)}`,
      description: `${a.titel} ${jaar}: ${datum(m.start)}. Met zonsopkomst, zonsondergang en daglengte, en een live klok tot die dag.`,
    };
  }
  if (a.sneeuw) {
    const stand = m.dagen <= 6 ? "De verwachting" : `Nog ${m.dagen} dagen tot kerst`;
    return {
      title: `${a.vraag.replace("?", "")} in ${jaar}? ${stand}`,
      description: `Wordt kerst ${jaar} wit? Wat telt als een witte kerst, hoe zeldzaam die is, en zodra kerst binnen een week ligt de sneeuwverwachting voor beide kerstdagen.`,
    };
  }
  if (a.maan) {
    const tijd = new Intl.DateTimeFormat("nl-NL", { timeZone: "Europe/Amsterdam", hour: "2-digit", minute: "2-digit" }).format(new Date(m.doelTijdstip));
    return {
      title: `Wanneer is het volle maan? Volgende: ${datum(m.start)} ${jaar}`,
      description: `De volgende volle maan is op ${datum(m.start)} ${jaar} om ${tijd} uur. Met de maanfase van vandaag, alle volle manen van het jaar en een live klok.`,
    };
  }
  if (a.vraag && !a.id.startsWith("klok-")) {
    const periode = m.eind && dagenTussen(m.start, m.eind) > 0 ? ` tot en met ${datum(m.eind)}` : "";
    return {
      title: `${a.vraag.replace(/\?$/, "").replace(/ \(.*\)/, "")} in ${jaar}? ${datum(m.start)}${periode}`,
      description: `${a.titel} ${jaar}: ${datum(m.start)}${periode}. Nog ${m.dagen} ${m.dagen === 1 ? "dag" : "dagen"}, met een live klok en wat je die dagen kunt verwachten.`,
    };
  }
  if (a.vraag) {
    return {
      title: `${a.vraag.replace("?", "")} in ${jaar}? Zondag ${datum(m.start)}`,
      description: `${a.titel} ${jaar}: de klok verspringt in de nacht van zaterdag op zondag ${datum(m.start)}. Nog ${m.dagen} ${m.dagen === 1 ? "dag" : "dagen"}, met een live klok.`,
    };
  }
  const stand = m.isVandaag ? "Vandaag!" : m.bezig ? "Nu bezig" : `Nog ${m.dagen} ${m.dagen === 1 ? "dag" : "dagen"}`;
  return {
    title: `Hoeveel dagen tot ${a.naam} ${jaar}? ${stand}`,
    description: `${a.titel} ${jaar} valt op ${datum(m.start)}. Live aftellen tot op de seconde, met het aantal weken en werkdagen${a.weer ? " en het weer voor de dag zelf" : ""}.`,
  };
}

function AFTEL_KORT(a) {
  return `Aftellen naar ${a.naam}, met datum, weken en werkdagen.`;
}

/** De regel voor de insluitbare widget (v3.36.0). */
export function widgetRegel(a, nu = Date.now()) {
  const momenten = volgende(a, nu);
  if (!momenten.length) return null;
  const m = [...momenten].sort((x, y) => x.dagen - y.dagen)[0];
  if (m.isVandaag) return { dagen: 0, regel: `Vandaag is het ${a.naam}` };
  if (m.bezig) return { dagen: 0, regel: `Het is nu ${a.naam}` };
  const regio = momenten.length > 1 ? ` (${m.label.toLowerCase()})` : "";
  return { dagen: m.dagen, regel: `nog ${m.dagen} ${m.dagen === 1 ? "dag" : "dagen"} tot ${a.naam}${regio}` };
}
