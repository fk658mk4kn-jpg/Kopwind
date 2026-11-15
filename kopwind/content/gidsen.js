/**
 * content/gidsen.js
 *
 * Teksten voor de gidspagina's van v3.38.0 "Tramontana". Een deel van
 * deze pagina's heeft (nog) geen live databron; daarom geven de teksten
 * zelf een bruikbaar antwoord: vuistregels, tabellen en waar je het
 * exacte getal vindt. Feiten nagelopen tegen de bronnen in LOGBOEK Run 18.
 */

export const GIDS_INHOUD = {
  stroomprijs: {
    h1: "Wanneer is stroom vandaag het goedkoopst?",
    intro:
      "Met een dynamisch energiecontract verschilt de stroomprijs per uur. Bovenaan staat wat dat vandaag betekent: welke dag het is, wanneer de zon het hoogst staat en welke uren daardoor meestal goedkoop of duur zijn. Daaronder het patroon door de dag en het jaar, en hoe je de wasmachine, vaatwasser of auto slim plant.",
    blokken: [
      {
        kop: "Het patroon van een gemiddelde dag",
        tekst:
          "Stroom is meestal het goedkoopst midden op de dag, tussen ongeveer 9 en 17 uur, omdat zonnepanelen dan veel leveren. 's Nachts is de prijs vaak ook laag, omdat er weinig vraag is. Het duurst is het in de ochtend als iedereen opstaat en vooral in de vroege avond, tussen ongeveer 17 en 21 uur, als mensen koken, verwarmen en hun auto aan de lader hangen terwijl de zon al weg is.",
      },
      {
        kop: "Zon, wind en de dag van de week",
        tekst:
          "Hoe meer zon en wind, hoe meer aanbod en hoe lager de prijs. Een zonnige zondag in het voorjaar geeft daardoor de laagste prijzen van het jaar, soms zelfs onder nul. In het weekend wordt minder stroom gebruikt door kantoren en fabrieken, dus ook dan zakt de prijs. In de winter is het middagdal kleiner, omdat de zon laag staat en kort schijnt; dan wordt de wind belangrijker.",
      },
      {
        kop: "Wanneer zijn de prijzen van morgen bekend?",
        tekst:
          "De uurprijzen voor de volgende dag worden op de Europese dagmarkt vastgesteld en rond het begin van de middag bekend. Daarna tonen leveranciers ze in hun app. Wie wil plannen, kijkt dus 's middags naar morgen.",
      },
      {
        kop: "Wat schuif je het makkelijkst?",
        tekst:
          "Apparaten die veel stroom vragen en niet op een vast moment hoeven te draaien, leveren de meeste winst op: de wasmachine, de droger, de vaatwasser, een boiler en vooral het laden van een elektrische auto. Een wasbeurt kost ongeveer een kilowattuur; een auto laden al snel twintig of meer. Koelkast, verlichting en de router schuif je niet, en dat hoeft ook niet.",
      },
      {
        kop: "Negatieve prijzen: gratis stroom?",
        tekst:
          "Bij een overschot kan de kale beursprijs onder nul zakken. Je betaalt dan nog wel energiebelasting, btw en de vaste inkoopvergoeding van je leverancier, dus de totaalprijs is meestal gewoon positief. Alleen bij een flink negatieve beursprijs wordt je kilowattuur echt bijna gratis of verdien je eraan.",
      },
    ],
    faq: [
      { v: "Wanneer zet ik de wasmachine het best aan?", a: "Op een zonnige dag rond het middaguur, of anders 's nachts. Vermijd de avondpiek tussen ongeveer 17 en 21 uur. Een wasmachine met uitgestelde start helpt." },
      { v: "Is stroom in het weekend goedkoper?", a: "Gemiddeld wel, vooral op zondag. Er draaien dan minder bedrijven, terwijl zon en wind gewoon leveren." },
      { v: "Wanneer laad ik een elektrische auto het goedkoopst?", a: "Meestal 's nachts of midden op een zonnige dag. Veel laadpalen en auto's kunnen automatisch de goedkoopste uren kiezen als je ze aan je energiecontract koppelt." },
      { v: "Heb ik iets aan deze tips met een vast contract?", a: "Voor je rekening niet: je betaalt dan elk uur hetzelfde tarief. Wel helpt verbruik op zonnige middagen het net, omdat er dan stroom over is." },
      { v: "Komen hier ook de exacte uurprijzen?", a: "Dat is de bedoeling. Tot die koppeling er is, vind je de exacte prijzen in de app van je leverancier; het patroon hierboven klopt voor de meeste dagen." },
    ],
  },
  vakantiegeld: {
    h1: "Wanneer krijg ik vakantiegeld?",
    intro:
      "De meeste werkgevers betalen het vakantiegeld in mei of juni, samen met het salaris. Hieronder staat hoe lang het nog duurt, hoeveel het ongeveer is en waarom er netto minder overblijft dan je zou denken. Met de rekenhulp schat je je eigen bruto bedrag.",
    blokken: [
      {
        kop: "Wat de wet zegt",
        tekst:
          "Werknemers bouwen minstens 8 procent van hun brutoloon op als vakantiegeld. De werkgever moet het minstens een keer per jaar uitbetalen. In de praktijk gebeurt dat in mei of juni over de periode van juni vorig jaar tot en met mei dit jaar. Een cao of contract kan een hoger percentage of een ander moment afspreken, bijvoorbeeld uitbetaling per maand.",
      },
      {
        kop: "Hoeveel is het ongeveer?",
        tekst:
          "Reken met 8 procent van twaalf keer je bruto maandloon, zonder overuren of bonussen tenzij je cao die meetelt. Bij een bruto maandloon van 3.000 euro is dat 2.880 euro bruto. Werkte je niet het hele jaar, dan krijg je een deel naar rato.",
      },
      {
        kop: "Waarom netto zo veel minder?",
        tekst:
          "Over vakantiegeld houdt je werkgever loonheffing in volgens het tarief voor bijzondere beloningen. Dat ligt vaak hoger dan het tarief over je gewone salaris, omdat het bedrag bovenop je jaarinkomen komt. Bij je belastingaangifte wordt het definitief verrekend, dus soms krijg je later iets terug.",
      },
      {
        kop: "Uitkering of zzp",
        tekst:
          "Met een uitkering van het UWV of de SVB krijg je ook vakantiegeld, meestal in mei. Als zzp'er heb je geen recht op vakantiegeld; dan is het verstandig zelf maandelijks een deel opzij te zetten.",
      },
      {
        kop: "Vakantiegeld of vakantiedagen?",
        tekst:
          "Vakantiegeld is geld, vakantiedagen zijn tijd, en ze staan los van elkaar. Wettelijk heb je per jaar recht op vier keer het aantal dagen dat je per week werkt: bij een volle werkweek twintig dagen. Veel cao's geven er bovenwettelijke dagen bij. Het vakantiegeld krijg je ook als je geen dag vakantie opneemt. Wie het bedrag niet direct nodig heeft, zet het vaak apart voor de zomervakantie of als buffer voor onverwachte kosten.",
      },
    ],
    faq: [
      { v: "Wanneer wordt het vakantiegeld uitbetaald?", a: "Meestal eind mei of in juni, met het salaris van die maand. Kijk in je cao of arbeidsovereenkomst voor de exacte maand." },
      { v: "Hoeveel procent vakantiegeld krijg ik?", a: "Minimaal 8 procent van je brutoloon. Veel cao's houden precies 8 procent aan, sommige meer." },
      { v: "Krijg ik vakantiegeld als ik uit dienst ga?", a: "Ja. Het opgebouwde vakantiegeld wordt bij de eindafrekening uitbetaald." },
      { v: "Mag mijn werkgever het per maand uitbetalen?", a: "Ja, als dat schriftelijk is afgesproken. Het moet dan apart op je loonstrook staan." },
      { v: "Wat als mijn werkgever te laat betaalt?", a: "Dan kun je je werkgever aanspreken op betaling; bij te late betaling van loon of vakantiegeld kan een wettelijke verhoging gelden. Een vakbond of het Juridisch Loket kan helpen." },
      { v: "Telt vakantiegeld mee voor toeslagen?", a: "Ja. Het is onderdeel van je jaarinkomen en telt mee voor de berekening van toeslagen en voor de inkomstenbelasting." },
    ],
  },
  belasting: {
    h1: "Tot wanneer kan ik belastingaangifte doen?",
    intro:
      "De aangifte inkomstenbelasting over vorig jaar doe je tussen 1 maart en 1 mei. De klok hieronder telt af naar de deadline van dit jaar. Lukt het niet op tijd, dan kun je voor 1 mei uitstel aanvragen tot 1 september.",
    blokken: [
      {
        kop: "De belangrijkste datums",
        tekst:
          "Vanaf 1 maart kun je aangifte doen over het voorgaande jaar. De aangifte moet binnen zijn voor 1 mei. Wie voor 1 april aangifte doet, krijgt volgens de Belastingdienst meestal voor 1 juli bericht over de uitkomst. Uitstel vraag je aan voor 1 mei en geeft je tot 1 september.",
      },
      {
        kop: "Moet ik aangifte doen?",
        tekst:
          "Als je een uitnodiging of aanslag van de Belastingdienst hebt gekregen, ben je verplicht aangifte te doen. Zonder uitnodiging mag het ook, en dat loont vaak: bijvoorbeeld bij hypotheekrente, zorgkosten, giften of als er te veel loonheffing is ingehouden.",
      },
      {
        kop: "Te laat of vergeten",
        tekst:
          "Na 1 mei zonder uitstel krijg je eerst een herinnering en daarna een aanmaning. Reageer je dan nog niet, dan kan de Belastingdienst een boete opleggen en zelf je inkomen schatten. Doe de aangifte dus liever laat dan nooit.",
      },
      {
        kop: "Terug in de tijd",
        tekst:
          "Heb je in eerdere jaren geen aangifte gedaan terwijl je geld terug zou krijgen? Je kunt tot vijf jaar terug alsnog aangifte doen om een teruggave te krijgen.",
      },
      {
        kop: "Wat je klaarlegt",
        tekst:
          "De Belastingdienst vult veel gegevens al voor je in: loon, uitkeringen, bankrekeningen en de WOZ-waarde van je huis. Controleer die gegevens altijd, want een fout van een bank of werkgever neem je anders mee. Leg zelf klaar wat er vaak ontbreekt: je jaaropgaven, het jaaroverzicht van je hypotheek, bewijs van giften, specifieke zorgkosten en gegevens van studieschulden of een tweede huis. Met DigiD doe je de aangifte online; samen met een fiscale partner kan dat in een keer.",
      },
      {
        kop: "Toeslagen en de aangifte",
        tekst:
          "De Belastingdienst gebruikt het inkomen uit je aangifte om je toeslagen definitief vast te stellen. Was je inkomen hoger of lager dan je had doorgegeven, dan krijg je achteraf geld terug of moet je terugbetalen. Geef een verandering in inkomen daarom ook tussendoor door bij Mijn toeslagen, zodat het verschil achteraf klein blijft.",
      },
    ],
    faq: [
      { v: "Wanneer begint de belastingaangifte?", a: "Op 1 maart, voor de aangifte over het voorgaande kalenderjaar." },
      { v: "Is 1 mei zelf nog op tijd?", a: "Nee, de aangifte moet binnen zijn voor 1 mei. De klok hierboven telt daarom af tot het begin van 1 mei." },
      { v: "Hoe vraag ik uitstel aan?", a: "Online via Mijn Belastingdienst, voor 1 mei. Je krijgt dan uitstel tot 1 september. Een belastingadviseur kan voor zijn klanten langer uitstel krijgen." },
      { v: "Wanneer krijg ik mijn geld terug?", a: "Bij een aangifte voor 1 april meestal voor 1 juli. Daarna kan het langer duren, tot maximaal drie jaar na afloop van het belastingjaar." },
      { v: "Kan ik mijn aangifte nog wijzigen?", a: "Ja. Ontdek je een fout, dan kun je een nieuwe aangifte indienen zolang er nog geen definitieve aanslag is, of daarna bezwaar maken." },
    ],
  },
  ramadan: {
    h1: "Wanneer is het ramadan?",
    intro:
      "De ramadan is de vastenmaand in de islamitische kalender. Omdat die kalender de maan volgt, schuift de ramadan elk jaar ongeveer elf dagen naar voren. Hieronder staat de verwachte eerste vastendag met een teller, het verwachte Suikerfeest en een tabel met de zonsondergang in De Bilt voor elke vastendag: het moment van iftar.",
    blokken: [
      {
        kop: "Waarom de begindatum niet vastligt",
        tekst:
          "Een islamitische maand begint als de nieuwe maansikkel na zonsondergang wordt gezien. Sommige moskeeen en landen volgen de waarneming, andere een berekening, en een bewolkte avond kan het begin een dag laten verschuiven. De datum hierboven is de astronomische verwachting; de definitieve datum maakt je eigen moskee of de Nederlandse koepelorganisaties bekend.",
      },
      {
        kop: "Iftar en suhoor",
        tekst:
          "Het vasten duurt van het ochtendgloren tot zonsondergang. Bij zonsondergang wordt het vasten verbroken met de iftar. De tijd van het ochtendgebed hangt af van de rekenmethode van de moskee, daarom staat in de tabel alleen de zonsondergang. Moskeeen publiceren hun eigen gebedstijden; die kunnen een paar minuten afwijken.",
      },
      {
        kop: "Lange en korte vastendagen",
        tekst:
          "Valt de ramadan in de winter, zoals in deze jaren, dan zijn de vastendagen in Nederland relatief kort. Elk jaar schuift de maand eerder. Over ongeveer twintig jaar valt hij midden in de zomer, en dan duren de vastendagen in Nederland meer dan achttien uur.",
      },
      {
        kop: "Het Suikerfeest",
        tekst:
          "Na de laatste vastendag volgt het Suikerfeest, Eid al-Fitr. De ramadan duurt 29 of 30 dagen, dus het feest valt op een van twee mogelijke dagen. Het Offerfeest volgt ruim twee maanden later.",
      },
      {
        kop: "Iftar in de rest van het land",
        tekst:
          "De tabel rekent voor De Bilt. In het oosten van het land gaat de zon eerder onder: in Enschede zo'n tien minuten eerder dan in Den Haag. Van noord naar zuid is het verschil in de winter klein. Voor andere steden laat de pagina over de zonsondergang de tijd per plaats zien. Moskeeen houden voor de iftar vaak een paar minuten marge aan en publiceren een eigen rooster, dat ook de tijd van het ochtendgebed noemt.",
      },
      {
        kop: "Wie vast er niet?",
        tekst:
          "Volgens de islamitische regels zijn onder meer zieken, zwangere vrouwen, reizigers en jonge kinderen vrijgesteld van het vasten; gemiste dagen worden later ingehaald of op een andere manier goedgemaakt. Veel werkgevers en scholen houden rekening met de ramadan, bijvoorbeeld met aangepaste pauzes of werktijden rond zonsondergang.",
      },
    ],
    faq: [
      { v: "Hoe lang duurt de ramadan?", a: "29 of 30 dagen, afhankelijk van wanneer de volgende nieuwe maansikkel wordt gezien." },
      { v: "Hoe laat is de iftar vandaag?", a: "Bij zonsondergang. Voor andere plaatsen dan De Bilt geeft de pagina over de zonsondergang de tijd per stad." },
      { v: "Waarom verschilt de datum tussen moskeeen?", a: "Omdat sommige de maansikkel zelf willen zien en andere een berekening of een ander land volgen." },
      { v: "Is het Suikerfeest een vrije dag?", a: "Het is geen algemeen erkende feestdag in Nederland. Veel werkgevers en scholen geven op verzoek wel vrij." },
      { v: "Wanneer valt de ramadan volgend jaar?", a: "Ongeveer elf dagen eerder dan dit jaar. Zodra de verwachte datum bekend is, staat die hier." },
    ],
  },
  getij: {
    h1: "Eb en vloed: wanneer is het hoogwater?",
    intro:
      "Langs de Nederlandse kust is het twee keer per dag hoogwater en twee keer laagwater. Hieronder staat wanneer het de komende weken springtij en doodtij is, uitgerekend uit de stand van de maan, en hoe je de exacte tijd voor jouw strand vindt.",
    blokken: [
      {
        kop: "Hoe het getij werkt",
        tekst:
          "De aantrekkingskracht van de maan, en in mindere mate van de zon, trekt het zeewater mee. Een getijdecyclus duurt ongeveer twaalf uur en vijfentwintig minuten. Daardoor schuift hoogwater elke dag zo'n vijftig minuten op: was het vandaag om 10 uur hoogwater, dan is het morgen rond kwart voor elf.",
      },
      {
        kop: "Springtij en doodtij",
        tekst:
          "Rond nieuwe en volle maan trekken zon en maan in dezelfde lijn. Dan is het verschil tussen hoog- en laagwater het grootst: springtij. Rond het eerste en laatste kwartier werken ze elkaar tegen en is het verschil het kleinst: doodtij. Aan onze kust komt het effect ongeveer twee dagen na de maanfase, daarom staan de data in de tabel twee dagen na de maanfase.",
      },
      {
        kop: "Verschil per plek",
        tekst:
          "De getijgolf trekt van zuid naar noord langs de kust. In Zeeland is het eerder hoogwater dan bij Scheveningen, en bij Den Helder en de Waddeneilanden later. Ook de hoogte verschilt: in Zeeland is het verschil tussen eb en vloed bijna vier meter, rond Den Helder ongeveer anderhalve meter.",
      },
      {
        kop: "Exacte tijden en veiligheid",
        tekst:
          "Rijkswaterstaat publiceert per meetpunt de verwachte hoog- en laagwatertijden. Ga je wadlopen, vissen of over een strandvlakte wandelen, controleer die tijden dan altijd vooraf. Bij springtij en harde aanlandige wind kan het water hoger komen dan verwacht. De [strandcheck](tool:strandweer) en de [vischeck](tool:vissen) rekenen verder met wind en weer.",
      },
      {
        kop: "Eb en vloed op het wad",
        tekst:
          "In de Waddenzee vallen bij laagwater grote platen droog. Dat maakt wadlopen mogelijk, maar het opkomend water komt via geulen soms sneller en van een andere kant dan je verwacht. Wadlopen doe je daarom alleen met een erkende gids. Wie van het strand wil genieten, heeft bij laagwater de breedste strook zand; bij hoogwater en harde aanlandige wind blijft er op smalle stranden soms weinig over.",
      },
    ],
    faq: [
      { v: "Hoe vaak is het per dag hoogwater?", a: "Twee keer, met ongeveer twaalf uur en vijfentwintig minuten ertussen. Soms valt er op een kalenderdag maar een hoogwater, omdat de volgende net na middernacht valt." },
      { v: "Wanneer is het beste moment om te vissen?", a: "Veel zeevissers zweren bij het opkomend water, de uren voor hoogwater. Springtij geeft meer stroming, wat voor sommige soorten gunstig is." },
      { v: "Is het bij springtij gevaarlijker?", a: "Het water komt hoger en trekt verder terug, en de stroming is sterker. Bij wadlopen en in geulen is dat belangrijk. Ga alleen met een gids het wad op." },
      { v: "Komen hier ook hoogwatertijden per strand?", a: "Dat is de bedoeling, zodra de koppeling met de getijdata er is. Tot die tijd vind je ze bij Rijkswaterstaat; de springtijdata hierboven kloppen al." },
      { v: "Wat is stormvloed?", a: "Een extra hoge waterstand doordat storm het water tegen de kust drukt, bovenop het getij. Rijkswaterstaat waarschuwt daar apart voor." },
    ],
  },
  zeewater: {
    h1: "Hoe warm is het zeewater?",
    intro:
      "De Noordzee is het warmst eind augustus en het koudst in februari en maart. Hieronder staat per maand wat je ongeveer kunt verwachten langs de Nederlandse kust, met wat dat betekent voor een duik en of je een wetsuit nodig hebt.",
    blokken: [
      {
        kop: "Langzaam opwarmen, langzaam afkoelen",
        tekst:
          "Water houdt warmte veel langer vast dan lucht. Daarom loopt de zee zo'n twee maanden achter op het weer: in juni is de lucht al zomers terwijl de zee nog fris is, en in september is het water vaak warmer dan in juni. Volgens het KNMI is het zeewater langs onze kust sinds 1982 met ongeveer 0,4 graad per tien jaar opgewarmd.",
      },
      {
        kop: "Wat de temperatuur betekent voor een duik",
        tekst:
          "Onder de 15 graden is zwemmen zonder wetsuit vooral een korte, frisse duik. Onder de 10 graden is het koudwaterzwemmen: de eerste minuut geeft een hijgreflex, en na een paar minuten verliezen je handen kracht. Boven de 18 graden is langer zwemmen voor de meeste mensen aangenaam.",
      },
      {
        kop: "Strand en ondiep water",
        tekst:
          "Bij het strand, in zwinnen en op de Waddenplaten kan het water op een zonnige dag een paar graden warmer zijn dan verder uit de kust. Na een periode met aflandige wind kan koud water van onderen opwellen en voelt de zee ineens kouder.",
      },
      {
        kop: "Veilig zwemmen in zee",
        tekst:
          "Zwem bij een bewaakte post en let op muistromen, die je van het strand af trekken. Zwem in zo'n stroming niet tegen de stroom in, maar evenwijdig aan het strand. De [strandcheck](tool:strandweer) en de [zwemcheck](tool:buiten-zwemmen) wegen lucht, zon en wind.",
      },
      {
        kop: "Meren, plassen en rivieren",
        tekst:
          "Binnenwater warmt in de zomer sneller op dan de zee en kan in juli en augustus ruim boven de twintig graden komen. Daar staat tegenover dat er in warme periodes blauwalg kan ontstaan. De provincies houden de officiele zwemlocaties in de gaten en melden waarschuwingen en negatieve zwemadviezen per plek. Zwem in rivieren alleen op aangewezen plekken: stroming en scheepvaart maken ze gevaarlijker dan ze lijken.",
      },
      {
        kop: "Een wetsuit kiezen",
        tekst:
          "De dikte van een wetsuit wordt in millimeters aangegeven, bijvoorbeeld 4/3: vier millimeter rond je romp, drie bij armen en benen. In de zomer is een 3/2-pak meestal genoeg, in het voor- en najaar een 4/3, en wie in de winter de zee in gaat kiest 5/4 met schoentjes, handschoenen en een kap.",
      },
    ],
    faq: [
      { v: "Wanneer is de Noordzee het warmst?", a: "Eind augustus en begin september, na een warme zomer soms boven de 20 graden." },
      { v: "Vanaf welke watertemperatuur kan ik zwemmen?", a: "Een korte duik kan altijd met wat voorzichtigheid, maar voor echt zwemmen zonder wetsuit vinden de meeste mensen 16 tot 18 graden de ondergrens." },
      { v: "Is zwemmen in koud water gezond?", a: "Veel koudwaterzwemmers ervaren het als verkwikkend. Begin rustig, ga nooit alleen, en sla het over bij hart- of vaatproblemen zonder overleg met een arts." },
      { v: "Waarom verschilt de temperatuur per dag?", a: "Door wind, getij en zon. Aflandige wind kan kouder water naar boven halen, zon verwarmt de bovenste laag." },
      { v: "Komt hier de actuele watertemperatuur?", a: "Dat is de bedoeling. Tot die koppeling er is, geeft de tabel een betrouwbare indruk per maand." },
    ],
  },
  hittegolf: {
    h1: "Komt er een hittegolf?",
    intro:
      "Een hittegolf is in Nederland streng gedefinieerd: minstens vijf dagen op rij 25 graden of warmer in De Bilt, waarvan minstens drie dagen 30 graden of warmer. Hieronder staat de verwachting voor De Bilt de komende dagen, getoetst aan die definitie.",
    blokken: [
      {
        kop: "Zomers, tropisch en hittegolf",
        tekst:
          "Een dag met 25 graden of meer heet een zomerse dag, een dag met 30 graden of meer een tropische dag. Pas als de zomerse dagen vijf dagen achter elkaar duren en er minstens drie tropische tussen zitten, is het officieel een hittegolf. Een korte hete periode van drie dagen telt dus niet mee, hoe warm ook.",
      },
      {
        kop: "Landelijk of regionaal",
        tekst:
          "Een landelijke hittegolf wordt gemeten in De Bilt. Op andere plekken kan het eerder of vaker heet zijn, vooral in het zuiden en oosten. Dan spreken weerkundigen van een regionale hittegolf.",
      },
      {
        kop: "Het Nationaal Hitteplan",
        tekst:
          "Als het KNMI verwacht dat het in De Bilt minstens vier dagen achter elkaar warmer wordt dan 27 graden, kan het Nationaal Hitteplan in werking treden. Zorgorganisaties en gemeenten letten dan extra op ouderen en kwetsbare mensen.",
      },
      {
        kop: "Koel blijven",
        tekst:
          "Houd overdag ramen en zonwering dicht en zet alles open in de koelste uren van de nacht en vroege ochtend. Drink regelmatig, ook zonder dorst, en verplaats inspanning naar de ochtend. De [koelcheck](tool:huis-koelen) zegt wanneer luchten zin heeft en de [zonkrachtcheck](tool:zonkracht) hoe snel je verbrandt.",
      },
      {
        kop: "Werken in de hitte",
        tekst:
          "In Nederland bestaat geen wettelijke maximumtemperatuur voor werk. Werkgevers moeten wel zorgen voor gezonde arbeidsomstandigheden, en bij hitte betekent dat bijvoorbeeld extra pauzes, drinkwater, aangepaste werktijden of lichtere kleding. In veel buitenberoepen begint het werk in hete periodes eerder op de dag. Vind je het niet meer verantwoord, bespreek het dan met je werkgever of de bedrijfsarts.",
      },
      {
        kop: "Koel blijven in huis",
        tekst:
          "De slaapkamer koelt het best af als je 's avonds laat en vroeg in de ochtend tegen elkaar in luchtet en overdag alles dicht houdt. Een ventilator koelt jou, niet de kamer: zet hem dus alleen aan als je er bent. Laat kinderen en huisdieren nooit achter in een auto, ook niet even: binnen een kwartier kan het er levensgevaarlijk heet worden.",
      },
    ],
    faq: [
      { v: "Hoe vaak komt een hittegolf voor?", a: "Sinds 2000 vaker dan daarvoor. Er zijn zomers met twee hittegolven, maar ook nog steeds zomers zonder." },
      { v: "Telt de temperatuur in mijn stad?", a: "Voor een landelijke hittegolf telt alleen De Bilt. Een stad kan door de vele stenen wel een paar graden warmer zijn." },
      { v: "Wanneer is de kans op een hittegolf het grootst?", a: "Van eind juni tot half augustus." },
      { v: "Wat is het verschil met een warmterecord?", a: "Een record gaat over een enkele dag of plek, een hittegolf over een aaneengesloten periode." },
      { v: "Waarom staat er nu geen hittegolf?", a: "Buiten de zomer is de kans praktisch nul. De verwachting hieronder kijkt een week vooruit en zegt het zodra er iets in zit." },
    ],
  },
  onweer: {
    h1: "Gaat het vandaag onweren?",
    intro:
      "Per dag zie je hieronder of er onweer in de verwachting zit voor jouw plek, in welke uren en of er hagel bij kan zitten. Daarnaast de energie in de lucht (CAPE): hoe hoger, hoe heftiger buien kunnen worden als ze ontstaan.",
    blokken: [
      {
        kop: "Hoe onweer ontstaat",
        tekst:
          "Onweer ontstaat als warme, vochtige lucht snel opstijgt in koudere lucht erboven. Die onstabiele lucht meten meteorologen als CAPE, in joule per kilogram. Boven ongeveer 1000 is er genoeg energie voor stevige buien, boven 2000 voor zware. Maar er moet ook iets zijn dat de lucht omhoog duwt, zoals een koufront. Daarom kan het bij veel CAPE toch droog blijven.",
      },
      {
        kop: "De 30-30-regel",
        tekst:
          "Tel de seconden tussen bliksem en donder. Drie seconden is ongeveer een kilometer. Is het minder dan 30 seconden, ga dan schuilen. Wacht na de laatste donder nog 30 minuten voor je weer naar buiten gaat, want ook aan de rand van een bui kan het inslaan.",
      },
      {
        kop: "Waar ben je veilig?",
        tekst:
          "In een gebouw of een auto met een dicht metalen dak. Buiten: blijf weg van losse bomen, masten, water en hoge punten. Kun je nergens heen, ga dan gehurkt met je voeten tegen elkaar zitten en maak jezelf klein. Fietsen en zwemmen stop je.",
      },
      {
        kop: "Hoe zeker is de verwachting?",
        tekst:
          "Onweer is lastig precies te voorspellen. Dat er buien komen in een regio, is vaak een dag vooruit bekend; waar ze precies vallen, pas een uur of twee van tevoren. Kijk vlak voor vertrek daarom naar de [buientiming](tool:regen-timing) voor de komende uren.",
      },
      {
        kop: "Onweer en apparaten",
        tekst:
          "Een inslag in de buurt kan via het stroomnet, de kabel of de telefoonlijn een piek veroorzaken die apparaten beschadigt. Trek bij zwaar onweer de stekker van dure apparatuur zoals een televisie, computer of modem uit het stopcontact, of gebruik een stekkerdoos met overspanningsbeveiliging. Een inslag in een huis met een goede installatie is zeldzaam; schade aan apparatuur komt vaker voor.",
      },
    ],
    faq: [
      { v: "Wanneer onweert het het vaakst?", a: "In de zomer, op warme middagen en avonden. In de winter komt onweer soms voor bij koude buien vanaf zee." },
      { v: "Is het veilig in de auto bij onweer?", a: "Ja, een auto met een metalen dak werkt als kooi van Faraday. Een cabrio of auto met een stoffen dak niet." },
      { v: "Mag ik douchen tijdens onweer?", a: "Het risico is heel klein, maar inslag kan via leidingen lopen. Wie voorzichtig wil zijn, wacht tot de bui voorbij is." },
      { v: "Wat betekent hagel in de verwachting?", a: "Dat het model onweer met hagel verwacht. Zet de auto binnen of onder een overkapping en leg tuinkussens weg." },
      { v: "Hoe ver weg is het onweer?", a: "Tel de seconden tussen flits en donder en deel door drie: dat is de afstand in kilometers." },
      { v: "Kan de bliksem twee keer op dezelfde plek inslaan?", a: "Ja. Hoge gebouwen, masten en torens worden zelfs regelmatig getroffen. Daarom hebben ze een bliksemafleider." },
    ],
  },
  "dagen-langer": {
    h1: "Wanneer worden de dagen weer langer?",
    intro:
      "Na de kortste dag rond 21 december worden de dagen weer langer, eerst met seconden en vanaf februari met ruim drie minuten per dag. Hieronder staat hoe lang de dag vandaag is in De Bilt, hoeveel er sinds gisteren bij of af is gegaan, en wanneer de zon weer na vijf, zes en zeven uur ondergaat.",
    blokken: [
      {
        kop: "Eerst de avonden",
        tekst:
          "Na de kortste dag gaat de zon 's avonds al iets later onder, terwijl hij 's ochtends nog tot begin januari later opkomt. Dat komt door de ellipsvormige baan van de aarde. Daardoor merk je de langere dagen eerst aan de avond.",
      },
      {
        kop: "Het snelst rond het begin van de lente",
        tekst:
          "Rond 20 maart groeit de dag het hardst, met bijna vier minuten per dag. Na de langste dag eind juni draait het om en worden de dagen weer korter, met de grootste stappen rond het begin van de herfst.",
      },
      {
        kop: "De klok helpt mee",
        tekst:
          "Op de laatste zondag van maart gaat de klok een uur vooruit. Vanaf die dag gaat de zon ineens een uur later onder, bovenop de normale groei. Dat is het moment waarop de avonden echt lang voelen.",
      },
      {
        kop: "Noord en zuid",
        tekst:
          "In Groningen is de dag rond kerst zo'n 25 minuten korter dan in Maastricht, en eind juni juist bijna een half uur langer. Voor je eigen plek staat de daglengte op de pagina over de zonsondergang.",
      },
      {
        kop: "De donkerste ochtenden komen na kerst",
        tekst:
          "Hoewel de dagen na 21 december langer worden, komt de zon 's ochtends tot rond de jaarwisseling nog steeds later op. De donkerste ochtenden van het jaar vallen dus tussen kerst en begin januari. Wie 's ochtends fietst of hardloopt, merkt de langere dagen daarom pas half januari. 's Avonds gaat het sneller: begin januari is het al ruim tien minuten langer licht dan op de kortste dag.",
      },
      {
        kop: "Licht genoeg om te fietsen",
        tekst:
          "Na zonsondergang blijft het nog een tijd schemerig. In de winter is het ongeveer een half uur na zonsondergang nog licht genoeg om zonder lamp de weg te zien, in de zomer langer. Je fietsverlichting moet volgens de regels wel aan zodra het schemert of het zicht slecht is. Rond het begin van februari fietst wie om half zes naar huis gaat weer bij daglicht.",
      },
    ],
    faq: [
      { v: "Wanneer is de kortste dag?", a: "Rond 21 december, op het begin van de astronomische winter. Daar loopt een eigen teller voor." },
      { v: "Hoeveel minuten worden de dagen per dag langer?", a: "Direct na de kortste dag een paar seconden, half januari ruim twee minuten, vanaf half februari drie tot vier minuten per dag." },
      { v: "Wanneer gaat de zon weer na vijf uur onder?", a: "In het midden van het land rond half januari. De exacte datum voor dit jaar staat hierboven." },
      { v: "Wanneer zijn dag en nacht even lang?", a: "Rond het begin van de lente en de herfst. Door de breking van het licht is de dag dan in werkelijkheid al iets langer dan twaalf uur." },
      { v: "Wanneer worden de dagen weer korter?", a: "Na de langste dag rond 21 juni." },
      { v: "Hoe laat komt de zon op rond de jaarwisseling?", a: "In het midden van het land rond tien voor negen. Dat zijn de laatste zonsopkomsten van het jaar." },
    ],
  },
  "vrije-dag": {
    h1: "Is het vandaag een feestdag?",
    intro:
      "Hieronder staat of vandaag een feestdag of een vrije dag is in Nederland, en welke feestdag als eerstvolgende komt. Handig voor wie wil weten of winkels, scholen en de Belastingdienst open zijn, of dat er een zondagsdienstregeling rijdt.",
    blokken: [
      {
        kop: "Wat er dicht is op een feestdag",
        tekst:
          "Op de algemeen erkende feestdagen zijn de meeste kantoren en scholen dicht. Supermarkten en winkels mogen vaak open, maar hebben ruimere vrijheid in hun openingstijden; kijk bij twijfel op de site van de winkel. Het openbaar vervoer rijdt meestal volgens de zondagsdienstregeling.",
      },
      {
        kop: "Termijnen en deadlines",
        tekst:
          "Valt het einde van een wettelijke termijn op een zaterdag, zondag of erkende feestdag, dan schuift die volgens de Algemene termijnenwet door naar de eerstvolgende werkdag. Handig om te weten bij een bezwaarschrift of opzegtermijn.",
      },
      {
        kop: "Post en bezorging",
        tekst:
          "Op feestdagen wordt meestal geen gewone post bezorgd. Pakketbezorgers rijden soms wel, vooral rond de feestdagen in december. Een pakket dat op een feestdag zou komen, schuift vaak een dag op.",
      },
      {
        kop: "Alle feestdagen op een rij",
        tekst:
          "De pagina over feestdagen geeft alle data van dit en volgend jaar, met de weekdag en of je meestal vrij bent.",
      },
      {
        kop: "Brugdagen",
        tekst:
          "Valt een feestdag op een dinsdag of donderdag, dan nemen veel mensen de maandag of vrijdag ertussen vrij voor een lang weekend. De bekendste brugdag is de vrijdag na Hemelvaartsdag, die veel scholen ook vrij geven. Met een paar slim gekozen vrije dagen rond Pasen, Koningsdag en Hemelvaart maak je van een paar verlofdagen een vakantie van een week of langer.",
      },
      {
        kop: "Feestdagen over de grens",
        tekst:
          "Werk je in Belgie of Duitsland, of rijd je er naartoe, let dan op andere feestdagen. Belgie heeft onder meer 1 mei, 21 juli, 15 augustus, 1 november en 11 november als feestdag, Duitsland onder meer 1 mei en 3 oktober, plus per deelstaat extra dagen. Winkels en kantoren zijn daar dan dicht, terwijl in Nederland alles gewoon open is.",
      },
      {
        kop: "Als je voor jezelf werkt",
        tekst:
          "Zzp'ers en ondernemers hebben geen recht op vrije feestdagen; je bepaalt zelf of je werkt. Houd wel rekening met klanten en leveranciers die dicht zijn, met trager betalende opdrachtgevers rond de kerstdagen, en met wettelijke termijnen die doorschuiven naar de eerstvolgende werkdag.",
      },
    ],
    faq: [
      { v: "Zijn winkels open op een feestdag?", a: "Vaak wel, maar met aangepaste tijden. Op Eerste Kerstdag, Eerste Paasdag en Eerste Pinksterdag zijn veel winkels dicht. De gemeente bepaalt de regels, de winkel de tijden." },
      { v: "Rijdt de trein op een feestdag?", a: "Ja, meestal volgens de zondagsdienstregeling. Op Koningsdag en oudejaarsavond gelden soms aangepaste dienstregelingen." },
      { v: "Is Goede Vrijdag een feestdag?", a: "Het is geen algemeen erkende feestdag; de meeste mensen werken gewoon." },
      { v: "Is 5 december een vrije dag?", a: "Nee, pakjesavond is geen feestdag." },
      { v: "Telt een feestdag in het weekend dubbel?", a: "Nee, je krijgt er in de meeste cao's geen extra vrije dag voor terug." },
    ],
  },
};
