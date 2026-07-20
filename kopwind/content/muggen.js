/**
 * content/muggen.js
 * SEO-content voor de muggencheck (v3.31.0 "Sirocco").
 */

export const seo = {
  title: "Is het muggenweer vanavond? Check de muggenactiviteit",
  description:
    "Kun je vanavond rustig buiten zitten of word je opgegeten? De check schat de muggenactiviteit op basis van warmte, vocht, wind en de schemering. Gratis.",
  h1: "Is het muggenweer vanavond?",
  intro:
    "Kun je vanavond rustig buiten zitten, of word je opgegeten? Muggen zijn het actiefst bij warm, vochtig en windstil weer, vooral rond de schemering en dicht bij stilstaand water. Deze check schat de muggenactiviteit voor het moment dat jij buiten bent. Let op: de score is de activiteit, dus een gunstig, groen oordeel betekent juist WEINIG muggen. Het is een inschatting op basis van het weer, geen exacte muggenteller.",
};

export const blokken = [
  {
    kop: "Warm, vochtig en windstil is hun favoriet",
    tekst:
      "Muggen komen tot leven bij warmte: onder een graad of tien vliegen ze nauwelijks, daarboven worden ze snel actiever. Hoge luchtvochtigheid houden ze van, en windstil weer laat ze ongestoord vliegen. Wind is juist hun vijand: boven de twaalf km/u worden ze zo goed als weggeblazen en houden ze zich schuil. De check combineert die factoren tot een activiteitsscore voor de periode die jij kiest, van namiddag tot laat op de avond.",
  },
  {
    kop: "De schemering is het spitsuur",
    tekst:
      "Steekmuggen zijn vooral in de schemering en het eerste deel van de avond actief: dan gaan ze op zoek naar een prik. Overdag zitten ze weggekropen op koele, vochtige plekken. Daarom richt de check zich standaard op de avond en de schemering, maar je kunt ook de namiddag of de late avond kiezen. Rond zonsondergang zit doorgaans de piek, en dat is precies het moment waarop je op het terras wilt zitten.",
  },
  {
    kop: "Water in de buurt maakt het erger",
    tekst:
      "Muggen leggen hun eitjes in stilstaand water, dus vlak bij een sloot, vijver of plas zijn er simpelweg meer. Geef in de check aan of je dicht bij water zit, dan schuift de inschatting mee. Word je van nature snel gestoken, zet dat er ook bij; dan kijkt de check strenger. Ruim trouwens stilstaand water in je eigen tuin op, in emmers, schotels en verstopte goten, want dat is hun kraamkamer.",
  },
];

export const faq = [
  {
    v: "Bij welk weer zijn er de meeste muggen?",
    a: "Warm, vochtig en windstil weer, vooral rond de schemering. Boven een graad of vijftien worden muggen echt actief, en hoge luchtvochtigheid maakt het nog aantrekkelijker voor ze. Wind is hun grote vijand: vanaf een km/u of twaalf worden ze grotendeels weggeblazen. De check combineert die factoren tot een activiteitsscore.",
  },
  {
    v: "Waarom betekent groen weinig muggen en niet veel?",
    a: "Deze check meet de muggenactiviteit, en veel muggen is nou juist wat je niet wilt. Daarom is de logica omgedraaid ten opzichte van de meeste checks: een gunstig, groen oordeel betekent weinig muggen en dus een fijne avond buiten, en een rood oordeel betekent een muggenplaag. De uitleg bij de uitslag maakt het steeds duidelijk.",
  },
  {
    v: "Word ik echt meer gestoken dan een ander?",
    a: "Sommige mensen zijn voor muggen aantrekkelijker, onder meer door hun huidgeur, lichaamswarmte en de hoeveelheid CO2 die ze uitademen. Dat verschilt echt per persoon. Geef in de check aan of jij snel gestoken wordt, dan schuift de inschatting strenger, zodat je eerder gewaarschuwd bent om je in te smeren.",
  },
  {
    v: "Wat helpt het beste tegen muggen buiten?",
    a: "Een goede muggenspray met DEET of icaridine werkt het meest betrouwbaar op je huid. Buiten helpen een muggenkaars of een ventilator (muggen zijn slechte vliegers en houden niet van wind), en binnen zijn horren de rust zelve. Ruim stilstaand water in de tuin op. Wil je weten wat je aantrekt voor een avond buiten, kijk dan ook even bij de [kledingcheck](tool:wat-trek-ik-aan).",
  },
];
