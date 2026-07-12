import { HUB_NAAM, HUB_KORT, HUB_CLAIM } from "@/lib/brand";
import { TOOLS } from "@/lib/tools";

export default function manifest() {
  return {
    name: HUB_NAAM,
    short_name: HUB_KORT,
    description: HUB_CLAIM,
    start_url: "/",
    display: "standalone",
    background_color: "#E9EEF3",
    theme_color: "#234E9D",
    lang: "nl",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: TOOLS.map((t) => ({
      name: t.naam,
      short_name: t.meldingKort,
      url: `/${t.slug}`,
      icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    })),
  };
}
