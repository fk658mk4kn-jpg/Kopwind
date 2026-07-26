import BeslissingenLijst from "@/components/BeslissingenLijst";
import Broodkruimel from "@/components/Broodkruimel";
import { BESLISSINGEN } from "@/content/beslissingen";
import { HUB_NAAM } from "@/lib/brand";
import { kies } from "@/lib/i18n/locale";
import { PAD } from "@/lib/i18n/paden";

const T = kies({
  nl: {
    titel: "Alle keuzehulpen op een rij",
    oms: "De complete catalogus: elke check en elke vraag, gegroepeerd per situatie, met een statusstip die het oordeel van nu toont. Van jas tot barbecue en van regen tot winter.",
    sub: "Elke check en elke vraag, gegroepeerd per situatie. De stip toont het oordeel van nu.",
  },
  en: {
    titel: "Every guide at a glance",
    oms: "The full catalogue: every check and every question, grouped by situation, with a status dot showing the current verdict. From coat to barbecue and from rain to winter.",
    sub: "Every check and every question, grouped by situation. The dot shows the current verdict.",
  },
});

export const metadata = {
  title: T.titel,
  description: T.oms,
  alternates: { canonical: PAD.alleChecks },
};

export default function AlleChecksPagina() {
  return (
    <main>
      <Broodkruimel items={[{ naam: HUB_NAAM, href: "/" }, { naam: T.titel }]} />
      <div className="tool-hero">
        <h1>{T.titel}</h1>
        <p>{T.sub}</p>
      </div>
      <BeslissingenLijst groepen={BESLISSINGEN} />
    </main>
  );
}
