import Link from "next/link";
import Icoon from "@/components/Icoon";
import { vindToolOpId } from "@/lib/tools";
import { VARIANTEN } from "@/lib/varianten";

/**
 * Storefront-blok 3 (PLAYBOOK sectie 11): de keuzehulp. Helpt de bezoeker
 * het juiste segment kiezen, met de checks als keuzes. Elke keuze is een
 * situatie plus een bestemming: een live check (toolId), een vraagpagina
 * (variantId), of, voor vragen zonder eigen pagina, het antwoord verderop
 * op deze pagina (anchor naar een FAQ-item). Zo stuurt de pagina actief in
 * plaats van een kale lijst te tonen, en vangt hij de long-tail zonder
 * concurrerende URL's.
 */
export default function KeuzeHulpBlok({ blok, categorie }) {
  if (!blok?.keuzes?.length) return null;
  const kleur = categorie?.kleur ?? "#1B2733";
  return (
    <section className="storefront-keuzehulp" aria-label={blok.kop}>
      <h2>{blok.kop}</h2>
      {blok.intro && <p className="uitleg">{blok.intro}</p>}
      <div className="keuzehulp-lijst">
        {blok.keuzes.map((k, i) => {
          const tool = k.toolId ? vindToolOpId(k.toolId) : null;
          const variant = k.variantId ? VARIANTEN.find((v) => v.id === k.variantId) : null;
          const href = tool ? `/${tool.slug}` : variant ? `/${variant.slug}` : `#${k.anchor}`;
          const label = tool ? tool.korteVraag : variant ? variant.vraag : k.linkTekst;
          return (
            <Link
              key={i}
              href={href}
              className="keuzehulp-rij"
              style={{
                background: `color-mix(in srgb, ${kleur} 5%, #ffffff)`,
                borderColor: `color-mix(in srgb, ${kleur} 22%, #ffffff)`,
              }}
            >
              <span className="keuzehulp-situatie">{k.situatie}</span>
              <span className="keuzehulp-link" style={{ color: kleur }}>
                {label} <Icoon naam="pijl" maat={14} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
