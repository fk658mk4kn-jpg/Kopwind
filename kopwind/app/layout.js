import { Suspense } from "react";
import "@fontsource-variable/bricolage-grotesque";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import GebruikerProvider from "@/components/GebruikerContext";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Analytics from "@/components/Analytics";
import AnalyticsPageViews from "@/components/AnalyticsPageViews";
import { HUB_NAAM, HUB_KORT, HUB_CLAIM } from "@/lib/brand";

import { SITE_URL as SITE } from "@/lib/site";
import { LOCALE, kies } from "@/lib/i18n/locale";

// Search Console-verificatie: het token staat bij voorkeur in een env-var
// (NEXT_PUBLIC_GSC_VERIFICATION), met de aangeleverde waarde als fallback
// zodat verificatie ook werkt als de var nog niet gezet is. Next.js rendert
// dit als <meta name="google-site-verification" ...> in de head.
const GSC_VERIFICATIE =
  process.env.NEXT_PUBLIC_GSC_VERIFICATION ??
  "tEQzAKIovrtdIlkGo9YjpCFk_OVG2Qo4yPcAVIQ9IPc";

export const metadata = {
  metadataBase: new URL(SITE),
  ...(process.env.NEXT_PUBLIC_ALTERNATE_LOCALE_URL
    ? {
        alternates: {
          languages: {
            [LOCALE === "en" ? "nl" : "en"]: process.env.NEXT_PUBLIC_ALTERNATE_LOCALE_URL,
          },
        },
      }
    : {}),
  title: {
    default: `${HUB_NAAM} ${kies({ nl: "Fietsen, de was buiten of het terras op", en: "Bike, laundry, patio or barbecue" })}`,
    template: `%s | ${HUB_NAAM}`,
  },
  description: HUB_CLAIM,
  openGraph: {
    type: "website",
    locale: kies({ nl: "nl_NL", en: "en_GB" }),
    url: "/",
    siteName: HUB_NAAM,
    title: `${HUB_NAAM} ${kies({ nl: "Fietsen, de was buiten of het terras op", en: "Bike, laundry, patio or barbecue" })}`,
    description: HUB_CLAIM,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
  verification: { google: GSC_VERIFICATIE },
  appleWebApp: {
    capable: true,
    title: HUB_KORT,
    statusBarStyle: "default",
  },
};

export const viewport = {
  themeColor: "#1B2733",
};

export default function RootLayout({ children }) {
  return (
    <html lang={LOCALE}>
      <body>
        <Analytics />
        <Suspense fallback={null}>
          <AnalyticsPageViews />
        </Suspense>
        <GebruikerProvider>
          <div className="container">
            <SiteHeader />
            {children}
            <SiteFooter />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: HUB_NAAM,
                  url: SITE,
                }),
              }}
            />
          </div>
        </GebruikerProvider>
      </body>
    </html>
  );
}
