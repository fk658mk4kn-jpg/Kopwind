"use client";

import { useEffect, useRef, useState } from "react";
import { useGebruiker } from "@/components/GebruikerContext";
import PlekKiezer from "@/components/tools/PlekKiezer";
import VerdictBadge from "@/components/VerdictBadge";
import UrenStrip from "@/components/UrenStrip";
import OutfitFiguur from "@/components/OutfitFiguur";
import { haalWeer } from "@/lib/engine/weather";
import { haalLucht } from "@/lib/engine/lucht";
import { factorenVoor } from "@/lib/engine/factoren";
import FactorBalken from "@/components/FactorBalken";
import { BASIS_VELDEN } from "@/lib/engine/weerbasis";
import { isFavoriet } from "@/lib/engine/locatie";
import { TOOLS } from "@/lib/tools";
import { S } from "@/lib/strings";
import { fmtTijd } from "@/lib/format";
import { schaalVoor, labelVoor, kleurVoorSchaal } from "@/lib/engine/schaal";
import { VARIANTEN, variantVerdict } from "@/lib/varianten";

/**
 * Gedeelde UI voor elke locatie-tool (het overlay-contract): kies je plek,
 * druk op de check en je krijgt het antwoord (Ja/Nee plus schaalwoord),
 * de status in gewone taal, het aanbevolen venster in de urenstrip en een
 * dagkiezer met per dag het antwoord plus een regel. Een nieuwe tool levert alleen een overlay-functie en
 * teksten; deze component doet de rest.
 */

const WEEKDAG = S.algemeen.weekdagen;

