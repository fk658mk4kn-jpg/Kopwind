"use client";

import { useState } from "react";
import { useGebruiker } from "@/components/GebruikerContext";
import PlekKiezer from "@/components/tools/PlekKiezer";
import Icoon from "@/components/Icoon";
import { haalMinutely, analyseerMinutely } from "@/lib/engine/minutely";
import { useLocatie } from "@/components/tools/useLocatie";
import { isFavoriet } from "@/lib/engine/locatie";
import { TOOLS } from "@/lib/tools";
import { S } from "@/lib/strings";
import { fmtTijd } from "@/lib/format";

/**
 * "Wanneer gaat het regenen?" (v3.6.0 "Bora", gelijkgetrokken met de
 * standaardopzet in v3.7.7). Nowcast-weergave op de 15-minuten reeks: de
 * kernvraag (binnen een uur regen?), de eerstvolgende bui, de piek, het
 * eerstvolgende droge blok, en een samenvatting per dagdeel. Zelfde
 * plek-kiezer, actieknop, databron-regel en layout als de weertools; geen
 * 5-daagse dagkiezer of factorbalken, want dit gaat over nu en de komende
 * uren.
 */
function dagdeelStatus(punten, vanUur, totUur) {
  const inBlok = punten.filter((p) => {
    const u = p.tijd.getHours();
    return u >= vanUur && u < totUur;
  });
  if (!inBlok.length) return null;
  return inBlok.some((p) => p.nat) ? "bui" : "droog";
}

export default function RegenTimingTool() {
  const tool = TOOLS.find((t) => t.id === "regen-timing");
  const g = useGebruiker();
  const [analyse, setAnalyse] = useState(null);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(null);
  const [checkTijd, setCheckTijd] = useState(null);

  const doeCheck = async (plek) => {
    if (!plek) return;
    setBezig(true);
    setFout(null);
    try {
      const minutely = await haalMinutely(plek.lat, plek.lon, 1);
      const res = analyseerMinutely(minutely, new Date());
      setAnalyse(res);
      setCheckTijd(new Date());
      g.meldInteractie();
    } catch (e) {
      setAnalyse(null);
      setFout(e.message ?? String(e));
    } finally {
      setBezig(false);
    }
  };

  const { locatie, kiesLocatie } = useLocatie("regen-timing", doeCheck);
  const favoriet = isFavoriet(locatie, g.presets);

  const dagdelen = analyse
    ? [
        { id: "ochtend", status: dagdeelStatus(analyse.punten, 6, 12) },
        { id: "middag", status: dagdeelStatus(analyse.punten, 12, 18) },
        { id: "avond", status: dagdeelStatus(analyse.punten, 18, 24) },
      ].filter((d) => d.status)
    : [];

  return (
    <section className="tool-werk">
      <div className={"tool-top" + (analyse ? " met-antwoord" : "")}>
        <PlekKiezer
          presets={g.presets}
          locatie={locatie}
          onKies={kiesLocatie}
          onCheck={() => doeCheck(locatie)}
          bezig={bezig}
          cta={tool.cta}
          locatieHint={S.regenTiming.kiesPlek}
          favoriet={favoriet}
          bewaarPreset={g.bewaarPreset}
        />

        {analyse && (
          <div className="paneel timing-paneel antwoord-paneel">
            <div className={"timing-kern " + (analyse.binnenEenUur ? "nat" : "droog")}>
              <Icoon naam="druppel" maat={22} />
              <strong>{analyse.binnenEenUur ? S.regenTiming.binnenUurJa : S.regenTiming.binnenUurNee}</strong>
            </div>

            <ul className="timing-lijst">
              {analyse.nuNat && (
                <li>
                  <Icoon naam="druppel" maat={16} /> {S.regenTiming.nuNat}
                </li>
              )}
              {!analyse.nuNat && analyse.eersteRegen && (
                <li>
                  <Icoon naam="klok" maat={16} /> {S.regenTiming.eersteRegen(fmtTijd(analyse.eersteRegen.tijd))}
                </li>
              )}
              {!analyse.eersteRegen && !analyse.nuNat && (
                <li>
                  <Icoon naam="vinkje" maat={16} /> {S.regenTiming.langDroog}
                </li>
              )}
              {analyse.piek && (
                <li>
                  <Icoon naam="pijl" maat={16} /> {S.regenTiming.piek(fmtTijd(analyse.piek.tijd), analyse.piek.mm.toFixed(1))}
                </li>
              )}
              {analyse.eersteDroog && (
                <li>
                  <Icoon naam="vinkje" maat={16} /> {S.regenTiming.eersteDroog(fmtTijd(analyse.eersteDroog.tijd))}
                </li>
              )}
            </ul>

            {dagdelen.length > 0 && (
              <div className="timing-dagdelen">
                {dagdelen.map((d) => (
                  <div key={d.id} className={"timing-dagdeel " + d.status}>
                    <span className="timing-dagdeel-naam">{S.regenTiming.dagdeel[d.id]}</span>
                    <span className="timing-dagdeel-status">
                      {d.status === "droog" ? S.regenTiming.dagdeelDroog : S.regenTiming.dagdeelBui}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {checkTijd && (
              <p className="databron">
                Weerdata: Open-Meteo neerslag per kwartier, live opgehaald om {fmtTijd(checkTijd)}.
              </p>
            )}
          </div>
        )}
      </div>

      {fout && <div className="fout">{fout}</div>}
    </section>
  );
}
