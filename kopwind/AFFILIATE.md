# Affiliate op kanhetvandaag.nl

Onderzoek en implementatiegids (bijgewerkt v3.31.0 "Sirocco",
2026-07-19). Dit document beantwoordt drie vragen: hoe werkt affiliate
technisch, welk netwerk past bij deze site, en hoe vul je het per tool in.

**Status: bol staat live.** De plumbing is ingevuld met bol. In
lib/affiliate.js zit een centrale deeplink-helper (BOL_SITE_ID uit de
omgevingsvariabele NEXT_PUBLIC_BOL_SITE_ID, plus bolLink, ttLink en
metPartnerlink). AdviesBlok bouwt elke bol-link centraal om naar een
partner.bol.com-deeplink met de tool-id als subid. Acht tools hebben nu
een adviesblok: zonkracht, was-buiten-drogen, planten-beschermen,
sneeuwpret, strooien, terras-reinigen, buiten-schilderen en
hout-behandelen. Zolang BOL_SITE_ID leeg is blijven het gewone werkende
bol-links (geen commissie, wel functioneel); ze tracken nu met jouw echte SiteId (1532808), die als fallback in de
code staat. Uitbreiden naar meer tools is een bol-zoek-URL in het
affiliate-veld zetten. TradeTracker is het upgrade-pad voor de
niche-marge (paragraaf 3 en 7).

## 1. Hoe het technisch werkt

Affiliate is niets meer dan een gewone uitgaande link met een
herkenning erin. Je meldt je aan bij een programma of netwerk, krijgt
een unieke partner-id, en bouwt daarmee links naar producten. Klikt
iemand en koopt hij binnen de cookieperiode, dan schrijft het netwerk
een commissie bij. Belangrijk voor deze site:

- De tracking zit in de URL zelf (een `subid` of `site_id`-parameter),
  niet in een script. Er zijn dus geen pixels, geen cookiebanner-last
  en geen AVG-gedoe. Dat is precies waarom deze site voor een
  linkgebaseerd model kiest en niet voor advertentienetwerken.
- Met een eigen `subid` per tool of pagina zie je in het dashboard
  welke tool converteert. Handig: geef elke link een subid als de
  tool-id, bijvoorbeeld `?subid=planten-beschermen`, dan weet je later
  welke check geld oplevert.
- De commissie is meestal een percentage van de verkoop, categorie-
  afhankelijk. Bij bol.com geldt de commissie over de hele inhoud van
  de winkelwagen, niet alleen het aangeklikte product.
- Er zit een wachttijd op de uitbetaling (retourtermijn): de sale moet
  eerst definitief worden voordat de commissie vrijvalt.

In de codebase is dit al helemaal voorbereid (v3.22.0 "Foehn"):

- `lib/affiliate.js` bevat het schema en een validator.
- `components/AdviesBlok.js` rendert het blok: eerst tekstueel advies,
  dan de links met `rel="sponsored nofollow noopener"`, en eronder een
  verplichte disclosure. Geen banner, geen tracking.
- Het blok verschijnt alleen op de toolpagina (`app/[tool]/page.js`),
  bewust niet op de stadpagina's of de storefront.

Implementeren per tool = het veld `affiliate` (nu `null`) invullen.
Geen enginewijziging nodig. Twee werkende voorbeelden staan al in
`lib/tools/was-buiten-drogen.js` en `lib/tools/zonkracht.js` (met
placeholder-links tot de accounts er zijn).

## 2. Welk netwerk

Uit het onderzoek komen drie bruikbare partijen voor deze site, en een
duidelijk advies om klein te beginnen.

- **bol.com Partnerprogramma (de ruggengraat).** Commissie is
  categorie-afhankelijk, grofweg 3 tot 8 procent, en geldt over de hele
  winkelwagen. Open voor iedere natuurlijke persoon vanaf 18 jaar
  (geen KvK strikt vereist), gratis, met een aanvraag die kan worden
  afgekeurd als je site te dun is. Geen commissie op cadeaubonnen,
  abonnementen en bundels. Bij twaalf maanden zonder sale kan het
  partnerschap worden beeindigd. Dekt vrijwel al jouw productclusters
  (tuingereedschap, verf, tenten, hengelsport, sleeen, strooizout,
  vorstdoek) onder een account. Er is ook een API voor productdata.
  Lage commissie, maar universeel en vertrouwd.
  Bron: https://affiliate.bol.com/nl/

