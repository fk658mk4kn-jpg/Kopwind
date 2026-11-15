"use client";

import { useEffect, useState } from "react";
import { vandaag, dagenTussen, werkdagenTot, datumTekst, uitSleutel, sleutel, plusDagen } from "@/lib/aftellen/datums";

/**
 * Vrije calculator: kies een datum, krijg dagen, weken en werkdagen.
 * Werkt ook terug in de tijd ("hoeveel dagen geleden").
 */
export default function DatumCalculator() {
  const [nuDag, setNuDag] = useState(null);
  const [doel, setDoel] = useState("");

  useEffect(() => {
    const d = vandaag();
    setNuDag(d);
    setDoel(sleutel(plusDagen(d, 30)));
  }, []);

  if (!nuDag) return <section className="paneel aftel-calc" aria-busy="true" />;

  const geldig = /^\d{4}-\d{2}-\d{2}$/.test(doel);
  const d = geldig ? uitSleutel(doel) : null;
  const n = d ? dagenTussen(nuDag, d) : null;

  return (
    <section className="paneel aftel-calc">
      <label className="aftel-calc-veld">
        <span>Tel af naar</span>
        <input type="date" value={doel} onChange={(e) => setDoel(e.target.value)} />
      </label>
      {d && n === 0 && <p className="aftel-groot klein">Dat is vandaag</p>}
      {d && n > 0 && (
        <>
          <p className="aftel-groot">{n}</p>
          <p className="aftel-sub">
            {n === 1 ? "dag" : "dagen"} tot {datumTekst(d, { metDag: true })}
          </p>
          <ul className="aftel-feiten">
            <li>
              {Math.floor(n / 7)} weken en {n % 7} dagen
            </li>
            <li>{werkdagenTot(nuDag, d)} werkdagen vanaf morgen, zonder feestdagen</li>
          </ul>
        </>
      )}
      {d && n < 0 && (
        <>
          <p className="aftel-groot">{-n}</p>
          <p className="aftel-sub">
            {n === -1 ? "dag" : "dagen"} geleden: {datumTekst(d, { metDag: true })}
          </p>
        </>
      )}
    </section>
  );
}
