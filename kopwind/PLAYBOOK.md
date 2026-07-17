# PLAYBOOK.md - de tool-standaard voor kanhetvandaag.nl

Dit document beschrijft hoe ELKE tool eruit moet zien en werken, zodat
alles gelijk is. Nieuwe tools volgen dit exact; bestaande tools worden
hiernaartoe gebracht. Wijkt een tool af, dan is dat een bug, geen keuze.

De leidende tool (de gouden standaard qua opzet) is de terrascheck. De
regen-timing- en paraplu-checks wijken nu af en moeten worden
bijgetrokken (zie sectie "Bekende afwijkingen").

Alles in het Nederlands, peer-toon, GEEN em-dashes (ook niet als
`\u2014`-escape).

---

## 1. De vaste opbouw van een toolpagina (van boven naar beneden)

Elke toolpagina heeft deze onderdelen, in deze volgorde:

1. **Broodkruimel** (categorie > tool), met BreadcrumbList-JSON-LD.
2. **H1 = de vraag**, in "ik"-vorm en persoonlijk (zie sectie 2 over copy).
3. **Introzin**: een korte, wervende uitleg van wat de check doet en dat
   het geen weerbericht maar een antwoord is. Zonder account, met
   meldingen.
4. **De plek-kiezer**: favorieten-chips (Thuis/Werk/Gym) plus een
   zoekveld. Bij een bekende plek draait de check automatisch (auto-run),
   anders na een tik op de actieknop.
5. **De actieknop** ("Check het terras", "Check de paraplu", etc.). Elke
   tool heeft deze, ook de nowcast-tools. Na een plekwissel of het
   wijzigen van een instelling moet de check opnieuw draaien.
6. **Het antwoord (kernuitkomst)**: het verdictwoord plus de kernzin.
   LAYOUT: op desktop komt de korte uitkomst (het antwoord) RECHTS naast
   de plek, met de toelichting eronder; zo benutten we de ruimte. Op
   mobiel eronder, met de sticky antwoordbalk.
7. **De toelichting**: de "Waarom"-regel met de doorslaggevende reden(en),
   en waar van toepassing de metric-zin (beste moment, verbrandtijd,
   rustigste blok).
8. **Weerfactoren-balken** ("Wat het oordeel bepaalt"): de 0-100 balken
   per factor met gewicht-percentage. Alleen tools met een profiel in
   `lib/engine/factoren.js`. Nowcast-tools (timing, paraplu) hebben deze
   niet, en dat is correct.
9. **De dagkiezer**: vijf dagen vooruit met verdictwoord en venster per
   dag. Nowcast-tools hebben dit niet (die gaan over nu en de komende
   uren), maar tonen in plaats daarvan hun eigen tijdweergave.
10. **Databron-regel**: "Weerdata: Open-Meteo uurvoorspelling, live
    opgehaald om HH:MM." Elke tool toont de bron en het ophaalmoment.
11. **Feedback + delen**: "Klopte het advies vandaag?" met de twee
    duimen, plus de deelknop. Zie sectie 4.
12. **Gids-content** (SEO): de blokken en FAQ uit `content/<slug>.js`.
13. **Gerelateerd blok** ("Ook handig vandaag"): 2-3 tools uit dezelfde
    categorie.
14. **Laatst-bijgewerkt-regel**: de echte `bijgewerkt`-datum uit het
    register.

---

## 2. Copy en titels (merkregels)

Het merk is de vraag "kan het vandaag". Maar de titels moeten persoonlijk
en logisch zijn; puur "Kan het vandaag ..." is soms te onpersoonlijk. De
regel:

- **Een canonieke titel per check (sinds v3.10.0).** De vraag die de
  bezoeker ziet is overal exact dezelfde: korteVraag == naam == seo.h1,
  in beide talen. Kaart, menu, breadcrumb, paginatitel (H1), footer en
  de catalogus tonen allemaal deze ene vraag (de catalogus leidt hem af
  uit korteVraag, dus daar kan geen afwijking ontstaan). Twee bewuste
  uitzonderingen: seo.title (de meta-title voor Google en de browsertab)
  blijft keyword-first, en navLabel blijft een zelfstandig naamwoord voor
  koppen zoals "X per stad".
- **De vraag draait om "ik", niet om "het".** Voorkeur: de gebruiker
  herkent zijn eigen vraag. Dus per tool de meest natuurlijke vorm kiezen,
  niet blind "Kan het vandaag X".
