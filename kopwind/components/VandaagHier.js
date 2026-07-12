"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGebruiker } from "@/components/GebruikerContext";
import LocatieZoek from "@/components/LocatieZoek";
import Icoon from "@/components/Icoon";
import { haalWeer } from "@/lib/engine/weather";
import { berekenDroogdagen } from "@/lib/tools/was-buiten-drogen";
import { kleurSequentieel, tekstKleurVoor } from "@/lib/engine/kleuren";
import { fmtCijfer, bft, kompas } from "@/lib/format";

/**
 * Functionele hero (par. 11 / audit P1-D): geen wervend blok maar direct
 * antwoord. Kies een keer je plek en de hub toont live het wascijfer van
 * vandaag en het fietsweer van dit uur, met doorklik naar beide checks.
 * De plek wordt onthouden (en pakt anders de plek van je laatste wascheck).
 */

const LS_HUB = "kopwind.hubLocatie";
const VELDEN = [
  "temperature_2m",
  "precipitation",
  "precipitation_probability",
  "wind_speed_10m",
  "wind_direction_10m",
  "relative_humidity_2m",
];

export default function VandaagHier() {
  const g = useGebruiker();
  const [locatie, setLocatie] = useState(null);
  const [klaar, setKlaar] = useState(false);
  const [data, setData] = useState(null);
  const [bezig, setBezig] = useState(false);

  useEffect(() => {
    try {
      const l =
        JSON.parse(localStorage.getItem(LS_HUB) ?? "null") ??
        JSON.parse(localStorage.getItem("kopwind.wasLocatie") ?? "null");
      if (l?.lat) setLocatie(l);
    } catch {
      // Kapotte localStorage negeren.
    }
    setKlaar(true);
  }, []);

  useEffect(() => {
    if (!locatie) return;
    let gestopt = false;
    (async () => {
      setBezig(true);
      try {
        const hourly = await haalWeer(locatie.lat, locatie.lon, VELDEN, 2);
        if (gestopt) return;
        const nu = new Date();
        const wasDag = berekenDroogdagen(hourly, nu, g.thresholdsVoor("was-buiten-drogen"))[0];
        const p = (n) => String(n).padStart(2, "0");
        const uurKey = `${nu.getFullYear()}-${p(nu.getMonth() + 1)}-${p(nu.getDate())}T${p(nu.getHours())}:00`;
        let i = hourly.time.indexOf(uurKey);
        if (i < 0) i = 0;
        setData({
          was: wasDag ?? null,
          temp: Math.round(hourly.temperature_2m?.[i] ?? 0),
          wind: hourly.wind_speed_10m?.[i] ?? 0,
          richting: hourly.wind_direction_10m?.[i] ?? 0,
          kans: Math.round(hourly.precipitation_probability?.[i] ?? 0),
        });
      } catch {
        if (!gestopt) setData(null);
      } finally {
        if (!gestopt) setBezig(false);
      }
    })();
    return () => {
      gestopt = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locatie]);

  const kies = (plek) => {
    setLocatie(plek);
    setData(null);
    g.meldInteractie();
    try {
      localStorage.setItem(LS_HUB, JSON.stringify(plek));
    } catch {
      // Opslag vol of geblokkeerd: dan onthouden we hem gewoon niet.
    }
  };

  if (!klaar) return <div className="vandaaghier" aria-hidden="true" />;

  return (
    <div className="vandaaghier">
      {!locatie ? (
        <>
          <p className="kies-kop">Waar ben je? Dan checken we het direct.</p>
          {g.presets.length > 0 && (
            <div className="chips">
              {g.presets.map((p) => (
                <button key={p.naam} className="chip" onClick={() => kies(p)}>
                  {p.naam}
                </button>
              ))}
            </div>
          )}
          <LocatieZoek onKies={kies} placeholder="Zoek je plaats of adres..." />
        </>
      ) : (
        <>
          <div className="hier-plek">
            <Icoon naam="locatie" vol maat={15} />
            <strong>{locatie.naam.split(",")[0]}</strong>
            <button className="knop klein" onClick={() => setLocatie(null)}>
              andere plek
            </button>
            {bezig && <span className="uitleg" style={{ margin: 0 }}>Live weer laden...</span>}
          </div>
          {data && (
            <div className="hier-grid">
              {data.was && (
                <Link href="/was-buiten-drogen" className="hier-kaart">
                  <span
                    className="hier-cijfer"
                    style={{
                      background: kleurSequentieel(1 - data.was.conditie.score / 100),
                      color: tekstKleurVoor(kleurSequentieel(1 - data.was.conditie.score / 100)),
                    }}
                  >
                    {fmtCijfer(data.was.conditie.score)}
                  </span>
                  <span className="hier-tekst">
                    <strong>{data.was.conditie.advies}</strong>
                    <span className="hier-vraag">Vandaag de was buiten? Doe de check</span>
                  </span>
                </Link>
              )}
              <Link href="/fietsen-naar-werk" className="hier-kaart">
                <span className="hier-cijfer" style={{ background: "var(--wolk)" }}>
                  <Icoon naam="fiets" maat={22} />
                </span>
                <span className="hier-tekst">
                  <strong>
                    {data.temp}{"\u00b0"}, {kompas(data.richting)} {bft(data.wind)} Bft, {data.kans}% buien
                  </strong>
                  <span className="hier-vraag">Vandaag op de fiets? Doe de check voor jouw route</span>
                </span>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
