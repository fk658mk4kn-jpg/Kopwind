import { notFound } from "next/navigation";
import Link from "next/link";
import { STEDEN, vindStad } from "@/lib/steden/nl";
import { buurSteden, paarTekst } from "@/lib/steden/teksten";
import { HUB_NAAM } from "@/lib/brand";
import { vindTool } from "@/lib/tools";
import FietsTool from "@/components/tools/FietsTool";
import Broodkruimel from "@/components/Broodkruimel";
import AdSlot from "@/components/AdSlot";

/**
 * Route-paar-pagina's (§9), de tactiek van de directe concurrent: per stad
 * de twee dichtstbijzijnde buursteden vooraf gegenereerd (beide richtingen),
 * en elk ander geldig stedenpaar on demand via dynamicParams. De fietstool
 * staat al ingesteld van centrum naar centrum.
 */

export const dynamicParams = true;
export const revalidate = 86400;

export function generateStaticParams() {
  const params = [];
  for (const s of STEDEN) {
    for (const b of buurSteden(s, 2)) {
      params.push({ herkomst: s.slug, bestemming: b.slug });
    }
  }
  return params;
}

export function generateMetadata({ params }) {
  const van = vindStad(params.herkomst);
  const naar = vindStad(params.bestemming);
  if (!van || !naar || van.slug === naar.slug) return {};
  const title = `Fietsen van ${van.naam} naar ${naar.naam}: wind en fietsweer vandaag`;
  const description = `Vandaag van ${van.naam} naar ${naar.naam} fietsen? Check de route: wind tegen per deel, regen, temperatuur, reistijd en een rapportcijfer. Gratis.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/van/${van.slug}/naar/${naar.slug}` },
    openGraph: { title, description, url: `/van/${van.slug}/naar/${naar.slug}` },
  };
}

export default function PaarPagina({ params }) {
  const van = vindStad(params.herkomst);
  const naar = vindStad(params.bestemming);
  if (!van || !naar || van.slug === naar.slug) notFound();

  const tool = vindTool("fietsen-naar-werk");
  const [afstandZin, uitlegZin] = paarTekst(van, naar);
  const stops = [
    { naam: `${van.naam}, centrum`, lat: van.lat, lon: van.lon },
    { naam: `${naar.naam}, centrum`, lat: naar.lat, lon: naar.lon },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: HUB_NAAM, item: "/" },
      { "@type": "ListItem", position: 2, name: tool.naam, item: `/${tool.slug}` },
      {
        "@type": "ListItem",
        position: 3,
        name: `Van ${van.naam} naar ${naar.naam}`,
        item: `/van/${van.slug}/naar/${naar.slug}`,
      },
    ],
  };

  return (
    <main>
      <Broodkruimel
        items={[
          { naam: HUB_NAAM, href: "/" },
          { naam: tool.naam, href: `/${tool.slug}` },
          { naam: `Van ${van.naam} naar ${naar.naam}` },
        ]}
      />

      <section className="tool-hero">
        <h1>Fietsen van {van.naam} naar {naar.naam}?</h1>
        <p>{afstandZin}</p>
      </section>

      <FietsTool beginStops={stops} />

      <AdSlot plek="onder-tool" />

      <section className="seotekst">
        <h2>Zo gebruik je deze check</h2>
        <p>{uitlegZin}</p>

        <h2>Andere richtingen en steden</h2>
        <div className="stadlinks">
          <Link href={`/van/${naar.slug}/naar/${van.slug}`}>
            Van {naar.naam} naar {van.naam}
          </Link>
          <Link href={`/${tool.slug}/${van.slug}`}>Fietsen naar werk in {van.naam}</Link>
          <Link href={`/${tool.slug}/${naar.slug}`}>Fietsen naar werk in {naar.naam}</Link>
          {buurSteden(van, 3).map((b) => (
            <Link key={b.slug} href={`/van/${van.slug}/naar/${b.slug}`}>
              Van {van.naam} naar {b.naam}
            </Link>
          ))}
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </main>
  );
}
