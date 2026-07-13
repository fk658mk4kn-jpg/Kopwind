"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGebruiker } from "@/components/GebruikerContext";
import LocatieZoek from "@/components/LocatieZoek";
import Icoon from "@/components/Icoon";
import { haalWeer } from "@/lib/engine/weather";
import { BASIS_VELDEN } from "@/lib/engine/weerbasis";
import { schaalVoor, labelVoor, kleurVoorSchaal } from "@/lib/engine/schaal";
import { huidigeLocatie } from "@/lib/engine/locatie";
import { STEDEN, dichtstbijzijndeStad } from "@/lib/steden/nl";
import { TOOLS } from "@/lib/tools";
import { S } from "@/lib/strings";
import { kies as kiesTaal } from "@/lib/i18n/locale";
import { PAD } from "@/lib/i18n/paden";

/**
 * De homepage als product (v3.0.0): kies een stad en elke kaart toont
 * meteen het antwoord van vandaag. Ja of Nee met een schaalwoord in een
 * kleurbadge, plus een regel met het moment. Een stad is hier genoeg;
 * je exacte adres hoeft alleen waar het er echt toe doet (de route).
 */

/**
 * "Nederland" als plek: De Bilt, het KNMI-referentiepunt, als landelijk
 * gemiddelde. Wie binnenkomt zonder keuze ziet zo meteen live antwoorden.
 */
const NEDERLAND = { naam: "Nederland", lat: 52.11, lon: 5.181 };

const POPULAIR = [
  NEDERLAND,
  ...["amsterdam", "rotterdam", "utrecht", "den-haag"]
    .map((slug) => STEDEN.find((s) => s.slug === slug))
    .filter(Boolean)
    .map((s) => ({ naam: s.naam, lat: s.lat, lon: s.lon })),
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
      setStad(l?.lat ? l : NEDERLAND);
    } catch {
      setStad(NEDERLAND);
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
      setFout(S.hub.locatieFout);
    }
  };

  return (
    <section className="hubgrid" aria-label={S.hub.checksVanVandaag}>
      <div className="kiesbalk paneel">
        <span className="kiesbalk-label">
          {stad ? `${S.hub.vandaagIn} ${stad.naam === "Nederland" ? S.hub.landnaam : stad.naam}` : S.hub.waarBenJe}
        </span>
        <div className="chips">
          {POPULAIR.map((p) => (
            <button
              key={p.naam}
              className={"chip" + (stad?.naam === p.naam ? " actief" : "")}
              onClick={() => kies(p)}
            >
              {p.naam}
            </button>
          ))}
        </div>
        <div className="kiesbalk-zoek">
          <LocatieZoek onKies={kies} placeholder={S.hub.zoekStad} />
          <button className="knop klein" onClick={mijnPlek}>
            {S.hub.mijnLocatie}
          </button>
        </div>
      </div>

      {fout && <div className="fout">{fout}</div>}

      <div className="checkgrid">
        {TOOLS.map((t) => (
          <Link
            key={t.id}
            href={`/${t.slug}`}
            className="checkkaart"
            style={{
              background: `color-mix(in srgb, ${t.kleur} 6%, #ffffff)`,
              borderColor: `color-mix(in srgb, ${t.kleur} 28%, #ffffff)`,
            }}
          >
            <span className="kaart-watermerk" aria-hidden="true" style={{ color: t.kleur }}>
              <Icoon naam={t.icoon} maat={96} />
            </span>
            <span className="kaart-rij1">
              <span className="icon-chip klein" style={{ background: `color-mix(in srgb, ${t.kleur} 15%, #ffffff)`, color: t.kleur }}>
                <Icoon naam={t.icoon} maat={16} />
              </span>
              <h2 className="kaart-vraag">{t.korteVraag}</h2>
              <KaartBadge tool={t} dag={dagen?.[t.id]} stad={stad} />
            </span>
            <KaartRegel tool={t} dag={dagen?.[t.id]} stad={stad} laden={laden} />
            <span className="kaart-cta">
              <span className="kaart-cta-tekst">{t.cta}</span> <Icoon naam="pijl" maat={13} />
            </span>
          </Link>
        ))}
      </div>

      <p className="binnenkort-regel">
        {kiesTaal({
          nl: "Meer vragen? ",
          en: "More questions? ",
        })}
        <Link href={PAD.alleChecks}>{S.menu.alle}</Link>
      </p>
    </section>
  );
}

function KaartBadge({ tool, dag, stad }) {
  if (typeof tool.overlay !== "function" || !stad || !dag) return null;
  const kleur = kleurVoorSchaal(schaalVoor(dag.conditie.score).id);
  return <span className={"badge " + kleur}>{labelVoor(dag.conditie.score, tool.schaalLabels)}</span>;
}

function KaartRegel({ tool, dag, stad, laden }) {
  let tekst;
  let stil = false;
  if (typeof tool.overlay !== "function") {
    tekst = tool.diepte;
  } else if (!stad) {
    tekst = S.hub.kiesStad;
    stil = true;
  } else if (laden || dag === undefined) {
    tekst = S.hub.laden;
    stil = true;
  } else if (!dag) {
    tekst = S.hub.geenAntwoord;
    stil = true;
  } else {
    tekst = eersteZin(dag.antwoord?.zin ?? dag.status.zin);
  }
  return <p className={"kaartregel klem" + (stil ? " stil" : "")}>{tekst}</p>;
}

function eersteZin(tekst) {
  if (!tekst) return "";
  const punt = tekst.indexOf(". ");
  return punt > 0 && punt < tekst.length - 2 ? tekst.slice(0, punt + 1) : tekst;
}
