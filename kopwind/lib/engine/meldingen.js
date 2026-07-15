/**
 * lib/engine/meldingen.js
 *
 * Pure logica voor meldingen: wanneer moet er een ochtendbriefing of
 * vertrekherinnering af, en wat staat erin. Geen browser-API's hier,
 * zodat alles testbaar is. Het afvuren zelf gebeurt in
 * components/NotificationManager.js.
 *
 * Twee meldingstypen:
 * - Ochtendbriefing: dagadvies op een vast tijdstip (bv. 07:00), met
 *   inhaalvenster van 3 uur als de app later pas geopend wordt.
 * - Vertrekherinnering: X minuten voor de geplande vertrektijd van elke
 *   etappe uit de laatst opgeslagen keten.
 */

import { toLocalInput, bft, kompas, fmtTijd } from "../format.js";
import { labelVoor } from "./schaal.js";
import { APP_KORT } from "../brand.js";

import { kies } from "../i18n/locale.js";

/** Zinnen van meldingen en briefings, per taal. */
const M = kies({
  nl: {
    geenWeer: "Geen weerdata beschikbaar.",
    droog: "droog",
    kansOpRegen: (p) => `${p}% kans op regen`,
    totMm: (mm) => ` (tot ${mm} mm/u)`,
    weer: (t, gevoel, regen, b, richting) =>
      `${t} graden (voelt als ${gevoel}), ${regen}, wind ${b} Bft uit ${richting}.`,
    ochtendbriefing: "ochtendbriefing",
    geenRoute: "Geen route om door te rekenen. Open de fietscheck en stel je dag samen.",
    zwaarsteRit: (van, naar, tijd) => `Zwaarste rit ${van} naar ${naar} om ${tijd}:`,
    overMin: (min, van, naar) => `Over ${min} min: ${van} naar ${naar}`,
    decimaal: ",",
  },
  en: {
    geenWeer: "No weather data available.",
    droog: "dry",
    kansOpRegen: (p) => `${p}% chance of rain`,
    totMm: (mm) => ` (up to ${mm} mm/h)`,
    weer: (t, gevoel, regen, b, richting) =>
      `${t} degrees (feels like ${gevoel}), ${regen}, wind ${b} Bft from the ${richting}.`,
    ochtendbriefing: "morning briefing",
    geenRoute: "No route to run the numbers on. Open the bike check and set up your day.",
    zwaarsteRit: (van, naar, tijd) => `Toughest ride ${van} to ${naar} at ${tijd}:`,
    overMin: (min, van, naar) => `In ${min} min: ${van} to ${naar}`,
    decimaal: ".",
  },
});

export const DEFAULT_MELDINGEN = {
  ochtend: false,
  ochtendTijd: "07:00",
  vertrek: false,
  vertrekMinuten: 15,
};

/** Sleutel voor een kalenderdag in lokale tijd: "2026-07-10". */
export function dagKey(d) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/**
 * Zet de tijden van een opgeslagen keten om naar vandaag: de kloktijd
 * (HH:MM) blijft staan, de datum wordt die van nu. Zo werkt een keten die
 * je gisteren invulde vanochtend gewoon weer, zonder opnieuw invullen.
 */
export function normalizeChainToToday(legOptions, nu) {
  return (legOptions ?? []).map((o) => {
    if (!o?.tijd || (o.mode !== "vertrek" && o.mode !== "aankomst")) {
      return { ...o };
    }
    const tijd = o.tijd.split("T")[1];
    if (!tijd) return { ...o };
    const [h, m] = tijd.split(":").map(Number);
    const d = new Date(nu.getTime());
    d.setHours(h, m ?? 0, 0, 0);
    return { ...o, tijd: toLocalInput(d) };
  });
}

/**
 * Berekent de geplande vertrek- en aankomsttijden van de keten zonder
 * netwerk, met de reistijden (in seconden) van de laatst berekende route.
 * Spiegel van resolveDeparture in lib/planner.js, maar offline.
 *
 * @param {Array} legOptions genormaliseerde opties (zie normalizeChainToToday)
 * @param {Array<number>} durations reistijd per etappe in seconden
 * @param {Date} nu
 * @returns {Array<{departure: Date|null, arrival: Date|null}>}
 */
