import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import ProcentRekenaar from "@/components/reken/ProcentRekenaar";
import { IS_EN } from "@/lib/i18n/locale";

export const metadata = IS_EN
  ? {}
  : {
      title: "Procenten berekenen: procent van, stijging, korting",
      description: "Reken uit hoeveel procent van een getal is, welk percentage iets is, hoeveel iets is gestegen of gedaald, en wat je betaalt na korting. Met uitleg en voorbeelden.",
      alternates: { canonical: "/procenten-berekenen" },
    };

const VOORBEELDEN = [
  ["10 procent van 250", "25"],
  ["15 procent van 80", "12"],
  ["21 procent van 50", "10,50"],
  ["25 procent korting op 60", "45"],
  ["Van 900 naar 945", "plus 5 procent"],
  ["12 van 48", "25 procent"],
];

export default function ProcentPagina() {
  if (IS_EN) notFound();
  return (
    <RekenPagina id="procenten">
      <ProcentRekenaar />
      <section className="paneel reken-blok">
        <h2>Voorbeelden</h2>
        <table className="reken-tabel">
          <tbody>
            {VOORBEELDEN.map(([v, a]) => (
              <tr key={v}>
                <td>{v}</td>
                <td className="rechts">{a}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </RekenPagina>
  );
}
