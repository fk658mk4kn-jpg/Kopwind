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
  {
    id: "slippers",
    ouderId: "wat-trek-ik-aan",
    slug: kies({ nl: "slippers-weer", en: "flip-flops-weather" }),
    vraag: kies({ nl: "Is het slippersweer vandaag?", en: "Is it flip-flop weather today?" }),
    bijgewerkt: "2026-07-17",
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

/**
 * Variant-verdict (v3.24.0 "Khamsin"): het eigen ja/nee-antwoord van
 * een kledingvariant, afgeleid uit het dagobject van de oudercheck.
 * Aanleiding (feedback): "Moet ik een jas aan?" toonde het generieke
 * kledingadvies zonder eigen antwoord of statusstip.
 *
 * De logica leunt op laagIndex, de middag-hoofdlaag die de kledingcheck
 * zelf al kiest (0 korte broek en T-shirt, 1 T-shirt met dun laagje,
 * 2 trui, 3 jas, 4 winterjas). Zo kan het variant-antwoord nooit
 * tegenspreken wat de check adviseert, en volgen de persoonlijke
 * grenzen (warmGrens/koudGrens) automatisch mee, want die zitten al in
 * de laagkeuze verwerkt.
 *
 * Retour is compatibel met de stip-weergave: { ja, conditie: { score,
 * redenen }, variantLabel, zin }. LET OP: de score is een PIJN-score
 * (0..100, laag is goed) omdat schaalVoor/kleurVoorSchaal daarop
 * rekenen. Comfort-semantiek: gunstig antwoord 8 (ideaal, groen),
 * twijfel 38 (twijfelachtig, amber), ongunstig 55 (matig), winterjas
 * 62 (zeer slecht). Jas aan is 38: informatief, geen ramp.
 */
export function variantVerdict(variantId, dag) {
  if (!dag?.outfit) return null;
  const laag = dag.outfit.laagIndex;
  const regen = Boolean(dag.outfit.regen);
  if (typeof laag !== "number") return null;

  let ja = null; // true, false of "twijfel"
  let score;
  let zin;

  if (variantId === "korte-broek") {
    ja = laag === 0 ? true : laag === 1 ? "twijfel" : false;
    score = laag === 0 ? 8 : laag === 1 ? 38 : 55;
    zin =
      ja === true
        ? kies({ nl: "Ja, korte broek kan prima.", en: "Yes, shorts are fine." })
        : ja === "twijfel"
          ? kies({ nl: "Twijfelgeval: T-shirtweer, maar de ochtend is fris.", en: "Borderline: T-shirt weather, but the morning is fresh." })
          : kies({ nl: "Nee, vandaag liever een lange broek.", en: "No, long trousers today." });
  } else if (variantId === "slippers") {
    ja = laag === 0 && !regen ? true : (laag === 0 && regen) || (laag === 1 && !regen) ? "twijfel" : false;
    score = ja === true ? 8 : ja === "twijfel" ? 38 : 55;
    zin =
      ja === true
        ? kies({ nl: "Ja, slippers kunnen prima vandaag.", en: "Yes, flip-flops are fine today." })
        : ja === "twijfel"
          ? regen
            ? kies({ nl: "Twijfelgeval: warm genoeg, maar natte zolen zijn glad.", en: "Borderline: warm enough, but wet soles are slippery." })
            : kies({ nl: "Twijfelgeval: kan in de middag, de randen van de dag zijn fris.", en: "Borderline: fine in the afternoon, the edges of the day are fresh." })
          : kies({ nl: "Nee, vandaag liever dichte schoenen.", en: "No, closed shoes today." });
  } else if (variantId === "t-shirt") {
    const twijfel = laag === 2 && (dag.outfit.warmsteGevoel ?? -99) >= 16;
    ja = laag <= 1 ? true : twijfel ? "twijfel" : false;
    score = laag <= 1 ? 8 : twijfel ? 38 : 55;
    zin =
      ja === true
        ? kies({ nl: "Ja, het is T-shirtweer.", en: "Yes, it's T-shirt weather." })
        : ja === "twijfel"
          ? kies({ nl: "Twijfelgeval: de middagpiek haalt het net, neem een laagje mee.", en: "Borderline: the afternoon peak just makes it, bring a layer." })
          : kies({ nl: "Nee, vandaag is het geen T-shirtweer.", en: "No, not T-shirt weather today." });
  } else if (variantId === "jas") {
    ja = laag >= 3 || (laag === 2 && regen) ? true : laag === 2 ? "twijfel" : false;
    score = laag >= 4 ? 62 : ja === true ? 38 : ja === "twijfel" ? 30 : 8;
    zin =
      ja === true
        ? regen && laag < 4
          ? kies({ nl: "Ja, jas aan: het is fris en er valt regen.", en: "Yes, coat on: it's fresh and rain is falling." })
          : kies({ nl: "Ja, vandaag wil je een jas aan.", en: "Yes, you'll want a coat today." })
        : ja === "twijfel"
          ? kies({ nl: "Twijfelgeval: een trui volstaat meestal.", en: "Borderline: a jumper usually does it." })
          : kies({ nl: "Nee, het kan zonder jas.", en: "No, you can go without a coat." });
  } else {
    return null;
  }

  return {
    ja,
    conditie: { score, redenen: [] },
    variantLabel:
      ja === true
        ? kies({ nl: "Ja", en: "Yes" })
        : ja === "twijfel"
          ? kies({ nl: "Twijfel", en: "Borderline" })
          : kies({ nl: "Nee", en: "No" }),
    zin,
  };
}
