# LOGBOEK Kopwind

Datum: 10 juli 2026

## Wat er staat

Werkende Next.js 14 app (plain JavaScript, App Router) die een keten van stops doorrekent en per etappe en voor de dag adviseert: fiets prima, fiets met tegenzin, of pak de scooter. Inclusief kaart met windkleuren per routesegment, windstrip per etappe, instelbare drempels, presets, demo zonder netwerk, en meldingen (ochtendbriefing en vertrekherinnering).

## Kernkeuzes

1. Keten als model, niet losse ritten. Je kiest een keer per dag tussen fiets en scooter; halverwege wisselen kan niet. Het dagadvies is daarom de zwaarste etappe van de keten. Een terugrit is geen aparte feature: gewoon een extra etappe met een eigen tijd.

2. Wind per segment op het juiste uur. De route wordt gesplitst in stukken van ~300 m. Per segment: rijrichting (bearing), passagetijd (vertrek plus reistijdfractie), en het bijbehorende voorspellingsuur. Kopwind = windsnelheid x cos(windrichting - rijrichting), zijwind met sinus. Windrichting is meteorologisch (waar de wind vandaan komt). Positief is tegenwind.

3. Weer ruimtelijk op het middelpunt van de route, in de tijd wel exact per uur. Op NL-afstanden is de ruimtelijke variatie binnen een etappe verwaarloosbaar; het tijdstip maakt wel echt uit (ochtend- vs avondspits).

4. Pijnscore 0 tot 100 in plaats van harde regels. Gemiddelde positieve kopwind is de basis (20 tot 55 punten tussen de drempels), piekwind, neerslagkans, neerslaghoeveelheid, kou en zware windstoten tellen erbij op. 0 tot 29 fiets prima, 30 tot 59 met tegenzin, 60 plus scooter. Drempels instelbaar en opgeslagen in localStorage.

5. Alles keyless by default. Photon voor geocoding, OSRM-fietsprofiel (FOSSGIS) voor routes, Open-Meteo voor weer, OSM-tiles voor de kaart. Optioneel OpenRouteService via ORS_API_KEY. Drie dunne API-routes proxyen; de rekenkern is puur en getest.

6. Meldingen zonder server. De laatst berekende keten (inclusief reistijden) staat in localStorage. Een scheduler in de pagina checkt elke 30 seconden: ochtendbriefing op het ingestelde tijdstip (inhaalvenster 3 uur), vertrekherinnering X minuten voor elke geplande vertrektijd. Kloktijden van de keten schuiven automatisch naar vandaag, zodat de vaste routine dagelijks werkt. Op het meldmoment wordt het actuele weer opgehaald zodat de melding klopt: advies, samenvatting, temperatuur, regen, wind. Dedupe per dag via een logboekje in localStorage; races afgevangen door eerst te loggen en dan te rekenen.

## Bewust niet gebouwd

- Echte push zonder open tab. Vraagt een service worker, VAPID-keys en een server die op tijden pusht (bv. Vercel Cron plus web-push). Voor een persoonlijke tool is een open tabblad een prima eerste stap; dit is de logische vervolgstap als je de app op Vercel zet.
- Agenda-import (.ics / Google Calendar) om de keten automatisch te vullen.
- Reistijdvergelijking fiets vs scooter.
- Windpijlen op de kaart: de gekleurde segmenten plus de windstrip beantwoorden de eigenlijke vraag (waar heb ik last) al.
- Hoogteprofiel: vlak land.

## Eerlijke beperkingen

- Open-Meteo is modelwind op 10 m per uur. Microklimaat (dijk, open water, tussen flats) zit er niet in.
- Publieke OSRM en Photon zijn fair-use zonder SLA. Voor persoonlijk gebruik prima; bij intensiever gebruik is de ORS-key of zelf hosten de route.
- Paginameldingen werken alleen met een open tabblad; browsers kunnen timers in achtergrondtabs tot ~1x per minuut vertragen, wat voor deze granulariteit acceptabel is.
- Uurvoorspelling tot ~4 dagen vooruit; daarna toont de app een nette waarschuwing.

## Tests

