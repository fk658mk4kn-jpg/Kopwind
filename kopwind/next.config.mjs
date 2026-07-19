/** @type {import('next').NextConfig} */
const isEn = process.env.NEXT_PUBLIC_SITE_LOCALE === "en";

// De Engelse site leeft op kanhetvandaag.nl/en/: de EN-build draait met
// basePath /en (eigen Vercel-project), en het Nederlandse project stuurt
// alles onder /en door naar dat project via EN_ZONE_URL (multi-zone).
const nextConfig = {
  reactStrictMode: true,
  basePath: isEn ? "/en" : undefined,
  async headers() {
    // Content Security Policy: eigen origin plus de enige externe bronnen
    // die de site echt gebruikt (OpenStreetMap-tegels voor de kaart en,
    // alleen na cookietoestemming, Google Analytics). 'unsafe-inline' is
    // nodig voor de inline-scripts van Next en de GA-init; externe scripts
    // van onbekende domeinen worden wel geblokkeerd.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "connect-src 'self' https://*.google-analytics.com https://www.googletagmanager.com",
      "img-src 'self' data: https://tile.openstreetmap.org https://*.google-analytics.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "worker-src 'self'",
      "manifest-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(self), camera=(), microphone=(), payment=(), usb=(), browsing-topics=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Kortere of oudere paden naar de canonieke toolslugs.
      { source: "/fiets-naar-werk", destination: "/fietsen-naar-werk", permanent: true },
      { source: "/fiets-naar-werk/:pad*", destination: "/fietsen-naar-werk/:pad*", permanent: true },
    ];
  },
  async rewrites() {
    if (isEn) {
      // Engelse paden naar de fysieke (Nederlandse) mappen, binnen /en.
      return [
        { source: "/explainers", destination: "/uitleg" },
        { source: "/explainers/:slug", destination: "/uitleg/:slug" },
        { source: "/about", destination: "/over" },
        { source: "/sources", destination: "/bronnen" },
        { source: "/terms", destination: "/voorwaarden" },
        { source: "/all-checks", destination: "/alle-checks" },
      ];
    }
    // NL-project: /en doorsturen naar de Engelse zone als die er is.
    const zone = process.env.EN_ZONE_URL;
    if (!zone) return [];
    return [
      { source: "/en", destination: `${zone}/en` },
      { source: "/en/:pad*", destination: `${zone}/en/:pad*` },
    ];
  },
};

export default nextConfig;
