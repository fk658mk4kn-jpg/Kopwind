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
  if (!w || !m) return "Geen weerdata beschikbaar.";
  const regen =
    m.neerslagKansMax >= 20
      ? `${Math.round(m.neerslagKansMax)}% kans op regen` +
        (m.neerslagMmMax >= 0.1
          ? ` (tot ${m.neerslagMmMax.toFixed(1).replace(".", ",")} mm/u)`
          : "")
      : "droog";
  return (
    `${Math.round(w.temp)} graden (voelt als ${Math.round(w.gevoel)}), ${regen}, ` +
    `wind ${bft(w.windSpeed)} Bft uit ${kompas(w.windFrom)}.`
  );
}

/** Titel en tekst voor de ochtendbriefing op basis van een berekend plan. */
export function briefingTekst(plan, routeNaam, schaalLabels = null) {
  const dag = plan?.dag;
  if (!dag) {
    return {
      title: `${APP_KORT} ochtendbriefing`,
      body: "Geen route om door te rekenen. Open de fietscheck en stel je dag samen.",
    };
  }
  const leg = plan.legs[dag.worstIdx];
  const van = leg.van.naam.split(",")[0];
  const naar = leg.naar.naam.split(",")[0];
  const kop = routeNaam ? `${APP_KORT} · ${routeNaam}` : APP_KORT;
  return {
    title: `${kop}: ${labelVoor(dag.score, schaalLabels).toLowerCase()}`,
    body: `Zwaarste rit ${van} naar ${naar} om ${fmtTijd(leg.departure)}: ${leg.samenvatting} ${weerZin(leg)}`,
  };
}

/** Titel en tekst voor een vertrekherinnering voor een etappe. */
export function vertrekTekst(leg, minuten, schaalLabels = null) {
  const van = leg.van.naam.split(",")[0];
  const naar = leg.naar.naam.split(",")[0];
  return {
    title: `Over ${minuten} min: ${van} naar ${naar}`,
    body: `${kapitaal(leg.advies.advies)} (${labelVoor(leg.advies.score, schaalLabels).toLowerCase()}). ${weerZin(leg)}`,
  };
}

function kapitaal(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}


/* ------------------------------------------------------------------ */
/* V2: granulaire schema's (dagen, meerdere tijden, drempel)           */
/* ------------------------------------------------------------------ */

/** ISO-weekdag in Nederlandse telling: 1 = maandag ... 7 = zondag. */
export function isoDag(nu) {
  return ((nu.getDay() + 6) % 7) + 1;
}

export const DEFAULT_ROUTE_SCHEMA = {
  dagen: [1, 2, 3, 4, 5],
  briefing: { aan: false, tijden: ["07:00"] },
  vertrek: { aan: false, minuten: 15 },
  drempel: { modus: "altijd", cijfer: 6.5 },
};

export const DEFAULT_TOOL_SCHEMA = {
  aan: false,
  locatie: null,
  dagen: [1, 2, 3, 4, 5, 6, 7],
  tijden: ["08:00"],
  drempel: { modus: "goed", cijfer: 7 },
};

/**
 * Migreert het v1-meldingenobject van een route ({ochtend, ochtendTijd,
 * vertrek, vertrekMinuten}) naar het v2-schema. V2-objecten gaan er
 * ongewijzigd doorheen; null/undefined wordt een uitgeschakeld schema.
 */
export function migreerRouteSchema(oud) {
  if (!oud) return structuredClone(DEFAULT_ROUTE_SCHEMA);
  if (oud.briefing || oud.dagen) {
    return {
      ...structuredClone(DEFAULT_ROUTE_SCHEMA),
      ...oud,
      briefing: { ...DEFAULT_ROUTE_SCHEMA.briefing, ...(oud.briefing ?? {}) },
      vertrek: { ...DEFAULT_ROUTE_SCHEMA.vertrek, ...(oud.vertrek ?? {}) },
      drempel: { ...DEFAULT_ROUTE_SCHEMA.drempel, ...(oud.drempel ?? {}) },
    };
  }
  return {
    dagen: [1, 2, 3, 4, 5, 6, 7],
    briefing: { aan: Boolean(oud.ochtend), tijden: [oud.ochtendTijd ?? "07:00"] },
    vertrek: { aan: Boolean(oud.vertrek), minuten: oud.vertrekMinuten ?? 15 },
    drempel: { modus: "altijd", cijfer: 6.5 },
  };
}

/**
 * Bepaalt welke briefings nu af moeten volgens een v2-schema.
 * Zelfde vensterlogica als v1 (inhaal tot 3 uur), plus dagen-filter en
 * meerdere tijden. Sleutels: "<dag>:<prefix>:briefing:<tijd>".
 */
export function dueBriefings({ schema, log, nu, prefix }) {
  const items = [];
  if (!schema?.briefing?.aan) return items;
  if (Array.isArray(schema.dagen) && !schema.dagen.includes(isoDag(nu))) return items;
  const dk = dagKey(nu);
  const p = prefix ? `:${String(prefix).replaceAll(":", "_")}` : "";
  const inhaal = 3 * 3600 * 1000;
  for (const tijd of schema.briefing.tijden ?? []) {
    const [h, m] = String(tijd).split(":").map(Number);
    if (!Number.isFinite(h)) continue;
    const t = new Date(nu.getTime());
    t.setHours(h, m ?? 0, 0, 0);
    const key = `${dk}${p}:briefing:${tijd}`;
    if (nu >= t && nu.getTime() - t.getTime() <= inhaal && !log[key]) {
      items.push({ type: "briefing", key, tijd });
    }
  }
  return items;
}

/** Vertrekherinneringen volgens een v2-schema (dagen-filter plus venster). */
export function dueVertrek({ schema, times, log, nu, prefix }) {
  const items = [];
  if (!schema?.vertrek?.aan) return items;
  if (Array.isArray(schema.dagen) && !schema.dagen.includes(isoDag(nu))) return items;
  const dk = dagKey(nu);
  const p = prefix ? `:${String(prefix).replaceAll(":", "_")}` : "";
  const minuten = Number.isFinite(schema.vertrek.minuten) ? schema.vertrek.minuten : 15;
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

/** Mensentaal-zin onder een schema in het meldingenpaneel. */
export function schemaZin(schema, soort) {
  const NAMEN = ["ma", "di", "wo", "do", "vr", "za", "zo"];
  const dagen = (schema.dagen ?? []).map((d) => NAMEN[d - 1]).join(", ") || "geen dagen";
  const alle = (schema.dagen ?? []).length === 7;
  const dagTekst = alle ? "elke dag" : `op ${dagen}`;
  const delen = [];
  if (soort === "route") {
    if (schema.briefing?.aan) {
      delen.push(`${dagTekst} om ${(schema.briefing.tijden ?? []).join(" en ")} een briefing`);
    }
    if (schema.vertrek?.aan) {
      delen.push(`een herinnering ${schema.vertrek.minuten} min voor vertrek`);
    }
  } else {
    delen.push(`${dagTekst} om ${(schema.tijden ?? []).join(" en ")} een check`);
  }
  if (!delen.length) return "Geen meldingen ingesteld.";
  let zin = `Je krijgt ${delen.join(" en ")}`;
  const d = schema.drempel;
  if (d?.modus === "slecht") zin += ` (alleen bij cijfer ${String(d.cijfer).replace(".", ",")} of lager)`;
  if (d?.modus === "goed") zin += ` (alleen bij cijfer ${String(d.cijfer).replace(".", ",")} of hoger)`;
  return zin + ".";
}
