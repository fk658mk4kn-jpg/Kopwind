# Backlog kanhetvandaag.nl

Levend document. Nieuwste inzichten bovenaan per sectie. De changelog
(CHANGELOG.md) is wat af is; dit is wat komt.

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

## Categorie-architectuur (te finaliseren voor de storefront-bouw)

De categorien worden de storefronts. De onderstaande indeling is het
werkvoorstel; finaliseren voordat de template wordt gebouwd. Elke
categorie krijgt een eigen route, eigen uitleg-intro en (later) eigen
affiliate. Per categorie staan de tools die live zijn (klikbaar) plus de
vraagvarianten die nog gebouwd moeten worden.

Let op: sommige vragen zijn een eigen tool (eigen engine-overlay),
andere zijn een variant op een bestaande tool (eigen SEO-pagina,
gedeelde engine, zie lib/varianten.js). Bij het finaliseren per vraag
bepalen: nieuwe tool, variant, of onderdeel van een bredere tool.

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
  paraplu. AUDIT.md staat nog open.

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
