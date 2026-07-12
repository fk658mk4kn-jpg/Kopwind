import Link from "next/link";
import { HUB_NAAM, HUB_CLAIM, WINDSTRIP_DEMO } from "@/lib/brand";
import { TOOLS } from "@/lib/tools";
import { hub } from "@/content/hub";
import { kleurDivergerend } from "@/lib/engine/kleuren";
import VandaagHier from "@/components/VandaagHier";
import KleurLegenda from "@/components/KleurLegenda";
import Icoon from "@/components/Icoon";
import { UITLEG } from "@/content/uitleg";

export const metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

/**
 * De hub: functionele hero (kies je plek, zie direct het antwoord van
 * vandaag), de windstrip als signature met een uitgelegde legenda, en de
 * tools als vraag-kaarten met een teaser voor de groeiende familie.
 */

const GROEPEN = ["Elke dag", "Onderweg", "Rondom huis"];

const TEASERS = [
  { naam: "Vandaag barbecue?", zin: "Het beste vensterblok vanavond, en waar je 'm neerzet met deze windrichting." },
  { naam: "Word ik nat vandaag?", zin: "Niet \u00f3f het regent, maar wanneer, op jouw dag." },
  { naam: "Moet ik krabben?", zin: "Winterspecial: vorst- en ijzelrisico voor morgenochtend, met timing." },
];

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

      {GROEPEN.map((groep) => (
        <section key={groep} aria-label={groep}>
          <h2 className="groep-kop">{groep}</h2>
          <div className="toolkaarten">
            {TOOLS.filter((t) => t.groep === groep).map((t) => (
              <Link key={t.slug} href={`/${t.slug}`} className="toolkaart">
                <span className="kaart-top">
                  <Icoon naam={t.icoon} maat={20} />
                  <h2>{t.naam}</h2>
                </span>
                <p>{t.korteVraag}</p>
                <p className="diepte">{t.diepte}</p>
                <span className="doorlink">{t.cta}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <section aria-label="Binnenkort">
        <h2 className="groep-kop">Binnenkort</h2>
        <div className="toolkaarten">
          {TEASERS.map((t) => (
            <div key={t.naam} className="toolkaart teaser">
              <h2>{t.naam}</h2>
              <p>{t.zin}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="gewone-taal seotekst" aria-label="Het weer in gewone taal">
        <h2>Het weer in gewone taal</h2>
        <p>
          Waarom voelt 12 graden soms als 7? Wat betekent 60% kans op regen nou echt? En hoe
          droogt een was eigenlijk? Korte uitleg zonder vakjargon, zodat je snapt waarom de
          checks zeggen wat ze zeggen.
        </p>
        <div className="uitleg-links">
          {UITLEG.map((a) => (
            <Link key={a.slug} href={`/uitleg/${a.slug}`} className="chip">
              {a.vraag}
            </Link>
          ))}
        </div>
      </section>

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
