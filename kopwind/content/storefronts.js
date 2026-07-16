/**
 * content/storefronts.js
 *
 * De rankbare content per categorie-storefront, volgens het vaste
 * bouwblok-format (PLAYBOOK sectie 11). Elke storefront is configuratie,
 * geen maatwerkpagina, en ELKE categorie is volledig ingevuld (een
 * template, geen kale varianten). Blokken per categorie:
 *
 * - voorWie:    { kop, regels[] }               (blok 2)
 * - keuzehulp:  { kop, intro?, keuzes[] }       (blok 3); elke keuze is
 *               { situatie, toolId } (live check),
 *               { situatie, variantId } (vraagpagina) of
 *               { situatie, anchor, linkTekst } (FAQ-anker op deze pagina,
 *               voor vragen zonder eigen URL: zo vangt de hub de
 *               long-tail zonder concurrerende URL per variant)
 * - beslislogica, situaties, seizoen            (blok 4, uitleg)
 * - faq:        [{ id, v, a }]                  (blok 6, id = anker)
 * - gerelateerd: [categorieId]                  (blok 7, 2-3 stuks)
 *
 * Koppen volgen een vast sjabloon met invulwoord (feedbackronde juli
 * 2026): "Voor wie is deze pagina?", "{X} kiezen: wat wil je weten?",
 * "Waar hangt {x} van af?", "Veelvoorkomende situaties", "{X} per
 * seizoen in Nederland". De tests dwingen dit af.
 */

import { kies } from "../lib/i18n/locale.js";