20 tests, allemaal groen (npm test):
- wind: bearing (N/O/Z/W), haversine, windcomponenten (meteorologische conventie), segmentering, uursleutel-afronding, NL-samenvatting.
- advies: rustige dag score 0, zware tegenwind kantelt naar scooter, regenkansgrens exact, dagadvies pakt zwaarste etappe.
- meldingen: kloktijden naar vandaag, ketentijden offline (vertrek, verblijf, aankomst teruggerekend), ochtendvenster met inhaal en dedupe, vertrekvenster met dedupe.
- planner: integratietest van de hele pijplijn via de demoketen (tijden exact, tegenwind heen, rugwind terug, dagscore is maximum), foutafhandeling bij stops op dezelfde plek.

## Structuur

- app/api/geocode, app/api/route, app/api/weather: dunne proxies.
- lib/wind.js: bearing, haversine, windcomponenten, segmentering, uurkoppeling, samenvatting.
- lib/advice.js: pijnscore en advies. lib/planner.js: keten doorrekenen. lib/notify.js: meldingenplanning. lib/format.js: presentatie. lib/demo.js: demoketen en mock-fetch.
- components/: StopsEditor, MapView (Leaflet, lazy), LegCard (met windstrip), DagBanner, SettingsPanel, MeldingenPanel, NotificationManager.
- tests/: wind, advice, notify, planner.

---

## Iteratie 2 (10 juli 2026): leesbaarheid, routealternatieven, indeling, windrichting

Vier stukken feedback verwerkt.

1. Kleurcontrast op de kaart. De kleurfunctie liep eerst van groen via geel naar rood met te weinig verschil en te lichte tinten; op tegels was het slecht te zien. Nu een verzadigde ramp van diep groen (hue 150) via amber (45) naar diep rood (2), donkerder naarmate het heftiger is. Belangrijker nog: elk segment van de gekozen route krijgt op de kaart een witte omranding (weight 9) onder de gekleurde lijn (weight 5,5), zodat de kleur overal leest, ongeacht de achtergrond. De windstrip in de etappekaart gebruikt dezelfde kleurfunctie, dus die profiteert automatisch mee.

2. Routealternatieven met minder tegenwind. De routelaag vraagt nu alternatieven op (OSRM alternatives=3, OpenRouteService alternative_routes met terugval zonder alternatieven bij korte ritten) en geeft { routes: [...] } terug. De planner is gesplitst in haalRuweEtappes (netwerk: routes plus weer) en stelPlanSamen (puur: kiest per etappe een route, rekent tijden en analyseert alle alternatieven op dezelfde vertrektijd zodat de windscores eerlijk vergelijkbaar zijn). Zo wisselt de interface van route zonder opnieuw te fetchen. Default is de snelste route; de route met de laagste score wordt als minste wind gemarkeerd (bewust geen automatische omweg, voorspelbaarheid gaat voor). Alternatieven liggen dun gestippeld op de kaart in hun eigen windkleuren en zijn klikbaar, plus chips in de etappekaart.

3. Planner en kaart naast elkaar. De pagina is nu een grid met drie gebieden: planner linksboven, resultaten (dagbanner plus etappekaarten) linksonder, en de kaart rechts over de volle hoogte, sticky zodat hij in beeld blijft tijdens scrollen. Onder 960px klapt alles naar een kolom in de volgorde planner, kaart, resultaten. De interface is verder opgeschoond: zachtere schaduwen, een merkstip in de header, nette chips en frosted overlays op de kaart.

4. Windrichting zichtbaar. Windpijlen op een paar punten langs de gekozen route wijzen met de wind mee (windrichting plus 180 graden). Rechtsboven op de kaart staat een kompas met de gemiddelde windrichting en -kracht van de actieve etappe (circulair gemiddelde van de richting, afstandsgewogen), en in de etappekaart staat een klein pijltje naast de windregel. Linksonder een kleurenlegenda (rugwind naar tegenwind).

Nieuwe pure functies met tests: legWindSummary (circulair gemiddelde windrichting plus gewogen snelheid). Testtal nu 20, allemaal groen. De integratietest via de demo dekt de nieuwe { routes: [...] }-vorm; de demo geeft twee alternatieven per etappe zodat de routevergelijking zichtbaar is zonder netwerk.

Nog steeds bewust niet gebouwd: automatische routekeuze op minste wind (kan absurde omwegen geven), en de weerpunten worden nog op het middelpunt van de snelste route opgehaald en hergebruikt voor de alternatieven (op NL-afstanden verwaarloosbaar, de tijdas per segment is wel exact). Meldingen gebruiken voor de zekerheid nog de snelste route.

