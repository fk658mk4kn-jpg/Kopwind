import Link from "next/link";
import Icoon from "@/components/Icoon";
import { CATEGORIEEN } from "@/lib/categorieen";
import { S } from "@/lib/strings";

/**
 * De thema-laag op de homepage (feedbackronde juli 2026): de zeven
 * categorieen als klikbare chips boven de tools, elk naar zijn
 * storefront. Zo zijn de themapagina's vanaf de voordeur vindbaar en
 * niet alleen via het menu. Zelfde visuele taal als de kaarten:
 * icon-chip plus tint in de categorie-kleur.
 */
export default function CategorieBalk() {
  return (
    <nav className="categoriegrid" aria-label={S.hub.themaKop}>
      {CATEGORIEEN.map((c) => (
        <Link
          key={c.id}
          href={`/${c.slug}`}
          className="categorieblok"
          style={{
            background: `color-mix(in srgb, ${c.kleur} 6%, #ffffff)`,
            borderColor: `color-mix(in srgb, ${c.kleur} 24%, #ffffff)`,
          }}
        >
          <span className="icon-chip klein" style={{ background: `color-mix(in srgb, ${c.kleur} 15%, #ffffff)`, color: c.kleur }}>
            <Icoon naam={c.icoon} maat={15} />
          </span>
          {c.titel}
        </Link>
      ))}
    </nav>
  );
}
