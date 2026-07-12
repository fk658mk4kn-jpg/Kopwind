"use client";

import { fmtCijfer } from "@/lib/format";

/**
 * Het cijfer-oordeel als badge: label plus rapportcijfer in tabulaire
 * cijfers. Kleurklasse volgt de pijnscore (goed, matig, slecht), zodat
 * elke tool hetzelfde oordeelbeeld deelt.
 */
export default function VerdictBadge({ score, label }) {
  const kleur = score >= 60 ? "rood" : score >= 30 ? "oranje" : "groen";
  return (
    <span className={"badge " + kleur}>
      {label} <span className="badge-cijfer">{fmtCijfer(score)}</span>
    </span>
  );
}
