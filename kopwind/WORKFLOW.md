# WORKFLOW.md - van zip naar live site

Stap voor stap, voor dit project en elk ander Next.js-project op dezelfde
manier.

## Het idee in een zin

Je werkt op je laptop, GitHub bewaart alle versies, en Vercel kijkt naar
GitHub en zet elke nieuwe versie vanzelf live. Jij duwt alleen van je
laptop naar GitHub.

## A. Een nieuw project opzetten (eenmalig)

1. **Repository aanmaken op github.com.** Plus-knop rechtsboven, New
   repository, naam kiezen, op Private zetten. Niets aanvinken (geen
   README, geen .gitignore, geen license), anders botst het straks met je
   eigen bestanden. Create repository.
2. **Clonen met GitHub Desktop.** File, Clone repository, tabblad
   GitHub.com, de nieuwe repo kiezen, lokale map kiezen, Clone. Je hebt
   nu een lege map die met GitHub verbonden is.
3. **Zip uitpakken in die map.** Let op: de INHOUD van de map uit de zip
   moet erin, niet de map zelf. Goed is `projectmap/package.json`, fout is
   `projectmap/kopwind/package.json`. Zie je dat laatste, sleep dan alles
   een niveau omhoog.
4. **Check .gitignore.** Zet verborgen bestanden aan in je verkenner. In
   `.gitignore` horen minimaal `node_modules`, `.next` en `.env.local`. Zonder
   dit bestand upload je honderden megabytes onzin.
5. **Eerste commit.** In GitHub Desktop zie je alle bestanden als
   wijzigingen. Linksonder een omschrijving typen ("Eerste versie"),
   Commit to main, daarna bovenin Publish branch of Push origin.
6. **Vercel koppelen.** vercel.com, inloggen met GitHub, Add New,
   Project, de repo kiezen, Import. Next.js wordt vanzelf herkend.
   Omgevingsvariabelen (Supabase, VAPID, CRON_SECRET, zie AUDIT.md)
   invullen onder Environment Variables voordat je op Deploy klikt.
7. **Domein koppelen.** In het Vercel-project: Settings, Domains, je
   domein invullen en de DNS-records die Vercel toont invullen bij je
   domeinregistrar. DNS kan een paar uur duren.

Vanaf nu is elke push naar GitHub een nieuwe live versie.

## B. Een nieuwe zip van Claude verwerken (elke keer)

1. **Zip downloaden en uitpakken** in een tijdelijke map (Downloads).
2. **Oude bestanden vervangen, met drie uitzonderingen.** Open je
   projectmap, selecteer alles BEHALVE `.git`, `node_modules` en
   `.env.local`, en verwijder dat. Kopieer daarna de complete inhoud van
   de nieuwe zip erin. Waarom niet gewoon overschrijven: bestanden die in
   de nieuwe versie verwijderd zijn, blijven dan staan en kunnen rare
   fouten geven.
   - `.git` is je hele geschiedenis en de koppeling met GitHub. Weg is weg.
   - `node_modules` zit niet in de zip.
   - `.env.local` bevat je lokale sleutels.
3. **npm install** in de projectmap als `package.json` is veranderd. Bij
   twijfel gewoon draaien, kan geen kwaad.
4. **Kijk in GitHub Desktop wat er verandert.** Links de gewijzigde
   bestanden, rechts groen (erbij) en rood (eraf). Zie je honderden
   wijzigingen in `node_modules`, stop dan: je .gitignore is stuk.
5. **Commit met een nette naam**, bijvoorbeeld `v3.35.0 Bise: aftellers`.
6. **Push origin.** Vercel bouwt binnen seconden. Groen in het
   Vercel-dashboard is live; rood betekent dat de build faalde en dan blijft
   de vorige versie gewoon draaien.

## C. Als het misgaat

- **Slechte versie live?** Vercel, tabblad Deployments, de vorige goede
  versie, drie puntjes, Promote to Production. Binnen tien seconden terug.
- **Lokaal een wijziging terugdraaien?** GitHub Desktop, History,
  rechtsklik op de commit, Revert changes. Maakt een nieuwe commit die het
  terugdraait, zonder je geschiedenis kapot te maken.

## D. Wat per project verschilt

Alleen de omgevingsvariabelen in Vercel en het domein. Houd per project
een `.env.example` bij (kanhetvandaag heeft er al een) met de namen van de variabelen (zonder waardes),
dan zie je bij een nieuw project in een oogopslag wat er in Vercel moet.

## E. Na een deploy met nieuwe pagina's

- Search Console, Sitemaps: de sitemap opnieuw indienen is niet nodig,
  Google haalt hem zelf op. Wel handig: bij URL-inspectie een of twee
  nieuwe pagina's laten indexeren.
- De statuscheck uit AUDIT.md even langslopen.
