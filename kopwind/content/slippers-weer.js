/**
 * content/slippers-weer.js
 * Vraagpagina op de kledingcheck (v3.25.0 "Pampero"): eigen antwoord op
 * de slippersvraag, de volledige check van de ouder eronder.
 */

export const seo = {
  title: "Is het slippersweer vandaag? Check het in een tik",
  description:
    "Is het slippersweer vandaag? Direct antwoord op gevoelstemperatuur en regen: het antwoord met de reden erbij, ook bij een twijfelgeval. Gratis, zonder account.",
  h1: "Is het slippersweer vandaag?",
  intro:
    "Slippers vragen net iets meer van het weer dan een korte broek: warme voeten willen echte zomerse graden, en natte zolen zijn glad. Deze check geeft het antwoord in een tik, met het volledige kledingadvies eronder.",
};

export const blokken = [
  {
    kop: "Wanneer is het slippersweer?",
    tekst:
      "Vanaf een gevoelstemperatuur van ruwweg 21 graden lopen slippers de hele dag lekker; tussen de 16 en 21 kan het in de middag prima, maar zijn de ochtend en avond fris aan blote voeten. De check kijkt naar het verloop van de dag, niet alleen naar de piek, want juist voeten voelen het verschil tussen 10:00 en 15:00.",
  },
  {
    kop: "Regen en slippers gaan slecht samen",
    tekst:
      "Rubber op natte tegels is glad, en natte voeten blijven nat. Bij buien op je momenten buiten zet de check het antwoord daarom op twijfel of nee, ook als het warm genoeg is. Handig om even mee te nemen: [wanneer gaat het regenen](tool:regen-timing) laat de buientiming op de minuut zien.",
  },
  {
    kop: "De ochtend en avond zijn de valkuil",
    tekst:
      "Op een warme dag kan het midden op de dag prima slipperweer zijn, terwijl je 's ochtends vroeg en na zonsondergang koude tenen krijgt: blote voeten koelen sneller af dan de rest van je lichaam, zeker als er wind staat. De check kijkt daarom naar het verloop van de dag en jouw momenten buiten, niet alleen naar de warmste piek. Ben je vooral 's avonds op pad, dan valt het oordeel eerder op twijfel.",
  },
];

export const faq = [
  {
    v: "Vanaf welke temperatuur kan ik slippers aan?",
    a: "Als vuistregel: vanaf 21 graden gevoel de hele dag, vanaf een graad of 17 alleen in het middagblok. Dat is bewust iets strenger dan [korte-broek-weer](tool:korte-broek): blote voeten koelen sneller af dan blote benen, zeker bij wind.",
  },
  {
    v: "Waarom zegt de check nee terwijl het warm is?",
    a: "Vrijwel altijd door regen. Natte zolen zijn glad op tegels en in winkels, en doorweekte slippers lopen zwaar. Valt de bui buiten jouw momenten buiten, dan telt hij niet mee.",
  },
  {
    v: "Geldt dit ook voor sandalen?",
    a: "Grotendeels wel: de temperatuurgrens is vergelijkbaar. Sandalen met een hielband zitten vaster en zijn bij een spatje regen minder glad, dus daar mag je het twijfelgeval ruimer nemen.",
  },
  {
    v: "Kan ik op slippers fietsen?",
    a: "Het mag, maar loszittende slippers kunnen van het pedaal glijden of ertussen komen, wat op de fiets gevaarlijk is. Sandalen met een hielband zitten vaster en zijn een veiliger keuze onderweg. Deze check gaat over het weer, niet over de veiligheid, dus houd dat zelf in gedachten.",
  },
  {
    v: "Is het 's avonds nog slippersweer?",
    a: "Vaak niet. Zodra de zon zakt, koelt het snel af en voelen blote voeten dat als eerste. Zet je buitentijd in de check op de avond, dan weegt het de avonduren mee en krijg je eerder een nee of twijfel dan bij een middagtrip.",
  },
];
