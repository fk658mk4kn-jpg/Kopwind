import Link from "next/link";
import Icoon from "@/components/Icoon";
import { vindToolOpId } from "@/lib/tools";

/**
 * Storefront-blok 3 (PLAYBOOK sectie 11): de keuzehulp. Helpt de bezoeker
 * het juiste segment kiezen, met de checks als keuzes. Elke keuze is een
 * situatie plus een bestemming: een live check (toolId) of, voor vragen
 * zonder eigen tool, het antwoord verderop op de pagina (anchor naar een
 * FAQ-item). Zo stuurt de pagina actief in plaats van een kale lijst te
 * tonen, en vangt hij de long-tail zonder concurrerende URL's.
 */
export default function KeuzeHulpBlok({ blok }) {
  if (!blok?.keuzes?.length) return null;
  return (
    <section className="storefront-keuzehulp" aria-label={blok.kop}>
      <h2>{blok.kop}</h2>
      {blok.intro && <p className="uitleg">{blok.intro}</p>}
      <div className="keuzehulp-lijst">
        {blok.keuzes.map((k, i) => {
          const tool = k.toolId ? vindToolOpId(k.toolId) : null;
          const href = tool ? `/${tool.slug}` : `#${k.anchor}`;
          const label = tool ? tool.korteVraag : k.linkTekst;
          return (
            <Link key={i} href={href} className="keuzehulp-rij">
              <span className="keuzehulp-situatie">{k.situatie}</span>
              <span className="keuzehulp-link">
                {label} <Icoon naam="pijl" maat={13} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
