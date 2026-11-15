import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import { IS_EN } from "@/lib/i18n/locale";
import { vandaag, dagNaam, zonTijden, tijdTekst, datumTekst } from "@/lib/aftellen/datums";
import { huidigSeizoen } from "@/lib/seizoen";

export const revalidate = 3600;

export function generateMetadata() {
  if (IS_EN) return {};
  return {
    title: "Wanneer is stroom vandaag het goedkoopst? Dynamische stroomprijs per uur",
    description:
      "Wanneer is stroom met een dynamisch contract het goedkoopst en het duurst? Het patroon per dagdeel, de rol van zon, wind en weekend, en wanneer je wast, laadt of droogt.",
    alternates: { canonical: "/wanneer-is-stroom-het-goedkoopst" },
  };
}

const PATROON = [
  { deel: "Nacht (0 tot 6 uur)", prijs: "Laag", uitleg: "Weinig vraag. Vaak het goedkoopst in de winter." },
  { deel: "Ochtend (6 tot 9 uur)", prijs: "Hoger", uitleg: "Iedereen staat op, de zon levert nog weinig." },
  { deel: "Middag (9 tot 17 uur)", prijs: "Laagst bij zon", uitleg: "Zonnepanelen leveren volop; op zonnige dagen het goedkoopste blok." },
  { deel: "Vroege avond (17 tot 21 uur)", prijs: "Hoogst", uitleg: "Koken, verwarmen en laden terwijl de zon weg is." },
  { deel: "Late avond (21 tot 24 uur)", prijs: "Dalend", uitleg: "De vraag zakt weer naar het nachtniveau." },
];

const SEIZOEN_ZIN = {
  winter: "In de winter is het middagdal klein omdat de zon laag staat en kort schijnt. De wind bepaalt dan veel, en de nacht is vaak de goedkoopste tijd.",
  lente: "In het voorjaar zijn de middagen op zonnige dagen vaak het goedkoopst van het hele jaar, soms met negatieve beursprijzen in het weekend.",
  zomer: "In de zomer is het middagdal diep en breed. De avondpiek blijft, maar valt later omdat het lang licht is.",
  herfst: "In de herfst wordt het middagdal kleiner. Op winderige dagen kan de prijs de hele dag laag zijn.",
};

export default function StroomPagina() {
  if (IS_EN) notFound();
  const dag = vandaag();
  const z = zonTijden(dag, 52.1, 5.18);
  const weekend = ["zaterdag", "zondag"].includes(dagNaam(dag));
  const seizoen = huidigSeizoen();
  return (
    <RekenPagina id="stroomprijs">
      <section className="paneel aftel-hoofd">
        <p className="aftel-label">Vandaag, {datumTekst(dag, { metDag: true })}</p>
        <p className="aftel-groot klein">Rond {tijdTekst(z.middag)}</p>
        <p className="aftel-sub">
          staat de zon het hoogst. Is het zonnig, dan is stroom in de uren rond dat moment waarschijnlijk het goedkoopst. Het duurst is het meestal tussen 17:00 en 21:00 uur.
        </p>
        <ul className="aftel-feiten">
          <li>{weekend ? "Het is weekend: de prijzen liggen gemiddeld lager dan doordeweeks." : "Het is een werkdag: overdag is de vraag hoger dan in het weekend."}</li>
          <li>{SEIZOEN_ZIN[seizoen]}</li>
        </ul>
        <p className="aftel-voetnoot">Exacte uurprijzen tonen we zodra de koppeling met de dagmarkt klaar is. Tot die tijd staan ze in de app van je leverancier.</p>
      </section>
      <section className="paneel reken-blok">
        <h2>Het patroon door de dag</h2>
        <table className="reken-tabel">
          <thead>
            <tr>
              <th>Dagdeel</th>
              <th>Prijs</th>
              <th>Waarom</th>
            </tr>
          </thead>
          <tbody>
            {PATROON.map((p) => (
              <tr key={p.deel}>
                <td>{p.deel}</td>
                <td>{p.prijs}</td>
                <td>{p.uitleg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </RekenPagina>
  );
}
