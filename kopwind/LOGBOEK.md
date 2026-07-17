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

### Tweede fietscheck-crash (KleurLegenda) plus een vangnet
- **Oorzaak:** LegCard (de rit-kaart in de fietscheck) rendert een KleurLegenda voor de windschaal, maar de import ontbrak. Zelfde klasse fout als de schaalVoor-crash: onzichtbaar in de build, hard client-side bij interactie. Import toegevoegd.
- **Vangnet toegevoegd** zodat deze fout niet meer ongemerkt in een zip belandt: scripts/check-jsx-imports.mjs scant components/ en app/ en faalt als een <Hoofdletter-component niet geimporteerd of lokaal gedefinieerd is. Draait via `npm run check:imports` en hoort vanaf nu bij de release-check, naast `npm test` en `npm run build`. Een brede scan bevestigde dat dit de laatste ontbrekende import was.

## v3.1.0 "Chinook" - 2026-07-13

### Waarom
De vervolgbrief met concrete copy- en UI-voorstellen: tool-eigen resultaatwoorden in plaats van generieke schalen, "Kan ik vandaag ..." consequent doorgetrokken, Nederland als standaardlocatie, instellingen in mensentaal, warmere sync-copy en een minder template-achtige kaartstijl. Plus een venijnige vondst tijdens het bouwen.

### Wat
- **Tool-eigen verdictwoorden.** Elke check heeft nu vijf eigen schaalwoorden in het register (schaalLabels), gemapt op de interne vijfschaal: de was zegt "Hang maar op" tot "Binnen houden", fietsen "Ideale fietsdag" tot "Beter van niet", terras "Heerlijk terrasweer" tot "Geen terrasdag", kleding "Makkelijke keuze" tot "Gure dag". De losse Ja/Nee-badge is vervallen: het label is het antwoord (de aangeleverde resultaatstijlen tonen ook geen Ja/Nee), de status-zin blijft het wanneer en hoe vertellen. Doorgevoerd in badge, dagkiezer, fietsbanner, rit- en kaartpopups en pushmeldingen; de meldingsdrempel-woorden blijven generiek. De vier aangeleverde labels per tool zijn aangevuld met een vijfde tussenwoord in dezelfde toon.
- **Nederland als startpunt.** Wie de homepage opent zonder eerdere keuze ziet direct live antwoorden voor Nederland (De Bilt als landelijk referentiepunt), met vaste chips Nederland, Amsterdam, Rotterdam, Utrecht en Den Haag. Persoonlijke presets blijven in de checks zelf.
- **Nieuwe vraagnamen.** "Kan ik vandaag fietsen?", "Kan de was vandaag buiten?", "Wat trek ik vandaag aan?" (met advies-tag), "Kan ik vandaag op het terras zitten?", doorgetrokken in kaarten, h1's, footer en subregels ("Zon, wind en temperatuur zonder gedoe").
- **Instellingen in mensentaal.** Nieuw veldmodel: keuzeknoppen met een vraag ("Hoe gevoelig ben je voor wind?" met Nauwelijks/Gemiddeld/Best snel) die intern de bestaande drempels zetten; technische velden zoals segmentlengte staan achter een Geavanceerd-uitklap. Een registertest bewaakt dat elke keuze-set een middenstand heeft die exact de standaardwaarden is.
- **Warmere copy** voor synccode ("We werken zonder account, dus deze code kunnen we niet voor je terughalen") en een meldingen-intro in gewone taal. Hero werd "Kan ik vandaag ..." met een regel eronder; de binnenkort-vakken zijn nu een regel tekst.
- **Kaartstijl.** De dunne kleurstreepjes en fletse watermerkjes zijn vervangen: elke kaart heeft een lichte tintachtergrond in de toolkleur, een icoon-chip en een groot watermerk met aanwezigheid. De hele kaart is en blijft klikbaar.

### Gevangen tijdens het bouwen
De cron-route gebruikte schaalVoor zonder import: een eerdere patch-guard ("alleen importeren als schaalVoor nog niet voorkomt") keek per ongeluk na de title-replace en sloeg de import over. Elke tool-briefing zou serverside zijn gecrasht. Gefixt, en het vangnet is uitgebreid: check-jsx-imports controleert nu naast JSX-componenten ook een lijst gedeelde helperfuncties (schaalVoor, labelVoor, fmt-functies, enzovoort) op gebruik zonder import. De nieuwe check vond de bug zelf terug voordat de fix erin zat.

### Keuzes
- Engels is bewust doorgeschoven naar een eigen release (routing, vertaalde content, hreflang; half Engels is erger dan geen Engels).
- Logo-richting staat open tot Martijn een kant kiest; de kaartstijl is de eerste stap weg van het template-gevoel.
- Nederland is technisch De Bilt; eerlijk benoemd in de code.

### Tests
80 groen, inclusief de nieuwe middenstand-check op keuze-velden en labelVoor via de bestaande schaaltests.

### Bekende beperkingen
- De kleurrichting (tinten, accenten) verdient een blik van Martijn op echte schermen; richting bijsturen kan zonder structuurwerk.
- color-mix vereist een moderne browser (alles vanaf 2023); de kaart valt zonder terug op wit met standaardrand.
- Instellingen-migratie: bestaande afwijkende drempelwaarden matchen geen keuzeknop en tonen dan geen actieve keuze; de waarden blijven gewoon werken.

## v3.2.0 "Sirocco" - 2026-07-13

**Wat**: de Engelse release plus een nieuwe barbecuecheck.

**Merk en markt**: de Engelse site heet "Good day for it?". "Can I
today?" is overwogen en afgewezen: het is geen lopend Engels. De
per-toolvragen gebruiken wel het patroon "Can I ... today?" (bike,
barbecue), want dat is per werkwoord wel idiomatisch. Doelmarkt is
dezelfde 35 Nederlandse steden: expats en internationals in NL zoeken in
het Engels op hetzelfde weer. Zoekvolume is kleiner dan NL maar de
concurrentie op "bike to work weather netherlands"-achtige vragen is
vrijwel nul.

**Architectuur**: één codebase, taal gebakken bij de build via
NEXT_PUBLIC_SITE_LOCALE (lib/i18n/locale.js, helper `kies({ nl, en })`).
Geen runtime-switch: elke deployment is volledig eentalig, wat SEO
(één taal per domein), bundelgrootte en eenvoud wint. Tweede
Vercel-project op dezelfde repo met drie env-vars (locale, site-URL,
eigen GA-ID). Engelse paden (/explainers, /about, /sources, /terms)
lopen via rewrites naar de fysieke Nederlandse mappen; interne links en
canonicals altijd via PAD (lib/i18n/paden.js). llms.txt werd een route
die per taal uit het register genereert.

**Barbecuecheck**: avondgericht venster (16:00-22:00), droog telt
zwaarder dan warm (neerslag maakt een uur hard 0), en als uniek element
het rook-advies: dominante windrichting in het beste blok via
vectorgemiddelde (zodat 350 en 10 graden noord middelen) en de zin waar
je de tafel niet neerzet. Juli-timing is bewust: seizoenspiek.

**Meegefixte bug**: stadpagina's van kleding en terras gebruikten de
was-titeltemplate; er zijn nu templates per tool per taal.

