# Anonimiteit en veiligheid kanhetvandaag.nl

Doel: de complete site zo veilig mogelijk maken en niet naar de eigenaar
herleidbaar. Dit document is de audit plus het stappenplan. Belangrijk
vooraf: honderd procent veilig of honderd procent anoniem bestaat niet,
zeker niet zodra er geld (affiliate) en dus een uitbetaling in het spel is.
Wat hieronder staat brengt je zo dicht mogelijk bij dat ideaal en maakt
expliciet welke risico's overblijven en waar ze zitten.

## Deel 1. Wat de site zelf al anoniem maakt (in de code, geverifieerd)

De gedeployde site bevat geen persoonsgegevens van de eigenaar:

- **Geen account, geen naam, geen e-mail.** Bezoekers gebruiken de site
  zonder in te loggen. Voorkeuren, favorieten en locatie staan in de
  localStorage van de eigen browser. De privacypagina beschrijft dit
  precies zo.
- **Organization-JSON-LD en metadata** dragen alleen de merknaam en de
  site-URL. Geen author, geen founder, geen creator, geen contactpersoon.
- **Geen social links** en geen contactblok op de site (faceless).
- **Stemmen (duimpjes)** gebruiken een willekeurige apparaatcode uit de
  browser, zonder naam, e-mail of locatie.
- **Synccode-meldingen** bewaren op de server alleen een versleutelde
  afgeleide van de code plus de push-subscription. Geen identiteit.
- **Broncommentaar en interne docs** (LOGBOEK, CHANGELOG, dit bestand)
  noemen de eigenaar niet meer bij naam; alles is geneutraliseerd naar
  "de eigenaar". Commentaar wordt bovendien door de build geminificeerd,
  dus het staat sowieso niet in de gedeployde JavaScript.

Kortom: wie de site bezoekt of de broncode van de pagina's bekijkt, vindt
niets wat naar een persoon wijst.

## Deel 2. Waar de herleidbaarheid dan wel zit (buiten de site)

Dit zijn de punten die niet in de code zitten maar in de omgeving eromheen.
Hier ligt het echte werk, en dit is aan de eigenaar:

1. **Domeinregistratie (WHOIS).** Zorg dat kanhetvandaag.nl geregistreerd
   staat met WHOIS-bescherming of via een registrar die je persoonsgegevens
   afschermt. Bij .nl (SIDN) zijn de gegevens van particuliere houders niet
   openbaar opvraagbaar, maar controleer bij je registrar (Namecheap of
   Porkbun) dat die afscherming aan staat en dat er geen zakelijke gegevens
   zichtbaar zijn.

2. **Git-identiteit.** GitHub Desktop commit standaard met je echte naam en
   e-mailadres. Die metadata zit in elke commit. Zolang de repo besloten is,
   is dat niet openbaar, maar:
   - Houd de repository besloten (niet public).
   - Zet een pseudoniem en een apart e-mailadres in Git:
     `git config user.name "..."` en `git config user.email "..."` met een
     adres dat niet naar jou herleidt (bijvoorbeeld het door GitHub geleverde
     noreply-adres `ID+gebruikersnaam@users.noreply.github.com`).
   - Zou de repo ooit openbaar worden, scrub dan eerst de commit-historie.
     De naam staat nu niet meer in de bestanden zelf, maar wel in oude
     commits.

3. **Service-accounts.** Vercel, Supabase, Google Analytics, Resend en de
   registrar: maak en beheer die onder een apart, pseudoniem e-mailadres,
   niet je persoonlijke Gmail. Zet overal tweefactor-authenticatie (2FA)
   aan. Een bezoeker ziet deze accounts niet, maar ze koppelen het project
   administratief aan jou.

