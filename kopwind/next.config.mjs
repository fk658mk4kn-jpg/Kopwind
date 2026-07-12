/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Kortere of oudere paden naar de canonieke toolslugs.
      { source: "/fiets-naar-werk", destination: "/fietsen-naar-werk", permanent: true },
      { source: "/fiets-naar-werk/:pad*", destination: "/fietsen-naar-werk/:pad*", permanent: true },
    ];
  },
};

export default nextConfig;