- **"Krijg ik vandaag hooikoorts?" is fout** (slaat nergens op, klinkt
  alsof je het krijgt als ziekte). Beter: "Heb ik vandaag last van
  hooikoorts?" of "Is het vandaag een hooikoortsdag?". Kies per tool de
  vorm die een echte zoeker zou typen (denk aan het zoekwoord).
- **Titel = zoekintentie voorin.** De H1 en de SEO-title bevatten het
  kernonderwerp/zoekwoord aan het begin.
- **Verdictwoorden komen uit EEN schaal per plek.** Toon NOOIT twee
  verdictwoorden naast elkaar (zoals "prima fietsdag - Ideale fietsdag").
  Op de dagkaart het dag-woord, op een route-etappe het etappe-woord,
  maar niet allebei op dezelfde regel.
- **Natuurlijk Nederlands.** Geen technische of geforceerde termen.
  "Cijfer gedrukt door" is fout; schrijf bijvoorbeeld "Wat het advies
  drukt: ..." of verwerk het in de gewone-taal-zin. Taal als "0,6 km
  merkbare tegenwind halverwege, verder rustig" werkt goed; houd die
  stijl aan.
- **Consistentie tussen tools.** De introzinnen, de knop-labels en de
  toelichtingsstructuur volgen hetzelfde stramien. Vergelijk altijd met de
  terrascheck.

---

## 3. FAQ en SEO per tool

- Elke FAQ-vraag heeft het **zoekwoord/onderwerp voorin**. Fout: "Waarom
  heb ik 's ochtends meer last". Goed: "Waarom is hooikoorts 's ochtends
  of 's avonds erger".
- FAQ's staan in `content/<slug>.js` (NL) en `content/en/<slug>.js` (EN),
  en renderen als inklapbare `<details>` met FAQPage-JSON-LD.
- De gids-blokken beantwoorden de long-tail zonder een aparte pagina te
  maken (anti-cannibalisatie; zie BACKLOG.md).

---

## 4. Feedback en delen (identiek op elke tool)

- Kop "Klopte het advies vandaag?" moet **duidelijk zichtbaar** zijn (niet
  weggemoffeld).
- Twee duimen in de huisstijl (eigen SVG, geen emoji), **visueel
  duidelijk**: duim omhoog groen-geaccentueerd, duim omlaag
  rood-geaccentueerd.
- **Alleen positieve stemmen worden geteld en getoond**, als aantal naast
  de duim omhoog. Een negatieve stem geeft enkel "Bedankt voor je
  feedback", geen zichtbaar aantal.
- BACKLOG: het positieve aantal moet het TOTAAL over alle dagen worden,
  niet alleen vandaag (nu telt het per dag). Dit vergt een aparte
  totaal-query in `/api/stem`.
- De deelknop ("Deel deze check") staat naast de feedback, in de
  huisstijl (Web Share op mobiel, klembord-fallback op desktop).

---

## 5. Instellingen en meldingen (bij ELKE tool-update bijwerken)

Dit wordt vaak vergeten en is verplicht: als je een tool toevoegt of
wijzigt, werk je ook bij:

- **Instellingen** (`components/SettingsPanel.js`): de tool verschijnt in
  de check-kiezer met zijn eigen drempels/keuzes, mits hij instelbare
  velden heeft. Nowcast-tools zonder instellingen worden overgeslagen (dat
  is bewust, de test `register.test.js` zondert `eigenComponent`-tools
  uit).
- **Meldingen** (`components/MeldingenPanel.js` en de cron-route): de tool
  is abonneerbaar waar dat logisch is, en de cron stuurt de melding op het
  juiste moment.
- De drempel-instelling per check moet duidelijk een KEUZEMENU zijn, met
  onderscheid tussen de tool-kiezer en de instellingen daarvan. De
  koppelcode (sync) en het beheer van adressen/favorieten/standplaatsen
  horen ook in dit paneel.

---

## 6. Het register: verplichte velden per tool

Elke tool in `lib/tools/<naam>.js` declareert (zie terras.js als
voorbeeld):

