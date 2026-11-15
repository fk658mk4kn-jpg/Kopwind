import Link from "next/link";
import { notFound } from "next/navigation";
import Broodkruimel from "@/components/Broodkruimel";
import DatumCalculator from "@/components/aftellen/DatumCalculator";
import { HUB_NAAM } from "@/lib/brand";
import { IS_EN } from "@/lib/i18n/locale";
import { AFTELLERS, GROEPEN, volgende, AFTEL_HUB_PAD } from "@/lib/aftellen";
import { AFTEL_HUB } from "@/content/aftellen";
import { REKENHULPEN } from "@/lib/rekenhulpen";

/**
 * Verzamelpagina van alle aftellers (v3.35.0): een vrije datumcalculator
 * plus elke teller per groep met de stand van vandaag. Alleen NL.
 */
export const revalidate = 3600;

export const metadata = IS_EN
  ? {}
  : {
      title: AFTEL_HUB.titel,
      description: AFTEL_HUB.intro.slice(0, 155),
      alternates: { canonical: AFTEL_HUB_PAD },
    };

function stand(a) {
  const m = volgende(a)[0];
  if (a.soort === "weekend" || a.soort === "zon" || a.soort === "droog") return "live";
  if (!m) return "";
  if (a.soort === "vakantie") {
    const min = Math.min(...volgende(a).map((x) => (x.bezig ? 0 : x.dagen)));
    return min === 0 ? "nu bezig" : `vanaf ${min} dagen`;
  }
  if (m.isVandaag) return "vandaag";
  if (m.bezig) return "nu bezig";
  return `${m.dagen} ${m.dagen === 1 ? "dag" : "dagen"}`;
}

export default function AftelHub() {
  if (IS_EN) notFound();
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: AFTEL_HUB.faq.map((f) => ({
      "@type": "Question",
      name: f.v,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <main>
      <Broodkruimel items={[{ naam: HUB_NAAM, href: "/" }, { naam: "Aftellen en kalender" }]} />
      <section className="tool-hero">
        <h1>{AFTEL_HUB.h1}</h1>
        <p>{AFTEL_HUB.intro}</p>
      </section>

      <DatumCalculator />

      <section className="aftel-groep">
        <h2>Kalender en rekenhulpen</h2>
        <ul className="aftel-lijst">
          {REKENHULPEN.map((r) => (
            <li key={r.id}>
              <Link href={`/${r.slug}`}>
                <span>{r.titel}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {GROEPEN.map((g) => (
        <section key={g.id} className="aftel-groep">
          <h2>{g.titel}</h2>
          <ul className="aftel-lijst">
            {AFTELLERS.filter((a) => a.groep === g.id)
              .map((a) => ({ a, n: volgende(a)[0]?.dagen ?? 9999 }))
              .sort((x, y) => (g.id === "nu" ? 0 : x.n - y.n))
              .map(({ a }) => (
              <li key={a.id}>
                <Link href={`/${a.slug}`}>
                  <span>{a.titel}</span>
                  <span className="aftel-lijst-stand">{stand(a)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="seotekst">
        <h2>Veelgestelde vragen</h2>
        {AFTEL_HUB.faq.map((f) => (
          <details key={f.v} className="faq-item">
            <summary>
              <h3>{f.v}</h3>
            </summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
