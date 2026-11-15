/**
 * lib/maan.js
 *
 * Maanfasen (v3.37.0 "Föhn"), naar Meeus, Astronomical Algorithms,
 * hoofdstuk 49. Nieuwe maan, eerste kwartier, volle maan en laatste
 * kwartier op ongeveer een minuut nauwkeurig; de kleine planetaire
 * correcties (hooguit een halve minuut) zijn weggelaten. Puur rekenwerk,
 * geen API.
 */

const RAD = Math.PI / 180;
const DAG_MS = 86400000;
export const SYNODISCHE_MAAND = 29.530588861;

const sin = (x) => Math.sin(x * RAD);
const cos = (x) => Math.cos(x * RAD);

/** soort: 0 nieuwe maan, 1 eerste kwartier, 2 volle maan, 3 laatste kwartier. */
function faseJde(kGeheel, soort) {
  const k = kGeheel + soort / 4;
  const T = k / 1236.85;
  const jde0 =
    2451550.09766 + 29.530588861 * k + 0.00015437 * T ** 2 - 0.00000015 * T ** 3 + 0.00000000073 * T ** 4;
  const E = 1 - 0.002516 * T - 0.0000074 * T ** 2;
  const M = 2.5534 + 29.1053567 * k - 0.0000014 * T ** 2 - 0.00000011 * T ** 3;
  const Mp = 201.5643 + 385.81693528 * k + 0.0107582 * T ** 2 + 0.00001238 * T ** 3 - 0.000000058 * T ** 4;
  const F = 160.7108 + 390.67050284 * k - 0.0016118 * T ** 2 - 0.00000227 * T ** 3 + 0.000000011 * T ** 4;
  const Om = 124.7746 - 1.56375588 * k + 0.0020672 * T ** 2 + 0.00000215 * T ** 3;

  const staart =
    -0.00007 * sin(Mp + 2 * M) + 0.00004 * sin(2 * Mp - 2 * F) + 0.00004 * sin(3 * M) +
    0.00003 * sin(Mp + M - 2 * F) + 0.00003 * sin(2 * Mp + 2 * F) - 0.00003 * sin(Mp + M + 2 * F) +
    0.00003 * sin(Mp - M + 2 * F) - 0.00002 * sin(Mp - M - 2 * F) - 0.00002 * sin(3 * Mp + M) +
    0.00002 * sin(4 * Mp);

  let c;
  if (soort === 0 || soort === 2) {
    const vol = soort === 2;
    c =
      (vol ? -0.40614 : -0.4072) * sin(Mp) +
      (vol ? 0.17302 : 0.17241) * E * sin(M) +
      (vol ? 0.01614 : 0.01608) * sin(2 * Mp) +
      (vol ? 0.01043 : 0.01039) * sin(2 * F) +
      (vol ? 0.00734 : 0.00739) * E * sin(Mp - M) +
      (vol ? -0.00515 : -0.00514) * E * sin(Mp + M) +
      (vol ? 0.00209 : 0.00208) * E * E * sin(2 * M) -
      0.00111 * sin(Mp - 2 * F) - 0.00057 * sin(Mp + 2 * F) + 0.00056 * E * sin(2 * Mp + M) -
      0.00042 * sin(3 * Mp) + 0.00042 * E * sin(M + 2 * F) + 0.00038 * E * sin(M - 2 * F) -
      0.00024 * E * sin(2 * Mp - M) - 0.00017 * sin(Om) + staart;
  } else {
    c =
      -0.62801 * sin(Mp) + 0.17172 * E * sin(M) - 0.01183 * E * sin(Mp + M) + 0.00862 * sin(2 * Mp) +
      0.00804 * sin(2 * F) + 0.00454 * E * sin(Mp - M) + 0.00204 * E * E * sin(2 * M) -
      0.0018 * sin(Mp - 2 * F) - 0.0007 * sin(Mp + 2 * F) - 0.0004 * sin(3 * Mp) -
      0.00034 * E * sin(2 * Mp - M) + 0.00032 * E * sin(M + 2 * F) + 0.00032 * E * sin(M - 2 * F) -
      0.00028 * E * E * sin(Mp + 2 * M) + 0.00027 * E * sin(2 * Mp + M) - 0.00017 * sin(Om) -
      0.00005 * sin(Mp - M - 2 * F) + 0.00004 * sin(2 * Mp + 2 * F) - 0.00004 * sin(Mp + M + 2 * F) +
      0.00004 * sin(Mp - 2 * M) + 0.00003 * sin(Mp + M - 2 * F) + 0.00003 * sin(3 * M) +
      0.00002 * sin(2 * Mp - 2 * F) + 0.00002 * sin(Mp - M + 2 * F) - 0.00002 * sin(3 * Mp + M);
    const W =
      0.00306 - 0.00038 * E * cos(M) + 0.00026 * cos(Mp) - 0.00002 * cos(Mp - M) +
      0.00002 * cos(Mp + M) + 0.00002 * cos(2 * F);
    c += soort === 1 ? W : -W;
  }
  return jde0 + c;
}