- `id` (stabiel, intern, verandert nooit; ook de sleutel voor stemmen)
- `slug` (NL) en de EN-slug via `kies()`
- `naam` (volledige vraag/H1), `korteVraag` (kort voor kaarten)
- `cta` (knoptekst), `navLabel`, `meldingKort`
- `kleur`, `icoon` (uit `components/Icoon.js`)
- `categorieId` (koppelt aan `lib/categorieen.js`)
- `soort` ("advies" of "info"), `inputType` ("locatie" of "route")
- `databron` ("weer" impliciet, of "lucht" of "minutely")
- `schaalLabels` (vijf verdictwoorden), `adviesLabels` (drie)
- `overlay` (de reken-functie) OF `eigenComponent` (voor nowcast-UI)
- `instellingen` (defaults + velden) tenzij `eigenComponent`
- `bijgewerkt` (echte datum, bump bij inhoudelijke wijziging)
- `affiliate` (nu altijd null; komt in fase 5)
- `patroon` ("A" locatie-check, "B" vergelijk-locaties, "C" niet-weer-bron)
- `groep` (menu-groepskop), plus korte teksten `diepte` en `locatieHint`
- weertools declareren ook `weerVelden`, `weerDagen` en `scoreConfig`;
  nowcast-tools hebben die niet en zetten in plaats daarvan `eigenComponent`

De overlay levert per dag: `{ datum, antwoord:{ja,zin},
uren:[{uur,score,nat}], venster:{van,tot,uren}, metric:{zin},
conditie:{score,redenen,advies}, status:{soort,zin} }`.

Nieuwe tool = nieuw bestand + toevoegen aan de TOOLS-array in
`lib/tools/index.js` + content in `content/` (NL en EN) + stad-templates
in de `[stad]`-route + opnemen in `content/index.js` +
GerelateerdBlok-relaties + `valideerRegister` groen (vangt dubbele slugs).

---

## 7. Huisstijl (overal gelijk)

- **Een accentkleur per categorie (sinds v3.10.0).** De kleur staat op de
  categorie in `lib/categorieen.js`; elke tool erft exact die kleur in
  zijn register (valideerRegister dwingt dit af). Categorie, storefront,
  menugroep en toolkaarten hangen zo visueel samen. Nieuwe tool = kleur
  van zijn categorie, geen eigen tint.
- Kleuren, radius, schaduw: via de CSS-variabelen in `app/globals.css`.
  Nooit hardcoded hex buiten het register (tool-kleur mag, want die staat
  in het register).
- Iconen: alleen uit `components/Icoon.js` (eigen lijn-SVG's, consistente
  stijl). Geen emoji in de UI.
- Kaarten, panelen, knoppen: hergebruik de bestaande klassen (`.paneel`,
  `.knop`, `.chip`, `.checkkaart`). Voeg geen parallelle stijlen toe.
- Header staat sticky bovenaan; footer heeft een duidelijke lijn.
- Nowcast-tools (timing, paraplu) moeten dezelfde plek-kiezer, actieknop,
  databron-regel en feedback/deel-sectie hebben als de weertools. Nu
  missen ze de herlaad-actieknop en wijken ze qua opzet af; dat moet
  gelijkgetrokken.

---

### Inklapbaarheid (richtlijn, sinds v3.16.0)

Alles met meer informatie dan een regel of twee is inklapbaar (wens
Martijn, juli 2026). Het vaste patroon is een native `details` met een
`summary` die de kop plus een korte samenvatting toont (bijvoorbeeld
"aan op 3 dagen" of een teller), zodat de dichte staat al informatie
geeft. Toegepast op: de categoriegroepen in het menu (dicht bij openen,
titel blijft de link naar de storefront) en de meldingen per check.
Nieuwe blokken met verdieping volgen hetzelfde patroon; geen eigen
knop-met-state bouwen waar een `details` volstaat.

## 8. Bekende afwijkingen die rechtgetrokken moeten worden

- **Regen-timing en paraplu missen de herlaad-actieknop** die de andere
  tools wel hebben. Toevoegen.
- **Beide nowcast-tools wijken qua opbouw af** van de terras-standaard
  (introzin, plek, antwoord rechts, toelichting eronder, databron-regel,
  feedback+deel). Breng ze naar het stramien van sectie 1.
- **Fietstool: dubbele verdictwoorden en de tegenstrijdige km-optelling zijn
  OPGELOST in v3.7.2** (een verdictwoord per plek; de windsamenvatting is de
  enige bron voor de tegenwind). Wat nog open staat is de fase-2-herindeling
  (ja/nee plus zwaarste rit bovenaan, routebuilder eronder, drempels expliciet
  tonen); zie BACKLOG.md.
