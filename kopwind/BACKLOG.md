# Backlog kanhetvandaag.nl

Levend document: wat komt. Wat af is staat in CHANGELOG.md; de
standaarden (huisstijl, toolopbouw, storefront-format) in PLAYBOOK.md.

**Werkregels (vast, sinds 2026-07-16):**
- De backlog wordt ELKE werksessie bijgewerkt: afgeronde punten eruit
  (naar de changelog), nieuwe inzichten erin.
- Feedback en ideeen die de eigenaar tussendoor geeft worden direct als
  backlog-item vastgelegd, zodat niets verloren gaat.

---

## Auteursrechtklacht (v3.34.0, urgent monitoren)

Context: DMCA-melding NoorYES.today (25 juli, WNC-594600), vijf URL's uit
de Google-index: /alle-checks, /barbecueweer, /korte-broek-weer,
/terrasweer, /was-buiten-drogen. Geen verweer ingediend (anonimiteit).
Alle teksten herschreven in v3.34.0; originaliteit-test bewaakt herhaling.

- **GSC wekelijks checken** op nieuwe meldingen of statuswijzigingen.
- **Lumen-melding nalezen** zodra gepost (lumendatabase.org, id 15710816):
  staat er meer in dan de vijf URL's, dan de scan-lijst uitbreiden.
