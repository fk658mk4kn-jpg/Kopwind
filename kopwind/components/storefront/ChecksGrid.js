import Link from "next/link";
import Icoon from "@/components/Icoon";

/**
 * Storefront-blok 5 (PLAYBOOK sectie 11): de checks zelf. De toolkaarten
 * van de categorie (korteVraag, diepte-regel, cta), doorklik naar de
 * toolpagina's. Zelfde kaartopmaak als de hub.
 */
export default function ChecksGrid({ tools, kop }) {
  if (!tools?.length) return null;
  return (
    <section aria-label={kop}>
      <h2 className="storefront-koptekst">{kop}</h2>
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
  );
}
