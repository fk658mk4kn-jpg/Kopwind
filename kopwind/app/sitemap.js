import { TOOLS } from "@/lib/tools";
import { STEDEN } from "@/lib/steden/nl";
import { buurSteden } from "@/lib/steden/teksten";

import { SITE_URL as SITE } from "@/lib/site";
import { UITLEG } from "@/content/uitleg";
import { PAD } from "@/lib/i18n/paden";
import { VARIANTEN } from "@/lib/varianten";
import { CATEGORIEEN } from "@/lib/categorieen";
import { IS_EN } from "@/lib/i18n/locale";
import { AFTELLERS, AFTEL_HUB_PAD } from "@/lib/aftellen";
import { REKENHULPEN, ANTWOORDEN_HUB_PAD } from "@/lib/rekenhulpen";
import { stadIndexeerbaar, routeIndexeerbaar } from "@/lib/seo/indexering";

/** Sitemap automatisch uit register maal steden plus route-paren (§9). */
export default function sitemap() {
  const nu = new Date();
  const urls = [
    { url: `${SITE}/`, lastModified: nu, changeFrequency: "daily", priority: 1 },
  ];

  for (const t of TOOLS) {
    // v3.35.0: echte wijzigingsdatum in plaats van "nu". Een lastmod die
    // elke dag voor alle pagina's verandert, negeert Google; een eerlijke
    // datum helpt juist bij het herbezoeken van wat echt nieuw is.
    const gewijzigd = t.bijgewerkt ? new Date(t.bijgewerkt) : nu;
    urls.push({
      url: `${SITE}/${t.slug}`,
      lastModified: gewijzigd,
      changeFrequency: "daily",
      priority: 0.9,
    });
    for (const s of STEDEN) {
      // Met STAD_INDEX_BEPERKT aan alleen de indexeerbare stadpagina's.
      if (!stadIndexeerbaar(t.id, s.slug)) continue;
      urls.push({
        url: `${SITE}/${t.slug}/${s.slug}`,
        lastModified: gewijzigd,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  for (const c of CATEGORIEEN) {
    urls.push({ url: `${SITE}/${c.slug}`, lastModified: nu, changeFrequency: "weekly", priority: 0.8 });
  }

  for (const v of VARIANTEN) {
    urls.push({ url: `${SITE}/${v.slug}`, lastModified: nu, changeFrequency: "daily", priority: 0.7 });
  }

  for (const s of IS_EN || !routeIndexeerbaar() ? [] : STEDEN) {
    for (const b of buurSteden(s, 2)) {
      urls.push({
        url: `${SITE}/van/${s.slug}/naar/${b.slug}`,
        lastModified: nu,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  // Aftellers (v3.35.0), alleen NL. Dagelijks: de telling verandert elke dag.
  if (!IS_EN) {
    urls.push({ url: `${SITE}${AFTEL_HUB_PAD}`, lastModified: nu, changeFrequency: "daily", priority: 0.8 });
    // Kalender- en rekenpagina's (v3.37.0).
    urls.push({ url: `${SITE}${ANTWOORDEN_HUB_PAD}`, lastModified: nu, changeFrequency: "weekly", priority: 0.7 });
    for (const r of REKENHULPEN) {
      urls.push({ url: `${SITE}/${r.slug}`, lastModified: nu, changeFrequency: "daily", priority: 0.8 });
    }
    for (const a of AFTELLERS) {
      urls.push({ url: `${SITE}/${a.slug}`, lastModified: nu, changeFrequency: "daily", priority: 0.8 });
    }
  }

  urls.push({ url: `${SITE}${PAD.alleChecks}`, lastModified: nu, changeFrequency: "weekly", priority: 0.6 });
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
