"use client";

import { useEffect } from "react";

/**
 * Registreert een toolbezoek in localStorage (kopwind.recenteTools,
 * meest recent eerst, maximaal vijf ids). De homepage toont hieruit de
 * drie meest recent gebruikte checks (feedbackronde juli 2026). Rendert
 * niets; puur een effect naast de tool.
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
