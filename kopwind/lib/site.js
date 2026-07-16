/**
 * lib/site.js
 *
 * Centrale site-URL. Alles wat een absolute URL nodig heeft (metadataBase,
 * canonical, og:url, robots, sitemap, OG-images) leest hieruit, zodat er
 * nooit meer een localhost of http:// naar productie lekt.
 *
 * - Fallback is het live domein, niet localhost: ook zonder env-var wijzen
 *   canonicals dan goed.
 * - https wordt geforceerd (behalve op localhost, voor lokaal testen).
 * - Het canonieke domein is MET www (daar draait de site); zet in Vercel
 *   alsnog NEXT_PUBLIC_SITE_URL=https://www.kanhetvandaag.nl, dan is de
 *   bron expliciet, en redirect kanhetvandaag.nl met een 301 naar www.
 */

import { kies } from "./i18n/locale.js";

export const LIVE_DOMEIN = kies({
  nl: "https://www.kanhetvandaag.nl",
  en: "https://www.kanhetvandaag.nl/en",
});

export function siteUrl(raw = process.env.NEXT_PUBLIC_SITE_URL) {
  let u = (raw ?? "").trim();
  if (!u) u = LIVE_DOMEIN;
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  const isLokaal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(u);
  if (!isLokaal) u = u.replace(/^http:\/\//i, "https://");
  return u.replace(/\/+$/, "");
}

export const SITE_URL = siteUrl();
