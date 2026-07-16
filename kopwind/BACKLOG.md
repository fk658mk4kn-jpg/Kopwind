# Backlog kanhetvandaag.nl

Levend document. Nieuwste inzichten bovenaan per sectie. De changelog
(CHANGELOG.md) is wat af is; dit is wat komt. De tool-standaard (huisstijl
en vaste opbouw van elke tool) staat in PLAYBOOK.md.

---

## UX- en copy-sprint (nieuw, 2026-07-14, prioriteren)

Feedback van Martijn op de live site. Voorgestelde volgorde in pakketten
(nog te bevestigen welke eerst). Vaste regel: bij elke tool- of
copywijziging de instellingen- en meldingenteksten meteen mee bijwerken.

**Pakket 1 - Feedback en stemmen (AF in v3.7.4).**
- [af] Totaalteller: toont nu hoeveel mensen in TOTAAL op de duim omhoog
  hebben gedrukt (all-time, aparte parallelle query in /api/stem), niet per dag.
- [af] "Klopte het advies vandaag?" prominenter (groter, zwaarder).
- [af] Duim omhoog en omlaag visueel duidelijker (in rust al groen/rood).
- [af] "Deel deze check" duidelijker: accent-CTA in de huisstijl.
- Nog te doen: bij veel volume kan de all-time-telling naar een
  count=exact-aggregatie, zodat er geen rijen meer opgehaald worden.

**Pakket 2 - Resultaat-layout (AF in v3.7.5).**
- [af] Ruimte beter benut: op tablet en desktop staat het antwoord (verdictwoord,
  kernzin, metric, waarom) in een eigen kaart rechts van "Jouw plek", op mobiel
  gestapeld met de sticky antwoordbalk. Details (factoren, dagen, uren, bron)
  full-width eronder. Gedeelde LocatieTool-UI, dus alle standaard-tools in een
  keer; de nowcast-tools volgen in pakket 3.

**Pakket 3 - Nowcast-tools gelijktrekken (AF in v3.7.7).**
- [af] Paraplu en regentiming delen nu de gedeelde PlekKiezer (favorieten,
  zoekveld, gekozen plek met ster, actieknop) en hebben eindelijk een actie- en
  herlaadknop.
- [af] Databron-regel toegevoegd ("Open-Meteo neerslag per kwartier, live
  opgehaald om ...") en de twee-koloms-layout (plek links, antwoord rechts op
  tablet/desktop, gestapeld op mobiel). Bij paraplu staat de buitentijd-keuze in
  het plek-paneel. Geen dagkiezer of factorbalken (hoort niet bij nowcast).
- [af] PlekKiezer losgetrokken uit LocatieTool en overal gedeeld, dus de
  plek-kiezer is nu identiek op alle checks (DRY, geen parallelle opmaak meer).

**Pakket 4 - Copy en titels (grotendeels AF in v3.7.6).**
- [af] Zichtbare H1 persoonlijk/logisch: barbecue "Kan ik vandaag barbecueen?",
  hooikoorts "Heb ik vandaag last van hooikoorts?" (oude "Krijg ik" was fout),
  paraplu "Moet ik vandaag een paraplu mee?". Overige H1's waren al persoonlijk.
- [af] Kaartlabels (korteVraag) van fiets, terras, barbecue, hooikoorts, paraplu
  van "het" naar "ik". NL en EN.
- [af] SEO-titels (seo.title) ongemoeid gelaten: zoekwoord voorin blijft.
- [af, v3.7.7] tool.naam-alignering (optie 2): de "X per stad"-kop gebruikt nu
  navLabel (zelfstandig naamwoord) in plaats van de volledige vraag, waardoor
  tool.naam van fiets, terras en barbecue naar de "ik"-vorm kon. Broodkruimel en
  structured data zijn nu consistent met de H1.

---

## SEO (doorlopende opdracht, 2026-07-14)

Structureel, niet eenmalig. Elke sprint een stukje.
- **Zoekwoord voorin, overal.** Elke FAQ-vraag, H1 en meta-title heeft het
  onderwerp/zoekwoord aan het begin. Fout: "Waarom heb ik 's ochtends meer
  last". Goed: "Waarom is hooikoorts 's ochtends of 's avonds erger". Loop
  periodiek alle tools en varianten na.
