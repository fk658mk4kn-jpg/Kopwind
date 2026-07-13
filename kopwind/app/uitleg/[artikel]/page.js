import Link from "next/link";
import { notFound } from "next/navigation";
import { UITLEG, vindArtikel } from "@/content/uitleg";
import { TOOLS } from "@/lib/tools";
import { HUB_NAAM } from "@/lib/brand";
import { SITE_URL } from "@/lib/site";
import { kies } from "@/lib/i18n/locale";
import { PAD } from "@/lib/i18n/paden";

export function generateStaticParams() {
  return UITLEG.map((a) => ({ artikel: a.slug }));
}

export function generateMetadata({ params }) {
  const a = vindArtikel(params.artikel);
  if (!a) return {};
  return {
    title: a.titel,
    description: a.intro,
    alternates: { canonical: `${PAD.uitleg}/${a.slug}` },
  };
}

export default function UitlegArtikel({ params }) {
  const art = vindArtikel(params.artikel);
  if (!art) notFound();
  const tool = TOOLS.find((t) => t.slug === art.gerelateerdeToolSlug);
  const anderen = UITLEG.filter((x) => x.slug !== art.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: art.titel,
    description: art.intro,
    inLanguage: "nl",
    mainEntityOfPage: `${SITE_URL}/uitleg/${art.slug}`,
    publisher: { "@type": "Organization", name: HUB_NAAM },
  };

  return (
    <main>
      <div className="tool-hero">
        <h1>{art.titel}</h1>
        <p>{art.intro}</p>
      </div>
      <section className="seotekst">
        {art.blokken.map((b) => (
          <div key={b.kop}>
            <h2>{b.kop}</h2>
            <p>{b.tekst}</p>
          </div>
        ))}
        {tool && (
          <p>
            {kies({ nl: "Zelf checken?", en: "Check it yourself?" })} <Link href={`/${tool.slug}`}>{tool.naam}</Link> {art.cta}
          </p>
        )}
        <h2>{kies({ nl: "Meer uitleg", en: "More explainers" })}</h2>
        <p>
          {anderen.map((x, i) => (
            <span key={x.slug}>
              <Link href={`${PAD.uitleg}/${x.slug}`}>{x.vraag}</Link>
              {i < anderen.length - 1 ? " \u00b7 " : ""}
            </span>
          ))}
        </p>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}
