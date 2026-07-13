# Vandaag op de fiets?

Kan ik vandaag beter met de fiets naar werk? Deze check rekent je woon-werkrit door (heen, terug en eventuele tussenstops), berekent per stuk route hoeveel wind je tegen hebt op het uur dat je daar fietst, en geeft per rit een rapportcijfer met advies: prima fietsdag, pittige rit, of vandaag liever niet fietsen.

Interne werknaam van dit project: kopwind (mapnaam, opslagsleutels en zip heten zo; alles wat de gebruiker ziet heet "Vandaag op de fiets?").

## Starten

```bash
npm install
npm run dev
```

Open http://localhost:3000. Geen API-keys nodig. Klik op Demo om de check meteen in actie te zien met een voorbeeldketen door Rotterdam.

Optioneel in `.env.local`:
- `ORS_API_KEY=...` (gratis via openrouteservice.org) om te routeren via OpenRouteService in plaats van de publieke OSRM-fietsrouter.
- `NEXT_PUBLIC_SITE_URL=https://jouwdomein.nl` voor SEO (canonical, Open Graph, robots.txt en sitemap.xml).

## Wat het doet

- Woon-werkrit als keten: van huis naar werk, met als je wilt een tussenstop (sportschool, school). Vertrekpunt van rit N is automatisch het eindpunt van rit N-1. Per rit kies je: vertrekken nu (actuele situatie), een vertrektijd, of een aankomsttijd (vertrek wordt teruggerekend met de reistijd).
- Routes opslaan: bewaar je complete route (stops plus tijden) onder een naam, bv. "Woon-werk". Morgen staat hij met een klik klaar.
- Favoriete plekken: bewaar Thuis en Werk een keer; een plek die al favoriet is herken je aan de gevulde gouden ster.
- Wind op de route: de route wordt gesplitst in stukken van ~300 m. Per stuk: rijrichting, het voorspellingsuur waarop jij daar fietst, en dan tegenwind = windsnelheid x cos(windrichting - rijrichting). Groen is wind mee, amber licht of zijwind, rood wind tegen, met een witte omranding zodat de kleuren op elke kaartachtergrond leesbaar zijn. Windpijlen en een kompas tonen waar de wind vandaan komt.
- Routealternatieven: elke route krijgt zijn eigen windanalyse, zodat je ziet of een andere fietsroute naar werk minder tegenwind heeft. Alternatieven liggen gestippeld op de kaart in hun eigen windkleuren; klik op de lijn of op een chip om te wisselen. De route met de minste wind wordt gemarkeerd.
- Rapportcijfer per rit: wind, regen, kou en windstoten drukken het cijfer (10 = perfecte fietsdag). 7 of hoger prima, 4 tot 7 pittig, onder de 4 liever niet. Drempels stel je zelf in. De zwaarste rit bepaalt het dagadvies, want de fiets gaat mee of niet.
- Compacte ritblokken: direct onder de configuratie zie je per rit in een oogopslag route, tijden, weer, cijfer en waar op de route de wind zit.
- Meldingen: ochtendbriefing met het dagadvies en het weer, en een herinnering X minuten voor elke geplande vertrektijd. Werkt zolang er een tabblad open staat.

## SEO

- Titel, metabeschrijving, keywords, canonical, Open Graph en Twitter-card in `app/layout.js` (basis-URL via `NEXT_PUBLIC_SITE_URL`).
- `robots.txt` en `sitemap.xml` via `app/robots.js` en `app/sitemap.js`.
- H1 plus tekstsectie met tussenkoppen en FAQ over fietsen naar werk, fietsweer, wind tegen en het beste vertrekmoment.
- JSON-LD: FAQPage en WebApplication.

## Testen

```bash
npm test
```

Tests voor de rekenkern (bearing, haversine, windcomponenten, segmentering, uurkoppeling, samenvattingen), het cijfer- en adviesmodel, de meldingenplanning en een integratietest van de hele planner via de demoketen.

## Stack en keuzes

- Next.js 14 (App Router, plain JavaScript), Leaflet met OpenStreetMap-tiles.
- Routering: publieke OSRM-fietsrouter (FOSSGIS) met alternatieven, optioneel OpenRouteService met key.
- Geocoding: Photon (komoot), met bias naar Nederland. Weer: Open-Meteo uurvoorspelling, tot ~4 dagen vooruit, zonder key.
- Drie dunne API-routes proxyen de externe diensten; alle rekenwerk zit in pure functies onder `lib/` en is getest.
- Alles lokaal in localStorage: favorieten, routes, drempels, laatste keten, meldinginstellingen. Geen accounts, geen database.

