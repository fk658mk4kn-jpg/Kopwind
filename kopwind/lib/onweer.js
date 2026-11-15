/**
 * lib/onweer.js
 *
 * Onweerskans per dag (v3.38.0) uit de uurverwachting: de weercode (95,
 * 96 en 99 zijn onweer, de laatste twee met hagel) en de CAPE, de energie
 * die de atmosfeer beschikbaar heeft voor buien. CAPE alleen is geen
 * onweer: er moet ook een trigger zijn. Daarom weegt de weercode zwaarder.
 */

export const ONWEER_CODES = new Set([95, 96, 99]);

export function onweerPerDag(hourly) {
  const per = new Map();
  (hourly?.time ?? []).forEach((t, i) => {
    const d = t.slice(0, 10);
    const u = Number(t.slice(11, 13));
    const code = hourly.weather_code?.[i];
    const cape = hourly.cape?.[i] ?? 0;
    if (!per.has(d)) per.set(d, { datum: d, uren: [], hagel: false, maxCape: 0 });
    const dag = per.get(d);
    dag.maxCape = Math.max(dag.maxCape, cape);
    if (ONWEER_CODES.has(code)) {
      dag.uren.push(u);
      if (code !== 95) dag.hagel = true;
    }
  });
  return [...per.values()].sort((a, b) => a.datum.localeCompare(b.datum)).map((d) => ({ ...d, oordeel: oordeel(d) }));
}

function oordeel(d) {
  if (d.uren.length >= 3 || (d.uren.length && d.maxCape >= 1500)) return { niveau: 3, woord: "Onweer verwacht" };
  if (d.uren.length) return { niveau: 2, woord: "Kans op onweer" };
  if (d.maxCape >= 800) return { niveau: 1, woord: "Kleine kans, onstabiele lucht" };
  return { niveau: 0, woord: "Geen onweer verwacht" };
}

/** Uren als leesbare blokken: [14,15,16,20] wordt "14:00 tot 17:00 en rond 20:00". */
export function urenTekst(uren) {
  if (!uren.length) return "";
  const blokken = [];
  let start = uren[0];
  let vorige = uren[0];
  for (const u of uren.slice(1).concat([null])) {
    if (u === vorige + 1) {
      vorige = u;
      continue;
    }
    blokken.push(start === vorige ? `rond ${String(start).padStart(2, "0")}:00` : `${String(start).padStart(2, "0")}:00 tot ${String(vorige + 1).padStart(2, "0")}:00`);
    start = u;
    vorige = u;
  }
  return blokken.join(" en ");
}