- **TradeTracker (voor je huis-en-tuinmarge).** Nederlands netwerk,
  sterk in Wonen, huis en tuin. Cruciaal: GAMMA en KARWEI (Intergamma)
  draaien hun affiliate-programma exclusief via TradeTracker. Dat is
  precies waar jouw schilder-, beits-, terras- en strooipubliek koopt
  (verf, beits, hogedrukreiniger, strooizout, tuingereedschap). Lage
  drempel, snelle goedkeuring, uitbetaling vanaf ongeveer tien euro,
  Real Attribution-model. Betere marge op klusproducten dan bol.
  Bron: https://tradetracker.com/nl/

- **Awin (later, optioneel).** Groot internationaal netwerk met merken
  als Decathlon, handig voor de outdoorclusters (tent, hengel, vlieger,
  slee, hardloopschoenen). Kleine aanmeldkosten (ongeveer vijf euro,
  meestal terugverdiend). Pas interessant als de site verkeer trekt.

Bewust NIET: Daisycon (sterk in finance, telecom en reizen, niet jouw
niche), CJ Affiliate (Engelstalig/SaaS), PayPro (digitale producten).
En gokken/bookmakers blijft af (Nederlands regelrisico, eerder
besloten).

Het advies dat in bijna elke bron terugkomt en bij jouw FIRE-stijl
past: begin bij een netwerk met lage drempel en Nederlandse
adverteerders, verdien daar eerst commissie, en breid pas dan uit.
Verspreiding over veel programma's tegelijk is dodelijk.
Bron: https://writgo.nl/beste-affiliate-netwerk-nederland

## 3. Per productcluster het netwerk

| Tool | Product | Netwerk |
| --- | --- | --- |
| buiten-schilderen | verf, kwasten, tape, schuurpapier | TradeTracker (Gamma/Karwei) of bol |
| hout-behandelen | beits, houtolie, lak, kwasten | TradeTracker (Gamma/Karwei) of bol |
| terras-reinigen | hogedrukreiniger, terrasreiniger, impregneer | TradeTracker (Gamma/Karwei) of bol |
| planten-beschermen | vorstdoek, tuinvlies, jute, kuippotvoeten | bol of tuincentra |
| sneeuwpret | slee, bob, sneeuwpak, handschoenen | bol (of Awin/Decathlon) |
| strooien | strooizout, sneeuwschep, sneeuwruimer | TradeTracker (Gamma/Karwei) of bol |
| grasmaaien, snoeien, water-geven, gras-zaaien | maaier, snoeischaar, gieter, graszaad | TradeTracker of bol |
| vissen | hengelsport | bol of Awin |
| vliegeren | vliegers, powerkites | bol |
| kamperen | tenten, slaapmatten | bol of Awin/Decathlon |

Kortom: TradeTracker plus bol dekt bijna alles wat de weertools
aanraden. Geen van deze clusters is consumer electronics, wat gunstig
is (zie paragraaf 6).

## 4. Per tool invullen

