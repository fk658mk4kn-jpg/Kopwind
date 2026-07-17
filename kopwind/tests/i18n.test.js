import test from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";

/**
 * i18n-smoke: draait een klein script met NEXT_PUBLIC_SITE_LOCALE=en in
 * een kindproces (de taal wordt bij module-import gebakken, dus binnen
 * dit proces kunnen we niet wisselen).
 */
function draaiEn(script) {
  return execSync(`node -e "${script.replace(/"/g, '\\"')}"`, {
    env: { ...process.env, NEXT_PUBLIC_SITE_LOCALE: "en" },
    encoding: "utf8",
  }).trim();
}

test("en-build: wascheck praat Engels", () => {
  const uit = draaiEn(`
    import('./lib/tools/was-buiten-drogen.js').then(m => {
      const h = { time: [], temperature_2m: [], apparent_temperature: [], precipitation: [], precipitation_probability: [], wind_speed_10m: [], relative_humidity_2m: [], cloud_cover: [], is_day: [] };
      for (let u = 0; u < 24; u++) { h.time.push('2026-07-13T' + String(u).padStart(2,'0') + ':00'); h.temperature_2m.push(19); h.apparent_temperature.push(19); h.precipitation.push(0); h.precipitation_probability.push(5); h.wind_speed_10m.push(15); h.relative_humidity_2m.push(55); h.cloud_cover.push(30); h.is_day.push(u>=6&&u<=21?1:0); }
      const [dag] = m.berekenDroogdagen(h, new Date(2026, 6, 13, 9, 0));
      console.log(dag.status.zin);
    });
  `);
  assert.match(uit, /Hang it out now: dry around/);
});

test("en-build: bbq-rookzin gebruikt Engelse windstreken", () => {
  const uit = draaiEn(`
    import('./lib/tools/barbecue.js').then(m => {
      console.log(m.rookZin([{ richting: 225 }]));
    });
  `);
  assert.match(uit, /southwest/);
  assert.match(uit, /northeast/);
});

test("en-build: register levert Engelse slugs en het merk klopt", () => {
  const uit = draaiEn(`
    Promise.all([import('./lib/tools/index.js'), import('./lib/brand.js')]).then(([t, b]) => {
      console.log(t.TOOLS.map(x => x.slug).join(',') + '|' + b.HUB_NAAM);
    });
  `);
  assert.equal(uit, "bike-to-work,running-weather,walking,outdoor-workout,padel-or-tennis,dry-laundry-outside,wash-the-car,mow-the-lawn,clean-the-windows,solar-panels,what-to-wear,patio-weather,bbq-weather,beach-weather,picnic-weather,outdoor-swimming,sup-or-kayak,stargazing,sunscreen,hay-fever,when-will-it-rain,umbrella-today,windscreen-frost,icy-roads|Good day for it?");
});

test("nl blijft de standaard zonder env", () => {
  const uit = execSync(
    "node -e \"import('./lib/brand.js').then(m => console.log(m.HUB_NAAM))\"",
    { env: { ...process.env, NEXT_PUBLIC_SITE_LOCALE: "" }, encoding: "utf8" }
  ).trim();
  assert.equal(uit, "Kan het vandaag?");
});
