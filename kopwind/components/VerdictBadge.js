"use client";

import { schaalVoor, kleurVoorSchaal } from "@/lib/engine/schaal";

/**
 * Het verdict in woorden (v3.0.0): eerst Ja of Nee, dan het schaalwoord
 * (Zeer slecht, Matig, Twijfelachtig, Goed, Ideaal) in een kleurbadge.
 * Voor tools zonder kan-vraag (ja is null) alleen het schaalwoord.
 * De pijnscore blijft intern de motor; hij komt alleen niet meer in beeld.
 */
export default function VerdictBadge({ score, ja = null }) {
  const s = schaalVoor(score);
  const kleur = kleurVoorSchaal(s.id);
  return (
    <span className={"badge " + kleur}>
      {ja === null ? s.label : ja ? "Ja" : "Nee"}
      {ja !== null && <span className="badge-woord">{s.label}</span>}
    </span>
  );
}
