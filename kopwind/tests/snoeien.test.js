import test from "node:test";
import assert from "node:assert/strict";
import { snoeien, inBroedseizoen } from "../lib/tools/snoeien.js";
import { schaalVoor } from "../lib/engine/schaal.js";

/**
 * Snoeicheck (v3.27.0): weerlaag (vorst rond de snoeidag, natte dagen,
 * hitte) plus seizoenslaag (maandzin, broedseizoen-noot bij hagen).
 * De vorstregel telt de nacht erna mee, dus de testdata vult twee
 * etmalen, zelfde patroon als de krabtest.
 */

function maakDagen({ dagTemp = 15, nachtTemp = 10, regen = 0, datum = "2026-07-17" }) {
  const volgende = new Date(`${datum}T12:00:00`);
  volgende.setDate(volgende.getDate() + 1);
  const d2 = `${volgende.getFullYear()}-${String(volgende.getMonth() + 1).padStart(2, "0")}-${String(volgende.getDate()).padStart(2, "0")}`;
  const time = [];
  const temperature_2m = [];
  const apparent_temperature = [];
  const precipitation = [];
  for (const [dag, isEerste] of [[datum, true], [d2, false]]) {
    for (let u = 0; u < 24; u++) {
      time.push(`${dag}T${String(u).padStart(2, "0")}:00`);
      const t = u < 8 ? nachtTemp : dagTemp;
      temperature_2m.push(t);
      apparent_temperature.push(t);
      precipitation.push(isEerste && u >= 10 && u < 10 + regen ? 1.2 : 0);
    }
  }
  return { time, temperature_2m, apparent_temperature, precipitation };
}

const NU = new Date("2026-07-17T08:00:00");

test("snoeien: milde droge dag is een prima snoeidag", () => {
  const dag = snoeien.overlay(maakDagen({}), NU).dagen[0];
  assert.equal(dag.antwoord.ja, true);
  assert.equal(schaalVoor(dag.conditie.score).id, "ideaal");
  assert.ok(/Juli/.test(dag.metric.zin), dag.metric.zin);
});

test("snoeien: vorst in de nacht erna zet het antwoord op nee", () => {
  const dag = snoeien.overlay(maakDagen({ dagTemp: 4, nachtTemp: -2, datum: "2026-02-10" }), new Date("2026-02-10T09:00:00")).dagen[0];
  assert.equal(dag.antwoord.ja, false);
  assert.ok(dag.conditie.score >= 62, `vorst hoort zwaar te wegen, kreeg ${dag.conditie.score}`);
});

test("snoeien: een natte dag is geen snoeidag", () => {
  const dag = snoeien.overlay(maakDagen({ regen: 4 }), NU).dagen[0];
  assert.equal(dag.antwoord.ja, false);
  assert.ok(/schimmel|nat/i.test(dag.status.zin), dag.status.zin);
});

test("snoeien: haag-instelling geeft de nestnoot in het broedseizoen", () => {
  const mei = new Date("2026-05-10T09:00:00");
  const zonder = snoeien.overlay(maakDagen({ datum: "2026-05-10" }), mei).dagen[0];
  assert.ok(!/nest/i.test(zonder.antwoord.zin));
  const met = snoeien.overlay(maakDagen({ datum: "2026-05-10" }), mei, { snoeitHagen: 1 }).dagen[0];
  assert.ok(/nest/i.test(met.antwoord.zin), met.antwoord.zin);
});

test("broedseizoen: 15 maart tot en met 15 juli", () => {
  assert.equal(inBroedseizoen(new Date("2026-03-14")), false);
  assert.equal(inBroedseizoen(new Date("2026-03-15")), true);
  assert.equal(inBroedseizoen(new Date("2026-07-15")), true);
  assert.equal(inBroedseizoen(new Date("2026-07-16")), false);
});
