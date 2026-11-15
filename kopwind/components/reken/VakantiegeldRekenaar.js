"use client";

import { useState } from "react";

/** Bruto vakantiegeld: percentage van twaalf maandlonen, naar rato van gewerkte maanden. */
export default function VakantiegeldRekenaar() {
  const [loon, setLoon] = useState("3000");
  const [pct, setPct] = useState("8");
  const [maanden, setMaanden] = useState("12");
  const l = Number(String(loon).replace(",", "."));
  const p = Number(String(pct).replace(",", "."));
  const m = Math.min(12, Math.max(0, Number(maanden)));
  const ok = l > 0 && p > 0 && m > 0;
  const bruto = ok ? Math.round(l * m * (p / 100)) : null;
  const fmt = (n) => n.toLocaleString("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
  return (
    <section className="paneel aftel-calc">
      <div className="reken-velden">
        <label className="aftel-calc-veld">
          <span>Bruto maandloon (euro)</span>
          <input inputMode="decimal" value={loon} onChange={(e) => setLoon(e.target.value)} />
        </label>
        <label className="aftel-calc-veld">
          <span>Percentage</span>
          <input inputMode="decimal" value={pct} onChange={(e) => setPct(e.target.value)} />
        </label>
        <label className="aftel-calc-veld">
          <span>Maanden gewerkt</span>
          <input inputMode="numeric" value={maanden} onChange={(e) => setMaanden(e.target.value)} />
        </label>
      </div>
      {ok && (
        <>
          <p className="aftel-groot klein">{fmt(bruto)}</p>
          <p className="aftel-sub">bruto vakantiegeld over {m} {m === 1 ? "maand" : "maanden"}</p>
          <p className="aftel-voetnoot">
            Netto blijft er minder over, omdat je werkgever het tarief voor bijzondere beloningen toepast. Dat verschilt per
            inkomen; je loonstrook van de uitbetalingsmaand laat het exacte bedrag zien.
          </p>
        </>
      )}
    </section>
  );
}
