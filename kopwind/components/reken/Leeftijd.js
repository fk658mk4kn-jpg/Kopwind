"use client";

import { useEffect, useState } from "react";
import {
  uitSleutel, vandaag, sleutel, kalenderVerschil, dagenTussen, plusDagen, datumTekst, dagNaam, vergelijk,
} from "@/lib/aftellen/datums";

/** Leeftijd in jaren, maanden en dagen op een peildatum. Alles in de browser. */
export default function Leeftijd() {
  const [geboren, setGeboren] = useState("");
  const [peil, setPeil] = useState("");
  useEffect(() => setPeil(sleutel(vandaag())), []);
  const ok = /^\d{4}-\d{2}-\d{2}$/.test(geboren) && /^\d{4}-\d{2}-\d{2}$/.test(peil);
  let uit = null;
  if (ok) {
    const g = uitSleutel(geboren);
    const p = uitSleutel(peil);
    if (vergelijk(g, p) <= 0) {
      const dagen = dagenTussen(g, p);
      const volgendDuizend = Math.ceil((dagen + 1) / 1000) * 1000;
      uit = {
        g,
        k: kalenderVerschil(g, p),
        dagen,
        weken: Math.floor(dagen / 7),
        maanden: kalenderVerschil(g, p).jaren * 12 + kalenderVerschil(g, p).maanden,
        duizend: volgendDuizend,
        duizendDatum: plusDagen(g, volgendDuizend),
      };
    }
  }
  return (
    <section className="paneel aftel-calc">
      <div className="reken-velden">
        <label className="aftel-calc-veld">
          <span>Geboortedatum</span>
          <input type="date" value={geboren} onChange={(e) => setGeboren(e.target.value)} />
        </label>
        <label className="aftel-calc-veld">
          <span>Leeftijd op</span>
          <input type="date" value={peil} onChange={(e) => setPeil(e.target.value)} />
        </label>
      </div>
      {!geboren && <p className="aftel-sub">Vul een geboortedatum in.</p>}
      {ok && !uit && <p className="aftel-sub">De peildatum ligt voor de geboortedatum.</p>}
      {uit && (
        <>
          <p className="aftel-groot">{uit.k.jaren}</p>
          <p className="aftel-sub">
            jaar, {uit.k.maanden} {uit.k.maanden === 1 ? "maand" : "maanden"} en {uit.k.dagen} {uit.k.dagen === 1 ? "dag" : "dagen"}
          </p>
          <ul className="aftel-feiten">
            <li>{uit.dagen.toLocaleString("nl-NL")} dagen oud</li>
            <li>{uit.weken.toLocaleString("nl-NL")} weken, {uit.maanden.toLocaleString("nl-NL")} maanden</li>
            <li>Geboren op een {dagNaam(uit.g)}</li>
            <li>
              Dag {uit.duizend.toLocaleString("nl-NL")} valt op {datumTekst(uit.duizendDatum, { metDag: true })}
            </li>
          </ul>
        </>
      )}
    </section>
  );
}
