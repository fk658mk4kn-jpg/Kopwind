/**
 * lib/engine/minutely.js
 *
 * Client-helper voor de 15-minuten neerslagreeks, plus een parser die de
 * ruwe reeks omzet naar bruikbare blokken (eerstvolgende regen, piek,
 * eerstvolgende droge blok). Gedeeld door de timing- en paraplu-check.
 */

/** Haalt de 15-min reeks via onze eigen route. */
export async function haalMinutely(lat, lon, dagen = 1) {
  const res = await fetch(`/api/minutely?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&dagen=${dagen}`);
  if (!res.ok) {
    let boodschap = `Neerslag ophalen gaf ${res.status}`;
    try {
      const d = await res.json();
      if (d?.error) boodschap = d.error;
    } catch {
      // statusmelding behouden
    }
    throw new Error(boodschap);
  }
  const data = await res.json();
  return data.minutely;
}

const DROOG_MM = 0.1; // onder deze waarde noemen we een kwartier droog

/**
 * Zet de 15-min reeks om naar tijdstippen en analyseert de eerstkomende
 * uren vanaf `nu`. Geeft de eerstvolgende regen, de piek, het
 * eerstvolgende droge blok en of het binnen een uur gaat regenen.
 *
 * @returns {{
 *   punten: Array<{tijd: Date, mm: number, kans: number, nat: boolean}>,
 *   eersteRegen: {tijd: Date, mm: number} | null,
 *   piek: {tijd: Date, mm: number} | null,
 *   eersteDroog: {tijd: Date} | null,
 *   binnenEenUur: boolean,
 *   nuNat: boolean
 * }}
 */
export function analyseerMinutely(minutely, nu = new Date()) {
  const tijden = minutely?.time ?? [];
  const neerslag = minutely?.precipitation ?? [];
  const kansen = minutely?.precipitation_probability ?? [];

  const punten = [];
  for (let i = 0; i < tijden.length; i++) {
    const tijd = new Date(tijden[i]);
    if (tijd.getTime() < nu.getTime() - 15 * 60 * 1000) continue; // verleden overslaan
    const mm = neerslag[i] ?? 0;
    punten.push({ tijd, mm, kans: kansen[i] ?? 0, nat: mm >= DROOG_MM });
  }

  const komend = punten.filter((p) => p.tijd.getTime() >= nu.getTime() - 15 * 60 * 1000);
  const nuNat = komend.length > 0 && komend[0].nat;

  let eersteRegen = null;
  for (const p of komend) {
    if (p.nat) {
      eersteRegen = { tijd: p.tijd, mm: p.mm };
      break;
    }
  }

  let piek = null;
  for (const p of komend.slice(0, 24)) {
    if (p.mm > 0 && (!piek || p.mm > piek.mm)) piek = { tijd: p.tijd, mm: p.mm };
  }

  // Eerstvolgende droge blok: eerste moment dat nat is en daarna minstens
  // vier kwartier (een uur) droog blijft.
  let eersteDroog = null;
  if (nuNat) {
    for (let i = 0; i < komend.length; i++) {
      if (!komend[i].nat) {
        const venster = komend.slice(i, i + 4);
        if (venster.length && venster.every((p) => !p.nat)) {
          eersteDroog = { tijd: komend[i].tijd };
          break;
        }
      }
    }
  }

  const eenUur = nu.getTime() + 60 * 60 * 1000;
  const binnenEenUur = komend.some((p) => p.tijd.getTime() <= eenUur && p.nat);

  return { punten: komend, eersteRegen, piek, eersteDroog, binnenEenUur, nuNat };
}