- **Meer vragen beantwoorden voor meer zoektermen** (wens Martijn, 2026-07-14).
  Breng long-tail-vragen binnen die raakvlak hebben met de bestaande tools,
  zonder een dunne aparte pagina te maken (anti-cannibalisatie): als gids-blok
  en FAQ op de sterkste categorie-hub of toolpagina. De grote vragenlijst per
  categorie hieronder is de voorraad; per vraag bepalen: eigen tool, variant,
  of alleen een gids-blok/FAQ-anchor.
- Zie ook de anti-cannibalisatie-regel in de categorie-architectuur.

---

## Meldingen (verbeteringen, 2026-07-14) - AF in v3.8.0 "Mistral"

- [af] **Route-meldingen fijnmaziger instelbaar**: het weekplan. Per weekdag
  eigen stuurtijden en een eigen doelmoment: bij routes een eigen vertrektijd
  per dag (of volg de routeplanning), bij locatie-checks de hele dag of een
  tijdvenster. Schema, migraties (v1/v2 naar v3), cron en MeldingenPanel
  (WeekEditor met kopieerknop) draaien volledig op het weekplan. Format
  vastgelegd in PLAYBOOK sectie 10.
- [af] **De pushmelding zelf beter**: verdictwoord voorop in de titel, kernzin
  plus doelmoment in de body, deep link (url) naar de juiste check bij het
  aantikken, icoon en badge in de service worker.
- [af] **Datum in de planning nooit in het verleden**: er bleek nergens een
  kalenderveld te bestaan; het echte pijnpunt was de fietscheck die bewaarde
  ketens met een oude datum terugzette. Bij het openen en bij het laden van een
  route springen tijden nu altijd naar vandaag (kloktijd blijft staan); de cron
  deed dit al en pasVertrekTijdToe volgt dezelfde regel.

---

## Strategische richting (vastgezet met Martijn, juli 2026)

**Storefront-model, een domein.** Geen losse websites per tool (schaalt
niet, botst met faceless/compounding), geen alles-op-een-hoop
(verwatert thematische autoriteit). In plaats daarvan, als Coolblue:
een codebase en engine, met per CATEGORIE een storefront.

**Twee niveaus, twee affiliate-lagen:**

