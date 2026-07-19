/**
 * content/beslissingen.js
 *
 * De catalogus achter /alle-checks (v3.10.0 "Levante"). Een bron van
 * waarheid: de indeling volgt exact de zeven categorieen uit
 * lib/categorieen.js (id per blok; titel en kleur komen daarvandaan).
 * Vier soorten items:
 *
 * - { toolId, zoek }: live check; de vraag komt uit tool.korteVraag,
 *   zodat de titel overal identiek is (canonieke titel per check).
 * - { variantId, zoek }: live SEO-variant; vraag uit variant.vraag.
 * - { vraag, ankerCategorie, anker, zoek }: vraag met een echt antwoord
 *   als FAQ-anker op een storefront (klikbaar, geen dood spoor).
 * - { vraag, zoek }: geplande check (eerlijke backlog, gedempt getoond).
 */

import { kies } from "../lib/i18n/locale.js";

export const BESLISSINGEN = kies({
  nl: [
    {
      id: "regen",
      items: [
        { toolId: "paraplu", zoek: ["paraplu", "regen", "bui", "nat"] },
        { vraag: "Wat betekent 60 procent regenkans?", ankerCategorie: "regen", anker: "regenkans-betekenis", zoek: ["regenkans", "procent", "betekenis"] },
        { vraag: "Code geel of oranje bij regen: wat betekent dat?", ankerCategorie: "regen", anker: "code-geel-of-oranje-bij-regen", zoek: ["code geel", "code oranje", "waarschuwing"] },
        { toolId: "regen-timing", zoek: ["regen", "wanneer", "bui", "droog venster"] },
        { vraag: "Word ik vandaag nat?", ankerCategorie: "regen", anker: "ga-ik-nat-vandaag", zoek: ["nat", "regen", "bui"] },
        { vraag: "Blijft het vandaag droog?", ankerCategorie: "regen", anker: "hoe-lang-blijft-het-droog", zoek: ["droog"] },
        { vraag: "Blijf ik vanavond droog?", ankerCategorie: "regen", anker: "gaat-het-vanavond-regenen", zoek: ["avond", "droog"] },
        { vraag: "Moet ik een regenjas aan?", ankerCategorie: "regen", anker: "moet-ik-een-regenjas-aan", zoek: ["regenjas", "jas", "regen"] },
      ],
    },
    {
      id: "kleding",
      items: [
        { toolId: "wat-trek-ik-aan", zoek: ["kleding", "aan", "outfit", "laagjes"] },
        { vraag: "Wat trek ik aan bij 5 graden?", ankerCategorie: "kleding", anker: "wat-trek-ik-aan-bij-5-graden", zoek: ["5 graden", "kleding"] },
        { vraag: "Wat trek ik aan bij 10 graden?", ankerCategorie: "kleding", anker: "wat-trek-ik-aan-bij-10-graden", zoek: ["10 graden", "kleding"] },
        { vraag: "Wat trek ik aan bij 20 graden?", ankerCategorie: "kleding", anker: "wat-trek-ik-aan-bij-20-graden", zoek: ["20 graden", "kleding"] },
        { variantId: "jas", zoek: ["jas"] },
        { variantId: "korte-broek", zoek: ["korte broek", "shorts"] },
        { variantId: "t-shirt", zoek: ["t-shirt", "shirt"] },
        { variantId: "slippers", zoek: ["slippers", "sandalen", "teenslippers"] },
        { vraag: "Heb ik handschoenen, muts of sjaal nodig?", ankerCategorie: "kleding", anker: "heb-ik-handschoenen-muts-of-sjaal-nodig", zoek: ["handschoenen", "muts", "sjaal", "winter"] },
        { vraag: "Heb ik vandaag een zonnebril nodig?", ankerCategorie: "kleding", anker: "heb-ik-vandaag-een-zonnebril-nodig", zoek: ["zonnebril"] },
      ],
    },
    {
      id: "buiten",
      items: [
        { toolId: "terras", zoek: ["terras", "buiten zitten", "borrel", "bier"] },
        { toolId: "hond-uitlaten", zoek: ["hond", "uitlaten", "rondje", "asfalt"] },
        { toolId: "vliegeren", zoek: ["vlieger", "vliegeren", "wind"] },
        { toolId: "vuurkorf", zoek: ["vuurkorf", "vuur", "terrashaard"] },
        { toolId: "drone-vliegen", zoek: ["drone", "vliegen", "dji"] },
        { toolId: "paardrijden", zoek: ["paard", "paardrijden", "buitenrit", "manege"] },
        { toolId: "vissen", zoek: ["vissen", "hengel", "visweer", "karper"] },
        { toolId: "kamperen", zoek: ["kamperen", "tent", "camping", "nacht"] },
        { toolId: "barbecue", zoek: ["bbq", "barbecue", "grillen"] },
        { toolId: "strandweer", zoek: ["strand", "zee", "kust"] },
        { toolId: "picknickweer", zoek: ["picknick", "buiten eten"] },
        { toolId: "buiten-zwemmen", zoek: ["zwemmen", "water"] },
        { toolId: "sterrenkijken", zoek: ["sterren", "sterrenkijken", "helder"] },
        { toolId: "suppen-of-kajakken", zoek: ["sup", "suppen", "kajak", "kano", "watersport"] },
        { vraag: "Buiten eten met kinderen: wat is het beste tijdstip?", ankerCategorie: "buiten", anker: "buiten-eten-met-kinderen", zoek: ["buiten eten", "kinderen"] },
      ],
    },
    {
      id: "sport",
      items: [
        { toolId: "fiets-naar-werk", zoek: ["fiets", "fietsen", "woon-werk", "wind"] },
        { toolId: "hardloopweer", zoek: ["hardlopen", "rennen", "runnen", "joggen"] },
        { toolId: "wielrennen", zoek: ["wielrennen", "racefiets", "koers", "gravel"] },
        { toolId: "buiten-sporten", zoek: ["sporten", "training", "bootcamp"] },
        { toolId: "wandelen", zoek: ["wandelen", "lopen"] },
        { toolId: "padel-of-tennis", zoek: ["padel", "tennis", "baan"] },
        { toolId: "golfen", zoek: ["golf", "golfen", "ronde", "baan"] },
        { toolId: "skeeleren", zoek: ["skeeleren", "skaten", "inline", "skates"] },
        { toolId: "motorrijden", zoek: ["motor", "motorrijden", "rit", "toerrit"] },
        { vraag: "Sporten bij smog of slechte luchtkwaliteit: is dat verstandig?", ankerCategorie: "sport", anker: "sporten-bij-smog-of-slechte-lucht", zoek: ["smog", "luchtkwaliteit", "fijnstof"] },
      ],
    },
    {
      id: "huis-tuin",
      items: [
        { toolId: "was-buiten-drogen", zoek: ["was", "drogen", "wasgoed", "waslijn"] },
        { toolId: "auto-wassen", zoek: ["auto wassen", "auto", "wasbeurt"] },
        { toolId: "buiten-schilderen", zoek: ["schilderen", "verf", "buiten schilderen", "kwast"] },
        { toolId: "hout-behandelen", zoek: ["beitsen", "olien", "lakken", "hout", "schutting"] },
        { toolId: "terras-reinigen", zoek: ["terras", "reinigen", "hogedruk", "oprit", "aanslag"] },
        { toolId: "ramen-wassen", zoek: ["ramen", "wassen"] },
        { toolId: "houtkachel", zoek: ["houtkachel", "stoken", "open haard", "stookalert"] },
        { toolId: "huis-koelen", zoek: ["koelen", "hitte", "ramen open", "tropennacht"] },
        { vraag: "Kan ik het huis luchten vandaag?", ankerCategorie: "huis-tuin", anker: "kan-ik-mijn-huis-luchten-vandaag", zoek: ["luchten", "ramen open", "ventileren"] },
        { vraag: "Kan ik dekbedden buiten luchten?", ankerCategorie: "huis-tuin", anker: "kan-ik-dekbedden-buiten-luchten", zoek: ["dekbed", "luchten", "beddengoed"] },
        { toolId: "zonnepanelen", zoek: ["zonnepanelen", "opbrengst", "stroom"] },
        { vraag: "Klusweer: welke dag deze week is het droogst?", ankerCategorie: "huis-tuin", anker: "klusweer-droogste-dag", zoek: ["klussen", "klusweer", "droogste dag"] },
      ],
    },
    {
      id: "tuin",
      items: [
        { toolId: "grasmaaien", zoek: ["gras", "maaien", "tuin"] },
        { toolId: "snoeien", zoek: ["snoeien", "snoei", "heg", "haag", "struiken"] },
        { vraag: "Kan ik tuinieren vandaag?", ankerCategorie: "tuin", anker: "kan-ik-tuinieren-vandaag", zoek: ["tuinieren", "tuin", "planten"] },
        { vraag: "Kan ik vandaag mijn tuinmeubels schoonmaken?", ankerCategorie: "tuin", anker: "kan-ik-mijn-tuinmeubels-schoonmaken", zoek: ["tuinmeubels", "kussens", "tuinset"] },
        { toolId: "onkruid", zoek: ["onkruid", "wieden", "schoffelen", "schoffel"] },
        { toolId: "water-geven", zoek: ["water geven", "gieter", "sproeien", "droogte"] },
        { toolId: "planten-beschermen", zoek: ["vorst", "planten afdekken", "nachtvorst", "vorstschade"] },
        { toolId: "gras-zaaien", zoek: ["gras zaaien", "graszaad", "gazon", "doorzaaien"] },
        { vraag: "Kan ik vandaag het gazon bemesten?", ankerCategorie: "tuin", anker: "kan-ik-het-gazon-bemesten", zoek: ["bemesten", "gazonmest", "kalk"] },
        { vraag: "Moet ik bladeren ruimen vandaag?", ankerCategorie: "tuin", anker: "moet-ik-bladeren-ruimen", zoek: ["bladeren", "blad", "harken"] },
        { vraag: "Kan ik de moestuin zaaien?", ankerCategorie: "tuin", anker: "kan-ik-de-moestuin-zaaien", zoek: ["moestuin", "zaaien", "groente"] },
      ],
    },
    {
      id: "gezondheid",
      items: [
        { toolId: "zonkracht", zoek: ["zonnebrand", "smeren", "uv", "zonkracht", "verbranden", "zonnen"] },
        { vraag: "Pollenkalender: welke pollen vliegen wanneer?", ankerCategorie: "gezondheid", anker: "pollenkalender", zoek: ["pollenkalender", "pollen", "seizoen"] },
        { toolId: "hooikoorts", zoek: ["hooikoorts", "pollen", "niezen", "allergie"] },
      ],
    },
    {
      id: "winter",
      items: [
        { toolId: "krabben", zoek: ["krabben", "vorst", "ijs", "autoruit"] },
        { toolId: "schaatsen", zoek: ["schaatsen", "natuurijs", "ijs", "vorst"] },
        { toolId: "mist", zoek: ["mist", "zicht", "nevel"] },
        { toolId: "storm", zoek: ["storm", "windstoten", "vastzetten", "trampoline"] },
        { toolId: "sneeuwpret", zoek: ["sneeuw", "sleeen", "slee", "sneeuwpop"] },
        { toolId: "strooien", zoek: ["strooien", "sneeuwruimen", "strooizout", "stoep"] },
        { toolId: "gladheid", zoek: ["glad", "gladheid", "ijzel"] },
      ],
    },
  ],
  en: [
    {
      id: "regen",
      items: [
        { toolId: "paraplu", zoek: ["umbrella", "rain", "shower", "wet"] },
        { vraag: "What does a 60 percent rain chance mean?", ankerCategorie: "regen", anker: "regenkans-betekenis", zoek: ["rain chance", "percent", "probability"] },
        { vraag: "Yellow or orange weather warning for rain: what does it mean?", ankerCategorie: "regen", anker: "code-geel-of-oranje-bij-regen", zoek: ["yellow warning", "orange warning", "weather warning"] },
        { toolId: "regen-timing", zoek: ["rain", "when", "shower", "dry window"] },
        { vraag: "Will I get wet today?", ankerCategorie: "regen", anker: "ga-ik-nat-vandaag", zoek: ["wet", "rain", "shower"] },
        { vraag: "Will it stay dry today?", ankerCategorie: "regen", anker: "hoe-lang-blijft-het-droog", zoek: ["dry"] },
        { vraag: "Will I stay dry tonight?", ankerCategorie: "regen", anker: "gaat-het-vanavond-regenen", zoek: ["evening", "dry"] },
        { vraag: "Do I need a raincoat?", ankerCategorie: "regen", anker: "moet-ik-een-regenjas-aan", zoek: ["raincoat", "coat", "rain"] },
      ],
    },
    {
      id: "kleding",
      items: [
        { toolId: "wat-trek-ik-aan", zoek: ["clothing", "wear", "outfit", "layers"] },
        { vraag: "What to wear at 5 degrees?", ankerCategorie: "kleding", anker: "wat-trek-ik-aan-bij-5-graden", zoek: ["5 degrees", "wear"] },
        { vraag: "What to wear at 10 degrees?", ankerCategorie: "kleding", anker: "wat-trek-ik-aan-bij-10-graden", zoek: ["10 degrees", "wear"] },
        { vraag: "What to wear at 20 degrees?", ankerCategorie: "kleding", anker: "wat-trek-ik-aan-bij-20-graden", zoek: ["20 degrees", "wear"] },
        { variantId: "jas", zoek: ["coat", "jacket"] },
        { variantId: "korte-broek", zoek: ["shorts"] },
        { variantId: "t-shirt", zoek: ["t-shirt", "shirt"] },
        { variantId: "slippers", zoek: ["flip-flops", "sandals", "thongs"] },
        { vraag: "Do I need gloves, a hat or a scarf?", ankerCategorie: "kleding", anker: "heb-ik-handschoenen-muts-of-sjaal-nodig", zoek: ["gloves", "hat", "scarf", "winter"] },
        { vraag: "Do I need sunglasses today?", ankerCategorie: "kleding", anker: "heb-ik-vandaag-een-zonnebril-nodig", zoek: ["sunglasses"] },
      ],
    },
    {
      id: "buiten",
      items: [
        { toolId: "terras", zoek: ["patio", "terrace", "sit outside", "drinks"] },
        { toolId: "hond-uitlaten", zoek: ["dog", "walk", "paws"] },
        { toolId: "vliegeren", zoek: ["kite", "wind"] },
        { toolId: "vuurkorf", zoek: ["fire pit", "fire", "sparks"] },
        { toolId: "drone-vliegen", zoek: ["drone", "flying", "dji"] },
        { toolId: "paardrijden", zoek: ["horse", "riding", "hack"] },
        { toolId: "vissen", zoek: ["fishing", "rod", "angling"] },
        { toolId: "kamperen", zoek: ["camping", "tent", "night"] },
        { toolId: "barbecue", zoek: ["bbq", "barbecue", "grill"] },
        { toolId: "strandweer", zoek: ["beach", "sea", "coast"] },
        { toolId: "picknickweer", zoek: ["picnic", "eat outside"] },
        { toolId: "buiten-zwemmen", zoek: ["swim", "water"] },
        { toolId: "sterrenkijken", zoek: ["stars", "stargazing", "clear"] },
        { toolId: "suppen-of-kajakken", zoek: ["sup", "paddleboard", "kayak", "canoe", "watersport"] },
        { vraag: "Eating outside with kids: what is the best time?", ankerCategorie: "buiten", anker: "buiten-eten-met-kinderen", zoek: ["eat outside", "kids"] },
      ],
    },
    {
      id: "sport",
      items: [
        { toolId: "fiets-naar-werk", zoek: ["bike", "cycling", "commute", "wind"] },
        { toolId: "hardloopweer", zoek: ["running", "run", "jog"] },
        { toolId: "wielrennen", zoek: ["road cycling", "road bike", "ride"] },
        { toolId: "buiten-sporten", zoek: ["workout", "training", "bootcamp"] },
        { toolId: "wandelen", zoek: ["walk", "walking"] },
        { toolId: "padel-of-tennis", zoek: ["padel", "tennis", "court"] },
        { toolId: "golfen", zoek: ["golf", "round", "course"] },
        { toolId: "skeeleren", zoek: ["skating", "inline", "skates"] },
        { toolId: "motorrijden", zoek: ["motorcycle", "ride", "biking"] },
        { vraag: "Training in smog or poor air quality: is it sensible?", ankerCategorie: "sport", anker: "sporten-bij-smog-of-slechte-lucht", zoek: ["smog", "air quality"] },
      ],
    },
    {
      id: "huis-tuin",
      items: [
        { toolId: "was-buiten-drogen", zoek: ["laundry", "dry", "washing", "line"] },
        { toolId: "auto-wassen", zoek: ["car wash", "car"] },
        { toolId: "buiten-schilderen", zoek: ["paint", "painting", "brush", "exterior"] },
        { toolId: "hout-behandelen", zoek: ["stain", "oil", "varnish", "wood", "fence"] },
        { toolId: "terras-reinigen", zoek: ["patio", "clean", "pressure", "driveway"] },
        { toolId: "ramen-wassen", zoek: ["windows", "wash"] },
        { toolId: "houtkachel", zoek: ["wood stove", "burning", "fireplace"] },
        { toolId: "huis-koelen", zoek: ["cooling", "heat", "windows open", "tropical night"] },
        { vraag: "Can I air the house today?", ankerCategorie: "huis-tuin", anker: "kan-ik-mijn-huis-luchten-vandaag", zoek: ["air", "ventilate", "windows open"] },
        { vraag: "Can I air duvets outside?", ankerCategorie: "huis-tuin", anker: "kan-ik-dekbedden-buiten-luchten", zoek: ["duvet", "air", "bedding"] },
        { toolId: "zonnepanelen", zoek: ["solar panels", "yield", "power"] },
        { vraag: "DIY weather: which day this week is driest?", ankerCategorie: "huis-tuin", anker: "klusweer-droogste-dag", zoek: ["diy", "driest day"] },
      ],
    },
    {
      id: "tuin",
      items: [
        { toolId: "grasmaaien", zoek: ["lawn", "mow", "garden"] },
        { toolId: "snoeien", zoek: ["prune", "pruning", "hedge", "trim"] },
        { vraag: "Can I garden today?", ankerCategorie: "tuin", anker: "kan-ik-tuinieren-vandaag", zoek: ["garden", "gardening", "plants"] },
        { vraag: "Can I clean my garden furniture today?", ankerCategorie: "tuin", anker: "kan-ik-mijn-tuinmeubels-schoonmaken", zoek: ["furniture", "cushions", "garden set"] },
        { toolId: "onkruid", zoek: ["weed", "weeding", "hoe", "hoeing"] },
        { toolId: "water-geven", zoek: ["water", "watering", "sprinkle", "drought"] },
        { toolId: "planten-beschermen", zoek: ["frost", "cover plants", "night frost", "frost damage"] },
        { toolId: "gras-zaaien", zoek: ["sow", "grass seed", "lawn", "overseed"] },
        { vraag: "Can I fertilise the lawn today?", ankerCategorie: "tuin", anker: "kan-ik-het-gazon-bemesten", zoek: ["fertilise", "lawn feed", "lime"] },
        { vraag: "Should I rake leaves today?", ankerCategorie: "tuin", anker: "moet-ik-bladeren-ruimen", zoek: ["leaves", "rake", "leaf"] },
        { vraag: "Can I sow the vegetable garden?", ankerCategorie: "tuin", anker: "kan-ik-de-moestuin-zaaien", zoek: ["vegetable", "sow", "seeds"] },
      ],
    },
    {
      id: "gezondheid",
      items: [
        { toolId: "zonkracht", zoek: ["sunscreen", "uv", "sunburn", "burn", "sunbathe"] },
        { vraag: "Pollen calendar: which pollen flies when?", ankerCategorie: "gezondheid", anker: "pollenkalender", zoek: ["pollen calendar", "pollen", "season"] },
        { toolId: "hooikoorts", zoek: ["hay fever", "pollen", "sneezing", "allergy"] },
      ],
    },
    {
      id: "winter",
      items: [
        { toolId: "krabben", zoek: ["scrape", "frost", "ice", "windscreen"] },
        { toolId: "schaatsen", zoek: ["skating", "ice", "frost"] },
        { toolId: "mist", zoek: ["fog", "visibility", "haze"] },
        { toolId: "storm", zoek: ["storm", "gusts", "secure", "trampoline"] },
        { toolId: "sneeuwpret", zoek: ["snow", "sledding", "sledge", "snowman"] },
        { toolId: "strooien", zoek: ["gritting", "clear snow", "grit salt", "pavement"] },
        { toolId: "gladheid", zoek: ["icy", "black ice", "slippery"] },
      ],
    },
  ],
});
