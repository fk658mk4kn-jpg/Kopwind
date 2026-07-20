/**
 * lib/steden/stadTemplates.js
 *
 * Alle per-stad SEO-teksten op een centrale plek (v3.23.0 "Boreas").
 * Aanleiding: STAD_TEMPLATES leefde in app/[tool]/[stad]/page.js en
 * dekte 7 van de 24 tools; de fallback pakte letterlijk het
 * was-drogen-template, waardoor ~200 stadpagina's (hardloopweer,
 * strand, heel batch 3, winter) de title, description EN h1 van de
 * wascheck droegen. Nu:
 *
 * - STAD_TEMPLATES dekt alle 24 tools, tweetalig, met een eigen
 *   title/description/h1-formule per tool.
 * - titelVoor() heeft een GENERIEK vangnet dat uit de tool zelf put
 *   (navLabel, korteVraag) en dus nooit meer andermans tekst leent.
 *   Een test (tests/stad-templates.test.js) dwingt af dat het vangnet
 *   in de praktijk ongebruikt blijft.
 * - ANKER_TERM levert de korte zoekterm-kern per tool ("Terrasweer",
 *   "Hooikoorts") voor de stedenknoppen op de toolpagina: ankertekst
 *   wordt "{term} {stad}", wat sterker is dan alleen de stadsnaam en
 *   natuurlijker dan de volledige vraagzin twaalf keer herhaald.
 *
 * De RUW-varianten ({nl, en}) staan er zodat de test beide talen kan
 * valideren zonder subprocess; de gebakken exports gaan door kies().
 */

import { kies } from "../i18n/locale.js";

