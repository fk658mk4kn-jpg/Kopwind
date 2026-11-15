import { notFound } from "next/navigation";
import Icoon from "@/components/Icoon";
import Link from "next/link";
import { TOOLS, vindTool, POPULAIRE_TOOL_IDS } from "@/lib/tools";
import TekstMetLinks from "@/components/TekstMetLinks";
import { platteTekst } from "@/lib/inlineLinks";
import { inhoudVoorTool } from "@/content";
import { STEDEN, vindStad } from "@/lib/steden/nl";
import { stadTekst, buurSteden } from "@/lib/steden/teksten";
import { titelVoor } from "@/lib/steden/stadTemplates";
import { HUB_NAAM } from "@/lib/brand";
import FietsTool from "@/components/tools/FietsTool";
import RegenTimingTool from "@/components/tools/RegenTimingTool";
import ParapluTool from "@/components/tools/ParapluTool";
import LocatieTool from "@/components/tools/LocatieTool";
import Broodkruimel from "@/components/Broodkruimel";
import { kies } from "@/lib/i18n/locale";
import StemPeiling from "@/components/StemPeiling";
import AdSlot from "@/components/AdSlot";
import ServerAntwoord from "@/components/ServerAntwoord";
import { stadIndexeerbaar, NOINDEX } from "@/lib/seo/indexering";

/**
 * Programmatische stadpagina (§9): de live tool bovenaan, vooraf ingesteld
 * op de stad, met per-stad gevarieerde tekst uit echte stadseigenschappen
 * (ligging, provincie, buursteden). Interne links naar buursteden en naar
 * de andere tools voor dezelfde stad zijn de topical-authority-hefboom.
 */

export const dynamicParams = false;
// v3.27.0: van 24 uur naar 30 minuten, want het server-antwoordblok
// draagt nu een live verdict. ISR ververst per pagina on-demand, dus
// alleen bezochte pagina's kosten een weer-call.
export const revalidate = 1800;

export function generateStaticParams() {
  const params = [];
  for (const t of TOOLS) {
    for (const s of STEDEN) params.push({ tool: t.slug, stad: s.slug });
  }
  return params;
}


export function generateMetadata({ params }) {
  const tool = vindTool(params.tool);
  const stad = vindStad(params.stad);
  if (!tool || !stad) return {};
  const t = titelVoor(tool, stad);
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: `/${tool.slug}/${stad.slug}` },
    ...(stadIndexeerbaar(tool.id, stad.slug) ? {} : { robots: NOINDEX }),
    openGraph: { type: "website", title: t.title, description: t.description, url: `/${tool.slug}/${stad.slug}` },
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
  // v3.40.1: eerst acht checks die het dichtst bij deze liggen (zelfde
  // thema, dan de populairste), de rest inklapbaar. Alle links blijven in
  // de HTML staan voor de interne linkstructuur.
  const uitgelicht = [
    ...andereTools.filter((x) => x.categorieId === tool.categorieId),
    ...POPULAIRE_TOOL_IDS.map((id) => andereTools.find((x) => x.id === id)).filter(Boolean),
    ...andereTools,
  ]
    .filter((x, i, lijst) => lijst.findIndex((y) => y.slug === x.slug) === i)
    .slice(0, 8);
  const overigeTools = andereTools.filter((x) => !uitgelicht.some((u) => u.slug === x.slug));
  const centrum = { naam: `${stad.naam}, centrum`, lat: stad.lat, lon: stad.lon };

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
      acceptedAnswer: { "@type": "Answer", text: platteTekst(f.a) },
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
        {/* v3.27.0: het antwoord in de server-HTML, direct onder de H1
            (audit plus akkoord eigenaar). Faalt stil naar niets. */}
        <ServerAntwoord tool={tool} stad={stad} />
        <p>{basis}</p>
      </section>

      {/* Zelfde renderketen als de toolpagina (fix p.overlay-crash op
          de stadpagina's van de nowcast-checks): eigen component eerst,
          dan route, dan de generieke locatietool. */}
      {tool.eigenComponent === "RegenTimingTool" ? (
        <RegenTimingTool beginLocatie={centrum} />
      ) : tool.eigenComponent === "ParapluTool" ? (
        <ParapluTool beginLocatie={centrum} />
      ) : tool.inputType === "route" ? (
        <FietsTool beginStops={[centrum, null]} />
      ) : (
        <LocatieTool toolId={tool.id} beginLocatie={centrum} />
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
        </div>

        <h2>Meer checks in {stad.naam}</h2>
        <div className="stadlinks">
          {uitgelicht.map((x) => (
            <Link key={x.slug} href={`/${x.slug}/${stad.slug}`}>
              {x.korteVraag.replace("?", "")} in {stad.naam}?
            </Link>
          ))}
        </div>
        {overigeTools.length > 0 && (
          <details className="stadlinks-meer">
            <summary>Nog {overigeTools.length} checks in {stad.naam}</summary>
            <div className="stadlinks">
              {overigeTools.map((x) => (
                <Link key={x.slug} href={`/${x.slug}/${stad.slug}`}>
                  {x.korteVraag.replace("?", "")} in {stad.naam}?
                </Link>
              ))}
            </div>
          </details>
        )}

        <h2>Veelgestelde vragen</h2>
        {inhoud.faq.slice(0, 3).map((f) => (
          <div key={f.v} className="faq-item">
            <h3>{f.v}</h3>
            <p><TekstMetLinks tekst={f.a} /></p>
          </div>
        ))}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
