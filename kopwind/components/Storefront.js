import Link from "next/link";
import Broodkruimel from "@/components/Broodkruimel";
import Icoon from "@/components/Icoon";
import { toolsInCategorie } from "@/lib/tools";
import { VARIANTEN } from "@/lib/varianten";
import { HUB_NAAM } from "@/lib/brand";
import { S } from "@/lib/strings";
import { PAD } from "@/lib/i18n/paden";
import { vindStorefront } from "@/content/storefronts";

/**
 * De categorie-storefront (v3.6.0 "Bora"): een rankbare hub, geen
 * linklijst. Toont de tools als kaarten, daaronder beslislogica,
 * situaties per weertype, seizoenscontext en een FAQ die de
 * samengevoegde long-tail-vragen opvangt via anchors. Categorien zonder
 * uitgewerkte storefront-content tonen alleen het kaart-overzicht.
 */
export default function Storefront({ categorie }) {
  const tools = toolsInCategorie(categorie.id);
  const ouderIds = new Set(tools.map((t) => t.id));
  const varianten = VARIANTEN.filter((v) => ouderIds.has(v.ouderId));
  const sf = vindStorefront(categorie.id);

  const jsonLd = sf?.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: sf.faq.map((f) => ({
          "@type": "Question",
          name: f.v,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <main>
      <Broodkruimel
        items={[
          { naam: HUB_NAAM, href: "/" },
          { naam: S.menu.alle, href: PAD.alleChecks },
          { naam: categorie.titel },
        ]}
      />
      <section className="tool-hero">
        <h1>{categorie.titel}</h1>
        <p>{categorie.intro}</p>
      </section>

      <section aria-label={S.categorie.directAntwoord}>
        {tools.length > 0 && <h2 className="storefront-koptekst">{S.categorie.directAntwoord}</h2>}
        <div className="checkgrid">
          {tools.map((t) => (
            <Link
              key={t.id}
              href={`/${t.slug}`}
              className="checkkaart"
              style={{
                background: `color-mix(in srgb, ${t.kleur} 6%, #ffffff)`,
                borderColor: `color-mix(in srgb, ${t.kleur} 28%, #ffffff)`,
              }}
            >
              <span className="kaart-watermerk" aria-hidden="true" style={{ color: t.kleur }}>
                <Icoon naam={t.icoon} maat={96} />
              </span>
              <span className="kaart-rij1">
                <span className="icon-chip klein" style={{ background: `color-mix(in srgb, ${t.kleur} 15%, #ffffff)`, color: t.kleur }}>
                  <Icoon naam={t.icoon} maat={16} />
                </span>
                <h3 className="kaart-vraag">{t.korteVraag}</h3>
              </span>
              <p className="kaartregel klem stil">{t.diepte}</p>
              <span className="kaart-cta">
                <span className="kaart-cta-tekst">{t.cta}</span> <Icoon naam="pijl" maat={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {sf && (
        <section className="seotekst storefront-tekst">
          <h2>{sf.beslislogica.kop}</h2>
          <ul className="storefront-punten">
            {sf.beslislogica.punten.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>

          <h2>{sf.situaties.kop}</h2>
          <div className="storefront-situaties">
            {sf.situaties.items.map((s) => (
              <div key={s.naam} className="storefront-situatie">
                <h3>{s.naam}</h3>
                <p>{s.tekst}</p>
              </div>
            ))}
          </div>

          <h2>{sf.seizoen.kop}</h2>
          <div className="storefront-situaties">
            {sf.seizoen.items.map((s) => (
              <div key={s.naam} className="storefront-situatie">
                <h3>{s.naam}</h3>
                <p>{s.tekst}</p>
              </div>
            ))}
          </div>

          <h2>{S.categorie.faqKop}</h2>
          {sf.faq.map((f) => (
            <details key={f.id} id={f.id} className="faq-item">
              <summary><h3>{f.v}</h3></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </section>
      )}

      {varianten.length > 0 && (
        <section className="categorie-varianten">
          <h2>{S.categorie.meerVragen}</h2>
          <div className="gerelateerd-rij">
            {varianten.map((v) => (
              <Link key={v.id} href={`/${v.slug}`} className="gerelateerd-link">
                {v.vraag}
              </Link>
            ))}
          </div>
        </section>
      )}

      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </main>
  );
}
