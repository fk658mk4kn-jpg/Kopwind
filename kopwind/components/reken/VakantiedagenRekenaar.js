"use client";

import { useState } from "react";
import { wettelijkeVakantie } from "@/lib/rekenen";

const nl = (n) => n.toLocaleString("nl-NL", { maximumFractionDigits: 1 });

/** Wettelijke vakantie-uren en -dagen bij een aantal uren en dagen per week. */
export default function VakantiedagenRekenaar() {
  const [uren, setUren] = useState("40");
  const [dagen, setDagen] = useState("5");
  const [maanden, setMaanden] = useState("12");
  const u = Number(String(uren).replace(",", "."));
  const d = Number(dagen);
  const m = Number(maanden);
  const ok = u > 0 && u <= 80 && d >= 1 && d <= 7 && m >= 0 && m <= 12;
  const r = ok ? wettelijkeVakantie(u, d, m) : null;
  return (
    <section className="paneel aftel-calc">
      <div className="reken-velden">
        <label className="aftel-calc-veld">
          <span>Uren per week</span>
          <input inputMode="decimal" value={uren} onChange={(e) => setUren(e.target.value)} />
        </label>
        <label className="aftel-calc-veld">
          <span>Dagen per week</span>
          <input inputMode="numeric" value={dagen} onChange={(e) => setDagen(e.target.value)} />
        </label>
        <label className="aftel-calc-veld">
          <span>Maanden in dienst dit jaar</span>
          <input inputMode="numeric" value={maanden} onChange={(e) => setMaanden(e.target.value)} />
        </label>
      </div>
      {r && (
        <>
          <p className="aftel-groot klein" aria-live="polite">{nl(r.dagen)} dagen</p>
          <p className="aftel-sub">{nl(r.uren)} vakantie-uren, het wettelijke minimum. Je cao of contract kan meer geven.</p>
        </>
      )}
    </section>
  );
}
