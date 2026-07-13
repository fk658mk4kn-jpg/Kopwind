# Logboek

Semantische versies met windcodenamen. Korte scanlijst in CHANGELOG.md.
Git-tags zet je lokaal (zie README, kop Versies en tags).

---

## v2.1.0 - "Mistral" - 2026-07-12

**Waarom:** De SEO-/visualisatie-audit van de live site (invulling van
par. 10 van de masterbriefing) legde vier must-fixes bloot die de
kernwaarde raakten: score-inflatie (bijna alles een 10), canonicals en
sitemap naar localhost, een kapot ogende kaart voor de eerste check, en
strategie-copy richting de bezoeker. Daarnaast: installatie was in de
praktijk niet vindbaar, kleuren betekenden per tool iets anders zonder
legenda en waren niet colorblind-veilig, instellingen waren fiets-only,
en het design was de generieke SaaS-look die par. 11 verbiedt. Het domein
kanhetvandaag.nl is geclaimd; merk en domein zijn nu een.

**Wat:**
- Merk: hubnaam van "Vandaag wel?" naar "Kan het vandaag?" (1 constante
  in lib/brand.js, omkeerbaar), passend bij het domein. Korte naam voor
  beginscherm: "Vandaag?".
- P0-A score-ankers: beide tools kregen een verankerde curve met
  componenten die over hun hele bereik meetellen. Was: de vensterduur is
  de primaire, vrijwel lineaire driver (ankertabel 12u=0 pijn tot 3u=48),
  plus droogkracht, buien rond het venster en een "te kort om droog te
  krijgen"-tak; twee consistentie-caps borgen tekst-cijfer (droogtijd past
  => nooit "binnen drogen"; venster te kort => rond anker 3). Fiets:
  tegenwind steiler gekalibreerd (matig-drempel landt rond de 7,
  zwaar-drempel diep in de 2-3), regenkans gegradeerd vanaf 30% zonder
  drempelklif, neerslag vanaf motregen, kou en windstoten gegradeerd.
  Ankers staan als docblok in de code en als regressietests vast.
- P0-B site-URL: lib/site.js forceert https en valt terug op
  https://kanhetvandaag.nl (localhost-uitzondering voor dev);
  metadataBase, canonicals, og:url, robots.txt en alle sitemap-locs lopen
  erdoorheen.
- P0-C kaart: nette NL-overzichtsdefault, stadscentrum-default op
  stad-pagina's, en een ResizeObserver die Leaflet herijkt bij elke
  maatverandering (de oorzaak van de wazige uitgesmeerde tegel).
- P0-D copy: hub-blokken herschreven naar gebruikersvoordeel ("je krijgt
  een antwoord, geen tabel", "Op je beginscherm, op jouw momenten").
- P1-A installatie: het beforeinstallprompt-event leeft nu in de
  GebruikerContext; het meldingenpaneel opent met een sectie "Op je
  beginscherm" (knop op Chromium/Android, deelknop-instructie op iOS,
  browsermenu-uitleg elders, verborgen wanneer al standalone) en de
  zwevende kaart na de eerste check gebruikt dezelfde staat. Install- en
  push-uitleg per platform in beide tool-contents.
- P1-B kleuren: nieuwe module lib/engine/kleuren.js. Wind is divergerend
  blauw-oranje (colorblind-veilig, geen rood-groen), goedheid is
  sequentieel op cividis-stops (donker=slecht, lichtgeel=goed). Windstrip,
  kaartsegmenten, urenstrip en hub-demo staan op de nieuwe ramps; de
  wascards kregen kleur plus oordeelwoord; elke tool toont een
  KleurLegenda die de betekenis benoemt. Betekenis hangt nergens alleen
  aan kleur (woord plus getal overal).
- P1-C instellingen per tool: elke toolconfig declareert zijn eigen
  instelvelden en defaults; het instellingenpaneel toont tabs per check;
  opslag is per tool in localStorage en synccode, met automatische
  migratie van het oude platte formaat (ook in de cron). De wascheck is
  instelbaar op ophangvenster en buienkansgrens.
