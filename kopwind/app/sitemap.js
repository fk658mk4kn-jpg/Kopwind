import { TOOLS } from "@/lib/tools";
import { STEDEN } from "@/lib/steden/nl";
import { buurSteden } from "@/lib/steden/teksten";

import { SITE_URL as SITE } from "@/lib/site";
import { UITLEG } from "@/content/uitleg";
import { PAD } from "@/lib/i18n/paden";
import { IS_EN } from "@/lib/i18n/locale";

/** Sitemap automatisch uit register maal steden plus route-paren (§9). */
export default function sitemap() {
  const nu = new Date();
  const urls = [
    { url: `${SITE}/`, lastModified: nu, changeFrequency: "daily", priority: 1 },
  ];

  for (const t of TOOLS) {
    urls.push({
      url: `${SITE}/${t.slug}`,
      lastModified: nu,
      changeFrequency: "daily",
      priority: 0.9,
    });
    for (const s of STEDEN) {
      urls.push({
        url: `${SITE}/${t.slug}/${s.slug}`,
        lastModified: nu,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  for (const s of IS_EN ? [] : STEDEN) {
    for (const b of buurSteden(s, 2)) {
      urls.push({
        url: `${SITE}/van/${s.slug}/naar/${b.slug}`,
        lastModified: nu,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  urls.push({ url: `${SITE}${PAD.uitleg}`, lastModified: nu, changeFrequency: "monthly", priority: 0.5 });
  for (const a of UITLEG) {
    urls.push({
      url: `${SITE}${PAD.uitleg}/${a.slug}`,
      lastModified: nu,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }
  for (const p of [PAD.over, PAD.bronnen, PAD.changelog, PAD.privacy, PAD.voorwaarden]) {
    urls.push({ url: `${SITE}${p}`, lastModified: nu, changeFrequency: "monthly", priority: 0.3 });
  }

  return urls;
}
