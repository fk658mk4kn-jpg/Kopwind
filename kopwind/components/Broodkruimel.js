import Link from "next/link";
import { SITE_URL } from "@/lib/site";

/**
 * Broodkruimel met BreadcrumbList-schema. De item-URL's zijn altijd
 * volledige, schone absolute URL's (Google eist dat in het 'item'-veld;
 * een relatieve of dubbel-geslashte URL geeft de fout "Ongeldige URL in
 * veld id"). We joinen SITE_URL en het pad daarom via een helper die
 * dubbele slashes wegneemt, en geven ook de laatste crumb (de huidige
 * pagina) een item-URL, zodat het schema compleet is.
 */
function absolute(pad) {
  if (!pad) return null;
  if (/^https?:\/\//i.test(pad)) return pad; // al absoluut
  const basis = SITE_URL.replace(/\/+$/, "");
  const staart = `/${pad}`.replace(/\/{2,}/g, "/");
  return `${basis}${staart}`;
}

export default function Broodkruimel({ items }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => {
      const url = absolute(it.href);
      return {
        "@type": "ListItem",
        position: i + 1,
        name: it.naam,
        // Alleen een geldige absolute URL toevoegen. De laatste crumb
        // (huidige pagina) heeft vaak geen href; die laten we zonder
        // item, wat Google toestaat, in plaats van een foute URL te gokken.
        ...(url ? { item: url } : {}),
      };
    }),
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
