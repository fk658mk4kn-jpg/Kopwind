"use client";

import { useState } from "react";
import { reiskosten } from "@/lib/geld";

const eur = (n) => n.toLocaleString("nl-NL", { style: "currency", currency: "EUR" });

/** Onbelaste reiskostenvergoeding woon-werk. */
export default function KilometerRekenaar({ perKm }) {
  const [km, setKm] = useState("15");
  const [dagen, setDagen] = useState("5");
  const [tarief, setTarief] = useState(String(perKm).replace(".", ","));
  const k = Number(String(km).replace(",", "."));
  const d = Number(dagen);
  const t = Number(String(tarief).replace(",", "."));
  const ok = k > 0 && k < 1000 && d >= 1 && d <= 7 && t >= 0 && t < 5;
  const r = ok ? reiskosten(k, d, t) : null;
  return (
    <section className="paneel aftel-calc">
      <div className="reken-velden">
        <label className="aftel-calc-veld">
          <span>Enkele reis in km</span>
          <input inputMode="decimal" value={km} onChange={(e) => setKm(e.target.value)} />
        </label>
        <label className="aftel-calc-veld">
          <span>Reisdagen per week</span>
          <input inputMode="numeric" value={dagen} onChange={(e) => setDagen(e.target.value)} />
        </label>
        <label className="aftel-calc-veld">
          <span>Euro per km</span>
          <input inputMode="decimal" value={tarief} onChange={(e) => setTarief(e.target.value)} />
        </label>
      </div>
      {r && (
        <>
          <p className="aftel-groot klein" aria-live="polite">{eur(r.perMaand)} per maand</p>
          <p className="aftel-sub">
            {eur(r.perDag)} per reisdag, {eur(r.perJaar)} per jaar bij {Math.round(r.dagen)} reisdagen
            {t > perKm ? `. Boven ${eur(perKm)} per km is het meerdere belast.` : "."}
          </p>
        </>
      )}
    </section>
  );
}