Eerlijke beperking: Open-Meteo geeft modelwind op 10 m hoogte per uur. Lokale effecten (open dijk, tussen flats) zitten daar niet in. De kleuren zijn een goede gids, geen belofte.

## Synchronisatie en meldingen op je telefoon (PWA)

Apparaten koppel je met een synccode (geen account): maak hem aan via de knop Meldingen, voer hem in op je andere apparaat, en routes, favorieten en instellingen reizen mee. Meldingen stel je per opgeslagen route in (ochtendbriefing en/of herinnering voor vertrek) en komen binnen als echte pushberichten, ook als de app dicht is. Op iPhone: zet de site op je beginscherm (deelknop, "Zet op beginscherm"), open de app daarvandaan en zet dan meldingen aan (iOS 16.4+).

Serverkant (eenmalige setup, alles gratis):
1. Supabase: maak een project (free tier), plak `supabase/schema.sql` in de SQL editor, en zet `SUPABASE_URL` en `SUPABASE_SERVICE_ROLE_KEY` in je Vercel-omgeving.
2. VAPID: draai `npx web-push generate-vapid-keys` en zet `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` en `NEXT_PUBLIC_VAPID_PUBLIC_KEY`.
3. Klok: maak op cron-job.org (gratis) een job die elke 5 minuten `GET https://jouwdomein.nl/api/cron/meldingen` aanroept met header `x-cron-secret` gelijk aan je `CRON_SECRET`.

Zonder deze configuratie werkt de check gewoon; alleen sync en meldingen geven dan een nette foutmelding. Push vereist HTTPS (Vercel regelt dat; localhost werkt ook voor desktop-tests).

## v2.0.0 "Passaat": de hub Vandaag wel?

De app is nu een merk-hub met meerdere weerbeslissing-tools. De fietscheck
(/fietsen-naar-werk) blijft de vlaggendrager; de wascheck
(/was-buiten-drogen) bewijst het register met een droogvenster per dag.

Structuur:
- lib/engine/ gedeelde kern: locatie, weer-adapter (declareerbare velden),
  wind (ongewijzigd), generieke score, advies, meldingschema-evaluator,
  eenheden (i18n-naad)
- lib/tools/ het register: een bestand per tool, index.js valideert
- content/ SEO-teksten en FAQ per tool, gescheiden van code
- app/[tool]/ en app/[tool]/[stad]/ en app/van/.../naar/... programmatische
  pagina's uit register maal lib/steden/nl.js; sitemap volgt automatisch

Nieuwe tool toevoegen: schrijf lib/tools/mijn-tool.js (zie
was-buiten-drogen.js als voorbeeld), registreer hem in lib/tools/index.js,
voeg content/mijn-tool.js toe en koppel hem in content/index.js. Locatie-
tools krijgen de pagina's, meldingen, sitemap en hub-kaart er gratis bij;
alleen een eigen resultaat-UI (zoals WasTool) is nog handwerk.

Design-tokens (app/globals.css): lucht #E9EEF3, wolk #FFFFFF, inkt #17222C,
delfts #234E9D, en het oordeel-trio groen #15803D / amber #B45309 / rood
#B91C1C. Display-letter: Archivo Variable (fontsource, offline). De
windstrip is de signature; de urenstrip van de wascheck gebruikt dezelfde
vormtaal.

## Versies en tags

Semver met windcodenamen; details in LOGBOEK.md, scanlijst in CHANGELOG.md.
Git leeft op jouw machine, dus zet de tags lokaal:

    git tag v1.0.0 <hash van je laatste commit voor deze drop>
    git add -A && git commit -m "v2.0.0 Passaat: merk-hub met toolregister"
    git tag v2.0.0
    git add -A && git commit -m "v2.1.0 Mistral: audit, ankers, wegwijzer-design"
    git tag v2.1.0
    git push && git push --tags

## v2.1.0 "Mistral" in het kort

Live domein: https://kanhetvandaag.nl. Zet in Vercel de env-var
NEXT_PUBLIC_SITE_URL=https://kanhetvandaag.nl (de code valt er ook zonder
op terug via lib/site.js, maar expliciet is beter). Tokens: leisteen
#1B2733 en bewegwijzering-geel #F2B705 naast lucht/wolk/inkt; display is
Bricolage Grotesque (fontsource). Kleurbeleid staat in
lib/engine/kleuren.js: wind divergerend blauw-oranje, goedheid
sequentieel cividis, altijd met legenda en woordlabels. De OG-images
gebruiken de woff in assets/og/; regenereren kan met
node scripts/maak-og-font.mjs.