- **Herindexering**: de vijf URL's komen NIET vanzelf terug door de
  herschrijving; ze blijven eruit zolang er geen verweer ligt. Opties,
  alleen afwegen als het verkeersverlies gaat knellen: (a) accepteren en
  de linkwaarde intern doorgeven (de pagina's bestaan nog), (b) verweer
  via een IE-jurist die als gemachtigde optreedt (kost geld, houdt de
  eigen naam mogelijk uit beeld; eerst juridisch checken), (c) nieuwe
  URL-varianten voor die vijf vragen (verliest opgebouwde linkwaarde en
  schuurt met de anti-cannibalisatieregel; laatste redmiddel).
- **Bij een directe juridische brief** (niet via Google): een uur
  IE-jurist inschakelen voordat er ook maar iets wordt beantwoord.

## Nieuwe tools (hoofdlijn: hier komt het verkeer vandaan)

De vragenlijst onderaan is de voorraad. Per vraag blijft de afweging:
eigen tool (eigen engine-overlay), variant op een bestaande tool
(eigen SEO-pagina, gedeelde engine), of FAQ-anker op de storefront.

**Gebouwd in v3.15.0**: hardloopweer (sport) en strandweer (buiten).
**Gebouwd in v3.16.0 (batch 2)**: auto-wassen (huis-tuin), krabben en
gladheid (winter heeft zijn eerste echte checks; het grid op die
storefront verschijnt vanzelf). De wintermotors zijn beredeneerd maar
in juli niet tegen echt weer te valideren; in de eerste vorstweek de
verdicts naast KNMI-waarschuwingen leggen en drempels bijstellen.

**Gebouwd in v3.17.0 (batch 3, AF)**: tien checks in een keer:
wandelen, buiten-sporten, padel-of-tennis, suppen-of-kajakken,
picknickweer, buiten-zwemmen, sterrenkijken, grasmaaien, ramen-wassen
en zonnepanelen. De drie "in ontwikkeling"-beloftes (padel, sup,
zonnepanelen) zijn daarmee ingelost; de gepland-secties in
beslissingen.js zijn leeg. Acht draaien op de nieuwe gedeelde
venstermotor (lib/engine/vensterTool.js); sterrenkijken (avondmodel
plus maanfase) en zonnepanelen (dagmodel) hebben een eigen motor.
Kanttekening, zelfde als bij winter: alle tien scoremotors zijn
beredeneerd maar niet tegen echt weer gevalideerd. Vooral de
winddrempels van sup (14/18/23) en padel (17/22/28) in de praktijk
naast het gevoel leggen; ook de zonaftrek van ramen-wassen en de
dauw-uren van grasmaaien zijn aannames.

**Motormigratie (v3.18.0, AF)**: terras, barbecue, hardloopweer,
strandweer en auto-wassen draaien op de gedeelde venstermotor, met
byte-identiek bewezen gedrag (snapshot-diff over vijf synthetische
dagen). De wascheck is bewust niet gemigreerd: droogtijd-model, geen
blokzoeker. Legenda-bugfix meegenomen: alle overlays leveren nu de
legenda-balk.

**Statusbug motor-default (v3.20.0, AF):** de motor-default zocht het
beste blok over de hele dag in plaats van de resterende uren, waardoor
een prima middagblok als "geweest" telde. Terras/barbecue hadden dit
altijd al zelf gefixt; dat patroon is nu de default, dus wandelen,
buiten-sporten, padel-of-tennis, suppen-of-kajakken, picknickweer,
buiten-zwemmen, grasmaaien, ramen-wassen, hardloopweer, strandweer en
auto-wassen profiteren automatisch. Geverifieerd met een synthetisch
dubbel-blok-scenario.

**SEO-run (v3.19.0, AF)**: linkweefsel (broodkruimel met hub, volledig
gerelateerd-blok voor 24 checks plus varianten, hub-naar-hub herzien)
en 35 tool-vragen plus 9 hub-anchors, tweetalig. Cross-links-item
daarmee afgevoerd.

**In-tekst links, laag D (v3.20.0, AF):** de linknotatie
[label](tool:id) / [label](hub:categorie#anker), geparst door
lib/inlineLinks.js en gerenderd door components/TekstMetLinks.js
(JSON-LD krijgt de platte tekst). Toegepast op 37 links in 14
toolbestanden plus de storefront-FAQ, tweetalig, uitsluitend op
bestaande natuurlijke vermeldingen (geen nieuwe zinnen erbij
verzonnen). tests/inline-links.test.js valideert elk linkdoel voor NL
en EN.

**Uitbreiding (v3.21.0, AF):** de storefront-uitlegteksten (voor-wie,
beslislogica, situaties, seizoen) renderen nu via TekstMetLinks en
alle negentien checks zonder link kregen er een of twee, tweetalig:
wraps op bestaande vermeldingen plus korte verwijzende slotzinnen waar
die er niet waren. De integriteitstest dekt sindsdien ook de
uitlegteksten; site-breed staan er 93 in-tekst links.

**Geparkeerd uit de SEO-run (akkoord eigenaar):**
- Winterbanden-anchor (7-gradenregel): rand van de weer-scope.

**Promoveren naar eigen pagina zodra GSC volume toont:**
- Pollenkalender (nu anchor op de gezondheid-hub): bij impressies op
  brede kalender-termen een eigen pagina met maandoverzicht.
- Gradenreeks "wat trek ik aan bij 5/10/20 graden" (nu anchors op de
  kleding-hub): bij volume per graad-variant promoveren, te beginnen
  met de best presterende.

## Gedaan met go (v3.33.0, opdracht eigenaar 2026-07-20)

Vijf nieuwe checks (springkussen, speeltuin en bestrating-leggen,
dekbed-luchten en buitenkraan-aftappen), allemaal op de bestaande venster-
of dagmotor zonder nieuw weer-veld (bewust, om de whitelist-bug uit Mistral
te vermijden). De bol-afwijzing verwerkt (zie de affiliate-sectie) en de
hele site nagelopen op onherleidbaarheid: de naam uit 25 bronbestanden
gehaald, een audit gedaan die bevestigt dat de gedeployde site al schoon is,
en ANONIMITEIT.md toegevoegd met een volledige veiligheids- en
anonimiteitschecklist. Engels volledig overgeslagen op verzoek. Nieuwe
affiliate-kandidaten (zodra er een actief netwerk is): grondharingen en
verankering (springkussen), zonnebrand en zonnehoedjes (speeltuin),
straatgereedschap en trilplaat (bestrating), droogrek en mattenklopper
(dekbed), kraanisolatie en leidinglint (buitenkraan).

## Gedaan met go (v3.29.0, opdracht de eigenaar 2026-07-18)

Vijftien nieuwe checks (acht venstertools, zeven dagmotoren) plus drie
productiebugfixes (dubbel relatief breadcrumb-schema, ontbrekende
eigenComponent-rendertak op de nowcast-stadpagina's, en verificatie van
de al in v3.27 gefixte title/tekst-kwesties). Engels bewust
overgeslagen (zie open punten). Nieuwe affiliate-kandidatenclusters
zodra de uitrol hervat: motorkleding en helmen (motorcheck),
hondenspullen en poelzalf (uitlaatcheck), vuurkorven en haardhout
(vuurkorf- en houtkachelcheck), tenten en slaapmatten (kampeercheck),
vliegers en powerkites (vliegercheck), hengelsport (vischeck),
schaatsen en ventilatoren/airco's (schaats- en koelcheck).

## Gedaan met go (v3.28.0, opdracht de eigenaar 2026-07-18)

Categorie Tuin en planten afgesplitst (grasmaaien en snoeien verhuisd,
slug huis-tuin-auto bewust behouden), drie nieuwe checks (onkruid met
methode-advies, water geven met omgekeerd antwoord, gras zaaien met
kalender) en drie tuin-ankers (bemesten, bladeren, moestuin).
Affiliate-kandidaten zodra de uitrol hervat: graszaad en gazonmest
(zaaicheck), gieters en druppelslang (gietcheck), schoffels en
voegkrabbers (onkruidcheck), snoeigereedschap (snoeicheck): het
sterkste cluster van de site.

## Gedaan met go (v3.27.0, akkoord eigenaar 2026-07-18)

SSR-antwoordblok op alle stadpagina's (verdict, kernzin en tijdstempel
in de server-HTML, ISR 30 minuten, faalt stil), fiets-regioverdict
(spitsen; geeft de fietscheck stip, stadblok en meldingen), het
stadtekst-fixpakket (drie smaken, volledig tweetalig) en de
zeven-checks-regel in het homepage-FAQ. Napunt: het serverblok is in
de sandbox niet tegen echte weerdata te zien (geen netwerk); na deploy
even een stadpagina bekijken en de bron controleren op het blok.

## Open punten (feedback van de eigenaar, juli 2026)

- **Engelse content nieuwe tools (v3.32.0 en v3.33.0)**: beton-storten,
  dak-op, zwembad-opzetten, muggen (Levante) plus springkussen, speeltuin,
  bestrating-leggen, dekbed-luchten en buitenkraan-aftappen (Autan) hebben
  nog geen EN-content en geven 404 in de EN-build (net als de zes
  Mistral-tools). De tool-objecten, stad-templates en ankertermen zijn wel
  tweetalig; alleen content/en/ ontbreekt. Zelfde open punt als de andere
  NL-only tools.

- **CSP geverifieerd (v3.32.0, afgerond)**: alle externe bronnen zijn
  geinventariseerd en de headers zijn tegen een draaiende productieserver
  met curl bevestigd. De allowlist is compleet (eigen origin, OSM-tegels,
  GA na consent); een consolecheck is niet meer nodig. Zie SECURITY.md.
- **Anonimiteit en veiligheid (v3.33.0, afgerond in de code)**: de naam is
  uit alle bronbestanden gehaald en de gedeployde site is aantoonbaar
  anoniem (geen account, geen author-metadata, alleen de merknaam in de
  JSON-LD). ANONIMITEIT.md bevat de checklist voor wat buiten de site ligt
  en aan de eigenaar is: WHOIS-bescherming controleren, git-identiteit
  pseudonimiseren, 2FA op alle service-accounts, een neutraal e-mailadres
  voor VAPID/Resend, en de affiliate-uitbetaling (de enige onvermijdelijke
  identiteitslink) eventueel via een bedrijfsvorm. Optioneel code-punt:
  rate-limit of herkomstcheck op de open API-proxies (geocode, weather,
  route).
- **Statistiek-keuze (v3.31.0)**: GA staat nu achter de cookiebalk
  (compliant). Alternatief zonder banner is cookieloze statistiek (Vercel
  Web Analytics of Plausible), wat beter bij de faceless opzet past. Keuze
  aan de eigenaar; zie SECURITY.md paragraaf 1.

- **Engelse content voor de vijftien Ghibli-checks (v3.29.0)**: de
  motoren zijn tweetalig en de stad-templates, ankertermen en
  beslissingen staan in beide talen, maar de EN-contentbestanden
  (content/*.js met Engelse seo/intro/blokken/faq) en de EN-registratie
  in content/index.js ontbreken. Daardoor geven de EN-toolpagina's van
  golfen, skeeleren, motorrijden, hond-uitlaten, vliegeren, vuurkorf,
  drone-vliegen, paardrijden, vissen, schaatsen, mist, storm,
  houtkachel, huis-koelen en kamperen nu een 404. Bewust uitgesteld op
  verzoek van de eigenaar ("Engels helemaal vergeten"). Oppakken zodra de
  EN-markt weer aan de beurt is: vijftien EN-contentbestanden schrijven
  en in de en-tak van content/index.js registreren.
- **Engelse content voor de zes Mistral-checks (v3.30.0)**: zelfde
  situatie voor buiten-schilderen, hout-behandelen, terras-reinigen,
  planten-beschermen, sneeuwpret en strooien. Tool-objecten en
  stad-templates zijn tweetalig, EN-content ontbreekt, EN-pagina's
  geven 404. Meenemen in dezelfde EN-content-run.
- **Opruimen: overbodige huis-tuin FAQ-ankers**: de losse
  anker-teksten kan-ik-buiten-schilderen-of-beitsen,
  droogt-verf-vandaag-goed en kan-ik-mijn-terras-schoonmaken op de
  huis-tuin-categoriepagina overlappen nu met de echte tools
  buiten-schilderen, hout-behandelen en terras-reinigen. In de
  beslissingen-index zijn ze al vervangen; verwijder of herschrijf de
  anker-content zelf om kannibalisatie tussen anker en tool te
  voorkomen (de tool is de canonieke pagina).


- **Meldingen-bug (een melding, daarna stilte)**: code-fix geleverd in
  v3.16.0 (hersync bij elk bezoek, pushsubscriptionchange-handler,
  vervang-route, verlopen-teller in de cron-output). Bevestiging op
  productie staat nog open: controleren of de externe cron nog draait
  met de juiste secret, en of `verlopen` in de cron-response daalt.
- **Visuals per storefront**: de eigenaar levert later per storefront een
  AI-gegenereerde afbeelding of illustratie aan; tot die tijd is het
  achtergrondmodel (paginatint plus categorie-icoon) de visuele laag.
  Geen stockfoto's (licenties, faceless).
- (Opgeruimd 2026-07-17: recent-gebruikt met varianten, de
  homepage-kop en de bredere inklapbaarheid zijn alle drie in v3.22.0
  afgehandeld en naar de changelog verhuisd.)

## Verwerkt in v3.16.0 (deze ronde)

Menu-categorieen inklapbaar met teller; Populaire checks op maximaal
zes (een lijst voor homepage en menu); meldingen heten per check en
elke check of route is inklapbaar met samenvatting; routes hebben een
eigen volg-schakelaar (de gemiste uit-optie van de fietscheck); de
verdictstip op alle-checks kan niet meer wegvallen bij lange vragen;
anker-vragen delen de chip-opmaak met geplande vragen (klikbaar, vaste
rand).

## Fietstool fase 2 (v3.20.0, AF)

Herindeling gedaan: dagadvies (badge in de vijfschaal, cijfer, zwaarste
rit met naam, top-redenen als losse punten, cijferdrempels expliciet)
staat boven de kaart en de ritkaarten; de routebuilder (Jouw rit) staat
als eigen paneel onder de kaart. lib/advice.js levert nu een echte
factorenstructuur (tegenwind, droog, temperatuur, windstoten) naast de
pijnscore, zichtbaar als factorbalken op het dagadvies en op elke
ritkaart via het bestaande FactorBalken-component.

**Fietstool-vervolg (v3.23.0, AF):** layout hersteld na feedback
(builder naast de kaart, kaart vaste hoogte, stacking-context-fix
zodat de kaart niet meer over het sticky menu schuift), ritkaart-klik
scrollt op mobiel naar de kaart, en de adviesVoorScore-audit is
afgerond (nergens meer in de UI; intern contract met waarschuwend
commentaar).

## Affiliate (bol AFGEWEZEN, tracking uit, v3.33.0)

STATUS (v3.33.0): de affiliate-aanmelding van de site is door bol AFGEWEZEN
(2026-07-19, artikel 2.6 of "geen match"). De bol-tracking staat nu achter
een schakelaar BOL_AFFILIATE_ACTIEF (NEXT_PUBLIC_BOL_ACTIEF, standaard
false). Zolang die uit is zijn het gewone, werkende bol-links zonder
partnerwrapper, zonder "sponsored"-rel en zonder disclosure, want er is geen
affiliate-relatie om te melden. De plumbing (bolLink, ttLink, metPartnerlink,
SiteId 1532808) blijft in de code voor als er wel een actieve relatie komt.
Tien tools hebben een adviesblok: zonkracht, was-buiten-drogen,
planten-beschermen, sneeuwpret, strooien, terras-reinigen, buiten-schilderen,
hout-behandelen, plus de Levante- en Autan-tools met een blok. De volledige
netwerkkeuze en het advies staan in AFFILIATE.md.

**Advies voor het vervolg (zie AFFILIATE.md):** niet opnieuw op bol als
fundament (een faceless weer-utility past slecht bij bol). Ga voor Amazon
Partnernet als brede basis (meestal soepele goedkeuring, product-agnostisch)
en/of TradeTracker voor de huis-en-tuinmarge (verf, tuin, fiets), en zet de
schakelaar pas aan zodra je een goedgekeurd account hebt. Coolblue blijft
uitgesloten (werkgeversconflict).

**Nog te doen door de eigenaar:**
- bol: AFGEWEZEN (2026-07-19). Niet opnieuw op bol als fundament inzetten.
  Kies een vervolg: Amazon Partnernet als brede basis en/of TradeTracker
  voor de niche-marge, en zet dan BOL_AFFILIATE_ACTIEF (of het gekozen
  netwerk) aan. Zeg welk netwerk het wordt, dan wordt de helper daarop
  aangedraaid.
- Optioneel TradeTracker aanzetten voor de niche-marge (verf, tuin, fiets,
  sport): per campagne aanmelden, de webservice activeren, en de
  campaign/material-id's invullen (ttLink staat klaar, affiliate-id 308800
  zit erin). AFFILIATE.md paragraaf 3 heeft de mapping per categorie.
- Uitbreiden naar meer tools volgt hetzelfde patroon: een bol-zoek-URL in
  het affiliate-veld zetten.

**Coolblue: bewust NIET.** Werkgeversconflict, en electronics past niet
bij de niet-electronische weertools. Zie AFFILIATE.md paragraaf 6.

Uitrol staat stil tot de site zelf 100 procent staat. De twee
placeholder-adviesblokken (zonkracht, was-buiten-drogen) blijven staan
omdat het advies ook zonder commissie nuttig is; weghalen is een regel
werk als dat toch gewenst is. Onderstaande stond al klaar en wacht op
het startsein.

**Gebouwd (v3.22.0):** het affiliate-veld op elke tool heeft nu een
schema (lib/affiliate.js), een component (AdviesBlok: advies eerst,
partnerlink als hulpmiddel, verplichte disclosure, rel="sponsored
nofollow noopener", geen tracking) en een test die elk blok in beide
talen valideert. Ingevuld voor zonkracht (zonnebrand) en
was-buiten-drogen (drooggerei), met PLACEHOLDER-winkellinks.

**Nu te doen door de eigenaar (uit het onderzoek, zie AFFILIATE.md):**
- Aanmelden bij bol.com Partnerprogramma (laagste drempel, breedste
  dekking), optioneel meteen TradeTracker erbij voor de Gamma/Karwei-
  klusmarge (verf, beits, hogedrukreiniger, strooizout).
- Het affiliate-veld invullen op de twee of drie tools met het meeste
  verkeer, met een subid per tool; de placeholder-URL's (Blokker) in
  zonkracht en was-buiten-drogen vervangen door echte partnerlinks.
- Conversie bewijzen op een netwerk voordat je uitbreidt naar de rest
  van de clusters (tabel in AFFILIATE.md paragraaf 3).

**Kandidaten per categorie (invulling volgt zodra links er zijn):**
regen (regenjassen, paraplu's), was (wasrekken, gedaan als voorbeeld),
zon (zonnebrand gedaan, plus zonnebrillen, parasols), strand
(windschermen, parasols), hardlopen (schoenen, kleding), tuin
(gereedschap, snoeischaar), klussen (verf, beits).

**Nog te overwegen:** ook een breder affiliate-blok op de storefront
(nu alleen op de toolpagina), als optionele laag binnen de
kaartstructuur (PLAYBOOK sectie 11).

## Klein en operationeel

- CRON_SECRET roteren (stond ooit in platte tekst in de chat).
- Eenmalig een positieve end-to-end pushmelding bevestigen (timing).
- Stemmenteller: bij volume naar een count=exact-aggregatie.
- EN bijtrekken van wat NL-only is (o.a. het van/naar-cluster).
- Stad-uitrol voor de kledingvraagpagina's zodra ze ranken. Let op:
  sinds v3.23.0 is de stedenlijst op de drie variantpagina's verborgen
  (de links gingen naar niet-bestaande stad-URL's, dus 404). Bij de
  uitrol: generateStaticParams uitbreiden met varianten EN de
  verbergconditie in app/[tool]/page.js weghalen.

## Verder weg

- Dagdeel- en situatie-advies per tool (ochtend/middag/avond).
- Bezoekersteller per tool: pas als de cijfers indrukwekkend genoeg
  zijn om te tonen (wens de eigenaar, 2026-07-14: nu te vroeg).
- Populaire keuzehulpen AANVULLEN van buiten de vaste zes (nu:
  herschikken binnen POPULAIRE_TOOL_IDS op stemmen, v3.22.0). Optie om
  een tool buiten de zes met veel stemmen te laten instromen; bewust
  niet gedaan om de gekozen thematische mix niet te laten verdringen
  door bijvoorbeeld drie zomer-tools. Overwegen zodra er
  stemvolume is.
- SEO-werkwoordvarianten nog breder dan de title (v3.22.0 deed 11
  titles): eventueel ook intro's en H1's laten afwisselen, en de
  resterende tools meenemen. Alleen als Search Console laat zien dat de
  varianten volume trekken; anders niet mechanisch uitbreiden.

## Geparkeerd

- Voetbal-kijken-tool (eigen project, eigen domein, alleen bij een
  legale bron voor tv-data).
- Wasmachine/zonnepanelen op stroomprijs (eerst een stroomprijs-API
  valideren).

---

## Vragenlijst-voorraad per categorie

Status: [tool] = live check, [variant] = eigen vraagpagina op een
bestaande tool, [anker] = beantwoord als FAQ-anker op de storefront,
geen label = nog niet opgepakt.

### Regen en droog
- Moet ik een paraplu meenemen? [tool: paraplu]
- Wanneer gaat het regenen vandaag? [tool: regen-timing]
- Ga ik nat worden vandaag? [anker]
- Hoe lang blijft het droog? [anker]
- Blijft het vandaag droog? [anker]
- Gaat het vanavond regenen? [anker]
- Moet ik een regenjas aan? [anker]
- Gaat het morgen regenen? [anker]
- Gaat het regenen deze week? [anker]
- Regent het binnen een uur?

### Kleding
- Wat trek ik aan vandaag? [tool: wat-trek-ik-aan]
- Moet ik een jas aan? [variant: jas]
- Kan ik een korte broek aan? [variant: korte-broek]
- Is het T-shirtweer vandaag? [variant: t-shirt]
- Heb ik handschoenen, muts of sjaal nodig? [anker]
- Heb ik vandaag een zonnebril nodig? [anker]
- Is het slippersweer vandaag? [variant: slippers, v3.25.0]
- Wat trek ik aan met sporten?

### Buiten en vrije tijd
- Is het terrasweer vandaag? [tool: terras]
- Is het BBQ-weer vandaag? [tool: barbecue]
- Is het strandweer vandaag? [tool: strandweer, v3.15.0]
- Is het picknickweer vandaag? [tool: picknickweer, v3.17.0]
- Kan ik buiten zwemmen? [tool: buiten-zwemmen, v3.17.0]
- Is het sterrenkijkweer vanavond? [tool: sterrenkijken, v3.17.0]
- Kan ik buiten eten vandaag?
- Kan ik vandaag zonnen? [anker, gezondheid]
- Is het biertijd vandaag?

### Sport en beweging
- Kan ik vandaag fietsen naar werk? [tool: fiets-naar-werk]
- Is het hardloopweer vandaag? [tool: hardloopweer, v3.15.0]
- Kan ik buiten sporten vandaag? [tool: buiten-sporten, v3.17.0]
- Kan ik wandelen vandaag? [tool: wandelen, v3.17.0]
- Kan ik vandaag padellen of tennissen? [tool: padel-of-tennis, v3.17.0]
- Kan ik vandaag suppen of kajakken? [tool: suppen-of-kajakken, v3.17.0]
- Is het wielrenweer vandaag? [tool: wielrennen, v3.25.0]
- Kan ik vandaag basketballen buiten?
- Is het te warm om buiten te sporten? [anker]

### Huis, tuin en auto
- Kan ik de was buiten drogen? [tool: was-buiten-drogen]
- Kan ik de auto wassen vandaag? [tool: auto-wassen, v3.16.0]
- Kan ik grasmaaien vandaag? [tool: grasmaaien, v3.17.0]
- Kan ik tuinieren vandaag? [anker]
- Kan ik mijn ramen wassen vandaag? [tool: ramen-wassen, v3.17.0]
- Kan ik mijn huis luchten vandaag? [anker]
- Kan ik dekbedden buiten luchten? [tool: dekbed-luchten, v3.33.0]
- Kan ik buiten schilderen of beitsen? [anker]
- Droogt verf vandaag goed? [anker, v3.27.0]
- Kan ik vandaag mijn terras schoonmaken? [anker, v3.27.0]
- Kan ik vandaag mijn tuinmeubels schoonmaken? [anker, v3.27.0]
- Leveren mijn zonnepanelen vandaag veel op? [tool: zonnepanelen, v3.17.0]
- Kan ik vandaag snoeien? [tool: snoeien, v3.27.0] Affiliate-laag
  (snoeigereedschap) bewust nog leeg: uitrol gepauzeerd; het veld op
  het register staat klaar.
- Plantenadvies breder: per plant/klus wat wel en niet kan bij dit
  weer (dezelfde advies-plus-affiliate-vorm als snoeien).

### Zon, lucht en hooikoorts
- Verbrand ik vandaag? [tool: zonkracht]
- Heb ik vandaag last van hooikoorts? [tool: hooikoorts]
- Verbrand ik bij bewolkt weer? [anker]
- Vanaf welke zonkracht moet ik smeren? [anker]
- Wanneer zijn pollen het ergst? [anker]
- Kan ik vandaag veilig zonnen? [anker]

### Winter en veiligheid
- Moet ik morgen krabben? [tool: krabben, v3.16.0]
- Is het glad op de weg? [tool: gladheid, v3.16.0]

### Comfort en gevoel (bewust geen tools, besluit 2026-07-17)
Dit zijn weervragen zonder beslissing ("is het koud" vraagt om een
getal, niet om een ja/nee met een beste moment) en botsen daarmee met
het format van de site. Ze blijven in de voorraad voor eventuele
FAQ-ankers, maar worden geen eigen checks of categorie.
- Is het koud vandaag? / Is het warm vandaag?
- Waait het hard vandaag?
- Is de luchtvochtigheid vandaag hoog?
- Schijnt de zon vandaag?
