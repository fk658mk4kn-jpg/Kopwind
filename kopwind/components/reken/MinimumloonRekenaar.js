"use client";

import { useState } from "react";
import { MINIMUMLOON, maandloon } from "@/lib/geld";

/** Bruto maandbedrag bij het minimumuurloon en een aantal uren per week. */
export default function MinimumloonRekenaar() {
  const [idx, setIdx] = useState(0);
  const [uren, setUren] = useState("40");
  const u = Number(String(uren).replace(",", "."));
  const rij = MINIMUMLOON.perUur[idx];
  const ok = u > 0 && u <= 60;
  const fmt = (n) => n.toLocaleString("nl-NL", { style: "currency", currency: "EUR" });
  return (
    <section className="paneel aftel-calc">
      <div className="reken-velden">
        <label className="aftel-calc-veld">
          <span>Leeftijd</span>
          <select value={idx} onChange={(e) => setIdx(Number(e.target.value))}>
            {MINIMUMLOON.perUur.map((r, i) => (
              <option key={r.leeftijd} value={i}>
                {r.leeftijd}
              </option>
            ))}
          </select>
        </label>
        <label className="aftel-calc-veld">
          <span>Uren per week</span>
          <input inputMode="decimal" value={uren} onChange={(e) => setUren(e.target.value)} />
        </label>
      </div>
      {ok && (
        <>
          <p className="aftel-groot klein">{fmt(maandloon(rij.bedrag, u))}</p>
          <p className="aftel-sub">
            bruto per maand bij {fmt(rij.bedrag)} per uur en {u} uur per week, zonder vakantiegeld
          </p>
          <p className="aftel-voetnoot">Per week: {fmt(Math.round(rij.bedrag * u * 100) / 100)}. Per jaar zonder vakantiegeld: {fmt(Math.round(rij.bedrag * u * 52 * 100) / 100)}.</p>
        </>
      )}
    </section>
  );
}
