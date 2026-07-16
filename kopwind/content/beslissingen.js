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
        { toolId: "regen-timing", zoek: ["regen", "wanneer", "bui", "droog venster"] },
        { vraag: "Word ik vandaag nat?", zoek: ["nat", "regen", "bui"] },
        { vraag: "Blijft het vandaag droog?", zoek: ["droog"] },
        { vraag: "Blijf ik vanavond droog?", zoek: ["avond", "droog"] },
        { vraag: "Moet ik een regenjas aan?", zoek: ["regenjas", "jas", "regen"] },
      ],
    },
    {
      id: "kleding",
      items: [
        { toolId: "wat-trek-ik-aan", zoek: ["kleding", "aan", "outfit", "laagjes"] },
        { variantId: "jas", zoek: ["jas"] },
        { variantId: "korte-broek", zoek: ["korte broek", "shorts"] },
        { variantId: "t-shirt", zoek: ["t-shirt", "shirt"] },
        { vraag: "Heb ik handschoenen, muts of sjaal nodig?", zoek: ["handschoenen", "muts", "sjaal", "winter"] },
        { vraag: "Heb ik vandaag een zonnebril nodig?", zoek: ["zonnebril"] },
      ],
    },
    {
      id: "buiten",
      items: [
        { toolId: "terras", zoek: ["terras", "buiten zitten", "borrel", "bier"] },
        { toolId: "barbecue", zoek: ["bbq", "barbecue", "grillen"] },
        { vraag: "Is het strandweer vandaag?", zoek: ["strand", "zee"] },
        { vraag: "Is het picknickweer vandaag?", zoek: ["picknick", "buiten eten"] },
        { vraag: "Kan ik buiten zwemmen?", zoek: ["zwemmen", "water"] },
        { vraag: "Is het sterrenkijkweer vanavond?", zoek: ["sterren", "sterrenkijken", "helder"] },
      ],
    },
    {
      id: "sport",
      items: [
        { toolId: "fiets-naar-werk", zoek: ["fiets", "fietsen", "woon-werk", "wind"] },
        { vraag: "Is het hardloopweer vandaag?", zoek: ["hardlopen", "rennen", "runnen"] },
        { vraag: "Kan ik buiten sporten vandaag?", zoek: ["sporten", "training", "bootcamp"] },
        { vraag: "Kan ik wandelen vandaag?", zoek: ["wandelen", "lopen"] },
        { vraag: "Kan ik vandaag padellen of tennissen?", zoek: ["padel", "tennis", "baan"] },
        { vraag: "Kan ik vandaag suppen of kajakken?", zoek: ["sup", "suppen", "kajak", "kano", "watersport"] },
      ],
    },
    {
      id: "huis-tuin",
      items: [
        { toolId: "was-buiten-drogen", zoek: ["was", "drogen", "wasgoed", "waslijn"] },
        { vraag: "Kan ik de auto wassen vandaag?", ankerCategorie: "huis-tuin", anker: "kan-ik-de-auto-wassen-vandaag", zoek: ["auto wassen", "auto"] },
        { vraag: "Kan ik buiten schilderen of beitsen?", ankerCategorie: "huis-tuin", anker: "kan-ik-buiten-schilderen-of-beitsen", zoek: ["schilderen", "beitsen", "verf", "schutting", "kitten"] },
        { vraag: "Kan ik grasmaaien vandaag?", ankerCategorie: "huis-tuin", anker: "kan-ik-grasmaaien-vandaag", zoek: ["gras", "maaien", "tuin"] },
        { vraag: "Kan ik tuinieren vandaag?", ankerCategorie: "huis-tuin", anker: "kan-ik-tuinieren-vandaag", zoek: ["tuinieren", "tuin", "planten"] },
        { vraag: "Kan ik mijn ramen wassen vandaag?", ankerCategorie: "huis-tuin", anker: "kan-ik-mijn-ramen-wassen-vandaag", zoek: ["ramen", "wassen"] },
        { vraag: "Kan ik het huis luchten vandaag?", ankerCategorie: "huis-tuin", anker: "kan-ik-mijn-huis-luchten-vandaag", zoek: ["luchten", "ramen open", "ventileren"] },
        { vraag: "Kan ik dekbedden buiten luchten?", ankerCategorie: "huis-tuin", anker: "kan-ik-dekbedden-buiten-luchten", zoek: ["dekbed", "luchten", "beddengoed"] },
        { vraag: "Leveren mijn zonnepanelen vandaag veel op?", zoek: ["zonnepanelen", "opbrengst", "stroom"] },
      ],
    },
    {
      id: "gezondheid",
      items: [
        { toolId: "zonkracht", zoek: ["zonnebrand", "smeren", "uv", "zonkracht", "verbranden", "zonnen"] },
        { toolId: "hooikoorts", zoek: ["hooikoorts", "pollen", "niezen", "allergie"] },
      ],
    },
    {
      id: "winter",
      items: [
        { vraag: "Moet ik morgen krabben?", zoek: ["krabben", "vorst", "ijs", "autoruit"] },
        { vraag: "Is het glad op de weg?", zoek: ["glad", "gladheid", "ijzel"] },
      ],
    },
  ],
  en: [
    {
      id: "regen",
      items: [
        { toolId: "paraplu", zoek: ["umbrella", "rain", "shower", "wet"] },
        { toolId: "regen-timing", zoek: ["rain", "when", "shower", "dry window"] },
        { vraag: "Will I get wet today?", zoek: ["wet", "rain", "shower"] },
        { vraag: "Will it stay dry today?", zoek: ["dry"] },
        { vraag: "Will I stay dry tonight?", zoek: ["evening", "dry"] },
        { vraag: "Do I need a raincoat?", zoek: ["raincoat", "coat", "rain"] },
      ],
    },
    {
      id: "kleding",
      items: [
        { toolId: "wat-trek-ik-aan", zoek: ["clothing", "wear", "outfit", "layers"] },
        { variantId: "jas", zoek: ["coat", "jacket"] },
        { variantId: "korte-broek", zoek: ["shorts"] },
        { variantId: "t-shirt", zoek: ["t-shirt", "shirt"] },
        { vraag: "Do I need gloves, a hat or a scarf?", zoek: ["gloves", "hat", "scarf", "winter"] },
        { vraag: "Do I need sunglasses today?", zoek: ["sunglasses"] },
      ],
    },
    {
      id: "buiten",
      items: [
        { toolId: "terras", zoek: ["patio", "terrace", "sit outside", "drinks"] },
        { toolId: "barbecue", zoek: ["bbq", "barbecue", "grill"] },
        { vraag: "Is it beach weather today?", zoek: ["beach", "sea"] },
        { vraag: "Is it picnic weather today?", zoek: ["picnic", "eat outside"] },
        { vraag: "Can I swim outside?", zoek: ["swim", "water"] },
        { vraag: "Is tonight good for stargazing?", zoek: ["stars", "stargazing", "clear"] },
      ],
    },
    {
      id: "sport",
      items: [
        { toolId: "fiets-naar-werk", zoek: ["bike", "cycling", "commute", "wind"] },
        { vraag: "Is it running weather today?", zoek: ["running", "run"] },
        { vraag: "Can I work out outside today?", zoek: ["workout", "training", "bootcamp"] },
        { vraag: "Can I go for a walk today?", zoek: ["walk", "walking"] },
        { vraag: "Can I play padel or tennis today?", zoek: ["padel", "tennis", "court"] },
        { vraag: "Can I go paddleboarding or kayaking today?", zoek: ["sup", "paddleboard", "kayak", "canoe", "watersport"] },
      ],
    },
    {
      id: "huis-tuin",
      items: [
        { toolId: "was-buiten-drogen", zoek: ["laundry", "dry", "washing", "line"] },
        { vraag: "Can I wash the car today?", ankerCategorie: "huis-tuin", anker: "kan-ik-de-auto-wassen-vandaag", zoek: ["car wash", "car"] },
        { vraag: "Can I paint or stain outside?", ankerCategorie: "huis-tuin", anker: "kan-ik-buiten-schilderen-of-beitsen", zoek: ["paint", "stain", "fence", "sealant"] },
        { vraag: "Can I mow the lawn today?", ankerCategorie: "huis-tuin", anker: "kan-ik-grasmaaien-vandaag", zoek: ["lawn", "mow", "garden"] },
        { vraag: "Can I garden today?", ankerCategorie: "huis-tuin", anker: "kan-ik-tuinieren-vandaag", zoek: ["garden", "gardening", "plants"] },
        { vraag: "Can I wash my windows today?", ankerCategorie: "huis-tuin", anker: "kan-ik-mijn-ramen-wassen-vandaag", zoek: ["windows", "wash"] },
        { vraag: "Can I air the house today?", ankerCategorie: "huis-tuin", anker: "kan-ik-mijn-huis-luchten-vandaag", zoek: ["air", "ventilate", "windows open"] },
        { vraag: "Can I air duvets outside?", ankerCategorie: "huis-tuin", anker: "kan-ik-dekbedden-buiten-luchten", zoek: ["duvet", "air", "bedding"] },
        { vraag: "Will my solar panels produce a lot today?", zoek: ["solar panels", "yield", "power"] },
      ],
    },
    {
      id: "gezondheid",
      items: [
        { toolId: "zonkracht", zoek: ["sunscreen", "uv", "sunburn", "burn", "sunbathe"] },
        { toolId: "hooikoorts", zoek: ["hay fever", "pollen", "sneezing", "allergy"] },
      ],
    },
    {
      id: "winter",
      items: [
        { vraag: "Do I need to scrape tomorrow?", zoek: ["scrape", "frost", "ice", "windscreen"] },
        { vraag: "Are the roads icy?", zoek: ["icy", "black ice", "slippery"] },
      ],
    },
  ],
});
