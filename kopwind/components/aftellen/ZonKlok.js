"use client";

import { useEffect, useState } from "react";
import PlekKiezer, { DE_BILT } from "./PlekKiezer";
import AftelTeller from "./AftelTeller";
import { zonTijden, daglengte, vandaag, plusDagen, tijdTekst, duurTekst } from "@/lib/aftellen/datums";

/**
 * Zonsondergang vandaag met een aftelklok. Na zonsondergang schuift het
 * doel naar de zonsopkomst van morgen. De server levert de De Bilt-tijden
 * als eerste weergave; de rest is browserrekenwerk, geen API nodig.
 */
export default function ZonKlok({ start, modus = "onder" }) {
  const op = modus === "op";
  const [plek, setPlek] = useState(DE_BILT);
  const [nu, setNu] = useState(null);

  useEffect(() => {
    setNu(Date.now());
    const id = setInterval(() => setNu(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  if (!nu) {
    return (
      <section className="paneel aftel-hoofd">
        <p className="aftel-groot">{op ? start.op : start.onder}</p>
        <p className="aftel-sub">
          {op
            ? `Zonsopkomst vandaag in De Bilt. Zonsondergang om ${start.onder}, daglengte ${start.lengte}.`
            : `Zonsondergang vandaag in De Bilt. Zonsopkomst was om ${start.op}, daglengte ${start.lengte}.`}
        </p>
      </section>
    );
  }

  const dag = vandaag(nu);
  const morgen = plusDagen(dag, 1);
  const gisteren = plusDagen(dag, -1);
  const z = zonTijden(dag, plek.lat, plek.lon);
  const zm = zonTijden(morgen, plek.lat, plek.lon);
  const lengte = daglengte(dag, plek.lat, plek.lon);
  const verschil = lengte - daglengte(gisteren, plek.lat, plek.lon);
  const naOnder = nu >= z.onder;
  // Zonsopkomst-modus: vandaag als die nog komt, anders morgen.
  const opMorgen = nu >= z.op;
  const doel = op ? (opMorgen ? zm.op : z.op) : naOnder ? zm.op : z.onder;
  const label = op
    ? opMorgen
      ? "De zon is al op. Zonsopkomst morgen om"
      : "Zonsopkomst vandaag om"
    : naOnder
      ? "Zon is onder. Zonsopkomst morgen om"
      : "Zonsondergang vandaag om";

  return (
    <section className="paneel aftel-hoofd">
      <PlekKiezer plek={plek} onKies={setPlek} />
      <p className="aftel-label">{label}</p>
      <p className="aftel-groot">{tijdTekst(doel)}</p>
      <AftelTeller key={`${plek.lat},${plek.lon},${doel}`} doel={doel} />
      <ul className="aftel-feiten">
        <li>{op ? `Zonsondergang vandaag: ${tijdTekst(z.onder)}` : `Zonsopkomst vandaag: ${tijdTekst(z.op)}`}</li>
        <li>Zon het hoogst: {tijdTekst(z.middag)}</li>
        <li>Daglengte: {duurTekst(lengte)}</li>
        <li>
          {verschil === 0
            ? "Even lang als gisteren"
            : `${Math.abs(verschil)} ${Math.abs(verschil) === 1 ? "minuut" : "minuten"} ${verschil > 0 ? "langer" : "korter"} dan gisteren`}
        </li>
        <li>{op ? `Zonsopkomst morgen: ${tijdTekst(zm.op)}` : `Zonsondergang morgen: ${tijdTekst(zm.onder)}`}</li>
      </ul>
      <p className="aftel-voetnoot">Berekend voor {plek.naam}, op een minuut nauwkeurig.</p>
    </section>
  );
}
