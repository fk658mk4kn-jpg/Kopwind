import { HUB_NAAM } from "@/lib/brand";

export const metadata = {
  title: `Bronnen en data | ${HUB_NAAM}`,
  description: "Welke data Kan het vandaag? gebruikt en waarom: Open-Meteo, OSRM en Photon.",
  alternates: { canonical: "/bronnen" },
};

export default function BronnenPagina() {
  return (
    <main>
      <div className="tool-hero">
        <h1>Bronnen en data</h1>
        <p>Open data, netjes vermeld. Dit is waar de checks op rekenen.</p>
      </div>
      <section className="seotekst">
        <h2>Weer: Open-Meteo</h2>
        <p>
          Alle checks rekenen op de uurvoorspelling van Open-Meteo: temperatuur,
          gevoelstemperatuur, neerslag en buienkans, wind en windstoten, luchtvochtigheid,
          bewolking en uv. Open-Meteo combineert modellen van onder meer het KNMI, DWD en
          ECMWF en is vrij te gebruiken. Bij elke check zie je het tijdstip waarop de data
          live is opgehaald.
        </p>
        <h2>Routes: OSRM en OpenStreetMap</h2>
        <p>
          De fietscheck rekent routes met OSRM op kaartdata van OpenStreetMap, inclusief
          alternatieve routes. De kaartweergave gebruikt OpenStreetMap-tegels. Kaartdata is
          van de OpenStreetMap-bijdragers.
        </p>
        <h2>Plaatsen zoeken: Photon</h2>
        <p>
          Adressen en plaatsnamen zoek je via Photon, de open geocoder op
          OpenStreetMap-data van Komoot.
        </p>
        <h2>Wat we er zelf mee doen</h2>
        <p>
          De weging, de cijfers, de droogtijd-schatting en de teksten zijn van ons. De
          rekensommes staan uitgelegd op de uitleg-pagina's, zodat je kunt controleren waarom
          een check zegt wat hij zegt.
        </p>
      </section>
    </main>
  );
}
