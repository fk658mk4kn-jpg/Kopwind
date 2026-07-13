"use client";

import { fietsNavUrls } from "@/lib/engine/navigatie";
import { S } from "@/lib/strings";

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
        {S.nav.openGoogle}
      </a>
      <a className="knop klein" href={urls.apple} target="_blank" rel="noopener noreferrer">
        {S.nav.openApple}
      </a>
      {urls.tussenstopsWeggevallen && (
        <span className="uitleg" style={{ margin: 0 }}>
          {S.nav.appleGeenStops}
        </span>
      )}
    </div>
  );
}
