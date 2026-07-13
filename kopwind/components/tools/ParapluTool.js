"use client";

import { useState } from "react";
import LocatieZoek from "@/components/LocatieZoek";
import Icoon from "@/components/Icoon";
import { haalMinutely, analyseerMinutely } from "@/lib/engine/minutely";
import { useLocatie } from "@/components/tools/useLocatie";
import { S } from "@/lib/strings";
import { fmtTijd } from "@/lib/format";

/**
 * "Paraplu mee?" (v3.6.0 "Bora"). Vertaalt de neerslagreeks naar een
 * beslissing, niet een voorspelling. Weegt de buitentijd mee: een korte
 * bui buiten jouw tijd = geen paraplu; regen tijdens je buitentijd of
 * verspreide buien = wel. De buitentijd stelt de gebruiker zelf in.
 */
const BUITENUREN = [2, 4, 12]; // kort, uurtje, hele dag: hoeveel uur vooruit kijken

export default function ParapluTool() {
  const [advies, setAdvies] = useState(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(null);
  const [buitentijd, setBuitentijd] = useState(1); // index in BUITENUREN
  const [laatste, setLaatste] = useState(null); // { minutely, plek }

  const bepaal = (minutely, urenVooruit) => {
    const nu = new Date();
    const res = analyseerMinutely(minutely, nu);
    const grens = nu.getTime() + urenVooruit * 60 * 60 * 1000;
    const inTijd = res.punten.filter((p) => p.tijd.getTime() <= grens);
    const natMomenten = inTijd.filter((p) => p.nat);
    const natInTijd = natMomenten.length > 0;
    // Verspreide buien: meer dan twee losse natte blokken over de dag.
    let blokken = 0;
    let vorigeNat = false;
    for (const p of res.punten) {
      if (p.nat && !vorigeNat) blokken++;
      vorigeNat = p.nat;
    }
    const verspreid = blokken >= 3;

    let niveau; // slecht = ja, matig = twijfel, goed = nee
    let reden;
    if (natInTijd) {
      niveau = "slecht";
      reden = S.paraplu.redenNat(fmtTijd(natMomenten[0].tijd));
    } else if (verspreid) {
      niveau = "matig";
      reden = S.paraplu.redenVerspreid;
    } else {
      niveau = "goed";
      reden = S.paraplu.redenDroog;
    }
    return { niveau, reden };
  };

  const doeCheck = async (plek) => {
    if (!plek) return;
    setBezig(true);
    setFout(null);
    try {
      const minutely = await haalMinutely(plek.lat, plek.lon, 1);
      setLaatste({ minutely, plek });
      setAdvies(bepaal(minutely, BUITENUREN[buitentijd]));
    } catch (e) {
      setAdvies(null);
      setFout(e.message ?? String(e));
    } finally {
      setBezig(false);
    }
  };

  const { locatie, kiesLocatie } = useLocatie("paraplu", doeCheck);

  const wijzigBuitentijd = (i) => {
    setBuitentijd(i);
    if (laatste) setAdvies(bepaal(laatste.minutely, BUITENUREN[i]));
  };

  const kleur = advies ? (advies.niveau === "goed" ? "groen" : advies.niveau === "matig" ? "oranje" : "rood") : null;
  const tekst = advies
    ? advies.niveau === "goed"
      ? S.paraplu.nee
      : advies.niveau === "matig"
      ? S.paraplu.misschien
      : S.paraplu.ja
    : null;

  return (
    <section className="tool-werk">
      <div className="kiesbalk paneel">
        <div className="kiesbalk-zoek">
          <LocatieZoek onKies={kiesLocatie} placeholder={S.paraplu.kiesPlek} />
        </div>
        {locatie && <span className="locatie-naam">{locatie.naam}</span>}
      </div>

      <div className="keuzerij paneel">
        <span className="keuze-vraag">{S.paraplu.buitentijdVraag}</span>
        <div className="chips">
          {S.paraplu.buitentijden.map((label, i) => (
            <button
              key={label}
              className={"chip" + (buitentijd === i ? " actief" : "")}
              onClick={() => wijzigBuitentijd(i)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {fout && <div className="fout">{fout}</div>}
      {bezig && <p className="kaartregel stil">{S.algemeen.bezig}</p>}

      {advies && (
        <div className="paneel paraplu-paneel">
          <div className={"paraplu-antwoord " + kleur}>
            <Icoon naam="druppel" maat={26} />
            <strong>{tekst}</strong>
          </div>
          <p className="uitleg waarom">{S.locatieTool.waarom} {advies.reden}.</p>
        </div>
      )}
    </section>
  );
}
