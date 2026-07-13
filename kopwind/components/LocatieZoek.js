"use client";

import { kies } from "@/lib/i18n/locale";

import { useEffect, useRef, useState } from "react";
import { zoekAdres, huidigeLocatie } from "@/lib/engine/locatie";
import Icoon from "./Icoon";

/**
 * Het gedeelde zoekveld: adres-autocomplete (300 ms debounce) plus knop
 * voor de huidige locatie. Elke tool die om een plek vraagt gebruikt dit;
 * het opgeloste kernpijnpunt blijft zo overal even goed.
 */
export default function LocatieZoek({ onKies, placeholder = kies({ nl: "Zoek een adres...", en: "Search an address..." }) }) {
  const [tekst, setTekst] = useState("");
  const [suggesties, setSuggesties] = useState([]);
  const [bezig, setBezig] = useState(false);
  const timer = useRef(null);
  const laatste = useRef("");

  useEffect(() => () => clearTimeout(timer.current), []);

  const zoek = (q) => {
    setTekst(q);
    clearTimeout(timer.current);
    if (q.trim().length < 3) {
      setSuggesties([]);
      return;
    }
    timer.current = setTimeout(async () => {
      laatste.current = q;
      try {
        const res = await zoekAdres(q);
        if (laatste.current === q) setSuggesties(res);
      } catch {
        setSuggesties([]);
      }
    }, 300);
  };

  const gebruikHuidige = async () => {
    setBezig(true);
    try {
      onKies(await huidigeLocatie());
    } catch (e) {
      window.alert(e.message);
    } finally {
      setBezig(false);
    }
  };

  return (
    <div className="zoekwrap">
      <input
        type="text"
        placeholder={placeholder}
        value={tekst}
        onChange={(e) => zoek(e.target.value)}
        aria-label={kies({ nl: "Adres zoeken", en: "Search address" })}
      />
      <button
        className="iconknop"
        title={kies({ nl: "Huidige locatie gebruiken", en: "Use current location" })}
        onClick={gebruikHuidige}
        disabled={bezig}
        type="button"
      >
        {bezig ? "\u2026" : <Icoon naam="locatie" vol maat={17} />}
      </button>
      {suggesties.length > 0 && (
        <div className="suggesties">
          {suggesties.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setSuggesties([]);
                setTekst("");
                onKies(s);
              }}
            >
              {s.naam}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