- **Hooikoorts-titel** "Krijg ik vandaag hooikoorts?" herformuleren.
- **Titels breed**: te veel "het", te onpersoonlijk; naar "ik"-vorm per
  tool waar dat natuurlijker is.

---

## 9. Checklist bij elke tool-oplevering

- [ ] Volgt de opbouw van sectie 1 exact
- [ ] Titel/H1 persoonlijk en met zoekwoord voorin (sectie 2)
- [ ] Een verdictwoord per plek, natuurlijk Nederlands
- [ ] Antwoord rechts van de plek op desktop, toelichting eronder
- [ ] Actieknop aanwezig, check herlaadt na plek/instelling-wijziging
- [ ] Feedback (alleen positief geteld) + deelknop, duidelijk zichtbaar
- [ ] Instellingen- en meldingen-paneel bijgewerkt
- [ ] FAQ met zoekwoord voorin, NL en EN
- [ ] Register compleet, `valideerRegister` groen
- [ ] `npm test`, `npm run check:imports`, NL- en EN-build groen
- [ ] Geen em-dashes

---

## 10. Meldingen-format (het weekplan, sinds v3.8.0)

Elke melding kent drie dingen: wanneer hij KOMT (de stuurtijd), waarover
het advies GAAT (het doelmoment), en dat per weekdag apart. Dit heet het
weekplan en is de standaard voor elke meldbare tool.

Het schema (opgeslagen in het profiel, gemigreerd via migreerRouteSchema
en migreerToolSchema in lib/engine/meldingen.js):

- **week**: object met "1" (ma) t/m "7" (zo), per dag:
  - `aan`: melden op deze dag
  - `tijden`: de stuurtijden (een of meer "HH:MM")
  - het doelmoment:
    - routes: `vertrekTijd` ("HH:MM" of null = volg de routeplanning van
      de opgeslagen keten; de cron forceert de eerste rit die dag naar
      deze tijd via pasVertrekTijdToe)
    - tools: `doel` = { soort: "dag" } of { soort: "venster", van, tot }
      (het advies gaat dan over dat tijdvenster, generiek berekend uit de
      uren van het overlay-contract via vensterAdvies)
- **vertrek** (alleen routes): { aan, minuten }, de herinnering X minuten
  voor een geplande vertrektijd; vuurt alleen op dagen die aan staan.
- **drempel**: { modus: altijd | slecht | goed, cijfer }.

Regels:
- **Een gepland moment ligt nooit in het verleden.** Kloktijden lossen
  altijd op naar de dag van nu (normalizeChainToToday, pasVertrekTijdToe);
  de FietsTool normaliseert bewaarde ketens ook bij het openen en bij het
  laden van een route. De kloktijd blijft staan, de datum springt mee.
- **De push zelf**: titel begint met het verdictwoord (het antwoord),
  daarna de context (routenaam of check plus plek). De body draagt de
  kernzin, het doelmoment (vertrektijd of venster) en de metric-zin. De
  payload heeft een `url` (deep link naar de tool), `tag` (dedupe) en de
  service worker toont icon en badge.
- **Oudere schema's** (v1 en v2) migreren automatisch mee; de UI schrijft
  altijd het weekplan terug.
- Een nieuwe meldbare tool hoeft alleen het overlay-contract en
  `meldingKort` te leveren; het weekplan, de cron en de pushopmaak zijn
  gedeeld.

---

### Push-koppeling die zichzelf herstelt (sinds v3.16.0)

Browsers vernieuwen push-abonnementen periodiek. Het oude endpoint
geeft dan 404/410, de cron ruimt de rij op, en zonder tegenmaatregel is
het apparaat stil terwijl de UI "gekoppeld" toont. Drie lagen vangen
dit af:

1. `hersync(code)` in `lib/push-client.js` draait bij elk bezoek (via
   GebruikerContext) zodra er een synccode is en de toestemming staat:
   het actuele abonnement wordt opnieuw geupsert, en een verdwenen
   abonnement wordt stil opnieuw aangemaakt (kan zonder prompt).
2. De service worker heeft een `pushsubscriptionchange`-handler die met
   de oude sleutel opnieuw abonneert en het nieuwe endpoint via
   `POST /api/push/vervang` (sleutel: het oude endpoint) laat
   overnemen met behoud van code en instellingen.
