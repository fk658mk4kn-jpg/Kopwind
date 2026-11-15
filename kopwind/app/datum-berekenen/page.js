import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import DatumRekenaar from "@/components/reken/DatumRekenaar";
import { IS_EN } from "@/lib/i18n/locale";
import { vandaag, plusDagen, datumTekst, sleutel } from "@/lib/aftellen/datums";

export const revalidate = 3600;

const STAPPEN = [7, 14, 30, 60, 90, 100, 180, 365];

export function generateMetadata() {
  if (IS_EN) return {};
  const d = plusDagen(vandaag(), 100);
  return {
    title: `Datum berekenen: over 100 dagen is het ${datumTekst(d, { metDag: true })}`,
    description: "Tel dagen, weken, maanden of werkdagen bij een datum op of trek ze eraf. Met de weekdag, het weeknummer en een tabel voor de meest gebruikte termijnen.",
    alternates: { canonical: "/datum-berekenen" },
  };
}

export default function DatumPagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  return (
    <RekenPagina id="datum-berekenen">
      <DatumRekenaar startDatum={sleutel(nu)} />
      <section className="paneel reken-blok">
        <h2>Vanaf vandaag</h2>
        <table className="reken-tabel">
          <tbody>
            {STAPPEN.map((n) => (
              <tr key={n}>
                <td>Over {n} dagen</td>
                <td className="rechts">{datumTekst(plusDagen(nu, n), { metDag: true })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </RekenPagina>
  );
}
