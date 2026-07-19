"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

/**
 * components/Analytics.js
 *
 * Google Analytics 4, maar nu ACHTER cookietoestemming (v3.31.0). De
 * GA-tag zet analytische cookies en valt daarom onder de cookiewet: die
 * mag pas laden nadat de bezoeker in de cookiebalk op accepteren heeft
 * geklikt. Zolang er geen (of een afwijzende) keuze is, laadt hier niets
 * en worden er geen analytische cookies gezet.
 *
 * De keuze staat in localStorage onder "kh-consent". We lezen die bij het
 * mounten en luisteren naar het event "kh-consent-changed" dat de
 * cookiebalk stuurt, zodat GA meteen na akkoord laadt zonder herladen.
 *
 * send_page_view staat uit; AnalyticsPageViews telt de weergaven zelf,
 * ook bij client-side navigatie.
 */
export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID ?? "G-DRGGM053ZK";
  const [toegestaan, setToegestaan] = useState(false);

  useEffect(() => {
    const lees = () => {
      try {
        setToegestaan(localStorage.getItem("kh-consent") === "granted");
      } catch {
        setToegestaan(false);
      }
    };
    lees();
    window.addEventListener("kh-consent-changed", lees);
    return () => window.removeEventListener("kh-consent-changed", lees);
  }, []);

  if (!toegestaan) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
