# AUDIT.md - installatie en verificatie

Af te vinken checklist om kanhetvandaag.nl volledig werkend te krijgen.
De code valt netjes terug als iets ontbreekt, dus de site draait ook
zonder dit, maar deze onderdelen (stemmen, sync, meldingen) werken pas
na configuratie.

## Waarom nu belangrijk

De productielogs toonden 502 op /api/stem en /api/sync. 502 betekent dat
de env-vars deels gezet zijn (dbGeconfigureerd geeft true) maar de
Supabase-call zelf een non-2xx teruggeeft. Op een leesactie (de GET van
/api/stem) betekent 502 dus NIET dat de key de anon key is: met de anon
key en RLS aan zonder policies geeft een SELECT gewoon 200 met een lege
lijst terug ({"omhoog":0,"omlaag":0}), geen fout. Een 502 op een GET komt
uit iets anders: de tabel ontbreekt of staat in een ander schema (404,
PostgREST-code PGRST205), de kolommen wijken af (400, 42703), de key is
verminkt of van een ander project (401), of SUPABASE_URL heeft een
trailing slash waardoor het pad een dubbele slash krijgt. Sinds v3.7.1
loggen beide routes de detailfout en geven ze detail mee in de body; kijk
in Vercel > je project > Logs naar de regel "stem GET faalde: ..." of open
de API-URL en lees het detail-veld. Die regel wijst de oorzaak exact aan.

---

## 1. Supabase (stemmen en sync) - KRITIEK

Zonder dit: de duimpjes-teller werkt niet en je telefoon-instellingen
komen niet op de computer (en andersom).

### 1a. Env-vars in Vercel
Zet bij beide Vercel-projecten (NL en EN) onder Settings > Environment
Variables:
- `SUPABASE_URL` = https://xxxx.supabase.co (Project URL uit Supabase)
- `SUPABASE_SERVICE_ROLE_KEY` = de **service_role** key, NIET de anon key
  (Supabase > Project Settings > API > service_role, secret)

Let op: de service_role key is geheim en omzeilt RLS. Gebruik hier nooit
de anon key. Op een schrijfactie (een stem opslaan, een koppelcode maken)
blokkeert RLS de anon key en krijg je een fout; op een leesactie krijg je
stilletjes lege data. In beide gevallen werkt de laag niet zoals bedoeld.

### 1b. Tabellen aanmaken
De canonieke SQL voor sync en meldingen staat in `supabase/schema.sql`
(profielen, push_abos, melding_log, met RLS aan). Plak dat bestand een
keer in Supabase > SQL Editor. Plak daarna dit extra blok voor de
duimpjes-tabel (stemmen), die niet in schema.sql staat:

```sql
-- Stemmen (duimpjes)
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

Let op de namen. De code verwacht exact deze vier tabellen: `stemmen`,
`profielen`, `push_abos` en `melding_log` (enkelvoud). Heb je eerder per
ongeluk `meldingen_log` (meervoud) aangemaakt, hernoem hem dan; de code
dedupliceert meldingen via deze tabel, dus met de verkeerde naam vertrekt
er niets:

```sql
alter table meldingen_log rename to melding_log;
```

(De tabel is alleen een logboekje met drie dagen bewaartijd; desnoods mag
je hem droppen en schema.sql opnieuw draaien, dan verlies je niets
blijvends.)

De service key omzeilt RLS, dus policies zijn niet nodig; zonder policies
is de tabel dicht voor directe clienttoegang. Dat is precies wat we willen
(alle toegang loopt via de server-routes).

### 1c. Verifieren
Na deploy, open in de browser:
- `https://www.kanhetvandaag.nl/api/stem?tool=terras&dag=2026-07-13`
  Verwacht: JSON zoals {"omhoog":0,"omlaag":0}. NIET 502 of 503.
- Duim omhoog geven op een toolpagina en verversen: het aantal naast de
  duim hoort te stijgen.
- Koppelcode: instellingen > "Maak een koppelcode", code overtypen op een
  ander apparaat onder "vul een bestaande code in". Favorieten en
  instellingen horen daarna gelijk te staan.

Als /api/stem nu 503 geeft: env-vars ontbreken nog.
Als 502: lees het detail-veld in de response of de log-regel "stem GET
faalde: ...". Dat wijst aan of het de tabelnaam, een kolom, de key of de
URL is (zie "Waarom nu belangrijk").

---

## 2. Push-meldingen (VAPID + cron) - BELANGRIJK

Zonder dit: gebruikers kunnen zich abonneren maar krijgen nooit een
melding.

