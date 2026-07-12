import { notFound } from "next/navigation";
import Link from "next/link";
import { TOOLS, vindTool } from "@/lib/tools";
import { inhoudVoorTool } from "@/content";
import { STEDEN, vindStad } from "@/lib/steden/nl";
import { stadTekst, buurSteden } from "@/lib/steden/teksten";
import { HUB_NAAM } from "@/lib/brand";
import FietsTool from "@/components/tools/FietsTool";
import WasTool from "@/components/tools/WasTool";
import Broodkruimel from "@/components/Broodkruimel";
import StemPeiling from "@/components/StemPeiling";
import AdSlot from "@/components/AdSlot";

/**
 * Programmatische stadpagina (§9): de live tool bovenaan, vooraf ingesteld
 * op de stad, met per-stad gevarieerde tekst uit echte stadseigenschappen
 * (ligging, provincie, buursteden). Interne links naar buursteden en naar
 * de andere tools voor dezelfde stad zijn de topical-authority-hefboom.
 */

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  const params = [];
  for (const t of TOOLS) {
    for (const s of STEDEN) params.push({ tool: t.slug, stad: s.slug });
  }
  return params;
}

function titelVoor(tool, stad) {
  if (tool.id === "fiets-naar-werk") {
    return {
      title: `Fietsen naar werk in ${stad.naam}: wind en fietsweer vandaag`,
      description: `Kan ik vandaag fietsen naar werk in ${stad.naam}? Check je rit: wind tegen per deel van de route, regen, temperatuur en een rapportcijfer. Gratis.`,
      h1: `Vandaag op de fiets naar werk in ${stad.naam}?`,
    };
  }
  return {
    title: `Was buiten drogen in ${stad.naam}: droogvenster vandaag`,
    description: `Kan de was vandaag buiten in ${stad.naam}? Zie per uur wanneer je was goed droogt: luchtvochtigheid, wind en regen, met een cijfer per dag. Gratis.`,
    h1: `Vandaag de was buiten in ${stad.naam}?`,
  };
}

export function generateMetadata({ params }) {
  const tool = vindTool(params.tool);
  const stad = vindStad(params.stad);
  if (!tool || !stad) return {};
  const t = titelVoor(tool, stad);
  return {
    title: { absolute: t.title },
    description: t.description,
    alternates: { canonical: `/${tool.slug}/${stad.slug}` },
    openGraph: { title: t.title, description: t.description, url: `/${tool.slug}/${stad.slug}` },
  };
}

export default function StadPagina({ params }) {
  const tool = vindTool(params.tool);
  const stad = vindStad(params.stad);
  const inhoud = inhoudVoorTool(params.tool);
  if (!tool || !stad || !inhoud) notFound();

  const t = titelVoor(tool, stad);
  const [basis, context] = stadTekst(tool.id, stad);
  const buren = buurSteden(stad, 4);
  const andereTools = TOOLS.filter((x) => x.slug !== tool.slug);
  const centrum = { naam: `${stad.naam}, centrum`, lat: stad.lat, lon: stad.lon };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: HUB_NAAM, item: "/" },
      { "@type": "ListItem", position: 2, name: tool.naam, item: `/${tool.slug}` },
      { "@type": "ListItem", position: 3, name: stad.naam, item: `/${tool.slug}/${stad.slug}` },
    ],
  };
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${tool.naam} ${stad.naam}`,
    description: t.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    inLanguage: "nl",
  };
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: inhoud.faq.slice(0, 3).map((f) => ({
      "@type": "Question",
      name: f.v,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main>
      <Broodkruimel
        items={[
          { naam: HUB_NAAM, href: "/" },
          { naam: tool.naam, href: `/${tool.slug}` },
          { naam: stad.naam },
        ]}
      />

      <section className="tool-hero">
        <h1>{t.h1}</h1>
        <p>{basis}</p>
      </section>

      {tool.inputType === "route" ? (
        <FietsTool beginStops={[centrum, null]} />
      ) : (
        <WasTool beginLocatie={centrum} />
      )}

      <StemPeiling toolId={tool.id} />
      <AdSlot plek="onder-tool" />

      <section className="seotekst">
        <h2>{tool.meldingKort} voor {stad.naam}</h2>
        <p>{context}</p>

        <h2>In de buurt van {stad.naam}</h2>
        <div className="stadlinks">
          {buren.map((b) => (
            <Link key={b.slug} href={`/${tool.slug}/${b.slug}`}>
              {b.naam}
            </Link>
          ))}
          {andereTools.map((x) => (
            <Link key={x.slug} href={`/${x.slug}/${stad.slug}`}>
              {x.korteVraag.replace("?", "")} in {stad.naam}?
            </Link>
          ))}
        </div>

        <h2>Veelgestelde vragen</h2>
        {inhoud.faq.slice(0, 3).map((f) => (
          <div key={f.v} className="faq-item">
            <h3>{f.v}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
