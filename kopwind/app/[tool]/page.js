import { notFound } from "next/navigation";
import Icoon from "@/components/Icoon";
import Link from "next/link";
import { TOOLS, vindTool } from "@/lib/tools";
import { inhoudVoorTool } from "@/content";
import { STEDEN } from "@/lib/steden/nl";
import { HUB_NAAM } from "@/lib/brand";
import FietsTool from "@/components/tools/FietsTool";
import LocatieTool from "@/components/tools/LocatieTool";
import Broodkruimel from "@/components/Broodkruimel";
import StemPeiling from "@/components/StemPeiling";
import AdSlot from "@/components/AdSlot";

/**
 * Dynamische toolpagina uit het register (§6): de tool bovenaan, de
 * SEO-tekst eronder, plus stadslinks als topical-authority-hefboom.
 */

export const dynamicParams = false;
export const revalidate = 86400;

export function generateStaticParams() {
  return TOOLS.map((t) => ({ tool: t.slug }));
}

export function generateMetadata({ params }) {
  const tool = vindTool(params.tool);
  const inhoud = inhoudVoorTool(params.tool);
  if (!tool || !inhoud) return {};
  return {
    title: { absolute: inhoud.seo.title },
    description: inhoud.seo.description,
    alternates: { canonical: `/${tool.slug}` },
    openGraph: {
      title: inhoud.seo.title,
      description: inhoud.seo.description,
      url: `/${tool.slug}`,
    },
  };
}

export default function ToolPagina({ params }) {
  const tool = vindTool(params.tool);
  const inhoud = inhoudVoorTool(params.tool);
  if (!tool || !inhoud) notFound();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: inhoud.faq.map((f) => ({
      "@type": "Question",
      name: f.v,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.naam,
    description: inhoud.seo.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    inLanguage: "nl",
  };

  return (
    <main>
      <Broodkruimel items={[{ naam: HUB_NAAM, href: "/" }, { naam: tool.naam }]} />

      <section className="tool-hero">
        <h1>{inhoud.seo.h1}</h1>
        <p>{inhoud.seo.intro}</p>
      </section>

      {tool.inputType === "route" ? <FietsTool /> : <LocatieTool toolId={tool.id} />}

      <StemPeiling toolId={tool.id} />
      <AdSlot plek="onder-tool" />

      <section className="seotekst">
        {inhoud.blokken.map((b) => (
          <div key={b.kop}>
            <h2>{b.kop}</h2>
            <p>{b.tekst}</p>
          </div>
        ))}

        <h2>{tool.naam.replace("?", "")} per stad</h2>
        <p>
          Direct beginnen met je eigen plaats vooraf ingevuld? Kies je stad:
        </p>
        <div className="stadlinks">
          {STEDEN.map((s) => (
            <Link key={s.slug} href={`/${tool.slug}/${s.slug}`}>
              {s.naam}
            </Link>
          ))}
        </div>

        <h2>Veelgestelde vragen</h2>
        {inhoud.faq.map((f) => (
          <div key={f.v} className="faq-item">
            <h3>{f.v}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