4. **De uitbetaling van affiliate is de fundamentele grens.** Elk
   affiliate-netwerk (bol, Amazon, TradeTracker, Daisycon, Awin) eist voor
   uitbetaling je echte identiteit plus bank- en belastinggegevens. Dat is
   onvermijdelijk als je wilt verdienen. Het is niet-openbaar naar het
   netwerk toe, maar het legt in hun administratie een link tussen de site
   en jou. Mitigatie: overweeg dit onder een eenmanszaak of ander
   KvK-nummer te doen, zodat de administratieve tegenpartij een bedrijf is
   in plaats van je naam als particulier. De site blijft naar de
   buitenwereld faceless.

5. **Dedicated e-mailadres.** Gebruik voor alles rond dit project (VAPID
   `VAPID_SUBJECT`, Resend-afzender, eventueel abuse/contact) een apart,
   neutraal adres op het eigen domein (bijvoorbeeld beheer@kanhetvandaag.nl
   via een alias), nooit je persoonlijke adres. De code heeft nu een
   neutrale placeholder (`mailto:beheer@example.com`); vul in Vercel een
   neutraal adres in, geen persoonlijk.

6. **Werkgever-conflict.** Coolblue niet als affiliate-partner en geen
   verwijzingen naar je werk. Dit stond al vast en blijft zo.

## Deel 3. Beveiliging: wat af is en wat je moet onderhouden

"Honderd procent veilig" is een mythe: er is altijd restrisico. Wat je wel
kunt doen is de bekende aanvalsvlakken afdekken. Stand van zaken:

**Afgedekt in de code (zie ook SECURITY.md):**
- Security headers: Content-Security-Policy (geverifieerd tegen de
  draaiende productieserver), HSTS, X-Frame-Options DENY,
  X-Content-Type-Options, Referrer-Policy en Permissions-Policy.
- Cookiebalk met consent-gate voor Google Analytics (geen analytische
  cookies zonder toestemming).
- Env-hygiene: service-role- en VAPID-geheime sleutels zijn server-only;
  alleen echt-publieke waarden staan als NEXT_PUBLIC.
- Cron-route beschermd met een geheim.
- Geen tracking-pixels of advertentienetwerken.

**Jouw doorlopende onderhoud (dit houdt het veilig, niet eenmalig):**
1. **2FA overal** (Vercel, Supabase, GitHub, Google, registrar, e-mail).
   Dit is de belangrijkste enkele maatregel tegen accountovername.
2. **Supabase Row Level Security.** Controleer dat RLS aan staat op alle
   tabellen en dat de anon-key alleen kan wat hij mag. De service-role-key
   mag alleen server-side gebruikt worden, nooit in de client.
3. **Rate-limiting op de open API-proxies.** `/api/geocode`,
   `/api/weather` en `/api/route/minutely` zijn open proxies naar gratis
   publieke diensten. Laag risico, maar bij groei of misbruik: voeg een
   simpele rate-limit of een herkomstcheck (Origin/Referer van het eigen
   domein) toe, zodat niemand via jouw domein kan scrapen. Zie het
   aandachtspunt in SECURITY.md.
4. **Afhankelijkheden bijwerken.** Draai af en toe `npm audit` en werk
   kwetsbare packages bij.
5. **Secrets roteren** als je vermoedt dat er iets gelekt is, en nooit
   secrets in de repo committen (ze horen in Vercel-env).
6. **Backups/herstel** van de Supabase-data, zodat een fout of incident
   te herstellen is.

## Deel 4. Samengevat

- De **site zelf** is naar buiten toe anoniem en de code is geneutraliseerd.
- De **herleidbaarheid** die overblijft zit in domein-WHOIS, git-identiteit,
  service-accounts en vooral de affiliate-uitbetaling; die punten zijn
  operationeel en staan hierboven als checklist.
- **Honderd procent veilig** bestaat niet; met de headers, consent,
  env-hygiene en het onderhoud hierboven dek je de bekende risico's af.
- De enige onvermijdelijke identiteitslink is de **uitbetaling** van
  affiliate-inkomsten naar het netwerk; overweeg dat via een bedrijfsvorm
  te doen zodat het niet je naam als particulier is.