### 2a. VAPID-sleutels genereren
Lokaal een keer:
```
npx web-push generate-vapid-keys
```
Zet in Vercel (beide projecten):
- `VAPID_PUBLIC_KEY` = de public key
- `VAPID_PRIVATE_KEY` = de private key
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` = dezelfde public key (de browser leest
  deze)
- `VAPID_SUBJECT` = mailto:jouwmail@voorbeeld.nl

### 2b. Cron-secret en de klok
- `CRON_SECRET` = een lange random string (bv. uit een wachtwoordgenerator)

Belangrijk: op het Vercel Hobby-plan mag een cron maar 1x per dag draaien
en faalt een vaker-schema (zoals */5) bij de deploy. Daarom staat
vercel.json bewust op een lege crons-lijst en gebruiken we een externe
gratis cron die /api/cron/meldingen elke 5 minuten aanroept. De route
accepteert het geheim op drie manieren: header `Authorization: Bearer
<CRON_SECRET>` (Vercel Cron op Pro), header `x-cron-secret: <CRON_SECRET>`,
of `?secret=<CRON_SECRET>` in de URL.

Externe cron opzetten (cron-job.org, gratis):
1. Maak een account op cron-job.org.
2. Nieuwe cronjob, URL: `https://www.kanhetvandaag.nl/api/cron/meldingen`.
3. Schedule: elke 5 minuten.
4. Voeg onder de request-headers een header toe: naam `x-cron-secret`,
   waarde = de exacte CRON_SECRET uit Vercel.
5. Bewaar en zet aan. De historie op cron-job.org hoort status 200 te
   tonen met een JSON-body zoals
   {"gecheckt":..,"verzonden":..,"fouten":[]}.

Ga je later naar Vercel Pro, dan kun je in plaats hiervan de crons weer in
vercel.json zetten (*/5) en de externe cron uitzetten.

### 2c. Verifieren
- cron-job.org toont status 200 op de laatste run, met een JSON-body.
- Een melding instellen in de app en wachten tot het ingestelde tijdstip;
  of de endpoint eenmalig handmatig aanroepen in een open meldingsvenster
  (zie de statuscheck onderaan) en kijken of de melding binnenkomt.

---

## 3. Analytics en Search Console - AANBEVOLEN

- `NEXT_PUBLIC_GA_ID` = je eigen GA4 meet-ID (nu valt de code terug op
  G-DRGGM053ZK; werkt, maar zet je eigen ID zodat de data in jouw
  property komt).
- `NEXT_PUBLIC_GSC_VERIFICATION` = de verificatiecode van Search Console
  (Instellingen > eigendomsverificatie > HTML-tag, alleen de content-waarde).
- `NEXT_PUBLIC_SITE_URL` = https://www.kanhetvandaag.nl (expliciet, zodat
  canonicals en sitemap kloppen).

Verifieren: GA4 Realtime toont je eigen bezoek; Search Console accepteert
de verificatie.

---

## 4. Fietsroutes (optioneel)

- `ORS_API_KEY` = alleen nodig als je OpenRouteService gebruikt in plaats
  van het gratis OSRM. Zonder deze key gebruikt de fietscheck OSRM; dat
  werkt prima.

---

## 5. Engelse site onder /en

Tweede Vercel-project op dezelfde repo:
- `NEXT_PUBLIC_SITE_LOCALE=en` (activeert basePath /en)
- `NEXT_PUBLIC_SITE_URL=https://www.kanhetvandaag.nl/en`
- eigen `NEXT_PUBLIC_GA_ID`
- Op het NL-project: `EN_ZONE_URL` = de deploy-URL van het EN-project
- Optioneel op beide: `NEXT_PUBLIC_ALTERNATE_LOCALE_URL` naar de
  zustertaal (dan verschijnt de taalwissel-link).

---

## Snelle statuscheck (na elke deploy)

| Test-URL | Verwacht |
|---|---|
| /api/stem?tool=terras&dag=<datum> | JSON met omhoog/omlaag, geen 502/503 |
| /api/sync (POST via de app: Maak koppelcode) | een code, geen foutmelding |
| /api/weather?lat=52.09&lon=5.12 | JSON met hourly |
| /api/minutely?lat=52.09&lon=5.12 | JSON met minutely (regen-timing) |
| /api/cron/meldingen (header x-cron-secret) | JSON met gecheckt/verzonden/fouten, geen 401/502 |
| cron-job.org historie | status 200, elke 5 minuten |
| GA4 Realtime | eigen bezoek zichtbaar |
