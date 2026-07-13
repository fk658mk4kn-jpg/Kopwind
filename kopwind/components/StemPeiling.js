"use client";

import { useEffect, useState } from "react";
import { dagKeyVan } from "@/lib/engine/weerbasis";
import { S } from "@/lib/strings";
import Icoon from "./Icoon";

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
  const [gedeeld, setGedeeld] = useState(false);

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
      .catch(() => {
        // Geen database of hikkende fetch: knoppen blijven, alleen de
        // teller ontbreekt. De stem zelf blijft altijd lokaal bewaard.
      });
    return () => {
      actief = false;
    };
  }, [toolId, dag]);

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
  const toonTotalen = totalen && totaal > 0 && (keuze !== null || totaal >= 3);

  const deel = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const titel = typeof document !== "undefined" ? document.title : "";
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: titel, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setGedeeld(true);
      setTimeout(() => setGedeeld(false), 2500);
    } catch {
      // Delen afgebroken of clipboard dicht: stil laten.
    }
  };

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
        <span className="stem-totalen">{S.stem.teller(totalen.omhoog, totaal)}</span>
      )}
      <span className="spacer" />
      <button className="stemknop deelknop" onClick={deel} aria-label={S.stem.delen} title={S.stem.delen}>
        {gedeeld ? <span className="deel-ok">{S.stem.gekopieerd}</span> : <Icoon naam="deel" maat={16} />}
      </button>
    </div>
  );
}
