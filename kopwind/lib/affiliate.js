/**
 * lib/affiliate.js
 *
 * Het affiliate-adviesblok (v3.22.0 "Foehn"). Achtergrond: elke tool
 * heeft al een veld `affiliate` (tot nu toe null). Dit is de plek waar
 * dat veld een vorm krijgt, plus de regels eromheen. Bewust conservatief
 * ingericht, want affiliate raakt drie dingen die voor dit project
 * gevoelig liggen:
 *
 * 1. Vertrouwen. Het blok is tekstueel ADVIES eerst, met de commerciele
 *    link als hulpmiddel, niet andersom. Nooit een banner, nooit
 *    "koop nu". Het advies moet ook zonder de link nuttig zijn.
 * 2. Transparantie (verplicht). Elk blok toont een duidelijke
 *    disclosure dat het een affiliate/partnerlink is. rel="sponsored
 *    nofollow noopener" op elke uitgaande link.
 * 3. Privacy/AVG. Dit zijn gewone uitgaande links, geen tracking
 *    scripts, geen pixels, geen consent-last. Dat is het hele punt van
 *    een linkgebaseerd model boven advertentienetwerken (zie AdSlot,
 *    dat juist WEL consent zou vereisen en daarom leeg blijft).
 *
 * Schema van tool.affiliate (allemaal optioneel; null = geen blok):
 *   {
 *     kop:    { nl, en }   // kop boven het advies
 *     advies: { nl, en }   // 1-3 zinnen tekstueel advies (mag inline
 *                          //   links bevatten, TekstMetLinks rendert)
 *     disclosure: { nl, en } // override; anders de standaard hieronder
 *     items: [ { label:{nl,en}, url, partner } ]  // 1-4 producten/links
 *   }
 *
 * `partner` is puur informatief (bijv. "Praxis") en wordt getoond bij
 * de link zodat de gebruiker weet waar hij heen gaat.
 */

export const AFFILIATE_DISCLOSURE = {
  nl: "Dit blok bevat partnerlinks. Koop je via zo'n link iets, dan kan deze site een kleine vergoeding krijgen, zonder extra kosten voor jou. Het advies hierboven staat los van die vergoeding.",
  en: "This block contains partner links. If you buy through one, this site may earn a small commission at no extra cost to you. The advice above is independent of that commission.",
};

/**
 * Valideert een affiliate-object (voor de test en voor defensief
 * renderen). Geeft een lijst problemen terug; leeg = in orde.
 */
export function affiliateProblemen(toolId, aff) {
  const p = [];
  if (aff == null) return p; // geen blok is prima
  const tweetalig = (v, naam) => {
    if (!v || typeof v.nl !== "string" || typeof v.en !== "string" || !v.nl || !v.en) {
      p.push(`${toolId}: ${naam} moet {nl, en} met beide talen zijn`);
    }
  };
  tweetalig(aff.kop, "kop");
  tweetalig(aff.advies, "advies");
  if (aff.disclosure) tweetalig(aff.disclosure, "disclosure");
  if (!Array.isArray(aff.items) || aff.items.length < 1 || aff.items.length > 4) {
    p.push(`${toolId}: items moet 1 tot 4 links bevatten`);
  } else {
    for (const it of aff.items) {
      tweetalig(it.label, "item.label");
      if (typeof it.url !== "string" || !/^https:\/\//.test(it.url)) {
        p.push(`${toolId}: item.url moet een https-link zijn`);
      }
      if (typeof it.partner !== "string" || !it.partner) {
        p.push(`${toolId}: item.partner (winkelnaam) is verplicht`);
      }
    }
  }
  return p;
}
