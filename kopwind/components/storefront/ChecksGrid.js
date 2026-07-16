import Link from "next/link";
import Icoon from "@/components/Icoon";
import { vindToolOpId } from "@/lib/tools";
import { S } from "@/lib/strings";

/**
 * Storefront-blok 5 (PLAYBOOK sectie 11): alle checks in deze categorie.
 * Drie soorten kaarten in dezelfde opmaak (titel, subregel, cta):
 * live tools, vraagpagina's (varianten, met de diepte-regel en cta van
 * de oudertool), en geplande checks als gedempte kaart met een
 * Binnenkort-badge (niet klikbaar, wel zichtbaar: complete dekking).
 * Rendert niets als de categorie nog geen enkele kaart heeft.
 */
export default function ChecksGrid({ tools = [], varianten = [], gepland = [], kop }) {
  if (!tools.length && !varianten.length && !gepland.length) return null;
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
        {varianten.map((v) => {
          const ouder = vindToolOpId(v.ouderId);
          if (!ouder) return null;
          return (
            <Link
              key={v.id}
              href={`/${v.slug}`}
              className="checkkaart"
              style={{
                background: `color-mix(in srgb, ${ouder.kleur} 6%, #ffffff)`,
                borderColor: `color-mix(in srgb, ${ouder.kleur} 28%, #ffffff)`,
              }}
            >
              <span className="kaart-watermerk" aria-hidden="true" style={{ color: ouder.kleur }}>
                <Icoon naam={ouder.icoon} maat={96} />
              </span>
              <span className="kaart-rij1">
                <span className="icon-chip klein" style={{ background: `color-mix(in srgb, ${ouder.kleur} 15%, #ffffff)`, color: ouder.kleur }}>
                  <Icoon naam={ouder.icoon} maat={16} />
                </span>
                <h3 className="kaart-vraag">{v.vraag}</h3>
              </span>
              <p className="kaartregel klem stil">{ouder.diepte}</p>
              <span className="kaart-cta">
                <span className="kaart-cta-tekst">{ouder.cta}</span> <Icoon naam="pijl" maat={13} />
              </span>
            </Link>
          );
        })}
        {gepland.map((item) => (
          <div key={item.vraag} className="checkkaart checkkaart-gepland" aria-disabled="true">
            <span className="kaart-rij1">
              <h3 className="kaart-vraag">{item.vraag}</h3>
            </span>
            <span className="badge klein stil">{S.hub.binnenkort}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
