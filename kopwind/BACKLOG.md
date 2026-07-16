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

**Gebouwd in v3.15.0**: hardloopweer (sport) en strandweer (buiten),
beide met eigen overlay, instellingen, content NL en EN.

**Batch 2 (voorgestelde volgorde):**
1. Auto wassen (huis-tuin): droog blok, geen felle zon, geen vorst;
   deelt denkwerk met de wascheck. Sterke zoekterm, latere affiliate-fit.
2. Krabben plus gladheid (winter): geeft de wintercategorie zijn eerste
   echte checks (het grid verschijnt daar dan vanzelf). Bouwen voor de
   herfst, dan staat het klaar als het seizoen begint.
3. Wandelen en buiten sporten (sport): mogelijk als varianten op de
   hardloopcheck met eigen drempels; eerst bekijken of het variantmodel
   afwijkende drempels aankan, anders eigen tools.
4. Picknick (buiten): dicht bij terras; wellicht variant op terras.
5. Grasmaaien en tuinieren (huis-tuin): nu FAQ-ankers; upgraden zodra
   de eerste huis-tuin-tools bewezen verkeer trekken.

## Open punten (feedback Martijn, juli 2026)

- **Onderling linken tussen relevante tools**: op toolpagina's naar
  aanverwante checks verwijzen (terras naar barbecue en zonkracht,
  strand naar zonkracht, fiets naar regentiming, hardlopen naar
  regentiming en kleding). Goed voor interne links en sessieduur.
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

## Fietstool fase 2 (akkoord Martijn)

- Herindeling: bovenaan ja/nee plus zwaarste rit plus 2-3 redenen,
  routebuilder daaronder; score-drempels expliciet tonen.
- Factorbalken voor de fietscheck: de route-engine levert nog geen
  factoren-structuur; dit is het moment om die toe te voegen.

## Affiliate (fase 5, bewust laatst)

- Affiliate-veld in het register activeren (bestaat, is leeg).
- Twee lagen: breed op de storefront, specifiek op de toolpagina, als
  optionele laag binnen de bestaande kaartstructuur (zie PLAYBOOK
  sectie 11), met transparant partnerlabel en duidelijk onderscheid
  tussen interne en externe links.
- Kandidaten per categorie: regen (regenjassen, paraplu's), was
  (wasrekken), zon (zonnebrand, zonnebrillen), strand (windschermen,
  parasols), hardlopen (schoenen, kleding), tuin (gereedschap),
  klussen (verf, beits).
- Pas starten als er verkeer is om te verzilveren.

## Klein en operationeel

- CRON_SECRET roteren (stond ooit in platte tekst in de chat).
- Eenmalig een positieve end-to-end pushmelding bevestigen (timing).
- Stemmenteller: bij volume naar een count=exact-aggregatie.
- EN bijtrekken van wat NL-only is (o.a. het van/naar-cluster).
- Stad-uitrol voor de kledingvraagpagina's zodra ze ranken.

## Verder weg

- Dagdeel- en situatie-advies per tool (ochtend/middag/avond).
- Bezoekersteller per tool: pas als de cijfers indrukwekkend genoeg
  zijn om te tonen (wens Martijn, 2026-07-14: nu te vroeg).

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
- Is het picknickweer vandaag? [anker]
- Kan ik buiten zwemmen? [anker]
- Is het sterrenkijkweer vanavond? [anker]
- Kan ik buiten eten vandaag?
- Kan ik vandaag zonnen? [anker, gezondheid]
- Is het biertijd vandaag?

### Sport en beweging
- Kan ik vandaag fietsen naar werk? [tool: fiets-naar-werk]
- Is het hardloopweer vandaag? [tool: hardloopweer, v3.15.0]
- Kan ik buiten sporten vandaag? [anker]
- Kan ik wandelen vandaag? [anker]
- Kan ik vandaag padellen of tennissen? (gepland)
- Kan ik vandaag suppen of kajakken? (gepland)
- Kan ik vandaag basketballen buiten?
- Is het te warm om buiten te sporten? [anker]

### Huis, tuin en auto
- Kan ik de was buiten drogen? [tool: was-buiten-drogen]
- Kan ik de auto wassen vandaag? [anker, batch 2 kandidaat]
- Kan ik grasmaaien vandaag? [anker]
- Kan ik tuinieren vandaag? [anker]
- Kan ik mijn ramen wassen vandaag? [anker]
- Kan ik mijn huis luchten vandaag? [anker]
- Kan ik dekbedden buiten luchten? [anker]
- Kan ik buiten schilderen of beitsen? [anker]
- Droogt verf vandaag goed?
- Kan ik vandaag mijn terras schoonmaken?
- Kan ik vandaag mijn tuinmeubels schoonmaken?
- Leveren mijn zonnepanelen vandaag veel op? (gepland)

### Zon, lucht en hooikoorts
- Verbrand ik vandaag? [tool: zonkracht]
- Heb ik vandaag last van hooikoorts? [tool: hooikoorts]
- Verbrand ik bij bewolkt weer? [anker]
- Vanaf welke zonkracht moet ik smeren? [anker]
- Wanneer zijn pollen het ergst? [anker]
- Kan ik vandaag veilig zonnen? [anker]

### Winter en veiligheid
- Moet ik morgen krabben? [anker, batch 2 kandidaat]
- Is het glad op de weg? [anker, batch 2 kandidaat]

### Comfort en gevoel (nog niet ingedeeld)
- Is het koud vandaag? / Is het warm vandaag?
- Waait het hard vandaag?
- Is de luchtvochtigheid vandaag hoog?
- Schijnt de zon vandaag?
