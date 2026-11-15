/**
 * content/rekenhulpen.js
 *
 * Teksten voor de kalender- en rekenpagina's (v3.37.0 "Föhn"). De
 * pagina's rekenen de actuele getallen zelf uit; deze teksten noemen
 * geen jaartallen die volgend jaar verouderen. Eigen stem volgens
 * PLAYBOOK (originaliteit).
 */

import { GIDS_INHOUD } from "./gidsen.js";
import { GIDS3_INHOUD } from "./gidsen3.js";
import { GIDS2_INHOUD } from "./gidsen2.js";

export const REKEN_INHOUD = {
  ...GIDS_INHOUD,
  ...GIDS2_INHOUD,
  ...GIDS3_INHOUD,
  weeknummer: {
    h1: "Welke week is het?",
    intro:
      "Het weeknummer van vandaag staat hieronder groot, met de maandag en zondag van die week. Daaronder het volledige jaaroverzicht met alle weeknummers en hun data, en een zoekveld voor elke andere datum.",
    blokken: [
      {
        kop: "Hoe weeknummers in Nederland werken",
        tekst:
          "Nederland volgt de internationale ISO-norm: een week loopt van maandag tot en met zondag, en week 1 is de week met de eerste donderdag van het jaar. Daardoor kunnen de eerste dagen van januari nog bij week 52 of 53 van het jaar ervoor horen, en de laatste dagen van december al bij week 1 van het nieuwe jaar.",
      },
      {
        kop: "Waarom heeft een jaar soms 53 weken?",
        tekst:
          "Een jaar telt 52 weken en een of twee dagen. Begint het jaar op een donderdag, of in een schrikkeljaar op een woensdag, dan schuift er een extra week in. Dat gebeurt ongeveer eens in de vijf tot zes jaar.",
      },
    ],
    faq: [
      { v: "Begint de week op maandag of zondag?", a: "In Nederland op maandag. In de Verenigde Staten begint de week op zondag en tellen ze weken anders, dus een Amerikaanse agenda kan een ander weeknummer tonen." },
      { v: "Welke week is het volgende week?", a: "Het volgende weeknummer staat in het jaaroverzicht, direct onder de huidige week. Vanaf week 52 of 53 begint het weer bij week 1." },
      { v: "Op welke dag begint week 1?", a: "Altijd op een maandag, ergens tussen 29 december en 4 januari. De exacte datum staat bovenaan het jaaroverzicht." },
    ],
  },
  feestdagen: {
    h1: "Feestdagen en vrije dagen",
    intro:
      "Alle Nederlandse feestdagen van dit jaar en volgend jaar op een rij, met de weekdag waarop ze vallen. Je ziet ook welke feestdagen op een werkdag vallen, want dat bepaalt hoeveel vrije dagen je er echt aan overhoudt.",
    blokken: [
      {
        kop: "Erkend, maar ben je ook vrij?",
        tekst:
          "De wet noemt een vaste reeks algemeen erkende feestdagen, maar regelt niet dat je vrij bent. Dat staat in je cao of arbeidscontract. In de praktijk zijn Nieuwjaarsdag, Tweede Paasdag, Koningsdag, Hemelvaartsdag, Tweede Pinksterdag en beide kerstdagen voor bijna iedereen vrij. Bevrijdingsdag is in veel cao's alleen eens in de vijf jaar vrij, en Goede Vrijdag is voor de meeste mensen een gewone werkdag.",
      },
      {
        kop: "Feestdagen in het weekend",
        tekst:
          "Valt een feestdag op zaterdag of zondag, dan krijg je daar meestal geen extra vrije dag voor terug. Een jaar waarin kerst in het weekend valt, telt dus minder doordeweekse vrije dagen. Het aantal per jaar staat onder elke tabel.",
      },
    ],
    faq: [
      { v: "Hoeveel feestdagen heeft Nederland?", a: "De wet erkent Nieuwjaarsdag, Pasen, Koningsdag, Bevrijdingsdag, Hemelvaartsdag, Pinksteren en de kerstdagen. Eerste Paasdag en Eerste Pinksterdag vallen altijd op zondag. Hoeveel vrije werkdagen dat oplevert, verschilt per jaar en staat onder elke tabel." },
      { v: "Is Goede Vrijdag een vrije dag?", a: "Goede Vrijdag is geen algemeen erkende feestdag en voor de meeste werknemers een gewone werkdag. Sommige cao's geven de dag wel vrij." },
      { v: "Wanneer is Bevrijdingsdag een vrije dag?", a: "Veel cao's geven 5 mei alleen in lustrumjaren vrij, dus in jaren die eindigen op 0 of 5. Check je eigen cao." },
    ],
  },
  schoolvakanties: {
    h1: "Schoolvakanties per regio",
    intro:
      "Alle schoolvakanties voor regio noord, midden en zuid, per schooljaar. De data komen uit de officiele vaststelling van de overheid. Per vakantie staat er een teller die aftelt naar de eerste vrije dag.",
    blokken: [
      {
        kop: "Vaste data en adviesdata",
        tekst:
          "De zomervakantie ligt voor alle scholen vast, net als de kerstvakantie. Voor de herfstvakantie, voorjaarsvakantie en de tweede week van de meivakantie geeft de overheid adviesdata. Scholen mogen daarvan afwijken; de schoolgids noemt de data die voor jouw school gelden.",
      },
      {
        kop: "Waarom drie regio's?",
        tekst:
          "Door de vakanties te spreiden wordt het minder druk op de weg, op vliegvelden en bij vakantieparken. Welke regio als eerste zomervakantie heeft, wisselt per jaar. De indeling gaat per gemeente.",
      },
    ],
    faq: [
      { v: "In welke regio woon ik?", a: "De indeling loopt per gemeente, niet strak per provincie. Je school vermeldt de regio in de schoolgids." },
      { v: "Hoe lang duurt de zomervakantie?", a: "Zes weken, in alle drie de regio's even lang. Alleen de start verschilt." },
      { v: "Gelden deze data ook voor het mbo en hoger onderwijs?", a: "Nee. Mbo-instellingen, hogescholen en universiteiten stellen hun eigen vakanties vast, al houden veel mbo's de regio-indeling aan." },
    ],
  },
  werkdagen: {
    h1: "Werkdagen per maand en berekenen",
    intro:
      "Hoeveel werkdagen heeft dit jaar, en hoeveel elke maand? De tabellen hieronder tellen maandag tot en met vrijdag zonder de feestdagen. Met de rekenhulp bereken je het aantal werkdagen tussen twee willekeurige datums.",
    blokken: [
      {
        kop: "Wat telt als werkdag",
        tekst:
          "We tellen maandag tot en met vrijdag en laten de feestdagen weg die bijna iedereen vrij heeft: Nieuwjaarsdag, Tweede Paasdag, Koningsdag, Hemelvaartsdag, Tweede Pinksterdag en de kerstdagen. Bevrijdingsdag telt alleen in lustrumjaren als vrije dag, en Goede Vrijdag als werkdag. Werk je in een sector met andere afspraken, tel dan zelf een dag bij of af.",
      },
      {
        kop: "Handig voor planning en uren",
        tekst:
          "Werkdagen per maand zijn nodig voor een urenplanning, een deadline of een omrekening van een maandbedrag naar een dagbedrag. Reken bij een parttime contract met het aantal dagen dat jij per week werkt.",
      },
    ],
    faq: [
      { v: "Hoeveel werkdagen heeft een jaar gemiddeld?", a: "Meestal tussen de 253 en 258, afhankelijk van hoe de feestdagen vallen. Valt kerst in het weekend, dan zijn het er meer. De tabellen hieronder geven het exacte aantal." },
      { v: "Telt de rekenhulp de begin- en einddatum mee?", a: "Ja, beide datums tellen mee als het werkdagen zijn. Van maandag tot en met vrijdag in dezelfde week is dus vijf werkdagen." },
      { v: "Telt Goede Vrijdag mee als werkdag?", a: "Ja, omdat de meeste mensen dan gewoon werken. Ben jij die dag vrij, haal er dan een af." },
    ],
  },
  "dagen-tussen": {
    h1: "Dagen tussen twee datums berekenen",
    intro:
      "Kies een begin- en einddatum en de rekenhulp geeft het aantal dagen, weken, maanden en werkdagen ertussen. Je kiest zelf of de einddatum meetelt, want dat scheelt precies een dag.",
    blokken: [
      {
        kop: "Wel of niet meetellen?",
        tekst:
          "Van 1 tot 3 maart is twee dagen verschil, maar wie een verblijf of een periode telt waarin beide dagen meedoen, komt op drie. Voor een termijn of looptijd is het verschil meestal wat je zoekt; voor een vakantie of een periode waarin je iets elke dag doet, tel je de einddatum mee.",
      },
      {
        kop: "Maanden zijn niet even lang",
        tekst:
          "Het aantal maanden rekenen we als kalendermaanden: van 15 januari tot 15 maart is twee maanden, hoeveel dagen februari ook heeft. De rest staat erachter als losse dagen.",
      },
    ],
    faq: [
      { v: "Kan ik ook terugrekenen in de tijd?", a: "Ja. Ligt de einddatum voor de begindatum, dan draait de rekenhulp ze om en toont hoeveel dagen ertussen liggen." },
      { v: "Telt een schrikkeldag mee?", a: "Ja, 29 februari telt gewoon als dag mee wanneer die in de periode valt." },
      { v: "Hoe tel ik alleen werkdagen?", a: "Het aantal werkdagen staat ook in de uitkomst: maandag tot en met vrijdag zonder feestdagen. Voor een overzicht per maand is er de pagina werkdagen." },
    ],
  },
  verjaardag: {
    h1: "Hoeveel dagen tot mijn verjaardag?",
    intro:
      "Vul je geboortedatum in en de teller rekent uit hoeveel dagen het nog is tot je volgende verjaardag, op welke dag die valt en hoe oud je wordt. Het rekenen gebeurt in je browser; je geboortedatum wordt nergens opgeslagen of verstuurd.",
    blokken: [
      {
        kop: "Jarig op 29 februari",
        tekst:
          "Ben je op schrikkeldag geboren, dan valt je verjaardag maar eens in de vier jaar op de echte datum. In de andere jaren rekent de teller met 28 februari. Veel mensen vieren het die dag, anderen kiezen 1 maart.",
      },
      {
        kop: "Een feest plannen",
        tekst:
          "Valt je verjaardag doordeweeks, dan schuift een feest vaak naar het weekend ervoor of erna. De weekdag staat daarom bij de uitkomst. Een feest buiten? De [barbecuecheck](tool:barbecue) en de [terrascheck](tool:terras) rekenen ook voor de komende dagen.",
      },
    ],
    faq: [
      { v: "Kan ik de teller voor iemand anders gebruiken?", a: "Ja, vul gewoon een andere geboortedatum in. Handig om op tijd een cadeau of kaart te regelen." },
      { v: "Wordt mijn geboortedatum bewaard?", a: "Nee. De berekening gebeurt alleen in je eigen browser en verdwijnt als je de pagina sluit." },
      { v: "Wat als ik vandaag jarig ben?", a: "Dan zegt de teller het je meteen, en telt hij daarna af naar volgend jaar." },
    ],
  },
  leeftijd: {
    h1: "Leeftijd berekenen: hoe oud ben ik precies?",
    intro:
      "Vul een geboortedatum in en zie de leeftijd in jaren, maanden en dagen, plus het totaal aantal dagen en weken dat iemand leeft. Je kunt ook een andere peildatum kiezen, bijvoorbeeld om de leeftijd op een bepaalde dag te weten.",
    blokken: [
      {
        kop: "Leeftijd op een peildatum",
        tekst:
          "Voor een inschrijving, een sportcompetitie of een regeling telt vaak de leeftijd op een bepaalde datum, zoals 1 januari of 1 september. Kies die datum als peildatum en de rekenhulp rekent vanaf daar.",
      },
      {
        kop: "Je 10.000ste dag",
        tekst:
          "Iemand van 27 is ongeveer 10.000 dagen oud. Sommige mensen vieren die dag als een tweede verjaardag. De rekenhulp toont wanneer je volgende ronde duizendtal valt.",
      },
    ],
    faq: [
      { v: "Hoe wordt de leeftijd in maanden berekend?", a: "Als kalendermaanden: van 10 maart tot 10 april is een maand. De resterende dagen staan erachter." },
      { v: "Telt de geboortedag mee?", a: "Je bent op je geboortedag nul dagen oud; de volgende dag een. Zo rekenen ook de meeste officiele instanties." },
      { v: "Wordt de geboortedatum opgeslagen?", a: "Nee, alles gebeurt in je eigen browser." },
    ],
  },
  noorderlicht: {
    h1: "Kan ik vannacht het noorderlicht zien?",
    intro:
      "De kans op noorderlicht in Nederland hangt van twee dingen af: hoe sterk de zonnestorm is (de Kp-index) en of het helder is. Hieronder staat per nacht de verwachte Kp met wat dat betekent voor Nederland, en de bewolking voor jouw plek.",
    blokken: [
      {
        kop: "Wat de Kp-index zegt",
        tekst:
          "De Kp-index loopt van 0 tot 9 en meet hoe onrustig het aardmagnetisch veld is. Normaal blijft het noorderlicht boven Scandinavie. Vanaf Kp 5 legt een telefooncamera soms een gloed vast aan de noordhorizon, vanaf Kp 6 is het met het oog te zien in het noorden van het land, en vanaf Kp 7 kan heel Nederland meedoen.",
      },
      {
        kop: "De beste plek en het beste moment",
        tekst:
          "Zoek een donkere plek met vrij zicht naar het noorden, weg van straatlantaarns: het Lauwersmeer, de Waddeneilanden, de Drentse heide of een dijk. De meeste activiteit valt rond middernacht, maar een sterke uitbarsting kan op elk moment van de nacht komen. Voor een heldere nacht kijk je ook naar de [sterrencheck](tool:sterrenkijken), die maanlicht en bewolking meeweegt.",
      },
      {
        kop: "Je camera ziet meer dan je ogen",
        tekst:
          "Bij zwak noorderlicht zie je met het blote oog vaak alleen een grijze gloed, terwijl een telefoon in nachtstand er rood en groen van maakt. Zet de telefoon stil neer en gebruik een belichting van een paar seconden.",
      },
    ],
    faq: [
      { v: "Hoe vaak is het noorderlicht in Nederland te zien?", a: "Een paar keer per jaar in de jaren rond het zonnemaximum, soms jarenlang niet daarbuiten. Sterke stormen zoals in mei en oktober 2024 maakten het in het hele land zichtbaar." },
      { v: "Hoe ver vooruit is het te voorspellen?", a: "Een tot drie dagen. Een zonne-uitbarsting doet er een tot drie dagen over om de aarde te bereiken, en pas vlak voor aankomst is de sterkte goed te meten. Een verwachting van Kp 7 kan dus tegenvallen, of juist meevallen." },
      { v: "Waar komen de gegevens vandaan?", a: "De Kp-verwachting komt van het Space Weather Prediction Center van de Amerikaanse NOAA, de bewolking van Open-Meteo. De vertaling naar kansen voor Nederland is een vuistregel, geen garantie." },
    ],
  },
};
