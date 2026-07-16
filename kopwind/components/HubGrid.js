"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LocatieZoek from "@/components/LocatieZoek";
import Icoon from "@/components/Icoon";
import { useDagVerdicts } from "@/components/useDagVerdicts";
import { schaalVoor, labelVoor, kleurVoorSchaal } from "@/lib/engine/schaal";
import { huidigeLocatie } from "@/lib/engine/locatie";
import { STEDEN, dichtstbijzijndeStad } from "@/lib/steden/nl";
import { TOOLS } from "@/lib/tools";
import { S } from "@/lib/strings";
import { PAD } from "@/lib/i18n/paden";

/**
 * De homepage als product (v3.0.0): kies een stad en elke kaart toont
 * meteen het antwoord van vandaag. Ja of Nee met een schaalwoord in een
 * kleurbadge, plus een regel met het moment. Een stad is hier genoeg;
 * je exacte adres hoeft alleen waar het er echt toe doet (de route).
 */

const POPULAIR = [
  { naam: "Nederland", lat: 52.11, lon: 5.181 },
  ...["amsterdam", "rotterdam", "utrecht", "den-haag"]
    .map((slug) => STEDEN.find((s) => s.slug === slug))
    .filter(Boolean)
    .map((s) => ({ naam: s.naam, lat: s.lat, lon: s.lon })),
];

export default function HubGrid() {
  // Een bron voor stad plus dagverdicten: dezelfde hook als alle-checks,
  // met de vereniging van alle weerVelden (zo heeft ook de
  // hooikoortskaart hier zijn pollenvelden; v3.13.0).
  const { stad, kiesStad, dagen, laden, fout } = useDagVerdicts();
  const [lokaleFout, setLokaleFout] = useState(null);
  const [recent, setRecent] = useState([]);

  // De drie meest recent gebruikte checks van deze gebruiker (lokaal
  // bijgehouden door RecentTracker op de toolpagina's).
  useEffect(() => {
    try {
      const ids = JSON.parse(localStorage.getItem("kopwind.recenteTools") ?? "[]");
      setRecent(ids.map((id) => TOOLS.find((t) => t.id === id)).filter(Boolean).slice(0, 3));
    } catch {
      setRecent([]);
    }
  }, []);

  const kies = (plek) => {
    setLokaleFout(null);
    kiesStad(plek);
  };

  const mijnPlek = async () => {
    try {
      const hier = await huidigeLocatie();
      const s = dichtstbijzijndeStad(hier.lat, hier.lon);
      if (s) kies({ naam: s.naam, lat: s.lat, lon: s.lon });
    } catch {
      setLokaleFout(S.hub.locatieFout);
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

      {(fout ?? lokaleFout) && <div className="fout">{fout ?? lokaleFout}</div>}

      {recent.length > 0 && (
        <>
          <h2 className="hub-kop">{S.hub.recentKop}</h2>
          <div className="checkgrid">
            {recent.map((t) => (
              <ToolKaart key={t.id} t={t} dag={dagen?.[t.id]} stad={stad} laden={laden} />
            ))}
          </div>
        </>
      )}

      <h2 className="hub-kop">{S.menu.alle}</h2>
      <div className="checkgrid">
        {TOOLS.map((t) => (
          <ToolKaart key={t.id} t={t} dag={dagen?.[t.id]} stad={stad} laden={laden} />
        ))}
      </div>

      <Link href={PAD.alleChecks} className="allechecks-kaart paneel">
        <span>
          <span className="allechecks-titel">{S.hub.alleChecksTitel}</span>
          <span className="kaartregel stil">{S.hub.alleChecksSub}</span>
        </span>
        <Icoon naam="pijl" maat={18} />
      </Link>
    </section>
  );
}

function ToolKaart({ t, dag, stad, laden }) {
  return (
    <Link
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
        <h3 className="kaart-vraag">{t.korteVraag}</h3>
        <KaartBadge tool={t} dag={dag} stad={stad} />
      </span>
      <KaartRegel tool={t} dag={dag} stad={stad} laden={laden} />
      <span className="kaart-cta">
        <span className="kaart-cta-tekst">{t.cta}</span> <Icoon naam="pijl" maat={13} />
      </span>
    </Link>
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
