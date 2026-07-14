"use client";

import { useState } from "react";
import { S } from "@/lib/strings";
import Icoon from "./Icoon";

/**
 * Deelknop in de huisstijl (v3.7.0 "Etesian"): losgetrokken uit de
 * stempeiling zodat feedback en delen elk hun eigen, heldere plek
 * hebben. Web Share op mobiel, kopieer-naar-klembord als fallback op
 * desktop, met een korte bevestiging.
 */
export default function DeelKnop() {
  const [gedeeld, setGedeeld] = useState(false);

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
    <button className="deelknop" onClick={deel} aria-label={S.stem.delen}>
      <Icoon naam="deel" maat={16} />
      <span>{gedeeld ? S.stem.gekopieerd : S.stem.delen}</span>
    </button>
  );
}