export function planTimes(legOptions, durations, nu) {
  const uit = [];
  let vorigeAankomst = null;
  const n = Math.max(legOptions?.length ?? 0, durations?.length ?? 0);

  for (let i = 0; i < n; i++) {
    const o = legOptions?.[i] ?? { mode: "auto" };
    const dur = durations?.[i];
    let departure = null;

    if (o.mode === "vertrek" && o.tijd) {
      departure = new Date(o.tijd);
    } else if (o.mode === "aankomst" && o.tijd && Number.isFinite(dur)) {
      departure = new Date(new Date(o.tijd).getTime() - dur * 1000);
    } else if (o.mode === "auto" && i > 0 && vorigeAankomst) {
      const verblijf = Number.isFinite(o.verblijfMin) ? o.verblijfMin : 45;
      departure = new Date(vorigeAankomst.getTime() + verblijf * 60 * 1000);
    }
    // mode "auto" of "nu" op de eerste rit heeft geen vaste kloktijd:
    // je vertrekt gewoon, dus daar is geen herinnering voor nodig.

    const arrival =
      departure && Number.isFinite(dur)
        ? new Date(departure.getTime() + dur * 1000)
        : null;
    vorigeAankomst = arrival;
    uit.push({ departure, arrival });
  }
  return uit;
}

/**
 * Bepaalt welke meldingen nu af moeten, met dedupe via een logboekje
 * ({ sleutel: timestamp }).
 *
 * @param {object} p
 * @param {object} p.settings meldinginstellingen (zie DEFAULT_MELDINGEN)
 * @param {object} p.log eerder gestuurde meldingen
 * @param {Array<{departure: Date|null}>} p.times uit planTimes
 * @param {Date} p.nu
 * @param {string} [p.prefix] bv. de routenaam, zodat sleutels per route
 *   uniek zijn: "2026-07-10:Woon-werk:ochtend"
 * @returns {Array<{type: string, key: string, legIdx?: number, departure?: Date}>}
 */
export function dueNotifications({ settings, log, times, nu, prefix }) {
  const items = [];
  const p = prefix ? `:${String(prefix).replaceAll(":", "_")}` : "";
  const dk = dagKey(nu) + p;

  if (settings?.ochtend && settings.ochtendTijd) {
    const [h, m] = settings.ochtendTijd.split(":").map(Number);
    const t = new Date(nu.getTime());
    t.setHours(h, m ?? 0, 0, 0);
    const key = `${dk}:ochtend`;
    const inhaalvenster = 3 * 3600 * 1000;
    if (nu >= t && nu.getTime() - t.getTime() <= inhaalvenster && !log[key]) {
      items.push({ type: "ochtend", key });
    }
  }

  if (settings?.vertrek) {
    const minuten = Number.isFinite(settings.vertrekMinuten)
      ? settings.vertrekMinuten
      : 15;
    const venster = minuten * 60 * 1000;
    (times ?? []).forEach((t, i) => {
      const d = t?.departure;
      if (!d) return;
      const key = `${dk}:vertrek:${i}`;
      if (nu.getTime() >= d.getTime() - venster && nu < d && !log[key]) {
        items.push({ type: "vertrek", key, legIdx: i, departure: d });
      }
    });
  }

  return items;
}

/** Korte weerzin voor in een melding: temperatuur, regen, wind. */
export function weerZin(leg) {
  const w = leg?.segments?.find((s) => s.weer)?.weer;
  const m = leg?.metrics;
  if (!w || !m) return M.geenWeer;
  const regen =
    m.neerslagKansMax >= 20
      ? M.kansOpRegen(Math.round(m.neerslagKansMax)) +
        (m.neerslagMmMax >= 0.1
          ? M.totMm(m.neerslagMmMax.toFixed(1).replace(".", M.decimaal))
          : "")
      : M.droog;
  return M.weer(Math.round(w.temp), Math.round(w.gevoel), regen, bft(w.windSpeed), kompas(w.windFrom));
}

/** Titel en tekst voor de ochtendbriefing op basis van een berekend plan. */
export function briefingTekst(plan, routeNaam, schaalLabels = null) {
  const dag = plan?.dag;
  if (!dag) {
    return {
      title: `${APP_KORT} ${M.ochtendbriefing}`,
      body: M.geenRoute,
    };
  }
  const leg = plan.legs[dag.worstIdx];
  const van = leg.van.naam.split(",")[0];
  const naar = leg.naar.naam.split(",")[0];
  // Verdictwoord voorop: dat is het antwoord, de rest is context.
  const kop = routeNaam ? ` \u00b7 ${routeNaam}` : ` \u00b7 ${APP_KORT}`;
  return {
    title: `${kapitaal(labelVoor(dag.score, schaalLabels))}${kop}`,
    body: `${M.zwaarsteRit(van, naar, fmtTijd(leg.departure))} ${leg.samenvatting} ${weerZin(leg)}`,
  };
}

