/**
 * lib/rekenhulpen.js
 *
 * Register van de kalender- en rekenpagina's (v3.37.0 "Föhn"). Elke
 * pagina heeft een eigen statische route in app/<slug>; dit register
 * voedt de hub, het menu, de sitemap en de tests. Alleen Nederlands.
 */

export const REKENHULPEN = [
  { id: "weeknummer", slug: "welke-week-is-het", titel: "Weeknummer", groep: "kalender" },
  { id: "feestdagen", slug: "feestdagen", titel: "Feestdagen", groep: "kalender" },
  { id: "schoolvakanties", slug: "schoolvakanties", titel: "Schoolvakanties", groep: "kalender" },
  { id: "werkdagen", slug: "werkdagen", titel: "Werkdagen", groep: "kalender" },
  { id: "dagen-tussen", slug: "dagen-tussen-twee-datums", titel: "Dagen tussen datums", groep: "reken" },
  { id: "verjaardag", slug: "hoeveel-dagen-tot-mijn-verjaardag", titel: "Mijn verjaardag", groep: "reken" },
  { id: "leeftijd", slug: "leeftijd-berekenen", titel: "Leeftijd berekenen", groep: "reken" },
  { id: "noorderlicht", slug: "kan-ik-het-noorderlicht-zien", titel: "Noorderlicht", groep: "lucht" },
  { id: "dagen-langer", slug: "wanneer-worden-de-dagen-weer-langer", titel: "Dagen langer", groep: "lucht" },
  { id: "vrije-dag", slug: "is-het-vandaag-een-feestdag", titel: "Feestdag vandaag?", groep: "kalender" },
  { id: "ramadan", slug: "wanneer-is-het-ramadan", titel: "Ramadan", groep: "kalender" },
  // v3.38.0: geld, water en weer.
  { id: "stroomprijs", slug: "wanneer-is-stroom-het-goedkoopst", titel: "Goedkope stroom", groep: "geld" },
  { id: "vakantiegeld", slug: "wanneer-krijg-ik-vakantiegeld", titel: "Vakantiegeld", groep: "geld" },
  { id: "belasting", slug: "uiterste-datum-belastingaangifte", titel: "Belastingaangifte", groep: "geld" },
  { id: "getij", slug: "eb-en-vloed", titel: "Eb en vloed", groep: "water" },
  { id: "zeewater", slug: "zeewatertemperatuur", titel: "Zeewatertemperatuur", groep: "water" },
  { id: "hittegolf", slug: "komt-er-een-hittegolf", titel: "Hittegolf", groep: "weer" },
  { id: "onweer", slug: "gaat-het-onweren", titel: "Onweer", groep: "weer" },
  // v3.39.0: betaaldata, kalender, lucht en uitjes.
  { id: "toeslagen", slug: "wanneer-wordt-de-toeslag-uitbetaald", titel: "Betaaldatum toeslagen", groep: "geld" },
  { id: "kinderbijslag", slug: "wanneer-wordt-de-kinderbijslag-uitbetaald", titel: "Kinderbijslag", groep: "geld" },
  { id: "minimumloon", slug: "minimumloon", titel: "Minimumloon", groep: "geld" },
  { id: "aow", slug: "wanneer-krijg-ik-aow", titel: "AOW-leeftijd", groep: "geld" },
  { id: "salaris", slug: "wanneer-krijg-ik-mijn-salaris", titel: "Salarisdag", groep: "geld" },
  { id: "uren", slug: "uren-berekenen", titel: "Uren berekenen", groep: "reken" },
  { id: "schrikkeljaar", slug: "is-het-een-schrikkeljaar", titel: "Schrikkeljaar", groep: "kalender" },
  { id: "dag-van-jaar", slug: "welke-dag-van-het-jaar-is-het", titel: "Dag van het jaar", groep: "kalender" },
  { id: "verduistering", slug: "volgende-zonsverduistering", titel: "Verduisteringen", groep: "lucht" },
  { id: "keukenhof", slug: "wanneer-is-de-keukenhof-open", titel: "Keukenhof", groep: "uit" },
  // v3.40.0: rekenhulpen, zorg en de jaarwisseling.
  { id: "procenten", slug: "procenten-berekenen", titel: "Procenten berekenen", groep: "reken" },
  { id: "btw", slug: "btw-berekenen", titel: "Btw berekenen", groep: "reken" },
  { id: "datum-berekenen", slug: "datum-berekenen", titel: "Datum plus dagen", groep: "reken" },
  { id: "romeins", slug: "romeinse-cijfers", titel: "Romeinse cijfers", groep: "reken" },
  { id: "zorg-overstappen", slug: "zorgverzekering-overstappen", titel: "Zorgverzekering overstappen", groep: "geld" },
  { id: "eigen-risico", slug: "eigen-risico", titel: "Eigen risico", groep: "geld" },
  { id: "kilometervergoeding", slug: "kilometervergoeding", titel: "Kilometervergoeding", groep: "geld" },
  { id: "vakantiedagen", slug: "vakantiedagen-berekenen", titel: "Vakantiedagen", groep: "geld" },
  { id: "belastingteruggave", slug: "wanneer-krijg-ik-mijn-belastingteruggave", titel: "Belastingteruggave", groep: "geld" },
  { id: "vuurwerk", slug: "vuurwerk-afsteken", titel: "Vuurwerk", groep: "uit" },
];

export const REKEN_GROEPEN = [
  { id: "kalender", titel: "Kalender" },
  { id: "reken", titel: "Rekenhulpen" },
  { id: "geld", titel: "Geld en werk" },
  { id: "lucht", titel: "Zon, maan en sterren" },
  { id: "water", titel: "Zee en water" },
  { id: "weer", titel: "Weer" },
  { id: "uit", titel: "Uitjes en seizoen" },
];

export const ANTWOORDEN_HUB_PAD = "/handige-antwoorden";

export function vindRekenhulp(id) {
  return REKENHULPEN.find((r) => r.id === id) ?? null;
}

export function rekenPad(id) {
  return `/${vindRekenhulp(id).slug}`;
}