/** JDE (TT) naar een UTC-tijdstip in ms; TT loopt ongeveer 69 s voor. */
function jdeNaarMs(jde) {
  return (jde - 2440587.5) * DAG_MS - 69000;
}

export const FASE_NAMEN = ["Nieuwe maan", "Eerste kwartier", "Volle maan", "Laatste kwartier"];

/** Alle fasen tussen twee tijdstippen, oplopend. */
export function fasenTussen(vanMs, totMs) {
  const jaar = new Date(vanMs).getUTCFullYear() + new Date(vanMs).getUTCMonth() / 12;
  let k = Math.floor((jaar - 2000) * 12.3685) - 1;
  const lijst = [];
  for (let n = 0; n < 400; n++, k++) {
    for (let soort = 0; soort < 4; soort++) {
      const t = jdeNaarMs(faseJde(k, soort));
      if (t > totMs) return lijst;
      if (t >= vanMs) lijst.push({ soort, naam: FASE_NAMEN[soort], tijdstip: t });
    }
  }
  return lijst;
}

/** Volle manen (of een andere fase) die in een kalenderjaar beginnen. */
export function fasenInJaar(jaar, soort = 2) {
  const van = Date.UTC(jaar, 0, 1) - 2 * 3600000;
  const tot = Date.UTC(jaar + 1, 0, 1) - 2 * 3600000;
  return fasenTussen(van, tot).filter((f) => f.soort === soort);
}

export function volgendeFase(soort, nu = Date.now()) {
  return fasenTussen(nu, nu + 40 * DAG_MS).find((f) => f.soort === soort) ?? null;
}

/**
 * De maan van dit moment: leeftijd in dagen sinds de laatste nieuwe maan,
 * verlicht percentage en een fasenaam in gewone taal.
 */
export function maanNu(nu = Date.now()) {
  const fasen = fasenTussen(nu - 32 * DAG_MS, nu + 1);
  const laatsteNieuw = [...fasen].reverse().find((f) => f.soort === 0);
  const leeftijd = (nu - laatsteNieuw.tijdstip) / DAG_MS;
  const hoek = (leeftijd / SYNODISCHE_MAAND) * 2 * Math.PI;
  const verlicht = Math.round(((1 - Math.cos(hoek)) / 2) * 100);
  const deel = leeftijd / SYNODISCHE_MAAND;
  let naam;
  if (deel < 0.033 || deel > 0.967) naam = "Nieuwe maan";
  else if (deel < 0.216) naam = "Wassende sikkel";
  else if (deel < 0.284) naam = "Eerste kwartier";
  else if (deel < 0.466) naam = "Wassende maan";
  else if (deel < 0.534) naam = "Volle maan";
  else if (deel < 0.716) naam = "Afnemende maan";
  else if (deel < 0.784) naam = "Laatste kwartier";
  else naam = "Afnemende sikkel";
  return { leeftijd: Math.round(leeftijd * 10) / 10, verlicht, naam, wassend: deel < 0.5 };
}
