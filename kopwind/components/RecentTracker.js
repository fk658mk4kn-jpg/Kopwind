"use client";

import { useEffect } from "react";

/**
 * Registreert een toolbezoek in localStorage (kopwind.recenteTools,
 * meest recent eerst, maximaal vijf ids). De homepage toont hieruit de
 * drie meest recent gebruikte checks (feedbackronde juli 2026). Rendert
 * niets; puur een effect naast de tool.
 *
 * Belangrijk: geef de CANONIEKE tool-id door (templateId van een
 * variant, anders de eigen id). Een variantpagina (jas, korte-broek,
 * t-shirt) draagt een eigen id die niet in TOOLS staat; zou die ruw
 * worden opgeslagen, dan vindt HubGrid hem niet terug en valt het
 * bezoek uit het recent-blok. Door hier al te resolveren telt elk
 * variantbezoek mee als bezoek aan de oudertool, automatisch en
 * zonder aanpassing per nieuwe variant. De toolpagina geeft daarom
 * `tool.templateId ?? tool.id` mee.
 */
export default function RecentTracker({ toolId }) {
  useEffect(() => {
    if (!toolId) return;
    try {
      const oud = JSON.parse(localStorage.getItem("kopwind.recenteTools") ?? "[]");
      const nieuw = [toolId, ...oud.filter((id) => id !== toolId)].slice(0, 5);
      localStorage.setItem("kopwind.recenteTools", JSON.stringify(nieuw));
    } catch {
      // localStorage kan geblokkeerd zijn; recent-blok blijft dan leeg.
    }
  }, [toolId]);
  return null;
}
