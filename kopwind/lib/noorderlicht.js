/**
 * lib/noorderlicht.js
 *
 * Noorderlichtkans voor Nederland (v3.37.0). Bron: de Kp-verwachting van
 * NOAA SWPC (publiek domein). Die verandert in 2026 van formaat (SCN
 * 26-21): van een lijst met een kopregel naar een lijst met objecten.
 * De parser leest beide, zodat een omschakeling bij NOAA de pagina niet
 * breekt.
 *
 * Drempels voor Nederland (geomagnetische breedte rond 50 graden): vanaf
 * Kp 5 soms op een camera aan de noordhorizon in het noorden, vanaf Kp 6
 * met het blote oog in het noorden, vanaf Kp 7 in het hele land.
 */

export const KP_BRON = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index-forecast.json";

/** NOAA-tijd "2026-11-15 03:00:00" (UTC) naar ms. */
function tijdNaarMs(t) {
  const s = String(t).trim().replace(" ", "T");
  return Date.parse(/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? s : `${s}Z`);
}

function rij(obj) {
  const sleutels = Object.keys(obj);
  const tijdKey = sleutels.find((k) => /time/i.test(k));
  const kpKey = sleutels.find((k) => /^kp$/i.test(k)) ?? sleutels.find((k) => /kp/i.test(k));
  const soortKey = sleutels.find((k) => /observ/i.test(k));
  return { tijd: obj[tijdKey], kp: obj[kpKey], soort: obj[soortKey] };
}

/** Leest beide NOAA-formaten; geeft [{ tijd (ms), kp, soort }] oplopend. */
export function parseKp(json) {
  if (!Array.isArray(json) || !json.length) return [];
  let ruw;
  if (Array.isArray(json[0])) {
    const kop = json[0].map(String);
    ruw = json.slice(1).map((r) => rij(Object.fromEntries(kop.map((k, i) => [k, r[i]]))));
  } else {
    ruw = json.map(rij);
  }
  return ruw
    .map((r) => ({ tijd: tijdNaarMs(r.tijd), kp: Number(r.kp), soort: r.soort ? String(r.soort) : "onbekend" }))
    .filter((r) => Number.isFinite(r.tijd) && Number.isFinite(r.kp))
    .sort((a, b) => a.tijd - b.tijd);
}

export function kpOordeel(kp) {
  if (kp >= 7) return { niveau: 3, woord: "Kans in heel Nederland", zin: "Sterke activiteit: bij een heldere hemel is het noorderlicht in het hele land te zien, ook hoger aan de hemel." };
  if (kp >= 6) return { niveau: 2, woord: "Kans in het noorden", zin: "Zichtbaar met het blote oog boven het noorden van het land, laag aan de noordhorizon. Zuidelijker vooral op camera." };
  if (kp >= 5) return { niveau: 1, woord: "Alleen op camera", zin: "Een telefooncamera met nachtstand kan een rode of groene gloed aan de noordhorizon vastleggen, vooral in het noorden. Met het oog zie je weinig." };
  return { niveau: 0, woord: "Geen kans", zin: "De activiteit is te laag voor Nederland. Het noorderlicht blijft boven Scandinavie." };
}

/**
 * Per nacht (18:00 tot 06:00 Nederlandse tijd) de hoogste verwachte Kp.
 * Een 3-uursblok telt mee als het de nacht overlapt.
 */
export function nachten(kpLijst, nu = Date.now(), aantal = 3) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Amsterdam", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", hourCycle: "h23",
  });
  const lokaal = (ms) => {
    const p = {};
    for (const x of fmt.formatToParts(new Date(ms))) p[x.type] = x.value;
    return { j: +p.year, m: +p.month, d: +p.day, u: +p.hour };
  };
  const nachtSleutel = (ms) => {
    const l = lokaal(ms);
    // 00:00 tot 06:00 hoort bij de avond ervoor.
    const basis = l.u < 12 ? new Date(Date.UTC(l.j, l.m - 1, l.d) - 86400000) : new Date(Date.UTC(l.j, l.m - 1, l.d));
    const inNacht = l.u >= 18 || l.u < 6;
    return inNacht ? basis.toISOString().slice(0, 10) : null;
  };
  const per = new Map();
  for (const r of kpLijst) {
    if (r.tijd + 3 * 3600000 < nu) continue;
    for (const ms of [r.tijd, r.tijd + 90 * 60000, r.tijd + 179 * 60000]) {
      const k = nachtSleutel(ms);
      if (!k) continue;
      const huidig = per.get(k);
      if (!huidig || r.kp > huidig.kp) per.set(k, { datum: k, kp: r.kp, tijd: r.tijd, soort: r.soort });
    }
  }
  return [...per.values()].sort((a, b) => a.datum.localeCompare(b.datum)).slice(0, aantal);
}

/** Server-side ophalen, met een korte time-out; null bij een fout. */
export async function haalKp() {
  try {
    const res = await fetch(KP_BRON, { next: { revalidate: 900 }, signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const lijst = parseKp(await res.json());
    return lijst.length ? lijst : null;
  } catch {
    return null;
  }
}
