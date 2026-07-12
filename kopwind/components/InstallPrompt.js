"use client";

import { useEffect, useState } from "react";
import { S } from "@/lib/strings/nl";
import { draaitStandalone, isIos } from "@/lib/push-client";

/**
 * Cross-platform "op beginscherm zetten" (§7). Chrome, Edge en Android
 * geven een beforeinstallprompt-event; dat vangen we af en tonen we als
 * eigen knop, pas na een zinnige interactie (eerste check) zodat het geen
 * spam is. iOS en iPadOS kennen dat event niet: daar tonen we de
 * deelknop-instructie. Al geinstalleerd (standalone) verbergt alles.
 */
export default function InstallPrompt({ interactieGedaan }) {
  const [promptEvent, setPromptEvent] = useState(null);
  const [zichtbaar, setZichtbaar] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    if (draaitStandalone()) return;
    if (localStorage.getItem("kopwind.installAfgewezen")) return;
    setIos(isIos());
    const vang = (e) => {
      e.preventDefault();
      setPromptEvent(e);
    };
    window.addEventListener("beforeinstallprompt", vang);
    const klaar = () => setZichtbaar(false);
    window.addEventListener("appinstalled", klaar);
    return () => {
      window.removeEventListener("beforeinstallprompt", vang);
      window.removeEventListener("appinstalled", klaar);
    };
  }, []);

  useEffect(() => {
    if (!interactieGedaan) return;
    if (draaitStandalone()) return;
    if (localStorage.getItem("kopwind.installAfgewezen")) return;
    // Toon pas na een geslaagde check, en alleen als er iets te bieden is.
    if (promptEvent || isIos()) setZichtbaar(true);
  }, [interactieGedaan, promptEvent]);

  if (!zichtbaar) return null;

  const installeer = async () => {
    if (!promptEvent) return;
    promptEvent.prompt();
    await promptEvent.userChoice.catch(() => {});
    setZichtbaar(false);
  };

  const later = () => {
    localStorage.setItem("kopwind.installAfgewezen", "1");
    setZichtbaar(false);
  };

  return (
    <div className="installkaart" role="dialog" aria-label={S.install.titel}>
      <strong>{S.install.titel}</strong>
      <p>{ios && !promptEvent ? S.install.iosStap : S.install.uitleg}</p>
      <div className="installknoppen">
        {promptEvent && (
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
