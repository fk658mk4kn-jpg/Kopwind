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
