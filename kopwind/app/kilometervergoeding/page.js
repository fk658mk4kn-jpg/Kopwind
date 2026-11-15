import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import KilometerRekenaar from "@/components/reken/KilometerRekenaar";
import { IS_EN } from "@/lib/i18n/locale";
import { KM_VERGOEDING, reiskosten } from "@/lib/geld";
import { vandaag } from "@/lib/aftellen/datums";

export const revalidate = 86400;

const eur = (n) => n.toLocaleString("nl-NL", { style: "currency", currency: "EUR" });

function huidig(nu) {
  const j = nu.m >= 11 && KM_VERGOEDING[nu.j + 1] ? nu.j + 1 : nu.j;
  return { j, perKm: KM_VERGOEDING[j] ?? KM_VERGOEDING[2027] };
}

export function generateMetadata() {
  if (IS_EN) return {};
  const { j, perKm } = huidig(vandaag());
  return {
    title: `Kilometervergoeding ${j}: ${eur(perKm)} per km onbelast, met rekenhulp`,
    description: `De onbelaste kilometervergoeding is in ${j} ${eur(perKm)} per kilometer. Reken je reiskostenvergoeding woon-werk uit per dag, maand en jaar.`,
    alternates: { canonical: "/kilometervergoeding" },
  };
}

export default function KilometerPagina() {
  if (IS_EN) notFound();
  const { j, perKm } = huidig(vandaag());
  const afstanden = [5, 10, 15, 20, 30, 40, 50];
  return (
    <RekenPagina id="kilometervergoeding" h1={`Kilometervergoeding ${j}: ${eur(perKm)} onbelast`}>
      <KilometerRekenaar perKm={perKm} />
      <section className="paneel reken-blok">
        <h2>Vergoeding per maand bij vijf dagen</h2>
        <table className="reken-tabel">
          <thead>
            <tr>
              <th>Enkele reis</th>
              <th className="rechts">Per dag</th>
              <th className="rechts">Per maand</th>
            </tr>
          </thead>
          <tbody>
            {afstanden.map((k) => {
              const r = reiskosten(k, 5, perKm);
              return (
                <tr key={k}>
                  <td>{k} km</td>
                  <td className="rechts">{eur(r.perDag)}</td>
                  <td className="rechts">{eur(r.perMaand)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="reken-noot">Met 214 reisdagen per jaar, de rekenregel van de Belastingdienst voor een vaste vergoeding bij vijf dagen per week.</p>
      </section>
      <section className="paneel reken-blok">
        <h2>Onbelast per kilometer</h2>
        <table className="reken-tabel">
          <tbody>
            {Object.entries(KM_VERGOEDING).map(([jaar, b]) => (
              <tr key={jaar} className={Number(jaar) === j ? "nu" : undefined}>
                <td>{jaar}</td>
                <td className="rechts">{eur(b)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </RekenPagina>
  );
}
