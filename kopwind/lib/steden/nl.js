/**
 * lib/steden/nl.js
 *
 * Stedenlijst voor de programmatische pagina's (locale NL, i18n-naad §14:
 * een VS-locale krijgt later zijn eigen lijst). Ligging stuurt de per-stad
 * tekstvariatie: kust, rivier, veluwe, heuvels, polder of binnenland.
 */

export const STEDEN = [
  { naam: "Amsterdam", slug: "amsterdam", lat: 52.3728, lon: 4.8936, provincie: "Noord-Holland", ligging: "binnenland" },
  { naam: "Rotterdam", slug: "rotterdam", lat: 51.9225, lon: 4.4792, provincie: "Zuid-Holland", ligging: "rivier" },
  { naam: "Den Haag", slug: "den-haag", lat: 52.0705, lon: 4.3007, provincie: "Zuid-Holland", ligging: "kust" },
  { naam: "Utrecht", slug: "utrecht", lat: 52.0907, lon: 5.1214, provincie: "Utrecht", ligging: "binnenland" },
  { naam: "Eindhoven", slug: "eindhoven", lat: 51.4416, lon: 5.4697, provincie: "Noord-Brabant", ligging: "binnenland" },
  { naam: "Groningen", slug: "groningen", lat: 53.2194, lon: 6.5665, provincie: "Groningen", ligging: "polder" },
  { naam: "Tilburg", slug: "tilburg", lat: 51.5606, lon: 5.0919, provincie: "Noord-Brabant", ligging: "binnenland" },
  { naam: "Almere", slug: "almere", lat: 52.3508, lon: 5.2647, provincie: "Flevoland", ligging: "polder" },
  { naam: "Breda", slug: "breda", lat: 51.5719, lon: 4.7683, provincie: "Noord-Brabant", ligging: "binnenland" },
  { naam: "Nijmegen", slug: "nijmegen", lat: 51.8126, lon: 5.8372, provincie: "Gelderland", ligging: "rivier" },
  { naam: "Enschede", slug: "enschede", lat: 52.2215, lon: 6.8937, provincie: "Overijssel", ligging: "binnenland" },
  { naam: "Haarlem", slug: "haarlem", lat: 52.3874, lon: 4.6462, provincie: "Noord-Holland", ligging: "kust" },
  { naam: "Arnhem", slug: "arnhem", lat: 51.9851, lon: 5.8987, provincie: "Gelderland", ligging: "veluwe" },
  { naam: "Amersfoort", slug: "amersfoort", lat: 52.1561, lon: 5.3878, provincie: "Utrecht", ligging: "binnenland" },
  { naam: "Zaanstad", slug: "zaanstad", lat: 52.4574, lon: 4.751, provincie: "Noord-Holland", ligging: "polder" },
  { naam: "'s-Hertogenbosch", slug: "s-hertogenbosch", lat: 51.6978, lon: 5.3037, provincie: "Noord-Brabant", ligging: "binnenland" },
  { naam: "Zwolle", slug: "zwolle", lat: 52.5168, lon: 6.083, provincie: "Overijssel", ligging: "rivier" },
  { naam: "Zoetermeer", slug: "zoetermeer", lat: 52.0607, lon: 4.494, provincie: "Zuid-Holland", ligging: "polder" },
  { naam: "Leiden", slug: "leiden", lat: 52.1601, lon: 4.497, provincie: "Zuid-Holland", ligging: "kust" },
  { naam: "Leeuwarden", slug: "leeuwarden", lat: 53.2012, lon: 5.7999, provincie: "Friesland", ligging: "polder" },
  { naam: "Maastricht", slug: "maastricht", lat: 50.8514, lon: 5.691, provincie: "Limburg", ligging: "heuvels" },
  { naam: "Dordrecht", slug: "dordrecht", lat: 51.8133, lon: 4.6901, provincie: "Zuid-Holland", ligging: "rivier" },
  { naam: "Ede", slug: "ede", lat: 52.0468, lon: 5.664, provincie: "Gelderland", ligging: "veluwe" },
  { naam: "Alphen aan den Rijn", slug: "alphen-aan-den-rijn", lat: 52.1263, lon: 4.6575, provincie: "Zuid-Holland", ligging: "polder" },
  { naam: "Emmen", slug: "emmen", lat: 52.785, lon: 6.8976, provincie: "Drenthe", ligging: "binnenland" },
  { naam: "Venlo", slug: "venlo", lat: 51.3704, lon: 6.1724, provincie: "Limburg", ligging: "rivier" },
  { naam: "Delft", slug: "delft", lat: 52.0116, lon: 4.3571, provincie: "Zuid-Holland", ligging: "kust" },
  { naam: "Deventer", slug: "deventer", lat: 52.266, lon: 6.1552, provincie: "Overijssel", ligging: "rivier" },
  { naam: "Helmond", slug: "helmond", lat: 51.4793, lon: 5.657, provincie: "Noord-Brabant", ligging: "binnenland" },
  { naam: "Oss", slug: "oss", lat: 51.765, lon: 5.518, provincie: "Noord-Brabant", ligging: "rivier" },
  { naam: "Hilversum", slug: "hilversum", lat: 52.2292, lon: 5.1669, provincie: "Noord-Holland", ligging: "binnenland" },
  { naam: "Heerlen", slug: "heerlen", lat: 50.8882, lon: 5.9795, provincie: "Limburg", ligging: "heuvels" },
  { naam: "Amstelveen", slug: "amstelveen", lat: 52.3114, lon: 4.8701, provincie: "Noord-Holland", ligging: "polder" },
  { naam: "Apeldoorn", slug: "apeldoorn", lat: 52.2112, lon: 5.9699, provincie: "Gelderland", ligging: "veluwe" },
  { naam: "Alkmaar", slug: "alkmaar", lat: 52.6324, lon: 4.7534, provincie: "Noord-Holland", ligging: "kust" },
];

export function vindStad(slug) {
  return STEDEN.find((s) => s.slug === slug) ?? null;
}

/** Dichtstbijzijnde stad bij een coordinaat (stad volstaat voor de hub). */
export function dichtstbijzijndeStad(lat, lon) {
  let beste = null;
  let besteAfstand = Infinity;
  for (const stad of STEDEN) {
    const d = (stad.lat - lat) ** 2 + (stad.lon - lon) ** 2;
    if (d < besteAfstand) {
      besteAfstand = d;
      beste = stad;
    }
  }
  return beste;
}
