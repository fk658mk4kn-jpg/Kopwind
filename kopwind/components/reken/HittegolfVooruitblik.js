"use client";

import { useEffect, useState } from "react";
import { haalWeer } from "@/lib/engine/weather";
import { dagMaxima, toetsHittegolf } from "@/lib/hittegolf";

const DAG = ["zo", "ma", "di", "wo", "do", "vr", "za"];

/** De komende zeven dagen in De Bilt, getoetst aan de KNMI-definitie. */
export default function HittegolfVooruitblik() {
  const [staat, setStaat] = useState({ laden: true });
  useEffect(() => {
    haalWeer(52.1, 5.18, ["temperature_2m"], 7)
      .then((h) => {
        const dagen = dagMaxima(h).slice(0, 7);
        setStaat({ dagen, toets: toetsHittegolf(dagen) });
      })
      .catch(() => setStaat({ fout: true }));
  }, []);
  if (staat.laden) return <section className="paneel aftel-hoofd"><p className="aftel-sub">Verwachting voor De Bilt ophalen...</p></section>;
  if (staat.fout) return <section className="paneel aftel-hoofd"><p className="aftel-sub">De verwachting is nu niet bereikbaar. De uitleg hieronder blijft gelden.</p></section>;
  const { dagen, toets } = staat;
  let groot = "Nee";
  let zin = "Geen hittegolf in de verwachting voor de komende week.";
  if (toets.hittegolf) {
    groot = "Ja";
    zin = "De verwachting voldoet aan de definitie: vijf of meer zomerse dagen op rij met minstens drie tropische.";
  } else if (toets.tropisch > 0 || (toets.reeks && toets.reeks.lengte >= 3)) {
    groot = "Misschien";
    zin = `Er zitten ${toets.zomers} zomerse en ${toets.tropisch} tropische dagen in de verwachting, nog niet genoeg op rij voor een officiele hittegolf.`;
  } else if (toets.zomers > 0) {
    zin = `Wel ${toets.zomers} zomerse ${toets.zomers === 1 ? "dag" : "dagen"} (25 graden of meer), maar geen hittegolf.`;
  }
  return (
    <section className="paneel aftel-hoofd">
      <p className="aftel-label">Hittegolf in De Bilt de komende week?</p>
      <p className="aftel-groot klein">{groot}</p>
      <p className="aftel-sub">{zin}</p>
      <div className="aftel-weer-rij">
        {dagen.map((d) => {
          const [j, m, dd] = d.datum.split("-").map(Number);
          const soort = d.max >= 30 ? "Tropisch" : d.max >= 25 ? "Zomers" : "";
          return (
            <div key={d.datum} className="aftel-weer-dag">
              <strong>
                {DAG[new Date(Date.UTC(j, m - 1, dd)).getUTCDay()]} {dd}-{m}
              </strong>
              <span>max {Math.round(d.max)}°</span>
              {soort && <span className="aftel-weer-type">{soort}</span>}
            </div>
          );
        })}
      </div>
      <p className="aftel-voetnoot">Hoogste temperatuur per dag volgens Open-Meteo, voor De Bilt.</p>
    </section>
  );
}
