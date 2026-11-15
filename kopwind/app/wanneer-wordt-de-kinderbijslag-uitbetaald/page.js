import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import { IS_EN } from "@/lib/i18n/locale";
import { volgendeKinderbijslag } from "@/lib/geld";
import { vandaag, MAAND_NAMEN } from "@/lib/aftellen/datums";

export const revalidate = 3600;

export function generateMetadata() {
  if (IS_EN) return {};
  const v = volgendeKinderbijslag(vandaag());
  return {
    title: `Wanneer wordt de kinderbijslag uitbetaald? Volgende: ${MAAND_NAMEN[v.maand.m - 1]} ${v.maand.j}`,
    description:
      "De kinderbijslag komt per kwartaal achteraf, in januari, april, juli en oktober. Wanneer de volgende betaling is, over welk kwartaal, en hoe het zit met het kindgebonden budget.",
    alternates: { canonical: "/wanneer-wordt-de-kinderbijslag-uitbetaald" },
  };
}

export default function KinderbijslagPagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  const v = volgendeKinderbijslag(nu);
  const ditJaar = [1, 4, 7, 10].map((m) => ({ m, over: m === 1 ? `oktober tot en met december ${nu.j - 1}` : `${MAAND_NAMEN[m - 4]} tot en met ${MAAND_NAMEN[m - 2]}` }));
  return (
    <RekenPagina id="kinderbijslag">
      <section className="paneel aftel-hoofd">
        <p className="aftel-label">Volgende betaling</p>
        <p className="aftel-groot klein">
          {v.maand.m === nu.m && v.maand.j === nu.j ? "Deze maand" : `${MAAND_NAMEN[v.maand.m - 1]} ${v.maand.j}`}
        </p>
        <p className="aftel-sub">over {v.over}. De exacte dag staat in Mijn SVB.</p>
      </section>
      <section className="paneel reken-blok">
        <h2>De vier betaalmaanden</h2>
        <table className="reken-tabel">
          <thead>
            <tr>
              <th>Betaalmaand</th>
              <th>Over de maanden</th>
            </tr>
          </thead>
          <tbody>
            {ditJaar.map((r) => (
              <tr key={r.m} className={r.m === v.maand.m ? "nu" : undefined}>
                <td>{MAAND_NAMEN[r.m - 1]}</td>
                <td>{r.over}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="reken-noot">Bron: SVB, via Nederland Wereldwijd: kinderbijslag wordt na afloop van elk kwartaal betaald.</p>
      </section>
    </RekenPagina>
  );
}
