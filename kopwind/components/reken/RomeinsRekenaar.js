"use client";

import { useState } from "react";
import { naarRomeins, vanRomeins } from "@/lib/rekenen";

/** Getal naar Romeinse cijfers of andersom; herkent zelf de richting. */
export default function RomeinsRekenaar({ start }) {
  const [invoer, setInvoer] = useState(String(start));
  const t = invoer.trim();
  let uit;
  if (/^\d+$/.test(t)) {
    const r = naarRomeins(Number(t));
    uit = r ? { groot: r, sub: `${t} in Romeinse cijfers` } : { groot: "", sub: "Kies een getal van 1 tot en met 3999" };
  } else if (t) {
    const n = vanRomeins(t);
    uit = n ? { groot: String(n), sub: `${t.toUpperCase()} als gewoon getal` } : { groot: "", sub: "Deze schrijfwijze klopt niet volgens de standaardregels" };
  }
  return (
    <section className="paneel aftel-calc">
      <div className="reken-velden">
        <label className="aftel-calc-veld">
          <span>Getal of Romeinse cijfers</span>
          <input value={invoer} onChange={(e) => setInvoer(e.target.value)} autoCapitalize="characters" />
        </label>
      </div>
      {uit && (
        <>
          {uit.groot && <p className="aftel-groot klein" aria-live="polite">{uit.groot}</p>}
          <p className="aftel-sub">{uit.sub}</p>
        </>
      )}
    </section>
  );
}
