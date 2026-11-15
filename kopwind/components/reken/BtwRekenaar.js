"use client";

import { useState } from "react";
import { btwErbij, btwEraf } from "@/lib/rekenen";

const eur = (n) => n.toLocaleString("nl-NL", { style: "currency", currency: "EUR" });

/** Btw erbij of eraf, 21 of 9 procent. */
export default function BtwRekenaar() {
  const [bedrag, setBedrag] = useState("100");
  const [pct, setPct] = useState(21);
  const [richting, setRichting] = useState("erbij");
  const n = Number(String(bedrag).replace(/\./g, "").replace(",", "."));
  const geldig = Number.isFinite(n) && bedrag.trim() !== "";
  const r = geldig ? (richting === "erbij" ? btwErbij(n, pct) : btwEraf(n, pct)) : null;
  return (
    <section className="paneel aftel-calc">
      <div className="reken-velden">
        <label className="aftel-calc-veld">
          <span>Bedrag in euro</span>
          <input inputMode="decimal" value={bedrag} onChange={(e) => setBedrag(e.target.value)} />
        </label>
        <label className="aftel-calc-veld">
          <span>Het bedrag is</span>
          <select value={richting} onChange={(e) => setRichting(e.target.value)}>
            <option value="erbij">zonder btw</option>
            <option value="eraf">inclusief btw</option>
          </select>
        </label>
        <label className="aftel-calc-veld">
          <span>Tarief</span>
          <select value={pct} onChange={(e) => setPct(Number(e.target.value))}>
            <option value={21}>21 procent</option>
            <option value={9}>9 procent</option>
          </select>
        </label>
      </div>
      {r && (
        <table className="reken-tabel">
          <tbody>
            <tr><td>Zonder btw</td><td className="rechts">{eur(r.excl)}</td></tr>
            <tr><td>Btw {pct} procent</td><td className="rechts">{eur(r.btw)}</td></tr>
            <tr className="nu"><td>Inclusief btw</td><td className="rechts">{eur(r.incl)}</td></tr>
          </tbody>
        </table>
      )}
    </section>
  );
}
