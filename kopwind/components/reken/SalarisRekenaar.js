"use client";

import { useState } from "react";
import { salarisDatum } from "@/lib/geld";
import { datumTekst, MAAND_NAMEN } from "@/lib/aftellen/datums";

/** Salarisdatum per maand bij een eigen vaste dag, met weekend en feestdagen naar voren. */
export default function SalarisRekenaar({ jaar }) {
  const [dag, setDag] = useState("25");
  const d = Math.min(31, Math.max(1, Number(dag) || 25));
  return (
    <section className="paneel reken-blok">
      <label className="aftel-calc-veld">
        <span>Mijn salarisdag (dag van de maand)</span>
        <input inputMode="numeric" value={dag} onChange={(e) => setDag(e.target.value)} />
      </label>
      <h2 style={{ marginTop: 12 }}>Salaris op de {d}e in {jaar}</h2>
      <table className="reken-tabel">
        <thead>
          <tr>
            <th>Maand</th>
            <th>Betaaldag</th>
          </tr>
        </thead>
        <tbody>
          {MAAND_NAMEN.map((naam, i) => {
            const s = salarisDatum(jaar, i + 1, d);
            const eerder = s.d !== Math.min(d, new Date(Date.UTC(jaar, i + 1, 0)).getUTCDate());
            return (
              <tr key={naam}>
                <td>{naam}</td>
                <td>
                  {datumTekst(s, { metDag: true, metJaar: false })}
                  {eerder ? " (eerder door weekend of feestdag)" : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
