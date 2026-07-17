/**
 * lib/steden/stadTemplates.js
 *
 * Alle per-stad SEO-teksten op een centrale plek (v3.23.0 "Boreas").
 * Aanleiding: STAD_TEMPLATES leefde in app/[tool]/[stad]/page.js en
 * dekte 7 van de 24 tools; de fallback pakte letterlijk het
 * was-drogen-template, waardoor ~200 stadpagina's (hardloopweer,
 * strand, heel batch 3, winter) de title, description EN h1 van de
 * wascheck droegen. Nu:
 *
 * - STAD_TEMPLATES dekt alle 24 tools, tweetalig, met een eigen
 *   title/description/h1-formule per tool.
 * - titelVoor() heeft een GENERIEK vangnet dat uit de tool zelf put
 *   (navLabel, korteVraag) en dus nooit meer andermans tekst leent.
 *   Een test (tests/stad-templates.test.js) dwingt af dat het vangnet
 *   in de praktijk ongebruikt blijft.
 * - ANKER_TERM levert de korte zoekterm-kern per tool ("Terrasweer",
 *   "Hooikoorts") voor de stedenknoppen op de toolpagina: ankertekst
 *   wordt "{term} {stad}", wat sterker is dan alleen de stadsnaam en
 *   natuurlijker dan de volledige vraagzin twaalf keer herhaald.
 *
 * De RUW-varianten ({nl, en}) staan er zodat de test beide talen kan
 * valideren zonder subprocess; de gebakken exports gaan door kies().
 */

import { kies } from "../i18n/locale.js";

