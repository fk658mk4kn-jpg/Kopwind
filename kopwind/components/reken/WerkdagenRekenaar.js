"use client";

import { useState } from "react";
import { uitSleutel, werkdagenTussen, dagenTussen, vergelijk } from "@/lib/aftellen/datums";

/** Werkdagen tussen twee datums, beide meegeteld. */
export default function WerkdagenRekenaar({ van: startVan, tot: startTot }) {
  const [van, setVan] = useState(startVan);
  const [tot, setTot] = useState(startTot);
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(van) && /^\d{4}-\d{2}-\d{2}$/.test(tot);
  let werk = null;
  let kalender = null;
  if (ok) {
    let a = uitSleutel(van);
    let b = uitSleutel(tot);
    if (vergelijk(a, b) > 0) [a, b] = [b, a];
    werk = werkdagenTussen(a, b);
    kalender = dagenTussen(a, b) + 1;
  }
  return (
    <section className="paneel aftel-calc">
      <div className="reken-velden">
        <label className="aftel-calc-veld">
          <span>Van</span>
          <input type="date" value={van} onChange={(e) => setVan(e.target.value)} />
        </label>
        <label className="aftel-calc-veld">
          <span>Tot en met</span>
          <input type="date" value={tot} onChange={(e) => setTot(e.target.value)} />
        </label>
      </div>
      {werk != null && (
        <>
          <p className="aftel-groot">{werk}</p>
          <p className="aftel-sub">
            werkdagen, op {kalender} {kalender === 1 ? "kalenderdag" : "kalenderdagen"}
          </p>
        </>
      )}
    </section>
  );
}
