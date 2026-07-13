/**
 * lib/varianten.js
 *
 * Vraagpagina's (v3.4.0 "Ponente"): lichte varianten op een bestaande
 * tool. Elke variant is een eigen SEO-landingspagina (eigen slug, titel
 * en content) die de check van de oudertool embedt. Geen eigen engine:
 * het antwoord komt live uit de ouder; de content beantwoordt de
 * specifieke zoekvraag.
 */

import { kies } from "./i18n/locale.js";

export const VARIANTEN = [
  {
    id: "korte-broek",
    ouderId: "wat-trek-ik-aan",
    slug: kies({ nl: "korte-broek-weer", en: "shorts-weather" }),
    vraag: kies({ nl: "Kan ik een korte broek aan vandaag?", en: "Can I wear shorts today?" }),
    bijgewerkt: "2026-07-13",
  },
  {
    id: "jas",
    ouderId: "wat-trek-ik-aan",
    slug: kies({ nl: "jas-aan-of-uit", en: "coat-or-no-coat" }),
    vraag: kies({ nl: "Moet ik een jas aan vandaag?", en: "Do I need a coat today?" }),
    bijgewerkt: "2026-07-13",
  },
  {
    id: "t-shirt",
    ouderId: "wat-trek-ik-aan",
    slug: kies({ nl: "t-shirt-weer", en: "t-shirt-weather" }),
    vraag: kies({ nl: "Is het T-shirtweer vandaag?", en: "Is it T-shirt weather today?" }),
    bijgewerkt: "2026-07-13",
  },
];

export function vindVariant(slug) {
  return VARIANTEN.find((v) => v.slug === slug) ?? null;
}

/**
 * Slug naar tool of variant-pseudo-tool. Een variant erft alles van de
 * ouder (engine, instellingen, schaal), maar draagt eigen slug, vraag
 * en bijgewerkt-datum, plus templateId voor de stad-titels. LocatieTool
 * en StemPeiling blijven op het ouder-id draaien.
 */
export function maakPseudoTool(variant, ouder) {
  return {
    ...ouder,
    slug: variant.slug,
    naam: variant.vraag,
    korteVraag: variant.vraag,
    bijgewerkt: variant.bijgewerkt,
    templateId: variant.id,
    isVariant: true,
  };
}
