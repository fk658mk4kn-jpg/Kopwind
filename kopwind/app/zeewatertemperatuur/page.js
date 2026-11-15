import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import { IS_EN } from "@/lib/i18n/locale";
import { vandaag, MAAND_NAMEN } from "@/lib/aftellen/datums";

export const revalidate = 86400;

/**
 * Orientatie per maand langs de Nederlandse kust, afgerond en als
 * bandbreedte. Geen meetreeks: jaren en plekken verschillen.
 */
const MAANDEN = [
  [6, 8, "Koud: alleen een korte duik, liefst met begeleiding."],
  [4, 7, "Het koudste deel van het jaar."],
  [5, 7, "Nog winters koud."],
  [7, 10, "Begint langzaam op te warmen."],
  [10, 13, "Fris; wetsuit voor langer zwemmen."],
  [13, 17, "Een frisse duik op een warme dag."],
  [16, 19, "Prima voor een duik, langer zwemmen voor wie kou kan hebben."],
  [17, 20, "Het warmste deel van het jaar."],
  [16, 19, "Vaak nog net zo warm als in augustus."],
  [13, 16, "Koelt af, maar warmer dan de lucht op koude dagen."],
  [10, 13, "Fris."],
  [7, 10, "Koud."],
];

export function generateMetadata() {
  if (IS_EN) return {};
  const m = vandaag().m;
  const [lo, hi] = MAANDEN[m - 1];
  return {
    title: `Hoe warm is het zeewater in ${MAAND_NAMEN[m - 1]}? Ongeveer ${lo} tot ${hi} graden`,
    description:
      "De temperatuur van de Noordzee langs de Nederlandse kust per maand, wanneer het water het warmst is, en wat dat betekent voor zwemmen en een wetsuit.",
    alternates: { canonical: "/zeewatertemperatuur" },
  };
}

export default function ZeewaterPagina() {
  if (IS_EN) notFound();
  const m = vandaag().m;
  const [lo, hi, zin] = MAANDEN[m - 1];
  return (
    <RekenPagina id="zeewater">
      <section className="paneel aftel-hoofd">
        <p className="aftel-label">Zeewater in {MAAND_NAMEN[m - 1]}, langs de kust</p>
        <p className="aftel-groot klein">
          {lo} tot {hi} °C
        </p>
        <p className="aftel-sub">{zin}</p>
        <p className="aftel-voetnoot">Een richtwaarde per maand; de actuele meting per strand voegen we toe zodra die koppeling klaar is.</p>
      </section>
      <section className="paneel reken-blok">
        <h2>Zeewatertemperatuur per maand</h2>
        <table className="reken-tabel">
          <thead>
            <tr>
              <th>Maand</th>
              <th className="rechts">Ongeveer</th>
              <th>Wat het betekent</th>
            </tr>
          </thead>
          <tbody>
            {MAANDEN.map(([a, b, z], i) => (
              <tr key={i} className={i === m - 1 ? "nu" : undefined}>
                <td>{MAAND_NAMEN[i]}</td>
                <td className="rechts">
                  {a} tot {b} °C
                </td>
                <td>{z}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="reken-noot">Afgeronde richtwaarden voor de Noordzee langs de Nederlandse kust. In warme zomers en bij het strand kan het hoger zijn, in koude winters lager.</p>
      </section>
    </RekenPagina>
  );
}
