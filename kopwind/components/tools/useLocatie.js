"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Gedeelde plek-logica (v3.6.0 "Bora"): laadt de laatst gebruikte
 * locatie uit localStorage, auto-runt de check bij een bekende plek en
 * bewaart een nieuwe keuze. Losgetrokken uit LocatieTool zodat de
 * timing- en paraplu-check dezelfde flow hergebruiken zonder duplicatie.
 *
 * @param {string} toolId
 * @param {(plek: {lat:number, lon:number, naam:string}) => Promise<void>} doeCheck
 * @param {{lat:number, lon:number, naam:string}|null} begin Vooraf
 *   ingestelde plek (stadpagina's): wint van de onthouden locatie en
 *   start direct een check, zelfde gedrag als LocatieTool.
 */
export function useLocatie(toolId, doeCheck, begin = null) {
  const [locatie, setLocatie] = useState(begin);
  const lsSleutel = `kopwind.locatie.${toolId}`;
  const autoRan = useRef(false);

  useEffect(() => {
    if (begin?.lat) {
      if (!autoRan.current) {
        autoRan.current = true;
        doeCheck(begin);
      }
      return;
    }
    try {
      const l =
        JSON.parse(localStorage.getItem(lsSleutel) ?? "null") ??
        JSON.parse(localStorage.getItem("kopwind.wasLocatie") ?? "null");
      if (l?.lat) {
        setLocatie(l);
        if (!autoRan.current) {
          autoRan.current = true;
          doeCheck(l);
        }
      }
    } catch {
      // Kapotte localStorage negeren.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const kiesLocatie = (plek) => {
    setLocatie(plek);
    try {
      localStorage.setItem(lsSleutel, JSON.stringify(plek));
    } catch {
      // negeren
    }
    doeCheck(plek);
  };

  return { locatie, kiesLocatie };
}
