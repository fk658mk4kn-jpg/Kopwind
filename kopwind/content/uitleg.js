/**
 * content/uitleg.js
 *
 * Het uitleg-cluster (Zephyr item 5): het weer in gewone taal. Korte
 * artikelen die uitleggen waarom de checks zeggen wat ze zeggen. Goed
 * voor de lezer en voor topical authority: elke check linkt naar de
 * uitleg die zijn cijfer draagt, en andersom.
 */

export const UITLEG = [
  {
    slug: "gevoelstemperatuur",
    vraag: "Waarom voelt het kouder dan de thermometer zegt?",
    titel: "Gevoelstemperatuur: waarom 12 graden soms als 7 voelt",
    intro:
      "Je jas kies je niet op de thermometer maar op je huid. En je huid rekent wind en vocht mee. Dat verschil heet gevoelstemperatuur, en het is de reden dat onze checks er standaard mee rekenen.",
    blokken: [
      {
        kop: "Wind steelt warmte",
        tekst:
          "Je lichaam warmt een dun laagje lucht om je heen op. Wind blaast dat laagje steeds weg, dus je verliest sneller warmte en het voelt kouder. Bij 12 graden en windkracht 5 voelt het al snel als een graad of 7. Daarom telt de kledingcheck wind vol mee: je kleedt je op wat je voelt, niet op wat een meetstation twee meter boven een grasveld meet.",
      },
      {
        kop: "Vocht doet er ook toe",
        tekst:
          "Klamme lucht voert warmte beter af dan droge lucht en zweet verdampt er slechter in. Een vochtige dag van 8 graden bijt daardoor meer dan een droge. Andersom maakt zon op je jas het gevoel juist milder dan de thermometer belooft.",
      },
      {
        kop: "Wat wij ermee doen",
        tekst:
          "Alle checks van Kan het vandaag? rekenen met de gevoelstemperatuur per uur uit de uurvoorspelling. De kledingcheck vertaalt die naar laagjes over de dag heen, de terrascheck bepaalt er de lekkerste uren mee en de fietscheck weegt de kou op je handen mee in het cijfer.",
      },
    ],
    gerelateerdeToolSlug: "wat-trek-ik-aan",
  },
  {
    slug: "zo-droogt-je-was",
    vraag: "Hoe droogt een was eigenlijk?",
    titel: "Zo droogt je was: vocht, wind, warmte en een beetje zon",
    intro:
      "Buiten drogen is gratis en je kleding blijft er langer mooi door. Maar de ene droge dag is de andere niet: soms hangt de was in twee uur droog en soms is hij om acht uur 's avonds nog klam. Dit is waarom.",
    blokken: [
      {
        kop: "Droge lucht is de motor",
        tekst:
          "Water verdampt alleen als de lucht het kan opnemen. Hoe lager de luchtvochtigheid, hoe sneller het gaat. Een frisse dag met droge lucht droogt beter dan een broeierige zomerdag van 24 graden met klamme lucht. Daarom kijkt de wascheck eerst naar de luchtvochtigheid per uur.",
      },
      {
        kop: "Wind en warmte helpen, zon geeft de bonus",
        tekst:
          "Wind blaast de vochtige lucht rond je was steeds weg, zodat er droge lucht voor in de plaats komt. Warmte laat water sneller verdampen, en zon op de lijn scheelt nog een schepje. Warm, luchtig, droog en zonnig is de jackpot: dan is een gemiddelde was in een uur of twee droog.",
      },
      {
        kop: "Waarom het cijfer en de klok twee dingen zijn",
        tekst:
          "Prima droogweer om half zeven 's avonds blijft prima droogweer, alleen red je het niet meer voor het donker. Daarom geeft de wascheck twee dingen: een cijfer voor hoe goed het droogweer is, en een aparte statusregel die zegt of je het nu nog redt, hoe lang drogen duurt en wanneer je beter kunt ophangen.",
      },
    ],
    gerelateerdeToolSlug: "was-buiten-drogen",
  },
  {
    slug: "wind-en-fietsen",
    vraag: "Waarom telt wind tegen zwaarder dan wind mee?",
    titel: "Wind en fietsen: waarom tegenwind meer kost dan meewind oplevert",
    intro:
      "Iedereen die naar werk fietst kent het: heen vlieg je, terug sta je stil. Dat is geen gevoel, dat is natuurkunde. En het is de reden dat de fietscheck je route in stukken knipt.",
    blokken: [
      {
        kop: "Luchtweerstand groeit kwadratisch",
        tekst:
          "De kracht die je van wind voelt groeit met het kwadraat van de snelheid van de lucht die je raakt. Fiets je 18 km/u tegen 18 km/u wind in, dan voelt je lijf 36 km/u aan lucht: vier keer zoveel weerstand als bij windstil. Dezelfde wind in de rug duwt maar een fractie daarvan mee, want je rijdt er zelf al bijna net zo hard als de wind.",
      },
      {
        kop: "Windstoten zijn de spelbreker",
        tekst:
          "Een gemiddelde wind van 25 km/u is te doen, maar stoten van 55 duwen je van je lijn, zeker op een brug of open stuk. Daarom weegt de fietscheck windstoten apart mee en zie je in de windstrip per stuk route of je tegen, zij- of meewind hebt.",
      },
      {
        kop: "Wat je eraan hebt",
        tekst:
          "De check rekent per stuk route de hoek tussen jouw rijrichting en de windrichting uit. Zo zie je niet alleen een cijfer, maar ook waar op de route de wind zit en of een alternatieve route langs de luwte slimmer is. Tegenwind op de heenweg met meewind terug plant anders dan andersom.",
      },
    ],
    gerelateerdeToolSlug: "fietsen-naar-werk",
  },
  {
    slug: "buienkans",
    vraag: "Wat betekent 60% kans op regen?",
    titel: "Buienkans: wat 60% kans op regen echt betekent",
    intro:
      "60% kans op regen betekent niet dat het 60% van de dag regent, en ook niet dat 60% van jouw stad nat wordt. Het betekent iets preciezers, en als je dat weet lees je elke weersverwachting beter.",
    blokken: [
      {
        kop: "Kans per uur, op jouw plek",
        tekst:
          "De uurvoorspelling geeft per uur de kans dat er in dat uur meetbare neerslag valt op die plek. 60% om 15:00 betekent: in zes van de tien keer dat het model deze situatie ziet, valt er dat uur regen. Het zegt niks over hoe hard of hoe lang. Een minuut motregen telt net zo goed als een wolkbreuk.",
      },
      {
        kop: "Waarom checks een grens trekken",
        tekst:
          "Voor een beslissing heb je niks aan een percentage; je wilt weten of het uur bruikbaar is. Daarom hanteren onze checks een grens: boven een instelbare buienkans telt een uur niet meer mee als droog. Voor de was ligt die grens standaard bij 55%, want een natte bui op een bijna droge was is dubbel zonde.",
      },
      {
        kop: "Timing verslaat gemiddelden",
        tekst:
          "Een dag met 80% buienkans kan prima drie droge uren hebben, en die drie uren zijn precies wat je zoekt. Daarom kijken de checks per uur en tonen ze het beste blok, in plaats van een dagkans die je alleen maar somber maakt.",
      },
    ],
    gerelateerdeToolSlug: "was-buiten-drogen",
  },
];

export function vindArtikel(slug) {
  return UITLEG.find((a) => a.slug === slug) ?? null;
}
