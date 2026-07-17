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
        { vraag: "Heb ik handschoenen, muts of sjaal nodig?", ankerCategorie: "kleding", anker: "heb-ik-handschoenen-muts-of-sjaal-nodig", zoek: ["handschoenen", "muts", "sjaal", "winter"] },
        { vraag: "Heb ik vandaag een zonnebril nodig?", ankerCategorie: "kleding", anker: "heb-ik-vandaag-een-zonnebril-nodig", zoek: ["zonnebril"] },
      ],
    },
    {
      id: "buiten",
      items: [
        { toolId: "terras", zoek: ["terras", "buiten zitten", "borrel", "bier"] },
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
        { toolId: "buiten-sporten", zoek: ["sporten", "training", "bootcamp"] },
        { toolId: "wandelen", zoek: ["wandelen", "lopen"] },
        { toolId: "padel-of-tennis", zoek: ["padel", "tennis", "baan"] },
        { vraag: "Sporten bij smog of slechte luchtkwaliteit: is dat verstandig?", ankerCategorie: "sport", anker: "sporten-bij-smog-of-slechte-lucht", zoek: ["smog", "luchtkwaliteit", "fijnstof"] },
      ],
    },
    {
      id: "huis-tuin",
      items: [
        { toolId: "was-buiten-drogen", zoek: ["was", "drogen", "wasgoed", "waslijn"] },
        { toolId: "auto-wassen", zoek: ["auto wassen", "auto", "wasbeurt"] },
        { vraag: "Kan ik buiten schilderen of beitsen?", ankerCategorie: "huis-tuin", anker: "kan-ik-buiten-schilderen-of-beitsen", zoek: ["schilderen", "beitsen", "verf", "schutting", "kitten"] },
        { toolId: "grasmaaien", zoek: ["gras", "maaien", "tuin"] },
        { vraag: "Kan ik tuinieren vandaag?", ankerCategorie: "huis-tuin", anker: "kan-ik-tuinieren-vandaag", zoek: ["tuinieren", "tuin", "planten"] },
        { toolId: "ramen-wassen", zoek: ["ramen", "wassen"] },
        { vraag: "Kan ik het huis luchten vandaag?", ankerCategorie: "huis-tuin", anker: "kan-ik-mijn-huis-luchten-vandaag", zoek: ["luchten", "ramen open", "ventileren"] },
        { vraag: "Kan ik dekbedden buiten luchten?", ankerCategorie: "huis-tuin", anker: "kan-ik-dekbedden-buiten-luchten", zoek: ["dekbed", "luchten", "beddengoed"] },
        { toolId: "zonnepanelen", zoek: ["zonnepanelen", "opbrengst", "stroom"] },
        { vraag: "Klusweer: welke dag deze week is het droogst?", ankerCategorie: "huis-tuin", anker: "klusweer-droogste-dag", zoek: ["klussen", "klusweer", "droogste dag"] },
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
        { vraag: "Do I need gloves, a hat or a scarf?", ankerCategorie: "kleding", anker: "heb-ik-handschoenen-muts-of-sjaal-nodig", zoek: ["gloves", "hat", "scarf", "winter"] },
        { vraag: "Do I need sunglasses today?", ankerCategorie: "kleding", anker: "heb-ik-vandaag-een-zonnebril-nodig", zoek: ["sunglasses"] },
      ],
    },
    {
      id: "buiten",
      items: [
        { toolId: "terras", zoek: ["patio", "terrace", "sit outside", "drinks"] },
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
        { toolId: "buiten-sporten", zoek: ["workout", "training", "bootcamp"] },
        { toolId: "wandelen", zoek: ["walk", "walking"] },
        { toolId: "padel-of-tennis", zoek: ["padel", "tennis", "court"] },
        { vraag: "Training in smog or poor air quality: is it sensible?", ankerCategorie: "sport", anker: "sporten-bij-smog-of-slechte-lucht", zoek: ["smog", "air quality"] },
      ],
    },
    {
      id: "huis-tuin",
      items: [
        { toolId: "was-buiten-drogen", zoek: ["laundry", "dry", "washing", "line"] },
        { toolId: "auto-wassen", zoek: ["car wash", "car"] },
        { vraag: "Can I paint or stain outside?", ankerCategorie: "huis-tuin", anker: "kan-ik-buiten-schilderen-of-beitsen", zoek: ["paint", "stain", "fence", "sealant"] },
        { toolId: "grasmaaien", zoek: ["lawn", "mow", "garden"] },
        { vraag: "Can I garden today?", ankerCategorie: "huis-tuin", anker: "kan-ik-tuinieren-vandaag", zoek: ["garden", "gardening", "plants"] },
        { toolId: "ramen-wassen", zoek: ["windows", "wash"] },
        { vraag: "Can I air the house today?", ankerCategorie: "huis-tuin", anker: "kan-ik-mijn-huis-luchten-vandaag", zoek: ["air", "ventilate", "windows open"] },
        { vraag: "Can I air duvets outside?", ankerCategorie: "huis-tuin", anker: "kan-ik-dekbedden-buiten-luchten", zoek: ["duvet", "air", "bedding"] },
        { toolId: "zonnepanelen", zoek: ["solar panels", "yield", "power"] },
        { vraag: "DIY weather: which day this week is driest?", ankerCategorie: "huis-tuin", anker: "klusweer-droogste-dag", zoek: ["diy", "driest day"] },
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
        { toolId: "gladheid", zoek: ["icy", "black ice", "slippery"] },
      ],
    },
  ],
});