/** Titel en tekst voor een vertrekherinnering voor een etappe. */
export function vertrekTekst(leg, minuten, schaalLabels = null) {
  const van = leg.van.naam.split(",")[0];
  const naar = leg.naar.naam.split(",")[0];
  return {
    title: M.overMin(minuten, van, naar),
    body: `${kapitaal(leg.advies.advies)} (${labelVoor(leg.advies.score, schaalLabels).toLowerCase()}). ${weerZin(leg)}`,
  };
}

function kapitaal(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}


/* ------------------------------------------------------------------ */
/* V3: weekplan (per weekdag eigen stuurtijden en een eigen doelmoment) */
/* ------------------------------------------------------------------ */

/** ISO-weekdag in Nederlandse telling: 1 = maandag ... 7 = zondag. */
export function isoDag(nu) {
  return ((nu.getDay() + 6) % 7) + 1;
}

/**
 * Het weekplan is de kern van het meldingen-format (PLAYBOOK sectie 10):
 * per weekdag ("1" t/m "7") staat er een dagconfig met
 * - aan: melden op die dag
 * - tijden: de stuurtijden (wanneer de melding KOMT)
 * - het doelmoment (waarover het advies GAAT):
 *   routes: vertrekTijd ("HH:MM" of null = volg de routeplanning van de keten)
 *   tools:  doel { soort: "dag" } of { soort: "venster", van, tot }
 */
function weekVan(dagen, tijden, extraPerDag) {
  const week = {};
  for (let d = 1; d <= 7; d++) {
    week[String(d)] = {
      aan: (dagen ?? []).includes(d),
      tijden: [...(tijden ?? [])],
      ...structuredClone(extraPerDag),
    };
  }
  return week;
}

export const DEFAULT_ROUTE_SCHEMA = {
  week: weekVan([1, 2, 3, 4, 5], [], { vertrekTijd: null }),
  vertrek: { aan: false, minuten: 15 },
  drempel: { modus: "altijd", cijfer: 6.5 },
};

export const DEFAULT_TOOL_SCHEMA = {
  aan: false,
  locatie: null,
  week: weekVan([1, 2, 3, 4, 5, 6, 7], ["08:00"], { doel: { soort: "dag" } }),
  drempel: { modus: "goed", cijfer: 7 },
};

/**
 * Migreert het meldingenobject van een route naar het v3-weekplan.
 * v1 = {ochtend, ochtendTijd, vertrek, vertrekMinuten}
 * v2 = {dagen, briefing:{aan,tijden}, vertrek:{aan,minuten}, drempel}
 * v3 (heeft .week) gaat er genormaliseerd doorheen; null/undefined wordt
 * een uitgeschakeld schema.
 */
export function migreerRouteSchema(oud) {
  if (!oud) return structuredClone(DEFAULT_ROUTE_SCHEMA);
  if (oud.week) {
    const uit = structuredClone(DEFAULT_ROUTE_SCHEMA);
    for (let d = 1; d <= 7; d++) {
      const e = oud.week[String(d)] ?? {};
      uit.week[String(d)] = {
        aan: Boolean(e.aan),
        tijden: Array.isArray(e.tijden) ? [...e.tijden] : [],
        vertrekTijd: e.vertrekTijd ?? null,
      };
    }
    uit.vertrek = { ...DEFAULT_ROUTE_SCHEMA.vertrek, ...(oud.vertrek ?? {}) };
    uit.drempel = { ...DEFAULT_ROUTE_SCHEMA.drempel, ...(oud.drempel ?? {}) };
    return uit;
  }
  if (oud.briefing || oud.dagen) {
    const dagen = Array.isArray(oud.dagen) ? oud.dagen : [1, 2, 3, 4, 5, 6, 7];
    const tijden = oud.briefing?.aan ? oud.briefing.tijden ?? ["07:00"] : [];
    return {
      week: weekVan(dagen, tijden, { vertrekTijd: null }),
      vertrek: { ...DEFAULT_ROUTE_SCHEMA.vertrek, ...(oud.vertrek ?? {}) },
      drempel: { ...DEFAULT_ROUTE_SCHEMA.drempel, ...(oud.drempel ?? {}) },
    };
  }
  return {
    week: weekVan(
      [1, 2, 3, 4, 5, 6, 7],
      oud.ochtend ? [oud.ochtendTijd ?? "07:00"] : [],
      { vertrekTijd: null }
    ),
    vertrek: { aan: Boolean(oud.vertrek), minuten: oud.vertrekMinuten ?? 15 },
    drempel: { modus: "altijd", cijfer: 6.5 },
  };
}

/**
 * Migreert het meldingenobject van een locatie-tool naar het v3-weekplan.
 * v2 = {aan, locatie, dagen, tijden, drempel}; v3 heeft .week.
 */
