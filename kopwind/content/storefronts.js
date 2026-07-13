/**
 * content/storefronts.js
 *
 * De rankbare content per categorie-storefront (v3.6.0 "Bora"). Elke
 * storefront is geen linklijst maar een antwoordpagina: beslislogica in
 * gewone taal, situaties per weertype, seizoenscontext en een FAQ die de
 * samengevoegde long-tail-vragen opvangt als anchors. Zo vangt de hub de
 * brede intentie zonder een concurrerende URL per variant te maken.
 *
 * Alleen de categorien die al een uitgewerkte storefront hebben staan
 * hier; de rest valt terug op de generieke overzichtsweergave.
 */

import { kies } from "../lib/i18n/locale.js";

export const STOREFRONTS = kies({
  nl: {
    regen: {
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
    },
  },
  en: {
    regen: {
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
    },
  },
});

export function vindStorefront(categorieId) {
  return STOREFRONTS[categorieId] ?? null;
}
