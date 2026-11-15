"use client";

import { useEffect, useState } from "react";
import PlekKiezer, { DE_BILT } from "./PlekKiezer";
import AftelTeller from "./AftelTeller";
import { tijdTekst } from "@/lib/aftellen/datums";
import { analyseerNeerslag } from "@/lib/aftellen/neerslag";

/**
 * Live klok tot de volgende bui (of, bij regen, tot het droog wordt),
 * op basis van de neerslagverwachting per kwartier.
 */
export default function DroogKlok() {
  const [plek, setPlek] = useState(DE_BILT);
  const [staat, setStaat] = useState({ laden: true });

  useEffect(() => {
    let weg = false;
    setStaat({ laden: true });
    fetch(`/api/minutely?lat=${plek.lat}&lon=${plek.lon}&dagen=2`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("niet ok"))))
      .then((d) => !weg && setStaat({ uitkomst: analyseerNeerslag(d.minutely, Date.now()) }))
      .catch(() => !weg && setStaat({ fout: true }));
    return () => {
      weg = true;
    };
  }, [plek.lat, plek.lon]);

  const u = staat.uitkomst;
  return (
    <section className="paneel aftel-hoofd">
      <PlekKiezer plek={plek} onKies={setPlek} />
      {staat.laden && <p className="aftel-sub">Neerslagverwachting ophalen...</p>}
      {staat.fout && <p className="aftel-sub">De neerslagverwachting is nu niet bereikbaar. Probeer het zo nog eens.</p>}
      {u && u.soort === "droog-tot" && (
        <>
          <p className="aftel-label">Droog tot ongeveer</p>
          <p className="aftel-groot">{tijdTekst(u.tijdstip)}</p>
          <AftelTeller key={u.tijdstip} doel={u.tijdstip} klaarTekst="De bui kan nu elk moment vallen." />
          <p className="aftel-sub">Daarna verwacht: {u.mm} mm in het eerste kwartier.</p>
        </>
      )}
      {u && u.soort === "nat-tot" && (
        <>
          <p className="aftel-label">Het regent. Droog vanaf ongeveer</p>
          <p className="aftel-groot">{tijdTekst(u.tijdstip)}</p>
          <AftelTeller key={u.tijdstip} doel={u.tijdstip} klaarTekst="Het zou nu droog moeten worden." />
        </>
      )}
      {u && u.soort === "lang-droog" && (
        <>
          <p className="aftel-label">Geen bui in zicht</p>
          <p className="aftel-groot">Droog</p>
          <p className="aftel-sub">De verwachting toont minstens tot {tijdTekst(u.tot)} geen meetbare neerslag.</p>
        </>
      )}
      {u && u.soort === "lang-nat" && (
        <>
          <p className="aftel-label">Natte periode</p>
          <p className="aftel-groot">Regen</p>
          <p className="aftel-sub">Tot zeker {tijdTekst(u.tot)} valt er regelmatig neerslag.</p>
        </>
      )}
      {u && <p className="aftel-voetnoot">Verwachting voor {plek.naam}, per kwartier. Een bui kan een kwartier eerder of later komen.</p>}
    </section>
  );
}
