"use client";

import { useEffect, useState } from "react";
import { uitSleutel, vandaag, volgendeVerjaardag, datumTekst, dagNaam, werkdagenTot } from "@/lib/aftellen/datums";

/**
 * Dagen tot de volgende verjaardag. Alles in de browser; de datum wordt
 * nergens opgeslagen of verstuurd.
 */
export default function Verjaardag() {
  const [geboren, setGeboren] = useState("");
  const [nu, setNu] = useState(null);
  useEffect(() => setNu(vandaag()), []);
  const ok = nu && /^\d{4}-\d{2}-\d{2}$/.test(geboren);
  const g = ok ? uitSleutel(geboren) : null;
  const v = g && g.j <= nu.j ? volgendeVerjaardag(g, nu) : null;
  return (
    <section className="paneel aftel-calc">
      <label className="aftel-calc-veld">
        <span>Geboortedatum</span>
        <input type="date" value={geboren} onChange={(e) => setGeboren(e.target.value)} />
      </label>
      {!geboren && <p className="aftel-sub">Vul een geboortedatum in.</p>}
      {v && v.dagen === 0 && (
        <>
          <p className="aftel-groot klein">Gefeliciteerd!</p>
          <p className="aftel-sub">Vandaag {v.wordt === 1 ? "word je 1 jaar" : `word je ${v.wordt}`}.</p>
        </>
      )}
      {v && v.dagen > 0 && (
        <>
          <p className="aftel-groot">{v.dagen}</p>
          <p className="aftel-sub">
            {v.dagen === 1 ? "dag" : "dagen"} tot je verjaardag op {datumTekst(v.datum, { metDag: true })}
          </p>
          <ul className="aftel-feiten">
            <li>Je wordt dan {v.wordt}</li>
            <li>Het valt op een {dagNaam(v.datum)}</li>
            <li>
              Nog {Math.floor(v.dagen / 7)} weken en {v.dagen % 7} dagen, waarvan {werkdagenTot(nu, v.datum)} werkdagen
            </li>
          </ul>
        </>
      )}
    </section>
  );
}