export const STAD_TEMPLATES_RUW = {
  nl: {
    "fiets-naar-werk": (s) => ({
      title: `Fietsen naar werk in ${s}: wind en fietsweer vandaag`,
      description: `Kan ik vandaag fietsen naar werk in ${s}? Check je rit: wind tegen per deel van de route, regen, temperatuur en een duidelijk oordeel. Gratis.`,
      h1: `Vandaag op de fiets naar werk in ${s}?`,
    }),
    "was-buiten-drogen": (s) => ({
      title: `Was buiten drogen in ${s}: droogvenster vandaag`,
      description: `Kan de was vandaag buiten in ${s}? Zie per uur wanneer je was goed droogt: luchtvochtigheid, wind en regen, met droogtijd. Gratis.`,
      h1: `Vandaag de was buiten in ${s}?`,
    }),
    "wat-trek-ik-aan": (s) => ({
      title: `Wat trek ik vandaag aan in ${s}? Kledingadvies op gevoel`,
      description: `Wat trek ik vandaag aan in ${s}? Praktisch kledingadvies op gevoelstemperatuur: laagjes, regenkleding en het verloop van de dag. Gratis.`,
      h1: `Wat trek ik vandaag aan in ${s}?`,
    }),
    "terras": (s) => ({
      title: `Terrasweer in ${s}: de beste terrasuren vandaag`,
      description: `Kan ik vandaag op het terras in ${s}? Zie de beste terrasuren: gevoelstemperatuur, wind en zon per uur, vijf dagen vooruit. Gratis.`,
      h1: `Vandaag op het terras in ${s}?`,
    }),
    "hooikoorts": (s) => ({
      title: `Hooikoorts in ${s}: pollen vandaag per uur`,
      description: `Krijg ik vandaag hooikoorts in ${s}? Zie gras-, berk- en elspollen per uur en het rustigste blok van de dag. Gratis.`,
      h1: `Hooikoorts vandaag in ${s}?`,
    }),
    "zonkracht": (s) => ({
      title: `Zonkracht in ${s}: verbrand ik vandaag?`,
      description: `Moet ik vandaag smeren in ${s}? Zie de zonkracht per uur, het smeervenster en hoe snel jouw huidtype verbrandt. Gratis.`,
      h1: `Verbrand ik vandaag in ${s}?`,
    }),
    "barbecue": (s) => ({
      title: `Barbecueweer in ${s}: het beste avondblok vandaag`,
      description: `Kan ik vandaag barbecue\u00ebn in ${s}? Zie het beste avondblok, of het droog blijft en waar de rook heen trekt. Gratis.`,
      h1: `Vandaag barbecue\u00ebn in ${s}?`,
    }),
    "hardloopweer": (s) => ({
      title: `Hardloopweer in ${s}: het beste loopblok vandaag`,
      description: `Is het hardloopweer in ${s} vandaag? Zie per uur het beste loopblok op gevoelstemperatuur, wind en regen, vijf dagen vooruit. Gratis.`,
      h1: `Hardlopen in ${s} vandaag?`,
    }),
    "wandelen": (s) => ({
      title: `Wandelweer in ${s}: het beste wandelblok vandaag`,
      description: `Kan ik wandelen in ${s} vandaag? Zie de droogste, prettigste uren op gevoelstemperatuur, wind en buien, vijf dagen vooruit. Gratis.`,
      h1: `Wandelen in ${s} vandaag?`,
    }),
    "buiten-sporten": (s) => ({
      title: `Buiten sporten in ${s}: het beste trainingsblok vandaag`,
      description: `Kan ik buiten sporten in ${s} vandaag? Zie het beste blok voor je training: warmte, wind en buien per uur. Gratis.`,
      h1: `Buiten sporten in ${s} vandaag?`,
    }),
    "padel-of-tennis": (s) => ({
      title: `Padel of tennis in ${s}: kan de baan vandaag?`,
      description: `Kan ik padellen of tennissen in ${s} vandaag? Zie of de baan droog en bespeelbaar is en welk blok het lekkerst speelt. Gratis.`,
      h1: `Padel of tennis in ${s} vandaag?`,
    }),
    "auto-wassen": (s) => ({
      title: `Auto wassen in ${s}: het beste wasmoment vandaag`,
      description: `Kan ik de auto wassen in ${s} vandaag? Zie of het droog blijft, of de zon strepen trekt en wat het beste wasmoment is. Gratis.`,
      h1: `Auto wassen in ${s} vandaag?`,
    }),
    "grasmaaien": (s) => ({
      title: `Grasmaaien in ${s}: droog gras vandaag?`,
      description: `Kan ik grasmaaien in ${s} vandaag? Zie wanneer het gras droog is na dauw of regen en wat het beste maaimoment is. Gratis.`,
      h1: `Grasmaaien in ${s} vandaag?`,
    }),
    "ramen-wassen": (s) => ({
      title: `Ramen wassen in ${s}: strepenvrij vandaag?`,
      description: `Kan ik ramen wassen in ${s} vandaag? Zie of het droog blijft en wanneer zon en vorst geen strepen of problemen geven. Gratis.`,
      h1: `Ramen wassen in ${s} vandaag?`,
    }),
    "zonnepanelen": (s) => ({
      title: `Zonnepanelen in ${s}: de opbrengst vandaag`,
      description: `Leveren zonnepanelen in ${s} vandaag veel op? Zie het zonnigste blok van de dag en plan je wasmachine op de zonuren. Gratis.`,
      h1: `Wat leveren de panelen in ${s} vandaag?`,
    }),
    "strandweer": (s) => ({
      title: `Strandweer in ${s}: de beste stranduren vandaag`,
      description: `Is het strandweer in ${s} vandaag? Zie de beste stranduren, de wind op het zand en de zonkracht, vijf dagen vooruit. Gratis.`,
      h1: `Strandweer in ${s} vandaag?`,
    }),
    "picknickweer": (s) => ({
      title: `Picknickweer in ${s}: het beste blok vandaag`,
      description: `Kan ik picknicken in ${s} vandaag? Zie droog gras, zon en weinig wind per uur, en het beste picknickblok van de dag. Gratis.`,
      h1: `Picknicken in ${s} vandaag?`,
    }),
    "buiten-zwemmen": (s) => ({
      title: `Zwemweer in ${s}: kan ik buiten zwemmen vandaag?`,
      description: `Kan ik buiten zwemmen in ${s} vandaag? Zie het beste zwemblok, de wind en of de zon je droogt als je eruit komt. Gratis.`,
      h1: `Buiten zwemmen in ${s} vandaag?`,
    }),
    "suppen-of-kajakken": (s) => ({
      title: `Suppen of kajakken in ${s}: vlak water vandaag?`,
      description: `Kan ik suppen of kajakken in ${s} vandaag? Zie per uur wanneer de wind het laagst is en het water het vlakst ligt. Gratis.`,
      h1: `Suppen of kajakken in ${s} vandaag?`,
    }),
    "sterrenkijken": (s) => ({
      title: `Sterren kijken in ${s}: heldere nacht vandaag?`,
      description: `Kan ik sterren kijken in ${s} vannacht? Zie bewolking, maanfase en het helderste blok van de avond. Gratis.`,
      h1: `Sterren kijken in ${s} vannacht?`,
    }),
    "regen-timing": (s) => ({
      title: `Wanneer gaat het regenen in ${s}?`,
      description: `Wanneer gaat het regenen in ${s}? Zie op de minuut wanneer de bui valt, wanneer het droog wordt en welke uren veilig zijn. Gratis.`,
      h1: `Wanneer gaat het regenen in ${s}?`,
    }),
    "paraplu": (s) => ({
      title: `Paraplu mee in ${s} vandaag?`,
      description: `Moet ik een paraplu mee in ${s} vandaag? Zie of er buien vallen op jouw momenten buiten en of een regenjas slimmer is. Gratis.`,
      h1: `Paraplu mee in ${s} vandaag?`,
    }),
    "krabben": (s) => ({
      title: `Ruiten krabben in ${s}: bevriest de auto vannacht?`,
      description: `Moet ik morgen krabben in ${s}? Zie of de autoruit vannacht bevriest, zodat je die vijf minuten extra kunt inplannen. Gratis.`,
      h1: `Krabben in ${s} morgenvroeg?`,
    }),
    "gladheid": (s) => ({
      title: `Gladheid in ${s}: is het glad vandaag?`,
      description: `Is het glad in ${s} vandaag of vannacht? Zie het gladheidsrisico per ochtend, ook voor bruggen en fietspaden. Gratis.`,
      h1: `Gladheid in ${s} vandaag?`,
    }),
  },
  en: {
    "fiets-naar-werk": (s) => ({
      title: `Bike to work in ${s}: wind and cycling weather today`,
      description: `Can I bike to work in ${s} today? Check your ride: headwind per part of the route, rain, temperature and a clear verdict. Free.`,
      h1: `Bike to work in ${s} today?`,
    }),
    "was-buiten-drogen": (s) => ({
      title: `Dry laundry outside in ${s}: today's drying window`,
      description: `Can I dry laundry outside in ${s} today? See per hour when your wash dries: humidity, wind and rain, with drying time. Free.`,
      h1: `Dry the laundry outside in ${s} today?`,
    }),
    "wat-trek-ik-aan": (s) => ({
      title: `What to wear today in ${s}? Outfit advice on feels-like`,
      description: `What should I wear today in ${s}? Practical outfit advice on feels-like temperature: layers, rain gear and the day's swing. Free.`,
      h1: `What to wear in ${s} today?`,
    }),
    "terras": (s) => ({
      title: `Patio weather in ${s}: the best outdoor hours today`,
      description: `Can I sit outside in ${s} today? See the best patio hours: feels-like temperature, wind and sun per hour, five days ahead. Free.`,
      h1: `Sit outside in ${s} today?`,
    }),
    "hooikoorts": (s) => ({
      title: `Hay fever in ${s}: today's pollen per hour`,
      description: `Will I get hay fever in ${s} today? See grass, birch and alder pollen per hour and the calmest window of the day. Free.`,
      h1: `Hay fever in ${s} today?`,
    }),
    "zonkracht": (s) => ({
      title: `UV index in ${s}: will I burn today?`,
      description: `Do I need sunscreen in ${s} today? See the UV per hour, the sunscreen window and how fast your skin type burns. Free.`,
      h1: `Will I burn in ${s} today?`,
    }),
    "barbecue": (s) => ({
      title: `BBQ weather in ${s}: the best evening window today`,
      description: `Can I barbecue in ${s} today? See the best evening window, whether it stays dry and where the smoke will drift. Free.`,
      h1: `Barbecue in ${s} today?`,
    }),
    "hardloopweer": (s) => ({
      title: `Running weather in ${s}: the best running window today`,
      description: `Is it running weather in ${s} today? See the best window per hour on feels-like, wind and rain, five days ahead. Free.`,
      h1: `Running in ${s} today?`,
    }),
    "wandelen": (s) => ({
      title: `Walking weather in ${s}: the best walking window today`,
      description: `Can I go for a walk in ${s} today? See the driest, most pleasant hours on feels-like, wind and showers, five days ahead. Free.`,
      h1: `Walking in ${s} today?`,
    }),
    "buiten-sporten": (s) => ({
      title: `Outdoor training in ${s}: the best workout window today`,
      description: `Can I train outside in ${s} today? See the best window for your workout: heat, wind and showers per hour. Free.`,
      h1: `Training outside in ${s} today?`,
    }),
    "padel-of-tennis": (s) => ({
      title: `Padel or tennis in ${s}: is the court playable today?`,
      description: `Can I play padel or tennis in ${s} today? See whether the court is dry and playable and which window plays best. Free.`,
      h1: `Padel or tennis in ${s} today?`,
    }),
    "auto-wassen": (s) => ({
      title: `Washing the car in ${s}: the best wash moment today`,
      description: `Can I wash the car in ${s} today? See whether it stays dry, whether the sun causes streaks and the best moment to wash. Free.`,
      h1: `Wash the car in ${s} today?`,
    }),
    "grasmaaien": (s) => ({
      title: `Mowing the lawn in ${s}: dry grass today?`,
      description: `Can I mow the lawn in ${s} today? See when the grass is dry after dew or rain and the best mowing moment. Free.`,
      h1: `Mow the lawn in ${s} today?`,
    }),
    "ramen-wassen": (s) => ({
      title: `Cleaning windows in ${s}: streak-free today?`,
      description: `Can I clean the windows in ${s} today? See whether it stays dry and when sun and frost cause no streaks or trouble. Free.`,
      h1: `Clean the windows in ${s} today?`,
    }),
    "zonnepanelen": (s) => ({
      title: `Solar panels in ${s}: today's yield`,
      description: `Will solar panels in ${s} produce well today? See the sunniest window of the day and plan your appliances on the sun hours. Free.`,
      h1: `What will the panels in ${s} produce today?`,
    }),
    "strandweer": (s) => ({
      title: `Beach weather in ${s}: the best beach hours today`,
      description: `Is it beach weather in ${s} today? See the best beach hours, the wind on the sand and the UV index, five days ahead. Free.`,
      h1: `Beach weather in ${s} today?`,
    }),
    "picknickweer": (s) => ({
      title: `Picnic weather in ${s}: the best window today`,
      description: `Can I have a picnic in ${s} today? See dry grass, sun and little wind per hour, and the best picnic window of the day. Free.`,
      h1: `Picnic in ${s} today?`,
    }),
    "buiten-zwemmen": (s) => ({
      title: `Swimming weather in ${s}: can I swim outside today?`,
      description: `Can I swim outside in ${s} today? See the best swimming window, the wind and whether the sun dries you afterwards. Free.`,
      h1: `Swimming outside in ${s} today?`,
    }),
    "suppen-of-kajakken": (s) => ({
      title: `SUP or kayak in ${s}: flat water today?`,
      description: `Can I paddleboard or kayak in ${s} today? See per hour when the wind is lowest and the water at its flattest. Free.`,
      h1: `SUP or kayak in ${s} today?`,
    }),
    "sterrenkijken": (s) => ({
      title: `Stargazing in ${s}: a clear night today?`,
      description: `Can I stargaze in ${s} tonight? See cloud cover, the moon phase and the clearest window of the evening. Free.`,
      h1: `Stargazing in ${s} tonight?`,
    }),
    "regen-timing": (s) => ({
      title: `When will it rain in ${s}?`,
      description: `When will it rain in ${s}? See to the minute when the shower falls, when it turns dry and which hours are safe. Free.`,
      h1: `When will it rain in ${s}?`,
    }),
    "paraplu": (s) => ({
      title: `Umbrella in ${s} today?`,
      description: `Should I bring an umbrella in ${s} today? See whether showers fall during your moments outside and whether a rain jacket is smarter. Free.`,
      h1: `Umbrella in ${s} today?`,
    }),
    "krabben": (s) => ({
      title: `Windscreen frost in ${s}: will the car freeze tonight?`,
      description: `Will I need to scrape in ${s} tomorrow? See whether the windscreen freezes tonight, so you can plan those extra five minutes. Free.`,
      h1: `Scraping in ${s} tomorrow morning?`,
    }),
    "gladheid": (s) => ({
      title: `Icy roads in ${s}: is it slippery today?`,
      description: `Is it slippery in ${s} today or tonight? See the ice risk per morning, including bridges and cycle paths. Free.`,
      h1: `Icy roads in ${s} today?`,
    }),
  },
};

