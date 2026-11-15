import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import EigenRisicoRekenaar from "@/components/reken/EigenRisicoRekenaar";
import { IS_EN } from "@/lib/i18n/locale";
import { EIGEN_RISICO } from "@/lib/geld";
import { vandaag } from "@/lib/aftellen/datums";

export const revalidate = 86400;

function jaarEnBedrag(nu) {
  // Vanaf november gaat de zoekvraag vooral over volgend jaar.
  const j = nu.m >= 11 && EIGEN_RISICO[nu.j + 1] ? nu.j + 1 : nu.j;
  return { j, bedrag: EIGEN_RISICO[j] ?? EIGEN_RISICO[Math.max(...Object.keys(EIGEN_RISICO).map(Number))] };
}

export function generateMetadata() {
  if (IS_EN) return {};
  const { j, bedrag } = jaarEnBedrag(vandaag());
  return {
    title: `Eigen risico ${j}: ${bedrag} euro, wat er wel en niet onder valt`,
    description: `Het verplicht eigen risico is in ${j} ${bedrag} euro. Wat er onder valt, wat niet, gespreid betalen en een rekenhulp voor wat je zelf betaalt.`,
    alternates: { canonical: "/eigen-risico" },
  };
}

export default function EigenRisicoPagina() {
  if (IS_EN) notFound();
  const { j, bedrag } = jaarEnBedrag(vandaag());
  return (
    <RekenPagina id="eigen-risico" h1={`Eigen risico ${j}: ${bedrag} euro`}>
      <section className="paneel aftel-hoofd">
        <p className="aftel-label">Verplicht eigen risico {j}</p>
        <p className="aftel-groot klein">{bedrag} euro</p>
        <p className="aftel-sub">voor iedereen van 18 jaar en ouder</p>
      </section>
      <EigenRisicoRekenaar eigenRisico={bedrag} jaar={j} />
      <section className="paneel reken-blok">
        <h2>Eigen risico per jaar</h2>
        <table className="reken-tabel">
          <tbody>
            {Object.entries(EIGEN_RISICO).map(([jaar, b]) => (
              <tr key={jaar} className={Number(jaar) === j ? "nu" : undefined}>
                <td>{jaar}</td>
                <td className="rechts">{b} euro</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </RekenPagina>
  );
}
