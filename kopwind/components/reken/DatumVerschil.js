"use client";

import { useState } from "react";
import {
  uitSleutel, dagenTussen, kalenderVerschil, werkdagenTussen, datumTekst, plusDagen, vergelijk,
} from "@/lib/aftellen/datums";

/** Dagen, weken, maanden en werkdagen tussen twee datums. */
export default function DatumVerschil({ van: startVan, tot: startTot }) {
  const [van, setVan] = useState(startVan);
  const [tot, setTot] = useState(startTot);
  const [eindMee, setEindMee] = useState(false);
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(van) && /^\d{4}-\d{2}-\d{2}$/.test(tot);
  let uit = null;
  if (ok) {
    let a = uitSleutel(van);
    let b = uitSleutel(tot);
    if (vergelijk(a, b) > 0) [a, b] = [b, a];
    const eind = eindMee ? plusDagen(b, 1) : b;
    const dagen = dagenTussen(a, eind);
    uit = {
      a, b, dagen,
      kal: kalenderVerschil(a, eind),
      werk: werkdagenTussen(a, eindMee ? b : plusDagen(b, -1)),
    };
  }
  return (
    <section className="paneel aftel-calc">
      <div className="reken-velden">
        <label className="aftel-calc-veld">
          <span>Van</span>
          <input type="date" value={van} onChange={(e) => setVan(e.target.value)} />
        </label>
        <label className="aftel-calc-veld">
          <span>Tot</span>
          <input type="date" value={tot} onChange={(e) => setTot(e.target.value)} />
        </label>
      </div>
      <label className="reken-vink">
        <input type="checkbox" checked={eindMee} onChange={(e) => setEindMee(e.target.checked)} /> Einddatum meetellen
      </label>
      {uit && (
        <>
          <p className="aftel-groot">{uit.dagen}</p>
          <p className="aftel-sub">
            {uit.dagen === 1 ? "dag" : "dagen"} van {datumTekst(uit.a, { metDag: true })} tot{eindMee ? " en met" : ""} {datumTekst(uit.b, { metDag: true })}
          </p>
          <ul className="aftel-feiten">
            <li>
              {Math.floor(uit.dagen / 7)} weken en {uit.dagen % 7} dagen
            </li>
            <li>
              {uit.kal.jaren > 0 ? `${uit.kal.jaren} jaar, ` : ""}
              {uit.kal.maanden} {uit.kal.maanden === 1 ? "maand" : "maanden"} en {uit.kal.dagen} {uit.kal.dagen === 1 ? "dag" : "dagen"}
            </li>
            <li>{uit.werk} werkdagen (maandag tot vrijdag, zonder feestdagen)</li>
          </ul>
        </>
      )}
    </section>
  );
}
