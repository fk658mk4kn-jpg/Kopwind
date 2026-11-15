/**
 * content/gidsen3.js
 *
 * Teksten voor de pagina's van v3.40.0 "Sirocco": rekenhulpen (procenten,
 * btw, datum, Romeinse cijfers, vakantiedagen, kilometervergoeding), zorg
 * rond de jaarwisseling, belastingteruggave en het vuurwerkverbod.
 * Bedragen staan in lib/geld.js en lib/rekenen.js. Bronnen in LOGBOEK Run 20.
 */

export const GIDS3_INHOUD = {
  procenten: {
    h1: "Procenten berekenen",
    intro:
      "Hoeveel is 15 procent van 80? Hoeveel procent is 12 van 48? Hoeveel is iets gestegen of gedaald? De rekenhulp hieronder doet de vier sommen die je het vaakst nodig hebt. Daaronder staat hoe je ze zelf uitrekent, met voorbeelden uit het dagelijks leven.",
    blokken: [
      {
        kop: "Procent van een getal",
        tekst:
          "Procent betekent per honderd. Wil je 15 procent van 80 weten, dan deel je 15 door 100 en vermenigvuldig je met 80: 0,15 keer 80 is 12. Uit je hoofd gaat het vaak sneller via 10 procent: 10 procent van 80 is 8, de helft daarvan is 4, samen 12. Zo reken je ook snel een fooi uit: 10 procent van de rekening plus de helft daarvan is 15 procent.",
      },
      {
        kop: "Hoeveel procent is het?",
        tekst:
          "Wil je weten welk deel een getal is van een ander getal, deel dan het deel door het geheel en vermenigvuldig met 100. Twaalf van de 48 vragen goed is 12 gedeeld door 48 is 0,25, dus 25 procent. Dezelfde som gebruik je voor een cijfer op een toets, het deel van je salaris dat naar huur gaat of hoeveel van je spaardoel je al hebt bereikt.",
      },
      {
        kop: "Stijging en daling",
        tekst:
          "Een procentuele verandering reken je altijd ten opzichte van het oude getal. Ging je huur van 900 naar 945 euro, dan is het verschil 45, en 45 gedeeld door 900 is 0,05: een stijging van 5 procent. Bij een daling werkt het hetzelfde, alleen is de uitkomst negatief. Let op het verschil tussen procent en procentpunt: gaat een rente van 2 naar 3 procent, dan stijgt hij met één procentpunt, maar met 50 procent.",
      },
      {
        kop: "Korting en opslag",
        tekst:
          "Een korting van 25 procent betekent dat je 75 procent betaalt: vermenigvuldig de prijs met 0,75. Een opslag van 8 procent betekent vermenigvuldigen met 1,08. Twee kortingen na elkaar tel je niet bij elkaar op: 20 procent korting en daarna nog eens 10 procent is samen 28 procent, niet 30, omdat de tweede korting over een lager bedrag gaat.",
      },
      {
        kop: "Terugrekenen naar het origineel",
        tekst:
          "Weet je alleen de prijs na korting, deel dan door wat je betaalt. Kost iets na 20 procent korting 60 euro, dan was de oude prijs 60 gedeeld door 0,8 is 75 euro. Hetzelfde trucje gebruik je voor btw: een prijs inclusief 21 procent btw deel je door 1,21 om de prijs zonder btw te vinden.",
      },
    ],
    faq: [
      { v: "Hoe reken ik snel 21 procent uit?", a: "Neem 20 procent (een vijfde) en tel er 1 procent bij op. Van 50 euro is dat 10 plus 0,50, dus 10,50 euro." },
      { v: "Is 50 procent erbij en daarna 50 procent eraf weer hetzelfde?", a: "Nee. Honderd plus 50 procent is 150, en 50 procent daarvan eraf is 75. Je eindigt een kwart lager dan je begon." },
      { v: "Wat is een promille?", a: "Per duizend in plaats van per honderd. Eén procent is tien promille." },
      { v: "Hoe reken ik een percentage om naar een breuk?", a: "Zet het getal boven 100 en vereenvoudig: 25 procent is 25/100, oftewel een kwart. 12,5 procent is een achtste." },
      { v: "Waarom klopt mijn uitkomst niet met de kassabon?", a: "Winkels ronden af op hele centen, soms per artikel en soms over het totaal. Dat geeft een verschil van een paar cent." },
    ],
  },

  btw: {
    h1: "Btw berekenen: 21 en 9 procent",
    intro:
      "Reken een bedrag om van exclusief naar inclusief btw of andersom, met het tarief van 21 of 9 procent. De rekenhulp toont het bedrag zonder btw, de btw zelf en het totaal. Daaronder staat welk tarief waarvoor geldt en hoe je het zelf uitrekent.",
    blokken: [
      {
        kop: "Btw erbij rekenen",
        tekst:
          "Heb je een bedrag zonder btw, vermenigvuldig dan met 1,21 bij het algemene tarief of met 1,09 bij het verlaagde tarief. Een factuur van 400 euro exclusief btw wordt 484 euro inclusief 21 procent. De btw zelf is het verschil: 84 euro. Op een factuur voor een bedrijf moeten beide bedragen en het tarief apart staan.",
      },
      {
        kop: "Btw eraf rekenen",
        tekst:
          "De meest gemaakte fout is 21 procent van het totaalbedrag aftrekken. Dat klopt niet, want de btw is berekend over het bedrag zonder btw. Deel daarom het bedrag inclusief btw door 1,21. Van 121 euro is het bedrag zonder btw 100 euro en de btw 21 euro, terwijl 21 procent van 121 euro 25,41 euro zou zijn. Bij 9 procent deel je door 1,09.",
      },
      {
        kop: "Welk tarief geldt waarvoor",
        tekst:
          "Het algemene tarief van 21 procent geldt voor de meeste producten en diensten: elektronica, kleding, meubels, reparaties aan huis door een aannemer, alcohol en de meeste zakelijke diensten. Het verlaagde tarief van 9 procent geldt onder meer voor eten en niet-alcoholische dranken, boeken en tijdschriften, medicijnen, de kapper, fietsreparaties, sportaccommodaties en culturele toegangskaartjes. Sinds 1 januari 2026 vallen hotelovernachtingen en vakantieverblijven onder 21 procent; het ontbijt in het hotel blijft 9 procent.",
      },
      {
        kop: "Het nultarief en vrijstellingen",
        tekst:
          "Het nultarief van 0 procent geldt vooral voor export buiten de EU en voor levering aan bedrijven in andere EU-landen, waarbij de afnemer de btw in zijn eigen land afdraagt. Dat is iets anders dan een vrijstelling. Vrijgesteld zijn bijvoorbeeld zorg door een arts of fysiotherapeut, de meeste onderwijsdiensten en de verhuur van woonruimte. Bij een vrijstelling reken je geen btw, maar kun je de btw op je eigen inkopen ook niet terugvragen.",
      },
      {
        kop: "Kleine ondernemers",
        tekst:
          "Wie als ondernemer minder dan 20.000 euro omzet per jaar heeft, kan de kleineondernemersregeling gebruiken. Je rekent dan geen btw aan klanten en doet geen btw-aangifte, maar je kunt de btw op je eigen inkopen ook niet terugvragen. Voor een zzp'er met veel particuliere klanten is dat vaak gunstig, voor iemand met dure investeringen soms niet. Reken het voor je eigen situatie na of vraag het een boekhouder.",
      },
    ],
    faq: [
      { v: "Hoeveel is 21 procent btw van 100 euro?", a: "Exclusief 100 euro wordt inclusief 121 euro. Zit de btw al in 100 euro, dan is het bedrag zonder btw 82,64 euro en de btw 17,36 euro." },
      { v: "Moet een particulier btw betalen?", a: "Ja, de btw zit in de prijs die je in de winkel betaalt. Een particulier kan de btw niet terugvragen, een ondernemer met btw-plichtige omzet wel." },
      { v: "Waarom staat er op mijn bon zowel 9 als 21 procent?", a: "Omdat de producten onder verschillende tarieven vallen, bijvoorbeeld boodschappen (9 procent) en een fles wijn of een schoonmaakmiddel (21 procent)." },
      { v: "Gaat de btw op sport en cultuur omhoog?", a: "Dat plan is geschrapt. Toegang tot sport, musea, theater en concerten blijft 9 procent." },
      { v: "Hoe vaak doe je btw-aangifte?", a: "Meestal per kwartaal, uiterlijk een maand na afloop. Sommige ondernemers doen het per maand of per jaar." },
    ],
  },

  "datum-berekenen": {
    h1: "Datum berekenen: dagen erbij of eraf",
    intro:
      "Welke datum is het over 90 dagen? Wat was de datum 6 weken geleden? Vul een begindatum in en tel er dagen, weken of maanden bij of af. De rekenhulp geeft de datum, de weekdag en het weeknummer, en kan ook alleen werkdagen tellen.",
    blokken: [
      {
        kop: "Waar je het voor nodig hebt",
        tekst:
          "Termijnen staan vaak in dagen of weken: een opzegtermijn van een maand, veertien dagen bedenktijd bij een online aankoop, een betalingstermijn van 30 dagen op een factuur, een proeftijd van twee maanden of een uitgerekende datum van een levering. In plaats van op de kalender te tellen, vul je de begindatum en de termijn in en heb je de einddatum, inclusief de dag van de week.",
      },
      {
        kop: "Dagen, weken en maanden",
        tekst:
          "Dagen en weken zijn eenvoudig: een week is altijd zeven dagen. Maanden zijn lastiger, omdat ze verschillend lang zijn. De rekenhulp telt een maand als dezelfde dag in de volgende maand. Bestaat die dag niet, zoals 31 februari, dan wordt het de laatste dag van die maand. Een maand na 31 januari is dus 28 februari, of 29 februari in een schrikkeljaar.",
      },
      {
        kop: "Werkdagen tellen",
        tekst:
          "Sommige termijnen tellen alleen werkdagen, bijvoorbeeld een levertijd of een wettelijke termijn bij de overheid. Zet dan het vinkje voor werkdagen aan. De rekenhulp slaat zaterdagen, zondagen en de algemeen erkende feestdagen over: Nieuwjaarsdag, Tweede Paasdag, Koningsdag, Hemelvaartsdag, Tweede Pinksterdag en beide kerstdagen. Bevrijdingsdag telt eens in de vijf jaar als vrije dag mee, net als in veel cao's.",
      },
      {
        kop: "Telt de begindag mee?",
        tekst:
          "Bij wettelijke termijnen meestal niet: een termijn van veertien dagen die op maandag begint, eindigt op maandag twee weken later. Zo rekent deze rekenhulp ook. Valt het einde van een wettelijke termijn op een zaterdag, zondag of feestdag, dan schuift die in Nederland vaak door naar de eerstvolgende werkdag. Dat staat in de Algemene termijnenwet. Contracten kunnen andere afspraken maken, dus lees bij een belangrijke deadline de kleine lettertjes.",
      },
      {
        kop: "Terug in de tijd",
        tekst:
          "Met een min-teken reken je terug. Handig voor de vraag wanneer je iets uiterlijk moet versturen om op tijd te zijn, of welke datum het was toen een termijn begon. Wil je weten hoeveel dagen er tussen twee datums zitten, dan is de pagina dagen tussen twee datums handiger.",
      },
    ],
    faq: [
      { v: "Welke datum is het over 100 dagen?", a: "Dat hangt af van vandaag. Vul 100 in bij het aantal dagen; de rekenhulp start standaard op de datum van vandaag." },
      { v: "Hoeveel dagen is een maand?", a: "Tussen 28 en 31. Gemiddeld 30,4 dagen, omdat een jaar 365,25 dagen heeft verdeeld over twaalf maanden." },
      { v: "Hoe lang is de bedenktijd bij een online aankoop?", a: "Veertien dagen, gerekend vanaf de dag nadat je het product hebt ontvangen." },
      { v: "Telt een feestdag als werkdag?", a: "Niet in deze rekenhulp. In je eigen contract of cao kan dat anders zijn." },
      { v: "Kan ik ook uren of minuten optellen?", a: "Daarvoor is de pagina uren berekenen bedoeld, met begin- en eindtijd en pauze." },
    ],
  },

  "zorg-overstappen": {
    h1: "Zorgverzekering overstappen: tot wanneer kan het?",
    intro:
      "Elk jaar mag je per 1 januari van zorgverzekering wisselen. Opzeggen kan tot en met 31 december, een nieuwe verzekering afsluiten tot en met 31 januari, met terugwerkende kracht tot 1 januari. Hieronder staat hoeveel tijd je nog hebt, en waar je op let bij het vergelijken.",
    blokken: [
      {
        kop: "De twee data die tellen",
        tekst:
          "Tot en met 31 december kun je je huidige zorgverzekering opzeggen. Sluit je voor die datum een nieuwe verzekering af, dan zegt je nieuwe verzekeraar de oude meestal voor je op. Heb je op tijd opgezegd maar nog geen nieuwe polis, dan heb je tot en met 31 januari om er een af te sluiten. Je bent dan met terugwerkende kracht vanaf 1 januari verzekerd, zodat er geen gat in je dekking zit.",
      },
      {
        kop: "Wat er in 2027 verandert",
        tekst:
          "Het verplicht eigen risico stijgt in 2027 van 385 naar 400 euro, voor het eerst sinds jaren. Het kabinet rekent met een gemiddelde basispremie van ongeveer 2.029 euro per jaar, zo'n 12,50 euro per maand meer dan in 2026. De verzekeraars maken hun premies half november bekend. Hoeveel jij gaat betalen, staat in de brief of mail die je verzekeraar je in november stuurt.",
      },
      {
        kop: "Basisverzekering: wat je vergelijkt",
        tekst:
          "De dekking van de basisverzekering is bij iedereen gelijk, want die bepaalt de overheid. Verschillen zitten in de premie, het soort polis en de zorgverleners waarmee een verzekeraar een contract heeft. Een naturapolis is vaak duurder maar vergoedt alle gecontracteerde zorg volledig. Bij een budgetpolis met een beperkte keuze krijg je bij een niet-gecontracteerd ziekenhuis soms maar een deel vergoed. Kijk dus of jouw ziekenhuis of specialist erin zit voordat je kiest op prijs.",
      },
      {
        kop: "Aanvullend verzekeren",
        tekst:
          "Fysiotherapie, de tandarts voor volwassenen en brillen zitten niet in de basisverzekering. Een aanvullende verzekering is alleen zinvol als je de vergoeding echt gebruikt; reken na wat je vorig jaar zelf hebt betaald. Let op: een verzekeraar moet je accepteren voor de basisverzekering, maar mag je voor een aanvullende verzekering weigeren of vragen stellen over je gezondheid, vooral bij uitgebreide tandartsdekking.",
      },
      {
        kop: "Vrijwillig eigen risico",
        tekst:
          "Je kunt je eigen risico vrijwillig verhogen met maximaal 500 euro, in ruil voor een lagere premie. Dat loont alleen als je weinig zorg gebruikt en het geld voor het hogere eigen risico achter de hand hebt. Bij een ongeluk of een plotselinge behandeling betaal je dan in één jaar het volledige bedrag. Wie veel medicijnen gebruikt of een behandeling verwacht, kiest beter voor het verplichte eigen risico.",
      },
    ],
    faq: [
      { v: "Kan ik in de loop van het jaar overstappen?", a: "Alleen in bijzondere situaties, bijvoorbeeld als je verzekeraar de voorwaarden in het nadeel verandert of als je via een nieuwe werkgever in een collectiviteit komt. Het gewone moment is 1 januari." },
      { v: "Hoe zeg ik mijn zorgverzekering op?", a: "Het makkelijkst door voor 31 december een nieuwe verzekering af te sluiten: de nieuwe verzekeraar zegt de oude op. Zelf opzeggen kan schriftelijk of online, ook tot en met 31 december." },
      { v: "Moet ik zorgtoeslag opnieuw aanvragen als ik overstap?", a: "Nee. Zorgtoeslag hangt af van je inkomen, niet van je verzekeraar. Wel moet je verzekering op je eigen naam staan." },
      { v: "Wat is een collectiviteitskorting?", a: "Een korting op de premie via een werkgever, vakbond of andere groep. Die is maximaal 5 procent op de basisverzekering." },
      { v: "Wat als ik vergeet een nieuwe polis af te sluiten?", a: "Heb je opgezegd en voor 1 februari niets nieuws geregeld, dan ben je onverzekerd. Dat leidt tot een boete en je moet de premie alsnog betalen." },
    ],
  },

  "eigen-risico": {
    h1: "Eigen risico 2027: 400 euro",
    intro:
      "Het verplicht eigen risico van de zorgverzekering is in 2027 400 euro, voor iedereen van 18 jaar en ouder. Hieronder lees je wat er wel en niet onder valt, en met de rekenhulp zie je hoeveel je zelf betaalt bij een behandeling.",
    blokken: [
      {
        kop: "Hoe het eigen risico werkt",
        tekst:
          "Het eigen risico is het deel van je zorgkosten dat je per kalenderjaar zelf betaalt voordat de basisverzekering vergoedt. De eerste 400 euro aan zorg die onder het eigen risico valt, komt voor jouw rekening. Alles daarboven betaalt de verzekeraar. Op 1 januari begint de teller opnieuw. Gebruik je in een jaar minder zorg, dan betaal je ook minder: wie niets nodig heeft, betaalt niets van het eigen risico.",
      },
      {
        kop: "Wat er niet onder valt",
        tekst:
          "Een bezoek aan de huisarts telt niet mee, net als zorg die de huisarts zelf doet. Ook de verloskundige, kraamzorg, wijkverpleging en zorg voor kinderen onder de 18 vallen buiten het eigen risico. Zorg die niet in de basisverzekering zit, zoals de tandarts voor volwassenen of fysiotherapie uit een aanvullende verzekering, valt er ook niet onder: die vergoedt de aanvullende verzekering of je betaalt hem zelf.",
      },
      {
        kop: "Wat er wel onder valt",
        tekst:
          "Onder het eigen risico vallen onder meer behandelingen in het ziekenhuis, onderzoek in een laboratorium, medicijnen van de apotheek (met een paar uitzonderingen), ambulancevervoer, geestelijke gezondheidszorg en hulpmiddelen. Ook als je huisarts je doorstuurt voor bloedonderzoek telt dat mee. Een ziekenhuisbehandeling kost al snel meer dan 400 euro, dus één behandeling is vaak genoeg om het hele eigen risico te verbruiken.",
      },
      {
        kop: "Gespreid betalen",
        tekst:
          "Verwacht je het hele eigen risico te gebruiken, bijvoorbeeld door vaste medicijnen of een geplande behandeling, dan bieden de meeste verzekeraars aan om het in termijnen te betalen. Je betaalt dan elke maand een vast bedrag erbij, in plaats van in één keer een rekening van honderden euro's. Achteraf wordt verrekend wat je niet hebt gebruikt. Vraag het na bij je verzekeraar, meestal moet je het aan het begin van het jaar regelen.",
      },
      {
        kop: "Waarom het omhoog gaat",
        tekst:
          "Het eigen risico stond sinds 2016 op 385 euro omdat het elk jaar werd bevroren. Zonder nieuwe bevriezingswet stijgt het volgens de wet mee met de zorgkosten. Voor 2027 is er geen bevriezing gekomen, waardoor het naar 400 euro gaat. Plannen om het eigen risico flink te verlagen zijn van tafel; wat er na 2027 gebeurt, hangt af van nieuwe besluiten van het kabinet.",
      },
    ],
    faq: [
      { v: "Telt de huisarts mee voor het eigen risico?", a: "Nee, consulten bij de huisarts zijn gratis. Stuurt de huisarts je door naar een lab of ziekenhuis, dan telt dat wel mee." },
      { v: "Hoe zie ik hoeveel eigen risico ik al heb verbruikt?", a: "In de app of op de website van je verzekeraar. Daar staat per declaratie wat onder het eigen risico viel." },
      { v: "Geldt het eigen risico voor kinderen?", a: "Nee, voor iedereen onder de 18 is er geen eigen risico." },
      { v: "Wat als ik in januari word geopereerd voor zorg die in december begon?", a: "Dan kan de behandeling verdeeld over twee jaren meetellen. Het eigen risico geldt voor het jaar waarin de behandeling begon, maar vraag het voor jouw situatie na." },
      { v: "Krijg ik het eigen risico terug als ik het niet gebruik?", a: "Als je gespreid betaalt, wordt het teveel betaalde terugbetaald. Betaal je per declaratie, dan betaal je alleen wat je gebruikt." },
    ],
  },

  kilometervergoeding: {
    h1: "Kilometervergoeding: 0,25 euro onbelast",
    intro:
      "Je werkgever mag sinds 1 januari 2026 maximaal 0,25 euro per kilometer belastingvrij vergoeden, en dat bedrag geldt ook in 2027. De rekenhulp rekent je vergoeding per dag, maand en jaar uit voor je woon-werkverkeer. Daaronder staan de regels.",
    blokken: [
      {
        kop: "Wat de onbelaste vergoeding is",
        tekst:
          "De onbelaste kilometervergoeding is het bedrag dat een werkgever per kilometer mag vergoeden zonder dat jij of de werkgever er belasting over betaalt. Het geldt voor elke manier van reizen: auto, fiets, lopen, motor of carpool. Het bedrag ging per 1 januari 2026 van 0,23 naar 0,25 euro. Volgens het Belastingplan 2027 blijft het in 2027 op 0,25 euro staan.",
      },
      {
        kop: "Is je werkgever verplicht?",
        tekst:
          "Nee. Een reiskostenvergoeding is geen wettelijke plicht. Of je hem krijgt en hoeveel, staat in je arbeidscontract of cao. Veel werkgevers geven 0,23 of 0,25 euro, sommige minder, en sommige een vast bedrag per maand. Krijg je meer dan 0,25 euro, dan is het deel erboven belast, tenzij de werkgever het onderbrengt in de vrije ruimte van de werkkostenregeling.",
      },
      {
        kop: "Een vaste vergoeding per maand",
        tekst:
          "Werkgevers geven vaak een vast bedrag per maand in plaats van per gereden kilometer. Dat mag onbelast als je op minstens 128 dagen per jaar naar dezelfde werkplek reist. Voor een volle werkweek van vijf dagen rekenen ze dan met 214 reisdagen per jaar, wat rekening houdt met vakantie en feestdagen. Werk je minder dagen, dan gaat het naar rato. De rekenhulp hierboven gebruikt dezelfde rekenregel.",
      },
      {
        kop: "Openbaar vervoer",
        tekst:
          "Reis je met de trein, bus of tram, dan mag je werkgever ook de werkelijke kosten van je abonnement of losse reizen onbelast vergoeden. Dat kan meer zijn dan 0,25 euro per kilometer, vooral bij korte afstanden. Krijg je een OV-abonnement van je werkgever, dan krijg je er meestal geen kilometervergoeding meer bij voor dezelfde reizen.",
      },
      {
        kop: "Thuiswerken",
        tekst:
          "Op een dag dat je thuiswerkt, reis je niet en geldt de kilometervergoeding niet. In plaats daarvan mag de werkgever een onbelaste thuiswerkvergoeding per dag geven. Werk je deels thuis en deels op kantoor, dan krijg je per dag het een of het ander, niet allebei. Bij een vaste vergoeding houdt de werkgever rekening met het vaste patroon van thuiswerkdagen.",
      },
    ],
    faq: [
      { v: "Hoe bereken ik mijn reiskostenvergoeding?", a: "Enkele reisafstand keer twee, keer 0,25 euro, keer het aantal dagen dat je reist. Bij 15 kilometer enkele reis is dat 7,50 euro per dag." },
      { v: "Welke route telt?", a: "Meestal de kortste of snelste route volgens een routeplanner. De werkgever mag daar een vaste regel voor kiezen." },
      { v: "Krijg ik vergoeding als ik ziek ben?", a: "Bij een vaste vergoeding mag die bij een korte ziekte doorlopen. Ben je langer dan zes weken achter elkaar afwezig, dan stopt hij meestal." },
      { v: "Geldt de 0,25 euro ook voor zakelijke ritten?", a: "Ja, voor zakelijke ritten met je eigen vervoer geldt hetzelfde maximum." },
      { v: "Kan ik als zzp'er kilometers aftrekken?", a: "Ja, met je eigen auto mag je zakelijke kilometers aftrekken. Het bedrag per kilometer kan afwijken van dat voor werknemers; kijk bij de Belastingdienst." },
    ],
  },

  vakantiedagen: {
    h1: "Vakantiedagen berekenen",
    intro:
      "Op hoeveel vakantiedagen heb je recht? Wettelijk is het minimum vier keer het aantal uren dat je per week werkt. De rekenhulp rekent het om naar uren en dagen, ook als je deeltijd werkt of halverwege het jaar bent begonnen.",
    blokken: [
      {
        kop: "Het wettelijke minimum",
        tekst:
          "Elke werknemer bouwt per jaar minstens vier keer zijn wekelijkse arbeidsduur aan vakantie op. Werk je 40 uur per week, dan is dat 160 uur, oftewel 20 dagen van 8 uur. Werk je 24 uur in drie dagen, dan is het 96 uur, oftewel 12 dagen van 8 uur. In aantal weken vrij is dat voor iedereen hetzelfde: vier weken.",
      },
      {
        kop: "Bovenwettelijke dagen",
        tekst:
          "Veel werkgevers en cao's geven meer dan het minimum, vaak 25 dagen bij een volledige werkweek of nog meer. Alles boven het wettelijke aantal heten bovenwettelijke dagen. Die hebben andere regels: ze verjaren pas na vijf jaar en mogen tijdens je dienstverband worden uitbetaald als dat in je contract of cao staat. Kijk op je loonstrook of in het personeelssysteem hoeveel van elk soort je hebt.",
      },
      {
        kop: "Wanneer dagen vervallen",
        tekst:
          "Wettelijke vakantiedagen vervallen zes maanden na het einde van het jaar waarin je ze hebt opgebouwd, dus op 1 juli van het jaar erna. Dat geldt alleen als je ze redelijkerwijs had kunnen opnemen. Je werkgever moet je erop wijzen dat je nog dagen hebt en dat ze gaan vervallen. Kon je ze niet opnemen, bijvoorbeeld door ziekte, dan blijven ze langer staan.",
      },
      {
        kop: "Begonnen of gestopt in de loop van het jaar",
        tekst:
          "Je bouwt vakantiedagen op naar rato van de tijd dat je in dienst bent. Begin je op 1 juli, dan heb je dat jaar recht op de helft. Ga je uit dienst, dan worden de dagen die je nog hebt uitbetaald, de wettelijke en de bovenwettelijke. Vul in de rekenhulp het aantal maanden in om dit uit te rekenen.",
      },
      {
        kop: "Ziek, zwanger of ouderschapsverlof",
        tekst:
          "Tijdens ziekte bouw je gewoon vakantiedagen op, ook als je langdurig ziek bent. Tijdens zwangerschaps- en bevallingsverlof ook. Ben je ziek tijdens je vakantie, meld het dan meteen bij je werkgever: in principe krijg je die dagen terug. Bij onbetaald ouderschapsverlof bouw je over de uren die je niet werkt meestal geen vakantie op.",
      },
    ],
    faq: [
      { v: "Op hoeveel vakantiedagen heb ik recht bij 32 uur?", a: "Wettelijk 128 uur per jaar. Bij vier dagen van 8 uur zijn dat 16 dagen, en dus vier weken vrij." },
      { v: "Zijn feestdagen vakantiedagen?", a: "Nee. Of je op feestdagen vrij bent, staat in je contract of cao. De wet geeft geen recht op vrij met Pasen of Kerst." },
      { v: "Mag mijn werkgever vakantiedagen weigeren?", a: "Alleen als er een gewichtige reden is, en hij moet binnen twee weken na je aanvraag schriftelijk reageren. Reageert hij niet, dan is de vakantie volgens de wet toegestaan." },
      { v: "Mag ik mijn wettelijke dagen laten uitbetalen?", a: "Niet tijdens je dienstverband. Alleen bovenwettelijke dagen mogen worden uitbetaald, en alleen bij uitdiensttreding de wettelijke." },
      { v: "Bouwen oproepkrachten ook vakantie op?", a: "Ja, iedere werknemer bouwt vakantie op, ook met een nulurencontract. Vaak wordt het per gewerkt uur als vakantietoeslag uitbetaald." },
    ],
  },

  vuurwerk: {
    h1: "Mag je vuurwerk afsteken met oud en nieuw?",
    intro:
      "Nee. Bij de jaarwisseling van 2026 op 2027 geldt voor het eerst het landelijke vuurwerkverbod. Consumenten mogen geen knalvuurwerk en siervuurwerk uit de categorieën F2 en F3 meer kopen of afsteken. Sterretjes en ander lichte F1-vuurwerk mogen nog wel. Hieronder lees je wat er wel en niet mag, en hoe lang het nog duurt tot oud en nieuw.",
    blokken: [
      {
        kop: "Wat het verbod inhoudt",
        tekst:
          "De Wet veilige jaarwisseling is op 1 augustus 2026 ingegaan. Daardoor mogen winkels geen F2- en F3-vuurwerk meer aan consumenten verkopen, en mogen consumenten het ook niet afsteken. Dat geldt voor knallers, vuurpijlen, cakes en fonteinen uit die categorieën. Het verbod geldt in het hele land, niet alleen in de gemeenten die al eerder een eigen verbod hadden.",
      },
      {
        kop: "Wat nog wel mag",
        tekst:
          "F1-vuurwerk blijft toegestaan. Dat is licht vuurwerk met een klein risico, zoals sterretjes, trektouwtjes, knalerwten en kleine grondbloemen. Het mag ook in de winkel worden verkocht. Daarnaast blijven professionele vuurwerkshows mogelijk. Veel gemeenten organiseren een centrale show of een lichtshow met drones om het nieuwe jaar in te luiden; kijk op de site van je gemeente wat er bij jou in de buurt is.",
      },
      {
        kop: "Verenigingen en buurtshows",
        tekst:
          "Verenigingen en stichtingen kunnen bij de burgemeester een ontheffing aanvragen om onder voorwaarden een eigen show te geven. Daarvoor gelden eisen aan veiligheid en deskundigheid. Een buurtgroep die zelf vuurwerk koopt en afsteekt zonder ontheffing, overtreedt het verbod. Wil je met de buurt iets organiseren, vraag dan ruim van tevoren bij de gemeente na wat mogelijk is.",
      },
      {
        kop: "Vuurwerk uit het buitenland",
        tekst:
          "Vuurwerk kopen in België of Duitsland en meenemen helpt niet: afsteken is in Nederland verboden, waar je het ook hebt gekocht. Bovendien is het vervoeren van grote hoeveelheden vuurwerk gevaarlijk en strafbaar. Illegaal vuurwerk zoals cobra's was al verboden en blijft dat; de straffen daarop zijn fors.",
      },
      {
        kop: "Waarom het verbod er is",
        tekst:
          "Elk jaar raakten bij de jaarwisseling honderden mensen gewond door vuurwerk, vaak aan ogen en handen, en een groot deel van hen waren omstanders. Daarnaast waren er brandjes, vernielingen en geweld tegen hulpverleners. Het verbod moet dat terugdringen. Voor dieren en mensen die slecht tegen knallen kunnen, maakt het de jaarwisseling ook rustiger.",
      },
    ],
    faq: [
      { v: "Mag ik nog sterretjes afsteken?", a: "Ja, sterretjes zijn F1-vuurwerk en vallen niet onder het verbod." },
      { v: "Geldt het verbod ook voor carbidschieten?", a: "Carbidschieten is geen vuurwerk en valt niet onder deze wet. De gemeente bepaalt of en waar het mag." },
      { v: "Wat gebeurt er met vuurwerk dat ik nog heb liggen?", a: "Afsteken mag niet meer. Lever het in bij de gemeente of vraag bij de milieustraat hoe je het veilig kwijtraakt." },
      { v: "Mogen vuurwerkwinkels nog open?", a: "Ze mogen geen F2- en F3-vuurwerk meer aan consumenten verkopen. F1-vuurwerk en verkoop aan professionals mag nog wel." },
      { v: "Wordt er gehandhaafd?", a: "Ja, door politie en handhavers van de gemeente. Wie toch vuurwerk afsteekt, riskeert een boete." },
    ],
  },

  belastingteruggave: {
    h1: "Wanneer krijg ik mijn belastingteruggave?",
    intro:
      "Doe je je aangifte inkomstenbelasting voor 1 april, dan krijg je voor 1 juli bericht van de Belastingdienst. Daarna komt de teruggave op je rekening. Hieronder staat waar we nu in het jaar staan, en wat je kunt doen om sneller je geld te krijgen.",
    blokken: [
      {
        kop: "De vaste data",
        tekst:
          "Vanaf 1 maart kun je aangifte doen over het jaar ervoor. Wie dat voor 1 april doet, krijgt volgens de Belastingdienst voor 1 juli een voorlopige aanslag met de uitkomst. Doe je later aangifte, dan streeft de Belastingdienst naar bericht binnen drie maanden. De uiterste datum voor de aangifte is 1 mei, of 1 september als je uitstel hebt aangevraagd.",
      },
      {
        kop: "Voorlopig en definitief",
        tekst:
          "Na je aangifte krijg je eerst een voorlopige aanslag. Daarop staat of je geld terugkrijgt of moet betalen, en het geld wordt dan ook al uitbetaald. Later volgt de definitieve aanslag. Klopt die met je aangifte, dan verandert er niets. Wijkt hij af, dan wordt het verschil verrekend. De Belastingdienst heeft tot drie jaar na het belastingjaar de tijd voor de definitieve aanslag.",
      },
      {
        kop: "Sneller je geld",
        tekst:
          "De snelste manier is vroeg aangifte doen, in maart, met de vooraf ingevulde aangifte. Controleer die wel goed, want niet alles staat er automatisch in. Krijg je elk jaar geld terug, bijvoorbeeld door hypotheekrenteaftrek, dan kun je ook een voorlopige aanslag voor het lopende jaar aanvragen. Je krijgt de teruggave dan in maandelijkse termijnen, in plaats van een jaar later in één keer.",
      },
      {
        kop: "Kleine bedragen",
        tekst:
          "Is de teruggave minder dan 16 euro, dan wordt die niet uitbetaald. Moet je minder dan 57 euro betalen, dan hoef je dat ook niet te doen. Dat scheelt de Belastingdienst administratie. Het geldt per aanslag, dus niet als je over meerdere jaren kleine bedragen hebt.",
      },
      {
        kop: "Wanneer je moet betalen",
        tekst:
          "Krijg je geen geld terug maar moet je bijbetalen, dan staat op de aanslag de uiterste betaaldatum, meestal een paar maanden na de datum van de aanslag. Je kunt het ook in termijnen betalen. Een betalingsregeling of uitstel vraag je aan bij de Belastingdienst als je het bedrag niet op tijd kunt betalen.",
      },
    ],
    faq: [
      { v: "Waarom krijgt mijn partner eerder bericht?", a: "De Belastingdienst verwerkt aangiftes niet in volgorde. Ook als je tegelijk aangifte doet, kan de ene aanslag eerder komen dan de andere." },
      { v: "Krijg ik rente als het lang duurt?", a: "Soms. Komt de aanslag later dan de wettelijke termijn, dan kan de Belastingdienst belastingrente vergoeden. Dat staat dan op de aanslag." },
      { v: "Waar zie ik de status van mijn aangifte?", a: "In Mijn Belastingdienst. Daar staan je aangifte, je aanslagen en de bedragen." },
      { v: "Moet ik aangifte doen als ik geen brief heb gekregen?", a: "Niet verplicht, maar het kan geld opleveren, bijvoorbeeld als je zorgkosten of giften hebt gehad. Je mag tot vijf jaar terug aangifte doen." },
      { v: "Kan de Belastingdienst mijn teruggave verrekenen?", a: "Ja, met een openstaande schuld bij de Belastingdienst, zoals een terugvordering van toeslagen." },
    ],
  },

  romeins: {
    h1: "Romeinse cijfers omrekenen",
    intro:
      "Zet een getal om naar Romeinse cijfers of andersom, van 1 tot en met 3999. Handig voor een jaartal op een gevel, een tatoeage, de nummering van een koning of een wijzerplaat. Daaronder staan de regels en een tabel met de getallen die je het vaakst nodig hebt.",
    blokken: [
      {
        kop: "De zeven tekens",
        tekst:
          "Romeinse cijfers gebruiken zeven letters: I is 1, V is 5, X is 10, L is 50, C is 100, D is 500 en M is 1000. Een getal schrijf je door de tekens van groot naar klein achter elkaar te zetten en op te tellen. XVII is 10 plus 5 plus 1 plus 1, dus 17. MDCCC is 1000 plus 500 plus drie keer 100, dus 1800.",
      },
      {
        kop: "Aftrekken in plaats van optellen",
        tekst:
          "Om lange reeksen te vermijden staat een kleiner teken soms voor een groter teken. Dan trek je het af. IV is 4, IX is 9, XL is 40, XC is 90, CD is 400 en CM is 900. Alleen I, X en C mogen zo voor een groter teken staan, en alleen voor de twee tekens die vijf of tien keer zo groot zijn. 99 is daarom niet IC maar XCIX: 90 plus 9.",
      },
      {
        kop: "Hoe vaak een teken mag",
        tekst:
          "In de gebruikelijke schrijfwijze staan I, X, C en M hoogstens drie keer achter elkaar, en V, L en D nooit twee keer. Vier is dus IV en niet IIII. Op klokken zie je toch vaak IIII voor de vier, een oude traditie die de wijzerplaat evenwichtiger laat lijken. De rekenhulp volgt de standaardregels en zegt het als een schrijfwijze niet klopt.",
      },
      {
        kop: "Jaartallen",
        tekst:
          "Jaartallen zijn het meest gezochte gebruik. 2026 is MMXXVI: twee keer 1000, twee keer 10, 5 en 1. 2027 is MMXXVII. Voor een geboortejaar op een tatoeage of een trouwdatum op een ring is het handig om het na te rekenen voordat het er voor altijd staat. Datums worden vaak geschreven als dag, maand en jaar, gescheiden door punten, bijvoorbeeld XV.XI.MMXXVI.",
      },
      {
        kop: "Waar je ze nog tegenkomt",
        tekst:
          "Romeinse cijfers zie je bij koningen en pausen (Willem III, Benedictus XVI), bij eeuwen in teksten (de XIXe eeuw), bij hoofdstukken en bijlagen in boeken en wetten, op gevels en monumenten en in de aftiteling van films. De Romeinen hadden geen teken voor nul en schreven grote getallen met een streep erboven, wat je tegenwoordig vrijwel niet meer ziet.",
      },
    ],
    faq: [
      { v: "Wat is 2026 in Romeinse cijfers?", a: "MMXXVI." },
      { v: "Wat is het grootste getal dat je kunt schrijven?", a: "Met de standaardregels 3999, MMMCMXCIX. Voor grotere getallen gebruikten de Romeinen een streep boven het teken, wat duizend keer betekent." },
      { v: "Waarom is er geen nul?", a: "De Romeinen rekenden niet met een positiestelsel en hadden geen teken voor nul nodig. De nul kwam via Arabische wiskundigen naar Europa." },
      { v: "Hoe schrijf je 49?", a: "XLIX: 40 (XL) plus 9 (IX). Niet IL." },
      { v: "Is IIII fout?", a: "Volgens de standaardregels wel, IV is juist. Op klokken is IIII een geaccepteerde traditie." },
    ],
  },
};
