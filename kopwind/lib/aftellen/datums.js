/**
 * lib/aftellen/datums.js
 *
 * Pure datumrekenwerk voor de aftelpagina's (v3.35.0 "Bise"). Alles werkt
 * met kalenderdatums als { j, m, d } (maand 1 tot 12) in Nederlandse
 * wandkloktijd, zodat een telling nooit een dag verspringt doordat de
 * server in UTC draait. Geen afhankelijkheden, volledig testbaar.
 */

const TZ = "Europe/Amsterdam";
const DAG_MS = 86400000;

export function ymd(j, m, d) {
  return { j, m, d };
}

/** Dagnummer sinds 1970 voor een kalenderdatum (tijdzone-loos). */
export function dagNummer({ j, m, d }) {
  return Math.round(Date.UTC(j, m - 1, d) / DAG_MS);
}

export function uitDagNummer(n) {
  const t = new Date(n * DAG_MS);
  return { j: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}

export function plusDagen(datum, n) {
  return uitDagNummer(dagNummer(datum) + n);
}

export function dagenTussen(van, tot) {
  return dagNummer(tot) - dagNummer(van);
}

/** 0 = zondag, 6 = zaterdag. */
export function weekdag(datum) {
  return new Date(Date.UTC(datum.j, datum.m - 1, datum.d)).getUTCDay();
}

export function vergelijk(a, b) {
  return dagNummer(a) - dagNummer(b);
}

export function sleutel({ j, m, d }) {
  return `${j}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function uitSleutel(s) {
  const [j, m, d] = s.split("-").map(Number);
  return { j, m, d };
}

/* ------------------------------------------------------------------ */
/* Tijdzone                                                            */
/* ------------------------------------------------------------------ */

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hourCycle: "h23",
});

/** Nederlandse wandklok voor een tijdstip (ms of Date). */
export function wandklok(tijdstip = Date.now()) {
  const delen = {};
  for (const p of fmt.formatToParts(new Date(tijdstip))) delen[p.type] = p.value;
  return {
    j: Number(delen.year),
    m: Number(delen.month),
    d: Number(delen.day),
    u: Number(delen.hour),
    mi: Number(delen.minute),
    s: Number(delen.second),
  };
}

export function vandaag(tijdstip = Date.now()) {
  const w = wandklok(tijdstip);
  return { j: w.j, m: w.m, d: w.d };
}

function offsetOp(tijdstip) {
  const w = wandklok(tijdstip);
  return Date.UTC(w.j, w.m - 1, w.d, w.u, w.mi, w.s) - Math.floor(tijdstip / 1000) * 1000;
}

/** Het echte tijdstip (ms) van een Nederlandse wandkloktijd. */
export function amsterdamTijdstip({ j, m, d }, u = 0, mi = 0) {
  const naief = Date.UTC(j, m - 1, d, u, mi);
  let t = naief - offsetOp(naief - 3600000);
  t = naief - offsetOp(t);
  return t;
}

/* ------------------------------------------------------------------ */
/* Kalenderregels                                                      */
/* ------------------------------------------------------------------ */

/** De n-de weekdag van een maand; n = -1 is de laatste. */
export function nteWeekdag(j, m, wd, n) {
  if (n > 0) {
    const eerste = weekdag(ymd(j, m, 1));
    const d = 1 + ((wd - eerste + 7) % 7) + (n - 1) * 7;
    return ymd(j, m, d);
  }
  const laatsteDag = new Date(Date.UTC(j, m, 0)).getUTCDate();
  const wdLaatste = weekdag(ymd(j, m, laatsteDag));
  return ymd(j, m, laatsteDag - ((wdLaatste - wd + 7) % 7));
}

/** Eerste Paasdag (anonieme gregoriaanse rekenregel). */
export function pasen(j) {
  const a = j % 19;
  const b = Math.floor(j / 100);
  const c = j % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const mm = Math.floor((a + 11 * h + 22 * l) / 451);
  const maand = Math.floor((h + l - 7 * mm + 114) / 31);
  const dag = ((h + l - 7 * mm + 114) % 31) + 1;
  return ymd(j, maand, dag);
}

/** Koningsdag: 27 april, of zaterdag 26 april als de 27e een zondag is. */
export function koningsdag(j) {
  const k = ymd(j, 4, 27);
  return weekdag(k) === 0 ? ymd(j, 4, 26) : k;
}

/* ------------------------------------------------------------------ */
/* Seizoenen (Meeus, Astronomical Algorithms hfst. 27)                 */
/* ------------------------------------------------------------------ */

const TERMEN = [
  [485, 324.96, 1934.136], [203, 337.23, 32964.467], [199, 342.08, 20.186],
  [182, 27.85, 445267.112], [156, 73.14, 45036.886], [136, 171.52, 22518.443],
  [77, 222.54, 65928.934], [74, 296.72, 3034.906], [70, 243.58, 9037.513],
  [58, 119.81, 33718.147], [52, 297.17, 150.678], [50, 21.02, 2281.226],
  [45, 247.54, 29929.562], [44, 325.15, 31555.956], [29, 60.93, 4443.417],
  [18, 155.12, 67555.328], [17, 288.79, 4562.452], [16, 198.04, 62894.029],
  [14, 199.76, 31436.921], [12, 95.39, 14577.848], [12, 287.11, 31931.756],
  [12, 320.81, 34777.259], [9, 227.73, 1222.114], [8, 15.45, 16859.074],
];

const BASIS = {
  lente: [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057],
  zomer: [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.0003],
  herfst: [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078],
  winter: [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032],
};

const RAD = Math.PI / 180;

/** Tijdstip (ms) van het astronomische begin van een seizoen. */
export function seizoenTijdstip(seizoen, j) {
  const [a, b, c, d, e] = BASIS[seizoen];
  const Y = (j - 2000) / 1000;
  const jde0 = a + b * Y + c * Y ** 2 + d * Y ** 3 + e * Y ** 4;
  const T = (jde0 - 2451545.0) / 36525;
  const W = (35999.373 * T - 2.47) * RAD;
  const dl = 1 + 0.0334 * Math.cos(W) + 0.0007 * Math.cos(2 * W);
  let S = 0;
  for (const [A, B, C] of TERMEN) S += A * Math.cos((B + C * T) * RAD);
  const jde = jde0 + (0.00001 * S) / dl;
  // TT ligt ruim een minuut voor op UTC; voor een datum is dat verwaarloosbaar.
  return (jde - 2440587.5) * DAG_MS - 69000;
}

export function seizoenDatum(seizoen, j) {
  return vandaag(seizoenTijdstip(seizoen, j));
}

/* ------------------------------------------------------------------ */
/* Zon op en onder (zonsopkomstvergelijking, ongeveer een minuut nauw) */
/* ------------------------------------------------------------------ */

/**
 * Zonsopkomst en -ondergang voor een kalenderdatum op een plek, als
 * tijdstippen in ms. Geeft null-waarden bij poolnacht of middernachtszon
 * (komt in Nederland niet voor, maar de functie blijft eerlijk).
 */
export function zonTijden(datum, lat, lon) {
  const jdMiddag = dagNummer(datum) + 2440587.5 + 0.5;
  const n = jdMiddag - 2451545.0 + 0.0008;
  const jster = n - lon / 360;
  const M = (357.5291 + 0.98560028 * jster) % 360;
  const C =
    1.9148 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 0.0003 * Math.sin(3 * M * RAD);
  const lambda = (M + C + 180 + 102.9372) % 360;
  const transit =
    2451545.0 + jster + 0.0053 * Math.sin(M * RAD) - 0.0069 * Math.sin(2 * lambda * RAD);
  const sinDelta = Math.sin(lambda * RAD) * Math.sin(23.4397 * RAD);
  const cosDelta = Math.cos(Math.asin(sinDelta));
  const cosOmega =
    (Math.sin(-0.833 * RAD) - Math.sin(lat * RAD) * sinDelta) / (Math.cos(lat * RAD) * cosDelta);
  const naarMs = (jd) => (jd - 2440587.5) * DAG_MS;
  if (cosOmega > 1 || cosOmega < -1) {
    return { op: null, onder: null, middag: naarMs(transit) };
  }
  const omega = Math.acos(cosOmega) / RAD;
  return {
    op: naarMs(transit - omega / 360),
    onder: naarMs(transit + omega / 360),
    middag: naarMs(transit),
  };
}

/** Daglengte in minuten. */
export function daglengte(datum, lat, lon) {
  const { op, onder } = zonTijden(datum, lat, lon);
  if (op == null) return null;
  return Math.round((onder - op) / 60000);
}

/* ------------------------------------------------------------------ */
/* Werkdagen                                                           */
/* ------------------------------------------------------------------ */

/** Officiele vrije dagen die op een werkdag kunnen vallen. */
export function vrijeDagen(j) {
  const p = pasen(j);
  const lijst = [
    ymd(j, 1, 1),
    plusDagen(p, 1),
    koningsdag(j),
    plusDagen(p, 39),
    plusDagen(p, 50),
    ymd(j, 12, 25),
    ymd(j, 12, 26),
  ];
  // Bevrijdingsdag is in veel cao's alleen in lustrumjaren een vrije dag.
  if (j % 5 === 0) lijst.push(ymd(j, 5, 5));
  return new Set(lijst.map(sleutel));
}

/**
 * Werkdagen vanaf morgen tot en met de dag voor het doel: maandag tot en
 * met vrijdag, zonder de officiele feestdagen.
 */
export function werkdagenTot(vanaf, doel) {
  let teller = 0;
  const cache = new Map();
  for (let n = dagNummer(vanaf) + 1; n < dagNummer(doel); n++) {
    const d = uitDagNummer(n);
    const wd = weekdag(d);
    if (wd === 0 || wd === 6) continue;
    if (!cache.has(d.j)) cache.set(d.j, vrijeDagen(d.j));
    if (cache.get(d.j).has(sleutel(d))) continue;
    teller++;
  }
  return teller;
}

/* ------------------------------------------------------------------ */
/* Notatie                                                             */
/* ------------------------------------------------------------------ */

const MAANDEN = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];
const DAGEN = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];

export function datumTekst(datum, { metDag = false, metJaar = true } = {}) {
  const basis = `${datum.d} ${MAANDEN[datum.m - 1]}${metJaar ? ` ${datum.j}` : ""}`;
  return metDag ? `${DAGEN[weekdag(datum)]} ${basis}` : basis;
}

export function dagNaam(datum) {
  return DAGEN[weekdag(datum)];
}

export function tijdTekst(tijdstip) {
  const w = wandklok(tijdstip);
  return `${String(w.u).padStart(2, "0")}:${String(w.mi).padStart(2, "0")}`;
}

export function duurTekst(minuten) {
  const u = Math.floor(minuten / 60);
  const m = minuten % 60;
  if (u === 0) return `${m} minuten`;
  return `${u} uur en ${m} minuten`;
}

/* ------------------------------------------------------------------ */
/* Weeknummers, feestdagen en werkdagen (v3.37.0)                      */
/* ------------------------------------------------------------------ */

/** ISO 8601-week, zoals Nederland die gebruikt: week 1 bevat de eerste donderdag. */
export function isoWeek(datum) {
  const wd = (weekdag(datum) + 6) % 7; // maandag 0
  const donderdag = plusDagen(datum, 3 - wd);
  const jaar = donderdag.j;
  const eersteDonderdag = (() => {
    const jan1 = ymd(jaar, 1, 1);
    return plusDagen(jan1, (3 - ((weekdag(jan1) + 6) % 7) + 7) % 7);
  })();
  return { jaar, week: 1 + Math.round(dagenTussen(eersteDonderdag, donderdag) / 7) };
}

/** Maandag van een ISO-week. */
export function maandagVanWeek(jaar, week) {
  const jan4 = ymd(jaar, 1, 4);
  const maandagWeek1 = plusDagen(jan4, -((weekdag(jan4) + 6) % 7));
  return plusDagen(maandagWeek1, (week - 1) * 7);
}

export function wekenInJaar(jaar) {
  return isoWeek(ymd(jaar, 12, 28)).week;
}

/**
 * Feestdagen van een jaar met hun status. `vrij`: "ja" (erkende
 * feestdag, meestal vrij), "lustrum" (Bevrijdingsdag), "nee" (Goede
 * Vrijdag: geen algemeen erkende feestdag, staat er voor de
 * volledigheid bij), "zondag".
 */
export function feestdagenLijst(j) {
  const p = pasen(j);
  return [
    { id: "nieuwjaar", naam: "Nieuwjaarsdag", datum: ymd(j, 1, 1), vrij: "ja" },
    { id: "goede-vrijdag", naam: "Goede Vrijdag", datum: plusDagen(p, -2), vrij: "nee" },
    { id: "pasen1", naam: "Eerste Paasdag", datum: p, vrij: "zondag", teller: "pasen" },
    { id: "pasen2", naam: "Tweede Paasdag", datum: plusDagen(p, 1), vrij: "ja", teller: "pasen" },
    { id: "koningsdag", naam: "Koningsdag", datum: koningsdag(j), vrij: "ja", teller: "koningsdag" },
    { id: "bevrijdingsdag", naam: "Bevrijdingsdag", datum: ymd(j, 5, 5), vrij: j % 5 === 0 ? "ja" : "lustrum", teller: "bevrijdingsdag" },
    { id: "hemelvaart", naam: "Hemelvaartsdag", datum: plusDagen(p, 39), vrij: "ja", teller: "hemelvaart" },
    { id: "pinksteren1", naam: "Eerste Pinksterdag", datum: plusDagen(p, 49), vrij: "zondag", teller: "pinksteren" },
    { id: "pinksteren2", naam: "Tweede Pinksterdag", datum: plusDagen(p, 50), vrij: "ja", teller: "pinksteren" },
    { id: "kerst1", naam: "Eerste Kerstdag", datum: ymd(j, 12, 25), vrij: "ja", teller: "kerst" },
    { id: "kerst2", naam: "Tweede Kerstdag", datum: ymd(j, 12, 26), vrij: "ja", teller: "kerst" },
  ];
}

/** Werkdagen van van tot en met tot (beide meegeteld), zonder feestdagen. */
export function werkdagenTussen(van, tot) {
  if (dagenTussen(van, tot) < 0) return 0;
  return werkdagenTot(plusDagen(van, -1), plusDagen(tot, 1));
}

/** Werkdagen per maand voor een jaar, met de feestdagen die op een werkdag vallen. */
export function werkdagenPerMaand(j) {
  const vrij = vrijeDagen(j);
  return Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const laatste = new Date(Date.UTC(j, m, 0)).getUTCDate();
    let werk = 0;
    let feest = 0;
    for (let d = 1; d <= laatste; d++) {
      const dt = ymd(j, m, d);
      const wd = weekdag(dt);
      if (wd === 0 || wd === 6) continue;
      if (vrij.has(sleutel(dt))) feest++;
      else werk++;
    }
    return { maand: m, werkdagen: werk, feestdagen: feest, dagen: laatste };
  });
}

export const MAAND_NAMEN = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

/** Kalenderverschil in jaren, maanden en dagen (van <= tot). */
export function kalenderVerschil(van, tot) {
  let j = tot.j - van.j;
  let m = tot.m - van.m;
  let d = tot.d - van.d;
  if (d < 0) {
    m -= 1;
    d += new Date(Date.UTC(tot.j, tot.m - 1, 0)).getUTCDate();
  }
  if (m < 0) {
    j -= 1;
    m += 12;
  }
  return { jaren: j, maanden: m, dagen: d };
}

/** De eerstvolgende verjaardag (vandaag telt mee); 29 februari valt in gewone jaren op 28 februari. */
export function volgendeVerjaardag(geboren, vandaagDag) {
  const opJaar = (j) => {
    const schrikkel = (j % 4 === 0 && j % 100 !== 0) || j % 400 === 0;
    if (geboren.m === 2 && geboren.d === 29 && !schrikkel) return ymd(j, 2, 28);
    return ymd(j, geboren.m, geboren.d);
  };
  let datum = opJaar(vandaagDag.j);
  if (dagenTussen(vandaagDag, datum) < 0) datum = opJaar(vandaagDag.j + 1);
  return { datum, dagen: dagenTussen(vandaagDag, datum), wordt: datum.j - geboren.j };
}

/* ------------------------------------------------------------------ */
/* Dag van het jaar en schrikkeljaren (v3.39.0)                        */
/* ------------------------------------------------------------------ */

export function isSchrikkeljaar(j) {
  return (j % 4 === 0 && j % 100 !== 0) || j % 400 === 0;
}

export function dagenInJaar(j) {
  return isSchrikkeljaar(j) ? 366 : 365;
}

/** Dagnummer binnen het jaar: 1 januari is dag 1. */
export function dagVanJaar(datum) {
  return dagenTussen(ymd(datum.j, 1, 1), datum) + 1;
}

export function volgendSchrikkeljaar(j) {
  let x = j + 1;
  while (!isSchrikkeljaar(x)) x++;
  return x;
}
