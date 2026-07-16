"use client";

import { useState } from "react";
import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { VARIANTEN } from "@/lib/varianten";
import { vindCategorieOpId } from "@/lib/categorieen";
import { schaalVoor, kleurVoorSchaal, labelVoor } from "@/lib/engine/schaal";
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
        // Alleen echte checks (tool of variant) staan als rij met stip;
        // vragen met een storefront-antwoord (anker) en geplande vragen
        // delen dezelfde chip-opmaak eronder (feedback juli 2026: een
        // anker-rij oogde als een live check die er niet is).
        const live = items.filter((i) => i.toolId || i.variantId);
        const ankers = items.filter((i) => i.anker && !i.toolId && !i.variantId);
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
                  const doel = tool ? `/${tool.slug}` : variant ? `/${variant.slug}` : null;
                  if (!doel) return null;
                  const dag = tool && dagen ? dagen[tool.id] : null;
                  // Stoplicht: kleurVoorSchaal geeft een klasse (groen,
                  // oranje of rood) bij het schaal-id; de stip kleurt mee
                  // via currentColor. Bugfix juli 2026: dit ging eerder
                  // als klassenaam-in-een-style, waardoor de stip
                  // onzichtbaar was.
                  const klasse = dag ? kleurVoorSchaal(schaalVoor(dag.conditie.score).id) : null;
                  return (
                    <li key={doel}>
                      <Link href={doel} className="beslissing-link">
                        <span className="menulink-icoon" style={{ color: cat.kleur }}>
                          <Icoon naam={tool?.icoon ?? cat.icoon} maat={16} />
                        </span>
                        <span className="beslissing-vraag">{vraagVan(item)}</span>
                        {dag && (
                          <span className={"statuslabel " + klasse} title={labelVoor(dag.conditie.score, tool.schaalLabels)}>
                            <span className="statusstip" role="img" aria-label={labelVoor(dag.conditie.score, tool.schaalLabels)} />
                          </span>
                        )}
                        {tool && !dag && laden && (
                          <span className="statuslabel stil">
                            <span className="statusstip" aria-hidden="true" />
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
            {(ankers.length > 0 || gepland.length > 0) && (
              <div className="beslissingen-gepland">
                <div className="binnenkort-chips">
                  {ankers.map((item) => {
                    const ankerCat = vindCategorieOpId(item.ankerCategorie);
                    if (!ankerCat) return null;
                    return (
                      <Link
                        key={item.vraag}
                        href={`/${ankerCat.slug}#${item.anker}`}
                        className="binnenkort-chip anker-chip"
                      >
                        {vraagVan(item)}
                      </Link>
                    );
                  })}
                  {gepland.map((item) => (
                    <span key={item.vraag} className="binnenkort-chip" title={S.beslissingen.inOntwikkeling}>
                      {item.vraag}
                    </span>
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
