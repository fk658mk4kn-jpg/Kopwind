"use client";

import { useEffect, useState } from "react";
import { dagKeyVan } from "@/lib/engine/weerbasis";
import { S } from "@/lib/strings";
import Icoon from "./Icoon";

/**
 * Klopte het advies vandaag? (v3.7.0 "Etesian", teller all-time sinds
 * v3.7.4). Twee duimen in de huisstijl (eigen SVG, geen emoji). Alleen
 * positieve stemmen worden geteld en getoond, naast de duim omhoog, en dat
 * is het totaal ooit (niet per dag); een negatieve stem levert enkel een
 * bedankje op, geen zichtbaar aantal. Zonder database blijven de knoppen
 * werken (de stem staat lokaal); alleen de teller ontbreekt.
 */
export default function StemPeiling({ toolId }) {
  const dag = dagKeyVan(new Date());
  const [keuze, setKeuze] = useState(null);
  const [positief, setPositief] = useState(null);

  useEffect(() => {
    try {
      const k = localStorage.getItem(`kopwind.stem.${toolId}.${dag}`);
      if (k) setKeuze(Number(k));
    } catch {
      // localStorage kan dicht zitten; dan gewoon zonder geheugen.
    }
    let actief = true;
    fetch(`/api/stem?tool=${encodeURIComponent(toolId)}&dag=${dag}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((t) => actief && setPositief(t.totaal ?? 0))
      .catch(() => {
        // Geen database of hikkende fetch: knoppen blijven werken.
      });
    return () => {
      actief = false;
    };
  }, [toolId, dag]);

  const stem = async (waarde) => {
    if (keuze !== null) return;
    setKeuze(waarde);
    if (waarde === 1 && positief !== null) setPositief(positief + 1);
    try {
      localStorage.setItem(`kopwind.stem.${toolId}.${dag}`, String(waarde));
      let apparaat = localStorage.getItem("kopwind.stemId");
      if (!apparaat) {
        apparaat =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `a${Date.now()}${Math.random().toString(36).slice(2, 12)}`;
        localStorage.setItem("kopwind.stemId", apparaat);
      }
      const res = await fetch("/api/stem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: toolId, dag, stem: waarde, apparaat }),
      });
      if (res.ok) {
        const t = await res.json();
        setPositief(t.totaal ?? 0);
      }
    } catch {
      // Stil laten: de keuze blijft lokaal staan.
    }
  };

  const bedankt = keuze !== null;

  return (
    <div className="stempeiling" aria-label={S.stem.vraag}>
      <span className="stem-vraag">{bedankt ? S.stem.bedankt : S.stem.vraag}</span>
      <div className="stem-knoppen">
        <button
          className={"stemknop op" + (keuze === 1 ? " actief" : "")}
          onClick={() => stem(1)}
          disabled={bedankt}
          aria-label={S.stem.jaLabel}
          aria-pressed={keuze === 1}
        >
          <Icoon naam="duim_op" maat={17} />
          {positief !== null && positief > 0 && <span className="stem-aantal">{positief}</span>}
        </button>
        <button
          className={"stemknop neer" + (keuze === -1 ? " actief" : "")}
          onClick={() => stem(-1)}
          disabled={bedankt}
          aria-label={S.stem.neeLabel}
          aria-pressed={keuze === -1}
        >
          <Icoon naam="duim_neer" maat={17} />
        </button>
      </div>
    </div>
  );
}
