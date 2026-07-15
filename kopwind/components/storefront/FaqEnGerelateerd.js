import Link from "next/link";
import Icoon from "@/components/Icoon";
import { vindCategorieOpId } from "@/lib/categorieen";
import { S } from "@/lib/strings";

/**
 * Storefront-blok 6 (PLAYBOOK sectie 11): de FAQ. Zoekwoord voorin, elk
 * item een anker (id) zodat de keuzehulp en externe links er direct heen
 * kunnen. De FAQPage-JSON-LD wordt in Storefront.js opgebouwd.
 */
export function CategorieFaq({ faq }) {
  if (!faq?.length) return null;
  return (
    <section className="seotekst storefront-tekst">
      <h2>{S.categorie.faqKop}</h2>
      {faq.map((f) => (
        <details key={f.id} id={f.id} className="faq-item">
          <summary><h3>{f.v}</h3></summary>
          <p>{f.a}</p>
        </details>
      ))}
    </section>
  );
}

/**
 * Storefront-blok 7 (PLAYBOOK sectie 11): gerelateerde onderwerpen.
 * 2-3 aangrenzende categorieen, als linkkaartjes met titel en korte
 * omschrijving, zodat de bezoeker (en de crawler) door het thema kan.
 */
export function GerelateerdCategorieen({ ids }) {
  const items = (ids ?? []).map((id) => vindCategorieOpId(id)).filter(Boolean);
  if (!items.length) return null;
  return (
    <section className="categorie-varianten" aria-label={S.categorie.gerelateerdKop}>
      <h2>{S.categorie.gerelateerdKop}</h2>
      <div className="gerelateerd-rij">
        {items.map((c) => (
          <Link key={c.id} href={`/${c.slug}`} className="gerelateerd-link">
            <strong>{c.titel}</strong> <span className="stil">{c.kort}</span>{" "}
            <Icoon naam="pijl" maat={12} />
          </Link>
        ))}
      </div>
    </section>
  );
}
