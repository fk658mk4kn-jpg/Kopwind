"use client";

import { useState } from "react";
import { uitSleutel, dagVanJaar, dagenInJaar, datumTekst } from "@/lib/aftellen/datums";

/** Dagnummer van een gekozen datum. */
export default function DagZoeker({ startDatum }) {
  const [datum, setDatum] = useState(startDatum);
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(datum);
  const d = ok ? uitSleutel(datum) : null;
  return (
    <section className="paneel aftel-calc">
      <label className="aftel-calc-veld">
        <span>Dagnummer van een datum</span>
        <input type="date" value={datum} onChange={(e) => setDatum(e.target.value)} />
      </label>
      {d && (
        <p className="aftel-sub">
          <strong>Dag {dagVanJaar(d)}</strong> van {dagenInJaar(d.j)}: {datumTekst(d, { metDag: true })}
        </p>
      )}
    </section>
  );
}
