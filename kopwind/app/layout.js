import "@fontsource-variable/archivo";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import GebruikerProvider from "@/components/GebruikerContext";
import SiteHeader from "@/components/SiteHeader";
import { HUB_NAAM, HUB_KORT, HUB_CLAIM } from "@/lib/brand";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: `${HUB_NAAM} Dagelijkse weerbeslissingen in een cijfer`,
    template: `%s | ${HUB_NAAM}`,
  },
  description: HUB_CLAIM,
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: HUB_NAAM,
    title: `${HUB_NAAM} Dagelijkse weerbeslissingen in een cijfer`,
    description: HUB_CLAIM,
  },
  twitter: {
    card: "summary",
    title: HUB_NAAM,
    description: HUB_CLAIM,
  },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    title: HUB_KORT,
    statusBarStyle: "default",
  },
};

export const viewport = {
  themeColor: "#234E9D",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>
        <GebruikerProvider>
          <div className="container">
            <SiteHeader />
            {children}
          </div>
        </GebruikerProvider>
      </body>
    </html>
  );
}
