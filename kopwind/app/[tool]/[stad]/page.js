import { notFound } from "next/navigation";
import Icoon from "@/components/Icoon";
import Link from "next/link";
import { TOOLS, vindTool } from "@/lib/tools";
import { inhoudVoorTool } from "@/content";
import { STEDEN, vindStad } from "@/lib/steden/nl";
import { stadTekst, buurSteden } from "@/lib/steden/teksten";
import { HUB_NAAM } from "@/lib/brand";
import FietsTool from "@/components/tools/FietsTool";
import LocatieTool from "@/components/tools/LocatieTool";
import Broodkruimel from "@/components/Broodkruimel";
import { kies } from "@/lib/i18n/locale";
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

const STAD_TEMPLATES = kies({
  nl: {
    "fiets-naar-werk": (s) => ({
      title: `Fietsen naar werk in ${s}: wind en fietsweer vandaag`,
      description: `Kan ik vandaag fietsen naar werk in ${s}? Check je rit: wind tegen per deel van de route, regen, temperatuur en een duidelijk oordeel. Gratis.`,
      h1: `Vandaag op de fiets naar werk in ${s}?`,
    }),
    "was-buiten-drogen": (s) => ({
      title: `Was buiten drogen in ${s}: droogvenster vandaag`,
      description: `Kan de was vandaag buiten in ${s}? Zie per uur wanneer je was goed droogt: luchtvochtigheid, wind en regen, met droogtijd. Gratis.`,
      h1: `Vandaag de was buiten in ${s}?`,
    }),
    "wat-trek-ik-aan": (s) => ({
      title: `Wat trek ik vandaag aan in ${s}? Kledingadvies op gevoel`,
      description: `Wat trek ik vandaag aan in ${s}? Praktisch kledingadvies op gevoelstemperatuur: laagjes, regenkleding en het verloop van de dag. Gratis.`,
      h1: `Wat trek ik vandaag aan in ${s}?`,
    }),
    "terras": (s) => ({
      title: `Terrasweer in ${s}: de beste terrasuren vandaag`,
      description: `Kan ik vandaag op het terras in ${s}? Zie de beste terrasuren: gevoelstemperatuur, wind en zon per uur, vijf dagen vooruit. Gratis.`,
      h1: `Vandaag op het terras in ${s}?`,
    }),
    "barbecue": (s) => ({
      title: `Barbecueweer in ${s}: het beste avondblok vandaag`,
      description: `Kan ik vandaag barbecue\u00ebn in ${s}? Zie het beste avondblok, of het droog blijft en waar de rook heen trekt. Gratis.`,
      h1: `Vandaag barbecue\u00ebn in ${s}?`,
    }),
  },
  en: {
    "fiets-naar-werk": (s) => ({
      title: `Bike to work in ${s}: wind and cycling weather today`,
      description: `Can I bike to work in ${s} today? Check your ride: headwind per part of the route, rain, temperature and a clear verdict. Free.`,
      h1: `Bike to work in ${s} today?`,
    }),
    "was-buiten-drogen": (s) => ({
      title: `Dry laundry outside in ${s}: today's drying window`,
      description: `Can I dry laundry outside in ${s} today? See per hour when your wash dries: humidity, wind and rain, with drying time. Free.`,
      h1: `Dry the laundry outside in ${s} today?`,
    }),
    "wat-trek-ik-aan": (s) => ({
      title: `What to wear today in ${s}? Outfit advice on feels-like`,
      description: `What should I wear today in ${s}? Practical outfit advice on feels-like temperature: layers, rain gear and the day's swing. Free.`,
      h1: `What to wear in ${s} today?`,
    }),
    "terras": (s) => ({
      title: `Patio weather in ${s}: the best outdoor hours today`,
      description: `Can I sit outside in ${s} today? See the best patio hours: feels-like temperature, wind and sun per hour, five days ahead. Free.`,
      h1: `Sit outside in ${s} today?`,
    }),
    "barbecue": (s) => ({
      title: `BBQ weather in ${s}: the best evening window today`,
      description: `Can I barbecue in ${s} today? See the best evening window, whether it stays dry and where the smoke will drift. Free.`,
      h1: `Barbecue in ${s} today?`,
    }),
  },
});

function titelVoor(tool, stad) {
  const maak = STAD_TEMPLATES[tool.id] ?? STAD_TEMPLATES["was-buiten-drogen"];
  return maak(stad.naam);
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