- **Categorie = storefront** (etalage). Bv. /regen-en-nat: legt het
  thema uit, helpt kiezen, draagt de BREDE affiliate (regenjassen,
  paraplu's) en linkt naar alle tools eronder.
- **Tool = toolpagina** met de live check plus SPECIFIEKE affiliate.
  Bv. /was-buiten-drogen: het ja/nee-antwoord, weerfactoren, gidsen,
  FAQ, plus wasrek-affiliate.

**Affiliate komt LATER.** Eerst de structuur en content kloppend, dan
pas de commercie. Volgorde: (1) categorie-architectuur, (2)
storefront-content-template, (3) affiliate erop.

**Voetbal-kijken-tool: geparkeerd.** Geen weertool, heeft
licentiegevoelige tv-zenderdata nodig, verwatert het thema. Eventueel
ooit als apart project met eigen domein en een gevalideerde legale bron.

---

## Categorie-architectuur (format gebouwd in v3.9.0)

De categorien zijn de storefronts. Het bouwblok-format staat (PLAYBOOK
sectie 11) en is gebouwd: herbruikbare blokken, configuratie per
categorie in content/storefronts.js. Uitgewerkt: regen en huis-tuin. De
vervolg-opdracht is per categorie de storefront-content uitwerken
(voorWie, keuzehulp, uitleg, FAQ, gerelateerd) en daarna de tools uit de
vragenlijst hieronder bouwen; de lijst is de voorraad. Per vraag blijft
de afweging: eigen tool (eigen engine-overlay), variant op een bestaande
tool (eigen SEO-pagina, gedeelde engine, zie lib/varianten.js), of een
FAQ-anker op de storefront (long-tail zonder eigen URL, zoals auto
wassen en grasmaaien nu op /huis-tuin-auto).

### Regen en nat
- Ga ik nat worden vandaag?
- Regent het binnen een uur?
- Moet ik een paraplu meenemen?
- Wanneer gaat het regenen vandaag?
- Hoe lang blijft het droog?
- Blijft het vandaag droog?
- Gaat het vanavond regenen?
- Blijf ik vanavond droog?
- Moet ik een regenjas aan?
- Gaat het morgen regenen?
- Blijft het morgen droog?
- Gaat het regenen deze week?

### Kleding
- Moet ik een jas aan? (variant bestaat: jas-aan-of-uit)
- Heb ik handschoenen, muts of sjaal nodig?
- Kan ik een korte broek aan? (variant bestaat: korte-broek-weer)
- Wat trek ik aan vandaag? (tool bestaat: wat-trek-ik-aan)
- Wat trek ik aan met sporten?
- Is het T-shirtweer vandaag? (variant bestaat: t-shirt-weer)
- Is het slippers-weer vandaag?
- Heb ik vandaag een zonnebril nodig?

### Comfort en gevoel
- Is het koud vandaag?
- Is het warm vandaag?
- Waait het hard vandaag?
- Is de luchtvochtigheid vandaag hoog?
- Schijnt de zon vandaag?

### Buiten en vrije tijd
- Is het terrasweer vandaag? (tool bestaat: terras)
- Is het strandweer vandaag?
- Kan ik buiten zwemmen?
- Moet ik zonnebrand gebruiken? (tool bestaat: zonkracht)
- Is het BBQ-weer vandaag? (tool bestaat: barbecue)
- Kan ik vandaag naar buiten?
- Is het biertijd vandaag?
- Kan ik buiten zitten vandaag?
- Kan ik buiten eten vandaag?
- Kan ik vandaag zonnen?
- Is het picknickweer vandaag?

### Sportactiviteiten
- Kan ik wandelen vandaag?
- Is het fietsweer vandaag? (tool bestaat: fiets-naar-werk, wellicht bredere fiets-variant)
- Is het hardloopweer vandaag?
- Kan ik buiten sporten vandaag?
- Is het te warm om buiten te sporten?
- Kan ik vandaag padellen?
- Kan ik vandaag tennissen?
- Kan ik vandaag basketballen buiten?

### Wateractiviteiten
- Kan ik vandaag suppen?
- Kan ik vandaag kajakken?
- Kan ik vandaag kanoen?

### Huis, tuin en praktisch
- Kan ik de was buiten drogen? (tool bestaat: was-buiten-drogen)
- Kan ik de auto wassen vandaag?
- Kan ik buiten klussen vandaag?
- Kan ik tuinieren vandaag?
- Kan ik grasmaaien vandaag?
- Kan ik mijn ramen wassen vandaag?
- Kan ik mijn huis luchten vandaag?
- Kan ik dekbedden buiten luchten?
- Kan ik buiten schilderen vandaag?
- Droogt verf vandaag goed?
- Kan ik vandaag mijn terras schoonmaken?
- Kan ik vandaag mijn tuinmeubels schoonmaken?
- Kan ik vandaag mijn schutting beitsen?
- Kan ik vandaag buiten kitten?

### Seizoen en onderweg (aparte categorie of onder comfort)
- Moet ik krabben?
- Is het glad op de weg?
- Is het sterrenkijkweer vanavond?
- Leveren mijn zonnepanelen vandaag veel op?

### Overige ideeen (nog indelen)
- Hooikoorts (tool bestaat: hooikoorts) - past onder comfort/gezondheid
- Strandlopen / wadlopen
- Wasmachine aan/uit op basis van stroomprijs (heeft stroomprijs-API nodig)

---

## Geplande releases

### AF sinds deze sprint
- v3.5 "Tramontane": cron-fix, weerfactoren-balken, categorie-fundament.
- v3.6 "Bora": taxonomie-sprint verwerkt (cannibalisatie-matrix,
  root-slugs, zeven categorien), storefront-model gebouwd, eerste
  storefront Regen en droog volledig met de checks regen-timing en
  paraplu.
- v3.7.0/3.7.1 "Etesian": feedback- en deel-huisstijl, instellingen in
  drie secties, sticky header, merkbrede SEO-sweep, AUDIT.md toegevoegd,
  502-detaillogging op /api/stem, Broodkruimel-JSON-LD gefixt.
- v3.7.2 "Etesian patch 2": fietstool-opschoning (dubbel verdictlabel weg,
  tegenstrijdige kilometers weg via de windsamenvatting als enige bron,
  dagbanner gebruikt die samenvatting, "Wat telt tegen" i.p.v. "Cijfer
  gedrukt door"). vercel.json crons leeggemaakt (Hobby: */5 faalt bij
  deploy), meldingen draaien voortaan op een externe cron. AUDIT.md
  gecorrigeerd (anon-key-notitie) en aangevuld (push_abos + melding_log,
  externe-cron-stappen).
- v3.7.3 "Etesian patch 3": 502-oorzaak bevestigd via de detail-logging
  (PGRST125, een pad-probleem). restUrl() strip nu een trailing slash van
  SUPABASE_URL zodat de dubbele slash niet meer kan ontstaan, met een
  regressietest (tests/db.test.js). Raakt alle DB-routes, dus ook de
  pushmeldingen.
- v3.7.4 "Etesian patch 4": pakket 1 van de UX-sprint. All-time totaalteller
  positieve stemmen (aparte query in /api/stem), duimen in rust al groen/rood,
  prominentere feedbackvraag, deelknop als accent-CTA. Gedeelde feedback-UI,
  geen tool geraakt.
- v3.7.5 "Etesian patch 5": pakket 2 van de UX-sprint. Resultaat-layout van de
  locatie-checks: antwoord rechts van Jouw plek op tablet/desktop, gestapeld op
  mobiel, details full-width eronder. Gedeelde LocatieTool-UI.
- v3.7.6 "Etesian patch 6": pakket 4 van de UX-sprint. Titels en kaartlabels
  persoonlijker/logischer (barbecue, hooikoorts, paraplu H1; korteVraag van 5
  tools), NL en EN. SEO-titels ongemoeid. tool.naam-alignering nog open.
- v3.7.7 "Etesian patch 7": pakket 3 (nowcast-tools gelijkgetrokken via de
  gedeelde PlekKiezer, actieknop, databron-regel, twee-koloms-layout) plus optie
  2 (per-stad-kop naar navLabel, tool.naam van fiets/terras/barbecue naar "ik").
- v3.8.0 "Mistral": het meldingen-format in een keer goed (het weekplan): per
  weekdag eigen stuurtijden en een eigen doelmoment, rijkere push met deep link,
  en bewaarde tijden nooit in het verleden. Storefront-format vastgelegd in
  PLAYBOOK sectie 11; de bouw ervan is de volgende sessie (eerste storefront:
  Huis-tuin-auto).
- v3.9.0 "Sirocco": het storefront-format gebouwd volgens PLAYBOOK sectie 11:
  herbruikbare blokken (voor wie, keuzehulp, uitleg, checks, FAQ, gerelateerd),
  eerste volledige storefront Huis-tuin-auto (keuzehulp plus zeven
  FAQ-ankers voor de long-tail), regen aangevuld naar hetzelfde format,
  ItemList-JSON-LD, fiets naar de sport-categorie en categorieId-validatie in
  het register.
- v3.10.0 "Levante": de feedbackronde. Een vaste categorie-set overal (de
  catalogus volgt de zeven categorieen, groep-veld weg), een canonieke titel
  per check (korteVraag == naam == h1, beide talen), statusstippen met
  tekstlabel op alle-checks voor de gekozen plek, huis-tuin-vragen klikbaar
  naar hun storefront-antwoord, geplande vragen gedempt in "In ontwikkeling",
  een accentkleur per categorie (afgedwongen in het register), storefront-hero
  met kleurtint en watermerk, Populair-blok in het menu, en de bel-tooltip
  legt het groene stipje uit.

- v3.11.0 "Libeccio": de template-audit. Alle zeven storefronts volledig op
  Template A in beide talen, met sjabloon-koppen die de tests afdwingen;
  FAQ plus FAQPage-JSON-LD overal; canoniek domein met www; og:type en
  meta-descriptions compleet; het kaartenblok met live tools, varianten en
  gedempte Binnenkort-kaarten; vijftien catalogusvragen gekoppeld aan hun
  storefront-antwoord; en het nieuwe rustige achtergrondmodel (paginatint
  plus categorie-icoon) in plaats van de gekleurde banner.

## Open punten uit de feedbackronde (juli 2026)

- **Visuals per storefront**: Martijn laat later per storefront een
  passende afbeelding of illustratie door AI maken en levert die aan; tot
  die tijd is het achtergrondmodel (paginatint plus categorie-icoon) de
  visuele laag. Geen stockfoto's (licenties, faceless).
- **HubGrid harmoniseren met useDagVerdicts**: de homepage haalt nog
  BASIS_VELDEN op, waardoor de hooikoorts-badge daar leeg kan blijven; de
  nieuwe hook gebruikt de vereniging van alle weerVelden. Homepage op de hook
  zetten is een kleine refactor.
- **Fiets-factorbalken** (punt 8): de route-engine levert geen
  factoren-structuur; meenemen in fietstool fase 2.

### Opgelost na de probes (2026-07-14)
- **/api/stem 502**: DICHT. De restUrl-fix loste het op; Supabase werkt weer.
  Was inderdaad het pad-probleem (PGRST125, dubbele slash uit een trailing
  slash in SUPABASE_URL). De stemmen-tabel bleek te bestaan (geen PGRST205).
- **Pushmeldingen**: in de kern opgelost. Cron-auth werkt via ?secret=; de
  output was {"gecheckt":1,"verzonden":0,"fouten":[]}. gecheckt:1 = het schema
  wordt gelezen (sync ok), fouten:[] = tabelhernoeming melding_log gelukt en
  DB-calls slagen, verzonden:0 = er was op dat moment niets te sturen (geen
  open meldingsvenster). Rest: eenmalig een positieve end-to-end-send
  bevestigen (timing, geen bug) en CRON_SECRET roteren (stond in platte tekst
  in de chat).

### Fase 2 fietstool (na de drie bugs, akkoord Martijn)
- Herindeling: bovenaan ja/nee plus zwaarste rit plus 2-3 redenen,
  routebuilder daaronder; score-drempels expliciet tonen (welke thresholds,
  waarom is 27% neerslag nog "Ideaal", waarom is X km tegenwind acceptabel).
- De Maps-knoppen zijn al nette knoppen (NavKnoppen); de "kale URL" uit de
  review was de RSC-payload, geen echte bug. Apple-fallback bij
  tussenstops toont al een uitlegregel; eventueel later verbeteren.

### v3.5 "Tramontane" (af) - fundament
- **Cron-fix**: vercel.json met cron-schedule plus CRON_SECRET, zodat
  push-meldingen daadwerkelijk verstuurd worden (nu draait de route
  nergens vandaan).
- **Weerfactoren-balken** onder elk antwoord (Temperatuur 80%, Wind 20%,
  etc.). De engine berekent deze weging al; alleen zichtbaar maken.
  Bouwt vertrouwen, onderbouwt het oordeel.
- **AUDIT.md**: af-te-vinken installatielijst met test-URL's (env-vars,
  Supabase-tabel, VAPID, GA, GSC, domein).
