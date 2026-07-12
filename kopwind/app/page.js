import Link from "next/link";
import { HUB_NAAM, HUB_CLAIM, WINDSTRIP_DEMO } from "@/lib/brand";
import { TOOLS } from "@/lib/tools";
import { hub } from "@/content/hub";
import { kleurDivergerend } from "@/lib/engine/kleuren";
import VandaagHier from "@/components/VandaagHier";
import KleurLegenda from "@/components/KleurLegenda";

export const metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

/**
 * De hub: functionele hero (kies je plek, zie direct het antwoord van
 * vandaag), de windstrip als signature met een uitgelegde legenda, en de
 * tools als vraag-kaarten met een teaser voor de groeiende familie.
 */

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
        <h1>{HUB_NAAM.toLowerCase()}</h1>
        <p>{hub.intro}</p>
        <div className="demo-strip" role="img" aria-label="De windstrip: per stuk route zie je of je wind mee of tegen hebt, van blauw naar oranje.">
          {WINDSTRIP_DEMO.map((x, i) => (
            <div
              key={i}
              style={{
                width: `${100 / WINDSTRIP_DEMO.length}%`,
                background: kleurDivergerend(x),
                animationDelay: `${i * 55}ms`,
              }}
            />
          ))}
        </div>
        <KleurLegenda soort="wind" links="wind mee" rechts="wind tegen" />
        <VandaagHier />
      </section>

      <div className="toolkaarten">
        {TOOLS.map((t) => (
          <Link key={t.slug} href={`/${t.slug}`} className="toolkaart">
            <h2>{t.naam}</h2>
            <p>{t.korteVraag}</p>
            <span className="doorlink">Doe de check</span>
          </Link>
        ))}
        <div className="toolkaart teaser" aria-label="Binnenkort">
          <h2>Binnenkort</h2>
          <p>Vandaag terras? Vandaag barbecue? De familie groeit.</p>
        </div>
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
