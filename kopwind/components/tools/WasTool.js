"use client";

import { useEffect, useState } from "react";
import { useGebruiker } from "@/components/GebruikerContext";
import LocatieZoek from "@/components/LocatieZoek";
import VerdictBadge from "@/components/VerdictBadge";
import UrenStrip from "@/components/UrenStrip";
import KleurLegenda from "@/components/KleurLegenda";
import Icoon from "@/components/Icoon";
import { haalWeer } from "@/lib/engine/weather";
import { isFavoriet } from "@/lib/engine/locatie";
import { WAS_VELDEN, berekenDroogdagen, wasBuitenDrogen } from "@/lib/tools/was-buiten-drogen";
import { kleurSequentieel } from "@/lib/engine/kleuren";
import { fmtTijd, fmtCijfer } from "@/lib/format";

/**
 * De wastool: locatie-only oordeel (patroon A) op de gedeelde engine.
 * Geen kaal ja/nee maar een droogvenster: per dag het beste blok uren om
 * de was buiten te hangen, de geschatte droogtijd en een rapportcijfer,
 * voor vandaag en de vier dagen erna.
 */

const LS_LOCATIE = "kopwind.wasLocatie";
const WEEKDAG = ["zo", "ma", "di", "wo", "do", "vr", "za"];

export default function WasTool({ beginLocatie = null }) {
  const g = useGebruiker();
  const [locatie, setLocatie] = useState(beginLocatie);
  const [dagen, setDagen] = useState(null);
  const [gekozen, setGekozen] = useState(0);
  const [checkTijd, setCheckTijd] = useState(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(null);

  // Laatst gebruikte plek terugzetten, behalve als de pagina er een meegeeft.
  useEffect(() => {
    if (beginLocatie) return;
    try {
      const l = JSON.parse(localStorage.getItem(LS_LOCATIE) ?? "null");
      if (l?.lat) setLocatie(l);
    } catch {
      // Kapotte localStorage negeren.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const check = async (plek = locatie) => {
    if (!plek) {
      setFout("Kies eerst een plek: zoek een adres, tik een favoriet aan of gebruik je huidige locatie.");
      return;
    }
    setBezig(true);
    setFout(null);
    try {
      const hourly = await haalWeer(plek.lat, plek.lon, WAS_VELDEN, 5);
      const res = berekenDroogdagen(hourly, new Date(), g.thresholdsVoor("was-buiten-drogen"));
      if (!res.length) throw new Error("Geen bruikbare weerdata ontvangen. Probeer het zo nog eens.");
      setDagen(res);
      setGekozen(0);
      setCheckTijd(new Date());
      localStorage.setItem(LS_LOCATIE, JSON.stringify(plek));
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
        <LocatieZoek onKies={kies} placeholder="Zoek een adres of plaats..." />
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
            {bezig ? "Bezig..." : "Check droogweer"}
          </button>
        </div>
      </section>

      {fout && <div className="fout">{fout}</div>}

      {dagen && (
        <section className="resultaten" aria-label="Droogvenster">
          <div className="paneel">
            <VerdictBadge score={dagen[0].oordeel.score} label={dagen[0].oordeel.advies} />
            <p className="was-samenvatting">{dagen[0].samenvatting}</p>

            <div className="dagkiezer">
              {dagen.map((d, i) => (
                <button
                  key={d.datum}
                  className={"dagkaart" + (i === gekozen ? " actief" : "")}
                  onClick={() => setGekozen(i)}
                  style={{ borderTop: `4px solid ${kleurSequentieel(1 - d.oordeel.score / 100)}` }}
                >
                  <span className="dagnaam">{dagLabel(d.datum, i)}</span>
                  <span className="dagcijfer">{fmtCijfer(d.oordeel.score)}</span>
                  <span className="dagoordeel">{d.oordeel.advies}</span>
                  <span className="dagvenster">
                    {d.venster
                      ? `${String(d.venster.van).padStart(2, "0")}-${String(d.venster.tot).padStart(2, "0")} u`
                      : "geen venster"}
                  </span>
                </button>
              ))}
            </div>

            {dag && (
              <>
                {gekozen > 0 && <p className="was-samenvatting">{dag.samenvatting}</p>}
                <UrenStrip uren={dag.uren} venster={dag.venster} />
                <KleurLegenda soort="goedheid" links="blijft nat" rechts="droogt snel" />
                {dag.oordeel.redenen.length > 0 && (
                  <p className="uitleg">{zinnen(dag.oordeel.redenen)}</p>
                )}
              </>
            )}

            {checkTijd && (
              <p className="databron">
                Weerdata: Open-Meteo uurvoorspelling (incl. luchtvochtigheid),
                live opgehaald om {fmtTijd(checkTijd)}.
              </p>
            )}
          </div>
        </section>
      )}

      {!dagen && !fout && (
        <p className="leeg">
          Kies je plek en klik op Check droogweer: je ziet direct het beste
          ophangvenster van vandaag en de komende dagen.
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

function zinnen(redenen) {
  const s = redenen.join(", ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}
