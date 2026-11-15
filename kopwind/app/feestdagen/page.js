import Link from "next/link";
import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import { IS_EN } from "@/lib/i18n/locale";
import { vandaag, feestdagenLijst, datumTekst, weekdag, vergelijk } from "@/lib/aftellen/datums";
import { vindAftellerOpId } from "@/lib/aftellen";

export const revalidate = 3600;

export function generateMetadata() {
  if (IS_EN) return {};
  const j = vandaag().j;
  return {
    title: `Feestdagen ${j} en ${j + 1}: alle vrije dagen op een rij`,
    description: `Alle Nederlandse feestdagen van ${j} en ${j + 1} met de weekdag, welke op een werkdag vallen en hoeveel vrije dagen dat oplevert.`,
    alternates: { canonical: "/feestdagen" },
  };
}

const VRIJ = { ja: "Meestal vrij", lustrum: "Vrij in lustrumjaren", nee: "Meestal werkdag", zondag: "Zondag" };

function Jaar({ j, nu }) {
  const lijst = feestdagenLijst(j);
  const opWerkdag = lijst.filter((f) => f.vrij === "ja" && ![0, 6].includes(weekdag(f.datum))).length;
  return (
    <section className="paneel reken-blok">
      <h2>Feestdagen {j}</h2>
      <table className="reken-tabel">
        <thead>
          <tr>
            <th>Feestdag</th>
            <th>Datum</th>
            <th>Vrij?</th>
          </tr>
        </thead>
        <tbody>
          {lijst.map((f) => {
            const teller = f.teller ? vindAftellerOpId(f.teller) : null;
            const voorbij = vergelijk(f.datum, nu) < 0;
            return (
              <tr key={f.id} style={voorbij ? { opacity: 0.55 } : undefined}>
                <td>{teller ? <Link href={`/${teller.slug}`}>{f.naam}</Link> : f.naam}</td>
                <td>{datumTekst(f.datum, { metDag: true, metJaar: false })}</td>
                <td>{[0, 6].includes(weekdag(f.datum)) && f.vrij === "ja" ? "Valt in het weekend" : VRIJ[f.vrij]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="reken-noot">
        In {j} vallen {opWerkdag} feestdagen die meestal vrij zijn op een werkdag
        {j % 5 === 0 ? ", Bevrijdingsdag meegerekend (lustrumjaar)" : ""}.
      </p>
    </section>
  );
}

export default function FeestdagenPagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  return (
    <RekenPagina id="feestdagen" h1={`Feestdagen ${nu.j} en ${nu.j + 1}`}>
      <Jaar j={nu.j} nu={nu} />
      <Jaar j={nu.j + 1} nu={nu} />
    </RekenPagina>
  );
}