## Releasen

```
git tag -a v2.2.0 -m "Zephyr"
git tag -a v3.0.0 -m "Levante"
git tag -a v3.1.0 -m "Chinook"
git push origin v2.2.0
```

## Engelse site onder /en (v3.4.0 "Ponente")

Een codebase, twee builds, een domein. De taal wordt bij de build
gebakken via NEXT_PUBLIC_SITE_LOCALE; de Engelse site leeft op
kanhetvandaag.nl/en/ via een multi-zone opzet.

Opzet:

1. Nederlands project (bestaand): zet `EN_ZONE_URL` naar de deploy-URL
   van het Engelse project. Alles onder /en wordt daarheen doorgestuurd
   (rewrites in next.config.mjs).
2. Engels project (tweede Vercel-project, zelfde repo): zet
   - `NEXT_PUBLIC_SITE_LOCALE=en` (activeert basePath /en)
   - `NEXT_PUBLIC_SITE_URL=https://kanhetvandaag.nl/en`
   - `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` (eigen property, anders meet de
     fallback in de NL-property)
3. Optioneel hreflang: `NEXT_PUBLIC_ALTERNATE_LOCALE_URL` op beide
   projecten naar de zustertaal. De taalwissel-link (menu en footer)
   verschijnt zodra die gezet is.

De EN-build draait dus met basePath /en, zodat alle interne links,
assets en API-routes automatisch onder /en vallen. Engelse pretty-paths
(/en/explainers, /en/about) lopen via rewrites naar de fysieke NL-mappen.

Wat er per taal meegaat: merk (lib/brand.js), toolslugs en alle
registerteksten (T-blok per tool), gegenereerde zinnen, UI-strings
(lib/strings/), content (content/en/ plus selectors), varianten
(lib/varianten.js), paden (lib/i18n/paden.js), sitemap, manifest en
llms.txt.

## Een nieuwe locatie-tool bouwen (overlay-contract)

Een nieuwe check is sinds v2.2.0 een overlay plus content, geen herbouw:

1. `lib/tools/<naam>.js`: exporteer een `overlay(hourly, nu, instellingen)` die
   `{ legenda, dagen: [{ datum, uren, venster, conditie, status, metric }] }`
   teruggeeft (zie terras.js als kleinste voorbeeld), plus de toolconfig met
   `cta`, `icoon`, `groep`, `diepte`, `weerVelden: BASIS_VELDEN`, `instellingen`
   en `adviesLabels`.
2. `content/<slug>.js`: seo, blokken en faq. Registreer in `content/index.js`.
3. Voeg de tool toe aan `TOOLS` in `lib/tools/index.js`. Klaar: de toolpagina,
   35 stad-pagina's, de sitemap, de instellingen-tab, de meldingen en de
   cron-briefing volgen automatisch uit het register.

Sinds Sirocco is elke tool tweetalig: zet alle teksten (slug, naam,
zinnen als templatefuncties) in een `const T = kies({ nl: {...}, en:
{...} })` bovenin het toolbestand; zie lib/tools/barbecue.js als
voorbeeld. Vergeet de Engelse content in content/en/ en de registratie
in content/index.js niet.

## Categorie-storefronts (v3.6.0 "Bora")

Elke categorie is een rankbare storefront op de root (/regen-en-droog
etc.), niet /c/. Ze lopen via de /[tool]-route: die checkt eerst
vindCategorie (dan <Storefront>), anders de toolpagina. Zo staan
categorie en tool op de root zonder Next.js-routeconflict; botsende
slugs worden door valideerRegister afgevangen. Storefront-content
(beslislogica, situaties, seizoen, FAQ-anchors) staat in
content/storefronts.js; alleen ingevulde categorien tonen die secties,
de rest toont enkel de tool-kaarten.

## Derde databron: 15-minuten neerslag (minutely)

De regen-timing- en paraplu-check draaien op minutely_15 (Open-Meteo,
DWD ICON-D2 en Meteo-France AROME voor Centraal-Europa). Laag:
lib/engine/minutely.js (haalMinutely plus analyseerMinutely),
app/api/minutely/route.js, haalMinutely in externe.js. Deze tools
declareren databron "minutely" en een eigenComponent
(RegenTimingTool/ParapluTool), want hun UI is nowcast, geen 5-daagse
dagkiezer. De gedeelde useLocatie-hook levert de plek-logica.

## Categorie-taxonomie en cannibalisatie