export const STAD_TEMPLATES_RUW = {
  nl: {
    "fiets-naar-werk": (s) => ({
      title: `Fietsen naar werk in ${s}: wind en fietsweer vandaag`,
      description: `Kan ik vandaag fietsen naar werk in ${s}? Check je rit: wind tegen per deel van de route, regen, temperatuur en een duidelijk oordeel. Gratis.`,
      h1: `Vandaag op de fiets naar werk in ${s}?`,
    }),
    "was-buiten-drogen": (s) => ({
      title: `Was buiten drogen in ${s}: droogvenster vandaag`,
      description: `Kan de was vandaag buiten in ${s}? Zie per uur wanneer je was goed droogt: luchtvochtigheid, wind en regen, met droogtijd. Gratis.`,
      h1: `Vandaag de was buiten in ${s}?`,
    }),
    "wat-trek-ik-aan": (s) => ({
      title: `Wat trek ik vandaag aan in ${s}? Kledingadvies op gevoel`,
      description: `Wat trek ik vandaag aan in ${s}? Praktisch kledingadvies op gevoelstemperatuur: laagjes, regenkleding en het verloop van de dag. Gratis.`,
      h1: `Wat trek ik vandaag aan in ${s}?`,
    }),
    "terras": (s) => ({
      title: `Terrasweer in ${s}: de beste terrasuren vandaag`,
      description: `Kan ik vandaag op het terras in ${s}? Zie de beste terrasuren: gevoelstemperatuur, wind en zon per uur, vijf dagen vooruit. Gratis.`,
      h1: `Vandaag op het terras in ${s}?`,
    }),
    "hooikoorts": (s) => ({
      title: `Hooikoorts in ${s}: pollen vandaag per uur`,
      description: `Krijg ik vandaag hooikoorts in ${s}? Zie gras-, berk- en elspollen per uur en het rustigste blok van de dag. Gratis.`,
      h1: `Hooikoorts vandaag in ${s}?`,
    }),
    "zonkracht": (s) => ({
      title: `Zonkracht in ${s}: verbrand ik vandaag?`,
      description: `Moet ik vandaag smeren in ${s}? Zie de zonkracht per uur, het smeervenster en hoe snel jouw huidtype verbrandt. Gratis.`,
      h1: `Verbrand ik vandaag in ${s}?`,
    }),
    "barbecue": (s) => ({
      title: `Barbecueweer in ${s}: het beste avondblok vandaag`,
      description: `Kan ik vandaag barbecue\u00ebn in ${s}? Zie het beste avondblok, of het droog blijft en waar de rook heen trekt. Gratis.`,
      h1: `Vandaag barbecue\u00ebn in ${s}?`,
    }),
    "hardloopweer": (s) => ({
      title: `Hardloopweer in ${s}: het beste loopblok vandaag`,
      description: `Is het hardloopweer in ${s} vandaag? Zie per uur het beste loopblok op gevoelstemperatuur, wind en regen, vijf dagen vooruit. Gratis.`,
      h1: `Hardlopen in ${s} vandaag?`,
    }),
    "wandelen": (s) => ({
      title: `Wandelweer in ${s}: het beste wandelblok vandaag`,
      description: `Kan ik wandelen in ${s} vandaag? Zie de droogste, prettigste uren op gevoelstemperatuur, wind en buien, vijf dagen vooruit. Gratis.`,
      h1: `Wandelen in ${s} vandaag?`,
    }),
    "buiten-sporten": (s) => ({
      title: `Buiten sporten in ${s}: het beste trainingsblok vandaag`,
      description: `Kan ik buiten sporten in ${s} vandaag? Zie het beste blok voor je training: warmte, wind en buien per uur. Gratis.`,
      h1: `Buiten sporten in ${s} vandaag?`,
    }),
    "padel-of-tennis": (s) => ({
      title: `Padel of tennis in ${s}: kan de baan vandaag?`,
      description: `Kan ik padellen of tennissen in ${s} vandaag? Zie of de baan droog en bespeelbaar is en welk blok het lekkerst speelt. Gratis.`,
      h1: `Padel of tennis in ${s} vandaag?`,
    }),
    "auto-wassen": (s) => ({
      title: `Auto wassen in ${s}: het beste wasmoment vandaag`,
      description: `Kan ik de auto wassen in ${s} vandaag? Zie of het droog blijft, of de zon strepen trekt en wat het beste wasmoment is. Gratis.`,
      h1: `Auto wassen in ${s} vandaag?`,
    }),
    "grasmaaien": (s) => ({
      title: `Grasmaaien in ${s}: droog gras vandaag?`,
      description: `Kan ik grasmaaien in ${s} vandaag? Zie wanneer het gras droog is na dauw of regen en wat het beste maaimoment is. Gratis.`,
      h1: `Grasmaaien in ${s} vandaag?`,
    }),
    "ramen-wassen": (s) => ({
      title: `Ramen wassen in ${s}: strepenvrij vandaag?`,
      description: `Kan ik ramen wassen in ${s} vandaag? Zie of het droog blijft en wanneer zon en vorst geen strepen of problemen geven. Gratis.`,
      h1: `Ramen wassen in ${s} vandaag?`,
    }),
    "zonnepanelen": (s) => ({
      title: `Zonnepanelen in ${s}: de opbrengst vandaag`,
      description: `Leveren zonnepanelen in ${s} vandaag veel op? Zie het zonnigste blok van de dag en plan je wasmachine op de zonuren. Gratis.`,
      h1: `Wat leveren de panelen in ${s} vandaag?`,
    }),
    "strandweer": (s) => ({
      title: `Strandweer in ${s}: de beste stranduren vandaag`,
      description: `Is het strandweer in ${s} vandaag? Zie de beste stranduren, de wind op het zand en de zonkracht, vijf dagen vooruit. Gratis.`,
      h1: `Strandweer in ${s} vandaag?`,
    }),
    "picknickweer": (s) => ({
      title: `Picknickweer in ${s}: het beste blok vandaag`,
      description: `Kan ik picknicken in ${s} vandaag? Zie droog gras, zon en weinig wind per uur, en het beste picknickblok van de dag. Gratis.`,
      h1: `Picknicken in ${s} vandaag?`,
    }),
    "buiten-zwemmen": (s) => ({
      title: `Zwemweer in ${s}: kan ik buiten zwemmen vandaag?`,
      description: `Kan ik buiten zwemmen in ${s} vandaag? Zie het beste zwemblok, de wind en of de zon je droogt als je eruit komt. Gratis.`,
      h1: `Buiten zwemmen in ${s} vandaag?`,
    }),
    "suppen-of-kajakken": (s) => ({
      title: `Suppen of kajakken in ${s}: vlak water vandaag?`,
      description: `Kan ik suppen of kajakken in ${s} vandaag? Zie per uur wanneer de wind het laagst is en het water het vlakst ligt. Gratis.`,
      h1: `Suppen of kajakken in ${s} vandaag?`,
    }),
    "sterrenkijken": (s) => ({
      title: `Sterren kijken in ${s}: heldere nacht vandaag?`,
      description: `Kan ik sterren kijken in ${s} vannacht? Zie bewolking, maanfase en het helderste blok van de avond. Gratis.`,
      h1: `Sterren kijken in ${s} vannacht?`,
    }),
    "regen-timing": (s) => ({
      title: `Wanneer gaat het regenen in ${s}?`,
      description: `Wanneer gaat het regenen in ${s}? Zie op de minuut wanneer de bui valt, wanneer het droog wordt en welke uren veilig zijn. Gratis.`,
      h1: `Wanneer gaat het regenen in ${s}?`,
    }),
    "paraplu": (s) => ({
      title: `Paraplu mee in ${s} vandaag?`,
      description: `Moet ik een paraplu mee in ${s} vandaag? Zie of er buien vallen op jouw momenten buiten en of een regenjas slimmer is. Gratis.`,
      h1: `Paraplu mee in ${s} vandaag?`,
    }),
    "krabben": (s) => ({
      title: `Ruiten krabben in ${s}: bevriest de auto vannacht?`,
      description: `Moet ik morgen krabben in ${s}? Zie of de autoruit vannacht bevriest, zodat je die vijf minuten extra kunt inplannen. Gratis.`,
      h1: `Krabben in ${s} morgenvroeg?`,
    }),
    "golfen": (s) => ({
      title: `Golfen in ${s}: is het golfweer vandaag?`,
      description: `Kan ik vandaag golfen in ${s}? Wind, regen en het beste blok voor een ronde. Gratis.`,
      h1: `Golfen in ${s} vandaag?`,
    }),
    "skeeleren": (s) => ({
      title: `Skeeleren in ${s}: droog wegdek vandaag?`,
      description: `Kan ik vandaag skeeleren in ${s}? Streng op nat wegdek, met het beste droge blok. Gratis.`,
      h1: `Skeeleren in ${s} vandaag?`,
    }),
    "motorrijden": (s) => ({
      title: `Motorrijden in ${s}: is het motorweer vandaag?`,
      description: `Kan ik vandaag motorrijden in ${s}? Nat wegdek, windstoten en kou op snelheid gewogen. Gratis.`,
      h1: `Motorrijden in ${s} vandaag?`,
    }),
    "hond-uitlaten": (s) => ({
      title: `Hond uitlaten in ${s}: het beste moment vandaag`,
      description: `Wanneer laat ik de hond uit in ${s}? Het comfortabelste blok, met een harde grens op heet asfalt. Gratis.`,
      h1: `De hond uitlaten in ${s}: wanneer vandaag?`,
    }),
    "vliegeren": (s) => ({
      title: `Vliegeren in ${s}: is er vliegerwind vandaag?`,
      description: `Kan ik vandaag vliegeren in ${s}? De check zoekt de beste windband en waarschuwt voor vlagen. Gratis.`,
      h1: `Vliegeren in ${s} vandaag?`,
    }),
    "vuurkorf": (s) => ({
      title: `Vuurkorf in ${s}: kan hij aan vanavond?`,
      description: `Kan de vuurkorf aan in ${s}? Vonken bij wind, hangende rook bij windstil: de check weegt beide. Gratis.`,
      h1: `De vuurkorf aan in ${s} vanavond?`,
    }),
    "drone-vliegen": (s) => ({
      title: `Drone vliegen in ${s}: is het droneweer vandaag?`,
      description: `Kan ik vandaag met de drone vliegen in ${s}? Wind onder de dronegrens, droog en daglicht. Gratis.`,
      h1: `Drone vliegen in ${s} vandaag?`,
    }),
    "paardrijden": (s) => ({
      title: `Paardrijden in ${s}: is het buitenrijweer vandaag?`,
      description: `Kan ik vandaag buiten paardrijden in ${s}? Wind maakt paarden schrikkerig, vorst de bodem hard. Gratis.`,
      h1: `Buiten paardrijden in ${s} vandaag?`,
    }),
    "vissen": (s) => ({
      title: `Vissen in ${s}: is het visweer vandaag?`,
      description: `Is het goed visweer in ${s}? De enige check met het drukverloop, plus licht en wind. Gratis.`,
      h1: `Visweer in ${s} vandaag?`,
    }),
    "schaatsen": (s) => ({
      title: `Natuurijs in ${s}: komt er schaatsweer aan?`,
      description: `Komt er natuurijs aan in ${s}? De vorstsom van de komende dagen, eerlijk gewogen. Gratis.`,
      h1: `Komt er natuurijs aan in ${s}?`,
    }),
    "mist": (s) => ({
      title: `Mist in ${s}: hoe is het zicht vanochtend?`,
      description: `Is het mistig in ${s}? Het zicht in jouw spits, met het uur waarop de mist optrekt. Gratis.`,
      h1: `Mist in ${s} vandaag?`,
    }),
    "storm": (s) => ({
      title: `Storm in ${s}: moet ik spullen vastzetten?`,
      description: `Moet ik spullen vastzetten in ${s}? De piek van de windstoten, vertaald naar acties. Gratis.`,
      h1: `Storm op komst in ${s}?`,
    }),
    "houtkachel": (s) => ({
      title: `Houtkachel in ${s}: is het stookweer vanavond?`,
      description: `Kan de houtkachel aan in ${s}? Bij windstil vochtig weer blijft de rook hangen: de check weegt het. Gratis.`,
      h1: `De houtkachel aan in ${s} vanavond?`,
    }),
    "huis-koelen": (s) => ({
      title: `Huis koel houden in ${s}: het koelplan voor vandaag`,
      description: `Hoe houd ik het huis koel in ${s}? Wanneer ramen open en dicht, met het spui-venster per dag. Gratis.`,
      h1: `Het huis koel houden in ${s} vandaag?`,
    }),
    "kamperen": (s) => ({
      title: `Kamperen bij ${s}: is het tentweer vannacht?`,
      description: `Is het kampeerweer bij ${s}? De nacht beoordeeld: kou, regen en windstoten op de tent. Gratis.`,
      h1: `Kamperen bij ${s} vannacht?`,
    }),
    "buiten-schilderen": (s) => ({
      title: `Buiten schilderen in ${s}: kan het vandaag?`,
      description: `Kan ik vandaag buiten schilderen in ${s}? De check zoekt een droog blok met de juiste temperatuur en houdt de uren erna in de gaten. Gratis.`,
      h1: `Buiten schilderen in ${s} vandaag?`,
    }),
    "hout-behandelen": (s) => ({
      title: `Hout behandelen in ${s}: beitsen of olien vandaag?`,
      description: `Kan ik vandaag beitsen of olien in ${s}? Het hout moet droog zijn en droog blijven: de check beoordeelt het klusweer. Gratis.`,
      h1: `Hout behandelen in ${s} vandaag?`,
    }),
    "terras-reinigen": (s) => ({
      title: `Terras reinigen in ${s}: kan het vandaag?`,
      description: `Kan ik vandaag het terras of de oprit reinigen in ${s}? Mild en niet vriezend is ideaal: de check kiest het beste moment. Gratis.`,
      h1: `Terras reinigen in ${s} vandaag?`,
    }),
    "planten-beschermen": (s) => ({
      title: `Planten beschermen in ${s}: vorst vannacht?`,
      description: `Moet ik mijn planten vannacht beschermen in ${s}? De nacht beoordeeld op vorst, inclusief stralingsvorst. Gratis.`,
      h1: `Planten beschermen in ${s} vannacht?`,
    }),
    "sneeuwpret": (s) => ({
      title: `Sneeuwpret in ${s}: kan er gesleed worden?`,
      description: `Is er vandaag sneeuwpret in ${s}? De check kijkt naar het sneeuwdek en of het blijft liggen. Gratis.`,
      h1: `Sneeuwpret in ${s} vandaag?`,
    }),
    "strooien": (s) => ({
      title: `Strooien in ${s}: moet het vannacht?`,
      description: `Moet ik vannacht strooien of ruimen in ${s}? De nacht beoordeeld op aanvriezende tegels en verse sneeuw. Gratis.`,
      h1: `Strooien in ${s} vannacht?`,
    }),
    "beton-storten": (s) => ({
      title: `Beton storten in ${s}: kan het vandaag?`,
      description: `Kan ik vandaag beton storten in ${s}? De check kijkt naar storttemperatuur, nachtvorst, regen en uitdroging. Gratis.`,
      h1: `Beton storten in ${s} vandaag?`,
    }),
    "dak-op": (s) => ({
      title: `Het dak op in ${s}: is het veilig?`,
      description: `Kan ik vandaag veilig het dak op in ${s}? De check zoekt het rustigste, droogste blok en let op wind en gladheid. Gratis.`,
      h1: `Veilig het dak op in ${s} vandaag?`,
    }),
    "zwembad-opzetten": (s) => ({
      title: `Zwembad opzetten in ${s}: is het warm genoeg?`,
      description: `Kan ik het zwembad opzetten in ${s}? De check zoekt het warmste, zonnigste blok en let op koude wind. Gratis.`,
      h1: `Zwembad opzetten in ${s} vandaag?`,
    }),
    "muggen": (s) => ({
      title: `Muggenweer in ${s}: veel muggen vanavond?`,
      description: `Is het muggenweer vanavond in ${s}? De check schat de muggenactiviteit op basis van warmte, vocht en wind. Gratis.`,
      h1: `Muggenweer in ${s} vanavond?`,
    }),
    "onkruid": (s) => ({
      title: `Onkruid wieden of schoffelen in ${s}: wat kan vandaag?`,
      description: `Kan ik vandaag onkruid aanpakken in ${s}? Schoffelen wil droog en zon, wieden vochtige grond: de check kiest de methode. Gratis.`,
      h1: `Onkruid aanpakken in ${s} vandaag?`,
    }),
    "water-geven": (s) => ({
      title: `Water geven in ${s}: moet het vandaag?`,
      description: `Moet ik de planten water geven in ${s}? Regen op komst, hitte en wind gewogen, met het beste gietmoment. Gratis.`,
      h1: `Water geven in ${s} vandaag?`,
    }),
    "gras-zaaien": (s) => ({
      title: `Gras zaaien in ${s}: is het zaaiweer vandaag?`,
      description: `Kan ik vandaag gras zaaien in ${s}? Bodemwarmte, regen vooruit en het zaaiseizoen gewogen. Gratis.`,
      h1: `Gras zaaien in ${s} vandaag?`,
    }),
    "snoeien": (s) => ({
      title: `Snoeien in ${s}: kan het vandaag?`,
      description: `Kan ik vandaag snoeien in ${s}? Vorst, nat en hitte gewogen, met het snoeiseizoen van de maand erbij. Gratis.`,
      h1: `Snoeien in ${s} vandaag?`,
    }),
    "wielrennen": (s) => ({
      title: `Wielrenweer in ${s}: het beste rijblok vandaag`,
      description: `Is het wielrenweer in ${s} vandaag? Zie het beste droge blok met hanteerbare wind voor een rit op de racefiets. Gratis.`,
      h1: `Wielrennen in ${s} vandaag?`,
    }),
    "gladheid": (s) => ({
      title: `Gladheid in ${s}: is het glad vandaag?`,
      description: `Is het glad in ${s} vandaag of vannacht? Zie het gladheidsrisico per ochtend, ook voor bruggen en fietspaden. Gratis.`,
      h1: `Gladheid in ${s} vandaag?`,
    }),
  },
  en: {
    "fiets-naar-werk": (s) => ({
      title: `Bike to work in ${s}: wind and cycling weather today`,
      description: `Can I bike to work in ${s} today? Check your ride: headwind per part of the route, rain, temperature and a clear verdict. Free.`,
      h1: `Bike to work in ${s} today?`,
    }),
    "was-buiten-drogen": (s) => ({
      title: `Dry laundry outside in ${s}: today's drying window`,
      description: `Can I dry laundry outside in ${s} today? See per hour when your wash dries: humidity, wind and rain, with drying time. Free.`,
      h1: `Dry the laundry outside in ${s} today?`,
    }),
    "wat-trek-ik-aan": (s) => ({
      title: `What to wear today in ${s}? Outfit advice on feels-like`,
      description: `What should I wear today in ${s}? Practical outfit advice on feels-like temperature: layers, rain gear and the day's swing. Free.`,
      h1: `What to wear in ${s} today?`,
    }),
    "terras": (s) => ({
      title: `Patio weather in ${s}: the best outdoor hours today`,
      description: `Can I sit outside in ${s} today? See the best patio hours: feels-like temperature, wind and sun per hour, five days ahead. Free.`,
      h1: `Sit outside in ${s} today?`,
    }),
    "hooikoorts": (s) => ({
      title: `Hay fever in ${s}: today's pollen per hour`,
      description: `Will I get hay fever in ${s} today? See grass, birch and alder pollen per hour and the calmest window of the day. Free.`,
      h1: `Hay fever in ${s} today?`,
    }),
    "zonkracht": (s) => ({
      title: `UV index in ${s}: will I burn today?`,
      description: `Do I need sunscreen in ${s} today? See the UV per hour, the sunscreen window and how fast your skin type burns. Free.`,
      h1: `Will I burn in ${s} today?`,
    }),
    "barbecue": (s) => ({
      title: `BBQ weather in ${s}: the best evening window today`,
      description: `Can I barbecue in ${s} today? See the best evening window, whether it stays dry and where the smoke will drift. Free.`,
      h1: `Barbecue in ${s} today?`,
    }),
    "hardloopweer": (s) => ({
      title: `Running weather in ${s}: the best running window today`,
      description: `Is it running weather in ${s} today? See the best window per hour on feels-like, wind and rain, five days ahead. Free.`,
      h1: `Running in ${s} today?`,
    }),
    "wandelen": (s) => ({
      title: `Walking weather in ${s}: the best walking window today`,
      description: `Can I go for a walk in ${s} today? See the driest, most pleasant hours on feels-like, wind and showers, five days ahead. Free.`,
      h1: `Walking in ${s} today?`,
    }),
    "buiten-sporten": (s) => ({
      title: `Outdoor training in ${s}: the best workout window today`,
      description: `Can I train outside in ${s} today? See the best window for your workout: heat, wind and showers per hour. Free.`,
      h1: `Training outside in ${s} today?`,
    }),
    "padel-of-tennis": (s) => ({
      title: `Padel or tennis in ${s}: is the court playable today?`,
      description: `Can I play padel or tennis in ${s} today? See whether the court is dry and playable and which window plays best. Free.`,
      h1: `Padel or tennis in ${s} today?`,
    }),
    "auto-wassen": (s) => ({
      title: `Washing the car in ${s}: the best wash moment today`,
      description: `Can I wash the car in ${s} today? See whether it stays dry, whether the sun causes streaks and the best moment to wash. Free.`,
      h1: `Wash the car in ${s} today?`,
    }),
    "grasmaaien": (s) => ({
      title: `Mowing the lawn in ${s}: dry grass today?`,
      description: `Can I mow the lawn in ${s} today? See when the grass is dry after dew or rain and the best mowing moment. Free.`,
      h1: `Mow the lawn in ${s} today?`,
    }),
    "ramen-wassen": (s) => ({
      title: `Cleaning windows in ${s}: streak-free today?`,
      description: `Can I clean the windows in ${s} today? See whether it stays dry and when sun and frost cause no streaks or trouble. Free.`,
      h1: `Clean the windows in ${s} today?`,
    }),
    "zonnepanelen": (s) => ({
      title: `Solar panels in ${s}: today's yield`,
      description: `Will solar panels in ${s} produce well today? See the sunniest window of the day and plan your appliances on the sun hours. Free.`,
      h1: `What will the panels in ${s} produce today?`,
    }),
    "strandweer": (s) => ({
      title: `Beach weather in ${s}: the best beach hours today`,
      description: `Is it beach weather in ${s} today? See the best beach hours, the wind on the sand and the UV index, five days ahead. Free.`,
      h1: `Beach weather in ${s} today?`,
    }),
    "picknickweer": (s) => ({
      title: `Picnic weather in ${s}: the best window today`,
      description: `Can I have a picnic in ${s} today? See dry grass, sun and little wind per hour, and the best picnic window of the day. Free.`,
      h1: `Picnic in ${s} today?`,
    }),
    "buiten-zwemmen": (s) => ({
      title: `Swimming weather in ${s}: can I swim outside today?`,
      description: `Can I swim outside in ${s} today? See the best swimming window, the wind and whether the sun dries you afterwards. Free.`,
      h1: `Swimming outside in ${s} today?`,
    }),
    "suppen-of-kajakken": (s) => ({
      title: `SUP or kayak in ${s}: flat water today?`,
      description: `Can I paddleboard or kayak in ${s} today? See per hour when the wind is lowest and the water at its flattest. Free.`,
      h1: `SUP or kayak in ${s} today?`,
    }),
    "sterrenkijken": (s) => ({
      title: `Stargazing in ${s}: a clear night today?`,
      description: `Can I stargaze in ${s} tonight? See cloud cover, the moon phase and the clearest window of the evening. Free.`,
      h1: `Stargazing in ${s} tonight?`,
    }),
    "regen-timing": (s) => ({
      title: `When will it rain in ${s}?`,
      description: `When will it rain in ${s}? See to the minute when the shower falls, when it turns dry and which hours are safe. Free.`,
      h1: `When will it rain in ${s}?`,
    }),
    "paraplu": (s) => ({
      title: `Umbrella in ${s} today?`,
      description: `Should I bring an umbrella in ${s} today? See whether showers fall during your moments outside and whether a rain jacket is smarter. Free.`,
      h1: `Umbrella in ${s} today?`,
    }),
    "krabben": (s) => ({
      title: `Windscreen frost in ${s}: will the car freeze tonight?`,
      description: `Will I need to scrape in ${s} tomorrow? See whether the windscreen freezes tonight, so you can plan those extra five minutes. Free.`,
      h1: `Scraping in ${s} tomorrow morning?`,
    }),
    "golfen": (s) => ({
      title: `Golfing in ${s}: golf weather today?`,
      description: `Can I golf in ${s} today? Wind, rain and the best window for a round. Free.`,
      h1: `Golfing in ${s} today?`,
    }),
    "skeeleren": (s) => ({
      title: `Inline skating in ${s}: dry tarmac today?`,
      description: `Can I skate in ${s} today? Strict on wet tarmac, with the best dry window. Free.`,
      h1: `Inline skating in ${s} today?`,
    }),
    "motorrijden": (s) => ({
      title: `Motorcycling in ${s}: riding weather today?`,
      description: `Can I ride in ${s} today? Wet tarmac, gusts and cold at speed weighed up. Free.`,
      h1: `Motorcycling in ${s} today?`,
    }),
    "hond-uitlaten": (s) => ({
      title: `Walking the dog in ${s}: the best moment today`,
      description: `When to walk the dog in ${s}? The most comfortable window, with a hard line on hot tarmac. Free.`,
      h1: `Walking the dog in ${s}: when today?`,
    }),
    "vliegeren": (s) => ({
      title: `Kite flying in ${s}: kite wind today?`,
      description: `Can I fly a kite in ${s} today? The check finds the best wind band and warns for gusts. Free.`,
      h1: `Kite flying in ${s} today?`,
    }),
    "vuurkorf": (s) => ({
      title: `Fire pit in ${s}: can it go on tonight?`,
      description: `Can the fire pit go on in ${s}? Sparks in wind, hanging smoke in calm: the check weighs both. Free.`,
      h1: `Fire pit on in ${s} tonight?`,
    }),
    "drone-vliegen": (s) => ({
      title: `Drone flying in ${s}: drone weather today?`,
      description: `Can I fly the drone in ${s} today? Wind under the drone's limit, dry and daylight. Free.`,
      h1: `Drone flying in ${s} today?`,
    }),
    "paardrijden": (s) => ({
      title: `Horse riding in ${s}: outdoor riding weather today?`,
      description: `Can I ride outside in ${s} today? Wind spooks horses, frost hardens footing. Free.`,
      h1: `Riding outside in ${s} today?`,
    }),
    "vissen": (s) => ({
      title: `Fishing in ${s}: fishing weather today?`,
      description: `Good fishing weather in ${s}? The only check with the pressure trend, plus light and wind. Free.`,
      h1: `Fishing weather in ${s} today?`,
    }),
    "schaatsen": (s) => ({
      title: `Natural ice in ${s}: skating weather coming?`,
      description: `Is natural ice coming to ${s}? The frost sum of the coming days, weighed honestly. Free.`,
      h1: `Natural ice coming to ${s}?`,
    }),
    "mist": (s) => ({
      title: `Fog in ${s}: how is visibility this morning?`,
      description: `Is it foggy in ${s}? Visibility in your commute, with the hour the fog lifts. Free.`,
      h1: `Fog in ${s} today?`,
    }),
    "storm": (s) => ({
      title: `Storm in ${s}: should I secure things?`,
      description: `Should I secure things in ${s}? The peak of the gusts, translated into actions. Free.`,
      h1: `Storm coming to ${s}?`,
    }),
    "houtkachel": (s) => ({
      title: `Wood stove in ${s}: burning weather tonight?`,
      description: `Can the wood stove go on in ${s}? In calm humid weather smoke lingers: the check weighs it. Free.`,
      h1: `Wood stove on in ${s} tonight?`,
    }),
    "huis-koelen": (s) => ({
      title: `Keeping the house cool in ${s}: today's cooling plan`,
      description: `How to keep the house cool in ${s}? When windows open and close, with the flush window per day. Free.`,
      h1: `Keeping the house cool in ${s} today?`,
    }),
    "kamperen": (s) => ({
      title: `Camping near ${s}: tent weather tonight?`,
      description: `Camping weather near ${s}? The night judged: cold, rain and gusts on the tent. Free.`,
      h1: `Camping near ${s} tonight?`,
    }),
    "buiten-schilderen": (s) => ({
      title: `Exterior painting in ${s}: can I today?`,
      description: `Can I paint outside in ${s} today? The check finds a dry window at the right temperature and watches the hours after. Free.`,
      h1: `Exterior painting in ${s} today?`,
    }),
    "hout-behandelen": (s) => ({
      title: `Wood treatment in ${s}: stain or oil today?`,
      description: `Can I stain or oil in ${s} today? The wood must be dry and stay dry: the check judges the job weather. Free.`,
      h1: `Wood treatment in ${s} today?`,
    }),
    "terras-reinigen": (s) => ({
      title: `Patio cleaning in ${s}: can I today?`,
      description: `Can I clean the patio or driveway in ${s} today? Mild and not freezing is ideal: the check picks the best moment. Free.`,
      h1: `Patio cleaning in ${s} today?`,
    }),
    "planten-beschermen": (s) => ({
      title: `Protecting plants in ${s}: frost tonight?`,
      description: `Should I protect my plants in ${s} tonight? The night judged for frost, including radiation frost. Free.`,
      h1: `Protecting plants in ${s} tonight?`,
    }),
    "sneeuwpret": (s) => ({
      title: `Snow play in ${s}: can we go sledding?`,
      description: `Snow fun in ${s} today? The check looks at the snow layer and whether it stays. Free.`,
      h1: `Snow play in ${s} today?`,
    }),
    "strooien": (s) => ({
      title: `Gritting in ${s}: needed tonight?`,
      description: `Should I grit or clear in ${s} tonight? The night judged for freezing tiles and fresh snow. Free.`,
      h1: `Gritting in ${s} tonight?`,
    }),
    "beton-storten": (s) => ({
      title: `Pouring concrete in ${s}: can I today?`,
      description: `Can I pour concrete in ${s} today? The check looks at pouring temperature, night frost, rain and drying out. Free.`,
      h1: `Pouring concrete in ${s} today?`,
    }),
    "dak-op": (s) => ({
      title: `On the roof in ${s}: is it safe?`,
      description: `Is it safe to go on the roof in ${s} today? The check finds the calmest, driest window and watches wind and ice. Free.`,
      h1: `Safe on the roof in ${s} today?`,
    }),
    "zwembad-opzetten": (s) => ({
      title: `Setting up the pool in ${s}: warm enough?`,
      description: `Can I set up the pool in ${s}? The check finds the warmest, sunniest window and watches cold wind. Free.`,
      h1: `Setting up the pool in ${s} today?`,
    }),
    "muggen": (s) => ({
      title: `Mosquito weather in ${s}: many out tonight?`,
      description: `Are the mosquitoes out in ${s} tonight? The check estimates mosquito activity from warmth, humidity and wind. Free.`,
      h1: `Mosquito weather in ${s} tonight?`,
    }),
    "onkruid": (s) => ({
      title: `Weeding or hoeing in ${s}: what works today?`,
      description: `Can I tackle the weeds in ${s} today? Hoeing wants dry and sun, hand-weeding moist soil: the check picks the method. Free.`,
      h1: `Tackling weeds in ${s} today?`,
    }),
    "water-geven": (s) => ({
      title: `Watering in ${s}: needed today?`,
      description: `Should I water the plants in ${s}? Rain ahead, heat and wind weighed, with the best watering moment. Free.`,
      h1: `Watering in ${s} today?`,
    }),
    "gras-zaaien": (s) => ({
      title: `Sowing grass in ${s}: sowing weather today?`,
      description: `Can I sow grass in ${s} today? Soil warmth, rain ahead and the sowing season weighed up. Free.`,
      h1: `Sowing grass in ${s} today?`,
    }),
    "snoeien": (s) => ({
      title: `Pruning in ${s}: good day for it?`,
      description: `Can I prune in ${s} today? Frost, wet and heat weighed up, with the month's pruning season alongside. Free.`,
      h1: `Pruning in ${s} today?`,
    }),
    "wielrennen": (s) => ({
      title: `Road cycling weather in ${s}: the best riding window today`,
      description: `Is it riding weather in ${s} today? See the best dry window with manageable wind for a road ride. Free.`,
      h1: `Road cycling in ${s} today?`,
    }),
    "gladheid": (s) => ({
      title: `Icy roads in ${s}: is it slippery today?`,
      description: `Is it slippery in ${s} today or tonight? See the ice risk per morning, including bridges and cycle paths. Free.`,
      h1: `Icy roads in ${s} today?`,
    }),
  },
};

