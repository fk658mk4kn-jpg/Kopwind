"use client";

import { useEffect, useState } from "react";
import { useGebruiker } from "@/components/GebruikerContext";
import LocatieZoek from "@/components/LocatieZoek";
import VerdictBadge from "@/components/VerdictBadge";
import UrenStrip from "@/components/UrenStrip";
import Icoon from "@/components/Icoon";
import OutfitFiguur from "@/components/OutfitFiguur";
import { haalWeer } from "@/lib/engine/weather";
import { BASIS_VELDEN } from "@/lib/engine/weerbasis";
import { isFavoriet } from "@/lib/engine/locatie";
import { TOOLS } from "@/lib/tools";
import { fmtTijd } from "@/lib/format";
import { schaalVoor, kleurVoorSchaal } from "@/lib/engine/schaal";

/**
 * Gedeelde UI voor elke locatie-tool (het overlay-contract): kies je plek,
 * druk op de check en je krijgt het antwoord (Ja/Nee plus schaalwoord),
 * de status in gewone taal, het aanbevolen venster in de urenstrip en een
 * dagkiezer met per dag het antwoord plus een regel. Een nieuwe tool levert alleen een overlay-functie en
 * teksten; deze component doet de rest.
 */

const WEEKDAG = ["zo", "ma", "di", "wo", "do", "vr", "za"];

export default function LocatieTool({ toolId, beginLocatie = null }) {
  const tool = TOOLS.find((t) => t.id === toolId);
  const g = useGebruiker();
  const [locatie, setLocatie] = useState(beginLocatie);
  const [dagen, setDagen] = useState(null);
  const [legenda, setLegenda] = useState(null);
  const [gekozen, setGekozen] = useState(0);
  const [checkTijd, setCheckTijd] = useState(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(null);

  const lsSleutel = `kopwind.locatie.${toolId}`;

  // Laatst gebruikte plek terugzetten (met de oude was-sleutel als erfenis).
  useEffect(() => {
    if (beginLocatie) return;
    try {
      const l =
        JSON.parse(localStorage.getItem(lsSleutel) ?? "null") ??
        JSON.parse(localStorage.getItem("kopwind.wasLocatie") ?? "null");
      if (l?.lat) setLocatie(l);
    } catch {
      // Kapotte localStorage negeren.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const check = async (plek = locatie) => {
    if (!plek) {
      setFout("Kies eerst een plek: zoek een adres, tik een favoriet aan of gebruik je locatie.");
      return;
    }
    setBezig(true);
    setFout(null);
    try {
      const hourly = await haalWeer(plek.lat, plek.lon, tool.weerVelden ?? BASIS_VELDEN, tool.weerDagen ?? 5);
      const res = tool.overlay(hourly, new Date(), g.thresholdsVoor(toolId));
      if (!res?.dagen?.length) throw new Error("Geen bruikbare weerdata ontvangen. Probeer het zo nog eens.");
      setDagen(res.dagen);
      setLegenda(res.legenda ?? null);
      setGekozen(0);
      setCheckTijd(new Date());
      localStorage.setItem(lsSleutel, JSON.stringify(plek));
      g.meldInteractie();
    } catch (e) {
      setDagen(null);
      setFout(e.message ?? String(e));
    } finally {
      setBezig(false);
    }
  };

  const kies = (plek) => {
    setLocatie(plek);
    setFout(null);
    g.meldInteractie();
  };

  const favoriet = isFavoriet(locatie, g.presets);
  const dag = dagen?.[gekozen] ?? null;

  return (
    <div>
      <section className="paneel">
        <h2 className="paneel-titel">Jouw plek</h2>
        {g.presets.length > 0 && (
          <div className="chips">
            {g.presets.map((p) => (
              <button key={p.naam} className="chip" onClick={() => kies(p)}>
                {p.naam}
              </button>
            ))}
          </div>
        )}
        <LocatieZoek onKies={kies} placeholder={tool.locatieHint ?? "Zoek een adres of plaats..."} />
        {locatie && (
          <div className="locatie-gekozen">
            <Icoon naam="locatie" vol maat={16} />
            <span className="locatie-naam">{locatie.naam}</span>
            <button
              className="iconknop"
              title={favoriet ? "Staat bij je favorieten" : "Bewaar als favoriet"}
              onClick={() => {
                if (favoriet) return;
                const naam = window.prompt("Naam voor deze plek:", locatie.naam.split(",")[0]);
                if (naam) g.bewaarPreset({ naam: naam.trim(), lat: locatie.lat, lon: locatie.lon });
              }}
            >
              <Icoon naam="ster" vol={favoriet} maat={17} />
            </button>
          </div>
        )}
        <div className="actiebalk">
          <button className="knop primair" onClick={() => check()} disabled={bezig}>
            {bezig ? "Bezig..." : tool.cta}
          </button>
        </div>
      </section>

      {fout && <div className="fout">{fout}</div>}

      {dagen && dag && (
        <section className="resultaten" aria-label="Resultaat">
          <div className="paneel">
            <VerdictBadge score={dag.conditie.score} ja={dag.antwoord?.ja ?? null} />
            {dag.outfit && <OutfitFiguur outfit={dag.outfit} />}
            <p className="status-regel">{dag.status.zin}</p>
            {dag.metric?.zin && <p className="metric-zin">{dag.metric.zin}</p>}

            <div className="dagkiezer">
              {dagen.map((d, i) => (
                <button
                  key={d.datum}
                  className={"dagkaart" + (i === gekozen ? " actief" : "")}
                  onClick={() => setGekozen(i)}
                  data-kleur={kleurVoorSchaal(schaalVoor(d.conditie.score).id)}
                >
                  <span className="dagnaam">{dagLabel(d.datum, i)}</span>
                  <span className="dagwoord">
                    {d.antwoord?.ja == null
                      ? schaalVoor(d.conditie.score).label
                      : d.antwoord.ja
                        ? "Ja"
                        : "Nee"}
                  </span>
                  <span className="dagregel">{dagRegel(d)}</span>
                </button>
              ))}
            </div>

            <UrenStrip uren={dag.uren} venster={dag.venster} legenda={legenda} />
            {dag.conditie.redenen.length > 0 && <p className="uitleg">{zinnen(dag.conditie.redenen)}</p>}

            {checkTijd && (
              <p className="databron">
                Weerdata: Open-Meteo uurvoorspelling, live opgehaald om {fmtTijd(checkTijd)}.
              </p>
            )}
          </div>
        </section>
      )}

      {!dagen && !fout && (
        <p className="leeg">
          Kies je plek en tik op {tool.cta}: je ziet direct het antwoord voor vandaag en de dagen erna.
        </p>
      )}
    </div>
  );
}

function dagLabel(datum, index) {
  if (index === 0) return "vandaag";
  const d = new Date(`${datum}T12:00:00`);
  return `${WEEKDAG[d.getDay()]} ${d.getDate()}`;
}

function dagRegel(d) {
  if (d.venster) {
    return `${String(d.venster.van).padStart(2, "0")}-${String(d.venster.tot).padStart(2, "0")} u`;
  }
  return d.status?.soort === "nee" ? "liever niet" : "wisselvallig";
}

function zinnen(redenen) {
  const s = redenen.join(", ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}
