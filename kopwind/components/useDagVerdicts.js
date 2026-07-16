"use client";

import { useEffect, useState } from "react";
import { useGebruiker } from "@/components/GebruikerContext";
import { haalWeer } from "@/lib/engine/weather";
import { BASIS_VELDEN } from "@/lib/engine/weerbasis";
import { TOOLS } from "@/lib/tools";

/**
 * Dagverdicten voor alle overlay-tools op een gedeelde plek (v3.10.0).
 * Een Open-Meteo-call met de vereniging van alle weerVelden, daarna per
 * tool het overlay-contract; zo krijgen ook pollen-checks hun velden.
 * De plek is dezelfde als op de homepage (kopwind.hubLocatie), met De
 * Bilt als landelijk beginpunt, zodat home en alle-checks een status
 * tonen. Route- en nowcast-checks hebben geen overlay en dus geen stip.
 */
export const NEDERLAND = { naam: "Nederland", lat: 52.11, lon: 5.181 };

export function useDagVerdicts() {
  const g = useGebruiker();
  const [stad, setStad] = useState(null);
  const [dagen, setDagen] = useState(null);
  const [laden, setLaden] = useState(false);

  useEffect(() => {
    try {
      const l = JSON.parse(localStorage.getItem("kopwind.hubLocatie") ?? "null");
      setStad(l?.lat ? l : NEDERLAND);
    } catch {
      setStad(NEDERLAND);
    }
  }, []);

  useEffect(() => {
    if (!stad) return;
    let actief = true;
    setLaden(true);
    const velden = [...new Set(TOOLS.flatMap((t) => t.weerVelden ?? BASIS_VELDEN))];
    haalWeer(stad.lat, stad.lon, velden, 2)
      .then((hourly) => {
        if (!actief) return;
        const nu = new Date();
        const uit = {};
        for (const t of TOOLS) {
          if (typeof t.overlay !== "function") continue;
          try {
            uit[t.id] = t.overlay(hourly, nu, g.thresholdsVoor(t.id)).dagen?.[0] ?? null;
          } catch {
            uit[t.id] = null;
          }
        }
        setDagen(uit);
      })
      .catch(() => actief && setDagen(null))
      .finally(() => actief && setLaden(false));
    return () => {
      actief = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stad]);

  const kiesStad = (plek) => {
    const kaal = { naam: plek.naam.split(",")[0], lat: plek.lat, lon: plek.lon };
    setStad(kaal);
    localStorage.setItem("kopwind.hubLocatie", JSON.stringify(kaal));
    g.meldInteractie();
  };

  return { stad, kiesStad, dagen, laden };
}
