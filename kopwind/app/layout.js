import "./globals.css";
import "leaflet/dist/leaflet.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Vandaag op de fiets naar werk? Fietsweer, wind en reistijd check",
    template: "%s | Vandaag op de fiets?",
  },
  description:
    "Kan ik vandaag fietsen naar werk? Check je woon-werkrit: reistijd, fietsweer, wind tegen per deel van de route, regen en temperatuur. Gratis, direct advies.",
  keywords: [
    "fietsen naar werk",
    "woon-werkverkeer fiets",
    "fietsweer",
    "fietsweer vandaag",
    "kan ik fietsen vandaag",
    "beste moment om naar werk te fietsen",
    "wind tegen fietsen",
    "fietsroute werk",
    "fietscheck",
    "tegenwind fiets",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "/",
    siteName: "Vandaag op de fiets?",
    title: "Vandaag op de fiets naar werk? Fietsweer, wind en reistijd check",
    description:
      "Gratis fietscheck voor je woon-werkrit: reistijd, wind tegen per deel van de route, regen en temperatuur, met een rapportcijfer per rit.",
  },
  twitter: {
    card: "summary",
    title: "Vandaag op de fiets naar werk?",
    description:
      "Check je woon-werkrit: fietsweer, wind tegen per deel van de route, regen en temperatuur.",
  },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    title: "Fietscheck",
    statusBarStyle: "default",
  },
};

export const viewport = {
  themeColor: "#0e7490",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
