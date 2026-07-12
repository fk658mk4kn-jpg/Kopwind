"use client";

import { fietsNavUrls } from "@/lib/engine/navigatie";

/**
 * "Open in je navigatie-app" (Zephyr item 4): na een check open je de
 * route met een tik in Google Maps of Apple Maps, in fietsmodus. Welke
 * knoppen verschijnen volgt uit de vervoersmodus van de tool.
 */
export default function NavKnoppen({ stops }) {
  const urls = fietsNavUrls(stops);
  if (!urls) return null;
  return (
    <div className="navknoppen">
      <a className="knop klein" href={urls.google} target="_blank" rel="noopener noreferrer">
        Open in Google Maps
      </a>
      <a className="knop klein" href={urls.apple} target="_blank" rel="noopener noreferrer">
        Open in Apple Maps
      </a>
      {urls.tussenstopsWeggevallen && (
        <span className="uitleg" style={{ margin: 0 }}>
          Apple Maps kan geen tussenstops aan; daar gaat de route van start naar eind.
        </span>
      )}
    </div>
  );
}
