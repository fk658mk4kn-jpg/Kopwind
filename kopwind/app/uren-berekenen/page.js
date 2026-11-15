import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import UrenRekenaar from "@/components/reken/UrenRekenaar";
import { IS_EN } from "@/lib/i18n/locale";

export const metadata = IS_EN
  ? {}
  : {
      title: "Uren berekenen tussen twee tijden, met pauze en in decimalen",
      description:
        "Bereken de gewerkte uren tussen een begin- en eindtijd, met pauze en over middernacht, en zie het resultaat als decimaal getal voor je urenbriefje.",
      alternates: { canonical: "/uren-berekenen" },
    };

const TABEL = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export default function UrenPagina() {
  if (IS_EN) notFound();
  return (
    <RekenPagina id="uren">
      <UrenRekenaar />
      <section className="paneel reken-blok">
        <h2>Minuten naar decimale uren</h2>
        <table className="reken-tabel">
          <thead>
            <tr>
              <th>Minuten</th>
              <th className="rechts">Decimaal</th>
            </tr>
          </thead>
          <tbody>
            {TABEL.map((m) => (
              <tr key={m}>
                <td>{m} minuten</td>
                <td className="rechts">{(m / 60).toFixed(2).replace(".", ",")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </RekenPagina>
  );
}
