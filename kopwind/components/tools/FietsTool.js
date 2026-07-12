"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import StopsEditor from "@/components/StopsEditor";
import LegCard from "@/components/LegCard";
import DagBanner from "@/components/DagBanner";
import { useGebruiker } from "@/components/GebruikerContext";
import { haalRuweEtappes, stelPlanSamen } from "@/lib/planner";
import { fmtTijd } from "@/lib/format";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

/**
 * De vlaggendrager: route/wind/keten-check met alternatieve routes, kaart
 * en rapportcijfer per rit. Draait op elke pagina die hem nodig heeft:
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
        const opts = keten.legOptions ?? [];
        // Oude ketens met "auto" op de eerste rit worden "vertrekken nu".
        if (opts[0]?.mode === "auto") opts[0] = { mode: "nu" };
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
      setFout("Vul eerst alle stops in, dan kun je de route bewaren.");
      return;
    }
    const naam = window.prompt(
      "Naam voor deze route (bv. Woon-werk, Sportschooldag):",
      "Woon-werk"
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
    setStops(r.stops);
    setLegOptions(r.legOptions?.length ? r.legOptions : [{ mode: "nu" }]);
    setFout(null);
  };

  const bereken = async () => {
    setFout(null);
    const gekozen = stops.filter(Boolean);
    if (gekozen.length < stops.length || gekozen.length < 2) {
      setFout("Vul alle stops in (minimaal je vertrekpunt en je werk).");
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
      <div className="werkblad">
        <div className="blok-planner">
          <section className="paneel">
            <h2 className="paneel-titel">Jouw rit</h2>
            {g.routes.length > 0 && (
              <div className="chips routechips">
                <span className="routekeuze-label">Mijn routes:</span>
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
                {bezig ? "Bezig..." : "Check mijn fietsrit"}
              </button>
              <button className="knop" onClick={bewaarRoute} disabled={bezig}>
                Bewaar route
              </button>
            </div>
          </section>
          {fout && <div className="fout">{fout}</div>}
        </div>

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
      </div>

      {plan ? (
        <section className="resultaten" aria-label="Ritinformatie">
          <DagBanner dag={plan.dag} />
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
        </section>
      ) : (
        !fout && (
          <p className="leeg">
            Vul je vertrekpunt en je werk in (tussenstop zoals de sportschool kan
            ook) en klik op Check mijn fietsrit.
          </p>
        )
      )}
    </div>
  );
}

function vulAan(beginStops) {
  const s = beginStops.slice(0, 6);
  while (s.length < 2) s.push(null);
  return s;
}
