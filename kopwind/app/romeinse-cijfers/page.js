import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import RomeinsRekenaar from "@/components/reken/RomeinsRekenaar";
import { IS_EN } from "@/lib/i18n/locale";
import { naarRomeins } from "@/lib/rekenen";
import { vandaag } from "@/lib/aftellen/datums";

export const revalidate = 86400;

export function generateMetadata() {
  if (IS_EN) return {};
  const j = vandaag().j;
  return {
    title: `Romeinse cijfers omrekenen: ${j} is ${naarRomeins(j)}`,
    description: "Zet getallen en jaartallen om naar Romeinse cijfers en terug, met de regels en een tabel van 1 tot 100 en veelgebruikte jaartallen.",
    alternates: { canonical: "/romeinse-cijfers" },
  };
}

const TABEL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 19, 20, 40, 49, 50, 90, 99, 100, 400, 500, 900, 1000];

export default function RomeinsPagina() {
  if (IS_EN) notFound();
  const j = vandaag().j;
  const jaren = [1945, 2000, j - 1, j, j + 1, j + 2];
  return (
    <RekenPagina id="romeins">
      <RomeinsRekenaar start={j} />
      <section className="paneel reken-blok">
        <h2>Getallen</h2>
        <table className="reken-tabel">
          <tbody>
            {TABEL.map((n) => (
              <tr key={n}>
                <td>{n}</td>
                <td className="rechts">{naarRomeins(n)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="paneel reken-blok">
        <h2>Jaartallen</h2>
        <table className="reken-tabel">
          <tbody>
            {jaren.map((n) => (
              <tr key={n} className={n === j ? "nu" : undefined}>
                <td>{n}</td>
                <td className="rechts">{naarRomeins(n)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </RekenPagina>
  );
}
