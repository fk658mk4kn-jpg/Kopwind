import test from "node:test";
import assert from "node:assert/strict";
import { berekenDroogdagen, overlay } from "../lib/tools/was-buiten-drogen.js";

// Bouwt een synthetisch Open-Meteo hourly-blok voor 1 dag.
function maakHourly(datum, per) {
  const h = {
    time: [], temperature_2m: [], apparent_temperature: [], precipitation: [],
    precipitation_probability: [], wind_speed_10m: [], relative_humidity_2m: [],
    cloud_cover: [], is_day: [],
  };
  for (let uur = 0; uur < 24; uur++) {
    const w = per(uur);
    h.time.push(`${datum}T${String(uur).padStart(2, "0")}:00`);
    h.temperature_2m.push(w.temp);
    h.apparent_temperature.push(w.gevoel ?? w.temp);
    h.precipitation.push(w.neerslag);
    h.precipitation_probability.push(w.kans);
    h.wind_speed_10m.push(w.wind);
    h.relative_humidity_2m.push(w.rh);
    h.cloud_cover.push(w.bewolking ?? 60);
    h.is_day.push(uur >= 6 && uur <= 21 ? 1 : 0);
  }
  return h;
}

function maakMeerdaags(startDatum, dagenSpecs) {
  const alles = null;
  let uit;
  dagenSpecs.forEach((per, di) => {
    const d = new Date(`${startDatum}T00:00:00`);
    d.setDate(d.getDate() + di);
    const p = (n) => String(n).padStart(2, "0");
    const datum = `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    const dag = maakHourly(datum, per);
    if (!uit) uit = dag;
    else for (const k of Object.keys(uit)) uit[k].push(...dag[k]);
  });
  return uit;
}

const cijfer = (dag) => (100 - dag.conditie.score) / 10;
const primaDroog = () => ({ temp: 19, neerslag: 0, kans: 5, wind: 15, rh: 55, bewolking: 30 });

test("acceptatie: hele dag droog, gecheckt om 18:24, geeft conditie >= 8 en status te laat", () => {
  const hourly = maakMeerdaags("2026-07-12", [primaDroog, primaDroog]);
  const [dag] = berekenDroogdagen(hourly, new Date(2026, 6, 12, 18, 24));
  assert.ok(cijfer(dag) >= 8, `conditie hoort >= 8, kreeg ${cijfer(dag)}`);
  assert.equal(dag.status.soort, "te-laat");
  assert.match(dag.status.zin, /te laat/i);
  assert.match(dag.status.zin, /morgenvroeg/i);
  assert.equal(dag.antwoord.ja, false, "te laat vandaag is een nee");
  assert.match(dag.metric.zin, /Drogen duurt bij dit weer/);
});

test("acceptatie: warm, winderig en droog met de hele dag beschikbaar is 9 tot 10", () => {
  const hourly = maakHourly("2026-07-12", () => ({
    temp: 24, neerslag: 0, kans: 5, wind: 22, rh: 45, bewolking: 15,
  }));
  const [dag] = berekenDroogdagen(hourly, new Date(2026, 6, 12, 9, 0));
  assert.ok(cijfer(dag) >= 9, `kreeg ${cijfer(dag)}`);
  assert.ok(["nu", "later"].includes(dag.status.soort));
  assert.match(dag.status.zin, /rond \d{2}:\d{2} droog/);
  assert.equal(dag.antwoord.ja, true);
});

test("acceptatie: koel, vochtig maar droog is 6 tot 7, niet 10, en status legt traagheid uit", () => {
  const hourly = maakHourly("2026-07-12", () => ({
    temp: 8, neerslag: 0, kans: 10, wind: 6, rh: 82, bewolking: 90,
  }));
  const [dag] = berekenDroogdagen(hourly, new Date(2026, 6, 12, 9, 0));
  assert.ok(cijfer(dag) >= 6 && cijfer(dag) <= 7.4, `kreeg ${cijfer(dag)}`);
  assert.equal(dag.status.soort, "traag");
  assert.ok(dag.conditie.redenen.some((r) => r.includes("traag")));
});

test("acceptatie: regen het grootste deel van de dag is 3 of lager", () => {
  const hourly = maakHourly("2026-07-12", (uur) => ({
    temp: 15,
    neerslag: uur === 13 ? 0 : 0.8,
    kans: uur === 13 ? 10 : 85,
    wind: 10,
    rh: 90,
  }));
  const [dag] = berekenDroogdagen(hourly, new Date(2026, 6, 12, 7, 0));
  assert.ok(cijfer(dag) <= 3, `kreeg ${cijfer(dag)}`);
  assert.equal(dag.conditie.advies, "binnen drogen");
  assert.equal(dag.status.soort, "nee");
  assert.equal(dag.antwoord.ja, false);
});

test("acceptatie: vijf gevarieerde dagen spreiden over de schaal", () => {
  const regen = () => ({ temp: 14, neerslag: 1, kans: 90, wind: 10, rh: 92 });
  const koelVochtig = () => ({ temp: 8, neerslag: 0, kans: 10, wind: 5, rh: 83, bewolking: 95 });
  const half = (uur) => (uur < 14 ? primaDroog() : regen());
  const top = () => ({ temp: 23, neerslag: 0, kans: 5, wind: 20, rh: 48, bewolking: 20 });
  const hourly = maakMeerdaags("2026-07-12", [top, regen, half, koelVochtig, primaDroog]);
  const dagen = berekenDroogdagen(hourly, new Date(2026, 6, 12, 8, 0));
  assert.equal(dagen.length, 5);
  const cijfers = dagen.map(cijfer);
  assert.ok(cijfers.filter((c) => c >= 9).length <= 2, `te veel negens: ${cijfers}`);
  assert.ok(Math.min(...cijfers) <= 4);
  assert.ok(cijfers.some((c) => c > 4 && c < 8.5), `middenmoot ontbreekt: ${cijfers}`);
});

test("consistentie: zegt de status hang op, dan zegt het label nooit binnen drogen", () => {
  // Grotendeels natte dag met een sterk droog blok van 3 uur.
  const hourly = maakHourly("2026-07-12", (uur) => ({
    temp: 19,
    neerslag: uur >= 10 && uur < 13 ? 0 : 0.7,
    kans: uur >= 10 && uur < 13 ? 10 : 85,
    wind: 20,
    rh: 50,
    bewolking: 30,
  }));
  const [dag] = berekenDroogdagen(hourly, new Date(2026, 6, 12, 9, 0));
  assert.ok(["nu", "later"].includes(dag.status.soort), dag.status.zin);
  assert.notEqual(dag.conditie.advies, "binnen drogen");
});

test("overlay levert legenda en strip-uren volgens het contract", () => {
  const res = overlay(maakHourly("2026-07-12", primaDroog), new Date(2026, 6, 12, 9, 0));
  assert.equal(res.legenda.links, "blijft nat");
  const dag = res.dagen[0];
  assert.ok(dag.uren.every((u) => "uur" in u && "score" in u && "nat" in u));
  assert.ok(dag.venster.van >= 8 && dag.venster.tot <= 20);
});
