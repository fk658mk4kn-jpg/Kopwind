import Link from "next/link";
import { HUB_NAAM, HUB_CLAIM } from "@/lib/brand";
import { TOOLS } from "@/lib/tools";
import { hub } from "@/content/hub";
import { kleurSchaal } from "@/lib/engine/score";

export const metadata = {
  alternates: { canonical: "/" },
};

/**
 * De hub: functionele hero met de windstrip als merkbeeld, daarna de tools
 * als vraag-kaarten. Geen marketingblok: elke kaart is de vraag zelf.
 */

// Demo-windstrip: een herkenbare rit van wind mee naar tegen en terug.
const DEMO = [-0.9, -0.7, -0.55, -0.2, 0.1, 0.35, 0.6, 0.85, 0.95, 0.7, 0.3, -0.1, -0.4, -0.75];

export default function HubPagina() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: hub.faq.map((f) => ({
      "@type": "Question",
      name: f.v,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const siteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: HUB_NAAM,
    description: HUB_CLAIM,
    inLanguage: "nl",
  };

  return (
    <main>
      <section className="hub-hero">
        <h1>{HUB_NAAM}</h1>
        <p>{hub.intro}</p>
        <div className="demo-strip" role="img" aria-label="De windstrip: per stuk route zie je of je wind mee of tegen hebt, van groen naar rood.">
          {DEMO.map((x, i) => (
            <div
              key={i}
              style={{
                width: `${100 / DEMO.length}%`,
                background: kleurSchaal(x),
                animationDelay: `${i * 55}ms`,
              }}
            />
          ))}
        </div>
        <div className="demo-legenda">
          <span>wind mee</span>
          <span>de windstrip: elk blok is een stuk van jouw route</span>
          <span>wind tegen</span>
        </div>
      </section>

      <div className="toolkaarten">
        {TOOLS.map((t) => (
          <Link key={t.slug} href={`/${t.slug}`} className="toolkaart">
            <h2>{t.naam}</h2>
            <p>{t.korteVraag}</p>
            <span className="doorlink">Open de check</span>
          </Link>
        ))}
      </div>

      <section className="seotekst">
        {hub.blokken.map((b) => (
          <div key={b.kop}>
            <h2>{b.kop}</h2>
            <p>{b.tekst}</p>
          </div>
        ))}
        <h2>Veelgestelde vragen</h2>
        {hub.faq.map((f) => (
          <div key={f.v} className="faq-item">
            <h3>{f.v}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