Vul het veld `affiliate` op de tool in volgens het schema uit
`lib/affiliate.js`. Voorbeeld voor planten-beschermen (vervang de
URL's door je eigen partnerlinks met subid):

```js
affiliate: {
  kop: { nl: "Tegen de nachtvorst", en: "Against the night frost" },
  advies: {
    nl: "Vorstdoek of tuinvlies houdt een paar graden vast en laat lucht door; leg het losjes over de plant zodat het het blad niet raakt. Voor kuipplanten helpen potvoeten en een plek tegen de gevel.",
    en: "Fleece holds a few degrees and lets air through; drape it loosely so it doesn't touch the leaves. For potted plants, pot feet and a spot against the wall help.",
  },
  items: [
    { label: { nl: "Vorstdoek / tuinvlies", en: "Fleece" }, url: "https://<partnerlink>?subid=planten-beschermen", partner: "Gamma" },
    { label: { nl: "Kuippot-voeten", en: "Pot feet" }, url: "https://<partnerlink>?subid=planten-beschermen", partner: "bol.com" },
  ],
},
```

Regels (de validator dwingt ze af):
- 1 tot 4 items per tool.
- Elke `url` is https en bevat je partner-id (en liefst een subid).
- `label` en `kop` en `advies` zijn tweetalig ({nl, en}). Let op: dit
  betekent dat je voor de Engelse markt ook Engelse labels nodig hebt.
  Zolang Engels is uitgesteld, kun je de Engelse tekst gelijk aan de
  Nederlandse houden of pas invullen bij de EN-run.
- Advies eerst, product als hulpmiddel. Het advies moet ook zonder de
  link nuttig zijn. Nooit "koop nu", nooit een banner.

## 5. Disclosure (verplicht)

Affiliate links zijn in Nederland wettelijk altijd reclame, ook zonder
contract, zodra je commissie ontvangt (relevante relatie). Je moet dat
duidelijk en eenvoudig toegankelijk vermelden. Het `AdviesBlok` doet
dat al met een vaste disclosure-regel onder de links; dat volstaat voor
een contentsite. De exacte bewoording is vrij, als maar duidelijk is
dat het reclame betreft.

- Handhaving loopt via de Reclame Code Commissie (aanbeveling, geen
  boete) en de ACM (wel boetes, tot in de honderdduizenden euro's bij
  misleiding).
- De nieuwe Reclamecode Social Media & Influencer Marketing (per 1 juli
  2026) noemt affiliate links expliciet. Die code richt zich vooral op
  video-platformmakers (YouTube, TikTok, Instagram); een gewone
  contentsite met een zichtbare disclosure zit goed. Twijfel je bij
  schaal, vraag het een jurist.

Bronnen: https://www.reclamecode.nl/over-de-src/faq/ en
https://www.acm.nl/nl/publicaties/voorlichting-aan-bedrijven/acm-leidraad/leidraad-bescherming-online-consument/regels-over-online-reclame

## 6. Twee spanningen om te bewaken

**Coolblue-conflict.** Je werkt bij Coolblue (consumer electronics).
Gebruik nooit het Coolblue Partnerprogramma: linken naar je eigen
werkgever is het duidelijkste belangenconflict en mogelijk in strijd
met je arbeidsvoorwaarden. Wees ook voorzichtig met consumer-
electronics affiliate in het algemeen (bijvoorbeeld drones bij de
dronecheck). Het goede nieuws: de weertools wijzen vrijwel allemaal
naar niet-electronics (tuingereedschap, verf, tenten, hengelsport,
sleeen, strooizout, vorstdoek), buiten Coolblue's kern, dus daar is het
conflict minimaal. Houd electronics-affiliate eruit of via een neutraal
netwerk, en mijd Coolblue en directe concurrenten.

**Anonimiteit.** De publieke site blijft faceless: er staat geen naam
op, en de disclosure onthult de commerciele relatie, niet je
persoonlijke identiteit. Faceless-naar-het-publiek is dus prima
verenigbaar met affiliate. Maar de uitbetaalkant is dat niet: netwerken
vragen identiteit en bankgegevens (soms KvK) voor de uitbetaling, dus
naar het netwerk en de Belastingdienst ben je niet anoniem. Het inkomen
is belastbaar. Ik ben geen belastingadviseur; check dit bij de
Belastingdienst of een accountant, zeker als het structureel wordt (dan
kan een KvK-inschrijving of een aparte administratie nodig zijn).

## 7. Volgorde

1. Meld je aan bij bol.com Partnerprogramma (laagste drempel, breedste
   dekking). Optioneel meteen TradeTracker erbij voor de klusmarge.
2. Vul het `affiliate`-veld op twee of drie tools met het meeste
   verkeer (bijvoorbeeld de tool die in Search Console het beste
   scoort). Gebruik subid's per tool.
3. Bewijs conversie op een netwerk voordat je uitbreidt. Werkt het,
   rol dan uit naar de rest van de clusters uit paragraaf 3.
4. Herinvesteer de opbrengst (volgende tool of ETF's), zoals de rest
   van het project.

## Bronnen

- bol.com Partnerprogramma: https://affiliate.bol.com/nl/
- bol.com affiliate voorwaarden: https://affiliate.bol.com/nl/algemene-voorwaarden/
- TradeTracker (Gamma/Karwei exclusief): https://tradetracker.com/nl/gamma-karwei-starten-affiliate-programma-bij-tradetracker/
- Netwerkvergelijking en start-advies: https://writgo.nl/beste-affiliate-netwerk-nederland
- Reclamecode FAQ (disclosure): https://www.reclamecode.nl/over-de-src/faq/
- ACM Leidraad online reclame: https://www.acm.nl/nl/publicaties/voorlichting-aan-bedrijven/acm-leidraad/leidraad-bescherming-online-consument/regels-over-online-reclame
