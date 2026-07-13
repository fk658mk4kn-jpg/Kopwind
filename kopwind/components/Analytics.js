"use client";

import Script from "next/script";

/**
 * components/Analytics.js
 *
 * Laadt Google Analytics 4 op de manier die Next.js aanraadt: via
 * next/script met strategy afterInteractive, zodat de meettag de eerste
 * render niet vertraagt. Het meet-ID komt uit NEXT_PUBLIC_GA_ID, met het
 * property-ID van kanhetvandaag.nl als fallback zodat de tag ook zonder
 * Vercel-env gewoon meet (Google's tagcontrole vereist dat de tag in de
 * HTML staat).
 *
 * Belangrijk: send_page_view staat hier UIT. De eerste paginaweergave en
 * elke client-side navigatie tellen we zelf in AnalyticsPageViews, anders
 * mist GA4 de routewissels van de App Router (die geen volledige
 * paginalading zijn) of telt hij de eerste view dubbel.
 */
export default function Analytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID ?? "G-DRGGM053ZK";

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
