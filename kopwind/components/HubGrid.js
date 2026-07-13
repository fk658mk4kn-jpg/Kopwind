"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGebruiker } from "@/components/GebruikerContext";
import LocatieZoek from "@/components/LocatieZoek";
import Icoon from "@/components/Icoon";
import { haalWeer } from "@/lib/engine/weather";
import { BASIS_VELDEN } from "@/lib/engine/weerbasis";
import { schaalVoor, kleurVoorSchaal } from "@/lib/engine/schaal";
import { huidigeLocatie } from "@/lib/engine/locatie";
import { dichtstbijzijndeStad } from "@/lib/steden/nl";
import { TOOLS } from "@/lib/tools";

/**
 * De homepage als product (v3.0.0): kies een stad en elke kaart toont
 * meteen het antwoord van vandaag. Ja of Nee met een schaalwoord in een
 * kleurbadge, plus een regel met het moment. Een stad is hier genoeg;
 * je exacte adres hoeft alleen waar het er echt toe doet (de route).
 */

const TEASERS = [
  { naam: "Vandaag barbecue?", zin: "Het beste blok vanavond, en waar je 'm neerzet met deze wind." },
  { naam: "Word ik nat?", zin: "Wanneer de buien vallen op jouw dag." },
  { naam: "Moet ik krabben?", zin: "Vorst- en ijzelrisico voor morgenochtend." },
];

export default function HubGrid() {
  const g = useGebruiker();
  const [stad, setStad] = useState(null);
  const [dagen, setDagen] = useState(null);
  const [laden, setLaden] = useState(false);
  const [fout, setFout] = useState(null);

  useEffect(() => {
    try {
      const l = JSON.parse(localStorage.getItem("kopwind.hubLocatie") ?? "null");
      if (l?.lat) setStad(l);
    } catch {
      // Kapotte localStorage negeren.
    }
  }, []);

  useEffect(() => {
    if (!stad) return;
    let actief = true;
    setLaden(true);
    setFout(null);
    haalWeer(stad.lat, stad.lon, BASIS_VELDEN, 2)
      .then((hourly) => {
        if (!actief) return;
        const nu = new Date();
        const uit = {};
        for (const t of TOOLS) {
          if (typeof t.overlay !== "function") continue;
          try {
            uit[t.id] = t.overlay(hourly, nu, g.thresholdsVoor(t.id)).dagen?.[0] ?? null;
          } catch {
            uit[t.id] = null;
          }
        }
        setDagen(uit);
      })
      .catch((e) => actief && setFout(e.message ?? String(e)))
      .finally(() => actief && setLaden(false));
    return () => {
      actief = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stad]);

  const kies = (plek) => {
    const kaal = { naam: plek.naam.split(",")[0], lat: plek.lat, lon: plek.lon };
    setStad(kaal);
    localStorage.setItem("kopwind.hubLocatie", JSON.stringify(kaal));
    g.meldInteractie();
  };

  const mijnPlek = async () => {
    try {
      const hier = await huidigeLocatie();
      const s = dichtstbijzijndeStad(hier.lat, hier.lon);
      if (s) kies({ naam: s.naam, lat: s.lat, lon: s.lon });
    } catch {
      setFout("Locatie ophalen lukte niet. Zoek je stad hierboven, dat werkt net zo goed.");
    }
  };

  return (
    <section className="hubgrid" aria-label="De checks van vandaag">
      <div className="kiesbalk paneel">
        <span className="kiesbalk-label">{stad ? `Vandaag in ${stad.naam}` : "Waar ben je?"}</span>
        {g.presets.length > 0 && (
          <div className="chips">
            {g.presets.slice(0, 4).map((p) => (
              <button key={p.naam} className="chip" onClick={() => kies(p)}>
                {p.naam}
              </button>
            ))}
          </div>
        )}
        <div className="kiesbalk-zoek">
          <LocatieZoek onKies={kies} placeholder="Zoek je stad..." />
          <button className="knop klein" onClick={mijnPlek}>
            Gebruik mijn locatie
          </button>
        </div>
      </div>

      {fout && <div className="fout">{fout}</div>}

      <div className="checkgrid">
        {TOOLS.map((t) => (
          <div key={t.id} className="checkkaart">
            <span className="kaart-top">
              <Icoon naam={t.icoon} maat={20} />
              <h2>{t.naam}</h2>
            </span>
            <KaartLive tool={t} dag={dagen?.[t.id]} stad={stad} laden={laden} />
            <Link href={`/${t.slug}`} className="knop klein kaartknop">
              {t.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="binnenkort-rij" aria-label="Binnenkort">
        {TEASERS.map((t) => (
          <div key={t.naam} className="binnenkort-kaart">
            <span className="badge klein">Binnenkort</span>
            <strong>{t.naam}</strong>
            <span>{t.zin}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function KaartLive({ tool, dag, stad, laden }) {
  if (typeof tool.overlay !== "function") {
    return <p className="kaartregel">{tool.diepte}</p>;
  }
  if (!stad) return <p className="kaartregel stil">Kies je stad hierboven.</p>;
  if (laden || dag === undefined) return <p className="kaartregel stil">Even naar de lucht kijken...</p>;
  if (!dag) return <p className="kaartregel stil">Nu even geen antwoord. Probeer de check zelf.</p>;
  const s = schaalVoor(dag.conditie.score);
  const kleur = kleurVoorSchaal(s.id);
  const ja = dag.antwoord?.ja ?? null;
  return (
    <div className="kaartlive">
      <span className={"badge " + kleur}>
        {ja === null ? s.label : ja ? "Ja" : "Nee"}
        {ja !== null && <span className="badge-woord">{s.label}</span>}
      </span>
      <p className="kaartregel">{eersteZin(dag.antwoord?.zin ?? dag.status.zin)}</p>
    </div>
  );
}

function eersteZin(tekst) {
  if (!tekst) return "";
  const punt = tekst.indexOf(". ");
  return punt > 0 && punt < tekst.length - 2 ? tekst.slice(0, punt + 1) : tekst;
}