export function migreerToolSchema(oud) {
  if (!oud) return structuredClone(DEFAULT_TOOL_SCHEMA);
  if (oud.week) {
    const uit = structuredClone(DEFAULT_TOOL_SCHEMA);
    uit.aan = Boolean(oud.aan);
    uit.locatie = oud.locatie ?? null;
    for (let d = 1; d <= 7; d++) {
      const e = oud.week[String(d)] ?? {};
      uit.week[String(d)] = {
        aan: Boolean(e.aan),
        tijden: Array.isArray(e.tijden) ? [...e.tijden] : [],
        doel:
          e.doel?.soort === "venster"
            ? { soort: "venster", van: e.doel.van ?? "08:00", tot: e.doel.tot ?? "18:00" }
            : { soort: "dag" },
      };
    }
    uit.drempel = { ...DEFAULT_TOOL_SCHEMA.drempel, ...(oud.drempel ?? {}) };
    return uit;
  }
  return {
    aan: Boolean(oud.aan),
    locatie: oud.locatie ?? null,
    week: weekVan(
      Array.isArray(oud.dagen) ? oud.dagen : [1, 2, 3, 4, 5, 6, 7],
      oud.tijden ?? ["08:00"],
      { doel: { soort: "dag" } }
    ),
    drempel: { ...DEFAULT_TOOL_SCHEMA.drempel, ...(oud.drempel ?? {}) },
  };
}

/**
 * Bepaalt welke briefings nu af moeten volgens het weekplan. Zelfde
 * vensterlogica als voorheen (inhaal tot 3 uur). Het item draagt het
 * doelmoment van de dag mee (vertrekTijd of doel), zodat de verzender weet
 * waarover het advies moet gaan. Sleutels: "<dag>:<prefix>:briefing:<tijd>".
 * Neemt zowel v3-schema's (met .week) als oudere vormen aan.
 */
export function dueBriefings({ schema, log, nu, prefix }) {
  const items = [];
  const s = schema?.week ? schema : naarWeek(schema);
  if (!s) return items;
  const dagCfg = s.week[String(isoDag(nu))];
  if (!dagCfg?.aan) return items;
  const dk = dagKey(nu);
  const p = prefix ? `:${String(prefix).replaceAll(":", "_")}` : "";
  const inhaal = 3 * 3600 * 1000;
  for (const tijd of dagCfg.tijden ?? []) {
    const [h, m] = String(tijd).split(":").map(Number);
    if (!Number.isFinite(h)) continue;
    const t = new Date(nu.getTime());
    t.setHours(h, m ?? 0, 0, 0);
    const key = `${dk}${p}:briefing:${tijd}`;
    if (nu >= t && nu.getTime() - t.getTime() <= inhaal && !log[key]) {
      items.push({
        type: "briefing",
        key,
        tijd,
        vertrekTijd: dagCfg.vertrekTijd ?? null,
        doel: dagCfg.doel ?? null,
      });
    }
  }
  return items;
}

/**
 * Vertrekherinneringen volgens het weekplan: de globale vertrek-instelling
 * (aan, minuten) vuurt alleen op dagen die in het weekplan aan staan.
 */
export function dueVertrek({ schema, times, log, nu, prefix }) {
  const items = [];
  const s = schema?.week ? schema : naarWeek(schema);
  if (!s?.vertrek?.aan) return items;
  if (!s.week[String(isoDag(nu))]?.aan) return items;
  const dk = dagKey(nu);
  const p = prefix ? `:${String(prefix).replaceAll(":", "_")}` : "";
  const minuten = Number.isFinite(s.vertrek.minuten) ? s.vertrek.minuten : 15;
  const venster = minuten * 60 * 1000;
  (times ?? []).forEach((t, i) => {
    const d = t?.departure;
    if (!d) return;
    const key = `${dk}${p}:vertrek:${i}`;
    if (nu.getTime() >= d.getTime() - venster && nu < d && !log[key]) {
      items.push({ type: "vertrek", key, legIdx: i, departure: d, minuten });
    }
  });
  return items;
}

/** Oudere schema-vormen (v2) on the fly naar een weekplan tillen. */
function naarWeek(schema) {
  if (!schema) return null;
  if (schema.briefing || schema.dagen) {
    return schema.tijden ? migreerToolSchema(schema) : migreerRouteSchema(schema);
  }
  return null;
}

/**
 * Doelmoment voor routes: forceert de eerste rit van de keten naar een
 * vaste vertrektijd op de dag van nu. De kloktijd komt uit het weekplan,
 * de datum is altijd die van nu (nooit in het verleden).
 */
