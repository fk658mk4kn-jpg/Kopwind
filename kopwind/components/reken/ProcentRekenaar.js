"use client";

import { useState } from "react";
import { procentVan, welkProcent, procentVerandering, naProcent } from "@/lib/rekenen";

const getal = (s) => {
  const n = Number(String(s).replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) && String(s).trim() !== "" ? n : null;
};
const nl = (n, max = 2) => (n == null ? "" : n.toLocaleString("nl-NL", { maximumFractionDigits: max }));

const SOORTEN = [
  { id: "van", label: "x procent van y", a: "Procent", b: "Van", uit: (a, b) => `${nl(a)} procent van ${nl(b)} is ${nl(procentVan(a, b))}` },
  { id: "welk", label: "Hoeveel procent is a van b", a: "Getal", b: "Van het totaal", uit: (a, b) => { const p = welkProcent(a, b); return p == null ? "" : `${nl(a)} is ${nl(p)} procent van ${nl(b)}`; } },
  { id: "verschil", label: "Stijging of daling", a: "Oud", b: "Nieuw", uit: (a, b) => { const p = procentVerandering(a, b); return p == null ? "" : `${p >= 0 ? "Een stijging" : "Een daling"} van ${nl(Math.abs(p))} procent`; } },
  { id: "na", label: "Bedrag na korting of opslag", a: "Bedrag", b: "Procent (min voor korting)", uit: (a, b) => `Uitkomst: ${nl(naProcent(a, b))}` },
];

/** Vier procentsommen in een rekenhulp. */
export default function ProcentRekenaar() {
  const [soort, setSoort] = useState("van");
  const [a, setA] = useState("15");
  const [b, setB] = useState("80");
  const s = SOORTEN.find((x) => x.id === soort);
  const na = getal(a);
  const nb = getal(b);
  return (
    <section className="paneel aftel-calc">
      <div className="reken-velden">
        <label className="aftel-calc-veld">
          <span>Wat wil je weten?</span>
          <select value={soort} onChange={(e) => setSoort(e.target.value)}>
            {SOORTEN.map((x) => (
              <option key={x.id} value={x.id}>{x.label}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="reken-velden">
        <label className="aftel-calc-veld">
          <span>{s.a}</span>
          <input inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} />
        </label>
        <label className="aftel-calc-veld">
          <span>{s.b}</span>
          <input inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} />
        </label>
      </div>
      <p className="aftel-groot klein" aria-live="polite">{na != null && nb != null ? s.uit(na, nb) : "Vul twee getallen in"}</p>
    </section>
  );
}