export default function LocatieTool({ toolId, beginLocatie = null, variantId = null }) {
  const tool = TOOLS.find((t) => t.id === toolId);
  const g = useGebruiker();
  const [locatie, setLocatie] = useState(beginLocatie);
  const [dagen, setDagen] = useState(null);
  const [legenda, setLegenda] = useState(null);
  const [hourly, setHourly] = useState(null);
  const [gekozen, setGekozen] = useState(0);
  const [checkTijd, setCheckTijd] = useState(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(null);

  const lsSleutel = `kopwind.locatie.${toolId}`;
  const autoRan = useRef(false);

  // Laatst gebruikte plek terugzetten (met de oude was-sleutel als erfenis).
  useEffect(() => {
    if (beginLocatie) return;
    try {
      const l =
        JSON.parse(localStorage.getItem(lsSleutel) ?? "null") ??
        JSON.parse(localStorage.getItem("kopwind.wasLocatie") ?? "null");
      if (l?.lat) {
        setLocatie(l);
        // Plek bekend: meteen de uitslag laten zien, zonder extra tik
        // op de checkknop (v3.4.0 "Ponente").
        if (!autoRan.current) {
          autoRan.current = true;
          check(l);
        }
      }
    } catch {
      // Kapotte localStorage negeren.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const check = async (plek = locatie) => {
    if (!plek) {
      setFout(S.locatieTool.kiesEerst);
      return;
    }
    setBezig(true);
    setFout(null);
    try {
      const hourly =
        tool.databron === "lucht"
          ? await haalLucht(plek.lat, plek.lon, tool.luchtVelden, tool.weerDagen ?? 5)
          : await haalWeer(plek.lat, plek.lon, tool.weerVelden ?? BASIS_VELDEN, tool.weerDagen ?? 5);
      const res = tool.overlay(hourly, new Date(), g.thresholdsVoor(toolId));
      if (!res?.dagen?.length) throw new Error(S.locatieTool.geenData);
      setDagen(res.dagen);
      setHourly(hourly);
      setLegenda(res.legenda ?? null);
      setGekozen(0);
      setCheckTijd(new Date());
      localStorage.setItem(lsSleutel, JSON.stringify(plek));
      g.meldInteractie();
    } catch (e) {
      setDagen(null);
      setHourly(null);
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
      <div className={"tool-top" + (dagen && dag ? " met-antwoord" : "")}>
        <PlekKiezer
          presets={g.presets}
          locatie={locatie}
          onKies={kies}
          onCheck={() => check()}
          bezig={bezig}
          cta={tool.cta}
          locatieHint={tool.locatieHint}
          favoriet={favoriet}
          bewaarPreset={g.bewaarPreset}
        />

        {dagen && dag && (
          <section className="paneel antwoord-paneel" aria-label="Antwoord">
            {/* Variantpagina (v3.24.0): het eigen ja/nee-antwoord op de
                variantvraag bovenaan, afgeleid uit hetzelfde
                overlay-resultaat (geen tweede berekening of fetch).
                Daaronder het volledige kledingadvies van de ouder. */}
            {variantId && (() => {
              const v = variantVerdict(variantId, dag);
              const vraag = VARIANTEN.find((x) => x.id === variantId)?.vraag;
              if (!v) return null;
              return (
                <p className="variant-antwoord">
                  <span className={"badge " + kleurVoorSchaal(schaalVoor(v.conditie.score).id)}>
                    {v.variantLabel}
                  </span>
                  <span className="variant-zin"><strong>{vraag}</strong> {v.zin}</span>
                </p>
              );
            })()}
            <VerdictBadge score={dag.conditie.score} labels={tool.schaalLabels} />
            {dag.outfit && <OutfitFiguur outfit={dag.outfit} />}
            <p className="status-regel">{dag.status.zin}</p>
            {dag.metric?.zin && <p className="metric-zin">{dag.metric.zin}</p>}
            {dag.conditie.redenen.length > 0 && (
              <p className="uitleg waarom">{S.locatieTool.waarom} {zinnen(dag.conditie.redenen)}</p>
            )}
            {/* v3.26.0 (feedback): "Wat het oordeel bepaalt" hoort
                direct onder het oordeel zelf, niet in een los paneel
                verderop. Zelfde data, andere plek. */}
            {hourly && (
              <FactorBalken factoren={factorenVoor(tool.id, hourly, gekozen, dag.venster)?.factoren} />
            )}
          </section>
        )}
      </div>

      {fout && <div className="fout">{fout}</div>}

      {dagen && dag && (
        <div className="sticky-antwoord" aria-hidden="true">
          <span className={"badge " + kleurVoorSchaal(schaalVoor(dag.conditie.score).id)}>
            {labelVoor(dag.conditie.score, tool.schaalLabels)}
          </span>
          {dag.venster && (
            <span className="sticky-venster">
              {String(dag.venster.van).padStart(2, "0")}-{String(dag.venster.tot).padStart(2, "0")} u
            </span>
          )}
        </div>
      )}

      {dagen && dag && (
        <section className="resultaten" aria-label="Details">
          <div className="paneel">
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
                    {labelVoor(d.conditie.score, tool.schaalLabels)}
                  </span>
                  <span className="dagregel">{dagRegel(d)}</span>
                </button>
              ))}
            </div>

            <UrenStrip uren={dag.uren} venster={dag.venster} legenda={legenda} />

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
          Kies je plek en tik op {tool.cta} voor het antwoord van vandaag en de dagen erna.
        </p>
      )}
    </div>
  );
}

function dagLabel(datum, index) {
  if (index === 0) return S.algemeen.vandaag;
  const d = new Date(`${datum}T12:00:00`);
  return `${WEEKDAG[d.getDay()]} ${d.getDate()}`;
}

function dagRegel(d) {
  if (d.venster) {
    return `${String(d.venster.van).padStart(2, "0")}-${String(d.venster.tot).padStart(2, "0")} u`;
  }
  return d.status?.soort === "nee" ? S.locatieTool.lieverNiet : S.locatieTool.wisselvallig;
}

function zinnen(redenen) {
  const s = redenen.join(", ");
  return s.charAt(0).toUpperCase() + s.slice(1) + ".";
}