export const STOREFRONTS = kies({
  nl: {
    regen: {
      voorWie: {
        kop: "Voor wie is deze pagina?",
        regels: [
          "Je staat op het punt de deur uit te gaan en wilt geen doorweekte rit of wandeling. Of je plant iets later vandaag en wilt weten of dat droog blijft.",
          "Het antwoord hangt bijna nooit aan de regenkans alleen, maar aan de timing: valt de bui precies in jouw moment, of er net naast?",
        ],
      },
      keuzehulp: {
        kop: "Regencheck kiezen: wat wil je weten?",
        keuzes: [
          { situatie: "Je gaat zo de deur uit en twijfelt over een paraplu of jas", toolId: "paraplu" },
          { situatie: "Je wilt weten wanneer de bui precies valt en hoe lang het droog blijft", toolId: "regen-timing" },
          { situatie: "Je plant iets later vandaag, morgen of deze week", anchor: "gaat-het-regenen-deze-week", linkTekst: "Gaat het regenen deze week?" },
        ],
      },
      beslislogica: {
        kop: "Waar hangt regenadvies van af?",
        punten: [
          "Neerslagkans zegt iets, maar is niet genoeg: 40 procent kans op een bui van vijf minuten is iets heel anders dan 40 procent kans op een dag motregen.",
          "Timing van de bui bepaalt of je echt nat wordt. Valt de regen precies als jij op de fiets zit, of net ervoor?",
          "Duur en intensiteit maken het verschil tussen even spetters en een paraplu die je echt nodig hebt.",
          "Wind en temperatuur bepalen hoe vervelend nat worden aanvoelt: een zomerbui droogt zo op, een koude novemberbui bijt.",
        ],
      },
      situaties: {
        kop: "Veelvoorkomende situaties",
        items: [
          { naam: "Lichte motregen", tekst: "Je wordt niet altijd echt nat van motregen, maar zonder jas of paraplu is het vaak wel irritant als je langer buiten bent." },
          { naam: "Korte bui later vandaag", tekst: "Als de regen in een blok valt, is timing belangrijker dan de totale regenkans. Dan helpt het om je vertrek een halfuur te verschuiven." },
          { naam: "Buien verspreid over de dag", tekst: "Bij losse buien is de vraag niet alleen of het regent, maar vooral wanneer en hoe vaak. Dan is een paraplu sneller logisch." },
          { naam: "Hele dag droog met dreigende lucht", tekst: "Grijze lucht betekent niet automatisch regen. Een dichtbewolkte dag kan kurkdroog blijven; kijk naar de neerslagkans, niet naar de kleur van de lucht." },
        ],
      },
      seizoen: {
        kop: "Regen per seizoen in Nederland",
        items: [
          { naam: "Lente", tekst: "Veel wisselvalligheid, korte buien en snelle omslagen. Timing is hier extra belangrijk: tussen twee buien door is het vaak prima droog." },
          { naam: "Zomer", tekst: "Vaak langere droge periodes, maar ook plotselinge lokale buien en onweer later op de dag. Hang plannen niet op aan het daggemiddelde." },
          { naam: "Herfst", tekst: "Meer wind, meer langdurige neerslag en vaker het gevoel dat je nat wordt ondanks een korte afstand." },
          { naam: "Winter", tekst: "Niet alleen regen telt, maar ook nat-koud, motregen en later mogelijk gladheid. Zie ook de winterchecks." },
        ],
      },
      faq: [
        { id: "ga-ik-nat-vandaag", v: "Ga ik nat worden vandaag?", a: "Dat hangt vooral af van het moment waarop de regen valt, hoe lang je buiten bent en of het om een korte bui of langdurige neerslag gaat. Gebruik de check bovenaan voor het directe antwoord voor jouw locatie." },
        { id: "moet-ik-een-regenjas-aan", v: "Moet ik een regenjas aan?", a: "Een regenjas is vooral slim als de kans op regen samenvalt met het moment dat je buiten bent, of als er langdurige motregen wordt verwacht. Voor puur kledingadvies kun je ook naar de kledingchecks." },
        { id: "gaat-het-vanavond-regenen", v: "Gaat het vanavond regenen?", a: "Voor avondvragen is timing belangrijker dan het daggemiddelde. Gebruik de uurlijkse verwachting op de regen-timingpagina om te zien of de avond droog blijft." },
        { id: "gaat-het-morgen-regenen", v: "Gaat het morgen regenen?", a: "Morgenvragen horen bij dezelfde intentie, maar met een ander tijdvenster. De datumkiezer in de check laat je vooruitkijken zonder dat je een andere pagina hoeft te openen." },
        { id: "gaat-het-regenen-deze-week", v: "Gaat het regenen deze week?", a: "Voor de week zie je in de check een compacte trend per dag. Handig om te plannen, al blijft een voorspelling verder vooruit onzekerder dan die voor vandaag." },
        { id: "hoe-lang-blijft-het-droog", v: "Hoe lang blijft het droog?", a: "Kijk op de regen-timingpagina naar het eerstvolgende regenmoment: het verschil tussen nu en die tijd is je droge venster." },
      ],
      gerelateerd: ["huis-tuin", "kleding"],
    },
    kleding: {
      voorWie: {
        kop: "Voor wie is deze pagina?",
        regels: [
          "Je staat voor de kast en twijfelt: jas of geen jas, korte broek of toch lang, T-shirt of een laagje erbij. En je wilt niet halverwege de dag spijt hebben.",
          "Het juiste antwoord komt zelden van de kale thermometer: wind, zon en het verloop van de dag bepalen hoe het buiten echt aanvoelt.",
        ],
      },
      keuzehulp: {
        kop: "Kledingcheck kiezen: wat wil je weten?",
        keuzes: [
          { situatie: "Je wilt een compleet outfitadvies voor de hele dag", toolId: "wat-trek-ik-aan" },
          { situatie: "Je twijfelt alleen over een jas", variantId: "jas" },
          { situatie: "Je hoopt op een korte broek", variantId: "korte-broek" },
          { situatie: "Je wilt weten of een T-shirt genoeg is", variantId: "t-shirt" },
          { situatie: "Winterspullen: handschoenen, muts of sjaal", anchor: "heb-ik-handschoenen-muts-of-sjaal-nodig", linkTekst: "Heb ik handschoenen, muts of sjaal nodig?" },
          { situatie: "Fel licht onderweg", anchor: "heb-ik-vandaag-een-zonnebril-nodig", linkTekst: "Heb ik vandaag een zonnebril nodig?" },
        ],
      },
      beslislogica: {
        kop: "Waar hangt kledingadvies van af?",
        punten: [
          "Gevoelstemperatuur wint van de thermometer: wind maakt 12 graden een jassendag, windstil en zon maken er een T-shirtmiddag van.",
          "Het dagverloop bepaalt of je laagjes nodig hebt: een frisse ochtend van 9 graden en een middag van 19 vraagt om iets dat uit kan.",
          "Zon of schaduw scheelt buiten al snel een laag: in de volle zon voelt het gauw 4 tot 6 graden warmer dan in de schaduw bij wind.",
          "Wat je gaat doen telt mee: op de fiets maak je je eigen wind, bij stilzitten op een terras koel je juist af.",
          "Regenkans verandert het advies: bij buien wil je een laag die tegen een spat kan, niet je dunste trui.",
        ],
      },
      situaties: {
        kop: "Veelvoorkomende situaties",
        items: [
          { naam: "Frisse ochtend, warme middag", tekst: "Het klassieke laagjesweer: begin met een extra laag die je rond de middag uit kunt. Kijk naar de temperatuur op jouw vertrek- en terugkeermoment, niet naar het dagmaximum." },
          { naam: "Winderige dag rond 15 graden", tekst: "Op papier zacht, in de praktijk frisjes: wind drukt de gevoelstemperatuur flink. Een winddichte laag doet hier meer dan een dikke trui." },
          { naam: "Zomerse dag met een frisse avond", tekst: "Overdag T-shirtweer, maar na zonsondergang zakt het snel. Neem iets mee voor de terugweg als je tot de avond wegblijft." },
          { naam: "Wisselvallig met buien", tekst: "Kies kleding die tegen een spat kan en snel droogt. Een capuchon of dunne regenjas is op zo'n dag comfortabeler dan een paraplu in de wind." },
        ],
      },
      seizoen: {
        kop: "Kleding per seizoen in Nederland",
        items: [
          { naam: "Lente", tekst: "De grootste verschillen tussen ochtend en middag van het jaar. Laagjes zijn koning; de eerste korte-broekendagen duiken vaak al in april op." },
          { naam: "Zomer", tekst: "Meestal simpel, tot de zeewind of een onweersbui roet in het eten gooit. Let op de avondtemperatuur bij plannen buiten de deur." },
          { naam: "Herfst", tekst: "Wind en regen bepalen het beeld: winddicht en waterafstotend wint van dik. De gevoelstemperatuur ligt vaak lager dan je verwacht." },
          { naam: "Winter", tekst: "Naast de jas tellen de uiteinden: handen, oren en hals verliezen de meeste warmte. Bij vorst en wind zijn handschoenen geen luxe." },
        ],
      },
      faq: [
        { id: "heb-ik-handschoenen-muts-of-sjaal-nodig", v: "Heb ik handschoenen, muts of sjaal nodig?", a: "Vuistregel: onder de 5 graden gevoelstemperatuur zijn handschoenen prettig, onder het vriespunt vrijwel altijd. Wind is de doorslag: bij een stevige wind rond nul verlies je de meeste warmte via handen, oren en hals. Op de fiets geldt dat al bij een paar graden meer." },
        { id: "heb-ik-vandaag-een-zonnebril-nodig", v: "Heb ik vandaag een zonnebril nodig?", a: "Niet alleen bij strakblauw: ook bij dun bewolkt weer en een laagstaande zon (ochtend- en avondspits, winterse dagen) is het licht vaak feller dan je denkt. Onderweg is een zonnebril dan comfortabeler en veiliger." },
        { id: "wat-trek-ik-aan-bij-15-graden", v: "Wat trek ik aan bij 15 graden?", a: "Vijftien graden is de klassieke twijfeltemperatuur: met zon en weinig wind volstaat een shirt met een licht laagje, bij bewolking en wind voelt het eerder als een dunne jas. Kijk daarom naar de gevoelstemperatuur per dagdeel in de outfitcheck, niet alleen naar het getal." },
        { id: "waarom-voelt-het-kouder-dan-de-thermometer", v: "Waarom voelt het kouder dan de thermometer zegt?", a: "Wind voert de warme luchtlaag rond je lichaam af (windchill) en vochtige lucht geleidt warmte beter weg. Daardoor kan 10 graden met harde wind kouder aanvoelen dan 5 graden windstil. De checks rekenen daarom met gevoelstemperatuur." },
      ],
      gerelateerd: ["regen", "sport"],
    },
    buiten: {
      voorWie: {
        kop: "Voor wie is deze pagina?",
        regels: [
          "Je wilt naar buiten: een terrasje pakken, de barbecue aansteken, naar het strand of gewoon een middag in het park. Maar je wilt niet verrast worden door wind, een bui of een avond die te fris blijkt.",
          "Buiten zijn draait bijna altijd om hetzelfde: hoe voelt het in de zon en in de schaduw, hoe hard waait het, en blijft het droog op jouw moment.",
        ],
      },
      keuzehulp: {
        kop: "Buitenplan kiezen: wat wil je weten?",
        keuzes: [
          { situatie: "Een terrasje: zon, luwte en het beste moment", toolId: "terras" },
          { situatie: "De barbecue aan vanavond", toolId: "barbecue" },
          { situatie: "Een dag naar zee", toolId: "strandweer" },
          { situatie: "Picknicken of buiten eten in het park", anchor: "is-het-picknickweer-vandaag", linkTekst: "Is het picknickweer vandaag?" },
          { situatie: "Buiten zwemmen in open water", anchor: "kan-ik-buiten-zwemmen", linkTekst: "Kan ik buiten zwemmen?" },
          { situatie: "Vanavond naar de sterren kijken", anchor: "is-het-sterrenkijkweer-vanavond", linkTekst: "Is het sterrenkijkweer vanavond?" },
        ],
      },
      beslislogica: {
        kop: "Waar hangt een middag buiten van af?",
        punten: [
          "De gevoelstemperatuur op jouw plek: in de zon en uit de wind kan 17 graden heerlijk zijn, in de schaduw met wind is dezelfde middag frisjes.",
          "Wind is de spelbreker die je onderschat: boven een windkracht 4 waait het terras leeg en wordt het strand een zandstraal.",
          "Het droge venster moet op jouw moment vallen: een dag met 60 procent regenkans kan een kurkdroge middag hebben.",
          "De avondknik: na zonsondergang zakt de temperatuur snel, juist bij helder weer. Voor barbecue en buiten eten telt de avond, niet het middagmaximum.",
          "Zonkracht telt mee bij lang buiten zijn: op het strand of in het park verbrand je sneller dan je merkt. Zie ook de zonkrachtcheck.",
        ],
      },
      situaties: {
        kop: "Veelvoorkomende situaties",
        items: [
          { naam: "De eerste zonnige lentedag", tekst: "Iedereen wil het terras op, maar de lucht is nog koud en de wind fris. Zoek een plek in de zon en uit de wind; de gevoelstemperatuur verschilt daar makkelijk 6 graden." },
          { naam: "Barbecue gepland, buien op komst", tekst: "Kijk naar het venster tussen de buien in plaats van de dagkans. Een strak blok van drie droge avonduren is genoeg; verplaats desnoods het startuur, niet de hele avond." },
          { naam: "Stranddag met stevige wind", tekst: "Op het strand voelt de wind altijd harder: er is geen luwte. Boven windkracht 4 wordt liggen onprettig; een duinpan of de late middag (als de wind vaak afneemt) redt de dag." },
          { naam: "Zwoele avond", tekst: "De beste avonden buiten zijn die na een warme dag met weinig wind. Let bij onweersdreiging op de buienradar: zomerse buien komen laat en lokaal." },
        ],
      },
      seizoen: {
        kop: "Buiten zijn per seizoen in Nederland",
        items: [
          { naam: "Lente", tekst: "De zon heeft al kracht maar de lucht en het water zijn nog koud. Terras in de luwte: ja. Zwemmen in buitenwater: meestal nog niet." },
          { naam: "Zomer", tekst: "Het buitenseizoen, met de avond als goud. Let op verkoeling bij hitte, de zonkracht midden op de dag en late onweersbuien." },
          { naam: "Herfst", tekst: "De verrassend mooie dagen zitten tussen de fronten in. Een heldere, windstille oktobermiddag is prima terrasweer met een jas erbij." },
          { naam: "Winter", tekst: "Buiten zijn kan altijd, comfort vraagt planning: het zonnigste dagdeel, uit de wind, en warme kleding. Zie de kledingchecks." },
        ],
      },
      faq: [
        { id: "is-het-picknickweer-vandaag", v: "Is het picknickweer vandaag?", a: "Picknicken luistert minder nauw dan het terras: je kiest zelf je plek in zon of schaduw. Let vooral op een droog venster van twee tot drie uur en droog gras (na een ochtendbui blijft de grond lang nat). De terrascheck voor jouw plek is een prima maatstaf." },
        { id: "kan-ik-buiten-zwemmen", v: "Kan ik buiten zwemmen?", a: "Buitenwater warmt traag op: pas vanaf begin juni komt open water in Nederland boven de 18 graden, en na een paar hete dagen kan het alsnog fris zijn. Kijk naast de luchttemperatuur dus naar de watertemperatuur van jouw plas of zee, en bij officiele zwemplekken naar de waterkwaliteit (blauwalg in warme zomers)." },
        { id: "is-het-sterrenkijkweer-vanavond", v: "Is het sterrenkijkweer vanavond?", a: "Sterren kijken vraagt een heldere, liefst maanarme nacht met weinig wind. Een strakblauwe dag is geen garantie: avondbewolking trekt vaak pas na zonsondergang binnen of juist weg. Heldere winternachten zijn het donkerst, maar ook het koudst; kleed je warmer aan dan je denkt nodig te hebben." },
      ],
      gerelateerd: ["gezondheid", "huis-tuin"],
    },
    sport: {
      voorWie: {
        kop: "Voor wie is deze pagina?",
        regels: [
          "Je wilt vandaag bewegen: fietsen naar werk, een rondje hardlopen, een training buiten of gewoon een stevige wandeling. En je wilt vooraf weten of het weer meewerkt of tegenwerkt.",
          "Voor sport telt het weer anders dan voor stilzitten: wind wordt weerstand, warmte wordt belasting en een bui op het verkeerde moment bederft de hele sessie.",
        ],
      },
      keuzehulp: {
        kop: "Sportcheck kiezen: wat wil je weten?",
        keuzes: [
          { situatie: "Fietsen naar werk: wind, regen en je vertrektijd", toolId: "fiets-naar-werk" },
          { situatie: "Een rondje hardlopen", toolId: "hardloopweer" },
          { situatie: "Buiten trainen: bootcamp, calisthenics, teamsport", anchor: "kan-ik-buiten-sporten-vandaag", linkTekst: "Kan ik buiten sporten vandaag?" },
          { situatie: "Een lange wandeling", anchor: "kan-ik-wandelen-vandaag", linkTekst: "Kan ik wandelen vandaag?" },
        ],
      },
      beslislogica: {
        kop: "Waar hangt buiten sporten van af?",
        punten: [
          "Wind is weerstand: op de fiets bepaalt de windrichting je rit (heen wind mee, terug wind tegen is een andere dag dan andersom), bij hardlopen stoort vooral harde wind.",
          "Temperatuur plus inspanning: voor duursport ligt het comfort lager dan je denkt, rond de 8 tot 15 graden. Boven de 25 wordt dezelfde training zwaarder en trager.",
          "De timing van de bui: een uur droog is genoeg voor een rondje. Kijk naar het droge venster op jouw sportmoment, niet naar de dagkans.",
          "Zonkracht en hitte tellen dubbel bij inspanning: sporten midden op een zomerdag betekent smeren, drinken en het liefst schaduw of een vroeger tijdstip.",
          "In de winter telt het wegdek: gladheid maakt hardlopen en fietsen riskant, juist in de vroege ochtend. Zie de winterchecks.",
        ],
      },
      situaties: {
        kop: "Veelvoorkomende situaties",
        items: [
          { naam: "Hardlopen na werk, buien verwacht", tekst: "Zoek het droge venster tussen 17 en 20 uur in plaats van af te blazen. Een half uur verschuiven is vaak genoeg; licht motregenen loopt prima weg." },
          { naam: "Tegenwind op de heenweg", tekst: "Wind tegen op de heenrit betekent wind mee terug: plan je zwaarste richting op je frisse benen. De fietscheck rekent per rit, niet per dag." },
          { naam: "Trainen tijdens een warme periode", tekst: "Verplaats de sessie naar de vroege ochtend of late avond, verlaag de intensiteit en drink meer dan je dorst aangeeft. Boven de 27 graden is rustig bewegen het nieuwe hard trainen." },
          { naam: "Koude, heldere winterochtend", tekst: "Prima sportweer als het wegdek droog is: kleed je in laagjes en bescherm handen en oren. Check bij temperaturen rond nul eerst op gladheid, vooral op bruggen en fietspaden." },
        ],
      },
      seizoen: {
        kop: "Buiten sporten per seizoen in Nederland",
        items: [
          { naam: "Lente", tekst: "Het beste duursportseizoen: koele lucht, lengende dagen. Let op de wind (maart en april waaien stevig) en op pollen als je daar gevoelig voor bent." },
          { naam: "Zomer", tekst: "Vroeg of laat sporten wint: de ochtend is koel en windstil, de avond zwoel. Midden op de dag tellen zonkracht en hitte zwaarder dan je conditie." },
          { naam: "Herfst", tekst: "Fris en vaak ideaal, tussen de fronten door. Regenkleding die ademt maakt het verschil tussen doortrainen en overslaan." },
          { naam: "Winter", tekst: "Kou is zelden het probleem, gladheid en duisternis wel. Reflectie, verlichting en een gladheidscheck in de ochtend horen erbij." },
        ],
      },
      faq: [
        { id: "kan-ik-buiten-sporten-vandaag", v: "Kan ik buiten sporten vandaag?", a: "Voor de meeste buitentrainingen is het antwoord ja, met drie checks: een droog venster van een uur op jouw trainingsmoment, een gevoelstemperatuur waar je intensiteit bij past (boven de 25 graden rustiger aan), en in de winter een blik op gladheid. Wind is bij krachttraining zelden een probleem, bij loopvormen wel." },
        { id: "kan-ik-wandelen-vandaag", v: "Kan ik wandelen vandaag?", a: "Wandelen kan bijna altijd; comfort is de vraag. Kijk naar het droge venster voor de lengte van je route, de gevoelstemperatuur (wind maakt open landschap fris) en in de zomer naar de zonkracht op paden zonder schaduw. Met de juiste jas is een frisse, heldere dag vaak de mooiste wandeldag." },
        { id: "is-het-te-warm-om-buiten-te-sporten", v: "Is het te warm om buiten te sporten?", a: "Boven de 25 graden wordt inspanning merkbaar zwaarder, boven de 30 is intensief sporten midden op de dag onverstandig: je lichaam koelt via zweet en dat kost vocht en vermogen. Verplaats naar de ochtend of avond, verlaag je tempo en drink vooraf en tijdens. Bij hitte plus hoge luchtvochtigheid geldt dit dubbel." },
      ],
      gerelateerd: ["kleding", "buiten"],
    },
    "huis-tuin": {
      voorWie: {
        kop: "Voor wie is deze pagina?",
        regels: [
          "Je hebt een vrij dagdeel en wilt dat besteden aan de was, de auto, de tuin of een klus, zonder dat een bui of felle zon het werk verpest.",
          "Bijna elke klus buiten hangt aan dezelfde drie dingen: een droog venster dat lang genoeg is, de wind, en wat de zon doet. Deze pagina helpt je kiezen wat vandaag wel kan en wat je beter naar morgen schuift.",
        ],
      },
      keuzehulp: {
        kop: "Klusje kiezen: wat wil je weten?",
        intro: "Kies de situatie die het meest op de jouwe lijkt; je komt direct bij de check of het antwoord uit.",
        keuzes: [
          { situatie: "De was kan misschien naar buiten", toolId: "was-buiten-drogen" },
          { situatie: "De auto is vies en je hebt een uurtje", anchor: "kan-ik-de-auto-wassen-vandaag", linkTekst: "Kan ik de auto wassen vandaag?" },
          { situatie: "Schilderen, beitsen of kitten buiten", anchor: "kan-ik-buiten-schilderen-of-beitsen", linkTekst: "Kan ik buiten schilderen of beitsen?" },
          { situatie: "Het gras of de tuin wacht", anchor: "kan-ik-grasmaaien-vandaag", linkTekst: "Kan ik grasmaaien vandaag?" },
          { situatie: "Ramen wassen, dekbedden of het huis luchten", anchor: "kan-ik-mijn-ramen-wassen-vandaag", linkTekst: "Kan ik mijn ramen wassen vandaag?" },
        ],
      },
      beslislogica: {
        kop: "Waar hangt een buitenklus vandaag van af?",
        punten: [
          "Het droge venster is de basis: een klus die twee uur duurt heeft niets aan een droog uur. Kijk niet naar de dagkans op regen, maar naar het blok waarin jij bezig bent.",
          "Wind helpt en stoort tegelijk: een briesje droogt de was, de auto en de verf, maar harde wind blaast stof op je natte lak en maakt ladderwerk onprettig.",
          "Felle zon is de stille boosdoener: ramen en autolak drogen te snel op en krijgen strepen of vlekken, verf pakt slecht. Bewolkt en droog is voor veel klussen juist ideaal.",
          "Temperatuur telt bij alles wat moet hechten of drogen: verf, beits en kit willen ruwweg 10 tot 25 graden, en geen dauw of vorst in de uren erna.",
          "Wat er na de klus gebeurt telt mee: een net gebeitste schutting of gewassen auto heeft weinig aan een droog middagje als het die avond stortregent of dauwt.",
        ],
      },
      situaties: {
        kop: "Veelvoorkomende situaties",
        items: [
          { naam: "Vrije zaterdag, buien verwacht", tekst: "Kies de klus die in het droge venster past en houd een binnenklus als reserve. Een strak blok van drie droge uren is genoeg voor de auto of het gras, niet voor een beitsbeurt." },
          { naam: "Gras nog nat van de nacht", tekst: "Nat gras maaien verstopt de maaier en beschadigt de zode. Wacht tot de ochtenddauw eraf is; na een paar droge uren met een beetje wind kan het meestal prima." },
          { naam: "Auto gewassen en dan een bui", tekst: "Een korte bui op een schone auto valt mee; de vlekken komen vooral van fel zonlicht dat druppels snel opdroogt. Was liever in de schaduw of op een bewolkt moment." },
          { naam: "Beitsklus dit weekend", tekst: "Beits en buitenverf willen twee droge dagen achter elkaar: een dag om te drogen en een nacht zonder dauw of regen. Kijk dus verder dan alleen vandaag." },
        ],
      },
      seizoen: {
        kop: "Klussen rond het huis per seizoen in Nederland",
        items: [
          { naam: "Lente", tekst: "Veel wisselvalligheid en pollen die net gewassen auto's en tuinmeubels geel kleuren. Benut de korte droge vensters en spoel na een pollenpiek gewoon nog een keer na." },
          { naam: "Zomer", tekst: "Klus vroeg of laat op de dag: de felle middagzon geeft strepen op ramen en lak, en verf droogt te snel. Planten water geven doe je ook liever buiten de volle zon." },
          { naam: "Herfst", tekst: "Langere natte periodes en bladval. De eerste droge dag na een natte week is goud: gras, ramen en de laatste beitsbeurt voor de winter." },
          { naam: "Winter", tekst: "Vorst en dauw beperken het meeste buitenwerk. De auto wassen bij vorst kan beter niet (bevriezende sloten en rubbers); het huis luchten kan bijna altijd, juist met droge koude lucht." },
        ],
      },
      faq: [
        { id: "kan-ik-de-auto-wassen-vandaag", v: "Kan ik de auto wassen vandaag?", a: "Auto wassen wil een droog blok van minstens een uur of twee, geen vorst en liefst geen felle zon op de lak (dat geeft kalkvlekken doordat druppels te snel opdrogen). Een bewolkte, droge dag met weinig wind is ideaal. De wascheck hierboven gebruikt dezelfde droog-en-wind-logica voor jouw plek." },
        { id: "kan-ik-mijn-ramen-wassen-vandaag", v: "Kan ik mijn ramen wassen vandaag?", a: "Ramen wassen gaat het best op een droge, bewolkte dag: felle zon droogt het sop te snel op en geeft strepen, en harde wind blaast stof op het natte glas. Motregen hoeft geen ramp te zijn, maar echte regen maakt het werk zinloos." },
        { id: "kan-ik-grasmaaien-vandaag", v: "Kan ik grasmaaien vandaag?", a: "Grasmaaien kan zodra het gras droog aanvoelt: na de ochtenddauw of een paar droge uren met wat wind. Nat gras maaien verstopt de maaier, plakt en beschadigt de zode. De namiddag van een droge dag is meestal het beste moment." },
        { id: "kan-ik-tuinieren-vandaag", v: "Kan ik tuinieren vandaag?", a: "Tuinieren luistert minder nauw dan andere klussen: lichte regen is voor planten en pas verzette grond zelfs prettig. Zware grond bewerk je liever niet kletsnat, en planten of zaaien doe je bij voorkeur voor een zachte regendag, niet voor een hittegolf." },
        { id: "kan-ik-buiten-schilderen-of-beitsen", v: "Kan ik buiten schilderen of beitsen vandaag?", a: "Buiten schilderen of beitsen vraagt het meest van het weer: droog tijdens de klus en de uren erna, ruwweg 10 tot 25 graden, geen felle zon op het werkvlak en geen dauwnacht direct erna. Plan het op twee droge dagen achter elkaar, niet op een enkel droog middagje." },
        { id: "kan-ik-dekbedden-buiten-luchten", v: "Kan ik dekbedden buiten luchten?", a: "Dekbedden luchten werkt hetzelfde als de was buiten drogen: droge lucht en een briesje doen het werk. Een paar uur op een droge, winderige dag is genoeg; haal ze binnen voor de avondvocht toeslaat. De wascheck geeft voor jouw plek het beste moment." },
        { id: "kan-ik-mijn-huis-luchten-vandaag", v: "Kan ik mijn huis luchten vandaag?", a: "Luchten kan bijna elke dag en werkt het best als de buitenlucht droger is dan binnen: koele ochtenden en droge, frisse dagen zijn ideaal. Alleen bij mist, langdurige regen of een hoge pollenpiek (zie de hooikoortscheck) kun je het raam beter even dichthouden." },
      ],
      gerelateerd: ["regen", "buiten"],
    },
    gezondheid: {
      voorWie: {
        kop: "Voor wie is deze pagina?",
        regels: [
          "Je gaat vandaag naar buiten en wilt niet verrast worden: niet door een verbrande nek na een bewolkte middag, en niet door een niesbui die je dag verpest.",
          "Zon en pollen hebben iets gemeen: je voelt ze pas als het te laat is. De checks hier vertellen je vooraf hoe sterk de zon is en hoeveel pollen er in de lucht zitten.",
        ],
      },
      keuzehulp: {
        kop: "Zon- of pollencheck kiezen: wat wil je weten?",
        keuzes: [
          { situatie: "Verbrand ik vandaag, en wanneer moet ik smeren", toolId: "zonkracht" },
          { situatie: "Hooikoorts: hoeveel pollen zitten er in de lucht", toolId: "hooikoorts" },
          { situatie: "Een middag bewust zonnen", anchor: "kan-ik-vandaag-veilig-zonnen", linkTekst: "Kan ik vandaag veilig zonnen?" },
          { situatie: "Het is bewolkt, moet ik dan toch smeren", anchor: "verbrand-ik-bij-bewolkt-weer", linkTekst: "Verbrand ik bij bewolkt weer?" },
        ],
      },
      beslislogica: {
        kop: "Waar hangt zon- en pollenadvies van af?",
        punten: [
          "De zonkracht (uv-index) staat los van de temperatuur: een frisse meidag kan een hogere zonkracht hebben dan een warme septemberdag. Je huid voelt uv niet.",
          "Bewolking houdt uv maar deels tegen: door dunne of gebroken bewolking komt tot 80 procent van de straling gewoon door.",
          "Het tijdstip weegt zwaar: tussen 11 en 15 uur is de zonkracht het hoogst; pollen pieken juist in de ochtend en vroege avond, zeker bij graspollen.",
          "Droog en winderig weer verspreidt pollen het hardst; regen spoelt de lucht schoon. Na een bui is het pollenluwe venster het moment om te luchten of te sporten.",
          "Het seizoen bepaalt welke pollen actief zijn: bomen (berk, els) in het vroege voorjaar, grassen van mei tot juli, kruiden in de nazomer.",
        ],
      },
      situaties: {
        kop: "Veelvoorkomende situaties",
        items: [
          { naam: "Bewolkte junidag, toch verbrand", tekst: "De klassieker: geen zon te zien, wel zonkracht 6. Bij een uv-index vanaf 3 smeer je bij langer buiten zijn, ook onder een wolkendek." },
          { naam: "Eerste warme lenteweek", tekst: "De berk staat in bloei en juist dan wil iedereen naar buiten. Plan inspanning na een regenbui of in de avond, en houd ramen overdag dicht op piekdagen." },
          { naam: "Sportmiddag in de volle zon", tekst: "Inspanning plus zweet spoelt zonnebrand sneller weg: smeer vooraf en opnieuw na een uur of twee. Zoek pauzes in de schaduw rond het middaguur." },
          { naam: "Na de regenbui naar buiten", tekst: "Regen slaat pollen neer: de uren direct na een flinke bui zijn voor hooikoortspatienten vaak de prettigste van de dag. Ideaal moment voor een rondje of om het huis te luchten." },
        ],
      },
      seizoen: {
        kop: "Zon en pollen per seizoen in Nederland",
        items: [
          { naam: "Lente", tekst: "De onderschatte periode: de zonkracht klimt al naar 5 of 6 terwijl de lucht fris aanvoelt, en de boompollen (berk voorop) pieken. Dubbel opletten dus." },
          { naam: "Zomer", tekst: "Zonkracht op zijn hoogst (7 tot 8 op onbewolkte dagen) en graspollen tot diep in juli. Smeren hoort bij elke lange buitendag." },
          { naam: "Herfst", tekst: "De zonkracht zakt snel; alleen rond de middag bij helder weer nog relevant. Pollen spelen nauwelijks nog, op wat kruiden in september na." },
          { naam: "Winter", tekst: "Uv is laag, maar sneeuw weerkaatst tot 80 procent van de straling: op wintersport smeer je juist wel. In Nederland begint de els soms al in januari te bloeien." },
        ],
      },
      faq: [
        { id: "verbrand-ik-bij-bewolkt-weer", v: "Verbrand ik bij bewolkt weer?", a: "Ja, dat kan makkelijk: dunne of gebroken bewolking laat tot 80 procent van de uv-straling door, en de temperatuur zegt niets over de zonkracht. Bij een uv-index van 3 of hoger kun je bij langer buiten zijn verbranden, ook als je de zon niet ziet. De zonkrachtcheck toont de index per uur voor jouw plek." },
        { id: "vanaf-welke-zonkracht-moet-ik-smeren", v: "Vanaf welke zonkracht moet ik smeren?", a: "De vuistregel: vanaf uv-index 3 smeren bij langer dan een halfuur buiten, vanaf 6 ook bij korte periodes en schaduw zoeken rond het middaguur, vanaf 8 is onbeschermd zonnen af te raden. Een lichte huid verbrandt bij index 7 al binnen een kwartier." },
        { id: "wanneer-zijn-pollen-het-ergst", v: "Wanneer zijn pollen het ergst op de dag?", a: "Graspollen pieken meestal in de ochtend (als de dauw opdroogt) en opnieuw in de vroege avond als de lucht afkoelt en pollen dalen. Droge, warme dagen met wind zijn het zwaarst; na een regenbui is de lucht tijdelijk schoon. De hooikoortscheck laat het verloop per uur zien." },
        { id: "kan-ik-vandaag-veilig-zonnen", v: "Kan ik vandaag veilig zonnen?", a: "Veilig zonnen bestaat uit drie dingen: de zonkracht van het moment kennen (bij index 6 of hoger is de middagzon fel), vooraf en tussentijds smeren met minimaal factor 30, en je tijd opbouwen. De aangenaamste en veiligste zonuren liggen voor 11 en na 15 uur; de zonkrachtcheck toont per uur hoe sterk de zon is." },
      ],
      gerelateerd: ["buiten", "kleding"],
    },
    winter: {
      voorWie: {
        kop: "Voor wie is deze pagina?",
        regels: [
          "Het is koud, en je wilt morgenochtend niet voor verrassingen staan: een dichtgevroren autoruit terwijl je al laat bent, of een fietspad dat spekglad blijkt.",
          "Vorst en gladheid gedragen zich anders dan je denkt: de gevaarlijkste nachten zijn vaak de helderste, en het kan glad zijn terwijl de thermometer boven nul staat.",
        ],
      },
      keuzehulp: {
        kop: "Wintervraag kiezen: wat wil je weten?",
        keuzes: [
          { situatie: "Moet de krabber morgen mee naar de auto", anchor: "moet-ik-morgen-krabben", linkTekst: "Moet ik morgen krabben?" },
          { situatie: "Je stapt zo op de fiets of in de auto en twijfelt over gladheid", anchor: "is-het-glad-op-de-weg", linkTekst: "Is het glad op de weg?" },
          { situatie: "Warm de deur uit: jas, muts en handschoenen", toolId: "wat-trek-ik-aan" },
        ],
      },
      beslislogica: {
        kop: "Waar hangt winterse gladheid van af?",
        punten: [
          "Heldere, windstille nachten zijn de vriesnachten: zonder wolkendek straalt de warmte van de grond weg en koelt het aan de grond harder af dan op thermometerhoogte.",
          "Het wegdek heeft zijn eigen temperatuur: na een koude periode kan de weg onder nul zijn terwijl de lucht al 2 of 3 graden pluist. Dan bevriest neerslag alsnog.",
          "Vocht is de tweede voorwaarde: een droge vriesnacht geeft rijp op de auto maar zelden een glad wegdek; natte weggedeelten en mist wel.",
          "Bruggen, viaducten en fietspaden bevriezen het eerst: ze koelen van twee kanten af en worden minder bereden.",
          "IJzel is de gevaarlijkste vorm: regen op een bevroren ondergrond. Juist tijdens dooi na een vorstperiode, als alles er alweer gewoon uitziet.",
        ],
      },
      situaties: {
        kop: "Veelvoorkomende situaties",
        items: [
          { naam: "Heldere avond na een zachte dag", tekst: "De klassieke krabnacht: overdag 8 graden, maar de wolkenloze nacht laat het aan de grond tot onder nul zakken. De autoruit is dan wit terwijl het officieel niet gevroren heeft." },
          { naam: "IJzel in de ochtend", tekst: "Regen op een bevroren wegdek is binnen minuten spekglad, ook voor voetgangers. Bij ijzelwaarschuwingen: wacht de strooiwagens en de eerste dooi af als het kan." },
          { naam: "Eerste vorstnacht van het seizoen", tekst: "De eerste gladheid verrast elk jaar: banden, remmen en je eigen reflexen zijn nog op de zomer ingesteld. Reken de eerste vriesochtend extra reistijd." },
          { naam: "Sneeuwrestjes en schaduwplekken", tekst: "Na een dooidag lijkt alles weg, maar in de schaduw van gebouwen en bomen en op bruggen blijft het vriezen aan de grond. Juist daar glijd je onderuit." },
        ],
      },
      seizoen: {
        kop: "Vorst en gladheid per seizoen in Nederland",
        items: [
          { naam: "Late herfst", tekst: "De eerste nachtvorsten duiken vaak al in oktober of november op na een heldere nacht. Vooral grondvorst: de autoruit is wit, de weg meestal nog niet glad." },
          { naam: "Hartje winter", tekst: "December tot februari is het echte seizoen: vorstperiodes, sneeuw en het ijzelrisico tijdens elke dooi-inval. De krab- en gladheidsvraag is dan dagelijkse kost." },
          { naam: "Vroege lente", tekst: "Verraderlijk: zachte middagen, maar heldere maartnachten vriezen aan de grond nog geregeld. De ochtendspits kan glad zijn terwijl de middag 15 graden haalt." },
          { naam: "De rest van het jaar", tekst: "Van mei tot september speelt gladheid door vorst geen rol. De winterchecks staan dan in de wachtstand; de kledingcheck neemt het over." },
        ],
      },
      faq: [
        { id: "moet-ik-morgen-krabben", v: "Moet ik morgen krabben?", a: "Krabben is aan de orde na een heldere, windstille nacht met vocht in de lucht: de ruit koelt dan onder het vriespunt, ook als de officiele minimumtemperatuur net boven nul blijft (aan de grond vriest het eerder). Een auto onder een carport of tegen de gevel heeft er veel minder last van. Bewolkte of winderige nachten geven zelden een bevroren ruit." },
        { id: "is-het-glad-op-de-weg", v: "Is het glad op de weg?", a: "Gladheid vraagt twee dingen tegelijk: een wegdek rond of onder nul en vocht (natte weg, mist, of neerslag). Let extra op bruggen, viaducten en fietspaden, die het eerst bevriezen, en op ijzel tijdens dooi na een vorstperiode. Bij twijfel: rustig vertrekken en de eerste remtest op een veilige plek doen." },
        { id: "waarom-is-het-glad-bij-plusgraden", v: "Waarom kan het glad zijn bij plusgraden?", a: "De thermometer meet op anderhalve meter hoogte, maar het wegdek heeft zijn eigen temperatuur. Na een koude nacht of vorstperiode kan de weg nog onder nul zijn terwijl de lucht 2 of 3 graden aangeeft; neerslag of optrekkende mist bevriest dan alsnog op het oppervlak. Vooral in de vroege ochtend en op bruggen speelt dit." },
      ],
      gerelateerd: ["kleding", "sport"],
    },
  },
  en: {
    regen: {
      voorWie: {
        kop: "Who is this page for?",
        regels: [
          "You're about to head out and don't fancy a soaked ride or walk. Or you're planning something later today and want to know whether it stays dry.",
          "The answer almost never hangs on the rain chance alone, but on timing: does the shower land exactly in your moment, or just beside it?",
        ],
      },
      keuzehulp: {
        kop: "Pick your rain check: what do you want to know?",
        keuzes: [
          { situatie: "You're heading out shortly and doubt between an umbrella or a coat", toolId: "paraplu" },
          { situatie: "You want to know exactly when the shower falls and how long it stays dry", toolId: "regen-timing" },
          { situatie: "You're planning something later today, tomorrow or this week", anchor: "gaat-het-regenen-deze-week", linkTekst: "Will it rain this week?" },
        ],
      },
      beslislogica: {
        kop: "What does rain advice depend on?",
        punten: [
          "Rain chance says something, but isn't enough: a 40 percent chance of a five-minute shower is very different from a 40 percent chance of a day of drizzle.",
          "The timing of the shower decides whether you actually get wet. Does the rain fall exactly when you're on the bike, or just before?",
          "Duration and intensity make the difference between a few spots and an umbrella you genuinely need.",
          "Wind and temperature decide how unpleasant getting wet feels: a summer shower dries off in no time, a cold November one bites.",
        ],
      },
      situaties: {
        kop: "Common situations",
        items: [
          { naam: "Light drizzle", tekst: "Drizzle doesn't always get you truly wet, but without a coat or umbrella it's often just annoying if you're out for a while." },
          { naam: "A shower later today", tekst: "If the rain falls in one block, timing matters more than the total chance. Shifting your departure by half an hour often does the trick." },
          { naam: "Showers spread through the day", tekst: "With scattered showers the question isn't just whether it rains, but mainly when and how often. An umbrella becomes the logical call sooner." },
          { naam: "Dry all day under threatening skies", tekst: "Grey skies don't automatically mean rain. An overcast day can stay bone-dry; look at the rain chance, not the colour of the sky." },
        ],
      },
      seizoen: {
        kop: "Rain by season in the Netherlands",
        items: [
          { naam: "Spring", tekst: "Very changeable, short showers and quick turns. Timing matters extra here: between two showers it's often perfectly dry." },
          { naam: "Summer", tekst: "Often longer dry spells, but also sudden local showers and thunderstorms later in the day. Don't hang plans on the daily average." },
          { naam: "Autumn", tekst: "More wind, more prolonged rain and more often that feeling of getting wet despite a short distance." },
          { naam: "Winter", tekst: "Not just rain counts, but wet-cold, drizzle and later possibly slippery roads. See the winter checks too." },
        ],
      },
      faq: [
        { id: "ga-ik-nat-vandaag", v: "Will I get wet today?", a: "That depends mainly on when the rain falls, how long you're out and whether it's a short shower or prolonged rain. Use the check at the top for the direct answer for your location." },
        { id: "moet-ik-een-regenjas-aan", v: "Do I need a raincoat?", a: "A raincoat is smart mainly when the rain chance coincides with the time you're out, or when prolonged drizzle is expected. For pure clothing advice see the clothing checks." },
        { id: "gaat-het-vanavond-regenen", v: "Will it rain tonight?", a: "For evening questions, timing matters more than the daily average. Use the hourly outlook on the rain-timing page to see whether the evening stays dry." },
        { id: "gaat-het-morgen-regenen", v: "Will it rain tomorrow?", a: "Tomorrow questions share the same intent, just a different time window. The date picker in the check lets you look ahead without opening another page." },
        { id: "gaat-het-regenen-deze-week", v: "Will it rain this week?", a: "For the week the check shows a compact trend per day. Handy for planning, though a forecast further ahead stays less certain than today's." },
        { id: "hoe-lang-blijft-het-droog", v: "How long does it stay dry?", a: "Check the rain-timing page for the next rain moment: the gap between now and that time is your dry window." },
      ],
      gerelateerd: ["huis-tuin", "kleding"],
    },
    kleding: {
      voorWie: {
        kop: "Who is this page for?",
        regels: [
          "You're standing at the wardrobe in doubt: coat or no coat, shorts or trousers, a T-shirt or an extra layer. And you don't want regrets halfway through the day.",
          "The right answer rarely comes from the bare thermometer: wind, sun and how the day develops decide how it really feels outside.",
        ],
      },
      keuzehulp: {
        kop: "Pick your clothing check: what do you want to know?",
        keuzes: [
          { situatie: "You want a complete outfit call for the whole day", toolId: "wat-trek-ik-aan" },
          { situatie: "You only doubt about a coat", variantId: "jas" },
          { situatie: "You're hoping for shorts", variantId: "korte-broek" },
          { situatie: "You want to know if a T-shirt is enough", variantId: "t-shirt" },
          { situatie: "Winter gear: gloves, hat or scarf", anchor: "heb-ik-handschoenen-muts-of-sjaal-nodig", linkTekst: "Do I need gloves, a hat or a scarf?" },
          { situatie: "Bright light on the road", anchor: "heb-ik-vandaag-een-zonnebril-nodig", linkTekst: "Do I need sunglasses today?" },
        ],
      },
      beslislogica: {
        kop: "What does clothing advice depend on?",
        punten: [
          "Feels-like beats the thermometer: wind turns 12 degrees into a coat day, calm air and sun turn it into a T-shirt afternoon.",
          "The day's course decides whether you need layers: a fresh 9-degree morning and a 19-degree afternoon call for something you can take off.",
          "Sun or shade quickly makes a layer of difference: in full sun it easily feels 4 to 6 degrees warmer than in windy shade.",
          "What you're doing counts: on the bike you make your own wind, sitting still on a patio you cool down instead.",
          "Rain chance changes the call: with showers you want a layer that takes a splash, not your thinnest jumper.",
        ],
      },
      situaties: {
        kop: "Common situations",
        items: [
          { naam: "Fresh morning, warm afternoon", tekst: "Classic layer weather: start with an extra layer you can shed around noon. Look at the temperature at your departure and return times, not the daily maximum." },
          { naam: "Windy day around 15 degrees", tekst: "Mild on paper, chilly in practice: wind pushes the feels-like down considerably. A windproof layer does more here than a thick jumper." },
          { naam: "Summery day with a fresh evening", tekst: "T-shirt weather by day, but it drops fast after sunset. Bring something for the way back if you're out until evening." },
          { naam: "Changeable with showers", tekst: "Pick clothing that takes a splash and dries fast. A hood or thin rain jacket beats an umbrella in the wind on days like this." },
        ],
      },
      seizoen: {
        kop: "Clothing by season in the Netherlands",
        items: [
          { naam: "Spring", tekst: "The biggest morning-to-afternoon differences of the year. Layers rule; the first shorts days often show up as early as April." },
          { naam: "Summer", tekst: "Usually simple, until the sea breeze or a thunderstorm interferes. Watch the evening temperature when planning to stay out." },
          { naam: "Autumn", tekst: "Wind and rain set the tone: windproof and water-resistant beats thick. The feels-like is often lower than you expect." },
          { naam: "Winter", tekst: "Beyond the coat, the extremities count: hands, ears and neck lose the most heat. With frost and wind, gloves are no luxury." },
        ],
      },
      faq: [
        { id: "heb-ik-handschoenen-muts-of-sjaal-nodig", v: "Do I need gloves, a hat or a scarf?", a: "Rule of thumb: below 5 degrees feels-like, gloves are pleasant; below freezing, almost always. Wind is the decider: with a stiff wind around zero you lose most heat through hands, ears and neck. On the bike this applies a few degrees earlier." },
        { id: "heb-ik-vandaag-een-zonnebril-nodig", v: "Do I need sunglasses today?", a: "Not only under clear blue skies: with thin clouds and a low sun (morning and evening rush, winter days) the light is often brighter than you think. On the road, sunglasses are then both more comfortable and safer." },
        { id: "wat-trek-ik-aan-bij-15-graden", v: "What do I wear at 15 degrees?", a: "Fifteen degrees is the classic doubt temperature: with sun and little wind a shirt plus a light layer will do, with clouds and wind it feels more like thin-jacket weather. So look at the feels-like per part of the day in the outfit check, not just the number." },
        { id: "waarom-voelt-het-kouder-dan-de-thermometer", v: "Why does it feel colder than the thermometer says?", a: "Wind strips away the warm layer of air around your body (wind chill) and humid air conducts heat away faster. That's why 10 degrees with strong wind can feel colder than a calm 5 degrees. The checks therefore work with feels-like temperature." },
      ],
      gerelateerd: ["regen", "sport"],
    },
    buiten: {
      voorWie: {
        kop: "Who is this page for?",
        regels: [
          "You want to be outside: a patio, the barbecue, the beach or just an afternoon in the park. But you don't want to be surprised by wind, a shower or an evening that turns out fresh.",
          "Being outside almost always comes down to the same things: how it feels in sun and shade, how hard the wind blows, and whether it stays dry at your moment.",
        ],
      },
      keuzehulp: {
        kop: "Pick your plan: what do you want to know?",
        keuzes: [
          { situatie: "A patio: sun, shelter and the best moment", toolId: "terras" },
          { situatie: "Firing up the barbecue tonight", toolId: "barbecue" },
          { situatie: "A day at the seaside", toolId: "strandweer" },
          { situatie: "A picnic or eating outside in the park", anchor: "is-het-picknickweer-vandaag", linkTekst: "Is it picnic weather today?" },
          { situatie: "Swimming in open water", anchor: "kan-ik-buiten-zwemmen", linkTekst: "Can I swim outside?" },
          { situatie: "Stargazing tonight", anchor: "is-het-sterrenkijkweer-vanavond", linkTekst: "Is tonight good for stargazing?" },
        ],
      },
      beslislogica: {
        kop: "What does an afternoon outside depend on?",
        punten: [
          "The feels-like at your spot: in the sun and out of the wind, 17 degrees can be lovely; in windy shade the same afternoon is chilly.",
          "Wind is the underrated spoiler: above force 4 the patio empties and the beach turns into a sandblaster.",
          "The dry window has to land on your moment: a day with a 60 percent rain chance can hold a bone-dry afternoon.",
          "The evening dip: after sunset the temperature drops fast, especially under clear skies. For barbecues and dining outside, the evening counts, not the afternoon maximum.",
          "UV matters when you're out long: on the beach or in the park you burn faster than you notice. See the UV check too.",
        ],
      },
      situaties: {
        kop: "Common situations",
        items: [
          { naam: "The first sunny spring day", tekst: "Everyone wants the patio, but the air is still cold and the wind fresh. Find a spot in the sun and out of the wind; the feels-like easily differs 6 degrees there." },
          { naam: "Barbecue planned, showers coming", tekst: "Look at the window between showers instead of the daily chance. A tight block of three dry evening hours is enough; shift the start time if needed, not the whole evening." },
          { naam: "Beach day with a stiff wind", tekst: "On the beach the wind always feels stronger: there is no shelter. Above force 4 lying down gets unpleasant; a dune hollow or the late afternoon (when wind often eases) saves the day." },
          { naam: "A mild evening", tekst: "The best evenings outside follow a warm day with little wind. With thunder in the air, watch the radar: summer storms arrive late and locally." },
        ],
      },
      seizoen: {
        kop: "Being outside by season in the Netherlands",
        items: [
          { naam: "Spring", tekst: "The sun already has power but air and water are still cold. Patio in the shelter: yes. Swimming in open water: usually not yet." },
          { naam: "Summer", tekst: "The outdoor season, with the evening as gold. Mind cooling during heat, the midday UV and late thunderstorms." },
          { naam: "Autumn", tekst: "The surprisingly fine days sit between the fronts. A clear, calm October afternoon is perfectly good patio weather with a coat." },
          { naam: "Winter", tekst: "Being outside always works, comfort takes planning: the sunniest part of the day, out of the wind, warm clothing. See the clothing checks." },
        ],
      },
      faq: [
        { id: "is-het-picknickweer-vandaag", v: "Is it picnic weather today?", a: "A picnic is less fussy than the patio: you pick your own spot in sun or shade. Mainly look for a dry window of two to three hours and dry grass (after a morning shower the ground stays wet for a while). The patio check for your location is a fine yardstick." },
        { id: "kan-ik-buiten-zwemmen", v: "Can I swim outside?", a: "Open water warms slowly: in the Netherlands it only passes 18 degrees from early June, and after a few hot days it can still be fresh. So look at the water temperature of your lake or sea beside the air temperature, and at official swimming spots check the water quality (blue-green algae in warm summers)." },
        { id: "is-het-sterrenkijkweer-vanavond", v: "Is tonight good for stargazing?", a: "Stargazing wants a clear, preferably moonless night with little wind. A cloudless day is no guarantee: evening clouds often roll in, or clear away, only after sunset. Clear winter nights are the darkest but also the coldest; dress warmer than you think you need." },
      ],
      gerelateerd: ["gezondheid", "huis-tuin"],
    },
    sport: {
      voorWie: {
        kop: "Who is this page for?",
        regels: [
          "You want to move today: bike to work, go for a run, train outside or take a long walk. And you want to know beforehand whether the weather works with you or against you.",
          "For sport, weather counts differently than for sitting still: wind becomes resistance, heat becomes load, and a shower at the wrong moment ruins the whole session.",
        ],
      },
      keuzehulp: {
        kop: "Pick your sport check: what do you want to know?",
        keuzes: [
          { situatie: "Biking to work: wind, rain and your departure time", toolId: "fiets-naar-werk" },
          { situatie: "Going for a run", toolId: "hardloopweer" },
          { situatie: "Training outside: bootcamp, calisthenics, team sport", anchor: "kan-ik-buiten-sporten-vandaag", linkTekst: "Can I work out outside today?" },
          { situatie: "A long walk", anchor: "kan-ik-wandelen-vandaag", linkTekst: "Can I go for a walk today?" },
        ],
      },
      beslislogica: {
        kop: "What does outdoor exercise depend on?",
        punten: [
          "Wind is resistance: on the bike the wind direction shapes your ride (tailwind out, headwind back is a different day than the reverse); for running mainly strong wind is the nuisance.",
          "Temperature plus effort: for endurance sport the comfort zone is lower than you think, roughly 8 to 15 degrees. Above 25 the same workout gets heavier and slower.",
          "The timing of the shower: one dry hour is enough for a loop. Look at the dry window at your training time, not the daily chance.",
          "UV and heat count double under effort: midday summer sessions mean sunscreen, fluids and preferably shade or an earlier slot.",
          "In winter the road surface counts: ice makes running and cycling risky, especially early morning. See the winter checks.",
        ],
      },
      situaties: {
        kop: "Common situations",
        items: [
          { naam: "Running after work, showers expected", tekst: "Find the dry window between 5 and 8 pm instead of calling it off. Shifting half an hour is often enough; light drizzle runs off just fine." },
          { naam: "Headwind on the way out", tekst: "Wind against on the way out means wind behind on the return: plan your hardest direction on fresh legs. The bike check works per ride, not per day." },
          { naam: "Training through a warm spell", tekst: "Move the session to early morning or late evening, lower the intensity and drink more than your thirst suggests. Above 27 degrees, easy movement is the new hard training." },
          { naam: "Cold, clear winter morning", tekst: "Fine sport weather if the surface is dry: dress in layers and protect hands and ears. Around zero, check for ice first, especially on bridges and bike paths." },
        ],
      },
      seizoen: {
        kop: "Outdoor exercise by season in the Netherlands",
        items: [
          { naam: "Spring", tekst: "The best endurance season: cool air, lengthening days. Mind the wind (March and April blow hard) and pollen if you're sensitive." },
          { naam: "Summer", tekst: "Early or late wins: mornings are cool and calm, evenings mild. In the middle of the day, UV and heat outweigh your fitness." },
          { naam: "Autumn", tekst: "Fresh and often ideal, between the fronts. Breathable rain gear makes the difference between training on and skipping." },
          { naam: "Winter", tekst: "Cold is rarely the problem, ice and darkness are. Reflection, lights and a morning ice check come with the season." },
        ],
      },
      faq: [
        { id: "kan-ik-buiten-sporten-vandaag", v: "Can I work out outside today?", a: "For most outdoor training the answer is yes, with three checks: a dry window of an hour at your training time, a feels-like your intensity can handle (above 25 degrees, ease off), and in winter a glance at ice. Wind rarely bothers strength work; it does bother running drills." },
        { id: "kan-ik-wandelen-vandaag", v: "Can I go for a walk today?", a: "Walking works almost always; comfort is the question. Look at the dry window for the length of your route, the feels-like (wind makes open country fresh) and in summer at the UV on shadeless paths. With the right coat, a fresh clear day is often the finest walking day." },
        { id: "is-het-te-warm-om-buiten-te-sporten", v: "Is it too warm to exercise outside?", a: "Above 25 degrees effort gets noticeably heavier, above 30 intensive midday sport is unwise: your body cools through sweat, which costs fluids and power. Move to morning or evening, lower your pace and drink before and during. With heat plus high humidity this counts double." },
      ],
      gerelateerd: ["kleding", "buiten"],
    },
    "huis-tuin": {
      voorWie: {
        kop: "Who is this page for?",
        regels: [
          "You've got a free morning or afternoon and want to spend it on the laundry, the car, the garden or a DIY job, without a shower or harsh sun ruining the work.",
          "Almost every outdoor job hangs on the same three things: a dry window that's long enough, the wind, and what the sun is doing. This page helps you pick what works today and what's better moved to tomorrow.",
        ],
      },
      keuzehulp: {
        kop: "Pick your job: what do you want to know?",
        intro: "Choose the situation that looks most like yours; it takes you straight to the check or the answer.",
        keuzes: [
          { situatie: "The laundry could go outside", toolId: "was-buiten-drogen" },
          { situatie: "The car is dirty and you've got an hour", anchor: "kan-ik-de-auto-wassen-vandaag", linkTekst: "Can I wash the car today?" },
          { situatie: "Painting, staining or sealing outside", anchor: "kan-ik-buiten-schilderen-of-beitsen", linkTekst: "Can I paint or stain outside?" },
          { situatie: "The lawn or the garden is waiting", anchor: "kan-ik-grasmaaien-vandaag", linkTekst: "Can I mow the lawn today?" },
          { situatie: "Washing windows, airing duvets or the house", anchor: "kan-ik-mijn-ramen-wassen-vandaag", linkTekst: "Can I wash my windows today?" },
        ],
      },
      beslislogica: {
        kop: "What does an outdoor job depend on today?",
        punten: [
          "The dry window is the base: a two-hour job gains nothing from one dry hour. Don't look at the daily rain chance, look at the block in which you'll actually be working.",
          "Wind helps and hinders at once: a breeze dries the laundry, the car and the paint, but strong wind blows dust onto your wet finish and makes ladder work unpleasant.",
          "Harsh sun is the quiet culprit: windows and car paint dry too fast and streak or spot, paint doesn't take well. Overcast and dry is ideal for many jobs.",
          "Temperature matters for anything that has to bond or dry: paint, stain and sealant want roughly 10 to 25 degrees, and no dew or frost in the hours after.",
          "What happens after the job counts too: a freshly stained fence or washed car gains little from a dry afternoon if it pours or dews that evening.",
        ],
      },
      situaties: {
        kop: "Common situations",
        items: [
          { naam: "Free Saturday, showers expected", tekst: "Pick the job that fits the dry window and keep an indoor job in reserve. A tight block of three dry hours is enough for the car or the lawn, not for a staining job." },
          { naam: "Grass still wet from the night", tekst: "Mowing wet grass clogs the mower and damages the turf. Wait until the morning dew has gone; after a few dry hours with a bit of wind it's usually fine." },
          { naam: "Car washed and then a shower", tekst: "A short shower on a clean car is no disaster; the spots mainly come from bright sun drying droplets too fast. Wash in the shade or on an overcast moment instead." },
          { naam: "Staining job this weekend", tekst: "Stain and outdoor paint want two dry days in a row: a day to dry and a night without dew or rain. So look further than just today." },
        ],
      },
      seizoen: {
        kop: "Jobs around the house by season in the Netherlands",
        items: [
          { naam: "Spring", tekst: "Very changeable, plus pollen that turns freshly washed cars and garden furniture yellow. Use the short dry windows and simply rinse again after a pollen peak." },
          { naam: "Summer", tekst: "Work early or late in the day: the harsh midday sun streaks windows and paintwork, and paint dries too fast. Watering plants is also better done out of full sun." },
          { naam: "Autumn", tekst: "Longer wet spells and falling leaves. The first dry day after a wet week is gold: the lawn, the windows and the last staining round before winter." },
          { naam: "Winter", tekst: "Frost and dew limit most outdoor work. Washing the car in frost is best skipped (freezing locks and rubbers); airing the house works almost always, precisely with dry cold air." },
        ],
      },
      faq: [
        { id: "kan-ik-de-auto-wassen-vandaag", v: "Can I wash the car today?", a: "Washing the car wants a dry block of at least an hour or two, no frost and preferably no harsh sun on the paint (droplets drying too fast leave limescale spots). An overcast, dry day with little wind is ideal. The laundry check above uses the same dry-and-wind logic for your location." },
        { id: "kan-ik-mijn-ramen-wassen-vandaag", v: "Can I wash my windows today?", a: "Window washing works best on a dry, overcast day: harsh sun dries the suds too fast and leaves streaks, and strong wind blows dust onto the wet glass. Drizzle isn't necessarily a problem, but real rain makes the work pointless." },
        { id: "kan-ik-grasmaaien-vandaag", v: "Can I mow the lawn today?", a: "Mow as soon as the grass feels dry: after the morning dew or a few dry hours with some wind. Mowing wet grass clogs the mower, sticks and damages the turf. The late afternoon of a dry day is usually the best moment." },
        { id: "kan-ik-tuinieren-vandaag", v: "Can I garden today?", a: "Gardening is less fussy than other jobs: light rain is actually pleasant for plants and freshly moved soil. Avoid working heavy soil when it's soaked, and plant or sow ahead of a soft rainy day rather than a heatwave." },
        { id: "kan-ik-buiten-schilderen-of-beitsen", v: "Can I paint or stain outside today?", a: "Outdoor painting and staining ask the most of the weather: dry during the job and the hours after, roughly 10 to 25 degrees, no harsh sun on the surface and no dewy night straight after. Plan it on two dry days in a row, not a single dry afternoon." },
        { id: "kan-ik-dekbedden-buiten-luchten", v: "Can I air duvets outside?", a: "Airing duvets works like drying laundry outside: dry air and a breeze do the work. A few hours on a dry, breezy day is enough; bring them in before the evening damp sets in. The laundry check gives the best moment for your location." },
        { id: "kan-ik-mijn-huis-luchten-vandaag", v: "Can I air the house today?", a: "Airing works almost every day and is most effective when the outside air is drier than inside: cool mornings and dry, fresh days are ideal. Only with fog, prolonged rain or a high pollen peak (see the hay fever check) is it better to keep the window shut for a bit." },
      ],
      gerelateerd: ["regen", "buiten"],
    },
    gezondheid: {
      voorWie: {
        kop: "Who is this page for?",
        regels: [
          "You're heading outside today and don't want surprises: not a burnt neck after an overcast afternoon, and not a sneezing fit that wrecks your day.",
          "Sun and pollen share one trait: you only feel them when it's too late. The checks here tell you in advance how strong the sun is and how much pollen is in the air.",
        ],
      },
      keuzehulp: {
        kop: "Pick your sun or pollen check: what do you want to know?",
        keuzes: [
          { situatie: "Will I burn today, and when should I apply sunscreen", toolId: "zonkracht" },
          { situatie: "Hay fever: how much pollen is in the air", toolId: "hooikoorts" },
          { situatie: "An afternoon of deliberate sunbathing", anchor: "kan-ik-vandaag-veilig-zonnen", linkTekst: "Can I sunbathe safely today?" },
          { situatie: "It's cloudy, do I still need sunscreen", anchor: "verbrand-ik-bij-bewolkt-weer", linkTekst: "Can I burn in cloudy weather?" },
        ],
      },
      beslislogica: {
        kop: "What does sun and pollen advice depend on?",
        punten: [
          "The UV index is separate from temperature: a fresh May day can have a higher UV than a warm September one. Your skin doesn't feel UV.",
          "Clouds only partly block UV: through thin or broken clouds up to 80 percent of the radiation gets through.",
          "Time of day weighs heavily: between 11 am and 3 pm UV peaks; pollen peaks in the morning and early evening instead, especially grass pollen.",
          "Dry, windy weather spreads pollen hardest; rain washes the air clean. The pollen-quiet window after a shower is the moment to air the house or train.",
          "The season decides which pollen is active: trees (birch, alder) in early spring, grasses from May to July, herbs in late summer.",
        ],
      },
      situaties: {
        kop: "Common situations",
        items: [
          { naam: "Overcast June day, burnt anyway", tekst: "The classic: no sun to be seen, yet UV index 6. From index 3 you apply sunscreen when out for longer, even under a cloud deck." },
          { naam: "First warm week of spring", tekst: "The birch is in bloom exactly when everyone wants outside. Plan effort after a rain shower or in the evening, and keep windows shut by day on peak days." },
          { naam: "Sports afternoon in full sun", tekst: "Effort plus sweat washes sunscreen off faster: apply beforehand and again after an hour or two. Take shade breaks around midday." },
          { naam: "Out right after the rain", tekst: "Rain knocks pollen down: the hours straight after a good shower are often the most comfortable of the day for hay fever. Ideal for a run or airing the house." },
        ],
      },
      seizoen: {
        kop: "Sun and pollen by season in the Netherlands",
        items: [
          { naam: "Spring", tekst: "The underrated stretch: UV already climbs to 5 or 6 while the air feels fresh, and tree pollen (birch first) peaks. Double attention required." },
          { naam: "Summer", tekst: "UV at its highest (7 to 8 on cloudless days) and grass pollen deep into July. Sunscreen belongs to every long day outside." },
          { naam: "Autumn", tekst: "UV drops fast; only relevant around midday on clear days. Pollen barely plays a role, apart from some herbs in September." },
          { naam: "Winter", tekst: "UV is low, but snow reflects up to 80 percent of radiation: on winter sports you do apply sunscreen. In the Netherlands the alder sometimes starts blooming as early as January." },
        ],
      },
      faq: [
        { id: "verbrand-ik-bij-bewolkt-weer", v: "Can I burn in cloudy weather?", a: "Yes, easily: thin or broken clouds let up to 80 percent of UV radiation through, and temperature says nothing about UV strength. From a UV index of 3 you can burn when out for longer, even without seeing the sun. The UV check shows the index per hour for your location." },
        { id: "vanaf-welke-zonkracht-moet-ik-smeren", v: "From which UV index should I apply sunscreen?", a: "Rule of thumb: from UV index 3, apply when out for more than half an hour; from 6, also for short spells, and seek shade around midday; from 8, unprotected sunbathing is unwise. Fair skin burns within a quarter of an hour at index 7." },
        { id: "wanneer-zijn-pollen-het-ergst", v: "When is pollen worst during the day?", a: "Grass pollen usually peaks in the morning (as the dew dries) and again in the early evening when the air cools and pollen descends. Dry, warm, windy days are the hardest; after a rain shower the air is temporarily clean. The hay fever check shows the hourly course." },
        { id: "kan-ik-vandaag-veilig-zonnen", v: "Can I sunbathe safely today?", a: "Safe sunbathing is three things: knowing the UV of the moment (from index 6 the midday sun is fierce), applying factor 30 or higher beforehand and in between, and building up your time. The most pleasant and safest sun hours sit before 11 am and after 3 pm; the UV check shows the strength per hour." },
      ],
      gerelateerd: ["buiten", "kleding"],
    },
    winter: {
      voorWie: {
        kop: "Who is this page for?",
        regels: [
          "It's cold, and you don't want surprises tomorrow morning: a frozen windscreen while you're already late, or a bike path that turns out to be sheet ice.",
          "Frost and ice behave differently than you'd think: the most dangerous nights are often the clearest, and roads can be slippery while the thermometer sits above zero.",
        ],
      },
      keuzehulp: {
        kop: "Pick your winter question: what do you want to know?",
        keuzes: [
          { situatie: "Does the scraper go to the car tomorrow", anchor: "moet-ik-morgen-krabben", linkTekst: "Do I need to scrape tomorrow?" },
          { situatie: "You're about to bike or drive and doubt about ice", anchor: "is-het-glad-op-de-weg", linkTekst: "Are the roads icy?" },
          { situatie: "Out the door warm: coat, hat and gloves", toolId: "wat-trek-ik-aan" },
        ],
      },
      beslislogica: {
        kop: "What does winter slipperiness depend on?",
        punten: [
          "Clear, calm nights are the frost nights: without a cloud deck the ground radiates its warmth away and cools harder at the surface than at thermometer height.",
          "The road surface has its own temperature: after a cold spell the road can be below zero while the air already reads 2 or 3 degrees. Precipitation then freezes anyway.",
          "Moisture is the second condition: a dry frost night gives rime on the car but rarely an icy road; wet stretches and fog do.",
          "Bridges, viaducts and bike paths freeze first: they cool from two sides and carry less traffic.",
          "Freezing rain is the most dangerous form: rain on a frozen surface. Precisely during a thaw after a frost spell, when everything looks normal again.",
        ],
      },
      situaties: {
        kop: "Common situations",
        items: [
          { naam: "Clear evening after a mild day", tekst: "The classic scraping night: 8 degrees by day, but the cloudless night lets the ground drop below zero. The windscreen is white while officially it never froze." },
          { naam: "Freezing rain in the morning", tekst: "Rain on a frozen surface turns to sheet ice within minutes, for pedestrians too. With freezing-rain warnings: wait for the gritters and the first thaw if you can." },
          { naam: "First frost night of the season", tekst: "The first ice surprises everyone each year: tyres, brakes and your own reflexes are still set to summer. Budget extra travel time on the first frosty morning." },
          { naam: "Snow patches and shady spots", tekst: "After a thaw day everything seems gone, but in the shade of buildings and trees and on bridges it keeps freezing at the surface. That's exactly where you slip." },
        ],
      },
      seizoen: {
        kop: "Frost and ice by season in the Netherlands",
        items: [
          { naam: "Late autumn", tekst: "The first night frosts often appear in October or November after a clear night. Mostly ground frost: the windscreen is white, the road usually not yet slippery." },
          { naam: "Midwinter", tekst: "December to February is the real season: frost spells, snow and the freezing-rain risk during every thaw. The scrape-and-ice question becomes daily routine." },
          { naam: "Early spring", tekst: "Treacherous: mild afternoons, but clear March nights still freeze at the surface. The morning rush can be icy while the afternoon hits 15 degrees." },
          { naam: "The rest of the year", tekst: "From May to September frost plays no role. The winter checks stand by; the clothing check takes over." },
        ],
      },
      faq: [
        { id: "moet-ik-morgen-krabben", v: "Do I need to scrape tomorrow?", a: "Scraping is on after a clear, calm night with moisture in the air: the windscreen then cools below freezing, even if the official minimum stays just above zero (it freezes earlier at the surface). A car under a carport or against the house suffers far less. Cloudy or windy nights rarely give a frozen screen." },
        { id: "is-het-glad-op-de-weg", v: "Are the roads icy?", a: "Ice needs two things at once: a road surface around or below zero and moisture (a wet road, fog, or precipitation). Watch bridges, viaducts and bike paths, which freeze first, and freezing rain during a thaw after a frost spell. In doubt: set off calmly and do your first brake test somewhere safe." },
        { id: "waarom-is-het-glad-bij-plusgraden", v: "Why can it be icy above zero?", a: "The thermometer measures at chest height, but the road surface has its own temperature. After a cold night or frost spell the road can still be below zero while the air reads 2 or 3 degrees; precipitation or lifting fog then freezes on the surface anyway. This plays mainly in the early morning and on bridges." },
      ],
      gerelateerd: ["kleding", "sport"],
    },
  },
});

export function vindStorefront(categorieId) {
  return STOREFRONTS[categorieId] ?? null;
}
