"use client";

import { useEffect } from "react";

/**
 * Opent het details-element waar de URL-hash naar wijst (v3.24.0).
 * Aanleiding: anker-links (alle-keuzehulpen en in-tekst links wijzen
 * naar hub-FAQ-items als /regen#regenkans-betekenis) sprongen wel naar
 * het element, maar het inklapbare antwoord bleef dicht. Nu klapt het
 * doel open bij binnenkomst en bij elke hash-wissel, en scrollt het
 * daarna opnieuw in beeld (het uitklappen verandert de hoogte,
 * waardoor de browser-scroll van de hash te kort schiet).
 * Rendert niets; staat in de layout zodat elke pagina met ankerbare
 * details meedoet, ook toekomstige.
 */
export default function AnkerOpener() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      if (el.tagName === "DETAILS") el.open = true;
      requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
