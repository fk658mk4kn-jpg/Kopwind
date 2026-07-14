import Link from "next/link";
import { HUB_NAAM, HUB_CLAIM } from "@/lib/brand";
import { hub } from "@/content/hub";
import { kies, LOCALE } from "@/lib/i18n/locale";
import { PAD } from "@/lib/i18n/paden";
import HubGrid from "@/components/HubGrid";

export const metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

/**
 * De hub (v3.0.0): compact en beslissingsgericht. Een zin, dan de kaarten
 * met het live antwoord van vandaag, een korte binnenkort-rij en een
 * handvol vragen. Uitleg en achtergrond wonen op hun eigen pagina's.
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
    inLanguage: LOCALE,
  };

  return (
    <main>
      <section className="hub-hero compact">
        <h1>{kies({ nl: "Kan het vandaag ...?", en: "Good day for ...?" })}</h1>
        <p className="hero-zin">{hub.intro}</p>
      </section>

      <HubGrid />

      <p className="uitleg-verwijzing">
        {kies({ nl: "Waarom zegt een check wat hij zegt?", en: "Why does a check say what it says?" })} <Link href={PAD.uitleg}>{kies({ nl: "Het weer in gewone taal", en: "The weather in plain words" })}</Link>.
      </p>

      <section className="seotekst compact">
        <h2>{kies({ nl: "Veelgestelde vragen", en: "Frequently asked questions" })}</h2>
        {hub.faq.map((f) => (
          <details key={f.v} className="faq-item">
            <summary><h3>{f.v}</h3></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
