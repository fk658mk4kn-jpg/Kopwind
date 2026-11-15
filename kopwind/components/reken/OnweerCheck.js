"use client";

import { useEffect, useState } from "react";
import PlekKiezer, { DE_BILT } from "@/components/aftellen/PlekKiezer";
import { haalWeer } from "@/lib/engine/weather";
import { onweerPerDag, urenTekst } from "@/lib/onweer";

const DAG = ["zondag", "maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"];

/** Onweerskans per dag voor de gekozen plek, drie dagen vooruit. */
export default function OnweerCheck() {
  const [plek, setPlek] = useState(DE_BILT);
  const [staat, setStaat] = useState({ laden: true });
  useEffect(() => {
    let weg = false;
    setStaat({ laden: true });
    haalWeer(plek.lat, plek.lon, ["weather_code", "cape"], 3)
      .then((h) => !weg && setStaat({ dagen: onweerPerDag(h).slice(0, 3) }))
      .catch(() => !weg && setStaat({ fout: true }));
    return () => {
      weg = true;
    };
  }, [plek.lat, plek.lon]);
  return (
    <section className="paneel aftel-hoofd">
      <PlekKiezer plek={plek} onKies={setPlek} />
      {staat.laden && <p className="aftel-sub">Verwachting ophalen...</p>}
      {staat.fout && <p className="aftel-sub">De verwachting is nu niet bereikbaar. Probeer het zo nog eens.</p>}
      {staat.dagen && (
        <div className="aftel-regios">
          {staat.dagen.map((d, i) => {
            const [j, m, dd] = d.datum.split("-").map(Number);
            return (
              <div key={d.datum} className="paneel aftel-regio">
                <h2 className="paneel-titel">{i === 0 ? "Vandaag" : `${DAG[new Date(Date.UTC(j, m - 1, dd)).getUTCDay()]} ${dd}-${m}`}</h2>
                <p className="aftel-datum">{d.oordeel.woord}</p>
                {d.uren.length > 0 && <p className="aftel-sub">{urenTekst(d.uren)}</p>}
                {d.hagel && <p className="aftel-sub">Mogelijk met hagel.</p>}
                <p className="aftel-sub">Energie in de lucht (CAPE): tot {Math.round(d.maxCape)} J/kg</p>
              </div>
            );
          })}
        </div>
      )}
      <p className="aftel-voetnoot">Uurverwachting van Open-Meteo voor {plek.naam}. Waar een onweersbui precies valt, is pas kort van tevoren te zeggen.</p>
    </section>
  );
}
