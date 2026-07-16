import Broodkruimel from "@/components/Broodkruimel";
import Icoon from "@/components/Icoon";
import VoorWieBlok from "@/components/storefront/VoorWieBlok";
import KeuzeHulpBlok from "@/components/storefront/KeuzeHulpBlok";
import UitlegBlokken from "@/components/storefront/UitlegBlokken";
import ChecksGrid from "@/components/storefront/ChecksGrid";
import { CategorieFaq, GerelateerdCategorieen } from "@/components/storefront/FaqEnGerelateerd";
import { toolsInCategorie } from "@/lib/tools";
import { VARIANTEN } from "@/lib/varianten";
import { BESLISSINGEN } from "@/content/beslissingen";
import { HUB_NAAM } from "@/lib/brand";
import { S } from "@/lib/strings";
import { PAD } from "@/lib/i18n/paden";
import { vindStorefront } from "@/content/storefronts";

/**
 * De categorie-storefront volgens het vaste bouwblok-format (PLAYBOOK
 * sectie 11). Blokvolgorde: hero, voor wie, keuzehulp, uitleg, alle
 * checks (live tools, vraagpagina's en geplande checks in een
 * kaartopmaak), FAQ, gerelateerd. Elke categorie heeft volledige content;
 * de component rendert configuratie uit content/storefronts.js.
 *
 * Visueel (feedbackronde juli 2026): geen gekleurde banner met rand,
 * maar een subtiele paginabrede tint in de categorie-kleur plus het
 * categorie-icoon groot en rustig op de achtergrond van de hele pagina.
 * Blok 8 (affiliate) volgt pas in fase 5 en staat bewust niet in deze
 * component.
 */
export default function Storefront({ categorie }) {
  const tools = toolsInCategorie(categorie.id);
  const ouderIds = new Set(tools.map((t) => t.id));
  const varianten = VARIANTEN.filter((v) => ouderIds.has(v.ouderId));
  const catalogus = BESLISSINGEN.find((g) => g.id === categorie.id);
  const gepland = (catalogus?.items ?? []).filter(
    (i) => !i.toolId && !i.variantId && !i.anker
  );
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
    <main className="storefront-pagina">
      {/* Subtiele paginabrede tint plus het categorie-icoon als rustige
          achtergrond over de hele pagina (geen banner). */}
      <div
        className="storefront-achtergrond"
        aria-hidden="true"
        style={{ background: `color-mix(in srgb, ${categorie.kleur} 4%, #ffffff)` }}
      >
        <span className="storefront-achtergrond-icoon" style={{ color: categorie.kleur }}>
          <Icoon naam={categorie.icoon} maat={460} />
        </span>
      </div>

      <Broodkruimel
        items={[
          { naam: HUB_NAAM, href: "/" },
          { naam: S.menu.alle, href: PAD.alleChecks },
          { naam: categorie.titel },
        ]}
      />

      {/* Blok 1: hero */}
      <section className="tool-hero">
        <h1>{categorie.titel}</h1>
        <p>{categorie.intro}</p>
      </section>

      {/* Blok 2: voor wie / waarvoor */}
      <VoorWieBlok blok={sf?.voorWie} />

      {/* Blok 3: alle checks (live, vraagpagina's en gepland). Op verzoek
          (juli 2026) voor de keuzehulp: het grid heeft de sterkste CTA. */}
      <ChecksGrid
        tools={tools}
        varianten={varianten}
        gepland={gepland}
        kop={S.categorie.alleChecks}
      />

      {/* Blok 4: uitleg (waar let je op) */}
      <UitlegBlokken sf={sf} categorie={categorie} />

      {/* Blok 5: keuzehulp (situatie-routering, ook naar antwoorden
          zonder eigen check) */}
      <KeuzeHulpBlok blok={sf?.keuzehulp} categorie={categorie} />

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
