# Kopwind

Fiets of scooter? Kopwind rekent je hele dagketen door (bv. Thuis → Sportschool → Thuis → Werk), berekent per routesegment de kopwind op het moment dat jij daar fietst, en geeft advies per etappe en voor de hele dag: fiets prima, fiets met tegenzin, of pak de scooter.

## Starten

```bash
npm install
npm run dev
```

Open http://localhost:3000. Geen API-keys nodig. Klik op Demo om de app meteen in actie te zien met een voorbeeldketen door Rotterdam.

Optioneel: maak een `.env.local` met `ORS_API_KEY=...` (gratis key via openrouteservice.org) om te routeren via OpenRouteService in plaats van de publieke OSRM-fietsrouter. De app schakelt automatisch.

## Wat het doet

- Keten van stops: vertrekpunt van etappe N is automatisch het eindpunt van etappe N-1. Per etappe kies je een vertrektijd, een aankomsttijd (vertrek wordt teruggerekend met de reistijd), of "na vorige stop" met verblijftijd.
- Locaties: opgeslagen presets (Thuis, Werk, ...), huidige locatie via de browser, of adres zoeken met autocomplete.
- Wind op de route: de route wordt gesplitst in segmenten van ~300 m. Per segment: rijrichting (bearing), het voorspellingsuur waarop jij daar fietst, en dan kopwind = windsnelheid x cos(windrichting - rijrichting). Groen is rugwind, geel zijwind of licht, rood tegenwind. Op de kaart en in de windstrip per etappe zie je precies waar het pijn doet.
- Volledig weer per etappe: temperatuur, gevoelstemperatuur, neerslagkans en -hoeveelheid, windkracht (Beaufort), windrichting en windstoten.
- Advies: pijnscore 0 tot 100 per etappe uit tegenwind, regen, kou en windstoten. Drempels stel je zelf in. Het dagadvies volgt de zwaarste etappe: je kiest een keer per dag tussen fiets en scooter.
- Meldingen: ochtendbriefing op een vast tijdstip met het dagadvies en het weer, en een herinnering X minuten voor elke geplande vertrektijd met het advies en het actuele weer voor die etappe. Zet ze aan via de knop Meldingen.

## Meldingen: hoe en beperking

De meldingen gebruiken je laatst berekende keten. Kloktijden worden automatisch naar vandaag verschoven, zodat je vaste routine elke dag werkt zonder opnieuw invullen. Op het meldmoment wordt het actuele weer opgehaald, dus de melding klopt met dat moment.

Beperking: dit zijn webmeldingen vanuit de pagina. Er moet dus ergens een tabblad met Kopwind open staan (mag op de achtergrond). Een gemiste ochtendbriefing wordt tot 3 uur later ingehaald zodra je de app opent. Echte push zonder open tab vraagt een service worker plus een server die op tijden pusht; zie LOGBOEK.md.

## Testen

```bash
npm test
```

Draait de tests voor de rekenkern (bearing, haversine, windcomponenten, segmentering, uurkoppeling, samenvattingen), het adviesmodel, de meldingenplanning en een integratietest van de hele planner via de demoketen.

## Stack en keuzes

- Next.js 14 (App Router, plain JavaScript), Leaflet met OpenStreetMap-tiles.
- Routering: publieke OSRM-fietsrouter (FOSSGIS), optioneel OpenRouteService met key.
- Geocoding: Photon (komoot), met bias naar Nederland.
- Weer: Open-Meteo uurvoorspelling, tot ~4 dagen vooruit, zonder key.
- Drie dunne API-routes proxyen de externe diensten; alle rekenwerk zit in pure functies onder `lib/` en is getest.
- Alles lokaal in localStorage: presets, drempels, laatste keten, meldinginstellingen. Geen accounts, geen database.

Eerlijke beperking: Open-Meteo geeft modelwind op 10 m hoogte per uur. Lokale effecten (open dijk, tussen flats) zitten daar niet in. De kleuren zijn dus een goede gids, geen belofte.
