/**
 * lib/inlineLinks.js
 *
 * De linknotatie voor links midden in lopende tekst (blokken en FAQ),
 * laag D van de SEO-run (v3.19.0 voorstel, gebouwd in v3.20.0 na
 * akkoord). Markdown-achtig en met de hand te schrijven in elke
 * content-string, zonder React of JSX in content/*.js:
 *
 *   [label](tool:fiets-naar-werk)                een link naar een tool
 *   [label](hub:kleding#wat-trek-ik-aan-bij-10-graden)   een hub-anchor
 *   [label](hub:regen)                           een link naar de hubtop
 *
 * Het label is altijd de zichtbare ankertekst; die moet de canonieke
 * vraag of een natuurlijke zinsnede van het DOEL zijn, nooit een
 * kaping van andermans zoekterm (anti-cannibalisatie, zelfde regel
 * als het gerelateerd-blok). Deze module parst alleen; het renderen
 * (TekstMetLinks) en de integriteitscheck (tests/inline-links.test.js)
 * staan los, zodat content en presentatie gescheiden blijven.
 */

const PATROON = /\[([^\]]+)\]\((tool|hub):([a-z0-9-]+)(?:#([a-z0-9-]+))?\)/g;

/**
 * Splitst een tekst in tekstdelen en linkdelen.
 * @param {string} tekst
 * @returns {Array<{type:"tekst", waarde:string} | {type:"tool", toolId:string, label:string} | {type:"anker", categorieId:string, anker:string|null, label:string}>}
 */
export function parseInlineLinks(tekst) {
  if (!tekst) return [];
  const delen = [];
  let laatste = 0;
  for (const match of tekst.matchAll(PATROON)) {
    const [heel, label, soort, id, anker] = match;
    if (match.index > laatste) {
      delen.push({ type: "tekst", waarde: tekst.slice(laatste, match.index) });
    }
    if (soort === "tool") {
      delen.push({ type: "tool", toolId: id, label });
    } else {
      delen.push({ type: "anker", categorieId: id, anker: anker ?? null, label });
    }
    laatste = match.index + heel.length;
  }
  if (laatste < tekst.length) {
    delen.push({ type: "tekst", waarde: tekst.slice(laatste) });
  }
  return delen;
}

/** Alle linkdoelen in een tekst, voor de integriteitscheck. */
export function inlineLinkDoelen(tekst) {
  return parseInlineLinks(tekst).filter((d) => d.type !== "tekst");
}

/**
 * Platte versie van een tekst met inline links: de linknotatie eruit,
 * alleen het zichtbare label blijft staan. Voor structured data
 * (FAQPage-JSON-LD) en andere plekken die geen markup mogen lekken.
 */
export function platteTekst(tekst) {
  if (!tekst) return tekst;
  return parseInlineLinks(tekst)
    .map((d) => (d.type === "tekst" ? d.waarde : d.label))
    .join("");
}
