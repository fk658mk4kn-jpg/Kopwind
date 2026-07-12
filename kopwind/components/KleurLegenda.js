"use client";

import { rampGradient } from "@/lib/engine/kleuren";

/**
 * Legenda per tool: benoemt wat de kleurramp betekent, zodat kleur nooit
 * de enige drager van betekenis is. Zelfde ramp, per tool eigen woorden.
 */
export default function KleurLegenda({ soort, links, rechts }) {
  return (
    <div className="kleurlegenda" role="img" aria-label={`Legenda: ${links} tot ${rechts}`}>
      <span>{links}</span>
      <span className="legenda-balk" style={{ background: rampGradient(soort) }} />
      <span>{rechts}</span>
    </div>
  );
}