- P1-D design "wegwijzer": leisteen (#1B2733) als donker merkvlak (kop,
  installkaart), bewegwijzering-geel (#F2B705) als accent in plaats van
  SaaS-blauw, Bricolage Grotesque als display-letter, wordmark in kleine
  letters, iconen hergenereerd in leisteen-geel. Hero is functioneel:
  VandaagHier laat je een keer je plek kiezen en toont live het wascijfer
  van vandaag plus het fietsweer van dit uur met doorklik; toolkaarten
  centraal met een teaser voor terras en barbecue.
- P1-E delen: OG-images (1200x630) voor hub en toolpagina's met de
  windstrip als signature, gerenderd via next/og met de display-woff in
  assets/og/ (scripts/maak-og-font.mjs); twitter op summary_large_image
  en titels erven per pagina.
- P2: windstrip-legenda mobielproof (korte labels via KleurLegenda),
  hub-FAQ naar zes vragen met toolverwijzingen, CTA-patroon consequent in
  de gebiedende wijs ("Doe de check", "Check mijn fietsrit", "Bewaar
  route", "Stuur testmelding").

**Breaking / migratie:** Geen datamigratie nodig. Het drempelformaat is
nu per tool; oude platte profielen (localStorage en synccode-profielen)
migreren automatisch bij laden en in de cron. Visueel is alles anders
(naam, palet, letter), URLs zijn ongewijzigd. Na het pullen eenmalig npm
install (archivo eruit, bricolage-grotesque erin).

**Tests:** 64 groen (was 46). Nieuw: fiets-ankers en spreiding,
was-ankers (Apeldoorn 3u-venster <= 6,5 met "krap", venster te kort rond
de 3, minder dan 2 uur <= 4, volle droge dag >= 9, spreiding over vijf
dagen, consistentie-cap), kleurramps (exacte eindpunten),
siteUrl-helper, drempelmigratie en instellingen-declaraties. Aangepast:
regenkans-kliftest vervangen door gegradeerde tests, plannertest op het
nieuwe kleurformaat.

**Bekende beperkingen:**
- De drempel-modus werkt bewust NIET op de vertrekherinnering, alleen op
  de briefing: de herinnering is een wekker met actueel weer erin;
  wegfilteren zou de wekkerfunctie breken. Stond open sinds v2.0.0 en is
  nu een besluit, geen vergeten hoekje.
- Android-installatie, iOS-beginscherm en push zijn NIET op een echt
  toestel geverifieerd; de sandbox heeft geen browser. Dat is de
  eerstvolgende teststap voor Martijn (acceptatie P1-A).
- De P0-B-acceptatie op productie (canonical, og:url, robots, sitemap
  tonen het live domein) vergt de env-var in Vercel plus een steekproef
  na deploy.
- De kleurenblind-simulatorcheck (Coblis of Sim Daltonism) is een
  visuele verificatiestap voor Martijn; de ramps zijn wel gekozen uit
  colorblind-veilige families en betekenis is overal redundant.
- VandaagHier toont het wasverdict live; voor fietsen toont hij het weer
  van dit uur als regel, want een fietscijfer vergt een route.
- De OG-image van stad-pagina's is die van de bovenliggende tool
  (bewust: 152 unieke images bouwen is de moeite nog niet waard).

---

## v2.0.0 - "Passaat" - 2026-07-11

**Waarom:** De fietscheck werkt en de motor eronder (locatie, weer, score,
meldingen, sync, PWA) is breder inzetbaar dan een tool. Deze release tilt
de app op naar een merk-hub ("Vandaag wel?") met een toolregister, zodat
een nieuwe weerbeslissing-tool ongeveer een configuratiebestand kost en
alle tools elkaars autoriteit, installaties en meldingen versterken.

**Wat:**
- Merk-hub "Vandaag wel?" met twee naamlagen: hub in lib/brand.js (een
  constante, dus omkeerbaar), toolnamen in het register. De vlaggendrager
  verhuist van / naar /fietsen-naar-werk (met redirect vanaf
  /fiets-naar-werk); de homepage is nu de hub met toolkaarten en de
  windstrip als merkbeeld.
- Gedeelde engine in lib/engine/: wind.js (ongewijzigd verplaatst),
  score.js (generieke pijnscore uit gewogen factoren, plus de gedeelde
  kleurramp), advies.js, locatie.js, weather.js (adapter waarin een tool
  zijn velden declareert, whitelist-gevalideerd), meldingen.js
  (schema-evaluator v2), eenheden.js (i18n-naad).
- Toolregister in lib/tools/ met validatie. Twee werkende tools:
  fiets-naar-werk (patroon A, route; alle v1-features intact) en
  was-buiten-drogen (patroon A, locatie): droogvenster per dag op basis
  van luchtvochtigheid, temperatuur, wind en neerslag, met beste
  ophangblok, geschatte droogtijd, cijfer per dag voor vandaag plus vier
  dagen, en een urenstrip in de signature-vormtaal.
- Gedeelde gebruikersstaat (GebruikerContext): favorieten, routes,
  drempels, synccode en toolmeldingen op elke pagina, met dezelfde
  synccode-account en debounced serversync als v1.
- Granulaire meldingen: per route en per gevolgde locatie-tool een
  klikbaar schema met dagen-chips (ma t/m zo), een of meer tijden, en een
  drempel (altijd, alleen bij cijfer <= grens, alleen bij cijfer >=
  grens), plus een mensentaal-zin onder elk schema. De cron evalueert de
  schema's in Nederlandse wandkloktijd, dedupliceert per route via
  melding_log, en rekent pas bij een match live door. Wasmeldingen
  gebruiken exact dezelfde droogvenster-engine als de browser.
- Cross-platform installatie: beforeinstallprompt afgevangen met een
  eigen kaart (pas na een eerste geslaagde check), iOS-instructie waar
  het event niet bestaat, verbergen bij standalone, hub-manifest met
  app-shortcuts naar beide tools.
- Programmatische SEO: /{tool}/{stad} voor 35 steden met per-stad
  gevarieerde tekst uit echte stadseigenschappen (ligging, provincie,
  buursteden), /van/{a}/naar/{b} route-paren (2 dichtstbijzijnde
  buursteden per stad vooraf gegenereerd, overige geldige paren on
  demand), broodkruimels, BreadcrumbList/WebApplication/FAQPage JSON-LD,
  interne links tussen buursteden en tussen tools, en een automatische
  sitemap uit register maal steden plus paren.
- Nieuw designsysteem (niet AI-achtig): koele Hollandse-luchtbasis in
  plaats van creme, zes benoemde kerntokens (lucht #E9EEF3, wolk #FFFFFF,
  inkt #17222C, delfts #234E9D, plus het vaste oordeel-trio groen
  #15803D / amber #B45309 / rood #B91C1C), Archivo Variable als
  karaktervolle display-letter (via fontsource, offline), tabulaire
  cijfers, een consistente SVG-icoonset in plaats van emoji, en de
  windstrip als signature: op de hub als geanimeerd merkbeeld (met
  prefers-reduced-motion) en in de wastool hergebruikt als urenstrip.
- Roadmap-naden, bewust niet gebouwd: StemPeiling-component (sociaal,
  par. 12), AdSlot-component en affiliate-veld in de toolconfig plus
  AVG-notitie (par. 13), strings-laag lib/strings/nl.js en eenheden-laag
  (par. 14, gedeeltelijk toegepast op nieuwe en gedeelde UI), en in het
  register gedocumenteerde patroon-B ("welke stad heeft het beste
  terrasweer") en patroon-C ("Vandaag voetbal?", eerst legale databron
  valideren) stubs.

**Breaking / migratie:** Geen datamigratie: localStorage-sleutels
(kopwind.*) en Supabase-tabellen zijn ongewijzigd; v1-meldingsinstellingen
migreren on the fly naar het v2-schema. Wel verhuizen URLs: de fietscheck
staat nu op /fietsen-naar-werk (redirect vanaf /fiets-naar-werk staat in
next.config.mjs; wie / had gebookmarkt komt op de hub met de fietscheck
een klik verderop).

**Tests:** 46 groen (was 24). Nieuw gedekt: generieke score-engine,
droogvenster (regendag, droge dag, resterende uren) met de
cijfer-tekst-consistentie-regressietest, meldingschema v2 (isoDag,
migratie, dagenfilter, meerdere tijden, dedupe, vertrekvenster,
drempelmodi, mensentaal-zin) en registervalidatie.

**Bekende beperkingen:** De SEO-analyse uit par. 10 ontbrak in het
bericht; generieke best practices zijn toegepast en de analyse kan in een
patch-release verwerkt worden. De strings-extractie dekt de nieuwe en
gedeelde UI, nog niet elke bestaande componenttekst. Route-paren zijn
beperkt tot buursteden om de buildtijd gezond te houden (overige paren
renderen on demand). De drempel op routes geldt voor de briefing, niet
voor de vertrekherinnering (bewust: die bevat zelf het actuele weer).
Stadscoordinaten zijn stadscentra; de hoogte-dimensie (Limburg) zit niet
in het fietsmodel. Er is geen analytics; bij monetisatie is eerst een
consent-laag nodig.

---

## v1.0.0 - "Kopwind" - 2026-07-11 (retroactief getagd)

**Waarom:** Schone startlijn voor semantisch versiebeheer.

**Wat:** De fietscheck zoals opgeleverd na vier bouwiteraties: multi-stop
keten met per-segment kopwindberekening (v maal cos van windrichting min
rijrichting, meteo-conventie), uurgekoppeld weer (Open-Meteo),
alternatieve routes (OSRM/ORS) met routekeuze zonder herfetch, rapportcijfer
met consistente redenen, kaart met kleurramp en windpijlen, opgeslagen
routes en favorieten, vertrekmodus "nu"/vertrek/aankomst, synccode zonder
account (Supabase, sha256-hash), server-push met VAPID en externe
5-minuten-cron, PWA (manifest, service worker, gegenereerde iconen) en
basis-SEO (metadata, robots, sitemap, FAQ en WebApplication JSON-LD).

**Breaking / migratie:** n.v.t. (startlijn).

**Tests:** 24 groen (wind, advies, planner, meldingen v1).

**Bekende beperkingen:** iOS-push vereist iOS 16.4+, beginscherm en HTTPS;
de 5-minuten-klok kan een melding enkele minuten verschuiven; de synccode
is het enige geheim (geen herstel); installatie-instructie was iPhone-only
(opgelost in v2.0.0).

---

## Archief: gedetailleerd bouwlog van de v1-iteraties

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

---

## Iteratie 4 (11 juli 2026): synccode, iPhone-push, meldingen per route, demo eruit

1. iPhone-meldingen. Kan sinds iOS 16.4, maar alleen als echte server-push naar een PWA die vanaf het beginscherm draait. De scheduler-in-een-open-tabblad is daarom vervangen door een serverketen: manifest plus service worker (public/sw.js) voor ontvangst, web-push met VAPID voor verzending, en een cron-endpoint (app/api/cron/meldingen) dat elke 5 minuten door een externe gratis klok (cron-job.org) wordt aangeroepen, omdat Vercel-cron op het gratis plan maar 1x per dag mag. NotificationManager (client) is verwijderd. Iconen worden gegenereerd met scripts/maak-iconen.mjs (pngjs, geen designtool nodig).

2. Synccode in plaats van accounts. POST /api/sync maakt een code (8 tekens zonder verwarrende letters, bv. K7QX-2MP9); de server bewaart alleen de sha256-hash, dus de code is het geheim en het account tegelijk. GET/PUT synchroniseren een jsonb-blob (presets, routes, drempels) met last-write-wins; de client laadt bij het opstarten van de server en pusht wijzigingen debounced. Supabase free tier via de REST-laag met de service-role key, bewust zonder supabase-js (fetch volstaat, scheelt een dependency). Schema in supabase/schema.sql, RLS aan zonder policies zodat alleen de server erbij kan. Bijvangst: de 5-minuten-cron houdt het gratis Supabase-project actief (dat pauzeert anders na een week stilte).

3. Meldingen per route. De meldinginstellingen zijn verhuisd van globaal naar per opgeslagen route (route.meldingen: ochtend, ochtendTijd, vertrek, vertrekMinuten), instelbaar in het Meldingen-paneel. De cron rekent per profiel per route: kloktijden naar vandaag, vertrektijden offline via gecachte reistijden (route.durations; ontbreken ze, dan haalt de server ze eenmalig op en schrijft ze terug in het profiel), dedupe via de melding_log-tabel met insert-die-duplicaten-negeert (sleutel bevat datum plus routenaam, dus twee routes botsen niet), en pas als er echt iets te sturen valt wordt het volledige plan met actueel weer doorgerekend via dezelfde pijplijn als de browser (serverFetch in lib/server/externe.js vangt de interne API-paden af). Tijdzone: de server draait in UTC, alle logica rekent in Nederlandse wandkloktijd via nuAmsterdam().

4. Route-opslaan bewaart nu ook de reistijden van het laatste plan en behoudt bestaande meldinginstellingen bij overschrijven.

5. Demo eruit. Knop en demo-tekst verwijderd; lib/demo.js blijft bestaan omdat de integratietests erop draaien.

6. Actualiteit zichtbaar gemaakt: onder de resultaten staat "Weerdata: Open-Meteo uurvoorspelling, live opgehaald om HH:MM. Routes: OpenStreetMap." Het weer wordt bij elke berekening en elke melding vers opgehaald; routes en adressen volgen OpenStreetMap met dagen tot weken vertraging.

7. API-hygiene: route- en weerlogica verhuisd naar lib/server/externe.js (gedeeld door API-routes en cron), synccodes in lib/server/codes.js (route-bestanden mogen alleen handlers exporteren), en de test-push-route heet /api/push/testmelding omdat de Node-testrunner mappen met de naam "test" als testbestanden oppakt.

Eerlijke beperkingen: iOS-push vereist iOS 16.4+, beginscherm-installatie en HTTPS; Apple kan pushbezorging bij lage batterij of focusmodi vertragen. De 5-minuten-klok betekent dat een melding tot een paar minuten kan verschuiven. De code is het enige geheim: kwijt is kwijt (bewust, geen accounts). Bij publiek gebruik op schaal worden de fair-use grenzen van OSRM en Photon het eerste aandachtspunt (dan: ORS-key of zelf hosten).

Tests: 24 groen (nieuw: routeprefix in de dedupe-sleutels). Build geslaagd, inclusief manifest.webmanifest, iconen, sw.js en alle nieuwe API-routes.

## v2.2.0 "Zephyr" - 2026-07-12

### Waarom
De live-test van Mistral legde vier dingen bloot: het wascijfer strafte "te laat op de dag" alsof het slecht weer was (een 2,8 om 18:24 op een kurkdroge dag), de installkaart verscheen niet op de telefoon, opgeslagen routes stonden onder de wascheck en het hub-cijfer was op donkere rampkleuren onleesbaar. Daarnaast de geconsolideerde brief: Coolblue-toon overal, een weerbasis met overlays zodat nieuwe tools goedkoop worden, nav-deeplinks, een rijkere landing en de eerste catalogus-uitbreiding met een harde kwaliteitslat (cijfer, tijdvenster, reden, actie, meldingen).

### Wat
- **Weerbasis + overlay-architectuur.** `lib/engine/weerbasis.js` normaliseert de uurvoorspelling (incl. bewolking, uv, dag/nacht) tot basis-uren; alle locatie-tools vragen dezelfde `BASIS_VELDEN` op en delen daardoor de clientcache van tien minuten in `haalWeer`. Een tool is nu een overlay-functie plus teksten: `overlay(hourly, nu, instellingen)` levert per dag conditie, status, venster, strip-uren en een metric. De cron gebruikt exact dezelfde overlay voor briefings, dus elke nieuwe locatie-tool krijgt meldingen gratis.
- **Wascheck: conditie los van de klok.** Het cijfer beoordeelt de omstandigheden over de hele bruikbare dag (droogsnelheid uit vocht, temperatuur, wind en zon via `lib/engine/drogen.js`; ankers: warm/luchtig/droog/zon rond de 10, droog maar koel/vochtig 6 tot 7, nat laag). Een aparte tijd-bewuste status zegt of je het nu nog redt: "hang 'm nu op, rond 15:30 droog", "vandaag te laat, morgenvroeg lukt het wel" of "buiten wordt 'ie vandaag niet droog". De geschatte droogtijd staat er letterlijk bij. Consistentie-cap: past de droogtijd in het venster, dan zegt het label nooit "binnen drogen" terwijl de status "hang op" adviseert.
- **Twee nieuwe checks.** Terras (beste terrasuren, zon-vanaf, wind-gaan-liggen, instelbare gevoels- en windgrens) en kleding (laagjes-advies per dagdeel op gevoelstemperatuur, meeneem-advies voor vanavond, regen-timing, comfortcijfer). Beide met eigen content, FAQ, instellingen, stad-pagina's en meldingen.
- **Nav-deeplinks.** `lib/engine/navigatie.js` + `NavKnoppen`: na een fietscheck open je de route in Google Maps (officieel schema, fietsmodus, waypoints) of Apple Maps (klassiek schema, `dirflg=c`). Config-gestuurd via `vervoer` in het register; auto/motor krijgt later dezelfde helper plus Waze.
- **UI.** Header met meldingen en instellingen als icoontjes rechtsboven (44px-tikdoel op mobiel), per-tool watermerk in de hero, gedeelde `LocatieTool`-resultaatweergave (VerdictBadge, statusregel, dagkiezer met cijfer plus een regel, gelabelde urenstrip met venster-markering en streeppatroon voor natte uren), hub-cijfer met contrastbewuste tekstkleur, mobiel-eerst pass (bottom-sheet modals, scrollbare nav, tikdoelen, geen h-scroll).
- **Hub en site.** Belofte-zin, catalogus gegroepeerd (Elke dag / Onderweg / Rondom huis) met diepte-zin per kaart en teasers (barbecue, word-ik-nat, krabben), uitleg-cluster met vier artikelen in gewone taal, footer, en pagina's over/bronnen/changelog/privacy/voorwaarden (privacy noemt GA4 expliciet). Sitemap uitgebreid. Installcopy en alle knoppen in Coolblue-toon met het vaste patroon "Check je rit / Check de was / Check je outfit / Check het terras".

### Breaking
- `berekenDroogdagen` levert de nieuwe dag-shape (`conditie`, `status`, `droogtijd`, `metric`, strip-`uren`); `oordeel`/`samenvatting`/`uurDroogkracht` bestaan niet meer. `WasTool` is vervangen door de generieke `LocatieTool`.

### Tests
77 groen, waaronder de vier acceptatiescenario's uit de brief (18:24-geval conditie >= 8 met status te-laat en morgenvroeg-hint; warm/winderig/droog 9 tot 10; koel/vochtig/droog 6 tot 7 met traag-uitleg; regendag <= 3), spreiding over vijf dagen, de consistentie-cap, droogsnelheid-gedrag, terras- en kledingankers en de deeplink-formaten.

### Bekende beperkingen
- Devicetests liggen bij Martijn: installkaart op Android/iPhone, push end-to-end, en of Apple Maps `dirflg=c` op iOS echt de fietsmodus opent (onbekende vlaggen negeert Maps; dan opent de route in je voorkeursmodus). Apple's URL-schema kan geen tussenstops aan; die route gaat van start naar eind, met uitleg in de UI.
- De drempel werkt bewust niet op de vertrekherinnering (besluit uit v2.0.0): een herinnering is een afspraak met jezelf, geen advies.
- Kleurcontrast is per rampkleur berekend (WCAG), maar de kleurenblind-simulator-check op echte schermen is een visuele taak voor Martijn.
- Het comfortcijfer van de kledingcheck beoordeelt hoe makkelijk de keuze is, niet hoe lekker het weer is; dat staat in de instellingen-uitleg maar kan gebruikers verrassen.
- BBQ, regen-timing en gladheid zijn teasers, nog geen tools; de brief-batches 2 en 3 zijn de logische volgende stap op dezelfde overlay.

## v3.0.0 "Levante" - 2026-07-13

### Waarom
Twee kritische reviews (homepage en site-breed) plus de redesignbrief: de site voelde als hetzelfde sjabloon vier keer ingevuld, de copy leunde op een steeds terugkerende retorische truc, cijfers overal maakten het minder menselijk, de homepage was een longread en het sociale aspect ontbrak. Daarnaast het SEO-playbook als lat en een echte bug: dubbele title-suffix op alle nieuwe pagina's.

### A. Homepage-concept
Compact en beslissingsgericht: een zin hero, dan de HubGrid waarin elke check-kaart het live antwoord van vandaag toont (Ja/Nee plus schaalwoord in een kleurbadge, een regel met het moment, een echte knop). Stad kiezen volstaat; geolocatie snapt naar de dichtstbijzijnde stad. Binnenkort-checks staan gedimd met badge in een aparte rij. Uitleg- en cijferblokken zijn van de homepage af (een verwijzing naar /uitleg blijft), de FAQ is teruggebracht tot vier korte vragen. De demo-windstrip is weg uit de hero; die vormtaal leeft in de fietscheck zelf.

### B. Copy-richting
Eerst het antwoord, dan de toelichting. Het verdictmodel praat in Ja/Nee plus vijf schalen (Zeer slecht, Matig, Twijfelachtig, Goed, Ideaal); het interne pijncijfer blijft de motor voor schaal, kleur en drempels maar komt nergens meer in beeld. Site-brede sweep: het "niet X, maar Y"-patroon is teruggesnoeid tot een bewuste merkzin op /over, alle cijfertaal in content, FAQ's, instellingen-uitleg en over-pagina is herschreven naar woorden, kaart-tweede-regels beschrijven meerwaarde in plaats van de vraag te herhalen, en de vier identieke artikel-afsluiters zijn per artikel een eigen verwijzing geworden. Terras- en kledingcontent volledig herschreven, wascontent opnieuw opgezet met gededupliceerde FAQ.

### C. UX en UI
VerdictBadge toont Ja/Nee plus schaalwoord (groen, oranje, rood); de dagkiezer toont per dag Ja/Nee of het schaalwoord met een kleuraccent. De kledingcheck kreeg een emoji-outfitfiguur (laagjes-stack, paraplu bij buien, gevoelsrange ernaast). Duimpjes onder elk advies: klopte het vandaag, met totalen na je eigen stem of vanaf drie stemmen. Meldingsdrempels kiezen nu in woorden ("bij Goed of beter"), opgeslagen cijfergrenzen blijven compatibel. Stedenlijsten zijn een uitklap onderaan de check, de zoekbalk hint per tool dat een stad genoeg is, en de header-navigatie gebruikt een naamgeving die matcht met de kaarten.

### D. Geschrapt of vervangen
Cijfers uit de complete UI (badge, dagkiezer, banner, kaart-popups, meldingen, cron-titels). VandaagHier vervangen door HubGrid. De groepsindeling Elke dag/Onderweg/Rondom huis van de homepage af. De dubbele vraag-subtitels op kaarten. De vaste artikel-afsluiter. De Base64-link-claim uit de review is onderzocht en niet gereproduceerd: alle hrefs zijn gewone URL's; vermoedelijk zag de reviewer de RSC-payload van Next.js aan voor obfuscatie.

### SEO (playbook toegepast)
Title-template levert het merk nu exact een keer (bug gefixt op alle info-, uitleg-, tool- en stadpagina's), Organization-schema site-breed, BreadcrumbList-schema in het kruimelpad, WebApplication- en FAQPage-schema stonden er al en de FAQ bleef identiek aan de zichtbare tekst, llms.txt in public/, en de GA4-tag rendert nu gegarandeerd door het meet-ID als fallback in de code te zetten (Google's tagcontrole faalde omdat de Vercel-env ontbrak). Changelog-datums blijven echt: het playbook verbiedt freshness-manipulatie, en vier versies in twee dagen is gewoon de waarheid.

### Sociaal: duimpjes
Anonieme stem per apparaat per tool per dag via /api/stem op de bestaande server-side Supabase-helper (service key, geen supabase-js of @supabase/ssr nodig; de aangeleverde publishable-key-setup is voor sessies en auth en die hebben we niet). Eenmalig in Supabase draaien:

```sql
create table if not exists stemmen (
  id bigint generated always as identity primary key,
  tool_id text not null,
  dag date not null,
  stem smallint not null check (stem in (-1, 1)),
  apparaat text not null,
  created_at timestamptz not null default now(),
  unique (tool_id, dag, apparaat)
);
alter table stemmen enable row level security;
```

Geen policies nodig: de service key op de server omzeilt RLS, en de tabel is daardoor dicht voor directe client-toegang.

### Breaking
VerdictBadge-API is nu { score, ja }. Overlay-dagen hebben een antwoord-veld ({ ja, zin }) en de kledingcheck een outfit-veld. fmtCijfer wordt nergens in de UI meer gebruikt.

### Tests
80 groen: schaalgrenzen en kleuren, Ja/Nee-antwoorden per acceptatiescenario, outfit-velden, plus de bestaande 77.

### Bekende beperkingen
- De stemmen-tabel moet eenmalig in Supabase worden aangemaakt (SQL hierboven); tot die tijd verbergt de component zichzelf netjes (503 van de API).
- Duimpjes en het outfitfiguur verdienen een devicetest; emoji-weergave verschilt per platform.
- Google's tagcontrole opnieuw draaien na deploy; de tag staat nu hard in de HTML.
- De sandbox kan niet live bij Supabase of GA; end-to-end verificatie is een deploy-taak.

### Patchronde na live-test (zelfde dag)
- **Fietscheck-crash gefixt.** LegCard en MapView gebruikten schaalVoor zonder import: mijn eerdere patch injecteerde de import via een replace zonder assert die stil niet matchte. Build bleef groen (client-componenten renderen pas bij interactie), live crashte de rit-weergave met een ReferenceError. Imports toegevoegd, ongebruikte fmtCijfer-imports opgeruimd, en de werkwijze aangescherpt: elke patch-replace krijgt een assert.
- **Stedenlijst als eerste blok onder de tool** (uitklapbaar), en het min-teken bij openklappen gefixt: CSS-escapes zijn \2212, niet \u2212.
- **Merknotatie:** koppen en lopende tekst met hoofdletter; alleen het logo-woordmerk linksboven blijft bewust klein als beeldmerk.
- **Privacy noemt de duimpjes:** wat we bewaren (check, datum, stem, random apparaatcode), waarom, en wat er niet aan vastzit.
- **Kleuren:** elke check heeft nu een eigen gedempte accentkleur (fietsen staalblauw, was teal, kleding katoengroen, terras terracotta) op kaartrand, icoon en watermerk; dat doorbreekt het leisteen-geel-monotone zonder het palet om te gooien.
- **Homepage-kaarten volledig klikbaar** met het tool-watermerk als visualisatie in de kaart; de CTA-knop is een visueel element binnen de link geworden.
