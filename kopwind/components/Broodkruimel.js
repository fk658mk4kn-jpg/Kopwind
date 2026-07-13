import Link from "next/link";
import { SITE_URL } from "@/lib/site";

/**
 * Broodkruimel voor de programmatische pagina's: het zichtbare pad plus
 * het bijpassende BreadcrumbList-schema, zodat Google de site-structuur
 * begrijpt (playbook: structured data spiegelt wat de bezoeker ziet).
 */
export default function Broodkruimel({ items }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.naam,
      ...(it.href ? { item: `${SITE_URL}${it.href}` } : {}),
    })),
  };
  return (
    <>
      <nav className="broodkruimel" aria-label="Kruimelpad">
        {items.map((it, i) => (
          <span key={i}>
            {i > 0 && <span className="kruimel-scheider" aria-hidden="true">/</span>}
            {it.href ? <Link href={it.href}>{it.naam}</Link> : <span>{it.naam}</span>}
          </span>
        ))}
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
