/**
 * content/slippers-weer.js
 * Vraagpagina op de kledingcheck (v3.25.0 "Pampero"): eigen antwoord op
 * de slippersvraag, de volledige check van de ouder eronder.
 */

export const seo = {
  title: "Is het slippersweer vandaag? Direct ja of nee",
  description:
    "Is het slippersweer vandaag? Direct antwoord op gevoelstemperatuur en regen: ja, nee of een twijfelgeval met reden. Gratis, zonder account.",
  intro:
    "Slippers vragen net iets meer van het weer dan een korte broek: warme voeten willen echte zomerse graden, en natte zolen zijn glad. Deze check geeft direct ja of nee, met het volledige kledingadvies eronder.",
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
];
