import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { VARIANTEN } from "@/lib/varianten";
import { vindCategorieOpId } from "@/lib/categorieen";
import { parseInlineLinks } from "@/lib/inlineLinks";

/**
 * Rendert een content-string met de [label](tool:id) / [label](hub:id#anker)
 * notatie naar tekst met echte next/link-links ertussen. Losstaand van de
 * <p>-wrapper: de caller bepaalt of het in een <p>, <li> of ergens anders
 * komt te staan, dit component levert alleen de inhoud.
 *
 * `tool:id` resolveert eerst tegen TOOLS, dan tegen VARIANTEN (jas,
 * korte-broek, t-shirt zijn eigen vraagpagina's met hun eigen id en
 * slug, geen entry in TOOLS); zo kan een link ook naar een variant.
 *
 * Onbekende doelen (typefout, verwijderde tool) worden stil als platte
 * tekst getoond in plaats van een kapotte link; de test
 * tests/inline-links.test.js vangt zulke fouten al vóór de build.
 */
export default function TekstMetLinks({ tekst }) {
  const delen = parseInlineLinks(tekst);
  return (
    <>
      {delen.map((d, i) => {
        if (d.type === "tekst") return d.waarde;
        if (d.type === "tool") {
          const tool = TOOLS.find((t) => t.id === d.toolId);
          if (tool) {
            return (
              <Link key={i} href={`/${tool.slug}`} className="inline-link">
                {d.label}
              </Link>
            );
          }
          const variant = VARIANTEN.find((v) => v.id === d.toolId);
          if (variant) {
            return (
              <Link key={i} href={`/${variant.slug}`} className="inline-link">
                {d.label}
              </Link>
            );
          }
          return d.label;
        }
        const cat = vindCategorieOpId(d.categorieId);
        if (!cat) return d.label;
        const href = d.anker ? `/${cat.slug}#${d.anker}` : `/${cat.slug}`;
        return (
          <Link key={i} href={href} className="inline-link">
            {d.label}
          </Link>
        );
      })}
    </>
  );
}
