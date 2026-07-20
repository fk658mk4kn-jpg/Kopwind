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

/**
 * Deeplink-plumbing (v3.31.0). Achtergrond: de site heeft nu een echt
 * bol.com Partner-account. Zodra Martijn zijn SiteId invult (via de
 * omgevingsvariabele NEXT_PUBLIC_BOL_SITE_ID, of hieronder hardcoded),
 * worden alle bol-links in de adviesblokken automatisch getrackte
 * partnerlinks. Tot die tijd blijven het gewone, werkende bol-links
 * (de bezoeker merkt niets, er wordt alleen nog geen commissie geteld).
 *
 * De tool-bestanden zetten in hun affiliate-blok een GEWONE bol-zoek-URL
 * (https://www.bol.com/nl/nl/s/?searchtext=...). Het ombouwen naar een
 * partnerlink gebeurt op een centrale plek (AdviesBlok via metPartnerlink),
 * met de tool-id als subid, zodat je in het bol-dashboard per check ziet
 * wat er converteert. Zo blijven de tools schoon en staat de tracking op
 * een plek.
 */

// Bol SiteId van kanhetvandaag.nl (registratie 18-07-2026). Via
// NEXT_PUBLIC_BOL_SITE_ID in Vercel te overschrijven; de fallback zorgt
// dat de links ook zonder env meteen tracken.
export const BOL_SITE_ID =
  (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_BOL_SITE_ID) || "1532808";

// TradeTracker affiliate-id van Martijn (User ID). De campagne- en
// materiaal-id's zijn per campagne en vereisen eerst aanmelding plus
// activatie van de webservice; die vul je pas in als je zover bent.
export const TRADETRACKER_AFFILIATE_ID = "308800";

/**
 * Bouwt een bol-partnerlink rond een bol-URL. Zonder SiteId geeft hij
 * de originele bol-URL terug (werkende, ongetrackte link).
 */
export function bolLink(bolUrl, subid = "", naam = "kanhetvandaag", siteId = BOL_SITE_ID) {
  if (!/^https:\/\/(www\.)?bol\.com\//.test(bolUrl)) return bolUrl;
  if (!siteId) return bolUrl;
  const q = (v) => encodeURIComponent(v);
  return (
    "https://partner.bol.com/click/click?p=1&t=url" +
    `&s=${q(siteId)}&url=${q(bolUrl)}&f=PF` +
    `&subid=${q(subid)}&name=${q(naam || subid || "kanhetvandaag")}`
  );
}

/**
 * TradeTracker-deeplink (upgrade-pad voor niche-categorieen als verf,
 * tuin, fiets en sportkleding, waar TT een hogere commissie en langere
 * cookie geeft dan bol). Werkt pas als je je voor de campagne hebt
 * aangemeld en de campaign- en material-id kent. Zonder die id's geeft
 * hij de doel-URL onveranderd terug.
 */
export function ttLink({ campaign, material, doelUrl, subid = "" }) {
  if (!campaign || !material || !doelUrl) return doelUrl || "";
  const q = (v) => encodeURIComponent(v);
  return (
    `https://tc.tradetracker.net/?c=${q(campaign)}&m=${q(material)}` +
    `&a=${TRADETRACKER_AFFILIATE_ID}&r=${q(subid)}&u=${q(doelUrl)}`
  );
}

/**
 * Verrijkt de items van een affiliate-blok met partnertracking. Nu
 * alleen voor bol-links (de enige waarvoor we een werkend account plus
 * formaat hebben). De subid wordt de tool-id.
 */
export function metPartnerlink(items, toolId = "") {
  if (!Array.isArray(items)) return items;
  return items.map((it) => ({ ...it, url: bolLink(it.url, toolId, toolId) }));
}
