/**
 * lib/notify.js
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

import { toLocalInput, bft, kompas, fmtTijd } from "./format.js";

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
    // mode "auto" op de eerste etappe heeft geen vaste tijd: geen herinnering.

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
 * @returns {Array<{type: string, key: string, legIdx?: number, departure?: Date}>}
 */
export function dueNotifications({ settings, log, times, nu }) {
  const items = [];
  const dk = dagKey(nu);

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
export function briefingTekst(plan) {
  const dag = plan?.dag;
  if (!dag) {
    return {
      title: "Kopwind ochtendbriefing",
      body: "Geen keten om door te rekenen. Open Kopwind en stel je dag samen.",
    };
  }
  const leg = plan.legs[dag.worstIdx];
  const van = leg.van.naam.split(",")[0];
  const naar = leg.naar.naam.split(",")[0];
  return {
    title: `Kopwind: ${dag.advies} (score ${dag.score})`,
    body: `Zwaarste etappe ${van} naar ${naar} om ${fmtTijd(leg.departure)}: ${leg.samenvatting} ${weerZin(leg)}`,
  };
}

/** Titel en tekst voor een vertrekherinnering voor een etappe. */
export function vertrekTekst(leg, minuten) {
  const van = leg.van.naam.split(",")[0];
  const naar = leg.naar.naam.split(",")[0];
  return {
    title: `Over ${minuten} min: ${van} naar ${naar}`,
    body: `${kapitaal(leg.advies.advies)} (score ${leg.advies.score}). ${weerZin(leg)}`,
  };
}

function kapitaal(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
