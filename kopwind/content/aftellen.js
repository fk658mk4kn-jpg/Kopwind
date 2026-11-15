/**
 * content/aftellen.js
 *
 * Teksten per aftelpagina (v3.35.0 "Bise"). De telling zelf, de datum en
 * de werkdagen rekent de pagina live uit; deze teksten noemen daarom
 * geen jaartallen of aantallen die volgend jaar verouderd zijn. Eigen
 * stem volgens PLAYBOOK (originaliteit): uitleg van hoe de dag valt,
 * wat erbij hoort en wat het weer ermee doet.
 *
 * Linknotatie: [label](tool:id) linkt naar een check.
 */

export const AFTEL_INHOUD = {
  kerst: {
    intro:
      "De teller loopt naar Eerste Kerstdag, 25 december. Eronder staat hoeveel werkdagen er nog tussen zitten, en zodra kerst binnen een week ligt verschijnt de verwachting voor de dag zelf.",
    blokken: [
      {
        kop: "Wordt het een witte kerst?",
        tekst:
          "Officieel is het in Nederland pas een witte kerst als er op beide kerstdagen in De Bilt een sneeuwdek ligt. Dat is zeldzaam: de laatste keer dat het lukte was 2010. Grijs en zacht weer met een graad of acht is veel gewoner. Een week van tevoren zegt de verwachting er al iets zinnigs over; daarvoor is het gokken.",
      },
      {
        kop: "Een kerstwandeling plannen",
        tekst:
          "Wie tussen de maaltijden door naar buiten wil, kijkt het best naar het droogste blok van de middag, want het wordt rond half vijf al donker. De [wandelcheck](tool:wandelen) zoekt dat blok per uur, met wind en gevoelstemperatuur erbij.",
      },
    ],
    faq: [
      { v: "Hoeveel weken is het nog tot kerst?", a: "Het aantal weken staat direct onder de teller, naast de dagen en de werkdagen. Een week rekenen we als zeven volle dagen; de rest staat als losse dagen vermeld." },
      { v: "Telt Tweede Kerstdag mee als vrije dag?", a: "Ja. Eerste en Tweede Kerstdag zijn allebei officiele feestdagen en tellen daarom niet mee als werkdag in onze werkdagentelling." },
      { v: "Wanneer begint de kerstvakantie?", a: "De kerstvakantie begint meestal een week voor kerst en geldt voor alle regio's tegelijk. De precieze data per schooljaar staan op de pagina over de kerstvakantie." },
    ],
  },
  "witte-kerst": {
    intro:
      "Of kerst wit wordt, valt pas in de laatste week te zeggen. Tot die tijd telt deze pagina af en legt uit waar je op let; zodra de kerstdagen binnen bereik zijn, staat hier de sneeuwverwachting voor beide dagen.",
    blokken: [
      {
        kop: "Wanneer is het officieel een witte kerst?",
        tekst:
          "In Nederland is het een witte kerst als er op zowel Eerste als Tweede Kerstdag een sneeuwdek ligt in De Bilt. Een paar vlokken op kerstavond tellen dus niet mee, en sneeuw in Drenthe terwijl het in De Bilt groen is ook niet. Dat maakt het officiele predicaat zeldzaam: de laatste keer was in 2010.",
      },
      {
        kop: "Waar kijk je naar in de verwachting?",
        tekst:
          "Twee dingen moeten samenvallen: er moet neerslag komen, en het moet koud genoeg zijn dat die als sneeuw valt en blijft liggen. Een koude, droge kerst levert vorst op maar geen sneeuw; een natte kerst bij vijf graden blijft groen. De [sneeuwcheck](tool:sneeuw) rekent per uur uit of en hoeveel sneeuw er valt.",
      },
    ],
    faq: [
      { v: "Hoe vaak is het een witte kerst in Nederland?", a: "Zelden. Sinds het begin van de metingen is het in De Bilt maar een handvol keer gelukt om op beide kerstdagen een sneeuwdek te hebben, het laatst in 2010." },
      { v: "Vanaf wanneer is de sneeuwverwachting voor kerst betrouwbaar?", a: "Pas in de laatste dagen ervoor. Een week vooruit geeft de verwachting een richting; of de neerslag als sneeuw of regen valt, hangt vaak af van een halve graad en is pas kort van tevoren te zeggen." },
      { v: "Telt sneeuw op kerstavond mee?", a: "Voor het officiele predicaat niet. Het gaat om een sneeuwdek op Eerste en Tweede Kerstdag. Voor de sfeer telt natuurlijk elke vlok." },
    ],
  },
  "oud-en-nieuw": {
    intro:
      "Deze teller telt de dagen tot oudejaarsdag en de laatste uren tot middernacht. Op 31 december zelf loopt de klok door tot de jaarwisseling, daarna springt hij naar het volgende jaar.",
    blokken: [
      {
        kop: "Het weer rond de jaarwisseling",
        tekst:
          "Rond middernacht telt vooral de wind: bij een stevige bries blijft het buiten koud aanvoelen en waait rook snel weg, bij windstil en vochtig weer blijft die juist hangen. Mist komt in de nacht van oud op nieuw ook regelmatig voor. Ligt de dag binnen een week, dan staat de verwachting hieronder; harde wind volg je met de [stormcheck](tool:storm).",
      },
      {
        kop: "Tot middernacht, op de seconde",
        tekst:
          "De live klok rekent met de Nederlandse tijd, ook als je toestel ergens anders op staat. Hij loopt naar 00:00 uur op 1 januari, het moment waarop het nieuwe jaar begint.",
      },
    ],
    faq: [
      { v: "Is oudejaarsdag een vrije dag?", a: "Nee, 31 december is geen officiele feestdag. Veel mensen nemen wel vrij of werken een halve dag. Nieuwjaarsdag, 1 januari, is wel een officiele vrije dag." },
      { v: "Hoe laat begint het nieuwe jaar precies?", a: "Om 00:00 uur Nederlandse tijd op 1 januari. Daar loopt de klok bovenaan ook naartoe." },
      { v: "Wat gebeurt er met de teller na middernacht?", a: "Op 1 januari springt hij automatisch naar de volgende oudejaarsavond, een jaar later." },
    ],
  },
  sinterklaas: {
    intro:
      "Hier tel je af naar pakjesavond op 5 december, de avond waarop in Nederland de cadeaus komen. De teller noemt ook de weekdag waarop de avond valt, handig voor wie het met familie moet plannen.",
    blokken: [
      {
        kop: "Pakjesavond of Sinterklaasdag?",
        tekst:
          "Het feest draait om de avond van 5 december. De dag erna, 6 december, is de naamdag van Sint Nicolaas; in een deel van Belgie en sommige Nederlandse families worden de cadeaus pas dan gegeven. Deze teller houdt 5 december aan.",
      },
      {
        kop: "Valt pakjesavond in het weekend?",
        tekst:
          "Dat wisselt per jaar. Valt 5 december op een doordeweekse dag, dan schuiven veel gezinnen het feest naar het weekend ervoor. De weekdag staat daarom expliciet bij de datum.",
      },
    ],
    faq: [
      { v: "Is 5 december een vrije dag?", a: "Nee, pakjesavond is geen officiele feestdag. Werk en school gaan gewoon door, al zijn veel scholen die dag in feeststemming." },
      { v: "Hoeveel werkdagen heb ik nog voor pakjesavond?", a: "Het aantal staat onder de teller. We tellen maandag tot en met vrijdag vanaf morgen, zonder officiele feestdagen." },
      { v: "Wanneer is het daarna kerst?", a: "Twintig dagen na pakjesavond. Op de kerstpagina loopt een eigen teller." },
    ],
  },
  koningsdag: {
    intro:
      "Koningsdag valt op 27 april, de verjaardag van koning Willem-Alexander. Valt die datum op een zondag, dan wordt het feest een dag eerder gevierd, op zaterdag 26 april. De teller houdt daar rekening mee.",
    blokken: [
      {
        kop: "Koningsdag en het weer",
        tekst:
          "Eind april kan alles: van een zonnige twintig graden tot natte hagelbuien en een frisse noordenwind. Voor een vrijmarkt of terras telt vooral of het droog blijft in de middag. Zodra de dag binnen bereik is staat de verwachting hieronder, en de [terrascheck](tool:terras) wijst de beste uren aan.",
      },
      {
        kop: "Waarom soms 26 april?",
        tekst:
          "De zondagsregel bestaat uit respect voor de zondagsrust. Het feest schuift dan naar de zaterdag ervoor, zodat vrijmarkten en optredens gewoon op een vrije dag vallen.",
      },
    ],
    faq: [
      { v: "Is Koningsdag een vrije dag?", a: "Ja, Koningsdag is een nationale feestdag. Of je echt vrij bent hangt van je werkgever en cao af, maar de meeste mensen hebben de dag vrij." },
      { v: "Wanneer valt Koningsdag op een zaterdag?", a: "Altijd als 27 april op een zondag valt. De tabel met de komende jaren laat per jaar de juiste datum zien." },
      { v: "Valt Koningsdag in de meivakantie?", a: "Vaak wel: de meivakantie begint rond eind april. Op de pagina over de meivakantie staan de data per schooljaar." },
    ],
  },
  bevrijdingsdag: {
    intro:
      "Op 5 mei viert Nederland de bevrijding van 1945. De teller loopt naar die dag; de avond ervoor, 4 mei, is de Nationale Dodenherdenking.",
    blokken: [
      {
        kop: "Vrij of niet?",
        tekst:
          "Bevrijdingsdag is een nationale feestdag, maar of je vrij bent regelt je cao. Veel cao's geven de dag alleen in lustrumjaren vrij, dus elke vijf jaar. Onze werkdagentelling volgt die lustrumregel.",
      },
      {
        kop: "Bevrijdingsfestivals en het weer",
        tekst:
          "Op veel plekken in het land zijn festivals in de open lucht. Begin mei is het vaak wisselvallig, met buien die snel komen en gaan. Zodra de dag dichtbij is staat de verwachting hieronder; voor een middag buiten is de [terrascheck](tool:terras) handig.",
      },
    ],
    faq: [
      { v: "Is Bevrijdingsdag elk jaar een vrije dag?", a: "Voor de meeste werknemers niet. Veel cao's geven de dag alleen eens in de vijf jaar vrij. Check je eigen cao of vraag het na bij je werkgever." },
      { v: "Wanneer is de Dodenherdenking?", a: "Op 4 mei, de avond voor Bevrijdingsdag, met om 20:00 uur twee minuten stilte." },
      { v: "Valt Bevrijdingsdag in de meivakantie?", a: "Soms. Hangt af van het schooljaar; de pagina over de meivakantie geeft de exacte data." },
    ],
  },
  pasen: {
    intro:
      "Pasen schuift elk jaar, ergens tussen 22 maart en 25 april. De teller rekent Eerste Paasdag voor je uit en zet de komende jaren in een tabel.",
    blokken: [
      {
        kop: "Hoe wordt de datum bepaald?",
        tekst:
          "Pasen valt op de eerste zondag na de eerste volle maan van de lente, waarbij de lente voor deze berekening op 21 maart begint. Daardoor kan het verschil tussen twee jaren ruim een maand zijn. Hemelvaart en Pinksteren schuiven mee: veertig en vijftig dagen later.",
      },
      {
        kop: "Een paaswandeling of eieren zoeken",
        tekst:
          "In maart en april is het vaak fris met buien tussendoor. Eieren zoeken lukt prima zolang het gras niet doorweekt is; voor een tocht met de familie zoekt de [wandelcheck](tool:wandelen) het fijnste blok van de dag.",
      },
    ],
    faq: [
      { v: "Is Tweede Paasdag een vrije dag?", a: "Ja, Tweede Paasdag is een officiele feestdag. Eerste Paasdag valt altijd op een zondag. Goede Vrijdag is voor de meeste mensen geen vrije dag." },
      { v: "Wat is de vroegst mogelijke paasdatum?", a: "22 maart. De laatst mogelijke is 25 april. Beide komen zelden voor." },
      { v: "Hoe lang na Pasen is het Pinksteren?", a: "Eerste Pinksterdag valt zeven weken na Eerste Paasdag, op de vijftigste dag." },
    ],
  },
  hemelvaart: {
    intro:
      "Hemelvaartsdag valt altijd op een donderdag, 39 dagen na Eerste Paasdag. Veel mensen nemen de vrijdag erna vrij voor een lang weekend.",
    blokken: [
      {
        kop: "Het lange weekend",
        tekst:
          "Met een vrije donderdag en een brugdag op vrijdag heb je vier dagen achter elkaar. Veel scholen geven de vrijdag ook vrij. Dat maakt Hemelvaart een populair moment voor een fietstocht of een paar dagen weg.",
      },
      {
        kop: "Fietsweer in mei",
        tekst:
          "Half mei is de kans op een aangename dag groter dan in april, maar de wind kan nog stevig staan. De [fietscheck](tool:fiets-naar-werk) rekent per rit uit waar je tegenwind krijgt, ook voor een uitje.",
      },
    ],
    faq: [
      { v: "Is Hemelvaart een vrije dag?", a: "Ja, Hemelvaartsdag is een officiele feestdag en telt in onze werkdagentelling niet mee." },
      { v: "Waarom valt Hemelvaart altijd op donderdag?", a: "Omdat het veertig dagen na Pasen wordt gevierd, Paaszondag meegeteld. Pasen valt op zondag, dus Hemelvaart altijd op donderdag." },
      { v: "Is de vrijdag na Hemelvaart vrij?", a: "Niet officieel. Het is een populaire brugdag en veel scholen sluiten, maar bij je werk moet je er een vrije dag voor opnemen." },
    ],
  },
  pinksteren: {
    intro:
      "Eerste Pinksterdag valt zeven weken na Pasen, altijd op een zondag. De maandag erna, Tweede Pinksterdag, is een officiele vrije dag.",
    blokken: [
      {
        kop: "Het pinksterweekend",
        tekst:
          "Pinksteren valt in mei of juni, vaak het eerste weekend met echt zomerse trekjes. Dat maakt het een klassieker voor de eerste barbecue. De [barbecuecheck](tool:barbecue) kijkt naar het avondblok en zegt waar de rook heen trekt.",
      },
      {
        kop: "Pinkpop en andere festivals",
        tekst:
          "Rond Pinksteren staan veel buitenevenementen op de agenda. Voor een festivaldag is de buientiming belangrijker dan de temperatuur: een droge middag weegt zwaarder dan een paar graden extra.",
      },
    ],
    faq: [
      { v: "Is Tweede Pinksterdag een vrije dag?", a: "Ja, Tweede Pinksterdag is een officiele feestdag." },
      { v: "Wanneer valt Pinksteren het vroegst?", a: "Op zijn vroegst op 10 mei en op zijn laatst op 13 juni, afhankelijk van de paasdatum." },
      { v: "Hoeveel dagen na Hemelvaart is het Pinksteren?", a: "Tien dagen. Hemelvaart valt op donderdag, Eerste Pinksterdag op de zondag anderhalve week later." },
    ],
  },
  carnaval: {
    intro:
      "Carnaval loopt van zondag tot en met dinsdag, de drie dagen voor Aswoensdag. De datum hangt aan Pasen en schuift dus elk jaar mee, ergens tussen begin februari en begin maart.",
    blokken: [
      {
        kop: "Hoe de datum valt",
        tekst:
          "Aswoensdag ligt zesenveertig dagen voor Pasen. Carnaval eindigt de dinsdag ervoor. In de praktijk begint het feest in veel plaatsen al op zaterdag of vrijdagavond; de teller loopt naar de officiele zondag.",
      },
      {
        kop: "Wat trek je aan bij koud weer?",
        tekst:
          "Februari is koud en een pak is zelden warm. Laagjes onder het kostuum maken het verschil tussen een gezellige optocht en een lange koude middag. De [kledingcheck](tool:wat-trek-ik-aan) rekent met gevoelstemperatuur per dagdeel.",
      },
    ],
    faq: [
      { v: "Valt carnaval altijd in de voorjaarsvakantie?", a: "In het zuiden meestal wel, omdat de voorjaarsvakantie daar rond carnaval wordt gelegd. In andere regio's niet altijd. De vakantiepagina toont de data per regio." },
      { v: "Is carnaval een officiele vrije dag?", a: "Nee. In Brabant en Limburg geven veel werkgevers en scholen wel vrij, maar landelijk is het geen feestdag." },
      { v: "Wanneer is de elfde van de elfde?", a: "Op 11 november om 11:11 uur wordt het nieuwe carnavalsseizoen geopend. Het echte feest volgt pas maanden later." },
    ],
  },
  valentijnsdag: {
    intro:
      "Valentijnsdag valt elk jaar op 14 februari. De teller noemt ook de weekdag, zodat je weet of een etentje doordeweeks of in het weekend valt.",
    blokken: [
      {
        kop: "Op tijd reserveren",
        tekst:
          "Restaurants zitten op 14 februari snel vol, zeker als de dag op een vrijdag of zaterdag valt. Wie een paar weken vooruit reserveert heeft de meeste keus.",
      },
      {
        kop: "Een kaartje op tijd versturen",
        tekst:
          "Post doet er in Nederland een of twee werkdagen over en wordt niet elke dag bezorgd. Het aantal werkdagen onder de teller helpt bij het inschatten wanneer een kaart uiterlijk de deur uit moet.",
      },
    ],
    faq: [
      { v: "Is Valentijnsdag een vrije dag?", a: "Nee, Valentijnsdag is geen officiele feestdag." },
      { v: "Valt Valentijnsdag weleens samen met carnaval?", a: "Dat kan, omdat carnaval met Pasen meeschuift. De carnavalspagina laat zien wanneer het dit jaar valt." },
      { v: "Waarom 14 februari?", a: "De dag is vernoemd naar de heilige Valentijn. De koppeling met de liefde is vooral in de late middeleeuwen ontstaan." },
    ],
  },
  moederdag: {
    intro:
      "Moederdag valt in Nederland op de tweede zondag van mei. De teller rekent de datum uit, want die schuift elk jaar een paar dagen op.",
    blokken: [
      {
        kop: "Ontbijt op bed of een dagje uit",
        tekst:
          "Half mei is het vaak al lekker genoeg om buiten te zitten, maar niet altijd. Komt de dag binnen een week, dan staat de verwachting hieronder; de [terrascheck](tool:terras) wijst de beste uren voor koffie of lunch buiten aan.",
      },
      {
        kop: "Niet overal dezelfde dag",
        tekst:
          "Belgie viert Moederdag ook op de tweede zondag van mei, met uitzondering van Antwerpen dat 15 augustus aanhoudt. Het Verenigd Koninkrijk viert het al in maart.",
      },
    ],
    faq: [
      { v: "Wanneer is het Vaderdag?", a: "Op de derde zondag van juni. Daar loopt een eigen teller voor." },
      { v: "Kan Moederdag samenvallen met Bevrijdingsdag of Hemelvaart?", a: "Met Bevrijdingsdag niet, want 5 mei valt altijd voor de tweede zondag. Met het hemelvaartsweekend kan Moederdag wel samenvallen." },
      { v: "Is Moederdag een vrije dag?", a: "Het valt altijd op een zondag, dus de vraag speelt niet: het is geen officiele feestdag." },
    ],
  },
  vaderdag: {
    intro:
      "Vaderdag valt in Nederland op de derde zondag van juni. De teller rekent de datum uit en laat de komende jaren zien.",
    blokken: [
      {
        kop: "Barbecue op Vaderdag",
        tekst:
          "Half juni is het seizoen voor de barbecue, maar een onweersbui in de avond kan roet in het eten gooien. De [barbecuecheck](tool:barbecue) kijkt naar het droogste avondblok en noemt de windrichting voor de rook.",
      },
      {
        kop: "Bijna de langste dag",
        tekst:
          "Vaderdag ligt dicht bij de langste dag van het jaar. Het blijft dan tot na tien uur licht, genoeg tijd voor een avond buiten.",
      },
    ],
    faq: [
      { v: "Wanneer is het Moederdag?", a: "Op de tweede zondag van mei, ruim vijf weken eerder." },
      { v: "Is Vaderdag overal op dezelfde dag?", a: "Nee. Belgie viert het op de tweede zondag van juni, Duitsland op Hemelvaartsdag." },
      { v: "Valt Vaderdag weleens samen met Pinksteren?", a: "Nee. Pinksteren valt uiterlijk op 13 juni en Vaderdag op zijn vroegst op 15 juni. Bij een late Pasen liggen ze wel vlak na elkaar." },
    ],
  },
  halloween: {
    intro:
      "Halloween valt op 31 oktober. In Nederland gaan kinderen steeds vaker langs de deuren; de teller zegt hoeveel nachten het nog duurt.",
    blokken: [
      {
        kop: "Langs de deuren in het donker",
        tekst:
          "Eind oktober is het vroeg donker, en de herfst brengt vaak regen en wind. Een kostuum onder een jas verdwijnt snel. Komt de avond dichtbij, dan staat de verwachting hieronder en de [paraplucheck](tool:paraplu) rekent uit of het droog blijft in het uur dat jullie buiten zijn.",
      },
      {
        kop: "Vlak bij de wintertijd",
        tekst:
          "De klok gaat de laatste zondag van oktober een uur terug. Valt Halloween net daarna, dan is het een uur eerder donker dan een week ervoor.",
      },
    ],
    faq: [
      { v: "Is Halloween een vrije dag?", a: "Nee, Halloween is in Nederland geen feestdag." },
      { v: "Valt Halloween in de herfstvakantie?", a: "Soms, vooral in regio zuid waar de herfstvakantie wat later valt. De vakantiepagina geeft de data." },
      { v: "Wanneer gaat de klok achteruit?", a: "De laatste zondag van oktober om 03:00 uur. Daar loopt een eigen teller voor." },
    ],
  },
  "black-friday": {
    intro:
      "Black Friday valt op de vrijdag na Thanksgiving, de vierde donderdag van november in de Verenigde Staten. In Nederland lopen de acties vaak al dagen eerder.",
    blokken: [
      {
        kop: "Hoe de datum valt",
        tekst:
          "Omdat Thanksgiving op de vierde donderdag valt, schuift Black Friday tussen 23 en 29 november. De maandag erna heet Cyber Monday.",
      },
      {
        kop: "Vlak voor pakjesavond",
        tekst:
          "Black Friday ligt een week of twee voor 5 december. Wie cadeaus wil kopen moet rekening houden met bezorgtijden; het aantal werkdagen tot pakjesavond staat op de sinterklaaspagina.",
      },
    ],
    faq: [
      { v: "Is Black Friday elk jaar op dezelfde datum?", a: "Nee, het is altijd een vrijdag tussen 23 en 29 november." },
      { v: "Wanneer is Cyber Monday?", a: "Op de maandag direct na Black Friday." },
      { v: "Duurt Black Friday maar een dag?", a: "Officieel wel, maar in Nederland beginnen veel winkels een week eerder met acties." },
    ],
  },
  prinsjesdag: {
    intro:
      "Prinsjesdag valt op de derde dinsdag van september. De koning leest dan de troonrede voor en het kabinet presenteert de begroting voor het komende jaar.",
    blokken: [
      {
        kop: "De rijtoer en het weer",
        tekst:
          "De rijtoer door Den Haag is een buitenevenement met veel publiek langs de route. Half september kan nog zomers zijn, maar ook nat. Komt de dag dichtbij, dan staat de verwachting voor Den Haag hieronder.",
      },
      {
        kop: "Wat er bekend wordt",
        tekst:
          "Op Prinsjesdag worden de Miljoenennota en de plannen voor koopkracht, belastingen en toeslagen openbaar. De dag erna begint het debat in de Tweede Kamer.",
      },
    ],
    faq: [
      { v: "Is Prinsjesdag een vrije dag?", a: "Nee, het is een gewone werkdag." },
      { v: "Waarom de derde dinsdag?", a: "Dat staat in de Grondwet: de Staten-Generaal komen elk jaar op de derde dinsdag van september bijeen." },
      { v: "Hoe laat is de troonrede?", a: "Rond 13:00 uur in de Ridderzaal, of op een tijdelijke locatie zolang het Binnenhof wordt verbouwd." },
    ],
  },
  zomervakantie: {
    intro:
      "De zomervakantie verschilt per regio: noord, midden en zuid beginnen elk een week na elkaar. Hieronder staat per regio een eigen teller, met de begin- en einddatum.",
    blokken: [
      {
        kop: "Waarom drie regio's?",
        tekst:
          "Door de vakantie te spreiden wordt het minder druk op de weg en bij vakantieparken. De volgorde van de regio's rouleert per jaar, dus de regio die dit jaar als eerste vrij is, is dat volgend jaar niet.",
      },
      {
        kop: "Strandweer in de zomer",
        tekst:
          "Wie thuisblijft kijkt vooral naar de warme dagen. De [strandcheck](tool:strandweer) weegt temperatuur, zon en wind aan zee, want een harde zeewind maakt een zonnige dag op het strand ineens fris.",
      },
    ],
    faq: [
      { v: "In welke regio woon ik?", a: "De indeling gaat per gemeente. Je school noemt de regio in de schoolgids, samen met eventuele eigen vrije dagen." },
      { v: "Hoe lang duurt de zomervakantie?", a: "Zes weken voor de basisschool en het voortgezet onderwijs, in alle regio's even lang." },
      { v: "Wanneer begint het nieuwe schooljaar?", a: "Op de maandag na de laatste vakantiedag van jouw regio. De einddatum staat bij elke teller." },
    ],
  },
  herfstvakantie: {
    intro:
      "De herfstvakantie valt in oktober en verschilt per regio. Hieronder staat een teller per regio, met de officiele adviesdata.",
    blokken: [
      {
        kop: "Adviesdata, geen vaste data",
        tekst:
          "Voor de herfstvakantie geeft de overheid adviesdata. Scholen mogen daarvan afwijken, bijvoorbeeld om aan te sluiten bij een middelbare school in de buurt. Kijk bij twijfel in de schoolgids.",
      },
      {
        kop: "Naar buiten in de herfst",
        tekst:
          "Oktober geeft vaak nog zachte dagen met mooi licht in het bos, afgewisseld met stormachtige buien. De [wandelcheck](tool:wandelen) zoekt per dag het fijnste blok.",
      },
    ],
    faq: [
      { v: "Hoe lang duurt de herfstvakantie?", a: "Een week, van zaterdag tot en met de zondag erna." },
      { v: "Is de herfstvakantie voor alle scholen hetzelfde?", a: "Nee, het zijn adviesdata. De meeste scholen volgen ze, maar afwijken mag." },
      { v: "Valt de herfstvakantie samen met de wintertijd?", a: "Vaak ligt de klokwissel op de laatste zondag van oktober vlak na of in de vakantie van regio zuid." },
    ],
  },
  kerstvakantie: {
    intro:
      "De kerstvakantie geldt voor heel Nederland tegelijk en duurt twee weken. De teller loopt naar de eerste vakantiedag.",
    blokken: [
      {
        kop: "Twee weken rond de feestdagen",
        tekst:
          "De vakantie omvat kerst en de jaarwisseling. Valt kerst laat in de week, dan begint de vakantie soms pas op de zaterdag voor kerst; de exacte data staan bij de teller.",
      },
      {
        kop: "Kans op ijs",
        tekst:
          "Een koude periode in de kerstvakantie is de droom van elke schaatser, maar zeldzaam. Pas na een aantal nachten flinke vorst wordt natuurijs interessant. De [schaatscheck](tool:schaatsen) telt de vorst van de komende dagen op.",
      },
    ],
    faq: [
      { v: "Is de kerstvakantie in alle regio's tegelijk?", a: "Ja, de kerstvakantie is landelijk gelijk." },
      { v: "Hoe lang duurt de kerstvakantie?", a: "Twee weken, inclusief beide weekenden." },
      { v: "Wanneer is de volgende vakantie daarna?", a: "De voorjaarsvakantie in februari. Die verschilt wel per regio." },
    ],
  },
  voorjaarsvakantie: {
    intro:
      "De voorjaarsvakantie valt in februari of begin maart en verschilt per regio. In het zuiden ligt hij doorgaans rond carnaval.",
    blokken: [
      {
        kop: "Een week vrij in de winter",
        tekst:
          "Veel gezinnen gaan in deze week op wintersport. Daarom wordt de vakantie gespreid: niet het hele land vertrekt tegelijk richting de Alpen.",
      },
      {
        kop: "Sneeuw in eigen land?",
        tekst:
          "Een week met echte sneeuw in Nederland is in februari geen garantie, maar ook geen uitzondering. De [sneeuwcheck](tool:sneeuwpret) kijkt of er een pak ligt dat lang genoeg blijft voor een sneeuwpop of slee.",
      },
    ],
    faq: [
      { v: "Is de voorjaarsvakantie overal hetzelfde?", a: "Nee, de data verschillen per regio en het zijn adviesdata. Scholen mogen afwijken." },
      { v: "Valt carnaval in de voorjaarsvakantie?", a: "In regio zuid vrijwel altijd. Elders hangt het van het jaar af." },
      { v: "Hoe lang duurt de voorjaarsvakantie?", a: "Een week, van zaterdag tot en met de zondag erna." },
    ],
  },
  meivakantie: {
    intro:
      "De meivakantie geldt voor alle regio's tegelijk en valt rond Koningsdag. Daarnaast mogen scholen een tweede week geven; die adviesweek verschilt per jaar.",
    blokken: [
      {
        kop: "Een of twee weken",
        tekst:
          "De eerste week is landelijk vastgesteld. Of je kind twee weken vrij heeft, hangt af van de school. Het voortgezet onderwijs geeft vaker twee weken dan de basisschool.",
      },
      {
        kop: "Koningsdag en Bevrijdingsdag",
        tekst:
          "Koningsdag valt vaak in of vlak voor de meivakantie. Een dag op het terras plannen? De [terrascheck](tool:terras) wijst de beste uren aan.",
      },
    ],
    faq: [
      { v: "Krijgt iedereen twee weken meivakantie?", a: "Nee. Een week is landelijk; de tweede week is facultatief en wordt per school bepaald." },
      { v: "Valt Koningsdag in de meivakantie?", a: "Meestal wel. Op de koningsdagpagina staat de datum per jaar." },
      { v: "Valt Hemelvaart in de meivakantie?", a: "Soms, als Pasen vroeg valt. De hemelvaartpagina rekent het uit." },
    ],
  },
  lente: {
    intro:
      "De astronomische lente begint op het moment dat de zon recht boven de evenaar staat, rond 20 maart. De teller rekent het exacte tijdstip uit; de meteorologische lente begint al op 1 maart.",
    blokken: [
      {
        kop: "Twee soorten lente",
        tekst:
          "Meteorologen rekenen met hele maanden: maart, april en mei zijn de lente. Dat maakt statistieken makkelijker vergelijkbaar. De astronomische lente volgt de stand van de zon en begint op de dag dat dag en nacht ongeveer even lang zijn.",
      },
      {
        kop: "Het eerste terrasweer",
        tekst:
          "Rond het begin van de lente komen de eerste dagen boven de vijftien graden. In de zon en uit de wind voelt dat al zomers. De [terrascheck](tool:terras) zoekt het beste blok.",
      },
    ],
    faq: [
      { v: "Wanneer begint de meteorologische lente?", a: "Altijd op 1 maart." },
      { v: "Zijn dag en nacht dan precies even lang?", a: "Bijna. Door de breking van het licht in de atmosfeer is de dag in Nederland op het lentebegin al iets langer dan twaalf uur." },
      { v: "Wanneer gaat de zomertijd in?", a: "Op de laatste zondag van maart, meestal een week na het begin van de lente." },
    ],
  },
  zomer: {
    intro:
      "De astronomische zomer begint op de langste dag van het jaar, rond 21 juni. De teller noemt het exacte moment; meteorologisch is het al sinds 1 juni zomer.",
    blokken: [
      {
        kop: "Begin van de zomer, langste dag",
        tekst:
          "Op het moment dat de zon het hoogst boven de noordelijke kreeftskeerkring staat, begint de zomer. Vanaf dan worden de dagen weer korter, al is dat de eerste weken nauwelijks te merken.",
      },
      {
        kop: "Warm genoeg voor het strand?",
        tekst:
          "Eind juni is het zeewater nog fris, vaak rond de zestien tot achttien graden. De [strandcheck](tool:strandweer) kijkt naar lucht, zon en wind aan de kust.",
      },
    ],
    faq: [
      { v: "Wanneer begint de meteorologische zomer?", a: "Altijd op 1 juni." },
      { v: "Is het begin van de zomer de warmste dag?", a: "Nee. De warmste periode valt doorgaans in juli en augustus, omdat land en zee nog wekenlang opwarmen." },
      { v: "Wanneer is de langste dag?", a: "Op dezelfde dag als het begin van de astronomische zomer. Op de pagina over de langste dag staat ook de daglengte." },
    ],
  },
  herfst: {
    intro:
      "De astronomische herfst begint rond 22 of 23 september, als dag en nacht weer ongeveer even lang zijn. Meteorologisch begint de herfst op 1 september.",
    blokken: [
      {
        kop: "Herfststormen",
        tekst:
          "Vanaf eind september nemen de stormen toe. Een eerste flinke storm met windstoten boven de tachtig km/u is in oktober geen uitzondering. De [stormcheck](tool:storm) zegt wanneer de piek valt en wat je vast moet zetten.",
      },
      {
        kop: "Korter licht",
        tekst:
          "Na het herfstbegin worden de dagen snel korter, met bijna vier minuten per dag. Dat verschil is in het begin van de herfst het grootst.",
      },
    ],
    faq: [
      { v: "Wanneer begint de meteorologische herfst?", a: "Altijd op 1 september." },
      { v: "Wanneer gaat de klok terug?", a: "Op de laatste zondag van oktober. Daar loopt een eigen teller voor." },
      { v: "Waarom verschilt het begin van de herfst per jaar?", a: "Het jaar is niet precies 365 dagen. Daardoor schuift het moment elk jaar een paar uur op, tot een schrikkeljaar het weer terugzet." },
    ],
  },
  winter: {
    intro:
      "De astronomische winter begint op de kortste dag van het jaar, rond 21 december. Meteorologisch is het al sinds 1 december winter.",
    blokken: [
      {
        kop: "De kortste dag, het begin van de winter",
        tekst:
          "Op het winterbegin staat de zon het laagst. Vanaf dan worden de dagen langer, eerst nauwelijks merkbaar en in januari al een paar minuten per dag.",
      },
      {
        kop: "Gladheid in de ochtend",
        tekst:
          "De koudste weken liggen meestal pas in januari en februari. Een heldere, windstille nacht na een natte dag geeft de meeste kans op gladde wegen. De [gladheidscheck](tool:gladheid) waarschuwt voor de ochtendspits.",
      },
    ],
    faq: [
      { v: "Wanneer begint de meteorologische winter?", a: "Altijd op 1 december." },
      { v: "Worden de dagen na de kortste dag meteen langer?", a: "Ja, maar heel weinig. De avonden worden het eerst langer; 's ochtends blijft het tot begin januari nog donker." },
      { v: "Is de kortste dag de koudste dag?", a: "Nee. De koudste periode valt meestal in januari, omdat de bodem en de zee eerst nog warmte afgeven." },
    ],
  },
  "klok-vooruit": {
    intro:
      "De zomertijd begint op de laatste zondag van maart. Om 02:00 uur 's nachts springt de klok naar 03:00 uur: je slaapt een uur korter, maar het blijft 's avonds langer licht.",
    blokken: [
      {
        kop: "Vooruit of achteruit, een ezelsbruggetje",
        tekst:
          "In de lente zet je de tuinstoelen voor het huis (vooruit), in de herfst zet je ze terug in de schuur (achteruit). Telefoons en computers doen het vanzelf; de klok in de auto en de oven meestal niet.",
      },
      {
        kop: "Wat het doet met je avonden",
        tekst:
          "Na de klokwissel gaat de zon ineens een uur later onder. Dat merk je meteen bij een avondrondje of de fietsrit naar huis. De zonsondergang voor vandaag staat op de pagina hoe laat gaat de zon onder.",
      },
    ],
    faq: [
      { v: "Slaap ik een uur korter of langer?", a: "Een uur korter. Om 02:00 uur gaat de klok naar 03:00 uur." },
      { v: "Wordt de zomertijd afgeschaft?", a: "Daar wordt in Europa al jaren over gesproken, maar er is nog geen besluit. Tot die tijd wisselt de klok gewoon twee keer per jaar." },
      { v: "Wanneer gaat de klok weer terug?", a: "Op de laatste zondag van oktober. Daar loopt een eigen teller voor." },
    ],
  },
  "klok-achteruit": {
    intro:
      "De wintertijd begint op de laatste zondag van oktober. Om 03:00 uur gaat de klok terug naar 02:00 uur: je slaapt een uur langer, maar het wordt 's avonds eerder donker.",
    blokken: [
      {
        kop: "Een uur extra",
        tekst:
          "De nacht van de klokwissel duurt een uur langer. Wie nachtdienst heeft werkt dan ook een uur langer. Telefoons passen zich zelf aan; magnetrons, oude wekkers en autoklokken moet je zelf terugzetten.",
      },
      {
        kop: "Donkere fietsritten",
        tekst:
          "Na de wissel fiets je in de avondspits ineens in het donker. Goede verlichting is dan geen overbodige luxe. De [fietscheck](tool:fiets-naar-werk) zegt of je ook nog met regen of tegenwind te maken krijgt.",
      },
    ],
    faq: [
      { v: "Slaap ik een uur langer?", a: "Ja. Om 03:00 uur gaat de klok terug naar 02:00 uur." },
      { v: "Hoe heet de wintertijd officieel?", a: "Officieel heet het normaaltijd. De zomertijd is de afwijking ervan." },
      { v: "Wanneer gaat de klok weer vooruit?", a: "Op de laatste zondag van maart." },
    ],
  },
  "langste-dag": {
    intro:
      "De langste dag van het jaar valt rond 21 juni, op het begin van de astronomische zomer. Hieronder staat de daglengte voor De Bilt, met zonsopkomst en zonsondergang.",
    blokken: [
      {
        kop: "Ruim zestien en een half uur licht",
        tekst:
          "Op de langste dag gaat de zon in het midden van het land rond kwart over vijf op en na tien uur 's avonds onder. In het noorden is de dag nog iets langer dan in het zuiden.",
      },
      {
        kop: "Let op de zonkracht",
        tekst:
          "Met de zon zo hoog is de uv-straling rond het middaguur het sterkst van het jaar. De [zonkrachtcheck](tool:zonkracht) rekent uit hoe snel je verbrandt.",
      },
    ],
    faq: [
      { v: "Is de langste dag ook de dag met de vroegste zonsopkomst?", a: "Niet precies. De vroegste zonsopkomst valt een paar dagen eerder en de laatste zonsondergang een paar dagen later. Dat komt door de ellipsvormige baan van de aarde." },
      { v: "Wanneer is de kortste dag?", a: "Rond 21 december, op het begin van de astronomische winter." },
      { v: "Worden de dagen daarna snel korter?", a: "Eerst heel langzaam, een paar seconden per dag. Rond het begin van de herfst gaat het het snelst." },
    ],
  },
  "kortste-dag": {
    intro:
      "De kortste dag van het jaar valt rond 21 december, op het begin van de astronomische winter. Hieronder staat de daglengte voor De Bilt, met zonsopkomst en zonsondergang.",
    blokken: [
      {
        kop: "Nog geen acht uur licht",
        tekst:
          "Op de kortste dag komt de zon in het midden van het land pas tegen kwart voor negen op en is hij voor half vijf weer weg. In het noorden van het land is de dag nog korter.",
      },
      {
        kop: "Na de kortste dag",
        tekst:
          "De avonden worden direct na de kortste dag iets langer; de ochtenden blijven tot begin januari donker. Gladde ochtenden zijn in deze weken het grootste weerrisico; de [gladheidscheck](tool:gladheid) waarschuwt op tijd.",
      },
    ],
    faq: [
      { v: "Is de kortste dag ook de dag met de vroegste zonsondergang?", a: "Nee. De vroegste zonsondergang valt al half december en de laatste zonsopkomst pas begin januari." },
      { v: "Wanneer is de langste dag?", a: "Rond 21 juni, op het begin van de astronomische zomer." },
      { v: "Hoeveel korter is de dag dan in de zomer?", a: "Ruim negen uur. In De Bilt is de kortste dag ruim zevenenhalf uur lang, de langste bijna zeventien uur." },
    ],
  },
  weekend: {
    intro:
      "De klok loopt naar vrijdag 17:00 uur, het moment waarop voor de meeste mensen het weekend begint. Is het al weekend, dan telt hij af tot maandagochtend.",
    blokken: [
      {
        kop: "Wat het weekend brengt",
        tekst:
          "Onder de klok staat de verwachting voor zaterdag en zondag, zodra die binnen bereik is. Plannen voor een terras, barbecue of tocht? Elke check rekent ook voor de komende dagen, bijvoorbeeld de [terrascheck](tool:terras).",
      },
      {
        kop: "Waarom vrijdag vijf uur?",
        tekst:
          "Het is een afspraak, geen wet. Voor wie tot zes uur werkt of in ploegen draait, is het weekend een rekbaar begrip. De klok rekent met Nederlandse tijd.",
      },
    ],
    faq: [
      { v: "Hoeveel werkdagen heeft een week?", a: "Vijf, van maandag tot en met vrijdag. Een feestdag haalt er een af." },
      { v: "Wanneer is het volgende lange weekend?", a: "Kijk bij de feestdagen: Pasen, Hemelvaart en Pinksteren geven vaak een extra vrije dag." },
      { v: "Telt de klok ook de seconden?", a: "Ja, de klok loopt live mee tot op de seconde." },
    ],
  },
  "sint-maarten": {
    intro:
      "Op 11 november gaan kinderen met een lampion langs de deuren om te zingen voor snoep. De teller loopt naar die avond en noemt de weekdag, zodat je weet of het op een schoolavond valt.",
    blokken: [
      {
        kop: "Lampionnen en het weer",
        tekst:
          "Half november is het rond vijf uur donker en vaak nat en winderig. Een papieren lampion overleeft een bui slecht; een led-lampje in plaats van een kaarsje is veiliger en waait niet uit. Ligt de avond binnen een week, dan staat de verwachting hieronder en rekent de [paraplucheck](tool:paraplu) uit of het droog blijft in het uur dat jullie op pad zijn.",
      },
      {
        kop: "Waar het gevierd wordt",
        tekst:
          "Sint-Maarten wordt vooral gevierd in Utrecht, het noorden en delen van Limburg en Noord-Holland, maar het feest verspreidt zich door het hele land. In Utrecht is er een grote optocht met lichtjes door de binnenstad.",
      },
    ],
    faq: [
      { v: "Hoe laat gaan kinderen langs de deuren?", a: "Meestal na het eten, als het donker is, tussen half zes en zeven uur. Jonge kinderen gaan vaak eerder." },
      { v: "Is 11 november een vrije dag?", a: "Nee, Sint-Maarten is geen feestdag. Het is ook de dag waarop om 11:11 uur het carnavalsseizoen opent." },
      { v: "Wie was Sint-Maarten?", a: "Martinus van Tours, een Romeinse soldaat die volgens de legende zijn mantel deelde met een bedelaar. Hij is de beschermheilige van Utrecht." },
    ],
  },
  dierendag: {
    intro:
      "Dierendag valt elk jaar op 4 oktober, de naamdag van Franciscus van Assisi. De teller noemt ook de weekdag, handig voor wie er met de hond een lange wandeling van wil maken.",
    blokken: [
      {
        kop: "Een extra lange wandeling",
        tekst:
          "Begin oktober is het vaak nog aangenaam buiten, met af en toe een stevige herfstbui. Voor de hond telt vooral of de tegels niet te heet of te koud zijn en of het droog blijft. De [hondencheck](tool:hond-uitlaten) zoekt het fijnste blok van de dag.",
      },
      {
        kop: "Waarom 4 oktober?",
        tekst:
          "Franciscus van Assisi staat bekend als de heilige die met dieren sprak. Zijn naamdag werd in de vorige eeuw internationaal de dag om aandacht te vragen voor dierenwelzijn.",
      },
    ],
    faq: [
      { v: "Is Dierendag een vrije dag?", a: "Nee, Dierendag is geen feestdag." },
      { v: "Valt Dierendag in de herfstvakantie?", a: "Meestal niet: de herfstvakantie begint pas half oktober." },
      { v: "Wordt Dierendag overal op 4 oktober gevierd?", a: "In de meeste landen wel. Het is ook Werelddierendag." },
    ],
  },
  ijsheiligen: {
    intro:
      "De IJsheiligen zijn de dagen van 11 tot en met 15 mei. Volgens een oude tuinregel is het daarna veilig om vorstgevoelige planten buiten te zetten. De teller loopt naar 11 mei en de verwachting verschijnt zodra de dagen binnen een week liggen.",
    blokken: [
      {
        kop: "Klopt de regel nog?",
        tekst:
          "Nachtvorst na half mei is in Nederland zeldzaam, maar niet onmogelijk, zeker op heldere, windstille nachten op zandgrond en in het oosten. Tuinders houden de regel daarom aan als veilige grens. Wie eerder wil planten, kijkt per nacht naar de verwachting.",
      },
      {
        kop: "Planten beschermen",
        tekst:
          "Dreigt er toch vorst, dan helpt een laagje vliesdoek of een omgekeerde emmer over jonge planten. De [vorstcheck voor planten](tool:planten-beschermen) beoordeelt elke nacht, inclusief stralingsvorst bij een heldere hemel.",
      },
    ],
    faq: [
      { v: "Wie zijn de IJsheiligen?", a: "Vijf heiligen met hun naamdag van 11 tot en met 15 mei: Mamertus, Pancratius, Servatius, Bonifatius en Sophia, die ook wel Koude Sophie heet." },
      { v: "Wanneer kan ik tomaten buiten zetten?", a: "De vuistregel is na de IJsheiligen, als de nachten structureel boven de vijf graden blijven." },
      { v: "Verschuiven de IJsheiligen per jaar?", a: "Nee, het zijn vaste dagen: 11 tot en met 15 mei." },
    ],
  },
  perseiden: {
    intro:
      "De Perseiden zijn de bekendste meteorenzwerm van het jaar, met een piek rond 12 en 13 augustus. Op een donkere plek zie je dan soms tientallen vallende sterren per uur. De teller loopt naar de avond van 12 augustus.",
    blokken: [
      {
        kop: "Zo zie je de meeste vallende sterren",
        tekst:
          "Kijk na middernacht, als de radiant hoger aan de hemel staat, en zoek een donkere plek weg van stadslicht. Geef je ogen een kwartier om te wennen en kijk niet op je telefoon. Een ligstoel en een deken maken het een stuk aangenamer.",
      },
      {
        kop: "Maan en wolken",
        tekst:
          "Fel maanlicht verbergt de zwakkere meteoren; de pagina over de volle maan laat zien hoe de maan rond de piek staat. Voor bewolking en donkerte rekent de [sterrencheck](tool:sterrenkijken) per uur.",
      },
    ],
    faq: [
      { v: "Hoeveel vallende sterren kan ik zien?", a: "Onder een echt donkere hemel tot zestig of meer per uur rond de piek. Vanuit een stad, of met veel maanlicht, eerder tien tot twintig." },
      { v: "Kan ik ze ook op andere nachten zien?", a: "Ja, de zwerm is van half juli tot eind augustus actief. In de nachten rond de piek zijn het er het meest." },
      { v: "Waar komen de Perseiden vandaan?", a: "Van stofdeeltjes van de komeet Swift-Tuttle. Als de aarde door dat spoor beweegt, verbranden ze in de atmosfeer." },
    ],
  },
  "volle-maan": {
    intro:
      "De volgende volle maan staat hieronder met de exacte tijd, plus de maanfase van vandaag en alle volle manen van het komende jaar. Alles is uitgerekend, op ongeveer een minuut nauwkeurig.",
    blokken: [
      {
        kop: "Hoe vaak is het volle maan?",
        tekst:
          "Elke 29,5 dagen. Daardoor passen er in sommige jaren dertien volle manen in een kalenderjaar; de tweede volle maan in een maand heet dan een blauwe maan. Het exacte moment van volle maan duurt maar een tel, maar de maan oogt een dag ervoor en erna ook vol.",
      },
      {
        kop: "Volle maan en sterrenkijken",
        tekst:
          "Een volle maan verlicht de hemel zo sterk dat zwakke sterren en meteoren verdwijnen. Wil je sterren of de Melkweg zien, kies dan een nacht rond nieuwe maan. De [sterrencheck](tool:sterrenkijken) weegt maanlicht en bewolking per uur.",
      },
    ],
    faq: [
      { v: "Wat is een supermaan?", a: "Een volle maan die samenvalt met het punt waarop de maan het dichtst bij de aarde staat. Hij oogt dan iets groter en feller dan gemiddeld, al is het verschil met het blote oog klein." },
      { v: "Waarom is de tijd van volle maan zo precies?", a: "Volle maan is het moment waarop de maan precies tegenover de zon staat. Dat is uit te rekenen; deze pagina gebruikt de standaardformules uit de sterrenkunde." },
      { v: "Slaap ik slechter bij volle maan?", a: "Daar is onderzoek naar gedaan met wisselende uitkomsten. Sommige studies vinden een iets kortere slaap rond volle maan, andere niet." },
    ],
  },
  zonsopkomst: {
    intro:
      "Hier staat hoe laat de zon vandaag opkomt, met een klok die aftelt tot dat moment. Is de zon al op, dan telt hij af naar morgenochtend. Kies je stad of gebruik je eigen plek; standaard rekenen we voor De Bilt.",
    blokken: [
      {
        kop: "Licht voor zonsopkomst",
        tekst:
          "Het wordt al een tijd voor zonsopkomst licht. Die ochtendschemering duurt in Nederland ruim een half uur in de winter en langer in de zomer. Wie fietst of hardloopt, heeft dus iets eerder voldoende licht dan de tijd hierboven doet vermoeden.",
      },
      {
        kop: "Ijs op de autoruit",
        tekst:
          "Het koudste moment van de nacht valt meestal rond zonsopkomst. Dan is de kans op een bevroren ruit het grootst. De [krabcheck](tool:krabben) rekent uit of je morgenochtend moet krabben.",
      },
    ],
    faq: [
      { v: "Wanneer komt de zon het vroegst op?", a: "Rond half juni, een paar dagen voor de langste dag, rond kwart over vijf in het midden van het land." },
      { v: "Wanneer komt de zon het laatst op?", a: "Rond eind december en begin januari, tegen kwart voor negen. Dat is iets na de kortste dag." },
      { v: "Komt de zon in het oosten van het land eerder op?", a: "Ja. In Enschede komt de zon zo'n tien minuten eerder op dan in Den Haag, omdat het oosten verder vooruit ligt in de draaiing van de aarde." },
    ],
  },
  zonsondergang: {
    intro:
      "Hier staat hoe laat de zon vandaag ondergaat, met een klok die aftelt tot dat moment. Kies je stad of gebruik je eigen plek; standaard rekenen we voor De Bilt.",
    blokken: [
      {
        kop: "Hoe we rekenen",
        tekst:
          "De tijden volgen uit de stand van de zon voor jouw plek en datum, met de gebruikelijke correctie voor de breking van licht aan de horizon. De afwijking is hooguit een minuut. Gebouwen, bomen of een dijk kunnen de zon voor jou eerder laten verdwijnen.",
      },
      {
        kop: "Na zonsondergang",
        tekst:
          "Na de ondergang blijft het nog een tijd schemerig, in de zomer ruim drie kwartier. Voor wie wil sterrenkijken begint het echte donker pas later; de [sterrencheck](tool:sterrenkijken) rekent met bewolking en maanlicht.",
      },
    ],
    faq: [
      { v: "Gaat de zon overal in Nederland tegelijk onder?", a: "Nee. Het oosten ziet de zon eerder verdwijnen dan het westen, en in de zomer is het in het noorden langer licht dan in het zuiden. Kies een stad om het te vergelijken." },
      { v: "Hoe laat komt de zon morgen op?", a: "De zonsopkomst voor morgen staat onder de klok, samen met de daglengte." },
      { v: "Wat is het gouden uur?", a: "Het laatste uur voor zonsondergang en het eerste uur na zonsopkomst, als het licht warm en laag is. Fotografen plannen er hun opnames omheen." },
    ],
  },
  droog: {
    intro:
      "Deze klok telt af tot de volgende bui op jouw plek, op basis van de neerslagverwachting per kwartier. Regent het al, dan telt hij af tot het weer droog wordt.",
    blokken: [
      {
        kop: "Per kwartier vooruit",
        tekst:
          "We gebruiken de neerslagverwachting in stappen van vijftien minuten, tot ruim een dag vooruit. Een bui telt pas als er echt meetbare neerslag valt, niet bij een paar losse druppels. Voor de hele dag in een overzicht is er [wanneer gaat het regenen](tool:regen-timing).",
      },
      {
        kop: "Hoe zeker is het?",
        tekst:
          "Voor het komende uur of twee is de verwachting vrij betrouwbaar. Daarna kan een bui een kwartier eerder of later komen, of net langs je heen trekken. Bij onweersbuien is de onzekerheid het grootst.",
      },
    ],
    faq: [
      { v: "Moet ik een paraplu mee?", a: "Dat hangt af van hoe lang je buiten bent. De [paraplucheck](tool:paraplu) legt je buitentijd naast de buien." },
      { v: "Wat telt als regen?", a: "Een kwartier met minstens 0,1 millimeter neerslag. Lichte motregen daaronder telt niet als bui." },
      { v: "Hoe ver kijkt de klok vooruit?", a: "Ruim een dag. Blijft het langer droog, dan staat er dat het minstens tot morgen droog blijft." },
    ],
  },
};

/** Tekst voor de verzamelpagina /hoeveel-dagen-tot. */
export const AFTEL_HUB = {
  titel: "Hoeveel dagen tot ...? Tel af naar elke datum",
  h1: "Hoeveel dagen is het nog tot ...?",
  intro:
    "Kies een datum en de calculator telt de dagen, weken en werkdagen. Of kies hieronder een feestdag, vakantie of seizoen: elke teller heeft een eigen pagina met de datum voor dit jaar en de komende jaren.",
  faq: [
    { v: "Hoe tellen jullie de dagen?", a: "We tellen de kalenderdagen van vandaag tot de doeldatum, in Nederlandse tijd. Morgen is dus nog een dag." },
    { v: "Wat zijn werkdagen in de telling?", a: "Maandag tot en met vrijdag vanaf morgen tot de dag voor de doeldatum, zonder officiele feestdagen zoals de kerstdagen, Koningsdag en Tweede Paasdag." },
    { v: "Kloppen de vakantiedata?", a: "Ze komen uit de officiele vaststelling van de schoolvakanties. Herfst- en voorjaarsvakantie zijn adviesdata; je school kan afwijken." },
  ],
};
