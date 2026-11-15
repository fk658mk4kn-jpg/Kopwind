import Link from "next/link";
import Broodkruimel from "@/components/Broodkruimel";
import TekstMetLinks from "@/components/TekstMetLinks";
import DeelKnop from "@/components/DeelKnop";
import { HUB_NAAM } from "@/lib/brand";
import { platteTekst } from "@/lib/inlineLinks";
import { REKEN_INHOUD } from "@/content/rekenhulpen";
import { REKENHULPEN, vindRekenhulp, ANTWOORDEN_HUB_PAD } from "@/lib/rekenhulpen";
import { AFTEL_HUB_PAD } from "@/lib/aftellen";

/**
 * Gedeelde schil voor de kalender- en rekenpagina's (v3.37.0): kruimel,
 * H1, intro, de eigen inhoud (children), gidsblokken, FAQ met JSON-LD en
 * links naar de andere rekenhulpen.
 */
export default function RekenPagina({ id, children, h1 }) {
  const inhoud = REKEN_INHOUD[id];
  const item = vindRekenhulp(id);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: inhoud.faq.map((f) => ({
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
          { naam: "Handige antwoorden", href: ANTWOORDEN_HUB_PAD },
          { naam: item.titel },
        ]}
      />
      <section className="tool-hero">
        <h1>{h1 ?? inhoud.h1}</h1>
        <p>{inhoud.intro}</p>
      </section>

      {children}

      <div className="feedback-rij">
        <DeelKnop label="Deel deze pagina" />
      </div>

      <section className="seotekst">
        {inhoud.blokken.map((b) => (
          <div key={b.kop}>
            <h2>{b.kop}</h2>
            <p>
              <TekstMetLinks tekst={b.tekst} />
            </p>
          </div>
        ))}
        <h2>Veelgestelde vragen</h2>
        {inhoud.faq.map((f) => (
          <details key={f.v} className="faq-item">
            <summary>
              <h3>{f.v}</h3>
            </summary>
            <p>
              <TekstMetLinks tekst={f.a} />
            </p>
          </details>
        ))}
      </section>

      <section className="aftel-verwant">
        <h2>Meer handige antwoorden</h2>
        <div className="aftel-chips">
          {[...REKENHULPEN.filter((r) => r.id !== id && r.groep === item.groep), ...REKENHULPEN.filter((r) => r.groep !== item.groep)]
            .slice(0, 8)
            .map((r) => (
            <Link key={r.id} href={`/${r.slug}`} className="chip">
              {r.titel}
            </Link>
          ))}
          <Link href={ANTWOORDEN_HUB_PAD} className="chip">
            Alles op een rij
          </Link>
          <Link href={AFTEL_HUB_PAD} className="chip">
            Alle tellers
          </Link>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
