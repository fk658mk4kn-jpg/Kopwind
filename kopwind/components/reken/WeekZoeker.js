"use client";

import { useState } from "react";
import { isoWeek, uitSleutel, datumTekst, maandagVanWeek, plusDagen } from "@/lib/aftellen/datums";

/** Zoek het weeknummer van een willekeurige datum, of de data van een week. */
export default function WeekZoeker({ startDatum }) {
  const [datum, setDatum] = useState(startDatum);
  const geldig = /^\d{4}-\d{2}-\d{2}$/.test(datum);
  const w = geldig ? isoWeek(uitSleutel(datum)) : null;
  const ma = w ? maandagVanWeek(w.jaar, w.week) : null;
  return (
    <section className="paneel aftel-calc">
      <label className="aftel-calc-veld">
        <span>Weeknummer van een datum</span>
        <input type="date" value={datum} onChange={(e) => setDatum(e.target.value)} />
      </label>
      {w && (
        <p className="aftel-sub">
          <strong>
            Week {w.week} van {w.jaar}
          </strong>
          : {datumTekst(ma, { metDag: true })} tot en met {datumTekst(plusDagen(ma, 6), { metDag: true })}
        </p>
      )}
    </section>
  );
}
