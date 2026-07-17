"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import StopsEditor from "@/components/StopsEditor";
import LegCard from "@/components/LegCard";
import DagBanner from "@/components/DagBanner";
import NavKnoppen from "@/components/NavKnoppen";
import { useGebruiker } from "@/components/GebruikerContext";
import { haalRuweEtappes, stelPlanSamen } from "@/lib/planner";
import { normalizeChainToToday } from "@/lib/engine/meldingen";
import { fmtTijd } from "@/lib/format";
import { kies } from "@/lib/i18n/locale";
import { S } from "@/lib/strings";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

/**
 * De vlaggendrager: route/wind/keten-check met alternatieve routes, kaart
 * en oordeel per rit. Draait op elke pagina die hem nodig heeft:
 * de toolpagina, de stadpagina's (beginStops = [stadscentrum, null]) en de
 * van/naar-pagina's (beginStops = [A, B]). Gedeelde staat (favorieten,
 * routes, drempels, synccode) komt uit de GebruikerContext.
 */

const LS_LAST_CHAIN = "kopwind.lastChain";

export default function FietsTool({ beginStops = null }) {
  const g = useGebruiker();

  const [stops, setStops] = useState(
    beginStops ? vulAan(beginStops) : [null, null]
  );
  const [legOptions, setLegOptions] = useState([{ mode: "nu" }]);

  // Resultaatstaat: ruwe ritten uit het netwerk plus de routekeuze per rit.
  const [legsRaw, setLegsRaw] = useState(null);
  const [selection, setSelection] = useState([]);
  const [planStops, setPlanStops] = useState(null);
  const [planLegOptions, setPlanLegOptions] = useState(null);
  const [planTijd, setPlanTijd] = useState(null);
  const [actieveLeg, setActieveLeg] = useState(0);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(null);

  // Het plan wordt puur afgeleid: routewissel herrekent direct, zonder fetch.
  const plan = useMemo(() => {
    if (!legsRaw) return null;
    return stelPlanSamen({
      legsRaw,
      legOptions: planLegOptions ?? [],
      selection,
      thresholds: g.thresholdsVoor("fiets-naar-werk"),
    });
  }, [legsRaw, planLegOptions, selection, g.thresholds]);

  // Laatste keten terugzetten, behalve als de pagina een startroute meegeeft.
  useEffect(() => {
    if (beginStops) return;
    try {
      const keten = JSON.parse(localStorage.getItem(LS_LAST_CHAIN) ?? "null");
      if (keten?.stops?.length >= 2) {
        setStops(keten.stops);
        let opts = keten.legOptions ?? [];
        // Oude ketens met "auto" op de eerste rit worden "vertrekken nu".
        if (opts[0]?.mode === "auto") opts[0] = { mode: "nu" };
        // Een datum kan nooit in het verleden zitten: bij het openen van de
        // tool springen bewaarde tijden naar vandaag, de kloktijd blijft.
        opts = normalizeChainToToday(opts, new Date());
        setLegOptions(opts.length ? opts : [{ mode: "nu" }]);
      }
    } catch {
      // Kapotte localStorage negeren; schone start.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Laatste keten bewaren voor de volgende sessie op dit apparaat.
  useEffect(() => {
    if (!plan || !planStops) return;
    localStorage.setItem(
      LS_LAST_CHAIN,
      JSON.stringify({
        stops: planStops,
        legOptions: planLegOptions,
        durations: plan.legs.map((l) => l.duration),
        selection,
      })
    );
  }, [plan, planStops, planLegOptions, selection]);

  const bewaarRoute = () => {
    const gekozen = stops.filter(Boolean);
    if (gekozen.length < stops.length || gekozen.length < 2) {
      setFout(kies({ nl: "Vul eerst alle stops in, dan kun je de route bewaren.", en: "Fill in all stops first, then you can save the route." }));
      return;
    }
    const naam = window.prompt(
      kies({ nl: "Naam voor deze route (bv. Woon-werk, Sportschooldag):", en: "Name for this route (e.g. Commute, Gym day):" }),
      kies({ nl: "Woon-werk", en: "Commute" })
    );
    if (!naam) return;
    const bestaand = g.routes.find((r) => r.naam === naam.trim());
    g.zetRoutes([
      ...g.routes.filter((r) => r.naam !== naam.trim()),
      {
        naam: naam.trim(),
        stops: gekozen,
        legOptions,
        durations: plan?.legs?.map((l) => l.duration) ?? bestaand?.durations,
        meldingen: bestaand?.meldingen,
      },
    ]);
    setFout(null);
  };

  const laadRoute = (r) => {
    g.meldInteractie();
    setStops(r.stops);
    // Ook hier: de datum van bewaarde tijden nooit in het verleden.
    const opts = normalizeChainToToday(r.legOptions ?? [], new Date());
    setLegOptions(opts.length ? opts : [{ mode: "nu" }]);
    setFout(null);
  };

  const bereken = async () => {
    setFout(null);
    const gekozen = stops.filter(Boolean);
    if (gekozen.length < stops.length || gekozen.length < 2) {
      setFout(kies({ nl: "Vul alle stops in (minimaal je vertrekpunt en je werk).", en: "Fill in all stops (at least your start and your work)." }));
      return;
    }
    setBezig(true);
    try {
      const raw = await haalRuweEtappes({ stops: gekozen });
      const zeros = raw.map(() => 0);
      const plan0 = stelPlanSamen({
        legsRaw: raw,
        legOptions,
        selection: zeros,
        thresholds: g.thresholdsVoor("fiets-naar-werk"),
      });
      setPlanStops(gekozen);
      setPlanLegOptions(legOptions);
      setLegsRaw(raw);
      setSelection(zeros);
      setPlanTijd(new Date());
      setActieveLeg(plan0.dag?.worstIdx ?? 0);
      g.meldInteractie();
    } catch (e) {
      setLegsRaw(null);
      setFout(e.message ?? String(e));
    } finally {
      setBezig(false);
    }
  };

  const kiesRoute = (legIdx, routeIdx) => {
    setSelection((prev) => {
      const next = prev.slice();
      next[legIdx] = routeIdx;
      return next;
    });
    setActieveLeg(legIdx);
  };

  return (
    <div>
      {plan && (
        <section className="resultaten" aria-label={kies({ nl: "Ritinformatie", en: "Ride details" })}>
          <DagBanner dag={plan.dag} />
        </section>
      )}

      <div className="werkblad">
        <div className="blok-map">
          <div className="kaartpaneel">
            <MapView
              legs={plan?.legs}
              actieveLeg={actieveLeg}
              onKiesRoute={kiesRoute}
              presets={g.presets}
              startCenter={
                beginStops?.[0] ? [beginStops[0].lat, beginStops[0].lon] : undefined
              }
              startZoom={beginStops?.[0] ? 11 : undefined}
            />
          </div>
        </div>

        {plan && (
          <div className="blok-legs">
            <NavKnoppen stops={planStops} />
            <div className="legs">
              {plan.legs.map((leg, i) => (
                <LegCard
                  key={i}
                  leg={leg}
                  index={i}
                  actief={i === actieveLeg}
                  onClick={() => setActieveLeg(i)}
                  onKiesRoute={kiesRoute}
                />
              ))}
            </div>
            {planTijd && (
              <p className="databron">
                Weerdata: Open-Meteo uurvoorspelling, live opgehaald om{" "}
                {fmtTijd(planTijd)}. Routes: OpenStreetMap.
              </p>
            )}
          </div>
        )}
      </div>

      {!plan && !fout && (
        <p className="leeg">
          {kies({
            nl: "Vul je vertrekpunt en je werk in (tussenstop zoals de sportschool kan ook) en tik op Check je rit.",
            en: "Fill in your start and your work (a stopover like the gym works too) and tap Check your ride.",
          })}
        </p>
      )}

      <section className="paneel blok-planner" aria-label={kies({ nl: "Route bouwen", en: "Build your route" })}>
        <h2 className="paneel-titel">{kies({ nl: "Jouw rit", en: "Your ride" })}</h2>
        {g.routes.length > 0 && (
          <div className="chips routechips">
            <span className="routekeuze-label">{kies({ nl: "Mijn routes:", en: "My routes:" })}</span>
            {g.routes.map((r) => (
              <button
                key={r.naam}
                className="chip"
                onClick={() => laadRoute(r)}
                title={r.stops.map((s) => s.naam.split(",")[0]).join(" \u2192 ")}
              >
                {r.naam}
              </button>
            ))}
          </div>
        )}
        <StopsEditor
          stops={stops}
          setStops={setStops}
          legOptions={legOptions}
          setLegOptions={setLegOptions}
          presets={g.presets}
          onSavePreset={g.bewaarPreset}
        />
        <div className="actiebalk">
          <button className="knop primair" onClick={bereken} disabled={bezig}>
            {bezig ? S.algemeen.bezig : kies({ nl: "Check je rit", en: "Check your ride" })}
          </button>
          <button className="knop" onClick={bewaarRoute} disabled={bezig}>
            {kies({ nl: "Bewaar route", en: "Save route" })}
          </button>
        </div>
        {fout && <div className="fout">{fout}</div>}
      </section>
    </div>
  );
}

function vulAan(beginStops) {
  const s = beginStops.slice(0, 6);
  while (s.length < 2) s.push(null);
  return s;
}
