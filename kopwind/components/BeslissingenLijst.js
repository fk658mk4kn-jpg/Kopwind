"use client";

import { useState } from "react";
import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { VARIANTEN } from "@/lib/varianten";
import { vindCategorieOpId } from "@/lib/categorieen";
import { kleurVoorSchaal, labelVoor } from "@/lib/engine/schaal";
import { useDagVerdicts } from "@/components/useDagVerdicts";
import LocatieZoek from "@/components/LocatieZoek";
import { S } from "@/lib/strings";
import Icoon from "./Icoon";

/**
 * De catalogus van /alle-checks (v3.10.0 "Levante"), op de vaste
 * categorie-set. Per categorie: een klikbare kop naar de storefront (in
 * de categorie-kleur), de live checks bovenaan met een statusstip plus
 * tekstlabel voor de gekozen plek (kleur alleen is niet toegankelijk),
 * dan vragen met een echt antwoord (anker op de storefront), en de
 * geplande vragen gedempt onder "In ontwikkeling". De plek is dezelfde
 * als op de homepage. Zoeken filtert over alles.
 */
export default function BeslissingenLijst({ groepen }) {
  const [zoek, setZoek] = useState("");
  const { stad, kiesStad, dagen, laden } = useDagVerdicts();
  const q = zoek.trim().toLowerCase();

  const vraagVan = (item) => {
    if (item.toolId) return TOOLS.find((t) => t.id === item.toolId)?.korteVraag ?? "";
    if (item.variantId) return VARIANTEN.find((v) => v.id === item.variantId)?.vraag ?? "";
    return item.vraag ?? "";
  };
  const past = (item) => {
    if (!q) return true;
    const vraag = vraagVan(item).toLowerCase();
    return vraag.includes(q) || (item.zoek ?? []).some((w) => w.toLowerCase().includes(q) || q.includes(w.toLowerCase()));
  };

  return (
    <div className="beslissingen">
      <div className="beslissingen-zoek">
        <input
          type="search"
          value={zoek}
          onChange={(e) => setZoek(e.target.value)}
          placeholder={S.beslissingen.zoekPlaceholder}
          aria-label={S.beslissingen.zoekLabel}
        />
        <div className="beslissingen-plek">
          <span className="instelhint">
            {S.hub.vandaagIn} {stad?.naam === "Nederland" ? S.hub.landnaam : stad?.naam ?? "..."}
          </span>
          <LocatieZoek onKies={kiesStad} placeholder={S.hub.zoekStad} />
        </div>
      </div>

      {groepen.map((groep) => {
        const cat = vindCategorieOpId(groep.id);
        if (!cat) return null;
        const items = groep.items.filter(past);
        if (!items.length) return null;
        const live = items.filter((i) => i.toolId || i.variantId || i.anker);
        const gepland = items.filter((i) => !i.toolId && !i.variantId && !i.anker);
        return (
          <section key={groep.id} className="beslissingen-groep">
            <Link
              href={`/${cat.slug}`}
              className="beslissingen-kop"
              style={{ color: cat.kleur }}
            >
              <span className="icon-chip klein" style={{ background: `color-mix(in srgb, ${cat.kleur} 15%, #ffffff)`, color: cat.kleur }}>
                <Icoon naam={cat.icoon} maat={16} />
              </span>
              <h2>{cat.titel}</h2>
              <Icoon naam="pijl" maat={14} />
            </Link>
            {live.length > 0 && (
              <ul className="beslissingen-lijst">
                {live.map((item) => {
                  const tool = item.toolId ? TOOLS.find((t) => t.id === item.toolId) : null;
                  const variant = item.variantId ? VARIANTEN.find((v) => v.id === item.variantId) : null;
                  const ankerCat = item.anker ? vindCategorieOpId(item.ankerCategorie) : null;
                  const doel = tool
                    ? `/${tool.slug}`
                    : variant
                    ? `/${variant.slug}`
                    : ankerCat
                    ? `/${ankerCat.slug}#${item.anker}`
                    : null;
                  if (!doel) return null;
                  const dag = tool && dagen ? dagen[tool.id] : null;
                  return (
                    <li key={doel}>
                      <Link href={doel} className="beslissing-link">
                        <span className="menulink-icoon" style={{ color: cat.kleur }}>
                          <Icoon naam={tool?.icoon ?? cat.icoon} maat={16} />
                        </span>
                        <span className="beslissing-vraag">{vraagVan(item)}</span>
                        {dag && (
                          <span className="statuslabel" style={{ color: kleurVoorSchaal(dag.conditie.score) }}>
                            <span className="statusstip" aria-hidden="true" style={{ background: kleurVoorSchaal(dag.conditie.score) }} />
                            {labelVoor(dag.conditie.score, tool.schaalLabels)}
                          </span>
                        )}
                        {tool && !dag && laden && <span className="statuslabel stil">...</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            {gepland.length > 0 && (
              <div className="beslissingen-gepland">
                <span className="instelhint">{S.beslissingen.inOntwikkeling}</span>
                <div className="binnenkort-chips">
                  {gepland.map((item) => (
                    <span key={item.vraag} className="binnenkort-chip">{item.vraag}</span>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}
      {q && !groepen.some((g) => g.items.some(past)) && (
        <p className="uitleg">{S.beslissingen.geenTreffers}</p>
      )}
    </div>
  );
}
