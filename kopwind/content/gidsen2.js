/**
 * content/gidsen2.js
 *
 * Teksten voor de pagina's van v3.39.0 "Harmattan": geld en werk,
 * verduisteringen, kalender en de Keukenhof. Bedragen en data staan in
 * lib/geld.js, lib/eclipsen.js en lib/evenementen.js; de teksten noemen
 * geen getallen die daar niet vandaan komen. Bronnen in LOGBOEK Run 19.
 */

const BASIS = {
  toeslagen: {
    h1: "Wanneer wordt de toeslag uitbetaald?",
    intro:
      "Zorgtoeslag, huurtoeslag, kindgebonden budget en kinderopvangtoeslag worden vooraf betaald: rond de twintigste van de maand krijg je het geld voor de maand erna. Hieronder staat de eerstvolgende betaaldatum die de Belastingdienst heeft gepubliceerd, met een teller.",
    blokken: [
      {
        kop: "Vooraf, voor de maand erna",
        tekst:
          "De Dienst Toeslagen betaalt een voorschot voor de volgende maand. De toeslag die eind november binnenkomt, is dus bedoeld voor december. Zo heb je het geld al op je rekening als de huur of de zorgpremie wordt afgeschreven.",
      },
      {
        kop: "Hoe laat staat het geld erop?",
        tekst:
          "Het geld staat voor middernacht op de betaaldag op je rekening. Hoe laat precies, hangt af van je bank. Krijg je meer dan een toeslag, dan kunnen ze op verschillende momenten binnenkomen.",
      },
      {
        kop: "Voorschot en definitieve berekening",
        tekst:
          "Wat je elke maand krijgt, is een voorschot op basis van het inkomen dat je hebt opgegeven. Na afloop van het jaar rekent de Belastingdienst met je werkelijke inkomen uit wat je had moeten krijgen. Was je inkomen hoger, dan betaal je terug; was het lager, dan krijg je bij. Geef wijzigingen daarom tussendoor door in Mijn toeslagen.",
      },
      {
        kop: "Veranderingen vanaf 2027",
        tekst:
          "De Belastingdienst heeft aangekondigd dat vanaf 1 januari 2027 lagere vermogensgrenzen gelden voor zorgtoeslag en kindgebonden budget, en dat de regels voor toeslagpartners eenvoudiger worden. Heb je spaargeld, controleer dan of je nog recht hebt, zodat je achteraf niet hoeft terug te betalen.",
      },
      {
        kop: "Geen toeslag ontvangen?",
        tekst:
          "Staat het geld er de dag na de betaaldatum nog niet, kijk dan eerst in Mijn toeslagen of er een betaling klaarstaat en of je rekeningnummer klopt. Een nieuwe toeslag kan de eerste keer later komen dan de vaste datum.",
      },
    ],
    faq: [
      { v: "Wanneer wordt de zorgtoeslag betaald?", a: "Rond de twintigste van de maand, als voorschot voor de maand erna. De exacte datum staat hierboven." },
      { v: "Komen alle toeslagen op dezelfde dag?", a: "De betaaldatum is voor alle toeslagen gelijk, maar het geld kan op verschillende momenten van die dag binnenkomen." },
      { v: "Waarom staat er een andere afzender bij de betaling?", a: "Sinds juni 2026 betaalt de Dienst Toeslagen vanaf een rekeningnummer bij de Rabobank. Dat is dus geen fout." },
      { v: "Waar vind ik alle betaaldata van volgend jaar?", a: "De Belastingdienst publiceert ze op de pagina Betaaldatums toeslagen. Zodra er nieuwe data zijn, nemen we ze hier over." },
      { v: "Wat als mijn inkomen verandert?", a: "Geef het zo snel mogelijk door in Mijn toeslagen. Dan wordt het voorschot aangepast en voorkom je een grote terugbetaling." },
    ],
  },
  kinderbijslag: {
    h1: "Wanneer wordt de kinderbijslag uitbetaald?",
    intro:
      "De kinderbijslag wordt per kwartaal achteraf betaald, in januari, april, juli en oktober. Hieronder staat in welke maand de volgende betaling komt en over welk kwartaal die gaat. De precieze dag zie je in Mijn SVB.",
    blokken: [
      {
        kop: "Achteraf, per kwartaal",
        tekst:
          "Anders dan toeslagen is kinderbijslag geen voorschot. Je krijgt het geld na afloop van elk kwartaal: de betaling van januari gaat over oktober tot en met december, die van april over januari tot en met maart, enzovoort. De Sociale Verzekeringsbank (SVB) betaalt de kinderbijslag uit.",
      },
      {
        kop: "Vanaf wanneer heb je recht?",
        tekst:
          "Je hebt recht op kinderbijslag vanaf het kwartaal na de geboorte van je kind, of na de komst van een kind in je gezin. De eerste betaling komt dus pas na afloop van dat eerste volle kwartaal. Het recht loopt tot je kind 18 wordt.",
      },
      {
        kop: "Hoeveel krijg je?",
        tekst:
          "Het bedrag hangt af van de leeftijd van je kind: er zijn aparte bedragen voor kinderen tot 6 jaar, van 6 tot 12 en van 12 tot 18. De bedragen worden twee keer per jaar aangepast. Je inkomen speelt bij kinderbijslag geen rol, bij het kindgebonden budget wel.",
      },
      {
        kop: "Kindgebonden budget is iets anders",
        tekst:
          "Kindgebonden budget is een toeslag van de Belastingdienst, hangt af van je inkomen en vermogen en wordt maandelijks vooraf betaald, net als de zorgtoeslag. Kinderbijslag komt van de SVB, per kwartaal en voor iedereen.",
      },
      {
        kop: "Plannen met de kinderbijslag",
        tekst:
          "Omdat het geld vier keer per jaar binnenkomt, gebruiken veel ouders het voor grotere uitgaven: schoolspullen in de zomer, winterkleding in oktober of de sportclub in januari. De betaling in juli valt vaak net voor de zomervakantie.",
      },
    ],
    faq: [
      { v: "Op welke dag komt de kinderbijslag?", a: "De SVB noemt de exacte dag in Mijn SVB. Het is altijd in januari, april, juli of oktober." },
      { v: "Krijg ik kinderbijslag voor een pasgeboren baby?", a: "Ja, vanaf het kwartaal na de geboorte. De SVB stuurt meestal zelf een aanvraagformulier na de aangifte bij de gemeente." },
      { v: "Moet ik kinderbijslag aanvragen?", a: "Vaak stuurt de SVB je automatisch een formulier. Krijg je niets binnen een paar weken na de geboorte, vraag het dan zelf aan." },
      { v: "Telt kinderbijslag als inkomen?", a: "Nee, kinderbijslag is onbelast en telt niet mee voor je toeslagen." },
      { v: "Wat als we gaan verhuizen naar het buitenland?", a: "Dan kan het recht veranderen. Meld de verhuizing bij de SVB; zij rekenen uit of en hoeveel je nog krijgt." },
    ],
  },
  minimumloon: {
    h1: "Wat is het minimumloon?",
    intro:
      "Het minimumloon is in Nederland een uurloon. Hieronder staan de bruto bedragen per uur per leeftijd, en met de rekenhulp zie je wat dat per maand oplevert bij jouw aantal uren per week.",
    blokken: [
      {
        kop: "Een minimum per uur",
        tekst:
          "Sinds 2024 geldt een wettelijk minimumloon per uur, ongeacht hoeveel uur een volledige werkweek in jouw sector telt. Iedereen van 21 jaar en ouder heeft recht op hetzelfde minimumuurloon. Werk je meer uren, dan verdien je evenredig meer.",
      },
      {
        kop: "Jeugdlonen",
        tekst:
          "Voor werknemers tot 21 jaar gelden lagere minimumjeugdlonen, als percentage van het volwassen minimumloon. De tabel hieronder toont het bedrag per leeftijd. Op je verjaardag schuif je automatisch door naar het bedrag voor je nieuwe leeftijd.",
      },
      {
        kop: "Twee keer per jaar omhoog",
        tekst:
          "Het minimumloon wordt op 1 januari en 1 juli aangepast aan de loonontwikkeling. De bedragen hier gelden vanaf de datum in de tabel; zodra de volgende bedragen zijn vastgesteld, werken we de pagina bij.",
      },
      {
        kop: "Bruto en netto",
        tekst:
          "Het minimumloon is een brutobedrag. Na loonheffing blijft er netto minder over, hoeveel hangt af van je situatie en of je werkgever de loonheffingskorting toepast. Bovenop het minimumloon heb je recht op minstens 8 procent vakantiegeld.",
      },
      {
        kop: "Betaalt je werkgever te weinig?",
        tekst:
          "Krijg je minder dan het minimumloon, bespreek het dan eerst met je werkgever. Lost dat niets op, dan kun je een melding doen bij de Nederlandse Arbeidsinspectie. Een vakbond of het Juridisch Loket kan je verder helpen.",
      },
    ],
    faq: [
      { v: "Hoeveel is het minimumloon per maand?", a: "Dat hangt af van je uren. De rekenhulp hierboven rekent het uit: uurloon maal uren per week maal 52, gedeeld door 12." },
      { v: "Geldt het minimumloon ook voor uitzendkrachten?", a: "Ja, voor iedereen met een arbeidscontract, ook uitzendkrachten en oproepkrachten." },
      { v: "Geldt het minimumloon voor zzp'ers?", a: "Niet als wettelijk loon, omdat zzp'ers geen werknemer zijn. Wel is er politieke discussie over een minimumtarief." },
      { v: "Telt vakantiegeld mee voor het minimumloon?", a: "Nee, vakantiegeld komt erbovenop. Alleen als je werkgever het per maand uitbetaalt, moet het apart op je loonstrook staan." },
      { v: "Wanneer gaat het minimumloon weer omhoog?", a: "Op 1 januari en 1 juli van elk jaar, als de loonontwikkeling daar aanleiding toe geeft." },
    ],
  },
  aow: {
    h1: "Wanneer krijg ik AOW?",
    intro:
      "Vul je geboortedatum in en de rekenhulp geeft de datum waarop je de AOW-leeftijd bereikt, voor zover die al is vastgesteld. De tabel eronder toont de AOW-leeftijd per jaar. Het rekenen gebeurt in je browser; je geboortedatum wordt nergens opgeslagen.",
    blokken: [
      {
        kop: "Hoe de AOW-leeftijd wordt bepaald",
        tekst:
          "De AOW-leeftijd volgt de levensverwachting die het CBS elk jaar berekent. Het kabinet stelt de leeftijd telkens vijf jaar vooruit vast, en eenmaal vastgesteld verandert hij niet meer. Daardoor weet je minstens vijf jaar van tevoren waar je aan toe bent.",
      },
      {
        kop: "Het jaar waarin je hem bereikt telt",
        tekst:
          "De AOW-leeftijd hoort bij het kalenderjaar waarin je hem bereikt. Iemand die in het jaar van 67 jaar AOW-gerechtigd wordt, krijgt AOW op zijn 67ste verjaardag. Valt de verjaardag in een jaar waarin de grens hoger ligt, dan schuift de AOW-datum mee.",
      },
      {
        kop: "Na het laatst vastgestelde jaar",
        tekst:
          "Voor mensen die de AOW-leeftijd na de laatste vastgestelde jaar bereiken, is de precieze leeftijd nog niet bekend. Hij is minstens 67 jaar en 3 maanden. Elk najaar komt er een jaar bij; de rekenhulp volgt die tabel.",
      },
      {
        kop: "AOW en je pensioen",
        tekst:
          "De AOW is het basispensioen van de overheid. Je pensioen via je werkgever kan op een andere datum ingaan; veel pensioenfondsen kiezen een vaste pensioenrichtleeftijd, maar je kunt vaak eerder of later laten ingaan. Kijk op mijnpensioenoverzicht.nl voor een overzicht van beide.",
      },
      {
        kop: "Hoeveel AOW je krijgt",
        tekst:
          "Je bouwt AOW op in de vijftig jaar voor je AOW-leeftijd, met 2 procent voor elk jaar dat je in Nederland woont of werkt. Heb je in het buitenland gewoond, dan kan je AOW lager zijn. Het bedrag hangt verder af van of je alleen woont of samen.",
      },
    ],
    faq: [
      { v: "Kan ik eerder met AOW?", a: "Nee, de AOW gaat in op de AOW-leeftijd. Eerder stoppen met werken kan wel, maar dan moet je de periode tot je AOW zelf overbruggen." },
      { v: "Krijg ik AOW vanaf mijn verjaardag of vanaf de eerste van de maand?", a: "Je hebt recht op AOW vanaf de dag dat je de AOW-leeftijd bereikt. De SVB betaalt per maand en rekent de eerste maand naar rato." },
      { v: "Moet ik AOW aanvragen?", a: "De SVB stuurt je ongeveer een half jaar van tevoren een brief. Daarna vraag je de AOW online aan via Mijn SVB." },
      { v: "Wordt de AOW-leeftijd nog verhoogd?", a: "Dat hangt van de levensverwachting af. De leeftijd wordt telkens vijf jaar vooruit vastgesteld, dus de tabel hierboven is zeker." },
      { v: "Wordt mijn geboortedatum bewaard?", a: "Nee. De berekening gebeurt alleen in je eigen browser." },
    ],
  },
  verduistering: {
    h1: "Wanneer is de volgende zons- of maansverduistering?",
    intro:
      "Hieronder staan de komende verduisteringen die vanuit Nederland te zien zijn, met een teller naar de eerstvolgende. Bij elke verduistering staat hoeveel er bij ons te zien is: niet elke verduistering die in het nieuws komt, is in Nederland zichtbaar.",
    blokken: [
      {
        kop: "Zonsverduistering en maansverduistering",
        tekst:
          "Bij een zonsverduistering schuift de maan voor de zon. Dat kan alleen bij nieuwe maan, en alleen in een smalle strook op aarde is hij totaal. Bij een maansverduistering schuift de maan in de schaduw van de aarde. Dat kan alleen bij volle maan, en hij is te zien overal waar de maan op dat moment boven de horizon staat.",
      },
      {
        kop: "Kijk nooit zonder bescherming",
        tekst:
          "Kijk tijdens een gedeeltelijke zonsverduistering nooit met het blote oog, een zonnebril of door een verrekijker of camera naar de zon. Gebruik een gecertificeerde eclipsbril of projecteer de zon via een gaatje op een vel papier. Een maansverduistering is wel veilig om met het blote oog te bekijken.",
      },
      {
        kop: "Waarom maar zo weinig totale verduisteringen?",
        tekst:
          "De baan van de maan staat iets schuin ten opzichte van die van de aarde. Daardoor staat de maan bij de meeste nieuwe en volle manen net boven of onder de zon of de schaduw. Een totale zonsverduistering in Nederland is zeldzaam. In 1999 trok de totaliteit net ten zuiden van ons land langs; bij ons was de zon voor ruim negen tiende bedekt. De volgende totale zonsverduistering in Nederland laat nog meer dan een eeuw op zich wachten.",
      },
      {
        kop: "De bloedmaan",
        tekst:
          "Tijdens een totale maansverduistering kleurt de maan koperrood. Dat komt doordat de atmosfeer van de aarde rood licht om de aarde heen buigt, zoals bij een zonsondergang. Hoe donker de maan wordt, hangt af van stof en wolken in de atmosfeer.",
      },
      {
        kop: "Weer en zicht",
        tekst:
          "Ook de mooiste verduistering valt weg achter een wolkendek. Kijk een paar dagen van tevoren naar de bewolking. Voor een maansverduistering laag aan de horizon heb je een open uitzicht naar het oosten of westen nodig. De [sterrencheck](tool:sterrenkijken) rekent met bewolking per uur.",
      },
    ],
    faq: [
      { v: "Wanneer is de volgende totale zonsverduistering in Nederland?", a: "Pas over meer dan honderd jaar. De komende jaren zijn alleen gedeeltelijke zonsverduisteringen bij ons te zien; de lijst hierboven noemt ze." },
      { v: "Wat heb ik nodig om een zonsverduistering te bekijken?", a: "Een eclipsbril met een ISO 12312-2-keurmerk, of een eenvoudige gaatjescamera. Een gewone zonnebril beschermt niet." },
      { v: "Kan ik een maansverduistering fotograferen?", a: "Ja, met een telefoon op een statief of een camera met een telelens. Tijdens de totaliteit heb je een langere belichting nodig." },
      { v: "Waarom staan niet alle verduisteringen in de lijst?", a: "Alleen verduisteringen die vanuit Nederland (deels) te zien zijn, staan erin. Een verduistering die alleen in Australie of Amerika zichtbaar is, laten we weg." },
      { v: "Hoe vaak is er een verduistering?", a: "Elk jaar zijn er minstens twee zonsverduisteringen en meestal twee maansverduisteringen ergens op aarde. Op een vaste plek zie je er veel minder." },
    ],
  },
  schrikkeljaar: {
    h1: "Is het een schrikkeljaar?",
    intro:
      "Hieronder staat of dit jaar een schrikkeljaar is, wanneer het volgende komt en een lijst met de komende schrikkeljaren. Een schrikkeljaar heeft 366 dagen, met 29 februari als extra dag.",
    blokken: [
      {
        kop: "De regel",
        tekst:
          "Een jaar is een schrikkeljaar als het deelbaar is door 4. Een uitzondering zijn eeuwjaren: die zijn alleen een schrikkeljaar als ze deelbaar zijn door 400. Daarom was 2000 een schrikkeljaar, maar wordt 2100 dat niet.",
      },
      {
        kop: "Waarom een extra dag?",
        tekst:
          "De aarde doet er ongeveer 365 dagen en bijna zes uur over om rond de zon te draaien. Zonder schrikkeldag zou de kalender elk jaar een kwart dag achterlopen op de seizoenen, en zou de lente na een paar eeuwen in de zomer beginnen.",
      },
      {
        kop: "Waarom de uitzondering voor eeuwjaren?",
        tekst:
          "Een kwart dag per jaar is net iets te veel: het echte verschil is ongeveer elf minuten kleiner. Door drie van de vier eeuwjaren over te slaan, blijft de kalender duizenden jaren gelijk lopen met de seizoenen. Dit is de gregoriaanse kalender, die de Nederlandse gewesten tussen 1582 en 1701 invoerden.",
      },
      {
        kop: "Jarig op 29 februari",
        tekst:
          "Wie op schrikkeldag geboren is, heeft maar eens in de vier jaar een verjaardag op de echte datum. In de andere jaren vieren de meeste mensen het op 28 februari of 1 maart. De verjaardagsteller op deze site rekent met 28 februari.",
      },
      {
        kop: "Werk en loon in een schrikkeljaar",
        tekst:
          "Een schrikkeljaar heeft een extra dag, en als 29 februari op een werkdag valt ook een extra werkdag. Wie een vast maandloon krijgt, werkt die dag zonder extra betaling; wie per uur betaald wordt, verdient hem gewoon.",
      },
    ],
    faq: [
      { v: "Is 2028 een schrikkeljaar?", a: "Ja, 2028 is deelbaar door 4 en geen eeuwjaar." },
      { v: "Hoeveel dagen heeft februari in een schrikkeljaar?", a: "29 dagen in plaats van 28." },
      { v: "Is 2100 een schrikkeljaar?", a: "Nee. 2100 is een eeuwjaar dat niet deelbaar is door 400." },
      { v: "Hoeveel weken heeft een schrikkeljaar?", a: "52 weken en twee dagen. Of een jaar 53 ISO-weken heeft, hangt af van de dag waarop het begint; de pagina over weeknummers rekent het uit." },
      { v: "Wat is een schrikkelseconde?", a: "Iets anders: een extra seconde die af en toe aan de klok werd toegevoegd omdat de aarde niet precies gelijkmatig draait. Er is besloten daar voor 2035 mee te stoppen." },
    ],
  },
  "dag-van-jaar": {
    h1: "Welke dag van het jaar is het?",
    intro:
      "Vandaag is dag nummer zoveel van het jaar: het getal staat hieronder, samen met hoeveel dagen er nog over zijn en welk deel van het jaar erop zit. Met de zoeker vind je het dagnummer van elke datum.",
    blokken: [
      {
        kop: "Hoe het dagnummer werkt",
        tekst:
          "1 januari is dag 1 en 31 december is dag 365, of dag 366 in een schrikkeljaar. Het dagnummer heet ook wel de juliaanse datum in de volksmond, al betekent dat in de sterrenkunde iets anders.",
      },
      {
        kop: "Waar het gebruikt wordt",
        tekst:
          "Dagnummers staan in productiecodes en houdbaarheidscodes, in de landbouw en in logistiek. Een batchcode als 27045 betekent bij veel fabrikanten 2027, dag 45, dus 14 februari. Ook in planningen en spreadsheets is het handig om met dagnummers te rekenen.",
      },
      {
        kop: "Het jaar in procenten",
        tekst:
          "Het percentage hieronder laat zien welk deel van het jaar al voorbij is. Handig voor wie een jaardoel bijhoudt: zit je qua voortgang onder dat percentage, dan loop je achter op schema.",
      },
      {
        kop: "Weeknummer en dagnummer",
        tekst:
          "Het dagnummer telt dagen, het weeknummer telt weken volgens de ISO-norm. Ze lopen niet altijd gelijk op, omdat week 1 niet altijd op 1 januari begint. Het weeknummer van vandaag staat op een eigen pagina.",
      },
      {
        kop: "Dagen tellen naar een doel",
        tekst:
          "Wil je weten hoeveel dagen er tussen twee datums zitten, of hoeveel werkdagen nog tot een deadline? Daar zijn aparte rekenhulpen voor op deze site, net als tellers naar feestdagen en vakanties.",
      },
    ],
    faq: [
      { v: "Welke dag van het jaar is 1 juli?", a: "Dag 182 in een gewoon jaar en dag 183 in een schrikkeljaar." },
      { v: "Wat is het midden van het jaar?", a: "2 juli in een gewoon jaar: dan zijn er 182 dagen voorbij en 182 te gaan. In een schrikkeljaar valt het midden op 1 juli rond het middaguur." },
      { v: "Hoeveel dagen heeft dit jaar?", a: "365, of 366 als het een schrikkeljaar is. Het aantal staat hierboven." },
      { v: "Hoe reken ik een dagnummer terug naar een datum?", a: "Tel het dagnummer min een op bij 1 januari. De zoeker hierboven werkt andersom: kies een datum en zie het dagnummer." },
      { v: "Telt vandaag mee in de resterende dagen?", a: "Nee. De resterende dagen zijn de dagen na vandaag tot en met 31 december." },
    ],
  },
  keukenhof: {
    h1: "Wanneer is de Keukenhof open?",
    intro:
      "De Keukenhof is elk voorjaar ongeveer acht weken open. Hieronder staan de openingsdata van dit seizoen met een teller, en wat er wanneer bloeit, in het park en op de bollenvelden eromheen.",
    blokken: [
      {
        kop: "Wat bloeit wanneer",
        tekst:
          "Aan het begin van het seizoen bloeien vooral krokussen, narcissen en hyacinten. De tulpen komen vanaf april op gang en staan rond half april tot begin mei op hun mooist. Een warm voorjaar schuift alles een week naar voren, een koud voorjaar naar achteren. Het park plant in lagen, zodat er het hele seizoen iets bloeit.",
      },
      {
        kop: "De bollenvelden",
        tekst:
          "Rond Lisse, Hillegom en Noordwijkerhout liggen de bekende bollenvelden. Die zijn geen onderdeel van het park en bloeien op het ritme van de kweker: zodra de bloem op zijn mooist is, wordt hij vaak gekopt om de bol te sparen. Bekijk de velden vanaf de openbare weg of een fietsroute en loop er niet in.",
      },
      {
        kop: "Drukte vermijden",
        tekst:
          "Het drukst is het in het weekend, rond Pasen en Koningsdag en in de meivakantie. Wie doordeweeks vroeg in de ochtend of laat in de middag gaat, heeft meer ruimte. Tickets koop je online met een tijdslot.",
      },
      {
        kop: "Het weer",
        tekst:
          "Het voorjaar is wisselvallig, en in een open bollenlandschap waait het vaak stevig. Een droge middag met wat zon is ideaal; de [terrascheck](tool:terras) en de [wandelcheck](tool:wandelen) zoeken het beste blok van de dag.",
      },
      {
        kop: "Met de fiets",
        tekst:
          "De streek leent zich goed voor een fietstocht langs de velden, met de Keukenhof als start of eindpunt. Let op de wind: wie heen met de wind in de rug rijdt, heeft hem terug tegen. De [fietscheck](tool:fiets-naar-werk) rekent tegenwind per deel van de route uit.",
      },
    ],
    faq: [
      { v: "Hoe laat is de Keukenhof open?", a: "Volgens de Keukenhof gaat de entree om 18:15 uur dicht. Check de openingstijden van je dag op de site van het park." },
      { v: "Wanneer staan de tulpen in bloei?", a: "Meestal van half april tot begin mei, afhankelijk van het voorjaar." },
      { v: "Kan ik kaartjes aan de kassa kopen?", a: "Het park werkt met online tickets en tijdsloten. Koop ze vooraf, zeker voor weekenden en feestdagen." },
      { v: "Zijn honden welkom?", a: "Check het actuele beleid op de site van de Keukenhof voordat je gaat." },
      { v: "Is de Keukenhof ook buiten het voorjaar open?", a: "Het park is alleen in het voorjaarsseizoen open. Daarbuiten is het gesloten." },
    ],
  },
  uren: {
    h1: "Uren berekenen tussen twee tijden",
    intro:
      "Vul een begin- en eindtijd in, eventueel met pauze, en de rekenhulp geeft het aantal gewerkte uren en minuten, ook als decimaal getal voor je urenbriefje. Een dienst over middernacht rekent hij goed door.",
    blokken: [
      {
        kop: "Uren en minuten naar een decimaal getal",
        tekst:
          "Veel urenregistraties en facturen werken met decimale uren. Een kwartier is 0,25 uur, een half uur 0,5 en drie kwartier 0,75. Zeven uur en vijfenveertig minuten is dus 7,75 uur, niet 7,45. Deel het aantal minuten door 60 om het decimale deel te krijgen.",
      },
      {
        kop: "Pauzes",
        tekst:
          "Onbetaalde pauzes trek je af van de gewerkte tijd. De Arbeidstijdenwet schrijft voor dat je bij een dienst van meer dan 5,5 uur minstens een half uur pauze krijgt, en bij meer dan 10 uur minstens drie kwartier. Of die pauze betaald is, staat in je cao of contract.",
      },
      {
        kop: "Nachtdiensten",
        tekst:
          "Begint een dienst om 22:00 uur en eindigt hij om 06:00 uur, dan is de eindtijd kleiner dan de begintijd. De rekenhulp telt dan automatisch door tot de volgende dag. Valt er een klokwissel in de nacht, dan is de dienst een uur langer of korter; reken die nacht zelf een uur bij of af.",
      },
      {
        kop: "Een week optellen",
        tekst:
          "Wie per week uren moet doorgeven, telt de decimale uren per dag bij elkaar op. Vijf dagen van 7,75 uur is 38,75 uur. Zo voorkom je fouten met minuten die boven de zestig uitkomen.",
      },
      {
        kop: "Van uren naar loon",
        tekst:
          "Vermenigvuldig het decimale aantal uren met je uurloon voor je brutoloon over die dienst. Voor het wettelijke minimum per uur is er een aparte pagina met de bedragen per leeftijd.",
      },
    ],
    faq: [
      { v: "Hoeveel is 45 minuten in decimalen?", a: "0,75 uur. Deel 45 door 60." },
      { v: "Hoe reken ik 7,5 uur terug naar uren en minuten?", a: "Het deel achter de komma maal 60: 0,5 maal 60 is 30 minuten. Dus 7 uur en 30 minuten." },
      { v: "Telt de rekenhulp ook diensten over middernacht?", a: "Ja. Ligt de eindtijd voor de begintijd, dan telt hij door tot de volgende dag." },
      { v: "Hoeveel pauze moet ik krijgen?", a: "Bij meer dan 5,5 uur werk minstens 30 minuten, die je mag opsplitsen in twee keer een kwartier. Bij meer dan 10 uur minstens 45 minuten." },
      { v: "Worden mijn tijden opgeslagen?", a: "Nee, alles blijft in je browser." },
    ],
  },
  salaris: {
    h1: "Wanneer krijg ik mijn salaris?",
    intro:
      "Veel werkgevers betalen het salaris rond de 25e van de maand. Valt die dag in het weekend of op een feestdag, dan komt het meestal de werkdag ervoor. Hieronder staat per maand op welke dag dat dit en volgend jaar uitkomt, en met een eigen salarisdag reken je je eigen datums uit.",
    blokken: [
      {
        kop: "Geen wettelijke salarisdag",
        tekst:
          "De wet schrijft geen vaste dag voor. Het loon moet wel uiterlijk op de afgesproken dag zijn betaald, en bij een maandloon uiterlijk aan het eind van de maand. De meeste werkgevers kiezen een vaste dag, vaak de 20e, 23e, 25e of de laatste werkdag van de maand. Je contract of cao noemt de dag.",
      },
      {
        kop: "Weekend en feestdagen",
        tekst:
          "Banken verwerken overboekingen alleen op werkdagen. Valt de salarisdag op een zaterdag, zondag of feestdag, dan betalen de meeste werkgevers de werkdag ervoor, zodat het geld er toch op tijd is. Sommige betalen de werkdag erna. De tabel hieronder gaat uit van de werkdag ervoor.",
      },
      {
        kop: "December",
        tekst:
          "In december valt de 25e op Eerste Kerstdag, dus komt het salaris eerder. Veel werkgevers betalen dan rond de 20e, zodat het er voor de feestdagen is. In december komt soms ook de dertiende maand of eindejaarsuitkering mee.",
      },
      {
        kop: "Hoe laat staat het erop?",
        tekst:
          "Dat hangt af van de bank van je werkgever en die van jou. Bij dezelfde bank staat het er vaak al vroeg in de ochtend, tussen banken kan het later op de dag zijn. Directe overboekingen tussen banken komen meestal binnen enkele seconden aan.",
      },
      {
        kop: "Te laat betaald?",
        tekst:
          "Betaalt je werkgever niet op tijd, dan kun je volgens de wet aanspraak maken op een verhoging over het te laat betaalde loon en op wettelijke rente. Een vakbond of het Juridisch Loket helpt je verder.",
      },
    ],
    faq: [
      { v: "Waarom krijg ik mijn salaris eerder als de 25e in het weekend valt?", a: "Omdat banken in het weekend geen salarisbetalingen verwerken en werkgevers willen dat het geld er uiterlijk op de salarisdag is." },
      { v: "Krijgen uitzendkrachten wekelijks betaald?", a: "Vaak wel, per week of per vier weken. Het uitzendbureau noemt de vaste dag." },
      { v: "Wanneer komt het vakantiegeld?", a: "Meestal met het salaris van mei of juni. Daar is een aparte pagina voor, met een rekenhulp." },
      { v: "Is de salarisdag in december anders?", a: "Meestal wel, omdat de 25e Eerste Kerstdag is. Veel werkgevers betalen dan eerder." },
      { v: "Mag mijn werkgever de salarisdag verplaatsen?", a: "Niet zomaar. Een vaste dag in je contract of cao kan alleen in overleg veranderen." },
    ],
  },
};

