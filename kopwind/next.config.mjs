/** @type {import('next').NextConfig} */
const isEn = process.env.NEXT_PUBLIC_SITE_LOCALE === "en";

// De Engelse site leeft op kanhetvandaag.nl/en/: de EN-build draait met
// basePath /en (eigen Vercel-project), en het Nederlandse project stuurt
// alles onder /en door naar dat project via EN_ZONE_URL (multi-zone).
const nextConfig = {
  reactStrictMode: true,
  basePath: isEn ? "/en" : undefined,
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
