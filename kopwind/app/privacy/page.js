import { HUB_NAAM } from "@/lib/brand";
import { kies } from "@/lib/i18n/locale";

const T = kies({
  nl: {
    metaTitel: "Privacy",
    metaOms: "Wat Kan het vandaag? wel en niet van je weet, in gewone taal.",
    heroSub: "Kort en in gewone taal: dit weten we wel en niet van je.",
    blokken: [
      { kop: "Geen account, geen profiel", p: (n) => `Je gebruikt ${n} zonder account, e-mailadres of naam. Je routes, favoriete plekken en instellingen staan in de localStorage van je eigen browser en verlaten je apparaat niet, tenzij je zelf apparaten koppelt met een synccode.` },
      { kop: "Synccode en meldingen", p: () => "Koppel je apparaten met een synccode, dan bewaren we op de server alleen een versleutelde afgeleide van die code met je instellingen en, als je meldingen aanzet, het push-abonnement van je browser. Daar zit geen naam of e-mailadres aan vast. Ontkoppel je, dan stopt het gebruik ervan." },
      { kop: "Duimpjes onder een advies", p: () => "Stem je met een duim omhoog of omlaag of het advies klopte, dan bewaren we die stem met de check, de datum en een willekeurige apparaatcode. Die code is een random nummer uit je eigen browser en dient alleen om dubbel stemmen tegen te gaan; er hangt geen naam, e-mailadres of locatie aan. De totalen tonen we anoniem bij de check. Niet stemmen kan natuurlijk ook: de knoppen doen niets tot je erop tikt." },
      { kop: "Weer en routes ophalen", p: () => "Voor een check sturen we de plek of route die jij kiest (als co\u00f6rdinaten) naar de databronnen: Open-Meteo voor weer, OSRM voor routes en Photon voor het zoeken van plaatsen. Dat is nodig om het antwoord te kunnen geven en meer sturen we niet mee." },
      { kop: "Statistieken: Google Analytics 4", p: () => "We meten bezoek met Google Analytics 4 om te zien welke checks gebruikt worden en waar de site hapert. Daarvoor plaatst Google een meet-cookie of identifier in je browser. We gebruiken die cijfers alleen als statistiek en verkopen niks door; er staan geen advertenties op de site." },
      { kop: "Vragen of weg ermee", p: () => "Alles lokaal wissen kan altijd: verwijder de sitedata van deze site in je browser. Gekoppelde apparaten ontkoppel je in het meldingenpaneel; daarmee vervalt ook het push-abonnement." },
    ],
  },
  en: {
    metaTitel: "Privacy",
    metaOms: "What Good day for it? does and doesn't know about you, in plain words.",
    heroSub: "Short and in plain words: this is what we do and don't know about you.",
    blokken: [
      { kop: "No account, no profile", p: (n) => `You use ${n} without an account, email address or name. Your routes, favourite places and settings live in your own browser's localStorage and never leave your device, unless you link devices yourself with a sync code.` },
      { kop: "Sync code and notifications", p: () => "If you link devices with a sync code, the server only stores an encrypted derivative of that code with your settings and, if you turn on notifications, your browser's push subscription. No name or email address is attached. Unlink and its use stops." },
      { kop: "Thumbs under an advice", p: () => "If you vote with a thumb up or down on whether the advice was right, we store that vote with the check, the date and a random device code. That code is a random number from your own browser and only prevents double voting; no name, email address or location is attached. Totals are shown anonymously with the check. Not voting is fine too: the buttons do nothing until you tap them." },
      { kop: "Fetching weather and routes", p: () => "For a check we send the place or route you pick (as coordinates) to the data sources: Open-Meteo for weather, OSRM for routes and Photon for place search. That's needed to give the answer and nothing more is sent along." },
      { kop: "Statistics: Google Analytics 4", p: () => "We measure visits with Google Analytics 4 to see which checks get used and where the site stumbles. For that, Google places a measurement cookie or identifier in your browser. We use those numbers as statistics only and sell nothing on; there are no ads on the site." },
      { kop: "Questions or clean slate", p: () => "Wiping everything locally is always possible: delete this site's data in your browser. Linked devices are unlinked in the notifications panel; that also ends the push subscription." },
    ],
  },
});

export const metadata = {
  title: T.metaTitel,
  description: T.metaOms,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPagina() {
  return (
    <main>
      <div className="tool-hero">
        <h1>{T.metaTitel}</h1>
        <p>{T.heroSub}</p>
      </div>
      <section className="seotekst">
        {T.blokken.map((b) => (
          <div key={b.kop}>
            <h2>{b.kop}</h2>
            <p>{b.p(HUB_NAAM)}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
