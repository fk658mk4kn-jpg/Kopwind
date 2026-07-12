/**
 * content/hub.js
 * Teksten van de hub-homepage. Copy vanuit de gebruiker geschreven:
 * voordeel en gebruik, geen strategie (P0-D), en een rijkere FAQ met
 * interne verwijzingen naar de tools (P2-B).
 */

export const hub = {
  intro:
    "Geen weerbericht, maar een antwoord. Met het wanneer en waar erbij. Elke dag dezelfde kleine vragen: fiets ik naar werk, kan de was buiten, wat trek ik aan? Kan het vandaag? beantwoordt ze met live weer voor jouw plek, in een cijfer dat je in een seconde leest.",
  blokken: [
    {
      kop: "Een cijfer, geen weerkaart",
      tekst:
        "Je krijgt een antwoord, geen tabel. Elke check weegt precies de factoren die er voor die ene beslissing toe doen: wind tegen op jouw route, luchtvochtigheid boven jouw waslijn. Dat wordt een rapportcijfer met een korte uitleg. 10 is uitzonderlijk, een 6 is een normale Hollandse dag, onder de 4 doe je het vandaag niet.",
    },
    {
      kop: "Op je beginscherm, op jouw momenten",
      tekst:
        "Eén keer instellen, elke ochtend je antwoord. Zet de check op je beginscherm (werkt op Android, iPhone en desktop), koppel je telefoon en laptop met een synccode zonder account, en kies zelf je meldingen: de fietsbriefing om 07:00 op werkdagen, de wascheck alleen als het echt een drooghangdag is.",
    },
  ],
  faq: [
    {
      v: "Wat is Kan het vandaag?",
      a: "Een verzameling kleine, gratis beslistools op basis van live weer. Vandaag op de fiets? checkt je woon-werkrit op wind, regen en temperatuur; Vandaag de was buiten? laat het beste droogvenster van de dag zien. Elke tool geeft een rapportcijfer met korte uitleg, zonder account.",
    },
    {
      v: "Is de weerdata actueel?",
      a: "Ja. Elke check haalt op het moment zelf de nieuwste uurvoorspelling op (Open-Meteo) en toont het tijdstip erbij. Het blijft een voorspelling, geen meetstation.",
    },
    {
      v: "Wat betekent het cijfer?",
      a: "Een rapportcijfer voor de beslissing, niet voor het weer in het algemeen. 8 of hoger is een makkelijke ja, rond de 6 kan het maar voel je het, onder de 4 kun je het beter laten. De uitleg eronder vertelt altijd waarom, zodat cijfer en verhaal kloppen.",
    },
    {
      v: "Kan ik dit op mijn telefoon zetten?",
      a: "Ja, als app op je beginscherm. Op Android en desktop verschijnt een knop Zet op beginscherm; op iPhone en iPad gebruik je de deelknop en kies je Zet op beginscherm. Daarna opent de check als een app en kun je meldingen aanzetten.",
    },
    {
      v: "Krijg ik meldingen op de momenten die ik kies?",
      a: "Ja. Per route en per check stel je in op welke dagen en tijden je een seintje wilt, en of je alleen iets wilt horen als het advies goed of juist slecht uitvalt. Apparaten koppel je met een synccode; een account of e-mailadres is niet nodig.",
    },
    {
      v: "Komen er meer checks bij?",
      a: "Ja, de familie groeit. Naast de fietscheck, wascheck, kledingcheck en terrascheck staan barbecueweer, regen-timing en gladheid op de rol, met dezelfde opzet: een concreet antwoord op een dagelijkse vraag, in een cijfer met het beste moment erbij.",
    },
  ],
};