---

## Iteratie 3 (10 juli 2026): woon-werkfocus, scorefix, routes, hiërarchie, SEO

Repositionering van persoonlijke fiets-of-scooter-tool naar publieke check voor de vraag "kan ik vandaag beter met de fiets naar werk?".

1. Scorediagnose en fix. De score was niet defect maar inconsistent: de tekstsamenvatting keek naar losse segmenten boven de drempel ("1,9 km merkbare tegenwind"), terwijl de score alleen het ritgemiddelde boven diezelfde drempel telde. Een verder rustige rit bleef daardoor op score 0 staan naast een tekst over tegenwind. Bovendien leest "score 0 = perfect" voor een breed publiek als kapot. Twee ingrepen: (a) de pijnscore is nu continu vanaf 5 km/u gemiddelde tegenwind en telt daarnaast de tegenwindstukken zelf mee (aandeel van de afstand boven matig en boven zwaar), met een reden die het aantal kilometers benoemt; (b) naar buiten toe is de score een rapportcijfer: 10 = perfecte fietsdag, 7+ prima, 4 tot 7 pittig, onder 4 liever niet. Cijfer en toelichting vertellen nu altijd hetzelfde verhaal. Interne pijnscore 0-100 blijft bestaan (drempels, meldingen, tests).

2. Scooter eruit. Er zat overigens geen scooterdeelvervoer in; wel "pak de scooter" als adviestekst. Alle labels zijn nu fiets-of-niet: prima fietsdag, pittige rit, liever niet fietsen. Dagadvies-framing: heen en terug tellen allebei mee, de zwaarste rit bepaalt of de fiets meegaat.

3. Routes opslaan. Complete routes (stops plus tijdopties) onder een naam in localStorage (kopwind.routes), laden via chips bovenin de planner, beheren in Instellingen. Favoriete plekken blijven los bestaan; een plek die al favoriet is toont een gevulde gouden ster (amber op lichtgele chip) in plaats van de neutrale ster, met een lege ster voor nog-niet-opgeslagen plekken.

4. Vertrekken nu. Nieuwe vertrekmodus "nu" (default voor de eerste rit): rekent met de actuele kloktijd in plaats van het eerstvolgende kwartier. Oude opgeslagen ketens met "auto" op rit 1 worden bij het laden gemigreerd. Voor de vertrekherinnering geldt "nu" als geen vaste tijd (je vertrekt immers al).

5. Informatiehiërarchie. Nieuwe volgorde: compacte hero met H1, dan configuratie links met de kaart rechts, en direct daaronder over de volle breedte het dagadvies plus de ritblokken naast elkaar in een responsief grid (minmax 330px). Elk blok volgt de gewenste opbouw: route en cijferbadge, tijden en afstand, weerregel, routekeuze, windstrip, samenvatting. Kaarten compacter (padding omlaag), scanbaar in een oogopslag.

6. Positionering, copy en SEO. Naam in de interface: "Vandaag op de fiets?" (constante in lib/brand.js, makkelijk te wisselen). Titel en metabeschrijving op de zoekintentie (fietsen naar werk, fietsweer, kan ik fietsen vandaag, wind tegen fietsen, woon-werkverkeer fiets), canonical en Open Graph via NEXT_PUBLIC_SITE_URL, robots.txt en sitemap.xml via app/robots.js en app/sitemap.js, H1 plus vier H2-tekstblokken en een FAQ (vier vragen) onder de tool, en JSON-LD voor FAQPage en WebApplication. FAQ-tekst en JSON-LD zijn identiek (vereiste van Google). Meldingen heten nu Fietscheck-meldingen.

7. Behoud. Interne mapnaam, zip en localStorage-sleutels blijven kopwind, zodat bestaande data en de Vercel-koppeling een naamswissel overleven. Meldingen gebruiken voor herinneringen de snelste route (ongewijzigd).

Tests: 23 groen, waaronder een regressietest voor precies het gemelde geval (laag ritgemiddelde plus 1,9 km merkbare tegenwind geeft nu een mild gedrukt cijfer met een reden die het stuk benoemt, in plaats van score 0) en tests voor vertrekken nu. Build geslaagd, inclusief robots.txt en sitemap.xml.
