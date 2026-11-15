import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import WerkdagenRekenaar from "@/components/reken/WerkdagenRekenaar";
import { IS_EN } from "@/lib/i18n/locale";
import { vandaag, werkdagenPerMaand, sleutel, ymd, MAAND_NAMEN } from "@/lib/aftellen/datums";

export const revalidate = 3600;

export function generateMetadata() {
  if (IS_EN) return {};
  const j = vandaag().j;
  const totaal = werkdagenPerMaand(j + 1).reduce((a, m) => a + m.werkdagen, 0);
  return {
    title: `Werkdagen ${j} en ${j + 1} per maand, plus werkdagen berekenen`,
    description: `${j + 1} telt ${totaal} werkdagen. Per maand het aantal werkdagen en feestdagen voor ${j} en ${j + 1}, en een rekenhulp voor elke periode.`,
    alternates: { canonical: "/werkdagen" },
  };
}

function Jaar({ j, huidigeMaand }) {
  const maanden = werkdagenPerMaand(j);
  const totaal = maanden.reduce((a, m) => a + m.werkdagen, 0);
  return (
    <section className="paneel reken-blok">
      <h2>Werkdagen {j}</h2>
      <table className="reken-tabel">
        <thead>
          <tr>
            <th>Maand</th>
            <th className="rechts">Werkdagen</th>
            <th className="rechts">Feestdagen op een werkdag</th>
          </tr>
        </thead>
        <tbody>
          {maanden.map((m) => (
            <tr key={m.maand} className={huidigeMaand === m.maand ? "nu" : undefined}>
              <td>{MAAND_NAMEN[m.maand - 1]}</td>
              <td className="rechts">{m.werkdagen}</td>
              <td className="rechts">{m.feestdagen || ""}</td>
            </tr>
          ))}
          <tr>
            <th>Totaal</th>
            <th className="rechts">{totaal}</th>
            <th className="rechts">{maanden.reduce((a, m) => a + m.feestdagen, 0)}</th>
          </tr>
        </tbody>
      </table>
      {j % 5 === 0 && <p className="reken-noot">Lustrumjaar: Bevrijdingsdag is als vrije dag meegeteld.</p>}
    </section>
  );
}

export default function WerkdagenPagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  return (
    <RekenPagina id="werkdagen" h1={`Werkdagen ${nu.j} en ${nu.j + 1}`}>
      <WerkdagenRekenaar van={sleutel(nu)} tot={sleutel(ymd(nu.j, 12, 31))} />
      <Jaar j={nu.j} huidigeMaand={nu.m} />
      <Jaar j={nu.j + 1} />
    </RekenPagina>
  );
}
