/**
 * lib/aftellen/neerslag.js
 *
 * Zoekt in de kwartierreeks het volgende omslagmoment: van droog naar
 * nat, of van nat naar droog. Een kwartier telt als nat vanaf 0,1 mm.
 * Droog worden vraagt een uur aaneengesloten droog, zodat een korte
 * onderbreking in een buiige periode niet als "droog" telt.
 */

export const NAT_MM = 0.1;
const KWARTIER = 15 * 60 * 1000;

function tijdstipVan(tekst) {
  // Open-Meteo levert lokale tijd zonder zone ("2026-11-15T14:15") omdat
  // we om Europe/Amsterdam vragen; die zetten we om naar een echt tijdstip.
  const [d, t] = tekst.split("T");
  const [j, m, dag] = d.split("-").map(Number);
  const [u, mi] = t.split(":").map(Number);
  const naief = Date.UTC(j, m - 1, dag, u, mi);
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Amsterdam", year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", hourCycle: "h23",
  });
  const probeer = (t0) => {
    const p = {};
    for (const x of fmt.formatToParts(new Date(t0))) p[x.type] = x.value;
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - t0;
  };
  let t1 = naief - probeer(naief - 3600000);
  t1 = naief - probeer(t1);
  return t1;
}

export function analyseerNeerslag(minutely, nu = Date.now()) {
  if (!minutely?.time?.length) return null;
  const reeks = minutely.time
    .map((t, i) => ({ tijd: tijdstipVan(t), mm: minutely.precipitation?.[i] ?? 0 }))
    .filter((k) => k.tijd + KWARTIER > nu);
  if (!reeks.length) return null;

  const nat = (k) => k.mm >= NAT_MM;
  const laatste = reeks[reeks.length - 1].tijd + KWARTIER;

  if (!nat(reeks[0])) {
    const bui = reeks.find(nat);
    if (!bui) return { soort: "lang-droog", tot: laatste };
    return { soort: "droog-tot", tijdstip: Math.max(nu, bui.tijd), mm: Math.round(bui.mm * 10) / 10 };
  }
  for (let i = 1; i + 3 < reeks.length; i++) {
    if (reeks.slice(i, i + 4).every((k) => !nat(k))) {
      return { soort: "nat-tot", tijdstip: reeks[i].tijd };
    }
  }
  return { soort: "lang-nat", tot: laatste };
}
