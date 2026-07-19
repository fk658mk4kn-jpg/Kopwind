"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { kies } from "@/lib/i18n/locale";

/**
 * components/CookieConsent.js
 *
 * Minimale, zelf gebouwde cookiebalk (v3.31.0). De site zet zelf geen
 * trackingcookies; het enige wat toestemming vereist is Google Analytics.
 * Daarom deze balk: geen keuze gemaakt betekent geen analytische cookies
 * (GA laadt niet). Op accepteren zet hij localStorage "kh-consent" op
 * granted en stuurt een event zodat GA meteen laadt; op weigeren blijft
 * alles uit. De functionele opslag (voorkeuren, recent gebruikt, locatie)
 * staat los hiervan en is altijd toegestaan.
 *
 * Geen extern script, geen dienst van derden: past bij de privacy-first,
 * faceless opzet van de site.
 */
const T = kies({
  nl: {
    titel: "Cookies",
    tekst:
      "Deze site werkt zonder trackingcookies. Alleen als je hieronder akkoord gaat, zetten we anonieme statistiek (Google Analytics) aan om te zien welke checks gebruikt worden.",
    meer: "Lees meer",
    accepteer: "Accepteren",
    weiger: "Weigeren",
  },
  en: {
    titel: "Cookies",
    tekst:
      "This site works without tracking cookies. Only if you agree below do we switch on anonymous statistics (Google Analytics) to see which checks are used.",
    meer: "Read more",
    accepteer: "Accept",
    weiger: "Decline",
  },
});

export default function CookieConsent() {
  const [zichtbaar, setZichtbaar] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem("kh-consent")) setZichtbaar(true);
    } catch {
      // localStorage niet beschikbaar: balk niet tonen, GA blijft uit.
    }
  }, []);

  const zetKeuze = (waarde) => {
    try {
      localStorage.setItem("kh-consent", waarde);
      window.dispatchEvent(new Event("kh-consent-changed"));
    } catch {
      // negeren
    }
    setZichtbaar(false);
  };

  if (!zichtbaar) return null;

  return (
    <div className="cookiebalk" role="dialog" aria-label={T.titel}>
      <p className="cookiebalk-tekst">
        {T.tekst} <Link href="/privacy">{T.meer}</Link>
      </p>
      <div className="cookiebalk-knoppen">
        <button type="button" className="cookiebalk-weiger" onClick={() => zetKeuze("denied")}>
          {T.weiger}
        </button>
        <button type="button" className="cookiebalk-accepteer" onClick={() => zetKeuze("granted")}>
          {T.accepteer}
        </button>
      </div>
    </div>
  );
}
