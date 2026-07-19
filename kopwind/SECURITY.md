# Security en cookies kanhetvandaag.nl

Review en maatregelen (v3.31.0 "Sirocco", 2026-07-19). Opdracht: kritisch
kijken naar de veiligheid en de cookieregeling, en het goed zetten. Dit
document beschrijft wat er is gevonden, wat er is aangepast, en wat er nog
aan Martijn is.

## 1. Cookies (de belangrijkste bevinding)

**Wat er mis was:** Google Analytics 4 laadde onvoorwaardelijk bij elke
paginalading (components/Analytics.js, via next/script afterInteractive).
GA4 zet een meet-cookie/identifier in de browser. Onder de Nederlandse en
EU-cookiewet mag dat pas NA toestemming (analytische cookies zijn niet
strikt noodzakelijk). Er was geen consent-gate, dus de cookies werden
zonder toestemming gezet. Dat is niet conform.

**Wat er nu staat:**
- Een zelf gebouwde, minimale cookiebalk (components/CookieConsent.js).
  Geen dienst van derden, geen extern script; past bij de privacy-first,
  faceless opzet.
- De keuze staat in localStorage onder "kh-consent" (granted of denied).
- Analytics.js laadt GA pas bij "granted" en luistert naar het event
  "kh-consent-changed", zodat GA meteen na akkoord laadt zonder herladen.
- Zonder keuze of bij "denied": GA laadt niet, geen analytische cookies.
- De privacy-pagina is bijgewerkt: statistiek alleen met toestemming, plus
  een blok over winkellinks (zie affiliate).

**Belangrijk onderscheid:** de site zet zelf geen trackingcookies. De
functionele opslag (voorkeuren, recent gebruikte checks, gekozen locatie,
synccode) staat in localStorage en is functioneel; die is altijd
toegestaan en valt niet onder de consent-plicht. Affiliate/partnerlinks
zetten hooguit een cookie op het domein van de winkel NA een klik, niet op
deze site; daar is geen consent voor nodig en de disclosure bij het blok
dekt het.

**Alternatief dat de balk overbodig maakt:** overstappen op cookieloze
statistiek (Vercel Web Analytics of Plausible) vraagt helemaal geen
cookiebalk en sluit aan bij de oorspronkelijke privacy-first opzet. Dan
vervalt zowel GA als de balk. Dit is een keuze voor Martijn; de huidige
oplossing (GA achter toestemming) is compliant en houdt je GA-meting.

## 2. Security headers

**Wat er mis was:** next.config.mjs had geen security headers.

**Wat er nu staat** (next.config.mjs, async headers op /:path*):
- Content-Security-Policy: alleen de bronnen die de site echt gebruikt,
  na inventarisatie in de code. default-src 'self'; scripts van eigen
  origin plus googletagmanager (met 'unsafe-inline' voor de inline-scripts
  van Next en de GA-init); connect naar eigen origin en google-analytics;
  afbeeldingen van eigen origin, data:, tile.openstreetmap.org (de kaart)
  en google; frame-ancestors 'none'; object-src 'none'; base-uri en
  form-action 'self'.
- Strict-Transport-Security: max-age 2 jaar, includeSubDomains, preload.
- X-Frame-Options: DENY (de site hoeft nooit in een iframe).
- X-Content-Type-Options: nosniff.
- Referrer-Policy: strict-origin-when-cross-origin.
- Permissions-Policy: geolocation=(self) (nodig voor de locatie-check),
  camera/microphone/payment/usb/browsing-topics uit.

**Kanttekening:** de CSP is opgesteld op basis van de code, niet tegen
productie getest. Check na de deploy even de browserconsole op
CSP-waarschuwingen, vooral bij de kaart en, na cookie-akkoord, GA. Als er
iets legitiems geblokkeerd wordt, staat de bron toevoegen in een regel.

## 3. Wat al goed was

- **Env-hygiene.** De service-role-sleutel van Supabase
  (SUPABASE_SERVICE_ROLE_KEY) en de VAPID private key
  (VAPID_PRIVATE_KEY) zijn server-only (lib/server/db.js en
  lib/server/push.js), niet NEXT_PUBLIC. De VAPID public key hoort publiek
  te zijn (die gaat naar de browser voor de push-subscription), dus
  NEXT_PUBLIC_VAPID_PUBLIC_KEY is correct. Verder staan alleen echt
  publieke waarden als NEXT_PUBLIC (GA-id, bol SiteId, site-URL,
  GSC-verificatie, locale).
- **Cron.** /api/cron/meldingen controleert een geheim (CRON_SECRET) via
  Authorization Bearer, x-cron-secret of ?secret=, en weigert zonder
  match. Goed.
- **Geen tracking-pixels of advertentienetwerken.** De AdSlot voor
  advertenties blijft bewust leeg; het affiliate-model is linkgebaseerd.

## 4. Aandachtspunten (laag risico, ter overweging)

- **Open API-proxies.** /api/geocode (Photon), /api/weather en
  /api/route/minutely proxyen gratis, keyloze publieke diensten. Ze zijn
  open (iedereen kan ze aanroepen). Voor een persoonlijk project is dat
  fair-use en laag risico, maar als het verkeer groeit of iemand ze
  misbruikt om via jouw domein te scrapen, overweeg dan een simpele
  rate-limit of een herkomstcheck (Referer/Origin van je eigen domein).
- **CSP aanscherpen (later).** 'unsafe-inline' bij script-src is nodig
  zolang Next en GA inline-scripts gebruiken. Wil je strenger, dan kan dat
  met nonces, maar dat is meer werk en niet urgent.
- **Cookieloze statistiek** (zie paragraaf 1) haalt zowel GA als de balk
  weg; overweeg dit als de banner niet bij de faceless opzet past.

## 5. Actiepunten voor Martijn

1. Vul je bol SiteId in (NEXT_PUBLIC_BOL_SITE_ID in Vercel) om affiliate
   live te laten tellen; zie AFFILIATE.md.
2. Check na de deploy de browserconsole op CSP-waarschuwingen (kaart, GA).
3. Beslis over de statistiek: GA achter de cookiebalk houden (nu zo), of
   overstappen op cookieloze statistiek zonder banner.
