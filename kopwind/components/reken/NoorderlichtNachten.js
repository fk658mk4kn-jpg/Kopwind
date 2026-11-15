"use client";

import { useEffect, useState } from "react";
import PlekKiezer, { DE_BILT } from "@/components/aftellen/PlekKiezer";
import { haalWeer } from "@/lib/engine/weather";

/**
 * Per nacht: de verwachte Kp (van de server meegegeven) naast de
 * bewolking voor de gekozen plek tussen 21:00 en 04:00 uur.
 */
function bewolkingPerNacht(hourly, datum) {
  const [j, m, d] = datum.split("-").map(Number);
  const volgende = new Date(Date.UTC(j, m - 1, d + 1)).toISOString().slice(0, 10);
  const waarden = [];
  hourly.time.forEach((t, i) => {
    const [dag, tijd] = t.split("T");
    const u = Number(tijd.slice(0, 2));
    if ((dag === datum && u >= 21) || (dag === volgende && u <= 4)) {
      if (hourly.cloud_cover?.[i] != null) waarden.push(hourly.cloud_cover[i]);
    }
  });
  if (!waarden.length) return null;
  return Math.round(waarden.reduce((a, b) => a + b, 0) / waarden.length);
}

function wolkenZin(pct) {
  if (pct == null) return "Bewolking nog niet bekend";
  if (pct <= 25) return `Grotendeels helder (${pct}% bewolking)`;
  if (pct <= 60) return `Wisselend bewolkt (${pct}%), kijk tussen de wolken door`;
  return `Bewolkt (${pct}%), weinig kans om iets te zien`;
}

const DAG = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];

export default function NoorderlichtNachten({ nachten }) {
  const [plek, setPlek] = useState(DE_BILT);
  const [wolken, setWolken] = useState({});

  useEffect(() => {
    let weg = false;
    haalWeer(plek.lat, plek.lon, ["cloud_cover"], 4)
      .then((h) => {
        if (weg) return;
        const uit = {};
        for (const n of nachten) uit[n.datum] = bewolkingPerNacht(h, n.datum);
        setWolken(uit);
      })
      .catch(() => {});
    return () => {
      weg = true;
    };
  }, [plek.lat, plek.lon, nachten]);

  return (
    <section className="paneel aftel-hoofd">
      <PlekKiezer plek={plek} onKies={setPlek} />
      <div className="aftel-regios">
        {nachten.map((n) => {
          const [j, m, d] = n.datum.split("-").map(Number);
          const wd = DAG[new Date(Date.UTC(j, m - 1, d)).getUTCDay()];
          const helder = wolken[n.datum];
          const kans = n.oordeel.niveau > 0 && helder != null && helder > 60 ? `${n.oordeel.woord}, maar bewolkt` : n.oordeel.woord;
          return (
            <div key={n.datum} className="paneel aftel-regio">
              <h2 className="paneel-titel">
                Nacht van {wd} {d}-{m}
              </h2>
              <p className="aftel-groot klein">Kp {n.kp.toFixed(1).replace(".", ",")}</p>
              <p className="aftel-datum">{kans}</p>
              <p className="aftel-sub">{n.oordeel.zin}</p>
              <p className="aftel-sub">{wolkenZin(helder)}</p>
            </div>
          );
        })}
      </div>
      <p className="aftel-voetnoot">Kp: verwachting NOAA SWPC per blok van drie uur, hoogste waarde tussen 18:00 en 06:00. Bewolking: Open-Meteo, gemiddeld tussen 21:00 en 04:00 voor {plek.naam}.</p>
    </section>
  );
}
