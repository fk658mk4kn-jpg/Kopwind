"use client";

import { useEffect, useState } from "react";
import { weekendStatus } from "@/lib/aftellen";

/**
 * Live klok onder het grote dagen-getal. Rendert eerst exact wat de
 * server gaf (geen hydration-verschil) en gaat na het mounten tikken.
 * Met `modus="weekend"` herberekent hij zelf het doel, zodat de klok
 * vanzelf van "tot het weekend" naar "tot maandag" springt.
 */
function delen(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    u: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

function Blok({ waarde, label }) {
  return (
    <div className="aftel-blok">
      <span className="aftel-blok-getal">{String(waarde).padStart(2, "0")}</span>
      <span className="aftel-blok-label">{label}</span>
    </div>
  );
}

export default function AftelTeller({ doel, modus, klaarTekst = "Het is zover." }) {
  const [nu, setNu] = useState(null);

  useEffect(() => {
    setNu(Date.now());
    const id = setInterval(() => setNu(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  let echtDoel = doel;
  let kop = null;
  if (modus === "weekend" && nu) {
    const w = weekendStatus(nu);
    echtDoel = w.doel;
    kop = w.bezig ? "Het is weekend. Nog tot maandag 00:00:" : "Nog tot vrijdag 17:00:";
  }

  if (!nu) {
    return <div className="aftel-klok aftel-klok-wacht" aria-hidden="true" />;
  }

  const rest = echtDoel - nu;
  if (rest <= 0) {
    return <p className="aftel-klaar">{klaarTekst}</p>;
  }
  const t = delen(rest);
  return (
    <div>
      {kop && <p className="aftel-klok-kop">{kop}</p>}
      <div className="aftel-klok" role="timer" aria-live="off">
        <Blok waarde={t.d} label={t.d === 1 ? "dag" : "dagen"} />
        <Blok waarde={t.u} label="uur" />
        <Blok waarde={t.m} label="min" />
        <Blok waarde={t.s} label="sec" />
      </div>
    </div>
  );
}
