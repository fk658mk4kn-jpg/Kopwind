/**
 * content/storefronts.js
 *
 * De rankbare content per categorie-storefront, volgens het vaste
 * bouwblok-format (PLAYBOOK sectie 11, v3.9.0). Elke storefront is
 * configuratie, geen maatwerkpagina. Optionele blokken per categorie:
 *
 * - voorWie:    { kop, regels[] }               (blok 2)
 * - keuzehulp:  { kop, intro?, keuzes[] }       (blok 3); elke keuze is
 *               { situatie, toolId } (live check) of
 *               { situatie, anchor, linkTekst } (FAQ-anker op deze pagina,
 *               voor vragen zonder eigen tool: zo vangt de hub de
 *               long-tail zonder concurrerende URL per variant)
 * - beslislogica, situaties, seizoen            (blok 4, uitleg)
 * - faq:        [{ id, v, a }]                  (blok 6, id = anker)
 * - gerelateerd: [categorieId]                  (blok 7, 2-3 stuks)
 *
 * Alleen de categorien die al een uitgewerkte storefront hebben staan
 * hier; de rest valt terug op de generieke overzichtsweergave.
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
    "huis-tuin": {
      voorWie: {
        kop: "Voor wie is deze pagina?",
        regels: [
          "Je hebt een vrij dagdeel en wilt dat besteden aan de was, de auto, de tuin of een klus, zonder dat een bui of felle zon het werk verpest.",
          "Bijna elke klus buiten hangt aan dezelfde drie dingen: een droog venster dat lang genoeg is, de wind, en wat de zon doet. Deze pagina helpt je kiezen wat vandaag wel kan en wat je beter naar morgen schuift.",
        ],
      },
      keuzehulp: {
        kop: "Klusje kiezen: wat wil je vandaag doen?",
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
        kop: "Klussen rond het huis per seizoen",
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
          { naam: "Autumn", tekst: "More wind, more prolonged rain and more often the feeling of getting wet despite a short distance." },
          { naam: "Winter", tekst: "Not only rain counts, but also wet-cold, drizzle and later possibly icy roads. See the winter checks too." },
        ],
      },
      faq: [
        { id: "ga-ik-nat-vandaag", v: "Will I get wet today?", a: "That depends mainly on when the rain falls, how long you're out and whether it's a short shower or prolonged rain. Use the check at the top for the direct answer for your location." },
        { id: "moet-ik-een-regenjas-aan", v: "Do I need a raincoat?", a: "A raincoat is smart mainly when the rain chance coincides with the time you're out, or when prolonged drizzle is expected. For pure clothing advice see the clothing checks." },
        { id: "gaat-het-vanavond-regenen", v: "Will it rain tonight?", a: "For evening questions, timing matters more than the daily average. Use the hourly outlook on the rain-timing page to see whether the evening stays dry." },
        { id: "gaat-het-morgen-regenen", v: "Will it rain tomorrow?", a: "Tomorrow questions share the same intent, just a different time window. The date picker in the check lets you look ahead without opening another page." },
        { id: "gaat-het-regenen-deze-week", v: "Will it rain this week?", a: "For the week the check shows a compact trend per day. Handy for planning, though a forecast further ahead stays less certain than today's." },
        { id: "hoe-lang-blijft-het-droog", v: "How long will it stay dry?", a: "Check the next rain moment on the rain-timing page: the gap between now and that time is your dry window." },
      ],
      gerelateerd: ["huis-tuin", "kleding"],
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
        kop: "Pick your job: what do you want to do today?",
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
        kop: "Jobs around the house by season",
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
  },
});

export function vindStorefront(categorieId) {
  return STOREFRONTS[categorieId] ?? null;
}