export function pasVertrekTijdToe(legOptions, vertrekTijd, nu) {
  if (!vertrekTijd) return legOptions;
  const [h, m] = String(vertrekTijd).split(":").map(Number);
  if (!Number.isFinite(h)) return legOptions;
  const d = new Date(nu.getTime());
  d.setHours(h, m ?? 0, 0, 0);
  const uit = (legOptions ?? []).map((o) => ({ ...o }));
  if (!uit.length) uit.push({});
  uit[0] = { ...uit[0], mode: "vertrek", tijd: toLocalInput(d) };
  return uit;
}

/**
 * Doelmoment voor locatie-tools: het advies over een tijdvenster in plaats
 * van de hele dag. Rekent generiek op de uren uit het overlay-contract
 * ({uur, score, nat}): de gemiddelde score in [van, tot) plus of er natte
 * uren in zitten. Geeft null als het venster geen uren raakt.
 */
export function vensterAdvies(uren, van, tot) {
  const vanUur = Number(String(van).split(":")[0]);
  const totUur = Number(String(tot).split(":")[0]);
  if (!Number.isFinite(vanUur) || !Number.isFinite(totUur)) return null;
  const inVenster = (uren ?? []).filter((u) => u.uur >= vanUur && u.uur < totUur);
  if (!inVenster.length) return null;
  const score = inVenster.reduce((a, u) => a + u.score, 0) / inVenster.length;
  return { score, uren: inVenster.length, nat: inVenster.some((u) => u.nat) };
}

/**
 * Drempelfilter: mag deze melding eruit, gegeven de pijnscore?
 * modus "altijd" stuurt altijd; "slecht" alleen bij cijfer <= grens
 * (waarschuw me op rotdagen); "goed" alleen bij cijfer >= grens
 * (zeg het me als het WEL kan, bv. een drooghangdag).
 */
export function drempelLaatDoor(drempel, score) {
  const modus = drempel?.modus ?? "altijd";
  if (modus === "altijd") return true;
  const cijfer = Math.max(1, Math.min(10, (100 - score) / 10));
  const grens = Number.isFinite(drempel?.cijfer) ? drempel.cijfer : 6.5;
  if (modus === "slecht") return cijfer <= grens;
  if (modus === "goed") return cijfer >= grens;
  return true;
}

/** Mensentaal-zin onder een weekplan in het meldingenpaneel. */
export function schemaZin(schema, soort) {
  const NAMEN = ["ma", "di", "wo", "do", "vr", "za", "zo"];
  const s = schema?.week ? schema : naarWeek(schema);
  if (!s) return "Geen meldingen ingesteld.";

  // Groepeer opeenvolgende dagen met exact dezelfde dagconfig.
  const groepen = [];
  for (let d = 1; d <= 7; d++) {
    const e = s.week[String(d)];
    if (!e?.aan || !(e.tijden ?? []).length) continue;
    const doelTekst = e.vertrekTijd
      ? `, rit om ${e.vertrekTijd}`
      : e.doel?.soort === "venster"
      ? `, over ${e.doel.van} tot ${e.doel.tot}`
      : "";
    const handtekening = `${(e.tijden ?? []).join(" en ")}${doelTekst}`;
    const vorige = groepen[groepen.length - 1];
    if (vorige && vorige.handtekening === handtekening && vorige.totDag === d - 1) {
      vorige.totDag = d;
    } else {
      groepen.push({ vanDag: d, totDag: d, handtekening });
    }
  }

  const delen = groepen.map((g) => {
    const dagTekst =
      g.vanDag === g.totDag
        ? NAMEN[g.vanDag - 1]
        : `${NAMEN[g.vanDag - 1]} t/m ${NAMEN[g.totDag - 1]}`;
    return `${dagTekst} om ${g.handtekening}`;
  });
  const alle =
    groepen.length === 1 && groepen[0].vanDag === 1 && groepen[0].totDag === 7;
  if (alle) delen[0] = `elke dag om ${groepen[0].handtekening}`;

  if (soort === "route" && s.vertrek?.aan) {
    delen.push(`een herinnering ${s.vertrek.minuten} min voor vertrek`);
  }
  if (!delen.length) return "Geen meldingen ingesteld.";
  let zin = `Je krijgt een melding ${delen.join("; ")}`;
  const d = s.drempel;
  if (d?.modus === "slecht") zin += ` (alleen bij cijfer ${String(d.cijfer).replace(".", ",")} of lager)`;
  if (d?.modus === "goed") zin += ` (alleen bij cijfer ${String(d.cijfer).replace(".", ",")} of hoger)`;
  return zin + ".";
}
