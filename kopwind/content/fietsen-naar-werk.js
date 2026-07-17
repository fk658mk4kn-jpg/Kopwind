/**
 * content/fietsen-naar-werk.js
 * SEO-teksten en FAQ van de vlaggendrager, gescheiden van code (§4).
 */

export const seo = {
  title: "Fietsen naar werk vandaag: kan het en wordt het goed fietsweer?",
  description:
    "Kan ik vandaag fietsen naar werk? Check je woon-werkrit: reistijd, fietsweer, wind tegen per deel van de route, regen en temperatuur. Gratis, direct advies.",
  h1: "Kan ik vandaag fietsen naar werk?",
  intro:
    "Check in een oogopslag of fietsen naar werk vandaag een goed idee is: reistijd, wind (en waar op de route je die tegen hebt), regen en temperatuur voor jouw woon-werkrit. Gratis, zonder account, met meldingen op je telefoon.",
};

export const blokken = [
  {
    kop: "Zo werkt de fietscheck voor woon-werkverkeer",
    tekst:
      "Vul je route in: van huis naar werk, met als je wilt een tussenstop zoals de sportschool of school. Kies vertrekken nu, een vertrektijd of een aankomsttijd (dan rekenen we terug wanneer je weg moet). De check haalt je fietsroute op, splitst hem in stukken van zo'n 300 meter en rekent per stuk uit hoeveel wind je tegen hebt op het uur dat je daar fietst. Elke rit krijgt een oordeel van Zeer slecht tot Ideaal en een advies: prima fietsdag, pittige rit, of vandaag liever niet.",
  },
  {
    kop: "Wind tegen op de fiets: zie waar en hoe hard",
    tekst:
      "Windkracht 4 zegt weinig als de wind schuin mee staat. Daarom rekent de check met de richting van elk stuk route: tegenwind is windsnelheid maal de cosinus van het verschil tussen windrichting en rijrichting. Op de kaart kleurt je route van groen (wind mee) via amber naar rood (wind tegen), met pijlen die laten zien waar de wind vandaan komt. Zo weet je vooraf of dat ene stuk langs het water de rit zwaar maakt, en of een alternatieve fietsroute naar werk minder tegenwind heeft.",
  },
  {
    kop: "Het beste moment om naar werk te fietsen",
    tekst:
      "Het weer om 8 uur is niet het weer om 17 uur. De check gebruikt de uurvoorspelling: je heenrit en je terugrit krijgen elk hun eigen wind, regen en temperatuur. Schuif met je vertrektijd en je ziet direct of een uurtje eerder of later vertrekken een droge of snellere rit oplevert.",
  },
  {
    kop: "Meldingen op je telefoon: elke ochtend je fietsadvies",
    tekst:
      "Sla je woon-werkroute op en stel per route in wanneer je een melding wilt: welke dagen, hoe laat, en of je alleen gewaarschuwd wilt worden op dagen dat het tegenzit. Werkt op Android, iPhone en desktop: op Android en in Chrome of Edge zet je de check met een knop op je beginscherm, op iPhone via de deelknop (vanaf iOS 16.4). Apparaten koppel je met een synccode, zonder account of e-mailadres.",
  },
];

export const faq = [
  {
    v: "Kan ik vandaag fietsen naar werk?",
    a: "Vul je route in (thuis naar werk, eventueel met een tussenstop) en kies vertrekken nu of een vertrektijd. Je ziet direct het fietsweer voor jouw rit: wind per deel van de route, regen, temperatuur en een duidelijk ja of nee met advies.",
  },
  {
    v: "Hoeveel wind is te veel om te fietsen?",
    a: "Vanaf zo'n 4 Beaufort tegenwind wordt fietsen merkbaar zwaarder, bij 5 tot 6 Beaufort wordt het pittig. Windkracht alleen zegt weinig: het gaat erom hoeveel wind je tegen hebt. Deze check rekent per stuk route uit hoeveel tegenwind je krijgt op het uur dat je daar fietst.",
  },
  {
    v: "Wat is goed fietsweer?",
    a: "Droog, een gevoelstemperatuur boven een graad of 5 en weinig wind tegen (of wind mee). In de check is dat Goed of Ideaal: een prima fietsdag. In de winter komt het wegdek erbij: check bij vorst even [de gladheidscheck](tool:gladheid).",
  },
  {
    v: "Kan ik ook mijn terugrit en tussenstops checken?",
    a: "Ja. Je plant je hele dag als een keten: heen, eventueel via de sportschool, en weer terug. Elke rit krijgt zijn eigen oordeel op zijn eigen tijdstip, en de zwaarste rit bepaalt het dagadvies, want de fiets gaat mee of niet.",
  },
  {
    v: "Krijg ik ook meldingen op mijn telefoon?",
    a: "Ja. Koppel je apparaten met een synccode en stel per route in op welke dagen en tijden je een briefing wilt, of een herinnering voor vertrek. Op Android en desktop (Chrome, Edge, Firefox) werken de meldingen direct in de browser en kun je de check met een knop op je beginscherm zetten. Op iPhone zet je de site eerst op je beginscherm via de deelknop (vanaf iOS 16.4); daarna komen de meldingen binnen als gewone pushberichten, ook als de app dicht is.",
  },
  {
    v: "Fietsen met windkracht 5: is dat te doen?",
    a: "Fietsen met windkracht 5 (rond de 30 tot 38 km/u) is te doen maar stevig werk: tegenwind kost je zomaar een derde van je snelheid en zijwind duwt je uit koers, zeker op open stukken en bruggen. De fietscheck rekent de wind per rijrichting door, dus je ziet of juist de heen- of de terugrit de zware wordt.",
  },
  {
    v: "Fietsen in de regen: vertrek ik beter eerder of later?",
    a: "Fietsen in de regen is vaak te vermijden door slim te schuiven: de meeste buien zijn korter dan een half uur. De check vergelijkt je vertrektijd met de buientiming, dus je ziet of tien minuten eerder of later vertrekken je droog houdt. Bij lange regenperiodes is de keus simpeler: regenpak aan of ander vervoer.",
  },
];
