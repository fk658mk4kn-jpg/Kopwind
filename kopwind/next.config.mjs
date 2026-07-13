/** @type {import('next').NextConfig} */
const isEn = process.env.NEXT_PUBLIC_SITE_LOCALE === "en";

const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Kortere of oudere paden naar de canonieke toolslugs.
      { source: "/fiets-naar-werk", destination: "/fietsen-naar-werk", permanent: true },
      { source: "/fiets-naar-werk/:pad*", destination: "/fietsen-naar-werk/:pad*", permanent: true },
    ];
  },
  async rewrites() {
    if (!isEn) return [];
    // Engelse paden naar de fysieke (Nederlandse) mappen.
    return [
      { source: "/explainers", destination: "/uitleg" },
      { source: "/explainers/:slug", destination: "/uitleg/:slug" },
      { source: "/about", destination: "/over" },
      { source: "/sources", destination: "/bronnen" },
      { source: "/terms", destination: "/voorwaarden" },
    ];
  },
};

export default nextConfig;
