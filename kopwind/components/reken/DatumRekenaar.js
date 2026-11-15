"use client";

import { useState } from "react";
import { plusMaandenDatum, plusWerkdagen } from "@/lib/rekenen";
import { uitSleutel, plusDagen, datumTekst, isoWeek } from "@/lib/aftellen/datums";

/** Begindatum plus of min dagen, weken, maanden of werkdagen. */
export default function DatumRekenaar({ startDatum }) {
  const [start, setStart] = useState(startDatum);
  const [aantal, setAantal] = useState("30");
  const [eenheid, setEenheid] = useState("dagen");
  const n = parseInt(aantal, 10);
  let uit = null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(start) && Number.isFinite(n) && Math.abs(n) <= 100000) {
    const d = uitSleutel(start);
    uit =
      eenheid === "dagen" ? plusDagen(d, n)
      : eenheid === "weken" ? plusDagen(d, n * 7)
      : eenheid === "maanden" ? plusMaandenDatum(d, n)
      : plusWerkdagen(d, n);
  }
  return (
    <section className="paneel aftel-calc">
      <div className="reken-velden">
        <label className="aftel-calc-veld">
          <span>Begindatum</span>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label className="aftel-calc-veld">
          <span>Erbij (min om terug te rekenen)</span>
          <input inputMode="numeric" value={aantal} onChange={(e) => setAantal(e.target.value)} />
        </label>
        <label className="aftel-calc-veld">
          <span>Eenheid</span>
          <select value={eenheid} onChange={(e) => setEenheid(e.target.value)}>
            <option value="dagen">dagen</option>
            <option value="weken">weken</option>
            <option value="maanden">maanden</option>
            <option value="werkdagen">werkdagen</option>
          </select>
        </label>
      </div>
      {uit && (
        <>
          <p className="aftel-groot klein" aria-live="polite">{datumTekst(uit, { metDag: true })}</p>
          <p className="aftel-sub">week {isoWeek(uit).week}</p>
        </>
      )}
    </section>
  );
}
