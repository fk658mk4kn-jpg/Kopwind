import { kies } from "@/lib/i18n/locale";
import { PAD } from "@/lib/i18n/paden";

const T = kies({
  nl: {
    metaTitel: "Bronnen en data",
    metaOms: "Welke data Kan het vandaag? gebruikt en waarom: Open-Meteo, OSRM en Photon.",
    heroSub: "Open data, netjes vermeld. Dit is waar de checks op rekenen.",
    blokken: [
      { kop: "Weer: Open-Meteo", p: "Alle checks rekenen op de uurvoorspelling van Open-Meteo: temperatuur, gevoelstemperatuur, neerslag en buienkans, wind en windstoten, luchtvochtigheid, bewolking en uv. Open-Meteo combineert modellen van onder meer het KNMI, DWD en ECMWF en is vrij te gebruiken. Bij elke check zie je het tijdstip waarop de data live is opgehaald." },
      { kop: "Routes: OSRM en OpenStreetMap", p: "De fietscheck rekent routes met OSRM op kaartdata van OpenStreetMap, inclusief alternatieve routes. De kaartweergave gebruikt OpenStreetMap-tegels. Kaartdata is van de OpenStreetMap-bijdragers." },
      { kop: "Plaatsen zoeken: Photon", p: "Adressen en plaatsnamen zoek je via Photon, de open geocoder op OpenStreetMap-data van Komoot." },
      { kop: "Wat we er zelf mee doen", p: "De weging, de oordelen, de droogtijd-schatting en de teksten zijn van ons. De rekensommen staan uitgelegd op de uitleg-pagina's, zodat je kunt controleren waarom een check zegt wat hij zegt." },
    ],
  },
  en: {
    metaTitel: "Sources and data",
    metaOms: "What data Good day for it? uses and why: Open-Meteo, OSRM and Photon.",
    heroSub: "Open data, properly credited. This is what the checks run on.",
    blokken: [
      { kop: "Weather: Open-Meteo", p: "All checks run on the Open-Meteo hourly forecast: temperature, feels-like, precipitation and shower risk, wind and gusts, humidity, cloud cover and UV. Open-Meteo combines models from among others KNMI, DWD and ECMWF and is free to use. Every check shows the time the data was fetched live." },
      { kop: "Routes: OSRM and OpenStreetMap", p: "The bike check computes routes with OSRM on OpenStreetMap data, including alternatives. The map view uses OpenStreetMap tiles. Map data is by the OpenStreetMap contributors." },
      { kop: "Place search: Photon", p: "Addresses and place names are found via Photon, the open geocoder on OpenStreetMap data by Komoot." },
      { kop: "What we add ourselves", p: "The weighting, the verdicts, the drying-time estimate and the copy are ours. The maths is explained on the explainer pages, so you can verify why a check says what it says." },
    ],
  },
});

export const metadata = {
  title: T.metaTitel,
  description: T.metaOms,
  alternates: { canonical: PAD.bronnen },
};

export default function BronnenPagina() {
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
            <p>{b.p}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
