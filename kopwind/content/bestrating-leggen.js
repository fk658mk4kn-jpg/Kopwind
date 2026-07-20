/**
 * content/bestrating-leggen.js
 * SEO-content voor de bestratingcheck (v3.33.0 "Autan").
 */

export const seo = {
  title: "Kan ik bestrating leggen? Check het bestratingsweer",
  description:
    "Kun je vandaag tegels, klinkers of stapstenen leggen, of komt het weer ertussen? De check zoekt het beste droge blok en let op regen, temperatuur en nachtvorst. Gratis.",
  h1: "Kan ik bestrating leggen?",
  intro:
    "Zelf bestraten is dankbaar werk, maar het weer bepaalt of het resultaat blijft liggen. Je legt in een droog bed, en zeker bij voegmortel of het inspoelen van voegzand mag het tijdens en kort erna niet regenen. Werk je met mortel of stabilisatie, dan is nachtvorst schadelijk. Deze check zoekt het beste, droogste blok van de dag en let op regen kort na het blok en op vorst in de nacht erna.",
};

export const blokken = [
  {
    kop: "Droog tijdens en droog erna",
    tekst:
      "Bestraten begint met een droge, stabiele ondergrond. Regen tijdens het leggen maakt van je zandbed een modderbad, en dat werkt niet. De check zet de score bij regen daarom op nul. Belangrijker nog is wat er na het leggen gebeurt: leg je in split, stabilisatie of voegmortel, dan spoelt een bui kort erna het bindmiddel of het voegzand zo weer uit. De check kijkt daarom niet alleen naar het blok zelf, maar ook naar de uren erna. Leg je los in zand, zoals bij een tijdelijk pad, dan is regen erna minder erg; geef je methode aan, dan weegt de check dat mee. Dezelfde droge-blok-logica gebruikt de [check voor buiten schilderen](tool:buiten-schilderen).",
  },
  {
    kop: "Temperatuur en nachtvorst",
    tekst:
      "Voegmortel en stabilisatiezand binden traag als het koud is, en nachtvorst kan een verse voeg of een net gelegde stabilisatielaag beschadigen voordat die is uitgehard. De check let daarom op de gevoelstemperatuur overdag en waarschuwt voor vorst in de nacht na een mortel- of stabilisatieklus. Leg je puur los in zand, dan speelt vorst nauwelijks een rol en telt vooral of het droog is. Stel je ondergrens in, dan schuift de check mee met hoe koud jij nog wilt werken.",
  },
  {
    kop: "Wind en werkplezier",
    tekst:
      "Harde wind is geen ramp, maar blaast wel je droge voegzand weg voordat het tussen de stenen zit, en maakt fijn zand-en-cementwerk lastig. De check verlaagt de score bij stevige wind licht. Verder is bestraten vooral een kwestie van een lange, droge dag: een trilplaat om de ondergrond te verdichten, een rubberen hamer en een waterpas om alles vlak te houden, en genoeg tijd. De check geeft je het beste blok; plan de klus zo dat je binnen dat droge venster klaar bent met het kwetsbare deel.",
  },
];

export const faq = [
  {
    v: "Mag je bestrating leggen als het regent?",
    a: "Tijdens het leggen liever niet: een nat zandbed wordt modder en dat legt niet vlak. De check zet de score bij regen op nul. Nog belangrijker is de regen kort na het leggen als je met split, stabilisatie of voegmortel werkt, want dan spoelt het bindmiddel of voegzand uit. Leg je los in zand, dan is een bui erna minder erg.",
  },
  {
    v: "Kan ik bestraten bij vorst?",
    a: "Puur los in zand kan meestal wel, mits het droog is. Werk je met voegmortel of stabilisatie, dan is vorst schadelijk: de mortel bindt traag in de kou en nachtvorst kan een verse voeg of laag beschadigen. De check waarschuwt voor nachtvorst na zo'n klus. Wacht in dat geval op een vorstvrije periode.",
  },
  {
    v: "Bij welke temperatuur kan ik voegen?",
    a: "Voor voegmortel en stabilisatiezand wordt vaak vijf graden als ondergrens aangehouden, en het mag ook in de nacht erna niet vriezen tot het is uitgehard. Bij lagere temperaturen bindt het traag en onbetrouwbaar. Stel in de check in vanaf welke temperatuur jij werkt, dan schuift het advies mee.",
  },
  {
    v: "Hoelang moet het droog blijven na het voegen?",
    a: "Als vuistregel wil je na het inspoelen van voegzand of het aanbrengen van voegmortel enkele uren droog weer, zodat het kan zetten voordat er regen op komt. De check kijkt daarom naar de uren na het beste blok en waarschuwt als daar een bui in zit. Volg voor voegmortel altijd ook de aanwijzing op de verpakking.",
  },
];
