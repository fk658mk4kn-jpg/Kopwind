"use client";

import { useState } from "react";
import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { VARIANTEN } from "@/lib/varianten";
import { S } from "@/lib/strings";
import Icoon from "./Icoon";

/**
 * De doorzoekbare catalogus van /alle-checks. Rendert server-side mee
 * (SEO leest alle vragen), filtert client-side op vraag plus synoniemen.
 * Live checks zijn klikbaar met hun eigen icoon; geplande vragen staan
 * er grijs bij als eerlijke backlog.
 */
export default function BeslissingenLijst({ categorieen }) {
  const [zoek, setZoek] = useState("");
  const q = zoek.trim().toLowerCase();

  const past = (item) =>
    !q ||
    item.vraag.toLowerCase().includes(q) ||
    (item.zoek ?? []).some((w) => w.toLowerCase().includes(q) || q.includes(w.toLowerCase()));

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
      </div>
      {categorieen.map((cat) => {
        const items = cat.items.filter(past);
        if (!items.length) return null;
        return (
          <section key={cat.id} className="beslissingen-groep">
            <h2>{cat.titel}</h2>
            <ul className="beslissingen-lijst">
              {items.map((item) => {
                const tool = item.toolId ? TOOLS.find((t) => t.id === item.toolId) : null;
                const variant = item.variantId ? VARIANTEN.find((v) => v.id === item.variantId) : null;
                const doel = tool ? `/${tool.slug}` : variant ? `/${variant.slug}` : null;
                if (doel) {
                  return (
                    <li key={item.vraag}>
                      <Link href={doel} className="beslissing-link">
                        <span className="menulink-icoon" style={{ color: tool?.kleur ?? "#1B2733" }}>
                          <Icoon naam={tool?.icoon ?? "shirt"} maat={16} />
                        </span>
                        {item.vraag}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={item.vraag} className="beslissing-binnenkort">
                    <span>{item.vraag}</span>
                    <span className="badge klein stil">{S.hub.binnenkort}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      {q && !categorieen.some((c) => c.items.some(past)) && (
        <p className="uitleg">{S.beslissingen.geenTreffers}</p>
      )}
    </div>
  );
}
