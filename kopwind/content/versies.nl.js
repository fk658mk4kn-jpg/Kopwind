/**
 * content/versies.js
 * Releasegeschiedenis voor de changelog-pagina, gesynct met CHANGELOG.md.
 * Nieuwste bovenaan.
 */

export const VERSIES = [
  {
    versie: "3.13.0",
    codenaam: "Solano",
    datum: "2026-07-16",
    zin: "De homepage wijst nu de weg: bovenaan staan de zeven thema's als klikbare knoppen, onder de kaarten staat een duidelijke knop naar alle checks, en de thema's staan ook in de voet. En de rustige achtergrondkleur en het grote icoon op de themapagina's zijn nu echt zichtbaar; die zaten door een foutje achter de pagina verstopt.",
  },
  {
    versie: "3.12.0",
    codenaam: "Gregale",
    datum: "2026-07-16",
    zin: "De themapagina's zijn prettiger om door te scrollen: de keuzehulp staat in dezelfde kaartstijl als de checks, de uitlegblokken kregen vinkjes, accentranden en seizoensiconen, en het pijltje wijst voortaan gewoon naar rechts.",
  },
  {
    versie: "3.11.0",
    codenaam: "Libeccio",
    datum: "2026-07-16",
    zin: "Alle zeven themapagina's zijn nu even compleet: wie de pagina helpt, een keuzehulp, uitleg per situatie en seizoen, alle checks als kaarten en een veelgestelde-vragenblok. Vijftien vragen die eerst 'binnenkort' waren linken nu direct naar hun antwoord, en de pagina's kregen een rustige achtergrond in de kleur van het thema.",
  },
  {
    versie: "3.10.0",
    codenaam: "Levante",
    datum: "2026-07-15",
    zin: "Alles heet nu overal hetzelfde: elke check heeft een titel en elke categorie een naam en kleur, gelijk op de homepage, in het menu en op de themapagina's. Op Alle checks zie je per check direct de uitkomst voor jouw plek als gekleurd bolletje met label, en vragen in ontwikkeling staan er rustig onder. Zeven huis-tuinvragen linken nu direct naar hun antwoord.",
  },
  {
    versie: "3.9.0",
    codenaam: "Sirocco",
    datum: "2026-07-15",
    zin: "De categoriepagina's helpen je nu eerst kiezen: bovenaan een korte keuzehulp die je bij de juiste check of het juiste antwoord brengt, daarna de uitleg en alle checks. De eerste volledige pagina is Huis, tuin en auto, met antwoorden op vragen als auto wassen, grasmaaien en buiten schilderen. Ook is de fietscheck nu netjes bij Sport en beweging te vinden.",
  },
  {
    versie: "3.8.0",
    codenaam: "Mistral",
    datum: "2026-07-14",
    zin: "Meldingen zijn nu per weekdag in te stellen: op elke dag een eigen tijd voor de melding, en waar het advies over gaat (je vertrektijd die dag, de hele dag, of een tijdvenster zoals tussen 8 en 12). De melding zelf is duidelijker, begint met het antwoord en opent bij het aantikken meteen de juiste check. Bewaarde tijden springen bij het openen altijd naar vandaag.",
  },
  {
    versie: "3.7.7",
    codenaam: "Etesian patch 7",
    datum: "2026-07-14",
    zin: "De regen- en paraplucheck zien er nu net zo uit als de andere checks: dezelfde plekkiezer met favorieten, een knop om opnieuw te checken, en de bron met het ophaalmoment. Op een breed scherm staat het antwoord naast je plek.",
  },
  {
    versie: "3.7.6",
    codenaam: "Etesian patch 6",
    datum: "2026-07-14",
    zin: "Persoonlijker titels: de vraag boven een check gaat nu vaker over \"ik\" in plaats van \"het\". \"Krijg ik vandaag hooikoorts?\" is nu \"Heb ik vandaag last van hooikoorts?\", en ook de barbecue- en parapluvraag lezen logischer.",
  },
  {
    versie: "3.7.5",
    codenaam: "Etesian patch 5",
    datum: "2026-07-14",
    zin: "Ruimere indeling van de uitslag: op tablet en desktop staat het antwoord nu naast je plek in plaats van eronder, met de toelichting eronder. Op de telefoon blijft alles netjes onder elkaar. De weerfactoren, de dagkiezer en de urenstrip staan daaronder.",
  },
  {
    versie: "3.7.4",
    codenaam: "Etesian patch 4",
    datum: "2026-07-14",
    zin: "Het duimpje onder een check laat nu zien hoeveel mensen de check ooit als kloppend hebben gemarkeerd, niet meer alleen vandaag. De duimen zijn duidelijker (omhoog groen, omlaag rood), de vraag \"Klopte het advies vandaag?\" is beter zichtbaar en de deelknop springt er nu uit.",
  },
  {
    versie: "3.7.3",
    codenaam: "Etesian patch 3",
    datum: "2026-07-14",
    zin: "Technische fix: de duimpjes onder een check haalden in productie de aantallen niet op door een foutje in het adres waarmee de site de database aanroept (een dubbele schuine streep). Dat adres wordt nu automatisch schoongemaakt, zodat de teller en de pushmeldingen die dezelfde verbinding gebruiken weer werken.",
  },
  {
    versie: "3.7.2",
    codenaam: "Etesian patch 2",
    datum: "2026-07-14",
    zin: "De fietscheck is opgeschoond: per rit staat nog maar een oordeelwoord (geen dubbel label meer), de tegenstrijdige kilometers zijn weg doordat de windsamenvatting nu de enige plek is die vertelt waar en hoeveel tegenwind er is, en de dagbanner gebruikt die samenvatting van de zwaarste rit. \"Cijfer gedrukt door\" heet nu \"Wat telt tegen\". Achter de schermen draaien de pushmeldingen op een externe klok, zodat ze ook op het gratis hostingplan op tijd vertrekken.",
  },
  {
    versie: "3.7.1",
    codenaam: "Etesian patch",
    datum: "2026-07-14",
    zin: "Technische fix voor de weergave in Google: de broodkruimels (de padregel bovenaan een pagina) leveren nu altijd nette, volledige adressen aan, na een melding van Search Console.",
  },
  {
    versie: "3.7.0",
    codenaam: "Etesian",
    datum: "2026-07-13",
    zin: "Feedback en delen zijn opnieuw vormgegeven in de huisstijl: twee duimen, alleen het aantal bevestigingen naast de duim omhoog, een negatieve stem krijgt enkel een bedankje. Het instellingenmenu is opgedeeld in heldere secties met de koppelcode om je telefoon en computer gelijk te houden. De header blijft nu vast bovenaan, de footer en de blokken in Alle checks hebben duidelijke randen, en tool-titels plus FAQ-vragen zijn merkbreed aangescherpt op de vraag Kan het vandaag.",
  },
  {
    versie: "3.6.0",
    codenaam: "Bora",
    datum: "2026-07-13",
    zin: "De storefronts staan: elke categorie is nu een eigen rankbare pagina op de root (regen-en-droog, kleding, buiten-vrije-tijd, sport-beweging, huis-tuin-auto, zon-lucht-hooikoorts, winter-veiligheid) met beslislogica, situaties, seizoenscontext en FAQ. De eerste storefront Regen en droog is volledig uitgewerkt, met twee nieuwe checks: wanneer gaat het regenen (op 15-minuten neerslagdata) en paraplu mee.",
  },
  {
    versie: "3.5.0",
    codenaam: "Tramontane",
    datum: "2026-07-13",
    zin: "Fundament voor de storefronts: elke check hoort nu bij een categorie (buiten, kleding, huis en tuin, onderweg, gezondheid) met een eigen overzichtspagina, klaar om later etalage te worden. Onder elk antwoord staan weerfactoren-balken die tonen wat het oordeel bepaalt (temperatuur, wind, vocht, zon), en de pushmeldingen worden nu echt op tijd verstuurd.",
  },
  {
    versie: "3.4.0",
    codenaam: "Ponente",
    datum: "2026-07-13",
    zin: "Toelichting bij elk oordeel (waarom-regel met de doorslaggevende reden), en bij een bekende plek toont elke check meteen de uitslag zonder extra tik. Nieuwe hooikoortscheck op een eigen pollenbron (CAMS) met het rustigste blok van de dag, en drie kledingvraagpagina's (korte broek, jas, T-shirtweer). Nieuwe overzichtspagina met alle weerbeslissingen en zoekfunctie, de feedbackknoppen die niet meer wegflitsen, en op mobiel vierkante tegels plus een sticky antwoordbalk.",
  },
  {
    versie: "3.3.0",
    codenaam: "Meltemi",
    datum: "2026-07-13",
    zin: "Compacter en consistenter: elke hub-kaart volgt nu een vast stramien (vraag, verdictbadge rechts, toelichting van twee regels, eigen CTA) met het watermerk als achtergrond. Nieuwe zonkrachtcheck met huidtype en verbrandtijd. De tekstlinks verhuisden naar een uitklapmenu, de FAQ klapt in, en onder elk advies staan nu een stemmenteller, een deelknop, gerelateerde checks en een laatst-bijgewerkt-regel.",
  },
  {
    versie: "3.2.0",
    codenaam: "Sirocco",
    datum: "2026-07-13",
    zin: "De Engelse release: de hele site komt nu in twee talen uit dezelfde codebase, als Good day for it? op een eigen domein. Nieuwe check: de barbecue, avondgericht en met rook-advies dat vertelt waar je de tafel niet neerzet. Kompasstreken, decimalen en elke gegenereerde zin volgen voortaan de taal van de site.",
  },
  {
    versie: "3.1.0",
    codenaam: "Chinook",
    datum: "2026-07-13",
    zin: "Elke check antwoordt nu in zijn eigen woorden: Hang maar op, Goed te doen, Heerlijk terrasweer. De homepage opent met live antwoorden voor heel Nederland (of jouw stad), de instellingen praten mensentaal met keuzeknoppen, en de kaarten kregen kleur en karakter.",
  },
  {
    versie: "3.0.0",
    codenaam: "Levante",
    datum: "2026-07-13",
    zin: "Antwoorden in woorden: elke check zegt nu eerst Ja of Nee met een schaalwoord van Zeer slecht tot Ideaal. De homepage werd compacter en toont het live antwoord per kaart, je kunt per dag met een duim laten weten of het advies klopte, de kledingcheck kreeg een outfit-figuurtje en de teksten op de hele site werden directer.",
  },
  {
    versie: "2.2.0",
    codenaam: "Zephyr",
    datum: "2026-07-12",
    zin: "Twee nieuwe checks (kleding en terras) op een gedeelde weerbasis, het wascijfer losgetrokken van de klok (conditie-cijfer plus een aparte 'kan het nu nog?'-status met droogtijd), open-in-Maps-knoppen op de fietsroute, een rijkere hub met uitleg in gewone taal, en de hele site mobiel-eerst met meldingen en instellingen als iconen rechtsboven.",
  },
  {
    versie: "2.1.0",
    codenaam: "Mistral",
    datum: "2026-07-12",
    zin: "Auditronde: verankerde scorecurves tegen cijferinflatie, https en het echte domein overal, kaartfix, colorblind-veilige kleuren met legenda's, instellingen per check en het wegwijzer-design in leisteen en geel met Bricolage Grotesque.",
  },
  {
    versie: "2.0.0",
    codenaam: "Passaat",
    datum: "2026-07-11",
    zin: "Van losse tool naar hub: gedeelde engine met toolregister, de wascheck erbij, meldingen per route en per check, installatie op je beginscherm en programmatische pagina's per stad.",
  },
  {
    versie: "1.0.0",
    codenaam: "Kopwind",
    datum: "2026-07-11",
    zin: "De startlijn: de fietscheck met wind per stuk route, tussenstops, alternatieve routes, synccode tussen apparaten en server-push.",
  },
];
