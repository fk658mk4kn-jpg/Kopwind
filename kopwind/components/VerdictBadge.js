"use client";

import { schaalVoor, labelVoor, kleurVoorSchaal } from "@/lib/engine/schaal";

/**
 * Het verdict in de eigen woorden van de tool (v3.1.0): "Hang maar op",
 * "Goed te doen", "Heerlijk terrasweer". Het label is het antwoord; een
 * losse Ja/Nee-badge ervoor was dubbelop. De vijfschaal blijft de motor
 * eronder en bepaalt de kleur.
 */
export default function VerdictBadge({ score, labels }) {
  const kleur = kleurVoorSchaal(schaalVoor(score).id);
  return <span className={"badge " + kleur}>{labelVoor(score, labels)}</span>;
}