export const STAD_TEMPLATES = kies(STAD_TEMPLATES_RUW);

/**
 * Titel/description/h1 voor een stadpagina. Het vangnet put uit de
 * tool zelf en leent dus nooit meer andermans tekst; de test dwingt af
 * dat elke geregistreerde tool een echt template heeft, zodat het
 * vangnet alleen een toekomstige vergeten tool opvangt.
 */
export function titelVoor(tool, stad) {
  const maak = STAD_TEMPLATES[tool.templateId ?? tool.id];
  if (maak) return maak(stad.naam);
  return {
    title: `${tool.navLabel} in ${stad.naam} ${kies({ nl: "vandaag", en: "today" })}`,
    description: `${tool.korteVraag} ${kies({
      nl: `Bekijk het antwoord voor ${stad.naam}, per uur en vijf dagen vooruit. Gratis.`,
      en: `See the answer for ${stad.naam}, per hour and five days ahead. Free.`,
    })}`,
    h1: `${tool.navLabel} in ${stad.naam}?`,
  };
}

/**
 * De korte zoekterm-kern per tool voor de stedenknoppen op de
 * toolpagina ("{term} {stad}"). Varianten hebben een eigen term; de
 * lijst rendert op hun eigen vraagpagina's met eigen stad-URL's.
 */