De zeven categorien en welke vraag een eigen pagina wordt versus een
anchor/FAQ staan in BACKLOG.md (taxonomie-sprint). Kernregel: een hub
vangt de brede zoekintentie, alleen echt aparte intenties (timing,
actie) krijgen een eigen URL. Zo voorkom je dat varianten van dezelfde
vraag om hetzelfde zoekwoord concurreren.

## Categorieen (oude opzet, v3.5)

lib/categorieen.js is de categorie-laag boven het register: elke tool
heeft een categorieId, elke categorie een eigen route (/c en /c/<slug>).
Nu overzichtspagina's; in v3.6 worden dit storefronts (etalage met
gidsen en FAQ), in v3.7 komt affiliate op twee niveaus (breed op de
categorie, specifiek op de tool). Zie BACKLOG.md voor het plan.

## Weerfactoren-balken

lib/engine/factoren.js toont wat een oordeel bepaalt, als 0-100 balken
per factor. BEWUST losgekoppeld van de overlays (die het echte oordeel
berekenen en getest zijn): deze laag leest dezelfde inputs en geeft een
uitlegbare benadering. Een nieuwe tool krijgt balken door een profiel
toe te voegen aan PROFIELEN; geen profiel betekent geen balken.

## Vraagpagina's (varianten) en tweede databron

Een vraagpagina (bv. "korte broek aan?") is een lichte variant op een
bestaande tool: definieer hem in lib/varianten.js (ouderId, slug, vraag)
en schrijf content/<slug>.js plus de EN-variant. vindTool lost de slug
op naar een pseudo-tool; de engine van de ouder doet het rekenwerk. Geen
enginewijziging nodig.

Een tool op een andere databron dan het weer (zoals hooikoorts op
pollen) declareert `databron` plus de veldnamen; LocatieTool kiest op dat
veld de juiste client-helper. Zie lib/engine/lucht.js en
app/api/lucht/route.js als blauwdruk voor een nieuwe bron.

## Nav-deeplinks

`lib/engine/navigatie.js` bouwt de open-in-Maps-links. Google gebruikt het
officiele universele schema met `travelmode=bicycling` en waypoints; Apple het
klassieke `saddr/daddr/dirflg=c` (fietsvlag community-gedocumenteerd sinds
iOS 14, onbekende vlaggen worden genegeerd; waypoints bestaan daar niet).

## Verdictmodel (v3.0.0)

Geen cijfers in beeld: elke check antwoordt met Ja of Nee plus een schaalwoord
(Zeer slecht, Matig, Twijfelachtig, Goed, Ideaal) uit `lib/engine/schaal.js`.
De interne pijnscore (0..100) blijft de motor: schaal, badgekleur en
meldingsdrempels rekenen ermee, de UI toont alleen woorden. Overlays leveren
per dag een `antwoord: { ja, zin }`; tools zonder kan-vraag (kleding) geven
`ja: null` en tonen alleen het schaalwoord.

## Duimpjes (sociale laag)

`/api/stem` bewaart anonieme stemmen (een per apparaat per tool per dag) via
de bestaande server-helper `lib/server/db.js` met de service-role key. Er is
geen extra package of env nodig; alleen eenmalig deze tabel in Supabase:

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

De service key omzeilt RLS; zonder policies is de tabel dicht voor directe
client-toegang. `@supabase/supabase-js` en `@supabase/ssr` zijn bewust niet
geinstalleerd: die zijn voor sessies en auth, en duimpjes zijn anoniem.

## Analytics

GA4 laadt via `components/Analytics.js` met meet-ID uit `NEXT_PUBLIC_GA_ID`
en `G-DRGGM053ZK` als fallback, zodat de tag ook zonder Vercel-env in de
HTML staat (vereist voor Google's tagcontrole). Pageviews stuurt
`AnalyticsPageViews` zelf, inclusief App Router-routewissels.

## Tool-eigen verdictwoorden (v3.1.0)

Elke tool levert `schaalLabels` met vijf woorden (ideaal, goed, twijfelachtig,
matig, zeer-slecht). `labelVoor(score, tool.schaalLabels)` uit
`lib/engine/schaal.js` vertaalt de interne score naar het toolwoord; zonder
labels valt hij terug op de generieke schaal. Instellingen-velden kennen twee
vormen: een nummerveld (`key`, `label`, `eenheid`) of een keuzeveld
(`type: "keuze"`, `vraag`, `keuzes: [{ label, zet: {...} }]`) waarvan een
keuze exact de defaults hoort te zijn; `geavanceerd: true` verplaatst een veld
naar het uitklapblok.
