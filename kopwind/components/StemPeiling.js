"use client";

import { useEffect, useState } from "react";
import { dagKeyVan } from "@/lib/engine/weerbasis";
import { S } from "@/lib/strings";

/**
 * Duimpjes onder het advies (het sociale aspect): klopte het vandaag?
 * Anoniem, een stem per apparaat per tool per dag. Totalen verschijnen
 * na je eigen stem, of zodra er drie of meer stemmen zijn (een teller
 * op "1" oogt leger dan geen teller). Zonder database of bij een
 * haperende fetch rendert dit stil niets.
 */
export default function StemPeiling({ toolId }) {
  const dag = dagKeyVan(new Date());
  const [keuze, setKeuze] = useState(null);
  const [totalen, setTotalen] = useState(null);
  const [weg, setWeg] = useState(false);

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
      .then((t) => actief && setTotalen(t))
      .catch(() => actief && setWeg(true));
    return () => {
      actief = false;
    };
  }, [toolId, dag]);

  if (weg) return null;

  const stem = async (waarde) => {
    if (keuze !== null) return;
    setKeuze(waarde);
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
      if (res.ok) setTotalen(await res.json());
    } catch {
      // Stil laten: de keuze blijft lokaal staan.
    }
  };

  const totaal = (totalen?.omhoog ?? 0) + (totalen?.omlaag ?? 0);
  const toonTotalen = totalen && (keuze !== null || totaal >= 3);

  return (
    <div className="stempeiling" aria-label={S.stem.vraag}>
      <span className="stem-vraag">
        {keuze === null ? S.stem.vraag : S.stem.bedankt}
      </span>
      <button
        className={"stemknop" + (keuze === 1 ? " actief" : "")}
        onClick={() => stem(1)}
        disabled={keuze !== null}
        aria-label={S.stem.jaLabel}
      >
        {"\u{1F44D}"}
      </button>
      <button
        className={"stemknop" + (keuze === -1 ? " actief" : "")}
        onClick={() => stem(-1)}
        disabled={keuze !== null}
        aria-label={S.stem.neeLabel}
      >
        {"\u{1F44E}"}
      </button>
      {toonTotalen && (
        <span className="stem-totalen">
          {"\u{1F44D}"} {totalen.omhoog} {"\u00b7"} {"\u{1F44E}"} {totalen.omlaag}
        </span>
      )}
    </div>
  );
}
