import { APP_NAAM, APP_KORT } from "@/lib/brand";

export default function manifest() {
  return {
    name: APP_NAAM,
    short_name: APP_KORT,
    description:
      "Check of fietsen naar werk vandaag een goed idee is: reistijd, wind, regen en temperatuur voor jouw woon-werkrit.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f3ee",
    theme_color: "#0e7490",
    lang: "nl",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
