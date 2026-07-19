"use client";

import { useState } from "react";
import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { VARIANTEN } from "@/lib/varianten";
import { vindCategorieOpId } from "@/lib/categorieen";
import { BESLISSINGEN } from "@/content/beslissingen";
import { kies } from "@/lib/i18n/locale";
import { PAD } from "@/lib/i18n/paden";
import { S } from "@/lib/strings";
import Icoon from "@/components/Icoon";

/**
 * Keuzehulp-zoeker voor de homepage (v3.26.0, feedback Martijn: het
 * zoeken naar een check hoort niet alleen op alle-keuzehulpen te
 * staan). Zelfde catalogus en zoeklogica als BeslissingenLijst
 * (vraag plus zoektermen), maar compact: bij twee of meer tekens
 * verschijnt een lijstje met directe links. Ankers linken naar de
 * storefront-FAQ (de AnkerOpener klapt die daar open); geplande
 * vragen zonder bestemming blijven buiten beeld, want zoeken is om
 * iets te DOEN.
 */
const MAX_RESULTATEN = 8;

export default function ZoekChecks() {
  const [zoek, setZoek] = useState("");
  const q = zoek.trim().toLowerCase();

  const vraagVan = (item) => {
    if (item.toolId) return TOOLS.find((t) => t.id === item.toolId)?.korteVraag ?? "";
    if (item.variantId) return VARIANTEN.find((v) => v.id === item.variantId)?.vraag ?? "";
    return item.vraag ?? "";
  };
  const doelVan = (item, cat) => {
    if (item.toolId) return `/${TOOLS.find((t) => t.id === item.toolId)?.slug}`;
    if (item.variantId) return `/${VARIANTEN.find((v) => v.id === item.variantId)?.slug}`;
    if (item.anker && cat) return `/${cat.slug}#${item.anker}`;
    return null;
  };

  const resultaten = [];
  if (q.length >= 2) {
    for (const groep of BESLISSINGEN) {
      const cat = vindCategorieOpId(groep.id);
      for (const item of groep.items) {
        const vraag = vraagVan(item);
        const doel = doelVan(item, cat);
        if (!doel) continue;
        const raak =
          vraag.toLowerCase().includes(q) ||
          (item.zoek ?? []).some((w) => w.toLowerCase().includes(q) || q.includes(w.toLowerCase()));
        if (raak) resultaten.push({ vraag, doel, cat, icoon: TOOLS.find((t) => t.id === item.toolId)?.icoon ?? cat?.icoon });
        if (resultaten.length >= MAX_RESULTATEN) break;
      }
      if (resultaten.length >= MAX_RESULTATEN) break;
    }
  }

  return (
    <div className="zoekchecks">
      <input
        type="search"
        value={zoek}
        onChange={(e) => setZoek(e.target.value)}
        placeholder={S.beslissingen.zoekPlaceholder}
        aria-label={S.beslissingen.zoekLabel}
      />
      {q.length >= 2 && (
        <div className="zoekchecks-uit paneel">
          {resultaten.length > 0 ? (
            <ul className="zoekchecks-lijst">
              {resultaten.map((r) => (
                <li key={r.doel}>
                  <Link href={r.doel} className="beslissing-link">
                    <span className="menulink-icoon" style={{ color: r.cat?.kleur }}>
                      <Icoon naam={r.icoon} maat={16} />
                    </span>
                    <span className="beslissing-vraag">{r.vraag}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="zoekchecks-leeg">
              {kies({ nl: "Niets gevonden voor", en: "Nothing found for" })} "{zoek.trim()}".
            </p>
          )}
          <Link href={PAD.alleChecks} className="zoekchecks-alle">
            {S.hub.alleChecksTitel} <Icoon naam="pijl" maat={13} />
          </Link>
        </div>
      )}
    </div>
  );
}
