import { HUB_NAAM } from "@/lib/brand";

export const metadata = {
  title: `Voorwaarden | ${HUB_NAAM}`,
  description: "De spelregels van Kan het vandaag?, zonder kleine lettertjes.",
  alternates: { canonical: "/voorwaarden" },
};

export default function VoorwaardenPagina() {
  return (
    <main>
      <div className="tool-hero">
        <h1>Voorwaarden</h1>
        <p>Geen kleine lettertjes, wel drie duidelijke afspraken.</p>
      </div>
      <section className="seotekst">
        <h2>Gratis, zoals het is</h2>
        <p>
          {HUB_NAAM} is gratis te gebruiken. We doen ons best om de site beschikbaar en de
          cijfers kloppend te houden, maar geven daar geen garanties op. Er kan een check
          uitvallen, een databron haperen of een voorspelling ernaast zitten.
        </p>
        <h2>Een voorspelling is geen belofte</h2>
        <p>
          Alle adviezen zijn gebaseerd op weersvoorspellingen en die zitten er soms naast.
          Beslissingen die je op basis van een check neemt zijn voor eigen rekening en risico.
          Bij twijfel: kijk naar buiten en gebruik je verstand, zeker bij hard weer.
        </p>
        <h2>Netjes gebruiken</h2>
        <p>
          Gebruik de site zoals hij bedoeld is: als hulpmiddel voor je eigen dagelijkse
          beslissingen. Geautomatiseerd leegtrekken van de achterliggende diensten valt daar
          niet onder; die bronnen hebben hun eigen voorwaarden.
        </p>
      </section>
    </main>
  );
}
