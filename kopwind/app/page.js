"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import StopsEditor from "@/components/StopsEditor";
import LegCard from "@/components/LegCard";
import DagBanner from "@/components/DagBanner";
import SettingsPanel from "@/components/SettingsPanel";
import MeldingenPanel from "@/components/MeldingenPanel";
import NotificationManager from "@/components/NotificationManager";
import { haalRuweEtappes, stelPlanSamen } from "@/lib/planner";
import { DEFAULT_THRESHOLDS } from "@/lib/advice";
import { DEFAULT_MELDINGEN } from "@/lib/notify";
import { afrondOpKwartier, toLocalInput } from "@/lib/format";
import { DEMO_STOPS, demoLegOptions, demoFetch } from "@/lib/demo";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const LS = {
  presets: "kopwind.presets",
  thresholds: "kopwind.thresholds",
  lastChain: "kopwind.lastChain",
  meldingen: "kopwind.meldingen",
};

export default function Page() {
  const [stops, setStops] = useState([null, null]);
  const [legOptions, setLegOptions] = useState([{ mode: "vertrek", tijd: "" }]);
  const [presets, setPresets] = useState([]);
  const [thresholds, setThresholds] = useState({ ...DEFAULT_THRESHOLDS });
  const [meldingen, setMeldingen] = useState({ ...DEFAULT_MELDINGEN });

  // Resultaatstaat: ruwe etappes uit het netwerk plus de routekeuze per etappe.
  const [legsRaw, setLegsRaw] = useState(null);
  const [selection, setSelection] = useState([]);
  const [planStops, setPlanStops] = useState(null);
  const [planLegOptions, setPlanLegOptions] = useState(null);
  const [actieveLeg, setActieveLeg] = useState(0);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(null);
  const [instellingenOpen, setInstellingenOpen] = useState(false);
  const [meldingenOpen, setMeldingenOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  // Het plan wordt puur afgeleid: routewissel herrekent direct, zonder fetch.
  const plan = useMemo(() => {
    if (!legsRaw) return null;
    return stelPlanSamen({
      legsRaw,
      legOptions: planLegOptions ?? [],
      selection,
      thresholds,
    });
  }, [legsRaw, planLegOptions, selection, thresholds]);

  // Opgeslagen staat laden (hydration-safe: pas na mount).
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(LS.presets) ?? "[]");
      if (Array.isArray(p)) setPresets(p);
      const t = JSON.parse(localStorage.getItem(LS.thresholds) ?? "null");
      if (t) setThresholds({ ...DEFAULT_THRESHOLDS, ...t });
      const m = JSON.parse(localStorage.getItem(LS.meldingen) ?? "null");
      if (m) setMeldingen({ ...DEFAULT_MELDINGEN, ...m });
      const keten = JSON.parse(localStorage.getItem(LS.lastChain) ?? "null");
      if (keten?.stops?.length >= 2) {
        setStops(keten.stops);
        setLegOptions(keten.legOptions ?? []);
        return;
      }
    } catch {
      // Kapotte localStorage negeren; schone start.
    }
    setLegOptions([
      { mode: "vertrek", tijd: toLocalInput(afrondOpKwartier(new Date())) },
    ]);
  }, []);

  // Laatste keten bewaren voor de meldingen: stops, tijden, reistijden, keuze.
  useEffect(() => {
    if (!plan || isDemo || !planStops) return;
    localStorage.setItem(
      LS.lastChain,
      JSON.stringify({
        stops: planStops,
        legOptions: planLegOptions,
        durations: plan.legs.map((l) => l.duration),
        selection,
      })
    );
  }, [plan, isDemo, planStops, planLegOptions, selection]);

  const bewaarPreset = (preset) => {
    const next = [...presets.filter((p) => p.naam !== preset.naam), preset];
    setPresets(next);
    localStorage.setItem(LS.presets, JSON.stringify(next));
  };

  const verwijderPreset = (naam) => {
    const next = presets.filter((p) => p.naam !== naam);
    setPresets(next);
    localStorage.setItem(LS.presets, JSON.stringify(next));
  };

  const wijzigThresholds = (t) => {
    setThresholds(t);
    localStorage.setItem(LS.thresholds, JSON.stringify(t));
  };

  const wijzigMeldingen = (m) => {
    setMeldingen(m);
    localStorage.setItem(LS.meldingen, JSON.stringify(m));
  };

  const bereken = async () => {
    setFout(null);
    const gekozen = stops.filter(Boolean);
    if (gekozen.length < stops.length || gekozen.length < 2) {
      setFout("Vul alle stops in (minimaal twee).");
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
        thresholds,
      });
      setIsDemo(false);
      setPlanStops(gekozen);
      setPlanLegOptions(legOptions);
      setLegsRaw(raw);
      setSelection(zeros);
      setActieveLeg(plan0.dag?.worstIdx ?? 0);
    } catch (e) {
      setLegsRaw(null);
      setFout(e.message ?? String(e));
    } finally {
      setBezig(false);
    }
  };

  const draaiDemo = async () => {
    setFout(null);
    setBezig(true);
    try {
      const nu = new Date();
      const opties = demoLegOptions(nu);
      const raw = await haalRuweEtappes({ stops: DEMO_STOPS, fetchImpl: demoFetch(nu) });
      const zeros = raw.map(() => 0);
      const plan0 = stelPlanSamen({ legsRaw: raw, legOptions: opties, selection: zeros, thresholds });
      setIsDemo(true);
      setPlanStops(DEMO_STOPS);
      setPlanLegOptions(opties);
      setLegsRaw(raw);
      setSelection(zeros);
      setActieveLeg(plan0.dag?.worstIdx ?? 0);
    } catch (e) {
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

  const meldingenActief = meldingen.ochtend || meldingen.vertrek;

  return (
    <div className="container">
      <header className="kop">
        <div className="merk">
          <span className="merk-mark" aria-hidden="true" />
          <h1>kopwind</h1>
        </div>
        <span className="tagline">fiets of scooter? je keten, je wind, je keuze.</span>
        <span className="spacer" />
        <button className="knop" onClick={draaiDemo} disabled={bezig}>
          Demo
        </button>
        <button className="knop" onClick={() => setMeldingenOpen(true)}>
          Meldingen{meldingenActief ? " ●" : ""}
        </button>
        <button className="knop" onClick={() => setInstellingenOpen(true)}>
          Instellingen
        </button>
      </header>

      <div className="werkblad">
        <div className="blok-planner">
          <section className="paneel">
            <h2 className="paneel-titel">Jouw dag</h2>
            <StopsEditor
              stops={stops}
              setStops={setStops}
              legOptions={legOptions}
              setLegOptions={setLegOptions}
              presets={presets}
              onSavePreset={bewaarPreset}
            />
            <div style={{ marginTop: 14 }}>
              <button className="knop primair" onClick={bereken} disabled={bezig}>
                {bezig ? "Bezig..." : "Bereken fiets of scooter"}
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
              presets={presets}
            />
          </div>
        </div>

        <div className="blok-results">
          {plan ? (
            <>
              <DagBanner dag={plan.dag} />
              {isDemo && (
                <p className="uitleg demo-noot">
                  Demoketen door Rotterdam met kunstmatige zuidwestenwind. Etappe 1
                  heeft twee routes; klik op de chips of op de gestippelde lijn op de
                  kaart om te wisselen en het windverschil te zien.
                </p>
              )}
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
            </>
          ) : (
            !fout && (
              <p className="leeg">
                Stel je keten samen (bv. Thuis → Sportschool → Thuis → Werk), of klik
                op Demo om te zien wat de app doet.
              </p>
            )
          )}
        </div>
      </div>

      <SettingsPanel
        open={instellingenOpen}
        onClose={() => setInstellingenOpen(false)}
        thresholds={thresholds}
        setThresholds={wijzigThresholds}
        presets={presets}
        onDeletePreset={verwijderPreset}
      />
      <MeldingenPanel
        open={meldingenOpen}
        onClose={() => setMeldingenOpen(false)}
        meldingen={meldingen}
        setMeldingen={wijzigMeldingen}
      />
      <NotificationManager meldingen={meldingen} thresholds={thresholds} />
    </div>
  );
}
