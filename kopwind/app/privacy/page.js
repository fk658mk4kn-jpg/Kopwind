import { HUB_NAAM } from "@/lib/brand";

export const metadata = {
  title: "Privacy",
  description: "Wat Kan het vandaag? wel en niet van je weet, in gewone taal.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPagina() {
  return (
    <main>
      <div className="tool-hero">
        <h1>Privacy</h1>
        <p>Kort en in gewone taal: dit weten we wel en niet van je.</p>
      </div>
      <section className="seotekst">
        <h2>Geen account, geen profiel</h2>
        <p>
          Je gebruikt {HUB_NAAM} zonder account, e-mailadres of naam. Je routes, favoriete
          plekken en instellingen staan in de localStorage van je eigen browser en verlaten
          je apparaat niet, tenzij je zelf apparaten koppelt met een synccode.
        </p>
        <h2>Synccode en meldingen</h2>
        <p>
          Koppel je apparaten met een synccode, dan bewaren we op de server alleen een
          versleutelde afgeleide van die code met je instellingen en, als je meldingen aanzet,
          het push-abonnement van je browser. Daar zit geen naam of e-mailadres aan vast.
          Ontkoppel je, dan stopt het gebruik ervan.
        </p>
        <h2>Weer en routes ophalen</h2>
        <p>
          Voor een check sturen we de plek of route die jij kiest (als coördinaten) naar de
          databronnen: Open-Meteo voor weer, OSRM voor routes en Photon voor het zoeken van
          plaatsen. Dat is nodig om het antwoord te kunnen geven en meer sturen we niet mee.
        </p>
        <h2>Statistieken: Google Analytics 4</h2>
        <p>
          We meten bezoek met Google Analytics 4 om te zien welke checks gebruikt worden en
          waar de site hapert. Daarvoor plaatst Google een meet-cookie of identifier in je
          browser. We gebruiken die cijfers alleen als statistiek en verkopen niks door; er
          staan geen advertenties op de site.
        </p>
        <h2>Vragen of weg ermee</h2>
        <p>
          Alles lokaal wissen kan altijd: verwijder de sitedata van deze site in je browser.
          Gekoppelde apparaten ontkoppel je in het meldingenpaneel; daarmee vervalt ook het
          push-abonnement.
        </p>
      </section>
    </main>
  );
}
