/** content/wanneer-gaat-het-regenen.js: SEO-tekst regen-timing. */

export const seo = {
  title: "Wanneer gaat het regenen vandaag?",
  description:
    "Zie wanneer de regen begint, wanneer het weer droog wordt en of er binnen een uur buien vallen bij jou in de buurt. Op de minuut nauwkeurig.",
  h1: "Wanneer gaat het regenen vandaag?",
  intro:
    "Niet alleen of het regent is belangrijk, maar vooral wanneer. Deze check laat zien wanneer de eerstvolgende bui valt, wanneer het weer droog wordt en welke uren het veiligst zijn. Voor Nederland gebruiken we 15-minuten neerslagdata, dus je ziet echt of je die boodschap nog droog haalt.",
};

export const blokken = [
  {
    kop: "Timing telt zwaarder dan de regenkans",
    tekst:
      "Een dag met [40 procent regenkans](hub:regen#regenkans-betekenis) klinkt als een gok, maar als die regen in een blok van een uur valt, is de rest van de dag gewoon droog. Deze check kijkt daarom niet naar het daggemiddelde maar naar het verloop per kwartier: wanneer begint het, hoe lang duurt het, en wanneer klaart het weer op.",
  },
  {
    kop: "Vertrek slim plannen",
    tekst:
      "De vraag achter de vraag is meestal: kan ik nu weg, of kan ik beter even wachten? Met het eerstvolgende regenmoment en het eerstvolgende droge blok zie je in een oogopslag of je die twintig minuten naar de supermarkt droog overbrugt, of dat je de bui beter laat overtrekken.",
  },
  {
    kop: "Hoe betrouwbaar is dit?",
    tekst:
      "De 15-minuten neerslag komt voor Nederland uit de hoge-resolutiemodellen van de Duitse en Franse weerdiensten (ICON-D2 en AROME). Dat is een echte nowcast, geen ruwe interpolatie. Voor het komende uur is dat opvallend nauwkeurig; verder vooruit blijft regen grillig, zeker bij losse zomerbuien.",
  },
];

export const faq = [
  { v: "Regent het binnen een uur?", a: "De check zet dit bovenaan als eerste antwoord, gebaseerd op de neerslag per kwartier voor het komende uur bij jou in de buurt." },
  { v: "Hoe laat begint de regen?", a: "Je ziet het eerstvolgende regenmoment als tijdstip. Valt er nu al regen, dan toont de check wanneer het naar verwachting weer droog wordt." },
  { v: "Wanneer wordt het weer droog?", a: "Als het regent, zoekt de check het eerstvolgende blok van minstens een uur droog en toont dat als starttijd." },
  { v: "Zijn dit losse buien of langdurige regen?", a: "De samenvatting per dagdeel (ochtend, middag, avond) laat zien of het gaat om verspreide buien of aaneengesloten neerslag." },
  {
    v: "Regen vannacht: blijft het droog tot morgenochtend?",
    a: "Regen vannacht check je hier net zo goed als overdag: de tijdlijn loopt door de nacht heen en laat zien of en wanneer er iets valt. Handig voor wasgoed dat buiten hangt, een open raam of de vraag of het gras morgenvroeg droog is.",
  },
  {
    v: "Regenkans per uur: hoe lees ik die?",
    a: "Regenkans per uur is de kans op meetbare neerslag in dat uur op jouw plek, geen maat voor de hoeveelheid. Twee uur met 40 procent achter elkaar betekent dus niet 80 procent; het blijven losse kansen. Deze check combineert de kans met de verwachte hoeveelheid en zegt daarom concreet wanneer de bui valt en wanneer het weer droog is.",
  },
];