export const ANKER_TERM_RUW = {
  nl: {
    "fiets-naar-werk": "Fietsen naar werk",
    "hardloopweer": "Hardloopweer",
    "wandelen": "Wandelweer",
    "buiten-sporten": "Buiten sporten",
    "padel-of-tennis": "Padel of tennis",
    "was-buiten-drogen": "Was buiten drogen",
    "auto-wassen": "Auto wassen",
    "grasmaaien": "Grasmaaien",
    "ramen-wassen": "Ramen wassen",
    "zonnepanelen": "Zonnepanelen",
    "wat-trek-ik-aan": "Kledingadvies",
    "terras": "Terrasweer",
    "barbecue": "Barbecueweer",
    "strandweer": "Strandweer",
    "picknickweer": "Picknickweer",
    "buiten-zwemmen": "Zwemweer",
    "suppen-of-kajakken": "Suppen of kajakken",
    "sterrenkijken": "Sterren kijken",
    "zonkracht": "Zonkracht",
    "hooikoorts": "Hooikoorts",
    "regen-timing": "Wanneer regen",
    "paraplu": "Paraplu mee",
    "krabben": "Ruiten krabben",
    "gladheid": "Gladheid",
    "wielrennen": "Wielrenweer",
    "snoeien": "Snoeiweer",
    "onkruid": "Onkruidweer",
    "golfen": "Golfweer",
    "skeeleren": "Skeelerweer",
    "motorrijden": "Motorweer",
    "hond-uitlaten": "Uitlaatweer",
    "vliegeren": "Vliegerweer",
    "vuurkorf": "Vuurkorfweer",
    "drone-vliegen": "Droneweer",
    "paardrijden": "Paardrijweer",
    "vissen": "Visweer",
    "schaatsen": "Schaatsweer",
    "mist": "Mistcheck",
    "storm": "Stormcheck",
    "houtkachel": "Stookweer",
    "huis-koelen": "Koelplan",
    "kamperen": "Kampeerweer",
    "buiten-schilderen": "Schilderweer",
    "hout-behandelen": "Beitsweer",
    "terras-reinigen": "Reinigweer",
    "planten-beschermen": "Vorstcheck planten",
    "sneeuwpret": "Sneeuwpret",
    "strooien": "Strooicheck",
    "beton-storten": "Betoncheck",
    "dak-op": "Dakcheck",
    "zwembad-opzetten": "Zwembadweer",
    "muggen": "Muggenweer",
    "water-geven": "Gietweer",
    "gras-zaaien": "Zaaiweer",
    "slippers": "Slippersweer",
    "korte-broek": "Korte broek weer",
    "jas": "Jas aan of uit",
    "t-shirt": "T-shirtweer",
  },
  en: {
    "fiets-naar-werk": "Bike to work",
    "hardloopweer": "Running weather",
    "wandelen": "Walking weather",
    "buiten-sporten": "Outdoor training",
    "padel-of-tennis": "Padel or tennis",
    "was-buiten-drogen": "Drying laundry",
    "auto-wassen": "Car washing",
    "grasmaaien": "Lawn mowing",
    "ramen-wassen": "Window cleaning",
    "zonnepanelen": "Solar panels",
    "wat-trek-ik-aan": "What to wear",
    "terras": "Patio weather",
    "barbecue": "BBQ weather",
    "strandweer": "Beach weather",
    "picknickweer": "Picnic weather",
    "buiten-zwemmen": "Swimming weather",
    "suppen-of-kajakken": "SUP or kayak",
    "sterrenkijken": "Stargazing",
    "zonkracht": "UV index",
    "hooikoorts": "Hay fever",
    "regen-timing": "When it rains",
    "paraplu": "Umbrella",
    "krabben": "Windscreen frost",
    "gladheid": "Icy roads",
    "wielrennen": "Road cycling",
    "snoeien": "Pruning weather",
    "onkruid": "Weeding weather",
    "golfen": "Golf weather",
    "skeeleren": "Skating weather",
    "motorrijden": "Riding weather",
    "hond-uitlaten": "Dog walk weather",
    "vliegeren": "Kite weather",
    "vuurkorf": "Fire pit weather",
    "drone-vliegen": "Drone weather",
    "paardrijden": "Riding out weather",
    "vissen": "Fishing weather",
    "schaatsen": "Skating forecast",
    "mist": "Fog check",
    "storm": "Storm check",
    "houtkachel": "Burning weather",
    "huis-koelen": "Cooling plan",
    "kamperen": "Camping weather",
    "buiten-schilderen": "Painting weather",
    "hout-behandelen": "Staining weather",
    "terras-reinigen": "Cleaning weather",
    "planten-beschermen": "Plant frost check",
    "sneeuwpret": "Snow play",
    "strooien": "Gritting check",
    "beton-storten": "Concrete check",
    "dak-op": "Roof check",
    "zwembad-opzetten": "Pool weather",
    "muggen": "Mosquito weather",
    "water-geven": "Watering weather",
    "gras-zaaien": "Sowing weather",
    "slippers": "Flip-flop weather",
    "korte-broek": "Shorts weather",
    "jas": "Coat or no coat",
    "t-shirt": "T-shirt weather",
  },
};

export const ANKER_TERM = kies(ANKER_TERM_RUW);

/** Ankertekst voor een stedenknop: "{term} {stad}". */
export function stadAnker(tool, stadNaam) {
  const term = ANKER_TERM[tool.templateId ?? tool.id] ?? tool.navLabel;
  return `${term} ${stadNaam}`;
}
