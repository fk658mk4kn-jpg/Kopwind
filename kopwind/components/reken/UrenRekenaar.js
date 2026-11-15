"use client";

import { useState } from "react";

const naarMin = (t) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

/** Gewerkte tijd tussen twee tijden, min pauze, ook over middernacht. */
export default function UrenRekenaar() {
  const [van, setVan] = useState("08:30");
  const [tot, setTot] = useState("17:00");
  const [pauze, setPauze] = useState("30");
  const a = naarMin(van);
  const b = naarMin(tot);
  const p = Math.max(0, Number(pauze) || 0);
  let uit = null;
  if (a != null && b != null) {
    let duur = b - a;
    if (duur <= 0) duur += 24 * 60;
    const netto = Math.max(0, duur - p);
    uit = { netto, overNacht: b <= a, decimaal: (netto / 60).toFixed(2).replace(".", ",") };
  }
  return (
    <section className="paneel aftel-calc">
      <div className="reken-velden">
        <label className="aftel-calc-veld">
          <span>Begin</span>
          <input type="time" value={van} onChange={(e) => setVan(e.target.value)} />
        </label>
        <label className="aftel-calc-veld">
          <span>Einde</span>
          <input type="time" value={tot} onChange={(e) => setTot(e.target.value)} />
        </label>
        <label className="aftel-calc-veld">
          <span>Pauze (minuten)</span>
          <input inputMode="numeric" value={pauze} onChange={(e) => setPauze(e.target.value)} />
        </label>
      </div>
      {uit && (
        <>
          <p className="aftel-groot klein">
            {Math.floor(uit.netto / 60)} uur {uit.netto % 60 ? `${uit.netto % 60} min` : ""}
          </p>
          <p className="aftel-sub">
            {uit.decimaal} uur als decimaal getal{uit.overNacht ? ", over middernacht gerekend" : ""}
          </p>
        </>
      )}
    </section>
  );
}