- **Categorie-architectuur**: de storefront-routes en indeling neerzetten
  als fundament (nog zonder affiliate, nog zonder de rijke
  content-secties). /alle-checks blijft de platte index; de categorien
  krijgen eigen routes die later storefronts worden.

### v3.6 - storefront-content-template
- Herbruikbare storefront-secties per categorie: thema-uitleg,
  situatie-per-weertype, temperatuur/seizoensgids, feitje-van-de-maand,
  FAQ. Model: kandewasbuiten.nl-structuur als template die elke
  categorie erft.
- Zelfde rijke secties optioneel per toolpagina (temperatuurgids,
  droogtijd-tabel, gouden regels).

### v3.7+ - affiliate
- **Affiliate-veld in het register** activeren (bestaat, is leeg).
- **Twee lagen**: brede affiliate op de storefront (categorie), specifieke
  op de toolpagina. Per tool/categorie geisoleerd zodat niets in
  conflict raakt.
- Transparant "advertentie/partner"-label; past bij het
  privacy-first-imago.
- Kandidaat-partners per categorie: regen (regenjassen, paraplu's), was
  (wasrekken, energievergelijker), zon (zonnebrand, zonnebrillen), tuin
  (tuingereedschap), klussen (verf, beits).

---

## Grotere kansen / verder weg
- Volgende storefront: Huis-tuin-auto (de was-tool bestaat al, sterkste
  affiliate-fit), daarna de overige categorieen vullen. Nieuwe tools uit de
  vragenlijst hierboven (o.a. strand, hardlopen, auto wassen, tuinieren,
  krabben, gladheid) waar de zoekintentie het rechtvaardigt.
- Bezoekersteller per tool (zichtbaar aantal bezoekers), toekomst: pas als de
  site relevanter is en de cijfers indrukwekkend genoeg zijn om te tonen. Nu
  nog te vroeg (wens Martijn, 2026-07-14).
- Regen-cluster echt bouwen (timing, paraplu, droog) als eerste
  volledige nieuwe categorie met meerdere tools.
- Dagdeel- en situatie-advies per tool (NoorYES-niveau: ochtend/middag/
  avond, en per situatie zoals fiets vs wandelen).
- Stad-uitrol voor de kledingvraagpagina's als ze ranken.
- Engels bijtrekken van alles wat NL-only is (o.a. het van/naar-cluster).

## Geparkeerd
- Voetbal-kijken-tool (eigen project, eigen domein, alleen bij legale bron).
- Wasmachine/zonnepanelen op stroomprijs (heeft een stroomprijs-API nodig,
  eerst bron valideren).