3. `verstuurNaarAbos` telt opgeruimde abonnementen en de cron-response
   toont `{ gecheckt, verzonden, verlopen, fouten }`; een niet-nul
   `verlopen` in de output is het spoor van dit mechanisme.

Elke route en elke check heeft bovendien een eigen volg-schakelaar
(`aan: false` op schemaniveau); `dueBriefings` en `dueVertrek` slaan
zulke schemas volledig over. Oudere schemas zonder het veld gelden als
aan.

### Dagsemantiek van de krabcheck

De krabcheck beantwoordt een avondvraag over morgen. Daarom beoordeelt
elke dag in `dagen[]` de nacht erna: de tab "vandaag" geeft het
antwoord voor morgenochtend. De daglabels in LocatieTool zijn
index-gebaseerd (index 0 heet altijd "vandaag"), dus de statuszinnen
benoemen expliciet "morgenochtend" respectievelijk "die ochtend". Dit
staat ook in de instellingen-uitleg en de content van de tool. Nieuwe
nacht-checks volgen hetzelfde model.

## 11. Storefront-format (definitieve richting, briefing juli 2026)

**Definitie (leidend)**: een storefront is geen productlijst of kale
index, maar een begeleidende, verhalende categoriepagina die eerst helpt
begrijpen en kiezen, en daarna pas doorstuurt. Hij moet drie dingen
tegelijk doen: uitleggen waar de categorie over gaat, helpen kiezen welke
check relevant is, en organisch doorsturen naar de juiste volgende stap.
Een pagina die dat niet doet is een index, geen storefront. Elke
storefront is zelfstandig waardevol, ook zonder affiliate.

Coolblue (de koffiezetapparaten-pagina) is referentie voor opbouw,
scanbaarheid en visueel ritme: keuzehulp voor de eindbestemming,
duidelijke segmentatie, afwisseling tussen uitleg en actie. Niet
overnemen: productzware commercie bovenaan, promotionele styling, een
opzet die als webshop voelt. Ons eindpunt is een check of vervolgvraag,
geen productgrid.

Implementatie: components/Storefront.js orkestreert; de blokken staan als
herbruikbare componenten in components/storefront/; de inhoud per
categorie is configuratie in content/storefronts.js (schema in het
docblock daar). Sinds v3.11.0 (de template-audit) geldt: er is EEN
template en ELKE categorie vult hem volledig in, beide talen; blokken
zijn niet optioneel. tests/storefronts.test.js dwingt dit af (alle
blokken aanwezig, minimale omvang per blok, sjabloon-koppen, geldige
verwijzingen). De keuzehulp routeert naar een live check (toolId), een
vraagpagina (variantId) of een FAQ-anker op dezelfde pagina (long-tail
zonder eigen URL). valideerRegister eist dat elke tool aan een bestaande
categorie hangt.

De vaste bouwblokken, in deze volgorde (blok 3 en 5 gewisseld op verzoek
van Martijn, juli 2026: het checks-grid heeft de sterkste CTA en staat
daarom voor de keuzehulp; we meten op gedrag of de begeleiding hieronder
lijdt):

1. **Hero**: H1 is de categorietitel, intro is de categorie-intro
   (tegelijk de meta-description: 120-158 tekens).
2. **Voor wie / waarvoor**: herkenbare situaties (minimaal 2 regels).
3. **Alle checks in deze categorie**: drie kaartsoorten in dezelfde
   opmaak: live tools, vraagpagina's (varianten, met diepte-regel en cta
   van de oudertool) en geplande checks als gedempte Binnenkort-kaart.
   Het blok verdwijnt alleen als een categorie nog geen enkele kaart
   heeft (winter, tot de eerste wintercheck live gaat).
4. **Uitleg-blokken**: beslislogica (minimaal 4 punten), veelvoorkomende
   situaties (minimaal 4) en het seizoensblok (precies 4).
5. **Keuzehulp**: situatie-routering, ook naar antwoorden zonder eigen
   check (minimaal 3 keuzes).
6. **FAQ**: zoekwoord voorin, FAQPage-JSON-LD uit dezelfde bron als de
   zichtbare vragen (Google-eis: exact gelijk), inklapbaar.
7. **Gerelateerd**: 2-3 aangrenzende categorieen, als uitgelichte
   blokken in de kleur van de doelcategorie.
8. **(fase 5) Affiliate-selectie**: pas als laatste blok, nooit boven de
   keuzehulp; producten volgen het advies, niet andersom.

