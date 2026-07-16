/**
 * lib/categorieen.js
 *
 * De categorie-architectuur, vastgesteld in de taxonomie-sprint (juli
 * 2026). Zeven categorien met beschrijvende root-slugs. Elke categorie
 * is een storefront: een rankbare hub, geen linklijst. Tools koppelen
 * zich via hun categorieId.
 *
 * Route: root (/regen-en-droog), NIET /c/..., want dit worden de
 * sterkste rankende pagina's. Slug-botsingen met tools worden afgevangen
 * door valideerRegister (categorie- en toolslugs delen een namespace).
 */

import { kies } from "./i18n/locale.js";

export const CATEGORIEEN = kies({
  nl: [
    { id: "regen", slug: "regen-en-droog", titel: "Regen en droog", kort: "Word ik nat, wanneer regent het, paraplu mee", intro: "Twijfel je of het droog blijft? Zie direct of je nat wordt, wanneer de bui valt en of een paraplu slim is: een concreet antwoord, geen algemeen weerbericht.", icoon: "druppel", kleur: "#3C7DC4" },
    { id: "kleding", slug: "kleding", titel: "Kleding", kort: "Wat trek je aan vandaag?", intro: "Jas of geen jas, korte broek of lange, T-shirt of trui? De kledingchecks kijken naar het gevoel per dagdeel, niet naar de kale thermometer.", icoon: "shirt", kleur: "#3D6E96" },
    { id: "buiten", slug: "buiten-vrije-tijd", titel: "Buiten en vrije tijd", kort: "Terras, barbecue en meer", intro: "Kan het buiten vandaag? Van de eerste terrasborrel tot de barbecue op een zwoele avond: hier zie je of het weer meezit voor je plannen, en op welk moment.", icoon: "parasol", kleur: "#B5691E" },
    { id: "sport", slug: "sport-beweging", titel: "Sport en beweging", kort: "Fietsen, hardlopen, buiten sporten", intro: "Kun je vandaag naar buiten om te bewegen? De checks kijken naar wind, regen en hoe zwaar het buiten aanvoelt tijdens je training.", icoon: "fiets", kleur: "#2F7D62" },
    { id: "huis-tuin", slug: "huis-tuin-auto", titel: "Huis, tuin en auto", kort: "Was, auto wassen, tuinieren, klussen", intro: "De was buiten, de auto wassen, tuinieren of een klus? De praktische checks die je dag rond het huis op het weer plannen, met het beste moment om te beginnen.", icoon: "druppel", kleur: "#4E9A86" },
    { id: "gezondheid", slug: "zon-lucht-hooikoorts", titel: "Zon, lucht en hooikoorts", kort: "Zonkracht en pollen", intro: "Verbrand ik, en zitten er veel pollen in de lucht? De checks rond zon, lucht en gezondheid, met het rustigste en veiligste moment.", icoon: "zon", kleur: "#D97C1B" },
    { id: "winter", slug: "winter-veiligheid", titel: "Winter en veiligheid", kort: "Krabben en gladheid", intro: "Moet ik krabben, en is het glad op de weg? De winterchecks die je ochtend en je rit veiliger maken, met uitleg waarom heldere nachten juist verraderlijk zijn.", icoon: "vlok", kleur: "#5B7A99" },
  ],
  en: [
    { id: "regen", slug: "rain-or-dry", titel: "Rain or dry", kort: "Will I get wet, when will it rain, umbrella", intro: "Wondering whether it stays dry? See straight away whether you get wet, when the shower falls and whether an umbrella is smart: a concrete answer for your day.", icoon: "druppel", kleur: "#3C7DC4" },
    { id: "kleding", slug: "clothing", titel: "Clothing", kort: "What to wear today?", intro: "Coat or no coat, shorts or trousers, T-shirt or jumper? The clothing checks look at the feel per part of the day, not the bare thermometer.", icoon: "shirt", kleur: "#3D6E96" },
    { id: "buiten", slug: "outdoors-leisure", titel: "Outdoors and leisure", kort: "Patio, barbecue and more", intro: "Can you be outside today? From the first patio drink to a barbecue on a mild evening: see whether the weather cooperates with your plans, and at what moment.", icoon: "parasol", kleur: "#B5691E" },
    { id: "sport", slug: "sport-exercise", titel: "Sport and exercise", kort: "Cycling, running, outdoor sport", intro: "Can you get out to move today? The checks look at wind, rain and how hard it feels outside during your workout.", icoon: "fiets", kleur: "#2F7D62" },
    { id: "huis-tuin", slug: "home-garden-car", titel: "Home, garden and car", kort: "Laundry, car wash, gardening, DIY", intro: "Laundry outside, washing the car, gardening or a DIY job? The practical checks that plan your day around the house on the weather, with the best moment to start.", icoon: "druppel", kleur: "#4E9A86" },
    { id: "gezondheid", slug: "sun-air-hayfever", titel: "Sun, air and hay fever", kort: "UV and pollen", intro: "Will I burn, and is there a lot of pollen in the air? The checks around sun, air and health, with the calmest and safest moment.", icoon: "zon", kleur: "#D97C1B" },
    { id: "winter", slug: "winter-safety", titel: "Winter and safety", kort: "Scraping and icy roads", intro: "Do I need to scrape, and are the roads icy? The winter checks that make your morning and your ride safer, and why clear nights are the treacherous ones.", icoon: "vlok", kleur: "#5B7A99" },
  ],
});

export function vindCategorie(slug) {
  return CATEGORIEEN.find((c) => c.slug === slug) ?? null;
}

export function vindCategorieOpId(id) {
  return CATEGORIEEN.find((c) => c.id === id) ?? null;
}
