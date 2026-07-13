"use client";

import { S } from "@/lib/strings";

/**
 * De weerfactoren achter het oordeel als balkjes (v3.5.0 "Tramontane").
 * Elke balk toont hoe gunstig een factor nu is; het percentage ernaast
 * is het gewicht in het oordeel. Kleur loopt van rood (ongunstig) via
 * oranje naar groen (gunstig), zodat je in een oogopslag ziet wat
 * meezit en wat tegenzit.
 */
function balkKleur(score) {
  if (score >= 66) return "var(--groen)";
  if (score >= 40) return "var(--oranje, #C25E00)";
  return "var(--rood, #B3261E)";
}

export default function FactorBalken({ factoren }) {
  if (!factoren?.length) return null;
  return (
    <div className="factorbalken">
      <h3 className="factorbalken-kop">{S.factoren.kop}</h3>
      <ul className="factorbalken-lijst">
        {factoren.map((f) => (
          <li key={f.id} className="factorbalk">
            <span className="factorbalk-naam">{S.factoren[f.id] ?? f.id}</span>
            <span className="factorbalk-spoor" aria-hidden="true">
              <span
                className="factorbalk-vulling"
                style={{ width: `${f.score}%`, background: balkKleur(f.score) }}
              />
            </span>
            <span className="factorbalk-gewicht">{f.gewicht}%</span>
          </li>
        ))}
      </ul>
      <p className="factorbalken-uitleg">{S.factoren.uitleg}</p>
    </div>
  );
}