export const STAD_TEMPLATES = kies(STAD_TEMPLATES_RUW);

/**
 * Titel/description/h1 voor een stadpagina. Het vangnet put uit de
 * tool zelf en leent dus nooit meer andermans tekst; de test dwingt af
 * dat elke geregistreerde tool een echt template heeft, zodat het
 * vangnet alleen een toekomstige vergeten tool opvangt.
 */
export function titelVoor(tool, stad) {
  const maak = STAD_TEMPLATES[tool.templateId ?? tool.id];
  if (maak) return maak(stad.naam);
  return {
    title: `${tool.navLabel} in ${stad.naam} ${kies({ nl: "vandaag", en: "today" })}`,
    description: `${tool.korteVraag} ${kies({
      nl: `Bekijk het antwoord voor ${stad.naam}, per uur en vijf dagen vooruit. Gratis.`,
      en: `See the answer for ${stad.naam}, per hour and five days ahead. Free.`,
    })}`,
    h1: `${tool.navLabel} in ${stad.naam}?`,
  };
}

/**
 * De korte zoekterm-kern per tool voor de stedenknoppen op de
 * toolpagina ("{term} {stad}"). Varianten hebben een eigen term; de
 * lijst rendert op hun eigen vraagpagina's met eigen stad-URL's.
 */
