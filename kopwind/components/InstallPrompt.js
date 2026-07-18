"use client";

import { useEffect, useState } from "react";
import { S } from "@/lib/strings";
import { isIos } from "@/lib/push-client";
import { useGebruiker } from "./GebruikerContext";

/**
 * Cross-platform "op beginscherm zetten" (par. 7). Het
 * beforeinstallprompt-event leeft in de GebruikerContext; deze zwevende
 * kaart verschijnt pas na een zinnige interactie (eerste geslaagde check)
 * zodat het geen spam is. iOS en iPadOS kennen het event niet: daar tonen
 * we de deelknop-instructie. Al geinstalleerd (standalone) verbergt alles.
 * Dezelfde knop en uitleg staan permanent in het meldingenpaneel, zodat
 * wie de kaart wegklikt hem terug kan vinden.
 */
export default function InstallPrompt({ interactieGedaan }) {
  const g = useGebruiker();
  const [zichtbaar, setZichtbaar] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (g.geinstalleerd) return;
    if (localStorage.getItem("kopwind.installAfgewezen")) return;
    // Mobiel (v3.24.0, feedback): toon de kaart direct, met een kleine
    // vertraging zodat hij niet met de pagina meeknalt. Op desktop
    // blijft de oude drempel (pas na een geslaagde check), want daar
    // is beginscherm-installatie een nichewens en oogt een directe
    // pop-up als spam.
    const mobiel = window.matchMedia("(max-width: 960px)").matches;
    if (!mobiel && !interactieGedaan) return;
    setIos(isIos());
    if (!(g.installBeschikbaar || isIos())) return;
    const timer = setTimeout(() => setZichtbaar(true), mobiel && !interactieGedaan ? 2500 : 0);
    return () => clearTimeout(timer);
  }, [interactieGedaan, g.installBeschikbaar, g.geinstalleerd]);

  if (!zichtbaar || g.geinstalleerd) return null;

  const installeer = async () => {
    await g.zetOpBeginscherm();
    setZichtbaar(false);
  };

  const later = () => {
    localStorage.setItem("kopwind.installAfgewezen", "1");
    setZichtbaar(false);
  };

  return (
    <div className="installkaart" role="dialog" aria-label={S.install.titel}>
      <strong>{S.install.titel}</strong>
      <p>{ios && !g.installBeschikbaar ? S.install.iosStap : S.install.uitleg}</p>
      <div className="installknoppen">
        {g.installBeschikbaar && (
          <button className="knop primair" onClick={installeer}>
            {S.install.knop}
          </button>
        )}
        <button className="knop" onClick={later}>
          {S.install.later}
        </button>
      </div>
    </div>
  );
}
