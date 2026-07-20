/**
 * lib/steden/serverAntwoord.js
 *
 * De pure kern van het server-antwoordblok op de stadpagina's
 * (v3.27.0 "Solano", audit plus akkoord eigenaar): vertaalt een
 * overlay-resultaat naar de renderdata voor het blok onder de H1.
 * Gescheiden van de servercomponent zodat dit onder test staat met
 * synthetische weerdata; de component zelf is alleen fetch plus
 * opmaak.
 *
 * Waarom dit blok bestaat: LocatieTool en FietsTool zijn client
 * components, dus het verdict stond nooit in de server-HTML. Voor
 * klassieke snippets en AI-citeerbaarheid hoort het antwoord in de
 * ruwe HTML, met een eerlijk tijdstempel en de kanttekening dat het
 * op standaardinstellingen rekent.
 */

import { schaalVoor, labelVoor, kleurVoorSchaal } from "../engine/schaal.js";

export function bouwStadAntwoord(tool, hourly, nu) {
  if (typeof tool?.overlay !== "function" || !hourly) return null;
  let dag;
  try {
    const defaults = tool.scoreConfig?.defaults ?? tool.instellingen?.defaults;
    dag = tool.overlay(hourly, nu, defaults)?.dagen?.[0] ?? null;
  } catch {
    return null;
  }
  if (!dag?.conditie) return null;
  const schaal = schaalVoor(dag.conditie.score);
  return {
    label: labelVoor(dag.conditie.score, tool.schaalLabels),
    kleur: kleurVoorSchaal(schaal.id),
    zin: dag.antwoord?.zin ?? dag.status?.zin ?? "",
    metric: dag.metric?.zin ?? null,
  };
}

/** De klok van de plek zelf: Vercel draait UTC, de steden niet. */
export function nuInNederland() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Amsterdam" }));
}

export function fmtStempel(nu) {
  return `${String(nu.getHours()).padStart(2, "0")}:${String(nu.getMinutes()).padStart(2, "0")}`;
}
