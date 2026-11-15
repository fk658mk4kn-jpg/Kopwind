"use client";

import { useState } from "react";
import { STEDEN } from "@/lib/steden/nl";

/**
 * Lichte plekkiezer voor de live tellers: een stad uit de lijst of de
 * eigen locatie van het toestel. Bewust zonder adresopslag; de keuze
 * leeft alleen in deze pagina.
 */
export const DE_BILT = { naam: "De Bilt", lat: 52.1, lon: 5.18 };

export default function PlekKiezer({ plek, onKies }) {
  const [melding, setMelding] = useState(null);

  function eigenLocatie() {
    if (!navigator.geolocation) {
      setMelding("Je browser deelt geen locatie. Kies een stad.");
      return;
    }
    setMelding("Locatie ophalen...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMelding(null);
        onKies({
          naam: "jouw plek",
          lat: Math.round(pos.coords.latitude * 100) / 100,
          lon: Math.round(pos.coords.longitude * 100) / 100,
        });
      },
      () => setMelding("Locatie niet beschikbaar. Kies een stad."),
      { timeout: 8000, maximumAge: 600000 }
    );
  }

  return (
    <div className="aftel-plek">
      <label>
        <span>Plek</span>
        <select
          value={STEDEN.some((s) => s.naam === plek.naam) ? plek.naam : plek.naam === DE_BILT.naam ? DE_BILT.naam : ""}
          onChange={(e) => {
            const s = e.target.value === DE_BILT.naam ? DE_BILT : STEDEN.find((x) => x.naam === e.target.value);
            if (s) onKies({ naam: s.naam, lat: s.lat, lon: s.lon });
          }}
        >
          {plek.naam === "jouw plek" && <option value="">Jouw plek</option>}
          <option value={DE_BILT.naam}>{DE_BILT.naam}</option>
          {STEDEN.map((s) => (
            <option key={s.slug} value={s.naam}>
              {s.naam}
            </option>
          ))}
        </select>
      </label>
      <button type="button" className="knop klein" onClick={eigenLocatie}>
        Gebruik mijn locatie
      </button>
      {melding && <p className="aftel-plek-melding">{melding}</p>}
    </div>
  );
}