/* Extra verdieping per pagina, zodat elke gids genoeg eigen inhoud heeft. */
const AANVULLING = {
  toeslagen: {
    blokken: [
      {
        kop: "Wijzigingen doorgeven voorkomt terugbetalen",
        tekst:
          "Het voorschot is gebaseerd op het inkomen en de situatie die bij de Belastingdienst bekend zijn. Krijg je een loonsverhoging, ga je samenwonen, verhuis je of verandert je huur, geef dat dan meteen door in Mijn toeslagen. Hoe eerder je dat doet, hoe kleiner het bedrag dat je na de definitieve berekening moet terugbetalen. Andersom werkt het ook: daalt je inkomen, dan kan je voorschot omhoog en hoef je niet een jaar op je geld te wachten.",
      },
    ],
    faq: [
      { v: "Wat gebeurt er als ik te veel toeslag heb gekregen?", a: "Na afloop van het jaar volgt een definitieve berekening. Heb je te veel gekregen, dan krijg je een terugvorderingsbeschikking en kun je een betalingsregeling aanvragen als je het niet in één keer kunt betalen." },
      { v: "Kan ik de betaaldatum zelf kiezen?", a: "Nee. Iedereen krijgt de toeslagen op dezelfde dag, die de Belastingdienst per jaar vastlegt. Alleen de verwerkingstijd van je eigen bank kan een paar uur verschil geven." },
    ],
  },
  kinderbijslag: {
    blokken: [
      {
        kop: "Kinderbijslag en kindgebonden budget zijn twee dingen",
        tekst:
          "Kinderbijslag komt van de SVB en hangt niet af van je inkomen: iedere ouder met een kind onder de 18 die in Nederland woont of werkt, kan het krijgen. Het kindgebonden budget is een toeslag van de Belastingdienst die wel van je inkomen en vermogen afhangt, en die maandelijks vooraf wordt betaald, op dezelfde dag als de andere toeslagen. Wie beide krijgt, ziet dus twee betaalritmes: één keer per kwartaal van de SVB en elke maand van de Belastingdienst.",
      },
    ],
    faq: [
      { v: "Moet ik kinderbijslag zelf aanvragen?", a: "Na de geboorte stuurt de SVB meestal vanzelf een aanvraagformulier, omdat de gemeente de inschrijving doorgeeft. Komt er niets, of krijg je een kind via adoptie of pleegzorg, dan vraag je het zelf aan via Mijn SVB." },
      { v: "Tot welke leeftijd krijg je kinderbijslag?", a: "Tot het kind 18 wordt. Het kwartaal waarin het kind 18 wordt telt nog mee, daarna stopt de kinderbijslag en kan studiefinanciering het overnemen." },
    ],
  },
  minimumloon: {
    blokken: [
      {
        kop: "Wat er nog bovenop komt",
        tekst:
          "Het minimumloon is het bruto uurbedrag dat minimaal moet worden betaald. Daarbovenop heb je recht op minstens 8 procent vakantiegeld, ook bij een minimumloon. Netto hou je minder over door loonheffing, al valt die bij lage inkomens mee door de heffingskortingen. Werk je via een cao, dan kan het loon in je schaal hoger liggen dan het wettelijke minimum: de cao mag nooit lager uitkomen. Het minimumloon wordt twee keer per jaar aangepast, per 1 januari en per 1 juli, op basis van de gemiddelde loonstijging in de cao's.",
      },
      {
        kop: "Stage, oproep en werken als zzp'er",
        tekst:
          "Voor een stage die vooral leren is geldt het minimumloon niet; een stagevergoeding is dan een afspraak. Wie als oproepkracht werkt, heeft per oproep recht op minstens drie uur loon als er minder dan 15 uur per week is afgesproken en de werktijden niet vastliggen. Voor zelfstandigen geldt geen minimumloon, wel bestaat er discussie over een minimumtarief.",
      },
    ],
    faq: [
      { v: "Geldt het minimumloon ook voor een bijbaan?", a: "Ja, voor iedere werknemer met een arbeidsovereenkomst, ook bij een bijbaan, vakantiewerk of een paar uur per week. Het bedrag hangt af van je leeftijd." },
      { v: "Wat als mijn werkgever minder betaalt?", a: "Dan heb je recht op het verschil. Je kunt een melding doen bij de Nederlandse Arbeidsinspectie, die werkgevers kan beboeten en controleren." },
    ],
  },
  aow: {
    blokken: [
      {
        kop: "Doorwerken na je AOW-leeftijd",
        tekst:
          "Je mag na je AOW-leeftijd gewoon doorwerken, en je AOW wordt daar niet op gekort. Over je loon betaal je dan geen AOW-premie meer, waardoor je van hetzelfde brutoloon netto meer overhoudt. Een werkgever mag je arbeidscontract wel laten eindigen op het moment dat je de AOW-leeftijd bereikt. Wil je blijven, dan kun je daarna een nieuw contract afspreken, met eigen regels voor bijvoorbeeld loondoorbetaling bij ziekte.",
      },
    ],
    faq: [
      { v: "Krijg ik AOW als ik in het buitenland woon?", a: "Ja, de AOW wordt ook uitbetaald als je in het buitenland woont. De hoogte hangt af van het aantal jaren dat je in Nederland verzekerd was." },
      { v: "Kan ik eerder met pensioen dan mijn AOW-leeftijd?", a: "Je aanvullende pensioen kun je vaak eerder laten ingaan, de AOW niet. De periode tot je AOW-datum moet je dan zelf overbruggen." },
    ],
  },
  salaris: {
    blokken: [
      {
        kop: "Loonstrook: waar je op let",
        tekst:
          "Komt je salaris binnen, kijk dan even naar je loonstrook. Daarop zie je het brutoloon, de ingehouden loonheffing, de pensioenpremie en eventuele toeslagen voor overuren of onregelmatige diensten. Werk je in deeltijd, controleer dan of het aantal uren klopt. Fouten zie je vaak pas als je twee maanden naast elkaar legt, bijvoorbeeld wanneer de heffingskorting ineens wel of niet is toegepast.",
      },
    ],
    faq: [
      { v: "Waarom is mijn salaris in januari soms lager?", a: "Per 1 januari veranderen de belastingtarieven, de premies en vaak ook de pensioeninhouding. Daardoor kan het nettobedrag een paar euro hoger of lager uitvallen dan in december." },
      { v: "Wat is het verschil tussen bruto en netto?", a: "Bruto is wat je werkgever afspreekt. Netto is wat op je rekening komt nadat loonheffing en premies zijn ingehouden." },
    ],
  },
  uren: {
    blokken: [
      {
        kop: "Uren invullen voor werk en declaraties",
        tekst:
          "Veel urenregistraties vragen om een decimaal getal: 7,75 uur in plaats van 7 uur en 45 minuten. Wie die twee door elkaar haalt, schrijft per dag ongeveer een half uur verkeerd op, en dat telt over een maand flink op. De rekenhulp hierboven geeft daarom beide. Werk je met kwartieren, dan zijn 0,25, 0,5 en 0,75 de enige decimalen die je nodig hebt. Rond niet per dag af als je per week declareert, maar tel eerst de minuten op en reken dan pas om.",
      },
    ],
    faq: [
      { v: "Telt de pauze mee als werktijd?", a: "Meestal niet. Een pauze waarin je echt vrij bent, is geen werktijd. Moet je in je pauze bereikbaar of inzetbaar blijven, dan kan dat anders liggen." },
      { v: "Hoeveel pauze is verplicht?", a: "Bij meer dan 5,5 uur werk heb je volgens de Arbeidstijdenwet recht op minstens een half uur pauze, bij meer dan 10 uur op drie kwartier. Een cao kan andere afspraken maken." },
    ],
  },
  schrikkeljaar: {
    blokken: [
      {
        kop: "Twee weekdagen opschuiven",
        tekst:
          "Een schrikkeljaar heeft 366 dagen: 52 weken en twee dagen. Een datum na 29 februari schuift in een schrikkeljaar daarom twee weekdagen op ten opzichte van het jaar ervoor, in plaats van één. Valt Koningsdag in 2027 op een dinsdag, dan valt hij in 2028 op een donderdag. Datums in januari en februari schuiven pas het jaar na het schrikkeljaar twee dagen op. De kans om op 29 februari geboren te worden is ongeveer één op 1.461.",
      },
    ],
    faq: [
      { v: "Werk je op 29 februari een dag extra?", a: "Wie een maandsalaris krijgt, werkt in een schrikkeljaar een dag meer voor hetzelfde geld als 29 februari op een werkdag valt. Bij uurloon krijg je die dag gewoon betaald." },
      { v: "Waarom 29 februari en niet een andere dag?", a: "Februari was in de Romeinse kalender de laatste maand van het jaar. De extra dag kwam dus aan het eind van het jaar en is daar gebleven." },
    ],
  },
  "dag-van-jaar": {
    blokken: [
      {
        kop: "Waar dagnummers worden gebruikt",
        tekst:
          "Dagnummers komen vaker voor dan je denkt. Op voedselverpakkingen en blikjes staat soms een productiecode met het jaartal en het dagnummer, de zogeheten juliaanse datum. Logistieke bedrijven, laboratoria en het leger gebruiken het om datums kort en ondubbelzinnig te noteren. Ook in programmeertalen en spreadsheets kun je het dagnummer opvragen. Een code als 27032 betekent dan dag 32 van 2027, oftewel 1 februari.",
      },
      {
        kop: "Halverwege het jaar",
        tekst:
          "In een gewoon jaar valt het midden van het jaar op 2 juli: dag 183, met 182 dagen ervoor en 182 erna. In een schrikkeljaar ligt het midden tussen 1 en 2 juli.",
      },
    ],
    faq: [
      { v: "Wat is een juliaanse datum?", a: "In de volksmond het jaartal plus het dagnummer, zoals 27032. Sterrenkundigen gebruiken de term voor een doorlopende dagtelling sinds 4713 voor Christus, wat iets heel anders is." },
      { v: "Welke dag is dag 100?", a: "In een gewoon jaar is dat 10 april, in een schrikkeljaar 9 april. De zoeker hierboven rekent elke datum uit." },
    ],
  },
  keukenhof: {
    blokken: [
      {
        kop: "Bereikbaarheid en parkeren",
        tekst:
          "De Keukenhof ligt tussen Lisse en Hillegom. In het seizoen rijden er speciale bussen vanaf onder meer Schiphol, Leiden Centraal en Haarlem; vaak kun je een combiticket voor bus en entree kopen. Met de auto parkeer je op het terrein tegen betaling. Op drukke dagen staat het verkeer rond Lisse vast, dus wie met de auto komt, is vroeg op weg beter af. Fietsen kan ook: er zijn bewaakte fietsenstallingen en mooie routes langs de bollenvelden.",
      },
    ],
    faq: [
      { v: "Moet ik vooraf tickets kopen?", a: "Ja, de Keukenhof werkt met online tickets voor een gekozen dag en tijdslot. Aan de kassa kopen is op drukke dagen vaak niet mogelijk." },
      { v: "Kun je de bollenvelden gratis zien?", a: "Ja. De velden rond Lisse, Hillegom en Noordwijkerhout liggen langs openbare wegen. Blijf wel op het pad en loop niet de velden in: dat beschadigt de bollen van de kwekers." },
    ],
  },
};

export const GIDS2_INHOUD = Object.fromEntries(
  Object.entries(BASIS).map(([id, i]) => {
    const extra = AANVULLING[id];
    return [id, extra ? { ...i, blokken: [...i.blokken, ...extra.blokken], faq: [...i.faq, ...extra.faq] } : i];
  }),
);