export const ANKER_TERM_RUW = {
  nl: {
    "fiets-naar-werk": "Fietsen naar werk",
    "hardloopweer": "Hardloopweer",
    "wandelen": "Wandelweer",
    "buiten-sporten": "Buiten sporten",
    "padel-of-tennis": "Padel of tennis",
    "was-buiten-drogen": "Was buiten drogen",
    "auto-wassen": "Auto wassen",
    "grasmaaien": "Grasmaaien",
    "ramen-wassen": "Ramen wassen",
    "zonnepanelen": "Zonnepanelen",
    "wat-trek-ik-aan": "Kledingadvies",
    "terras": "Terrasweer",
    "barbecue": "Barbecueweer",
    "strandweer": "Strandweer",
    "picknickweer": "Picknickweer",
    "buiten-zwemmen": "Zwemweer",
    "suppen-of-kajakken": "Suppen of kajakken",
    "sterrenkijken": "Sterren kijken",
    "zonkracht": "Zonkracht",
    "hooikoorts": "Hooikoorts",
    "regen-timing": "Wanneer regen",
    "paraplu": "Paraplu mee",
    "krabben": "Ruiten krabben",
    "gladheid": "Gladheid",
    "korte-broek": "Korte broek weer",
    "jas": "Jas aan of uit",
    "t-shirt": "T-shirtweer",
  },
  en: {
    "fiets-naar-werk": "Bike to work",
    "hardloopweer": "Running weather",
    "wandelen": "Walking weather",
    "buiten-sporten": "Outdoor training",
    "padel-of-tennis": "Padel or tennis",
    "was-buiten-drogen": "Drying laundry",
    "auto-wassen": "Car washing",
    "grasmaaien": "Lawn mowing",
    "ramen-wassen": "Window cleaning",
    "zonnepanelen": "Solar panels",
    "wat-trek-ik-aan": "What to wear",
    "terras": "Patio weather",
    "barbecue": "BBQ weather",
    "strandweer": "Beach weather",
    "picknickweer": "Picnic weather",
    "buiten-zwemmen": "Swimming weather",
    "suppen-of-kajakken": "SUP or kayak",
    "sterrenkijken": "Stargazing",
    "zonkracht": "UV index",
    "hooikoorts": "Hay fever",
    "regen-timing": "When it rains",
    "paraplu": "Umbrella",
    "krabben": "Windscreen frost",
    "gladheid": "Icy roads",
    "korte-broek": "Shorts weather",
    "jas": "Coat or no coat",
    "t-shirt": "T-shirt weather",
  },
};

export const ANKER_TERM = kies(ANKER_TERM_RUW);

/** Ankertekst voor een stedenknop: "{term} {stad}". */
export function stadAnker(tool, stadNaam) {
  const term = ANKER_TERM[tool.templateId ?? tool.id] ?? tool.navLabel;
  return `${term} ${stadNaam}`;
}
