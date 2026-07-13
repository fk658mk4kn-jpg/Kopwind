import BeslissingenLijst from "@/components/BeslissingenLijst";
import Broodkruimel from "@/components/Broodkruimel";
import { CATEGORIEEN } from "@/content/beslissingen";
import { HUB_NAAM } from "@/lib/brand";
import { kies } from "@/lib/i18n/locale";
import { PAD } from "@/lib/i18n/paden";

const T = kies({
  nl: {
    titel: "Alle weerbeslissingen op een plek",
    oms: "Van jas tot barbecue en van regen tot sporten: vind direct jouw ja of nee. Live checks plus alles wat eraan komt.",
    sub: "Vind direct jouw ja of nee. Van jas tot barbecue, van regen tot sporten.",
  },
  en: {
    titel: "All weather decisions in one place",
    oms: "From coat to barbecue and from rain to sport: find your yes or no right away. Live checks plus everything on the way.",
    sub: "Find your yes or no right away. From coat to barbecue, from rain to sport.",
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
      <BeslissingenLijst categorieen={CATEGORIEEN} />
    </main>
  );
}
