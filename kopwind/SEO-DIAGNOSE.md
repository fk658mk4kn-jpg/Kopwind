# SEO-diagnose kanhetvandaag.nl (november 2026, v3.35.0)

Aanleiding: na een aantal maanden live zo'n twaalf bezoekers per dag. Deze
diagnose is gemaakt op basis van de code, de gebouwde site en de live
homepage. Search Console-cijfers waren er nog niet bij; de bevindingen
hieronder zijn daarom hypotheses met een concrete check erbij. Lever de
Search Console-export aan, dan wordt dit een besluit in plaats van een
vermoeden.

## Samenvatting in vijf regels

1. 92 procent van de sitemap (2.065 van 2.250 URL's) zijn stadpagina's die
   onderling voor 91 procent dezelfde tekst hebben. Op een jong domein
   zonder backlinks is dat het patroon waarop Google pagina's wel crawlt
   maar niet indexeert, en de hele site als dun gaat beoordelen.
2. Vijf belangrijke pagina's (waaronder /alle-checks, terras en barbecue)
   staan sinds juli uit de index door de DMCA-melding.
3. Het domein heeft vrijwel geen externe links. Zonder links rankt zelfs
   goede content traag.
4. De sitemap meldde elke dag voor alle 2.250 pagina's een wijziging. Dat
   signaal negeert Google dan helemaal. **Gefixt in v3.35.0.**
5. Seizoen: de sterkste checks (terras, barbecue, strand, zwemmen) zitten
   in november in hun dal. Een deel van de lage cijfers is gewoon de maand.

## Bevinding 1: stadpagina's (de grootste hefboom)

| Wat | Aantal |
|---|---|
| URL's in de sitemap | 2.250 |
| Tool maal stad | 2.065 |
| Van-naar-routes | 70 |
| Overige (checks, hubs, uitleg, aftellers) | 115 |

Gemeten op de gebouwde HTML: /terrasweer/amsterdam en /terrasweer/eindhoven
delen 91 procent van hun woorden. Hetzelfde geldt voor hardloopweer en de
wascheck. Het enige verschil is een zin over de ligging van de stad en een
paar buurtlinks. Het live serverantwoord (sinds v3.27) maakt de pagina
nuttiger voor een bezoeker, maar verandert weinig aan hoe uniek de tekst is.

**Check in Search Console**: Indexering > Pagina's. Staat er een groot
blok onder "Gecrawld, momenteel niet geindexeerd" of "Gevonden, momenteel
niet geindexeerd" met vooral stadpagina's erin, dan is dit bevestigd.

**Status v3.36.0:** de schakelaar is gebouwd en staat uit. Aanzetten met
STAD_INDEX_BEPERKT=1 in Vercel en opnieuw deployen; uitzetten door de
variabele te verwijderen. Getest: de sitemap gaat dan van 2.287 naar 217
URL's.

**Voorstel:**
- Houd stadpagina's indexeerbaar voor alleen de tien grootste steden en de
  tien checks met de meeste zoekvraag op stadniveau (terras, was, fiets,
  hardlopen, strand, regen-timing, paraplu, wat-trek-ik-aan, barbecue,
  zonkracht). Dat zijn honderd pagina's in plaats van ruim tweeduizend.
- Zet de rest op noindex en haal ze uit de sitemap. Ze blijven bestaan en
  werken voor wie erop landt via een interne link; alleen Google laat ze
  links liggen.
- Na zes tot acht weken in Search Console kijken of de indexeringsgraad
  van de rest van de site stijgt.

Dit is omkeerbaar, maar het raakt veel pagina's tegelijk. Daarom niet
zonder jouw akkoord, en liefst na een blik op de indexeringscijfers.

## Bevinding 2: de vijf gedeindexeerde URL's

Ze komen niet vanzelf terug, ook niet na de herschrijving van v3.34.0. De
opties staan in BACKLOG.md. Nieuw sinds deze diagnose: de aftelpagina's en
de hub /hoeveel-dagen-tot linken intern naar terras, barbecue en de andere
checks, zodat de linkwaarde in elk geval binnen de site blijft stromen.

## Bevinding 3: externe links

Een zoekopdracht op de domeinnaam levert in een algemene zoekmachine geen
enkel resultaat van de site zelf op. Dat zegt niet alles over Google, maar
past bij een domein zonder vermeldingen elders.

Wat past bij het anonieme model:
- De aftellers zijn deelbaar in een tijd dat mensen ze opzoeken (kerst,
  oud en nieuw, zomervakantie). Een post op r/thenetherlands rond een
  piekmoment of een korte faceless video ("nog zoveel dagen tot ...")
  levert eerder een link op dan een weercheck.
- Nederlandse linkpagina's en "handige sites"-lijsten kunnen een paar
  vroege vermeldingen opleveren. Check per plek of het de moeite is; veel
  van die links tellen nauwelijks mee.
- Geen linkruil of gekochte links: dat risico is het niet waard.

## Bevinding 4: sitemap-lastmod (gefixt)

Checks en hun stadpagina's dragen nu de echte `bijgewerkt`-datum uit het
register. Alleen de homepage, hubs en aftellers houden een dagelijkse
datum, omdat hun inhoud echt elke dag verandert.

## Bevinding 5: seizoen

De meeste checks gaan over buiten zijn. In november zoekt bijna niemand
naar terrasweer. Vergelijk in Search Console daarom de vertoningen van
juni tot augustus met nu, niet alleen de laatste 28 dagen. De wintertools
(gladheid, krabben, strooien, schaatsen) en de aftellers zijn precies de
onderdelen die in deze maanden kunnen dragen.

## Wat de aftellers moeten doen (v3.35.0)

31 pagina's plus een hub op zoekvragen met echt volume in de komende
weken: kerst, oud en nieuw, sinterklaas, kerstvakantie, kortste dag,
Black Friday. Ze hebben elk de telling van vandaag in de title en in de
server-HTML, een tabel met de komende jaren, werkdagen en waar het past
het weer. Verwachting eerlijk: deze zoekwoorden zijn bezet door gevestigde
sites, dus rankingen komen eerder bij de minder bezette varianten
(werkdagen tot kerst, kortste dag daglengte, klok vooruit 2027) dan bij de
kale kerstteller.

## Wat ik van je nodig heb

Twee schermafbeeldingen of exports uit Search Console:
1. Prestaties, laatste 3 maanden en laatste 16 maanden: top-zoekopdrachten
   en top-pagina's met vertoningen, klikken en positie.
2. Indexering > Pagina's: het overzicht met de redenen waarom pagina's
   niet geindexeerd zijn.

Daarmee is binnen een sessie te beslissen of bevinding 1 de hoofdoorzaak
is.
