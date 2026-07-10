"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import StopsEditor from "@/components/StopsEditor";
import LegCard from "@/components/LegCard";
import DagBanner from "@/components/DagBanner";
import SettingsPanel from "@/components/SettingsPanel";
import MeldingenPanel from "@/components/MeldingenPanel";
import NotificationManager from "@/components/NotificationManager";
import { berekenPlan } from "@/lib/planner";
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
  const [plan, setPlan] = useState(null);
  const [actieveLeg, setActieveLeg] = useState(0);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState(null);
  const [instellingenOpen, setInstellingenOpen] = useState(false);
  const [meldingenOpen, setMeldingenOpen] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

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
    // Default vertrektijd voor de eerste etappe: eerstvolgend kwartier.
    setLegOptions([
      { mode: "vertrek", tijd: toLocalInput(afrondOpKwartier(new Date())) },
    ]);
  }, []);

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
    setIsDemo(false);
    try {
      const resultaat = await berekenPlan({ stops: gekozen, legOptions, thresholds });
      setPlan(resultaat);
      setActieveLeg(resultaat.dag?.worstIdx ?? 0);
      // Reistijden mee opslaan: daarmee kan de meldingenplanner de
      // vertrektijden van de keten offline uitrekenen.
      localStorage.setItem(
        LS.lastChain,
        JSON.stringify({
          stops: gekozen,
          legOptions,
          durations: resultaat.legs.map((l) => l.duration),
        })
      );
    } catch (e) {
      setPlan(null);
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
      const resultaat = await berekenPlan({
        stops: DEMO_STOPS,
        legOptions: demoLegOptions(nu),
        thresholds,
        fetchImpl: demoFetch(nu),
        nu,
      });
      setPlan(resultaat);
      setActieveLeg(resultaat.dag?.worstIdx ?? 0);
      setIsDemo(true);
    } catch (e) {
      setFout(e.message ?? String(e));
    } finally {
      setBezig(false);
    }
  };

  return (
    <div className="container">
      <header className="kop">
        <h1>kopwind</h1>
        <span className="tagline">fiets of scooter? je keten, je wind, je keuze.</span>
        <span className="spacer" />
        <button className="knop" onClick={draaiDemo} disabled={bezig}>
          Demo
        </button>
        <button className="knop" onClick={() => setMeldingenOpen(true)}>
          Meldingen{meldingen.ochtend || meldingen.vertrek ? " ●" : ""}
        </button>
        <button className="knop" onClick={() => setInstellingenOpen(true)}>
          Instellingen
        </button>
      </header>

      <section className="paneel">
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

      {plan && (
        <>
          <DagBanner dag={plan.dag} />
          {isDemo && (
            <p className="uitleg" style={{ marginTop: -8 }}>
              Dit is de demoketen door Rotterdam met kunstmatige zuidwestenwind, zodat
              je ziet hoe de app werkt. Klik op een etappe om hem op de kaart te zien.
            </p>
          )}
          <div className="resultaat">
            <div className="legs">
              {plan.legs.map((leg, i) => (
                <LegCard
                  key={i}
                  leg={leg}
                  index={i}
                  actief={i === actieveLeg}
                  onClick={() => setActieveLeg(i)}
                />
              ))}
            </div>
            <div className="kaartwrap">
              <MapView legs={plan.legs} actieveLeg={actieveLeg} />
            </div>
          </div>
        </>
      )}

      {!plan && !fout && (
        <p className="leeg">
          Stel je keten samen (bv. Thuis → Sportschool → Thuis → Werk), of klik op
          Demo om te zien wat de app doet.
        </p>
      )}

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
