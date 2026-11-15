"use client";

import { useState } from "react";
import { aowDatum, AOW_LAATST_VASTGESTELD } from "@/lib/geld";
import { uitSleutel, datumTekst } from "@/lib/aftellen/datums";

/** AOW-datum bij een geboortedatum. Alles in de browser. */
export default function AowRekenaar() {
  const [geboren, setGeboren] = useState("");
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(geboren);
  const r = ok ? aowDatum(uitSleutel(geboren)) : null;
  return (
    <section className="paneel aftel-calc">
      <label className="aftel-calc-veld">
        <span>Geboortedatum</span>
        <input type="date" value={geboren} onChange={(e) => setGeboren(e.target.value)} />
      </label>
      {!ok && <p className="aftel-sub">Vul een geboortedatum in.</p>}
      {ok && r && !r.eerder && (
        <>
          <p className="aftel-groot klein">{datumTekst(r.datum, { metDag: true })}</p>
          <p className="aftel-sub">
            Dan bereik je de AOW-leeftijd van {Math.floor(r.maanden / 12)} jaar{r.maanden % 12 ? ` en ${r.maanden % 12} maanden` : ""}.
          </p>
        </>
      )}
      {ok && r && r.eerder && <p className="aftel-sub">Je hebt de AOW-leeftijd al voor 2026 bereikt.</p>}
      {ok && !r && (
        <p className="aftel-sub">
          Je bereikt de AOW-leeftijd na {AOW_LAATST_VASTGESTELD}. Die is nog niet vastgesteld, maar wordt minstens 67 jaar en 3 maanden. Elk najaar komt er een jaar bij.
        </p>
      )}
    </section>
  );
}
