"use client";

import { useState } from "react";
import { eigenRisicoVerbruik } from "@/lib/geld";

const eur = (n) => n.toLocaleString("nl-NL", { style: "currency", currency: "EUR" });

/** Wat je zelf betaalt van een zorgrekening, gegeven wat je al verbruikte. */
export default function EigenRisicoRekenaar({ eigenRisico, jaar }) {
  const [kosten, setKosten] = useState("250");
  const [al, setAl] = useState("0");
  const k = Number(String(kosten).replace(/\./g, "").replace(",", "."));
  const a = Number(String(al).replace(/\./g, "").replace(",", "."));
  const ok = Number.isFinite(k) && Number.isFinite(a) && k >= 0 && a >= 0;
  const r = ok ? eigenRisicoVerbruik(k, a, eigenRisico) : null;
  return (
    <section className="paneel aftel-calc">
      <div className="reken-velden">
        <label className="aftel-calc-veld">
          <span>Kosten van de zorg</span>
          <input inputMode="decimal" value={kosten} onChange={(e) => setKosten(e.target.value)} />
        </label>
        <label className="aftel-calc-veld">
          <span>Al verbruikt in {jaar}</span>
          <input inputMode="decimal" value={al} onChange={(e) => setAl(e.target.value)} />
        </label>
      </div>
      {r && (
        <>
          <p className="aftel-groot klein" aria-live="polite">Je betaalt {eur(r.zelf)}</p>
          <p className="aftel-sub">
            De verzekeraar betaalt {eur(r.verzekeraar)}. Daarna heb je nog {eur(r.restNa)} eigen risico over in {jaar}.
          </p>
        </>
      )}
    </section>
  );
}
