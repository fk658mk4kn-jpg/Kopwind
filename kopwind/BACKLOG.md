# Backlog kanhetvandaag.nl

Levend document: wat komt. Wat af is staat in CHANGELOG.md; de
standaarden (huisstijl, toolopbouw, storefront-format) in PLAYBOOK.md.

**Werkregels (vast, sinds 2026-07-16):**
- De backlog wordt ELKE werksessie bijgewerkt: afgeronde punten eruit
  (naar de changelog), nieuwe inzichten erin.
- Feedback en ideeen die Martijn tussendoor geeft worden direct als
  backlog-item vastgelegd, zodat niets verloren gaat.

---

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

**Geparkeerd uit de SEO-run (akkoord Martijn):**
- Winterbanden-anchor (7-gradenregel): rand van de weer-scope.

**Promoveren naar eigen pagina zodra GSC volume toont:**
- Pollenkalender (nu anchor op de gezondheid-hub): bij impressies op
  brede kalender-termen een eigen pagina met maandoverzicht.
- Gradenreeks "wat trek ik aan bij 5/10/20 graden" (nu anchors op de
  kleding-hub): bij volume per graad-variant promoveren, te beginnen
  met de best presterende.

## Open punten (feedback Martijn, juli 2026)

- **Meldingen-bug (een melding, daarna stilte)**: code-fix geleverd in
  v3.16.0 (hersync bij elk bezoek, pushsubscriptionchange-handler,
  vervang-route, verlopen-teller in de cron-output). Bevestiging op
  productie staat nog open: controleren of de externe cron nog draait
  met de juiste secret, en of `verlopen` in de cron-response daalt.
- **Visuals per storefront**: Martijn levert later per storefront een
  AI-gegenereerde afbeelding of illustratie aan; tot die tijd is het
  achtergrondmodel (paginatint plus categorie-icoon) de visuele laag.
  Geen stockfoto's (licenties, faceless).
- **Recent-gebruikt uitbreiden**: varianten (jas, korte broek, T-shirt)
  registreren nu nog geen bezoek voor het Recent-blok; ouder-tool
  meetellen bij variantbezoek.
- **Homepage-kop**: staat nu op "Populaire checks" (consistent met de
  sitetaal); Martijn vroeg letterlijk "Populaire tools". Een
  string-wijziging als hij toch "tools" wil.
- **Inklapbaarheid breder doorvoeren**: menu en meldingen zijn om
  (v3.16.0); nalopen welke blokken met verdieping nog volgen
  (storefront-uitlegblokken, instellingen-uitleg). Richtlijn staat in
  PLAYBOOK sectie 7.

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

## Affiliate (fundament in v3.22.0, uitrol volgt)

**Gebouwd (v3.22.0):** het affiliate-veld op elke tool heeft nu een
schema (lib/affiliate.js), een component (AdviesBlok: advies eerst,
partnerlink als hulpmiddel, verplichte disclosure, rel="sponsored
nofollow noopener", geen tracking) en een test die elk blok in beide
talen valideert. Ingevuld voor zonkracht (zonnebrand) en
was-buiten-drogen (drooggerei), met PLACEHOLDER-winkellinks.

**Nu te doen door Martijn:**
- Echte affiliate-accounts en -links regelen en de placeholder-URL's
  (Kruidvat, Blokker) vervangen. Kandidaat-programma's: Praxis of
  Gamma (tuin, klussen), bol.com partner (breed), Decathlon (sport).
- Pas dan echt uitrollen naar meer tools; de plek en het patroon staan
  klaar.

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
  zijn om te tonen (wens Martijn, 2026-07-14: nu te vroeg).
- Populaire keuzehulpen AANVULLEN van buiten de vaste zes (nu:
  herschikken binnen POPULAIRE_TOOL_IDS op stemmen, v3.22.0). Optie om
  een tool buiten de zes met veel stemmen te laten instromen; bewust
  niet gedaan om de gekozen thematische mix niet te laten verdringen
  door bijvoorbeeld drie zomer-tools. Overwegen zodra er
  stemvolume is.
- SEO-werkwoordvarianten book breder dan de title (v3.22.0 deed 11
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
- Is het slippers-weer vandaag?
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
- Kan ik vandaag basketballen buiten?
- Is het te warm om buiten te sporten? [anker]

### Huis, tuin en auto
- Kan ik de was buiten drogen? [tool: was-buiten-drogen]
- Kan ik de auto wassen vandaag? [tool: auto-wassen, v3.16.0]
- Kan ik grasmaaien vandaag? [tool: grasmaaien, v3.17.0]
- Kan ik tuinieren vandaag? [anker]
- Kan ik mijn ramen wassen vandaag? [tool: ramen-wassen, v3.17.0]
- Kan ik mijn huis luchten vandaag? [anker]
- Kan ik dekbedden buiten luchten? [anker]
- Kan ik buiten schilderen of beitsen? [anker]
- Droogt verf vandaag goed?
- Kan ik vandaag mijn terras schoonmaken?
- Kan ik vandaag mijn tuinmeubels schoonmaken?
- Leveren mijn zonnepanelen vandaag veel op? [tool: zonnepanelen, v3.17.0]
- Kan ik vandaag snoeien? (idee Martijn 2026-07-17) Sterke
  affiliate-kandidaat: advies "welke planten wel, welke niet, en
  wanneer wel of niet snoeien" (vorstrisico, groeiseizoen, bloei na of
  voor de bloei), plus een AdviesBlok naar snoeigereedschap bij Praxis
  of Gamma. Afweging vooraf: dit is deels weer (vorst, nat blad) maar
  vooral plantenkennis, dus het kan een eigen tool worden met een
  lichte weer-overlay plus een steviger adviesblok dan gemiddeld.
  Waarschijnlijk het beste eerste echte affiliate-onderwerp, want de
  koopintentie (gereedschap) is hoog en het advies is evergreen.
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

### Comfort en gevoel (nog niet ingedeeld)
- Is het koud vandaag? / Is het warm vandaag?
- Waait het hard vandaag?
- Is de luchtvochtigheid vandaag hoog?
- Schijnt de zon vandaag?