**Valkuilen deze ronde**: (1) naamconflict: HubGrid had al een lokale
`kies` (plek-kiezer), de i18n-import shadowde en de homepage crashte op
prerender; import hernoemd naar kiesTaal. Les: bij een generieke
helpernaam eerst greppen op bestaande lokale namen. (2) Een
fallback-anker in een patchscript plaatste een kanarie-import die de
fietstool brak; ankers eerst verifiëren, injecteren na de laatste
importregel. (3) Substring-collateral: een regex op KLEUR[ raakte ook
BADGE_KLEUR[.

**Bewust niet gedaan**: het route-parencluster (/van/.../naar/...) is
NL-only gehouden (op EN niet gebouwd, niet in de sitemap); Engelse
tegenhanger (/from/.../to/...) is een vervolgstap als de EN-site
tractie toont. De stemmen-tabel in Supabase wordt gedeeld tussen beide
sites (zelfde tool_id per check); prima voor nu, splitsen kan later op
site-kolom.

**Beperkingen**: domein voor de EN-site moet nog gekozen en gekocht
(gooddayforit.com als eerste kandidaat), een native copyreview van de
Engelse teksten is aan te raden, en de EN-site heeft een eigen
GA4-property nodig (anders meet de fallback alles in de NL-property).

## v3.3.0 "Meltemi" - 2026-07-13

**Wat**: de UX- en consistentieronde na de NoorYES-benchmark, plus de
zonkrachtcheck als zesde tool.

**Benchmark-conclusies (samengevat)**: NoorYES wint op vraag-per-URL-SEO,
dagdeel- en situatie-advies en consequente interne links; wij winnen op
de per-uur engine met persoonlijke drempels, de routegebaseerde
fietscheck, tijdvensters als antwoord, meldingen/PWA en stad-pagina's.
Volledige analyse in de chat van deze datum; de v3.4-backlog volgt eruit.

**Kaartstramien**: elke hub-kaart is nu identiek opgebouwd: rij 1 met
icoon-chip, korteVraag en de verdictbadge rechts; rij 2 een toelichting
uit de engine, geklemd op exact twee regels (min-height, line-clamp);
rij 3 de tool-eigen CTA als tekstlink. Drie CTA's per kaart is bewust
afgewezen (prikkerij op mobiel); de hele kaart is klikbaar. Het
watermerk blijft op Martijns verzoek en zit rechtsonder achter de
tekst, weg van de badge.

**Zonkracht**: score is een omgekeerde as (veel uv = hoge pijnscore =
rode badge als waarschuwing). Antwoord beantwoordt "moet ik smeren?"
met ja vanaf zonkracht 3 (GGD/KWF-grens). Verbrandtijd is een
transparante vuistregel (basisminuten per huidtype gedeeld door de
zonkracht) en de FAQ zegt eerlijk dat smeren eigenlijk altijd
verstandig is; de check vertelt wanneer het dringend is. uv_index zat
al in BASIS_VELDEN, dus geen architectuurwijziging.

**Navigatie**: topnav-tekstlinks weg; hamburger opent een zijpaneel met
de registergroepen (Elke dag, Rondom huis, Onderweg), uitleg, over en
de taalwissel. Groepslabels lopen via S.menu.groepen zodat de Engelse
site meeschakelt.

**Taal onder een domein**: besluit met Martijn: geen apart .com-domein
maar en.kanhetvandaag.nl als tweede Vercel-project op dezelfde repo.
Een runtime-taalknop is afgewezen: elke taal heeft eigen URL's nodig
voor indexering en de architectuur bakt de taal bewust bij de build.
De taallink in menu en footer leest NEXT_PUBLIC_ALTERNATE_LOCALE_URL.

**Laatst bijgewerkt**: bewust een echte datum (register-veld
`bijgewerkt`, handmatig bumpen bij inhoudelijke wijzigingen), geen
dagelijks ververste nepdatum; Google herkent dat en de
weerdata-versheid tonen we al per check.

**Beperkingen**: het kaartstramien is in de sandbox niet visueel
getest op echte devices; de deelknop gebruikt Web Share en is alleen
op https te testen; de stemmenteller toont pas iets bij echte stemmen
in Supabase.

**Afspraak**: na v3.4 volgt een nulmeting plus installatie-audit
(API's, meldingen, GA, Search Console) in een aparte sessie.

**v3.4-backlog (akkoord)**: hooikoortscheck op de Open-Meteo Air
Quality API (CAMS, gras/berk/els, eerlijk "geen pollen" buiten het
seizoen), /alle-checks met zoek en categorieen die later uitbreiden
naar sporten, eten en camperen/buitenactiviteiten, drie
kleding-vraagpagina's (korte broek, jas, T-shirtweer) met stad-uitrol,
sticky antwoordbalk op mobiel.

## v3.4.0 "Ponente" - 2026-07-13

**Wat**: de vervolgronde na Meltemi. Vijf feedbackpunten van Martijn plus
de v3.4-backlog (hooikoorts, /alle-checks, kledingvraagpagina's).

**Toelichting bij elk oordeel**: de redenen werden al gerenderd, maar
sommige overlays gaven bij hun hoofdfactor `reden: null` (terras,
barbecue, kleding), waardoor een oordeel zonder uitleg kon verschijnen.
Nu heeft elke tak een leesbare reden: matig blok met gevoel en wind bij
terras/barbecue, flinke dagschommel bij kleding. De regel staat als
"Waarom: ..." onder het antwoord.

**Auto-run**: bij een bekende plek (uit localStorage) draait de check
direct bij het openen, zonder tweede tik. Guard via een useRef zodat
React strict mode hem niet dubbel vuurt. Alleen locatietools; de
routetool (fiets) blijft handmatig, want daar moet je eerst stops
invullen.

**Feedbackbug**: StemPeiling verborg zichzelf (`return null`) zodra de
totalen-fetch faalde, en zonder geconfigureerde Supabase faalt die
altijd, vandaar het wegflitsen. De knoppen blijven nu staan; alleen de
teller ontbreekt als er geen database is. De stem blijft altijd lokaal
bewaard.

**Hooikoorts**: eerste tool op een tweede databron. lib/engine/lucht.js
plus app/api/lucht/route.js praten met de Open-Meteo Air Quality API
(CAMS Europa, 11 km, gras/berk/els). De tool declareert
`databron: "lucht"` en LocatieTool kiest op dat veld de juiste helper.
Het venster is omgekeerd (rustigste blok, niet beste), klassegrenzen
zijn vuistregels per soort, buiten het seizoen zegt de check eerlijk
"geen pollen". Geen medisch advies, staat in de FAQ.

**Kledingvraagpagina's**: lib/varianten.js definieert lichte varianten
op een oudertool (eigen slug, titel, content, bijgewerkt-datum; gedeelde
engine). vindTool lost een variant-slug op naar een pseudo-tool via
maakPseudoTool, en generateStaticParams gebruikt alleToolSlugs(). Zo
zijn /korte-broek-weer, /jas-aan-of-uit en /t-shirt-weer eigen
SEO-landingspagina's zonder engine-duplicatie. Bewust nog geen
stad-uitrol voor varianten (dat verdriedubbelt de paginacount; kan in
3.5 als ze ranken).

**/alle-checks**: content/beslissingen.js is de catalogus met zes
categorieen (regen, kleding, buiten, sport, huis, onderweg), elk met
live checks (klikbaar) en geplande vragen (grijs, wel in de DOM voor
SEO). BeslissingenLijst filtert client-side op vraag plus synoniemen.
De categorieen zijn bewust breder dan het aanbod zodat sport, eten en
buitenactiviteiten hier later in groeien, zonder NoorYES exact te
kopieren.

**Engels onder een domein**: besluit met Martijn uitgevoerd. Geen apart
.com meer: de EN-build draait met basePath /en (eigen Vercel-project),
en het NL-project stuurt /en via multi-zone rewrites (EN_ZONE_URL) naar
dat project. Zo staat de Engelse site op kanhetvandaag.nl/en/, met eigen
URL's voor indexering. SITE_URL-default voor EN is nu kanhetvandaag.nl/en.

**Mobiel**: checks als vierkante tegels in twee kolommen (aspect-ratio
1/1, CTA verborgen want de hele tegel is klikbaar), en een sticky
antwoordbalk die na een check bovenin blijft met verdict plus venster.

**Beperkingen**: pollendata is alleen gevuld in het seizoen (CAMS geeft
buiten het seizoen nul, de tool vangt dat op); de Air Quality API is in
de sandbox niet bereikbaar, dus live pollen pas op Vercel te testen;
vierkante tegels en sticky balk zijn niet op echte devices getest.

**Afspraak**: hierna de nulmeting plus installatie-audit (API's,
meldingen, GA, Search Console, env-vars) in een aparte sessie.

## v3.5.0 "Tramontane" - 2026-07-13

**Wat**: het fundament voor de storefront-strategie, plus twee concrete
verbeteringen (weerfactoren-balken, cron-fix). Affiliate bewust nog niet;
eerst de structuur.

**Storefront-besluit (met Martijn)**: de CATEGORIE wordt de storefront,
niet de losse tool. Twee affiliate-lagen (later): breed op de categorie,
specifiek op de toolpagina. Een domein, een engine. Zie BACKLOG.md voor
de volledige redenering, categorie-indeling en vraagvariant-lijst.

**Categorie-architectuur**: lib/categorieen.js definieert vijf
categorieen (buiten, kleding, huis-tuin, onderweg, gezondheid), elk met
slug, intro, icoon en kleur. Elke tool kreeg een categorieId in zijn
config; toolsInCategorie() verzamelt ze. Routes: /c (overzicht) en
/c/<slug> (detail met de tools plus bijbehorende varianten). In het menu
is de groepskop nu een klikbare categorielink, en de categorien staan in
de sitemap. Dit is bewust nog een nette overzichtspagina, geen etalage:
in v3.6 groeit /c/<slug> uit tot de storefront met gidsen en FAQ, in
v3.7 komt de affiliate.

**Waarom /c/ als prefix**: houdt de categorie-namespace gescheiden van
de tool-slugs (die op de root staan, /terrasweer etc.), zodat een
categorie en een tool nooit botsen.

**Weerfactoren-balken**: lib/engine/factoren.js is een BEWUST aparte
uitleg-laag, los van de overlays. De overlays berekenen het echte,
zwaar geteste oordeel; deze module leest dezelfde ruwe uurdata en geeft
per factor een 0-100 gunstigheidsscore plus een gewicht, voor de balken
onder het antwoord. Per tool een weegprofiel (terras weegt temp 45 /
wind 25 / zon 20 / droog 10, was weegt vocht 40 / wind 30, etc.). De
balken rekenen over het beste blok als dat er is, anders de daglichturen.
Kleine afwijkingen van het exacte oordeel zijn acceptabel: dit is
toelichting, geen tweede waarheid. Hooikoorts heeft geen profiel (eigen
databron, eigen uitleg) en toont dus geen balken.

**Cron-fix (het echte gat uit de nulmeting)**: er was een
meldingen-route maar geen vercel.json, dus de cron draaide nergens
vandaan en pushmeldingen werden nooit verstuurd. Toegevoegd: vercel.json
met een */5-schedule. De route accepteert nu ook Vercels standaard
"Authorization: Bearer <CRON_SECRET>" naast de bestaande x-cron-secret
header, zodat zowel Vercel Cron als een externe cron werkt.

**Nulmeting uitgevoerd**: zie het antwoord in de chat en straks AUDIT.md
(v3.6). Kort: 7 tools, 2 databronnen, alle fallbacks netjes. Env-vars
die Martijn moet zetten voor volledige werking: Supabase (stemmen),
VAPID (push), plus expliciete SITE_URL/GA/GSC. Cron-gat nu gedicht.

**Beperkingen**: factorbalken en categoriepagina's niet op echte devices
getest; de balk-benadering kan licht afwijken van het exacte oordeel
(bedoeld); cron pas te verifieren op Vercel na het zetten van
CRON_SECRET.

**Backlog verplaatst naar BACKLOG.md** (levend document): volledige
categorie- en vraagvariant-lijst, gefaseerd affiliate-plan (v3.7+),
storefront-content-template (v3.6), en de geparkeerde items (voetbal,
stroomprijs-tools).

## v3.6.0 "Bora" - 2026-07-13

**Wat**: de taxonomie-sprint verwerkt en de eerste storefronts gebouwd.
De categorie IS de storefront (rankbare hub), niet de losse tool.

**Taxonomie-sprint (in de chat, met externe SEO-feedback)**: de grootste
valkuil bleek cannibalisatie, niet techniek. Cannibalisatie-matrix
gemaakt: veel regenvragen ("blijft het droog", "word ik nat", "regenjas
aan") zijn dezelfde zoekintentie en worden dus GEEN losse pagina's maar
anchors en FAQ op een sterke hub. Uitkomst: zeven categorien met
beschrijvende root-slugs, hub vangt de brede intentie, alleen echt
aparte intenties (timing, paraplu) krijgen een eigen pagina.

**Zeven categorien op de root**: regen-en-droog, kleding,
buiten-vrije-tijd, sport-beweging, huis-tuin-auto, zon-lucht-hooikoorts,
winter-veiligheid (EN: rain-or-dry, clothing, outdoors-leisure,
sport-exercise, home-garden-car, sun-air-hayfever, winter-safety). Root
in plaats van /c/ voor SEO-kracht; slug-botsing met tools afgevangen
doordat categorie- en toolslugs een namespace delen (valideerRegister).

**Routing-truc**: twee dynamische root-segmenten kan Next.js niet
(/[tool] en /[categorie] botsen). Opgelost door categorie-slugs mee te
laten lopen via de bestaande /[tool]-route: die checkt eerst
vindCategorie en rendert dan <Storefront>, anders de toolpagina.
generateStaticParams levert tool-, variant- EN categorie-slugs.

**Storefront-component**: rankbare hub met tool-kaarten, beslislogica in
gewone taal, situaties per weertype, seizoenscontext en FAQ met
id-anchors (waar de samengevoegde long-tail landt). Categorien zonder
uitgewerkte content tonen alleen de kaarten; alleen Regen en droog is nu
volledig (content/storefronts.js).

**Regen-timing-check** (/wanneer-gaat-het-regenen): eerste tool op een
DERDE databron, de 15-minuten neerslagreeks (minutely_15). Geverifieerd
dat Open-Meteo dit voor Centraal-Europa op DWD ICON-D2 en Meteo-France
AROME levert (echte nowcast, geen interpolatie, Nederland valt hierin).
Nieuwe laag: lib/engine/minutely.js (client-helper plus analyseerMinutely
die eerstvolgende bui, piek, eerstvolgend droog blok en binnen-een-uur
bepaalt), app/api/minutely/route.js, haalMinutely in externe.js. Eigen
client-component RegenTimingTool met dagdeel-samenvatting.

**Paraplu-check** (/paraplu-mee): actie-check die de neerslag naar een
ja/nee-beslissing vertaalt met instelbare buitentijd (kort, uurtje, hele
dag). Eigen component ParapluTool. Draait op dezelfde minutely-laag.

**Gedeelde useLocatie-hook**: de plek-logica (laden uit localStorage,
auto-run, opslaan) is uit LocatieTool getrokken zodat de nieuwe
componenten haar hergebruiken zonder duplicatie.

**Register**: nieuwe tools declareren databron "minutely" en
eigenComponent; de toolpagina kiest daarop de juiste UI. Ze hebben bewust
geen instellingen (nowcast-checks), dus de instellingen-test slaat tools
met eigenComponent over.

**Bouwvolgorde gevolgd** (advies externe AI): eerst hub plus anchors,
daarna de leaf pages. De hub /regen-en-droog is zelf de brede
answer-page; /blijft-het-droog is bewust NIET als losse pagina gebouwd
in fase 1 (zou de hub kannibaliseren), kan later op GSC-data.

**Beperkingen**: minutely_15 is in de sandbox niet te bereiken, dus de
timing- en paraplu-check zijn met mockdata getest (parser) maar live pas
op Vercel; de storefronts van de andere zes categorien tonen nu alleen
kaarten (content volgt); stad-pagina's blijven NL-only.

**Volgende**: tweede storefront Huis, tuin en auto (was bestaat al,
sterkste affiliate-fit), daarna de overige categorien vullen, bijsturen
op GSC-data zodra die binnenkomt. Affiliate blijft fase 5.

## v3.7.0 "Etesian" - 2026-07-13

**Wat**: feedbackronde op de live site plus een belangrijke
productie-diagnose. Tools verder uitgebouwd en SEO merkbreed aangescherpt.

**Feedback en delen (huisstijl)**: StemPeiling gebruikt nu eigen
SVG-duimen in plaats van emoji. Alleen positieve stemmen worden geteld en
getoond (het aantal naast de duim omhoog); een negatieve stem geeft enkel
"Bedankt voor je feedback", geen zichtbaar aantal. De teller telt op
zodra je zelf omhoog stemt. De deelknop is uit de stempeiling getrokken
naar een eigen knop in de huisstijl (Web Share op mobiel, klembord als
fallback).

**Instellingenpaneel opnieuw opgebouwd**: drie secties met eigen kop en
uitleg zodat een leek het meteen snapt. (1) "Stel de checks op jou af":
de toolkiezer staat los, de keuzes eronder in een omkaderd blok met
uitleg wanneer de check op ja/nee springt. (2) "Mijn plekken": favorieten
en routes met verwijderen. (3) "Meenemen naar je andere apparaten": de
koppelcode, met aanmaken, kopieren, invullen en ontkoppelen. De
sync-acties bestonden al in GebruikerContext maar werden nergens getoond;
nu wel.

**Cross-device sync werkt (mits Supabase staat)**: de logica in
GebruikerContext leest bij laden en schrijft debounced weg. Zodra
/api/sync niet meer 502't, staat je telefoon-instelling automatisch op de
computer. De koppelcode in het instellingenpaneel is de ontbrekende
schakel die dit bedienbaar maakt.

**Productie-diagnose (502 op /api/stem en /api/sync)**: de logs toonden
502, wat betekent dat de env-vars deels stonden maar de Supabase-call
faalde. Oorzaak: de tabellen (stemmen, en vooral profielen) bestonden nog
niet. /api/stem logt nu de detailfout. AUDIT.md bevat de volledige SQL
voor beide tabellen plus de complete env- en verificatiechecklist. Dit is
een configuratiestap aan Martijns kant; de code valt correct terug.

**Header sticky**: de leisteen-kopbalk blijft bovenaan bij scrollen
(position sticky, top 8, met schaduw). De mobiele sticky-antwoordbalk
schuift eronder (top 66) zodat ze niet overlappen.

**Visuele afscheiding**: de footer heeft een dikkere leisteen-lijn (2px)
in plaats van de subtiele randkleur. De blokken in /alle-checks hebben nu
kaart-randen: live checks een volle rand met hover-schaduw, geplande
vragen een streepjesrand op wolk-achtergrond, zodat het onderscheid
zichtbaar is.

**Merkbrede SEO-sweep**: tool-titels naar de "Kan het vandaag"-vorm (Kan
het vandaag op het terras, Kan het vandaag barbecueen, Kan het vandaag
fietsen naar werk), en de homepage-H1 plus meta van "Kan ik vandaag" naar
"Kan het vandaag". FAQ-vragen herschreven met het zoekwoord voorin: de
zwakke "Waarom heb ik 's ochtends meer last" werd "Waarom is hooikoorts
's ochtends of 's avonds erger", en zo ook bij zonkracht en kleding.

**Beperkingen**: de sticky header en de nieuwe instel-secties zijn niet
op echte devices getest; de sync- en stemfuncties werken pas na de
Supabase-setup uit AUDIT.md (in de sandbox niet te verifieren).

**Volgende**: tweede storefront Huis, tuin en auto (was bestaat al,
sterkste affiliate-fit), overige categorien vullen, en bijsturen op
GSC-data. Affiliate blijft fase 5.

## v3.7.1 "Etesian patch" - 2026-07-14

**Wat**: Broodkruimel-JSON-LD gefixt na een Search Console-melding
("Ongeldige URL in veld id" in itemListElement.item). components/
Broodkruimel.js levert nu schone absolute URL's (geen dubbele slash,
basePath-veilig) en de laatste crumb zonder href krijgt geen item meer.
Detail-logging toegevoegd op /api/stem (regel "stem GET faalde:") voor de
productie-502. Verificatie in Search Console loopt nog (kan dagen duren).

## v3.7.2 "Etesian patch 2" - 2026-07-14

**Waarom**: Overname van het project door een nieuwe sessie. Eerst een
kritische diagnose van de twee productieproblemen (502 op /api/stem, geen
pushmeldingen) en de rommelige fietstool-output, daarna pas bouwen. Martijn
bevestigde de diagnose op alle punten en gaf akkoord op de fietstool-fixes
(optie B voor de kilometers) en op de cron-aanpak.

**Diagnose 502 /api/stem (nog te sluiten met de probes)**: 502 = de
Supabase-call gaf non-2xx, niet de terugval (503) of validatie (400).
Belangrijk: een anon-key verklaart een 502 op een GET niet, want een SELECT
met RLS aan zonder policies geeft 200 met een lege lijst. Kandidaten:
schema-cache of ontbrekende tabel (404 PGRST205), afwijkende kolom (400),
verminkte key (401), of trailing slash in SUPABASE_URL (dubbele slash). De
gedeployde build stond waarschijnlijk nog op onder v3.7.1 (de response
miste het detail-veld). Martijn pusht v3.7.1 en levert de detail-regel plus
de uitkomst van /api/sync (GET) aan; dan is de oorzaak exact te benoemen.

**Diagnose pushmeldingen (twee oorzaken, allebei bevestigd)**: de
testmelding werkt omdat die direct via push_abos verstuurt, zonder klok,
zonder melding_log, zonder het schema uit profielen.data. De geplande
meldingen hangen aan alle drie. (1) Tabelnaam: de code en supabase/
schema.sql gebruiken melding_log (enkelvoud); Martijn had meldingen_log
(meervoud). De cron-dedupe-insert in die tabel faalt dan met 404, wordt per
route gevangen en in fouten gestopt, dus er vertrekt niets. Martijn hernoemt
de tabel. (2) Klok: het LOGBOEK schreef al een externe cron voor omdat
Vercel Hobby maar 1x per dag draait, maar er stond later een vercel.json met
*/5 in, wat op Hobby bij de deploy faalt (bevestigd via Vercels eigen docs).
Martijn zit op Hobby en had geen externe cron. Besluit: vercel.json crons
leeggemaakt en cron-job.org wordt de enige klok met de x-cron-secret-header.
Sluiten zodra de handmatige cron-curl {gecheckt,verzonden,fouten} laat zien.

**Fietstool opgeschoond (drie bevestigde bugs)**:
- Dubbel verdictlabel: LegCard toonde in de legkop zowel a.advies ("prima
  fietsdag") als het schaalwoord ("Ideale fietsdag"). Overal elders
  (DagBanner, VerdictBadge, route-chips, kaartpopups) staat alleen het
  schaalwoord. Nu de legkop ook: a.advies weg, alleen labelVoor(...).
- Tegenstrijdige kilometers (optie B, bij de bron): painScore emitteerde "X
  km merkbare tegenwind op de route" (de som, matigMeters) terwijl de
  windsamenvatting (summarizeLegNL) de stukken los toont (0,3 km begin, 2 km
  eind). 2,3 tegenover 0,3 plus 2 las tegenstrijdig. De som-reden is
  verwijderd; de samenvatting is nu de enige bron voor het windverhaal. Het
  cijfer verandert niet (de fracMatig/fracZwaar-bijdrage blijft). De
  dagbanner gebruikt voortaan de windsamenvatting van de zwaarste rit
  (dagAdvies.uitleg), met een nette terugval als er geen samenvatting is
  (handmatige test-legs). advice.test.js aangepast: de reden-op-tekst-check
  verviel, een test voor de nieuwe dagAdvies-uitleg toegevoegd.
- "Cijfer gedrukt door" (verwees naar een cijfer dat we niet tonen) is nu
  "Wat telt tegen".

**Bewust niet gedaan**: de "gemiddeld X km/u wind tegen"- en "piek"-redenen
blijven staan (kwantitatief, botsen niet met de kwalitatieve samenvatting).
De fietsadvies-laag blijft NL-only qua redenen en labels, consistent met de
huidige staat en het backlog-item "Engels bijtrekken". De grotere
fietstool-herindeling (ja/nee plus zwaarste rit bovenaan, drempels
expliciet) is fase 2. De kale Maps-URL uit de review reproduceert niet:
NavKnoppen rendert al nette knoppen (het was de RSC-payload).

**Beperkingen**: de sandbox heeft geen netwerk naar Open-Meteo of Supabase,
dus de fietstool-UI en de meldingen zijn hier niet end-to-end getest; alleen
de tests, de import-check en beide builds (NL en EN) zijn groen. De
meldingen worden gesloten zodra Martijn de probe-output aanlevert.

**Bevestigd na de diagnose (deze ronde)**: Martijn gaf expliciet akkoord op
alle drie de fietstool-fixes, bevestigde dat hij de Supabase-tabel
meldingen_log naar melding_log hernoemt (oorzaak 2), en koos ervoor de */5
uit vercel.json te halen en volledig op de externe cron te leunen. Mijn
advies daarop: eruit halen is de juiste keuze, want op Hobby is een cron
vaker dan 1x per dag niet toegestaan en blokkeert de deploy. Dus schadelijk,
niet slechts genegeerd. vercel.json staat al op { "crons": [] }. Aan Martijn
is een stap-voor-stap-instructie voor een leek meegegeven (tabel hernoemen,
v3.7.1 pushen en de detail-JSON ophalen, cron-job.org opzetten, de lege
vercel.json via GitHub Desktop syncen, de cron-curl draaien, /api/sync
checken).

**Volgende**: probes van Martijn (502-detail, sync-GET, cron-curl), dan de
502 en de cron sluiten. Daarna fase 2 fietstool, of de tweede storefront
Huis-tuin-auto. Affiliate blijft fase 5.

## v3.7.3 "Etesian patch 3" - 2026-07-14

**Waarom**: Martijn leverde de probes. De detail-logging staat live en gaf op
/api/stem?tool=terras&dag=2026-07-14 dit terug: PGRST125 "Invalid path
specified in request URL". Daarmee is de 502-oorzaak eindelijk exact te
benoemen in plaats van te gokken.

**Wat PGRST125 is (geverifieerd)**: een pad-probleem. PostgREST krijgt een
pad dat het niet als geldige resource herkent. Het is dus NIET een ontbrekende
tabel (dat is PGRST205, "Could not find the table in the schema cache"), NIET
een kolomfout en NIET auth (dat is 401). lib/server/db.js plakte
SUPABASE_URL en /rest/v1/ direct aan elkaar (`${SUPABASE_URL}/rest/v1/${pad}`),
zonder normalisatie. Een trailing slash in SUPABASE_URL maakt daardoor
"//rest/v1/...", en de Supabase-gateway (die /rest/v1 hoort te strippen)
weigert dat pad. Dit was al de nummer-1-kandidaat uit de eerste diagnose.

**Eerlijke wrijving die ik heb benoemd**: de testmelding leest push_abos via
exact dezelfde url-helper en werkte bij Martijn. Als de basis-URL kapot was,
zou die lezing net zo hard vallen. Dus of de testmelding is niet opnieuw
getest sinds de env-var veranderde, of de basis-URL is schoon en er speelt
iets anders. Om dat te sluiten heb ik Martijn gevraagd de exacte vorm van
SUPABASE_URL te bevestigen (eindigt hij op een slash?) en na de deploy /api/stem
opnieuw te openen. Als de fout dan verandert naar PGRST205, bestaat de
stemmen-tabel niet (de SQL staat alleen in de README, niet in schema.sql) en
moet die alsnog worden aangemaakt.

**Fix (bij de bron, hardening)**: de interne url-helper is hernoemd naar het
geexporteerde restUrl() en strip nu elke trailing slash van SUPABASE_URL met
`.replace(/\/+$/, "")`. Zo kan de dubbele slash niet meer ontstaan, ongeacht
hoe de env-var is ingevuld; harmloos als de waarde al schoon is. tests/db.test.js
toegevoegd als regressie (schone basis, een slash, meerdere slashes, en de
check dat er geen // na de host meer staat). Alle DB-routes delen restUrl, dus
dit raakt stemmen, sync en de meldingen-cron in een keer.

**Meldingen, stand na de probes**: nog niet gesloten. De cron-curl liep nog
niet, want cron-job.org gaf 401 "Geen toegang" (onze eigen secret-check).
Oorzaak: OF CRON_SECRET staat niet in Vercel, OF de header x-cron-secret die
cron-job.org stuurt matcht de waarde niet (verkeerd veld, spatie, of niet
opgeslagen). Advies aan Martijn: CRON_SECRET in Vercel controleren en als
robuuste route ?secret=<waarde> aan de cron-URL hangen (de route accepteert
naast de header ook de query-param), of zelf de curl draaien om te isoleren.
Pas als de auth klopt zegt de {gecheckt,verzonden,fouten}-output iets, en dan
zien we ook of de tabelhernoeming (oorzaak 2) en deze restUrl-fix (oorzaak 3)
de meldingen samen rechttrekken.

**Bewust niet gedaan**: geen leading-slash-normalisatie op het pad-argument
zelf (alle aanroepers geven een schoon pad; dat afvangen zou echte bugs later
maskeren). Geen extra logging van de volle URL in de foutmelding (zou de
Supabase-ref lekken); de PGRST-code plus de env-check volstaan.

**Beperkingen**: de sandbox heeft geen netwerk naar Supabase, dus de echte
bevestiging (stem geeft weer een telling, cron verstuurt) komt uit Martijns
productie na de deploy. Tests, import-check en beide builds zijn hier groen.

**Volgende**: Martijn deployt v3.7.3, bevestigt de SUPABASE_URL-vorm en hertest
/api/stem; fixt de cron-auth en draait de curl in een open meldingsvenster.
Dan de 502 en de meldingen definitief sluiten. Daarna fase 2 fietstool of de
tweede storefront Huis-tuin-auto. Affiliate blijft fase 5.

## Notitie - 2026-07-14 (probes bevestigd, bugs dicht, nieuwe UX-backlog)

**502 dicht.** Na de v3.7.3-deploy meldt Martijn dat Supabase weer werkt. De
restUrl-fix (trailing slash strippen) was het; de dubbele slash uit een
trailing slash in SUPABASE_URL veroorzaakte de PGRST125. De stemmen-tabel
bleek gewoon te bestaan (geen PGRST205).

**Meldingen in de kern opgelost.** De cron via ?secret= gaf
{"gecheckt":1,"verzonden":0,"fouten":[]}. Duiding: gecheckt:1 = het
meldingsschema wordt gelezen en geevalueerd, dus sync werkt; fouten:[] = geen
fouten, dus de hernoeming naar melding_log is gelukt en de DB-calls slagen;
verzonden:0 = op dat moment was er niets te sturen (geen open meldingsvenster,
of al gededupliceerd). De pijplijn is gezond. Restpunt is puur timing: een
keer binnen een echt venster draaien om een binnenkomende push te bevestigen.
Advies: briefingtijd een paar minuten vooruit zetten, dag aan, drempel op
altijd melden, en de cron (die elke 5 min vanzelf loopt) het laten oppikken.

**Beveiliging.** Martijn plakte zijn CRON_SECRET in platte tekst in de chat
(in de ?secret=-URL). Laag risico (ergste geval: iemand triggert de
meldingen-cron), maar geadviseerd om te roteren: nieuwe waarde in Vercel,
redeploy, dezelfde waarde in cron-job.org.

**Nieuwe UX- en copy-backlog** (staat uitgewerkt in BACKLOG.md, pakket 1 t/m
4): totaalteller duim-omhoog (all-time i.p.v. per dag), feedback en delen
prominenter met duidelijkere duimen, resultaat-layout (antwoord rechts van
Jouw plek), de twee nieuwste tools (paraplu, regen-timing) gelijktrekken met
de oude opzet inclusief de ontbrekende herlaad-knop, en een SEO-gevoelige
titel-herziening (het versus ik, hooikoorts logischer). Titel-richting eerst
met Martijn afstemmen voordat er code in gaat; bij elke wijziging de
instellingen en meldingen mee bijwerken.

**Volgende**: richting kiezen op de titels (SEO), en bepalen welk pakket het
eerst wordt (voorstel: pakket 1, klein en zichtbaar). Fase 2 fietstool blijft
ook open.

## Notitie - 2026-07-14 (playbook opgeslagen, backlog-audit)

**PLAYBOOK.md toegevoegd** als derde vaste document naast BACKLOG.md en
LOGBOEK.md, aangeleverd door Martijn: de tool-standaard (vaste opbouw,
copy-/titelregels, feedback, register-velden, huisstijl, checklist). Neem ik
voortaan elke sessie mee. Twee accuraatheidscorrecties gedaan ("pas aan waar
nodig"): sectie 6 aangevuld met de echte registervelden die ontbraken
(patroon, groep, diepte/locatieHint, en weerVelden/weerDagen/scoreConfig voor
weertools), en sectie 8 bijgewerkt omdat de fietstool-bugs (dubbel verdict,
km-optelling) al opgelost zijn in v3.7.2; alleen de fase-2-herindeling staat
nog open.

**Backlog-audit.** Martijn vroeg terecht of alle eerder genoemde punten in de
backlog staan. Nagelopen tegen de transcript en de huidige BACKLOG. Stond er
al in: de UX-/copy-sprint (pakket 1 t/m 4), de nieuwe tools uit de originele
opdracht (strand, hardlopen, auto wassen, tuinieren, krabben, gladheid, in de
categorie-vragenlijst), de fietstool-fase-2, en de totaal-teller duim-omhoog
(pakket 1, ook in PLAYBOOK sectie 4). Twee gaten gevuld: (1) een expliciete
SEO-sectie als doorlopende opdracht (zoekwoord voorin bij FAQ/H1/meta, plus
meer vragen beantwoorden voor meer zoektermen), en (2) de bezoekersteller per
tool als toekomst-item. Ook de storefront-volgorde (Huis-tuin-auto eerst)
expliciet gemaakt en een verwijzing naar PLAYBOOK.md in de backlog-intro.

**Beantwoord.** Search Console-bug: al gefixt in v3.7.1 (broodkruimel levert
schone absolute URL's); enige rest is Googles hervalidatie, die Martijn in
Search Console kan aanzwengelen. Totaal-teller zichtbaar voor gebruikers:
staat in de backlog (pakket 1). Titels: Martijn akkoord op het voorstel.
Layout: naast elkaar op desktop/tablet, gestapeld op mobiel, bevestigd.

**Volgende**: klaar om pakket 1 te bouwen (totaal-teller + duidelijkere duimen
en feedback/deel), tenzij Martijn een ander pakket eerst wil. Bij die bouw de
titels (pakket 4) en de layout (pakket 2) meenemen zoals afgesproken, en de
instellingen/meldingen bijwerken.

## v3.7.4 "Etesian patch 4" - 2026-07-14

**Wat**: pakket 1 van de UX-sprint, de feedback onder elke check. Akkoord van
Martijn om hiermee te starten.

**All-time teller**: de teller naast de duim omhoog toonde het aantal van
vandaag (t.omhoog). Nu toont hij het totaal ooit. In /api/stem berekent
totalen() dat via een tweede, parallelle query (Promise.all): de dagcijfers
zoals altijd, plus stemmen?tool_id=eq.X&stem=eq.1 waarvan we de lengte tellen.
StemPeiling gebruikt voortaan t.totaal (GET en na een POST), met dezelfde
optimistische plus-1 bij een positieve stem. Afweging: de all-time-telling
haalt nu de positieve rijen op en telt de lengte, via de bewezen dbSelect-weg
(geen live Supabase in de sandbox, dus geen count=exact geriskeerd dat ik niet
kan testen). Bij groei kan dit een count=exact-aggregatie worden; staat als
kleine to-do in de backlog onder pakket 1.

**Huisstijl (globals.css)**: de duimen waren pas na het stemmen gekleurd. Nu
zijn ze in rust al herkenbaar: .stemknop.op groen, .stemknop.neer rood, met de
bestaande --groen/--rood-variabelen (geen hardcoded hex). Hover verdiept de
kleur per duim; de generieke leisteen-hover eruit gehaald zodat die de
groen/rood niet overschreef. De vraag "Klopte het advies vandaag?" van 13,5 px
600 naar 15 px 700. De deelknop van een neutrale witte knop naar een zachte
accent-CTA (accent-zacht met accent-diep-rand, zwaarder label). CSS-balans
gecheckt (0). Geen parallelle stijlen toegevoegd, conform PLAYBOOK sectie 7.

**Bewust niet gedaan**: geen label bij het getal (het aantal naast een groene
duim is duidelijk genoeg, en een tekstlabel zou een string in beide talen
vergen); de layout (pakket 2) en de titels (pakket 4) blijven voor hun eigen
beurt. Instellingen en meldingen niet aangeraakt: dit raakt alleen de gedeelde
feedback-UI en de stemroute, geen tool (PLAYBOOK sectie 5 dus n.v.t.).

**Beperkingen**: de all-time-telling en de feedback-UI zijn niet end-to-end
getest (geen Supabase-netwerk in de sandbox); tests, import-check en beide
builds zijn groen. De echte teller is pas op productie te zien.

**Volgende**: pakket 2 (resultaat-layout: antwoord rechts van de plek op
desktop/tablet, gestapeld op mobiel) of pakket 4 (titels, akkoord). Daarna
pakket 3 (nieuwe tools gelijktrekken). Fase 2 fietstool blijft open.

## v3.7.5 "Etesian patch 5" - 2026-07-14

**Wat**: pakket 2 van de UX-sprint, de resultaat-layout van de locatie-checks.
Akkoord van Martijn (naast elkaar op desktop/tablet, gestapeld op mobiel).

**Layout**: LocatieTool zette de plek-sectie en daaronder het resultaatpaneel
(met verdict, status, factoren, dagkiezer, uren, waarom, bron) allemaal onder
elkaar. Nu bovenaan een .tool-top met twee kolommen: links de plek-kaart,
rechts een nieuwe antwoord-kaart met het verdictwoord, de kernzin (status), de
metric-zin en de waarom-regel. Daaronder blijft het detailpaneel full-width met
de weerfactoren-balken, de dagkiezer, de urenstrip en de databron-regel. De
sticky antwoordbalk voor mobiel blijft.

**CSS**: .tool-top is flex-column met gap (mobiel gestapeld); vanaf 720px wordt
.tool-top.met-antwoord flex-row (plek 1fr, antwoord 1.2fr, allebei min-width:0
tegen overflow). De .met-antwoord-klasse staat er alleen als er een antwoord is,
zodat de plek-kaart zonder resultaat gewoon full-width blijft in plaats van
half. De factorbalken-scheidingslijn bovenaan is weggehaald als hij het eerste
kind van het detailpaneel is (die zat er om hem los te maken van de tekst die nu
in de antwoord-kaart staat). Geen nieuwe kleuren of parallelle stijlen; de twee
kaarten hergebruiken .paneel. CSS-balans 0.

**Bewust niet gedaan**: de dagkiezer verhuist niet mee naar de antwoord-kaart;
die blijft bij de details (antwoord bovenaan, andere dagen eronder, leest
logisch). De nowcast-tools (paraplu, regen-timing) gebruiken hun eigen
component en krijgen deze opbouw in pakket 3. Instellingen en meldingen niet
geraakt (geen tool gewijzigd, PLAYBOOK sectie 5 n.v.t.).

**Beperkingen**: niet visueel te testen in de sandbox (geen Open-Meteo-netwerk,
dus geen live resultaat om te renderen); tests, import-check en beide builds
zijn groen. De layout is pas op productie of lokaal te zien.

**Volgende**: pakket 4 (titels, akkoord) of pakket 3 (nowcast-tools
gelijktrekken). Fase 2 fietstool en de meldingen-verbeteringen staan ook open.

## v3.7.6 "Etesian patch 6" - 2026-07-14

**Wat**: pakket 4 van de UX-sprint, de titels. Martijn had het voorstel al
goedgekeurd. Bij het bouwen bleek de opbouw belangrijk: de zichtbare H1 en de
meta-titel komen niet uit tool.naam maar uit content/<slug>.js (seo.h1 en
seo.title). tool.naam voedt alleen de broodkruimel, de structured data en de
"X per stad"-kop.

**Bevinding**: de meeste H1's waren al persoonlijk (fiets, terras, was, kleding,
zonkracht, regen). Vergeleken met de goedgekeurde tabel weken er drie af, en die
zijn aangepast (NL en EN): barbecue seo.h1 "Vandaag barbecueen?" -> "Kan ik
vandaag barbecueen?", hooikoorts "Krijg ik vandaag hooikoorts?" -> "Heb ik
vandaag last van hooikoorts?", paraplu "Paraplu mee vandaag?" -> "Moet ik
vandaag een paraplu mee?". Opvallend: bij hooikoorts en paraplu was tool.naam al
persoonlijk terwijl juist de zichtbare seo.h1 achterliep.

**Kaartlabels**: korteVraag van fiets, terras, barbecue, hooikoorts en paraplu
van de "het"- naar de "ik"-vorm gezet (NL; de EN-varianten waren al persoonlijk).
korteVraag wordt o.a. in SettingsPanel, GerelateerdBlok en de hubgrid gebruikt,
dus die labels lopen automatisch mee. meldingKort is niet aangeraakt, dus de
meldingsteksten blijven zoals ze waren (PLAYBOOK sectie 5: niets te syncen, want
geen tool toegevoegd/gewijzigd, alleen displaycopy op een gedeeld veld).

**seo.title ongemoeid**: die dragen het zoekwoord voorin ("Terrasweer vandaag:
...", "Hooikoorts vandaag: ...") en zijn goed voor SEO; niet aangeraakt.

**Bewust niet gedaan (afstemmen)**: tool.naam bij fiets ("Kan het vandaag
fietsen?") en terras ("Kan het vandaag terrasweer zijn?") laat ik staan. Het
"het" is daar grammaticaal (het verwijst naar de condities/het weer), en naam
voedt de "{naam} per stad"-kop; een volledige ik-vraag maakt die kop lelijk
("Kan ik vandaag op het terras zitten per stad"). Barbecue-naam had een echt
ongelukkig "het" maar dat is even secundair; ik heb barbecue-naam deze ronde
niet aangepast (alleen H1 en korteVraag). Voorstel aan Martijn: of naam toch
aligneren, of eerst de "per stad"-kop naar een zelfstandig naamwoord
refactoren. Staat als restpunt onder pakket 4 in de backlog.

**Overig**: bijgewerkt-datum van barbecue, hooikoorts en paraplu naar
2026-07-14 (H1 is een inhoudelijke wijziging).

**Beperkingen**: tests, import-check en beide builds groen. De titels zijn pas
op productie of lokaal in de UI te zien.

**Volgende**: pakket 3 (de nowcast-tools paraplu en regen-timing gelijktrekken
met de standaardopzet, het grootste stuk), en de tool.naam-afweging. Fase 2
fietstool en de meldingen-verbeteringen staan ook open.

## v3.7.7 "Etesian patch 7" - 2026-07-14

**Wat**: pakket 3 (nowcast-tools gelijktrekken) plus het titel-restpunt (optie 2).
Martijn koos optie 2 en gaf pakket 3 vrij.

**Optie 2 (titels afgemaakt)**: de "X per stad"-kop in app/[tool]/page.js
gebruikte tool.naam.replace("?","") en dwong daarmee tool.naam in een vorm die
in die kop moest werken. Nu gebruikt de kop tool.navLabel (een zelfstandig
naamwoord: "Terras per stad", "Fietsen per stad"). Daardoor kon tool.naam van
fiets ("Kan ik vandaag fietsen naar werk?"), terras ("Kan ik vandaag op het
terras zitten?") en barbecue ("Kan ik vandaag barbecueen?") naar de persoonlijke
"ik"-vorm, gelijk aan hun H1. Broodkruimel en structured-data-naam zijn nu
consistent met de H1.

**Pakket 3 (nowcast gelijkgetrokken)**: nieuwe gedeelde component PlekKiezer
(components/tools/PlekKiezer.js) met de standaard plek-kiezer: favorieten-chips,
zoekveld, gekozen plek met ster (inclusief de bewaar-prompt), en de actieknop.
Losgetrokken uit LocatieTool; LocatieTool gebruikt hem nu ook, dus de plek-kiezer
is overal identiek (DRY, geen parallelle opmaak). ParapluTool en RegenTimingTool
zijn herschreven: ze gebruiken PlekKiezer, hebben nu een actie- en herlaadknop
(die opnieuw ophaalt, nuttig bij nowcast), een databron-regel ("Open-Meteo
neerslag per kwartier, live opgehaald om ..."), en de twee-koloms-layout uit
pakket 2 (plek links, antwoord rechts op tablet/desktop, gestapeld op mobiel via
.tool-top.met-antwoord). De antwoordpanelen kregen de klasse antwoord-paneel. Bij
paraplu staat de buitentijd-keuze nu als children in het plek-paneel (met een
scheidingslijn), zodat de linkerkolom netjes de invoer bundelt. Geen 5-daagse
dagkiezer en geen factorbalken: dat hoort niet bij nowcast (PLAYBOOK sectie 8/9).

**Gedrag**: useLocatie blijft de check auto-runnen bij een gekozen of herstelde
plek; de nieuwe actieknop draait de check opnieuw (reload). Bewust niet de
shared hook verbouwd om de flow niet te veranderen. Feedback en delen komen al
van de toolpagina (feedback-rij), dus die stonden er al.

**Instellingen/meldingen**: niet geraakt. Geen tool toegevoegd of verwijderd;
alleen de weergave van bestaande nowcast-tools en gedeelde copy/UI.

**Beperkingen**: geen Open-Meteo-netwerk in de sandbox, dus de nowcast-UI en de
nieuwe layout zijn niet live gerenderd. Tests, import-check en beide builds zijn
groen. Visuele controle op productie of lokaal.

**Volgende**: de UX-sprint is af (pakket 1 t/m 4 plus de nowcast-gelijktrekking).
Open: fase 2 fietstool, de meldingen-verbeteringen (route-tijden, rijkere push,
datum-nooit-in-verleden), en de doorlopende SEO-opdracht. Ook: LocatieTool deelt
nu PlekKiezer, dus als er nog velden verschillen tussen de tools is dat makkelijk
verder te harmoniseren.

## v3.8.0 "Mistral" - 2026-07-14

**Wat**: het meldingen-format in een keer goed neergezet, zoals Martijn vroeg:
niet doorbouwen op een half format en later verbouwen, maar de basis nu vast.
Drie punten uit de backlog in een sprint: per weekdag instelbaar, de push zelf
rijker, en tijden nooit in het verleden. Plus het storefront-format vastgelegd
(PLAYBOOK sectie 11) als standaard voor de volgende bouwsessie.

**Het weekplan (schema v3)**: elke melding kent per weekdag ("1" t/m "7") een
dagconfig met aan, tijden (de stuurtijden: wanneer de melding komt) en het
doelmoment (waarover het advies gaat). Bij routes is het doelmoment een eigen
vertrekTijd per dag (null = volg de routeplanning van de keten); bij
locatie-checks een doel: hele dag of een tijdvenster (van/tot). De globale
vertrekherinnering (aan, minuten) blijft per route bestaan maar vuurt alleen op
dagen die aan staan. Drempel ongewijzigd. Migraties: migreerRouteSchema tilt v1
(ochtend/ochtendTijd) en v2 (dagen plus briefing.tijden) naar het weekplan;
migreerToolSchema doet hetzelfde voor toolMeldingen. De due-functies nemen ook
oude vormen aan via een interne naarWeek-fallback, dus niets breekt tijdens de
overgang.

**Cron**: de route-branch past per dag een eigen vertrektijd toe via
pasVertrekTijdToe (forceert de eerste rit van de keten naar die kloktijd op
vandaag) voordat planTimes en berekenPlan draaien. De tool-branch migreert het
schema en geeft het doelmoment van de dag door aan toolBriefing; bij een
venster rekent vensterAdvies generiek op de uren uit het overlay-contract (
gemiddelde score plus natte uren) en geldt de drempel voor de vensterscore.
Raakt het venster geen uren, dan valt de briefing terug op de dag.

**Rijkere push**: het verdictwoord staat voorop in de titel (dat is het
antwoord; routenaam of check erna als context), de body draagt kernzin,
doelmoment en metric-zin. De payload heeft nu een url; de service worker toont
icoon plus badge en opent bij het aantikken de juiste check (navigate of
openWindow op de payload-url).

**Nooit in het verleden**: er bleek nergens een kalenderveld (type="date") in
de app te bestaan; het echte pijnpunt was de fietscheck die een bewaarde keten
of route met een oude datum terugzette. Bij het herstellen uit localStorage en
bij laadRoute normaliseert normalizeChainToToday de tijden nu naar vandaag
(kloktijd blijft staan). De cron deed dit al; pasVertrekTijdToe volgt dezelfde
regel.

**UI**: DagenChips is vervangen door de WeekEditor: dagchips togglen een dag
aan; per aan-dag een rij met stuurtijden (TijdenLijst) en het doelmoment
(routes: volg de routeplanning of eigen vertrektijd; tools: hele dag of
venster met van/tot). Een knop "Zet maandag op alle dagen" kopieert de
maandagconfig naar de hele week. Nieuwe strings NL en EN; kleine CSS voor de
weekdagrijen.

**Tests**: 121 groen, waarvan 7 nieuw (migraties, per-dag due met doelmoment op
het item, vertrekherinnering alleen op aan-dagen, pasVertrekTijdToe inclusief
lege keten, vensterAdvies, schemaZin-groepering). Twee bestaande tests
bijgewerkt naar de weekplan-verwachtingen (migratie en schemaZin); een eigen
testfout gecorrigeerd: het 3-uurs inhaalvenster laat een gemiste stuurtijd
bewust nog vuren.

**Bewust niet gedaan**: de vertrek-minuten per weekdag differentieren (globaal
per route is genoeg, het weekplan bepaalt de dagen); een venster dat geen uren
raakt hard laten falen (terugvallen op de dag is vriendelijker).

**Beperkingen**: geen Supabase, push of UI-rendering in de sandbox; de
end-to-end-controle (paneel opslaan, cron-tick, push met deep link) loopt via
productie bij Martijn. Tests, import-check en beide builds zijn groen.

**Volgende**: de storefront-bouwsessie volgens PLAYBOOK sectie 11 (eerste:
Huis-tuin-auto). Open vraag aan Martijn: klopt de lezing van punt 3? Er is
nergens een datumveld, dus dit is gebouwd als tijden-springen-naar-vandaag bij
het openen en laden in de fietscheck.

## v3.9.0 "Sirocco" - 2026-07-15

**Wat**: de storefront-bouwsessie, direct na het vastleggen van het format in
PLAYBOOK sectie 11. De categorie-storefront is omgebouwd van het Bora-model
(kaarten bovenaan, daarna losse tekstsecties) naar het vaste bouwblok-format:
eerst context en keuzehulp, daarna pas de concrete keuze.

**Componenten**: components/Storefront.js is nu een orkestrator over losse,
herbruikbare blokken in components/storefront/: VoorWieBlok (blok 2),
KeuzeHulpBlok (blok 3, routeert naar een live check via toolId of naar een
FAQ-anker op dezelfde pagina), UitlegBlokken (blok 4: beslislogica, situaties,
seizoen), ChecksGrid (blok 5, de bestaande kaartopmaak), CategorieFaq (blok 6)
en GerelateerdCategorieen (blok 7). Elk blok is optioneel; zonder uitgewerkte
content valt een categorie terug op hero plus kaart-overzicht (het oude
gedrag). Blok 8 (affiliate) staat bewust niet in de component: fase 5. Nieuw:
ItemList-JSON-LD naast de bestaande FAQPage-JSON-LD, en de gridkop heet op
uitgewerkte storefronts "Alle checks in deze categorie" (de fallback houdt
"Direct antwoord").

**Content**: content/storefronts.js heeft het nieuwe schema in het docblock.
Huis-tuin is de eerste volledige storefront: voorWie, een keuzehulp met vijf
situaties (de was naar de live wascheck; auto wassen, schilderen/beitsen,
grasmaaien en ramen/luchten naar FAQ-ankers), beslislogica (droog venster,
wind, felle zon, temperatuur, wat er na de klus gebeurt), vier situaties, vier
seizoenen, zeven FAQ-vragen uit de vragenlijst als ankers (long-tail zonder
concurrerende URL's) en gerelateerd (regen, buiten). De regen-storefront is
aangevuld met voorWie, keuzehulp en gerelateerd zodat beide uitgewerkte
storefronts hetzelfde format volgen. Alles NL en EN.

**Registerfix**: fiets-naar-werk hing aan categorieId "onderweg", een
categorie die niet bestaat in de zeven van de taxonomie-sprint, waardoor
/sport-beweging een lege storefront was. Fiets hangt nu aan "sport" (conform
de vragenlijst) en valideerRegister eist voortaan een bestaande categorieId,
zodat dit nooit meer stil misgaat.

**Tests**: 126 groen, waarvan 5 nieuw (tests/storefronts.test.js): elke
storefront-sleutel is een bestaande categorie, faq-ankers uniek en compleet,
keuzehulp verwijst naar een bestaande tool of een eigen anker (met linkTekst),
gerelateerd bevat 2-3 bestaande andere categorieen, en huis-tuin heeft alle
sectie-11-blokken plus de route naar de wascheck.

**Bewust niet gedaan**: HubGrid en ChecksGrid delen dezelfde kaartopmaak maar
zijn nog twee componenten; samenvoegen is een aparte kleine refactor. De
overige vijf categorieen hebben nog geen uitgewerkte content; dat is de
vervolg-opdracht (zie BACKLOG). Geen affiliate-blok.

**Beperkingen**: geen UI-rendering in de sandbox; de blokvolgorde, de
keuzehulp-rijen en de anker-navigatie visueel nalopen op productie. Tests,
import-check en beide builds zijn groen.

**Volgende**: per categorie de storefront-content uitwerken (buiten en sport
liggen voor de hand: meeste live tools), of nieuwe tools uit de vragenlijst
bouwen die de storefronts vullen. Afstemmen met Martijn welke eerst.

## v3.10.0 "Levante" - 2026-07-15

**Wat**: de feedbackronde van Martijn (negen punten), gebouwd rond punt 1 (de
vaste categorie-set) omdat de rest daaraan hangt.

**Punt 1, een categorie-set**: de wortel was dat content/beslissingen.js een
eigen CATEGORIEEN-lijst had (zes groepen, eigen namen, eigen indeling) naast
de zeven van lib/categorieen.js. De catalogus heet nu BESLISSINGEN, heeft geen
eigen titels meer en volgt exact de zeven canonieke categorieen; titel, kleur
en icoon komen uit lib/categorieen. Het dode groep-veld ("Rondom huis",
"Onderweg", "Elke dag") is uit alle negen toolbestanden verwijderd; het werd
nergens meer gerenderd. Hooikoorts en zonkracht staan nu bij gezondheid, de
was bij huis-tuin, sterrenkijken bij buiten, zonnepanelen bij huis-tuin,
krabben en gladheid bij winter. Een nieuwe testsuite (beslissingen.test.js)
dwingt af: exact de zeven categorieen, elke live tool in zijn eigen categorie,
en elke verwijzing bestaat.

**Punt 2, canonieke titels**: regel vastgelegd in PLAYBOOK sectie 2:
korteVraag == naam == seo.h1 per tool, beide talen. Bijgewerkt: terras
("...op het terras zitten?"), zonkracht ("Verbrand ik vandaag?"),
regen-timing ("Wanneer gaat het regenen vandaag?"), paraplu-naam ("...mee?"),
plus zes EN-gelijktrekkingen (fiets, terras, was, kleding, paraplu,
zonkracht, regen-timing volgen nu hun EN-h1). De catalogus leidt de vraag af
uit korteVraag, dus daar kan geen afwijking meer ontstaan. Bewuste
uitzonderingen: seo.title blijft keyword-first (meta-title, niet zichtbaar op
de pagina) en navLabel blijft het zelfstandig naamwoord voor koppen.

**Punt 3 en 4, alle-checks**: nieuwe gedeelde hook useDagVerdicts (een
Open-Meteo-call met de vereniging van alle weerVelden, dan per tool het
overlay-contract; de plek is dezelfde als de homepage, kopwind.hubLocatie,
met De Bilt als landelijk beginpunt). BeslissingenLijst herschreven: per
categorie een klikbare kop naar de storefront in de categorie-kleur, live
checks bovenaan als rijen met statusstip plus tekstlabel (kleur alleen is
niet toegankelijk), zeven huis-tuin-vragen linken naar hun FAQ-anker op de
storefront (geen dood spoor meer), en de geplande vragen staan gedempt als
chips onder "In ontwikkeling". Route- en nowcast-checks hebben geen overlay
en dus bewust geen stip. Zoeken filtert over alles, ook de afgeleide vragen.

**Punt 5**: de menugroep-koppen waren al klikbaar naar de storefronts (sinds
de categorie-routes); nieuw is het Populair-blok bovenaan het menu
(POPULAIRE_TOOL_IDS: kleding, paraplu, fiets).

**Punt 6**: een accentkleur per categorie. Alle negen toolkleuren zijn
gelijkgetrokken met hun categorie-kleur en valideerRegister dwingt dit af
(kleur moet exact de categorie-kleur zijn). De storefront-hero kreeg een
kleurtint en het categorie-icoon als wazig watermerk rechts (half zichtbaar,
achter de tekst). Bewust niet gedaan: echte foto's per storefront; dat is een
licentie- en aanleverkwestie op een faceless site, als open punt in de
backlog met twee opties (eigen SVG-illustraties of door Martijn aangeleverde
gelicenseerde beelden).

**Punt 7**: was al af in v3.9.0 (ChecksGrid met de homepage-kaartstijl);
feedback dateerde vermoedelijk van voor die deploy.

**Punt 8**: de factorbalken staan al op elke locatie-toolpagina (LocatieTool
rendert ze generiek). Nowcast bewust zonder (geen factorweging, playbook
sectie 8). De fietscheck mist ze omdat de route-engine geen
factoren-structuur levert; dat schuift naar fietstool fase 2 (backlog).

**Punt 9**: de header-iconen hadden al title plus aria-label; de bel zegt nu
ook wat het groene stipje betekent ("Meldingen, apparaat gekoppeld").

**Tests**: 129 groen, waarvan 3 nieuw (beslissingen-catalogus) plus de
kleurvalidatie in het register.

**Beperkingen**: geen UI-rendering in de sandbox; de statusstippen, het
watermerk en het Populair-blok visueel nalopen op productie. De
homepage-HubGrid gebruikt nog BASIS_VELDEN in plaats van de verenigde
weerVelden (hooikoorts-badge kan daar leeg blijven); harmoniseren met
useDagVerdicts staat in de backlog.

**Volgende**: open punten uit deze ronde (afbeeldingen per storefront,
HubGrid-harmonisatie, fiets-factorbalken bij fase 2), daarna de keuze die al
openstond: storefront-content voor buiten en sport, of nieuwe tools.

## v3.11.0 "Libeccio" - 2026-07-16

**Wat**: de template-audit van Martijn. Hij inspecteerde alle zeven
storefronts en vond drie templates naast elkaar: A (rijk: regen,
huis-tuin), B (kaal met kaarten: kleding, buiten, sport, gezondheid) en C
(leeg: winter). De diagnose onder de bevinding: het template bestond wel,
maar vijf categorieen hadden simpelweg geen content, en de component viel
dan stil terug op een kale variant. De fix is dus tweeledig: alle content
schrijven en de terugval onmogelijk maken.

**P1, een template**: content/storefronts.js integraal herschreven (793
regels): alle zeven categorieen volledig op Template A, NL en EN, met de
vaste blokvolgorde en sjabloon-koppen met invulwoord ("Voor wie is deze
pagina?", "{X} kiezen: wat wil je weten?", "Waar hangt {x} van af?",
"Veelvoorkomende situaties", "{X} per seizoen in Nederland"). Winter is
volledig ingevuld in plaats van noindex: een goede pagina verslaat een
verstopte, en de gladheids- en krabvragen hebben inhoudelijk sterke
antwoorden (stralingsnachten, wegdek- versus luchttemperatuur, ijzel).
tests/storefronts.test.js is nu de afdwinger: elke categorie moet alle
blokken hebben met minimale omvang, de koppen moeten de sjablonen volgen,
en elke verwijzing (tool, variant, anker, gerelateerd) moet bestaan. Kale
varianten kunnen dus niet terugkomen. FAQ plus FAQPage-JSON-LD staat
daarmee op alle zeven (P1 punt 4); zichtbaar en JSON-LD komen uit dezelfde
sf.faq-bron, dus punt 5 is per constructie gegarandeerd.

**P1, canoniek domein**: lib/site.js viel terug op het domein zonder www
terwijl de site op www draait. Fallback en instructie staan nu op
https://www.kanhetvandaag.nl; interne links zijn relatief en volgen mee.
De env-var op Vercel en de 301 van non-www naar www zijn acties voor
Martijn (staan in de slotboodschap).

**P2, metadata**: og:type stond wel in de layout, maar page-level
openGraph-objecten vervangen het layout-object volledig (shallow merge per
veld in Next.js); type: "website" staat nu in alle vijf page-level
objecten. De categorie-intro's (tegelijk de meta-descriptions) zijn
herschreven naar 120-158 tekens (regen was 193, buiten 111, huis-tuin 113,
winter 99).

**P2, het kaartenblok**: ChecksGrid toont nu drie kaartsoorten in dezelfde
opmaak: live tools, vraagpagina's (varianten, met de diepte-regel en cta
van de oudertool) en geplande checks als gedempte, niet-klikbare
Binnenkort-kaart uit de catalogus. De losse varianten-pills ("Meer vragen
in deze categorie") zijn weg, inclusief de string. KeuzeHulpBlok
ondersteunt nu ook variantId, zodat de kledingkeuzehulp naar de jas-,
korte-broek- en T-shirtpagina's routeert. CTA-labels volgen overal "Check
de/het ..." (fiets, kleding en regentiming aangepast, beide talen).

**Catalogus**: vijftien vragen in content/beslissingen.js (regen, kleding,
buiten, sport, winter; NL en EN dus dertig items) verwijzen nu met
ankerCategorie plus anker naar hun antwoord op de storefront in plaats van
dood "in ontwikkeling" te staan. Echt gepland blijven alleen padel/tennis,
suppen/kajakken en zonnepanelen. Winter heeft daardoor geen gepland-item
meer en nul tools, dus het checks-grid verdwijnt daar bewust; de
keuzehulp en FAQ dekken de vragen, en het grid verschijnt vanzelf zodra de
eerste wintercheck live gaat.

**Visueel**: op verzoek van Martijn is de gekleurde hero-banner met rand
en watermerk vervangen door een subtiele paginabrede tint
(color-mix 4 procent categorie-kleur) met het categorie-icoon groot en
rustig (opacity 0,055) rechts op de achtergrond van de hele pagina, via
een fixed laag achter de content. AI-gegenereerde visuals per storefront
staan als latere verrijking in de backlog.

**Tests**: 129 groen; de storefront-suite is herschreven van
format-controle naar template-afdwinger (de oude zou op de nieuwe
variantId-keuzes zelfs falen).

**Beperkingen**: geen UI-rendering in de sandbox; het achtergrondmodel,
de gedempte kaarten en de heading-hierarchie (P3 punt 14) visueel nalopen
op productie. De Vercel-kant van het canonieke domein (env-var plus 301)
kan alleen Martijn doen.

**Volgende**: de storefront-content is hiermee af; logische vervolgen zijn
nieuwe tools uit de vragenlijst (de ankers zijn er al), de
HubGrid-harmonisatie met useDagVerdicts, of de AI-visuals zodra Martijn
die aanlevert.

## v3.12.0 "Gregale" - 2026-07-16

**Wat**: Martijns definitieve storefront-briefing verwerkt. Het gros van de
briefing (een template met afdwingende tests, alle secties gevuld, FAQ
gelijk aan JSON-LD, ItemList bij de checks, www-canonical, og:type,
meta-descriptions, het kaartenblok met Binnenkort-kaarten, een
CTA-patroon, sjabloon-koppen) stond al sinds Levante en Libeccio; die
punten zijn als checklist nagelopen en klopten. Nieuw gebouwd:

**Playbook definitief**: sectie 11 herschreven naar de briefing als
blijvende richting: de definitie (begeleidende, verhalende categoriepagina
die uitlegt, helpt kiezen en doorstuurt; anders is het een index), de
Coolblue-relatie (referentie voor ritme en keuzehulp, niet voor commercie)
en de affiliate-visie (optionele laag, nooit fundament, geen placeholders,
na context en keuzehulp of dichter bij de uitkomst, later duidelijk
onderscheid interne versus externe links).

**Visueel ritme**: de storefronts waren te tekstueel na het weghalen van
de banner; Martijn noemde het huidige model "saai (geen)" en wees het
checks-kaartenblok aan als de interessante taal. Die taal is doorgetrokken:
keuzehulp-rijen renderen nu als lichte kaarten in de categorie-kleur
(tint 5 procent, rand 22 procent, link in de kleur), de
beslislogica-punten kregen een vinkje in de categorie-kleur in plaats van
bullets, situatie-kaartjes een accentrand links (3px), en het seizoensblok
seizoensiconen via naam-matching (bloem, zon, druppel, vlok; "De rest van
het jaar" valt terug op de zon). Informatieve blokken blijven tekstueel
rustig, keuze-blokken dragen kleur en kaarten: dat is de hierarchie uit de
briefing. Het achtergrond-icoon is iets aanweziger (opacity 0,055 naar
0,085, maat 460).

**De pijl**: het pijl-icoon wees omhoog; het is nu een dikkere pijl naar
rechts (nieuw pad plus een per-icoon diktemap in Icoon.js, 2,7 tegenover 2
voor de rest). Werkt overal tegelijk: keuzehulp, kaart-cta's,
catalogus-koppen, gerelateerd.

**Backlog**: onderling linken tussen relevante tools toegevoegd (terras
naar barbecue en zonkracht, fiets naar regentiming); AI-visuals bevestigd
als P3.

**Tests**: 129 groen; geen contract-wijzigingen, alleen render en styling.

**Beperkingen**: dit is een visuele ronde zonder rendering in de sandbox;
de kaarttaal, de vinkjes, de seizoensiconen, de nieuwe pijl en de
achtergrond-opacity moeten op productie beoordeeld worden. De inline
color-mix-waarden (5/22 procent) zijn startwaarden om op zicht bij te
stellen.

**Volgende**: Martijns oordeel over het ritme, daarna nieuwe tools uit de
vragenlijst (ankers liggen klaar), de HubGrid-harmonisatie, of de
cross-links uit de backlog.

## v3.13.0 "Solano" - 2026-07-16

**Wat**: de homepage-ronde van Martijn (thema's boven de tools, alle-checks
duidelijker, uitleg-verwijzing naar onderen, achtergrond-icoon onzichtbaar)
plus mijn aanvullingen uit backlog en code.

**Themabalk**: nieuw component CategorieBalk: de zeven categorieen als
klikbare chips (icon-chip plus tint in de categorie-kleur) direct onder de
hero, boven de kiesbalk en de kaarten. De storefronts zijn daarmee vanaf de
voordeur vindbaar. Zelfde kaarttaal als de rest, dus visueel rustig.

**Alle checks**: het kleine "Meer vragen? Alle checks"-regeltje onder het
grid is vervangen door een volwaardige alle-checks-kaart (titel, subregel,
dikke pijl) in de kaartstijl. De uitleg-verwijzing ("Waarom zegt een check
wat hij zegt? Het weer in gewone taal") staat nu onderaan de pagina, onder
de veelgestelde vragen, precies zoals gevraagd.

**Bugfix achtergrondmodel**: de storefront-achtergrondlaag stond op
z-index -1, maar body heeft een dekkende achtergrond (var(--papier));
daardoor lag de hele laag erachter en waren tint en icoon nooit zichtbaar.
Dat verklaart Martijns "saai (geen)" beter dan de opacity: er viel niets te
zien. Fix: de laag op z-index 0 en alle andere directe kinderen van
.storefront-pagina op position relative met z-index 1. De
opacity-verhoging van Gregale (0,085) wordt nu dus pas echt beoordeeld.

**HubGrid op de hook**: de homepage draaide zijn eigen fetch met alleen
BASIS_VELDEN, waardoor de hooikoortskaart daar leeg kon blijven terwijl
alle-checks hem wel toonde. HubGrid gebruikt nu useDagVerdicts (zelfde
stad, zelfde union van weervelden, zelfde localStorage-sleutel); de hook
kreeg er een fout-state bij en HubGrid houdt alleen nog een lokale fout
voor de mijn-locatie-knop. Scheelt veertig regels dubbele logica; het
backlog-punt is afgevinkt.

**Footer**: een Thema's-kolom met de zeven storefront-links, voor de
checks-kolom. Sitewide interne links naar de categoriepagina's.

**Tests**: 129 groen; beide builds ok.

**Beperkingen**: geen rendering in de sandbox. De themabalk-chips, de
alle-checks-kaart en vooral het nu pas zichtbare achtergrondmodel (tint 4
procent, icoon 0,085) moeten op productie beoordeeld worden; de
achtergrond kan na de fix ineens te aanwezig blijken.

**Volgende**: Martijns oordeel over homepage en achtergrond, daarna nieuwe
tools uit de vragenlijst of de cross-links tussen tools uit de backlog.

## v3.14.0 "Ostro" - 2026-07-16

**Wat**: Martijns ronde over homepage en storefronts, met drie echte bugs
die zijn waarnemingen verklaren.

**Bug 1, de verdwenen footer**: mijn Solano-fix zette de
storefront-achtergrondlaag op z-index 0 met de content op 1, maar de
footer is een niet-gepositioneerde sibling buiten .storefront-pagina en
positioned elementen met z-index 0 liggen boven alle niet-gepositioneerde
content. De laag bedekte dus de footer. Fundamentele fix: de paginakleur
staat nu op html, body is transparant en de laag weer op z-index -1;
daarmee ligt hij onder alles en is de sibling-z-index-regel weg.

**Bug 2, onzichtbare statusbolletjes**: kleurVoorSchaal geeft
klassenamen ("groen", "oranje", "rood") bij een schaal-id, maar ik
gebruikte hem in Levante met een score als input en de uitkomst als
inline CSS-kleur; ongeldige kleur, dus geen stip. Nu: klasse via
schaalVoor(score).id, stip kleurt via currentColor, en de drie klassen
gebruiken de bestaande kleurvariabelen. Precies de gevraagde
groen/oranje/rood-driedeling, met De Bilt als Nederland-standaard (zat
al in de hook). Anker-vragen (zoals hardlopen) kregen een
Antwoord-label, zodat ze niet voor live checks doorgaan.

**Bug 3, kale homepage-blokken**: de Solano-CSS voor de themabalk en de
alle-checks-kaart bleek niet in globals.css te staan; op productie
stonden die elementen dus zonder enige opmaak. Opnieuw aangebracht en
vanaf nu is een verificatie-grep na elke CSS-wijziging vaste stap.

**Homepage**: thema's als aparte blokken in een grid (geen chips), een
Recent-gebruikt-blok met de drie laatst bezochte checks (RecentTracker
schrijft toolbezoek naar kopwind.recenteTools, maximaal vijf ids; leeg
bij een eerste bezoek), het kopje "Alle checks" boven het volledige
overzicht, de kaart-vragen van h2 naar h3 onder de nieuwe h2-kopjes, en
de alle-checks-kaart als paneel.

**Iconen**: paraplu, regentiming en de was deelden alle drie de druppel.
Nieuw paraplu- en waslijnicoon getekend in de lijnstijl, de regentiming
kreeg de klok, en valideerRegister eist voortaan een uniek icoon per
tool.

**Storefronts**: blok 3 en 5 gewisseld op verzoek (checks-grid met de
sterkste CTA eerst, keuzehulp na de uitleg); pushback gegeven dat dit
het Coolblue-principe omdraait en de afspraak is dat we op gedrag meten.
Gerelateerde onderwerpen zijn nu uitgelichte blokken met icon-chip en
tint in de kleur van de doelcategorie. Het achtergrond-icoon is op
mobiel kleiner en zachter (scale 0,55, opacity 0,05).

**Tests**: 129 groen; beide builds ok.

**Beperkingen**: geen rendering; de nieuwe iconen (paraplu, waslijn),
de mobiele achtergrond en het recent-blok op productie beoordelen. Het
recent-blok vult zich pas na toolbezoeken; varianten registreren nog
niet (alleen hoofdtoolpagina's).

**Volgende**: Martijns oordeel, daarna nieuwe tools uit de vragenlijst
of de cross-links tussen tools uit de backlog.

## v3.15.0 "Marin" - 2026-07-16

**Wat**: Martijns keuze uit de backlog (nieuwe tools bouwen) plus zijn
vier UI-punten, en de nieuwe vaste werkregel: de backlog wordt elke
sessie bijgewerkt en tussendoor-feedback gaat er direct in.

**Nieuwe tools**: hardloopweer (sport) en strandweer (buiten), gekozen
op zoekvolume, seizoen (strand piekt nu in juli) en de categorie-gaten
(sport had een check). Beide volgen het terras-patroon (uurscore, beste
blok, factoren met redenen, status per dag, vijf dagen vooruit) met een
eigen scoremotor: bij hardlopen is koel beter dan warm (top rond 8-15
gevoel, hard aflopend boven de instelbare warmtegrens), telt motregen
licht en echte regen als ongeschikt; bij strand ligt de windgrens op 20
km/u (stuivend zand, geen luwte), telt de zon zwaarder en staat de
kustregel in uitleg en instellingen (aan zee waait het een kracht
harder; zoek je badplaats). Volledige content NL en EN, instellingen,
en registratie in register en resolver. De catalogus- en
keuzehulpvragen verwijzen nu naar de checks; de twee FAQ-antwoorden op
de storefronts zijn vervallen (anti-cannibalisatie, geen dubbele vraag
tussen storefront en toolpagina). De EN-slugtest bewaakte de
registervolgorde en is bijgewerkt.

**Kleuren**: alle zeven hexcodes waren uniek, maar drie paren zaten in
dezelfde familie (twee blauwen, twee groenen, twee oranjes); dat was
wat Martijn zag. Nieuw palet in zeven families: regen blauw #3C7DC4,
kleding paars #7A5EA8, buiten koraalrood #C24E3F, sport groen #2F7D62,
huis-tuin aardebruin #8C6239, gezondheid amber #D97C1B, winter
staalblauw #44607A. Vier toolbestanden volgden mee en valideerRegister
eist nu ook unieke categoriekleuren.

**Homepage-kop**: "Alle checks" boven het grid klopte niet (het zijn
niet alle checks) en heet nu "Populaire checks". Bewuste afwijking van
Martijns letterlijke "Populaire tools": de hele site zegt checks
(canonieke naamgeving is zijn eigen regel); een string-wijziging als
hij toch tools wil. De alle-checks-kaart eronder blijft.

**Alle-checks**: alleen nog het gekleurde bolletje per live check; het
verdictwoord zit in de title-tooltip en als aria-label op de stip
(toegankelijkheid blijft gedekt zonder zichtbare tekst). Tijdens laden
een stille grijze stip.

**Iconen**: hardloopschoen en strandbal nieuw getekend in de lijnstijl.

**Tests**: 129 groen (twee bewakers vingen de nieuwe tools correct af
voor de koppelingen er waren); beide builds ok, /hardloopweer en
/running-weather prerenderen.

**Beperkingen**: geen rendering en geen extern netwerk; de scoremotors
zijn beredeneerd maar niet tegen echt weer gedraaid. Na deploy de
verdicts van beide checks een paar dagen naast het gevoel leggen en de
drempels bijstellen. De nieuwe iconen visueel beoordelen.

**Volgende**: batch 2 uit de backlog (auto wassen, krabben plus
gladheid, wandelen/buiten sporten), of de cross-links tussen tools.

## v3.16.0 "Maestro" - 2026-07-16

**Wat**: Martijns keuze: batch 2 plus zijn zes UI- en meldingenpunten.
Geleverd: drie nieuwe checks (auto-wassen, krabben, gladheid), de
meldingen-bugfix, inklapbaar menu en meldingenpaneel, populair op zes,
en twee alle-checks-fixes.

**De meldingen-bug (een melding, daarna stilte)**: de oorzaak zat niet
in de dedupe (die bleek gezond: leeg log plus database-sleutels is
bewust) maar in de push-laag. Browsers vernieuwen push-abonnementen
periodiek; het oude endpoint geeft dan 410, verstuurNaarAbos ruimde de
rij netjes op, en niets registreerde het nieuwe abonnement. De UI bleef
"gekoppeld" tonen omdat de synccode los van het abonnement leeft.
Fix in drie lagen: hersync() in push-client draait bij elk bezoek en
upsert het actuele abonnement (of maakt het stil opnieuw aan, kan
zonder prompt bij verleende toestemming); de service worker kreeg de
ontbrekende pushsubscriptionchange-handler die via de nieuwe route
/api/push/vervang het nieuwe endpoint laat overnemen op sleutel van het
oude; en de cron-response toont voortaan een verlopen-teller zodat een
run van de externe cron de diagnose zelf vertelt. Belangrijk voor de
prod-check: als de externe cron zelf gestopt is (of met een oude
secret draait), verklaart dat hetzelfde symptoom; de code kan dat niet
zien.

**Krabben-dagsemantiek**: de daglabels in LocatieTool zijn
index-gebaseerd (tab 0 heet altijd vandaag), dus dagen[0]=morgen was
geen optie. Gekozen model: elke dag beoordeelt de nacht erna, met
statuszinnen die expliciet morgenochtend of die ochtend zeggen; het
staat in de instellingen-uitleg, de content en PLAYBOOK sectie 10. De
overlay leent daarvoor per dag de vroege uren van de volgende
kalenderdag (eigen loop over basisPerDag met venster 0-8).

**Risico-conventie**: krabben en gladheid volgen de
zonkracht-conventie: hoge score is geen gedoe, antwoord.ja is de
actie of het gevaar (ja, krabben; ja, glad). De register-test dwong
minstens drie instelvelden af; dat leverde echte instellingen op in
plaats van opvulling (parkeerplek en aanvriesgrens bij krabben,
vervoerskeuze en gevoeligheid bij gladheid).

**Gladheid is een benadering**: geen openbare wegdektemperatuur
beschikbaar; het risico komt uit luchttemperatuur, neerslag, bewolking
en wind (stralingsnachten). De disclaimer staat in de content en de
instellingen-uitleg, bewust niet weggemoffeld.

**Tests**: 129 groen; de catalogus- en EN-slugbewakers vingen de nieuwe
tools correct af voor de koppelingen er waren. Beide builds ok.

**Beperkingen**: geen rendering; de wintermotors zijn in juli niet
tegen echt weer te valideren (beide zeggen nu terecht nee). De
push-fix is pas bewezen na een echte browser-vernieuwing of een
cron-run met verlopen groter dan nul. De drie nieuwe iconen (auto,
krabber, slip) visueel beoordelen.

**Volgende**: batch 3 (wandelen en buiten sporten als eigen tools,
picknick), of de cross-links tussen tools.

## 2026-07-16 (avond) - v3.17.0 "Passaat": batch 3, tien checks en de meldingen-nesting

**Opdracht Martijn**: batch 3 met tien tools ("doe wat jij denkt dat
het beste is"), plus twee meldingen-punten: routes zijn geen checks en
horen genest onder de fietscheck, en een route moet in het paneel zelf
aan te maken zijn zonder eerst de fietscheck te openen.

**Keuze van de tien**: de drie "in ontwikkeling"-beloftes die al op de
site stonden eerst (padel-of-tennis, suppen-of-kajakken, zonnepanelen),
dan de batch-3-kern uit de backlog (wandelen, buiten-sporten,
picknickweer) en vier op zoekgedrag en seizoen (buiten-zwemmen,
sterrenkijken, grasmaaien, ramen-wassen). Tuinieren, luchten en
dekbedden blijven ankers: te veel overlap met grasmaaien en de
wascheck om nu een eigen motor te rechtvaardigen.

**Engine-refactor**: acht van de tien zijn venstertools; in plaats van
acht keer het terras-patroon te kopieren staat dat patroon nu een keer
in lib/engine/vensterTool.js (blokken, beste blok, standaardfactoren,
tijdbewuste status). Per tool resteren uurscore, teksten en extra
factoren. De zes oude venstertools zijn bewust NIET mee-gemigreerd
(risico beperken in een toch al grote run); dat staat in de backlog.

**Eigen motoren**: sterrenkijken is een avondmodel (uren 21-24) op
bewolking, met schemer-detectie via de daglicht-vlag en een lokaal
berekende maanfase (maanFractie, synodische maand; geverifieerd: 29
juli 2026 geeft 1.00 en 14 juli 2026 geeft 0.00, kloppend met volle en
nieuwe maan). Zonnepanelen is een dagmodel: gewogen zonfactor over de
daglichturen (zuid weegt 11:00-15:00 dubbel, oost-west vlak), bewust
zonder kWh, met het zonnigste blok als handelingsadvies (wasmachine,
laden).

**Meldingenpaneel**: FietsGroep nest de RouteSchema's onder een
details-kop met samenvatting (x van y routes actief), en RouteToevoegen
maakt een route aan met naam plus van- en naar-adres via de bestaande
LocatieZoek. De route krijgt legOptions [{}] (een been, geen opties) en
geen durations; verfijnen kan in de fietscheck, die dezelfde
routes-array leest.

**Anti-cannibalisatie**: zeven storefront-FAQ-items vervallen (de
vragen zijn nu checks). Buiten zakte daardoor naar nul en sport naar
een item; aangevuld met niet-concurrerende vragen (avond buiten eten,
windgrens, buiten slapen; warming-up bij kou, onweer). Keuzehulpen
verwijzen nu naar de tools, plus drie nieuwe keuzehulp-regels voor
padel, sup en zonnepanelen.

**Beperkingen, eerlijk**: geen van de tien scoremotors is tegen echt
weer gevalideerd; de winddrempels van sup en padel en de zonaftrek van
ramen-wassen zijn beredeneerde aannames. De zwemcheck kent geen
watertemperatuur en geen blauwalg (staat met naam in content en
uitleg). De zonnepanelencheck is een relatieve indicatie, geen
opbrengstvoorspelling. Het routeformulier in het paneel is niet in een
browser getest (geen rendering hier); de datastructuur is een-op-een
overgenomen uit FietsTool.bewaarRoute.

## 2026-07-16 (avond, tweede run) - v3.18.0 "Zonda": de motormigratie

**Opdracht**: "ga door met het volgende"; gekozen voor het
backlog-item dat ik zelf als kandidaat had gemarkeerd: de zes oude
venstertools naar lib/engine/vensterTool.js. Cross-links schuift een
run op.

**Aanpak met bewijs**: eerst een verificatiescript (patroon: vijf
synthetische weerdagen met verschillende karakters, drie tijdstippen
op de dag, defaults plus een afwijkend instellingenprofiel; de
volledige overlay-JSON per run naar een snapshotmap). Snapshots van de
originelen vastgelegd, daarna per tool gemigreerd en gedift. Eis:
byte-identiek. Resultaat: terras en barbecue exact identiek; hardloop,
strand en autowas identiek op de bedoelde legenda-toevoeging na.

**Motor v2**: vier optionele hooks, allemaal backwards-compatible
(batch 3 raakt niets): dagFactoren vervangt de volledige
factorenopbouw (nodig omdat maakScore redenen in invoervolgorde
bewaart en elke oude tool zijn eigen volgorde en puntwaardes heeft:
bbq-wind 10 punten op 75 procent van de grens, strand-wind 8 op 75
procent, hardloop-buien 4, autowas rekent met temp in plaats van
gevoel); statusVandaag-override met zoekBlok (terras en bbq
herberekenen het beste blok op de resterende uren, terras verrijkt met
zonstuk en gaan-liggen-wind); metricVoor (bbq-rookzin, ongewijzigd
verplaatst); naVerwerking (morgen-vanaf-regel).

**Legenda-bugfix**: LocatieTool leest res.legenda, maar alleen terras
en bbq leverden die; hardloop, strand, autowas en heel batch 3
(inclusief sterrenkijken en zonnepanelen) misten daardoor de
legenda-balk. De motor retourneert nu altijd {legenda, dagen}; de twee
eigen motoren zijn gelijkgetrokken.

**Bewuste uitzondering**: was-buiten-drogen niet gemigreerd. Dat is
een droogtijd-model (droogtijdPijn, natPijn, blokken met minUren,
status op daglengte, plus de aparte berekenDroogdagen-export voor
meldingen); in de motor persen kost meer hooks dan het bespaart.

**Winst**: 1671 naar 1218 regels over de vijf tools (zo'n 450 regels
minder), en blokzoek, kwaliteitsankers en statuslogica bestaan nog op
een plek.

**Beperking**: de synthetische data bevat geen windrichting, dus het
richting-pad van de rookzin zit niet in de diff-dekking; de functie
zelf is byte-identiek verplaatst en ongewijzigd.

## 2026-07-16 (avond, derde run) - v3.19.0 "Harmattan": de SEO-run

**Werkwijze**: op verzoek van Martijn eerst een volledig voorstel
(huidig weefsel, gaten, elke link en elke vraag met reden en
cannibalisatie-markering), daarna bouwen na expliciet akkoord. Uit het
akkoord: sterrenkijken-krabben geschrapt, zonnepanelen-zonkracht en de
smog-anchor goedgekeurd, winterbanden en in-tekst-links geparkeerd,
gradenreeks als hub-anchors bevestigd, en twee toevoegingen: anchors
meteen als linkbestemming meenemen, en de promotiekandidaten in de
backlog.

**Gevonden gaten**: het gerelateerd-blok dekte 9 van de 24 checks
(alles na v3.3 was nooit toegevoegd), de broodkruimel sloeg de hub
over (Home, tool), winter ontving nul hub-links, en de sets van
terras, barbecue en zonkracht waren verouderd na batch 3.

**Gebouwd**: broodkruimel met categorie ertussen (plus completer
BreadcrumbList-schema); GerelateerdBlok herschreven met 27 sets (24
checks plus 3 kledingvarianten via templateId, want de pseudo-tool
erft de ouder-id) en anchor-ondersteuning; hub-naar-hub herzien
(buiten naar sport, sport plus winter, huis-tuin naar winter,
gezondheid naar sport); 9 hub-anchors met catalogusvermelding en 35
tool-vragen, tweetalig. De beslissingen-test valideert anker-items
tegen de storefront-FAQ, dus de nieuwe anchors zijn testgedekt.

**Anti-cannibalisatie bewaakt**: ankerteksten zijn overal de canonieke
vraag van de doelpagina; de gradenvragen landen op de kleding-hub
(patroon van de bestaande 15-gradenvraag), niet op de tool; nul nieuwe
URL's. Eerlijkheid: zoekvolumes zijn vanaf hier niet verifieerbaar,
dus alle keuzes zijn beredeneerde intentie; validatie loopt via Search
Console (promotie-items staan in de backlog).

**Beperkingen**: de anchor-links in het gerelateerd-blok springen naar
een FAQ-item op de hub; of het item daar visueel opvalt (uitgeklapt of
gemarkeerd) is niet gecheckt zonder rendering. Mobiel gedrag van het
grotere blok (4 links) idem.

## 2026-07-16 (avond, vierde run) - v3.20.0 "Bayamo": drie backlog-items (1, 6, 8)

**Opdracht**: uit de backlog-lijst die ik zelf presenteerde koos
Martijn 1 (status-upgrade motor-default), 6 (fietstool fase 2) en 8
(in-tekst links).

**1) Statusbug, gevonden en gefixt.** Bij het lezen van de motor-
default viel op dat statusVandaag het beste blok over de HELE dag
zocht (venster, nu) in plaats van op de resterende uren; terras en
barbecue hadden dit altijd al zelf overschreven met een eigen
statusVandaag. Dat betekent dat elf tools (batch 3 grotendeels, plus
hardloop/strand/autowas sinds de motormigratie) een prima middagblok
als "geweest" konden afdoen zodra er 's ochtends een iets beter blok
lag. Gefixt door dat patroon de motor-default te maken. Geverifieerd
met een doelbewust synthetisch scenario (strandweer, twee gescheiden
blokken, klok op 15:00 na het beste blok maar voor het tweede): voor
de fix "geweest", na de fix "later, 17:00-19:00". Bewuste
gedragswijziging (statuszinnen), de verdicts zelf blijven ongewijzigd.

**2) Fietstool fase 2.** lib/advice.js kreeg een echte
factorenstructuur (tegenwind/droog/temp/stoten, elk met gewicht en een
0-100-gunstigheidsscore afgeleid van de bestaande metrics, niet
herberekend), gerenderd met het bestaande FactorBalken-component op
zowel het dagadvies als elke ritkaart. DagBanner is herschreven: de
badge gebruikt nu VerdictBadge (vijfschaal, consistent met de rest van
de site) in plaats van de eigen 3-woordige kleurmapping; daaronder de
windzin, de zwaarste rit met naam, de top-3-redenen als lijst, de
factorbalken en de cijferdrempels expliciet. FietsTool.js is
heringedeeld: resultaten (dagbanner) boven, kaart+ritkaarten in het
midden, de routebuilder (Jouw rit) als eigen paneel onderaan. CSS
(.dagbanner, .werkblad, .blok-legs, .blok-planner) mee aangepast; de
oude gekleurde bannerachtergrond (.dagbanner.groen/oranje/rood) is
vervallen, de badge draagt de kleur nu.

**3) In-tekst links.** Notatie [label](tool:id) en
[label](hub:categorie#anker) in content-strings; lib/inlineLinks.js
parst, components/TekstMetLinks.js rendert, platteTekst() voedt de
JSON-LD zodat structured data geen markup lekt. Bewuste keuze: alleen
BESTAANDE natuurlijke vermeldingen van een andere check omwikkeld
(geen nieuwe zinnen verzonnen), gevonden via een grep op letterlijke
checknamen ("terrascheck", "kledingcheck", enzovoort) in de huidige
content. 37 links in 14 toolbestanden plus 8 storefront-FAQ-items,
NL en EN. Onderweg een eigen fout gevangen (per ongeluk tool:auto-wassen
in plaats van tool:fiets-naar-werk bij de "bike check"-links) en
gecorrigeerd voor het wegschrijven. Een tweede fout: variant-tools
(jas, korte-broek, t-shirt) hebben geen entry in TOOLS maar in
VARIANTEN; tool: moest daarom ook varianten resolven, in zowel
TekstMetLinks als de test. tests/inline-links.test.js valideert nu elk
linkdoel voor NL en EN (subprocess-patroon van i18n.test.js) en
bewaakt dat de notatie niet ongebruikt blijft staan.

**Niet gedaan, bewust:** de storefront-uitlegblokken (voor-wie,
beslislogica, seizoen) renderen nog platte tekst; niet omgebouwd deze
ronde. Een aantal tools zonder bestaande letterlijke vermelding
(korte-broek-weer, buiten-zwemmen, gladheid, de meeste van batch 3)
kregen geen in-tekst link; dat vergt een bewust geschreven nieuwe zin
in plaats van een wrap, en dat is een aparte afweging per tool.

**Verificatie:** 132 tests groen (was 129, +3 nieuw), beide builds
zonder fouten, alle stad- en van/naar-pagina's van de fietscheck
geprerenderd, geen em-dashes.