Sjabloon-koppen (vast, met invulwoord; de tests controleren dit):
- Blok 2: "Voor wie is deze pagina?"
- Blok 3: "{X} kiezen: wat wil je weten?"
- Blok 4: "Waar hangt {x} van af?", "Veelvoorkomende situaties",
  "{X} per seizoen in Nederland"

Visueel (definitief, briefing juli 2026): rustig maar met ritme. De
basis: een subtiele paginabrede tint in de categorie-kleur (color-mix
rond 4 procent) plus het categorie-icoon groot en zacht op de achtergrond
van de hele pagina (laag contrast, opacity rond 0,085). Geen harde
banner-randen, geen schreeuwerige kleurvlakken in de hero, geen losse
hero-iconen. Beeld is functioneel: elk visueel element helpt met
scanbaarheid, herkenning of keuze. Het ritme komt van lichte ankers in de
categorie-kleur: de keuzehulp-rijen in de kaarttaal van het checks-blok,
vinkjes bij de beslislogica-punten, een accentrand op situatie-kaartjes,
seizoensiconen (bloem, zon, druppel, vlok) op het seizoensblok. Zo is er
duidelijke hierarchie: informatieve blokken zijn tekstueel rustig,
keuze-blokken (keuzehulp, checks-grid) dragen kleur en kaarten. De pijl
is overal het dikkere, naar rechts wijzende pijl-icoon (richting, geen
decoratie). Rijkere AI-visuals of illustraties zijn P3 en komen alleen
waar ze echt waarde toevoegen (levert Martijn aan; backlog).

Affiliate-visie: een optionele laag, nooit het fundament. Zonder
relevante affiliate is de storefront volledig en sterk zonder dat blok;
geen lege placeholders of geforceerde vakken. Affiliate past qua
componentlogica in de bestaande kaartstructuur en komt na context en
keuzehulp, of dichter bij de check en de uitkomst, nooit als hoofdrol
bovenaan. Bij invoering (fase 5): duidelijk onderscheid tussen interne
navigatie en externe of commerciele links.

Regels:
- Eerst helpen, dan kiezen, dan pas (later) verkopen; de volgorde van de
  blokken bewaakt dat.
- Elk blok is een herbruikbaar component; een storefront is configuratie
  (welke inhoud), geen maatwerkpagina.
- Anti-cannibalisatie: de storefront beantwoordt de brede vraag; de
  toolpagina's de specifieke. Geen dubbele H1's of dubbele FAQ-vragen
  tussen storefront en tools.
- Vragen uit de catalogus (/alle-checks) die een antwoord op de
  storefront hebben, verwijzen met ankerCategorie plus anker naar dat
  FAQ-item; tests/beslissingen.test.js controleert dat elk anker bestaat.

## 12. Venstertools bouwen op de gedeelde motor (sinds v3.17.0)

Nieuwe checks die per dag het beste blok zoeken bouwen op
lib/engine/vensterTool.js in plaats van het terras-patroon te
kopieren. maakVensterOverlay({defaults, uurScore, teksten,
adviesLabels, minVensterUren, extraFactoren?, geenBlokReden?}) levert
de complete overlay: blokken bouwen, beste blok kiezen, de
standaardfactoren (blokkwaliteit, kort blok, buien, wind boven 80
procent van de grens) en de tijdbewuste status (nu, later, geweest,
niks). Per tool schrijf je alleen de uurscore, het tekstenobject en
eventuele extra factoren (zoals nat gras van eerdere buien of felle
zon op het glas).

De zes venstertools van voor v3.17.0 (terras, barbecue,
was-buiten-drogen, hardloopweer, strandweer, auto-wassen) hebben nog
hun eigen kopie van dit patroon; migratie staat in de backlog.

Twee modelvarianten buiten de motor om:
- Avondmodel (sterrenkijken): beoordeelt alleen de avonduren, score
  volgt de bewolking, en de maanfase wordt lokaal berekend
  (maanFractie in lib/tools/sterrenkijken.js, synodische maand vanaf
  de referentie-nieuwe-maan van 6 januari 2000). Aftrek alleen als de
  gebruiker voor deep-sky kiest.
- Dagmodel (zonnepanelen): geen venster-zoektocht maar een
  dagindicatie (gewogen zonfactor over de daglichturen); het
  zonnigste blok wordt wel als venster getoond. Bewust geen kWh: dat
  is installatie-afhankelijk en zou schijnprecisie zijn.
