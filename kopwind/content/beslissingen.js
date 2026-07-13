/**
 * content/beslissingen.js
 *
 * De catalogus achter /alle-checks (v3.4.0 "Ponente"): alle
 * weerbeslissingen op een plek. Live checks verwijzen naar hun toolId;
 * geplande vragen staan als tekst op de pagina (leesbaar voor bezoeker
 * en zoekmachine) en worden klikbaar zodra de check bestaat. Categorien
 * zijn bewust breder dan het huidige aanbod: sport, eten en
 * buitenactiviteiten groeien hier later in.
 */

import { kies } from "../lib/i18n/locale.js";

export const CATEGORIEEN = kies({
  nl: [
    {
      id: "regen",
      titel: "Regen en nat",
      items: [
        { vraag: "Kan de was vandaag buiten drogen?", toolId: "was-buiten-drogen", zoek: ["was", "drogen", "wasgoed", "waslijn"] },
        { vraag: "Word ik vandaag nat?", zoek: ["nat", "regen", "bui"] },
        { vraag: "Wanneer gaat het regenen vandaag?", zoek: ["regen", "wanneer", "bui"] },
        { vraag: "Moet ik een paraplu meenemen?", zoek: ["paraplu"] },
        { vraag: "Blijft het vandaag droog?", zoek: ["droog"] },
        { vraag: "Blijf ik vanavond droog?", zoek: ["avond", "droog"] },
      ],
    },
    {
      id: "kleding",
      titel: "Kleding",
      items: [
        { vraag: "Wat trek ik vandaag aan?", toolId: "wat-trek-ik-aan", zoek: ["kleding", "aan", "outfit", "laagjes"] },
        { vraag: "Kan ik een korte broek aan?", variantId: "korte-broek", zoek: ["korte broek", "shorts"] },
        { vraag: "Moet ik een jas aan?", variantId: "jas", zoek: ["jas"] },
        { vraag: "Is het T-shirtweer vandaag?", variantId: "t-shirt", zoek: ["t-shirt", "shirt"] },
        { vraag: "Heb ik handschoenen, muts of sjaal nodig?", zoek: ["handschoenen", "muts", "sjaal", "winter"] },
        { vraag: "Heb ik vandaag een zonnebril nodig?", zoek: ["zonnebril"] },
      ],
    },
    {
      id: "buiten",
      titel: "Buiten en vrije tijd",
      items: [
        { vraag: "Is het terrasweer vandaag?", toolId: "terras", zoek: ["terras", "buiten zitten", "borrel", "bier"] },
        { vraag: "Is het barbecueweer vandaag?", toolId: "barbecue", zoek: ["bbq", "barbecue", "grillen"] },
        { vraag: "Moet ik vandaag smeren?", toolId: "zonkracht", zoek: ["zonnebrand", "smeren", "uv", "zonkracht", "verbranden", "zonnen"] },
        { vraag: "Krijg ik vandaag hooikoorts?", toolId: "hooikoorts", zoek: ["hooikoorts", "pollen", "niezen", "allergie"] },
        { vraag: "Is het strandweer vandaag?", zoek: ["strand", "zee"] },
        { vraag: "Is het picknickweer vandaag?", zoek: ["picknick", "buiten eten"] },
        { vraag: "Kan ik buiten zwemmen?", zoek: ["zwemmen", "water"] },
      ],
    },
    {
      id: "sport",
      titel: "Sport",
      items: [
        { vraag: "Kan ik vandaag fietsen naar werk?", toolId: "fiets-naar-werk", zoek: ["fiets", "fietsen", "woon-werk", "wind"] },
        { vraag: "Is het hardloopweer vandaag?", zoek: ["hardlopen", "rennen", "runnen"] },
        { vraag: "Kan ik buiten sporten vandaag?", zoek: ["sporten", "training", "bootcamp"] },
        { vraag: "Kan ik wandelen vandaag?", zoek: ["wandelen", "lopen"] },
        { vraag: "Kan ik vandaag padellen of tennissen?", zoek: ["padel", "tennis", "baan"] },
        { vraag: "Kan ik vandaag suppen of kajakken?", zoek: ["sup", "suppen", "kajak", "kano", "watersport"] },
      ],
    },
    {
      id: "huis",
      titel: "Huis en tuin",
      items: [
        { vraag: "Kan ik de auto wassen vandaag?", zoek: ["auto wassen", "auto"] },
        { vraag: "Kan ik buiten schilderen of beitsen?", zoek: ["schilderen", "beitsen", "verf", "schutting", "kitten"] },
        { vraag: "Kan ik grasmaaien vandaag?", zoek: ["gras", "maaien", "tuin"] },
        { vraag: "Kan ik mijn ramen wassen vandaag?", zoek: ["ramen", "wassen"] },
        { vraag: "Kan ik het huis luchten vandaag?", zoek: ["luchten", "ramen open", "ventileren"] },
        { vraag: "Kan ik dekbedden buiten luchten?", zoek: ["dekbed", "luchten", "beddengoed"] },
      ],
    },
    {
      id: "onderweg",
      titel: "Onderweg en seizoen",
      items: [
        { vraag: "Moet ik morgen krabben?", zoek: ["krabben", "vorst", "ijs", "autoruit"] },
        { vraag: "Is het glad op de weg?", zoek: ["glad", "gladheid", "ijzel"] },
        { vraag: "Is het sterrenkijkweer vanavond?", zoek: ["sterren", "sterrenkijken", "helder"] },
        { vraag: "Leveren mijn zonnepanelen vandaag veel op?", zoek: ["zonnepanelen", "opbrengst", "stroom"] },
      ],
    },
  ],
  en: [
    {
      id: "regen",
      titel: "Rain and wet",
      items: [
        { vraag: "Can I dry laundry outside today?", toolId: "was-buiten-drogen", zoek: ["laundry", "dry", "washing", "line"] },
        { vraag: "Will I get wet today?", zoek: ["wet", "rain", "shower"] },
        { vraag: "When will it rain today?", zoek: ["rain", "when"] },
        { vraag: "Do I need an umbrella?", zoek: ["umbrella"] },
        { vraag: "Will it stay dry today?", zoek: ["dry"] },
        { vraag: "Will I stay dry tonight?", zoek: ["evening", "dry"] },
      ],
    },
    {
      id: "kleding",
      titel: "Clothing",
      items: [
        { vraag: "What should I wear today?", toolId: "wat-trek-ik-aan", zoek: ["wear", "outfit", "layers", "clothing"] },
        { vraag: "Can I wear shorts today?", variantId: "korte-broek", zoek: ["shorts"] },
        { vraag: "Do I need a coat today?", variantId: "jas", zoek: ["coat", "jacket"] },
        { vraag: "Is it T-shirt weather today?", variantId: "t-shirt", zoek: ["t-shirt", "shirt"] },
        { vraag: "Do I need gloves, a hat or a scarf?", zoek: ["gloves", "hat", "scarf", "winter"] },
        { vraag: "Do I need sunglasses today?", zoek: ["sunglasses"] },
      ],
    },
    {
      id: "buiten",
      titel: "Outdoors and leisure",
      items: [
        { vraag: "Is it patio weather today?", toolId: "terras", zoek: ["patio", "terrace", "sit outside", "drinks"] },
        { vraag: "Is it BBQ weather today?", toolId: "barbecue", zoek: ["bbq", "barbecue", "grill"] },
        { vraag: "Do I need sunscreen today?", toolId: "zonkracht", zoek: ["sunscreen", "uv", "burn", "sunbathe"] },
        { vraag: "Will I get hay fever today?", toolId: "hooikoorts", zoek: ["hay fever", "pollen", "allergy", "sneeze"] },
        { vraag: "Is it beach weather today?", zoek: ["beach", "sea"] },
        { vraag: "Is it picnic weather today?", zoek: ["picnic", "eat outside"] },
        { vraag: "Can I swim outdoors?", zoek: ["swim", "water"] },
      ],
    },
    {
      id: "sport",
      titel: "Sport",
      items: [
        { vraag: "Can I bike to work today?", toolId: "fiets-naar-werk", zoek: ["bike", "cycle", "commute", "wind"] },
        { vraag: "Is it running weather today?", zoek: ["running", "run"] },
        { vraag: "Can I exercise outside today?", zoek: ["exercise", "workout", "training"] },
        { vraag: "Can I go for a walk today?", zoek: ["walk", "hike"] },
        { vraag: "Can I play padel or tennis today?", zoek: ["padel", "tennis", "court"] },
        { vraag: "Can I go paddleboarding or kayaking?", zoek: ["sup", "paddleboard", "kayak", "canoe"] },
      ],
    },
    {
      id: "huis",
      titel: "Home and garden",
      items: [
        { vraag: "Can I wash the car today?", zoek: ["car wash", "car"] },
        { vraag: "Can I paint or stain outside?", zoek: ["paint", "stain", "fence", "caulk"] },
        { vraag: "Can I mow the lawn today?", zoek: ["mow", "lawn", "garden"] },
        { vraag: "Can I clean my windows today?", zoek: ["windows", "clean"] },
        { vraag: "Can I air the house today?", zoek: ["air", "ventilate", "windows open"] },
        { vraag: "Can I air the duvets outside?", zoek: ["duvet", "bedding", "air"] },
      ],
    },
    {
      id: "onderweg",
      titel: "On the road and seasons",
      items: [
        { vraag: "Do I need to scrape tomorrow?", zoek: ["scrape", "frost", "ice", "windscreen"] },
        { vraag: "Are the roads icy?", zoek: ["icy", "black ice", "slippery"] },
        { vraag: "Is it stargazing weather tonight?", zoek: ["stars", "stargazing", "clear"] },
        { vraag: "Will my solar panels produce much today?", zoek: ["solar", "panels", "yield"] },
      ],
    },
  ],
});
