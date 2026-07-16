import Broodkruimel from "@/components/Broodkruimel";
import Icoon from "@/components/Icoon";
import VoorWieBlok from "@/components/storefront/VoorWieBlok";
import KeuzeHulpBlok from "@/components/storefront/KeuzeHulpBlok";
import UitlegBlokken from "@/components/storefront/UitlegBlokken";
import ChecksGrid from "@/components/storefront/ChecksGrid";
import { CategorieFaq, GerelateerdCategorieen } from "@/components/storefront/FaqEnGerelateerd";
import Link from "next/link";
import { toolsInCategorie } from "@/lib/tools";
import { VARIANTEN } from "@/lib/varianten";
import { HUB_NAAM } from "@/lib/brand";
import { S } from "@/lib/strings";
import { PAD } from "@/lib/i18n/paden";
import { vindStorefront } from "@/content/storefronts";

/**
 * De categorie-storefront volgens het vaste bouwblok-format (PLAYBOOK
 * sectie 11, gebouwd in v3.9.0): eerst context en keuzehulp, daarna pas
 * de concrete keuze. Blokvolgorde: hero, voor wie, keuzehulp, uitleg,
 * de checks, meer vragen (varianten), FAQ, gerelateerd. Elk blok is een
 * herbruikbaar component; de storefront zelf is configuratie uit
 * content/storefronts.js. Categorien zonder uitgewerkte content vallen
 * terug op hero plus kaart-overzicht. Blok 8 (affiliate) volgt pas in
 * fase 5 en staat bewust niet in deze component.
 */
export default function Storefront({ categorie }) {
  const tools = toolsInCategorie(categorie.id);
  const ouderIds = new Set(tools.map((t) => t.id));
  const varianten = VARIANTEN.filter((v) => ouderIds.has(v.ouderId));
  const sf = vindStorefront(categorie.id);

  const faqJsonLd = sf?.faq?.length
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

  const lijstJsonLd = tools.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: categorie.titel,
        itemListElement: tools.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: t.korteVraag,
          url: `/${t.slug}`,
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

      {/* Blok 1: hero, in de categorie-kleur met het icoon als watermerk */}
      <section
        className="tool-hero storefront-hero"
        style={{
          background: `color-mix(in srgb, ${categorie.kleur} 7%, #ffffff)`,
          borderColor: `color-mix(in srgb, ${categorie.kleur} 26%, #ffffff)`,
        }}
      >
        <span className="storefront-watermerk" aria-hidden="true" style={{ color: categorie.kleur }}>
          <Icoon naam={categorie.icoon} maat={200} />
        </span>
        <h1>{categorie.titel}</h1>
        <p>{categorie.intro}</p>
      </section>

      {/* Blok 2: voor wie / waarvoor */}
      <VoorWieBlok blok={sf?.voorWie} />

      {/* Blok 3: keuzehulp (met de checks als keuzes) */}
      <KeuzeHulpBlok blok={sf?.keuzehulp} />

      {/* Blok 4: uitleg (waar let je op) */}
      <UitlegBlokken sf={sf} />

      {/* Blok 5: de checks zelf. Zonder uitgewerkte content is dit het
          eerste blok na de hero (fallback) en heet het Direct antwoord. */}
      <ChecksGrid
        tools={tools}
        kop={sf ? S.categorie.alleChecks : S.categorie.directAntwoord}
      />

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

      {/* Blok 6: FAQ */}
      <CategorieFaq faq={sf?.faq} />

      {/* Blok 7: gerelateerde onderwerpen */}
      <GerelateerdCategorieen ids={sf?.gerelateerd} />

      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}
      {lijstJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(lijstJsonLd) }} />
      )}
    </main>
  );
}
