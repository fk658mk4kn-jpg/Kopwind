import { HUB_NAAM } from "@/lib/brand";
import { kies } from "@/lib/i18n/locale";
import { PAD } from "@/lib/i18n/paden";

const T = kies({
  nl: {
    metaTitel: "Voorwaarden",
    metaOms: "De spelregels van Kan het vandaag?, zonder kleine lettertjes.",
    heroSub: "De spelregels, in drie korte afspraken.",
    blokken: [
      { kop: "Gratis, zoals het is", p: (n) => `${n} is gratis te gebruiken. We doen ons best om de site beschikbaar en de cijfers kloppend te houden, maar geven daar geen garanties op. Er kan een check uitvallen, een databron haperen of een voorspelling ernaast zitten.` },
      { kop: "Een voorspelling is geen belofte", p: () => "Alle adviezen zijn gebaseerd op weersvoorspellingen en die zitten er soms naast. Beslissingen die je op basis van een check neemt zijn voor eigen rekening en risico. Bij twijfel: kijk naar buiten en gebruik je verstand, zeker bij hard weer." },
      { kop: "Netjes gebruiken", p: () => "Gebruik de site zoals hij bedoeld is: als hulpmiddel voor je eigen dagelijkse beslissingen. Geautomatiseerd leegtrekken van de achterliggende diensten valt daar niet onder; die bronnen hebben hun eigen voorwaarden." },
    ],
  },
  en: {
    metaTitel: "Terms",
    metaOms: "The ground rules of Good day for it?, without the small print.",
    heroSub: "The ground rules, in three short agreements.",
    blokken: [
      { kop: "Free, as is", p: (n) => `${n} is free to use. We do our best to keep the site available and the numbers right, but give no guarantees. A check can go down, a data source can stutter or a forecast can miss.` },
      { kop: "A forecast is not a promise", p: () => "All advice is based on weather forecasts and those are sometimes wrong. Decisions you take based on a check are at your own expense and risk. In doubt: look outside and use your judgement, especially in rough weather." },
      { kop: "Fair use", p: () => "Use the site as intended: as a helper for your own daily decisions. Automated scraping of the underlying services is not part of that; those sources have their own terms." },
    ],
  },
});

export const metadata = {
  title: T.metaTitel,
  description: T.metaOms,
  alternates: { canonical: PAD.voorwaarden },
};

export default function VoorwaardenPagina() {
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
