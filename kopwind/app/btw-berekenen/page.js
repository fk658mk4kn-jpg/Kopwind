import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import BtwRekenaar from "@/components/reken/BtwRekenaar";
import { IS_EN } from "@/lib/i18n/locale";
import { BTW_TARIEVEN } from "@/lib/rekenen";

export const metadata = IS_EN
  ? {}
  : {
      title: "Btw berekenen: inclusief en exclusief, 21 en 9 procent",
      description: "Reken een bedrag om van exclusief naar inclusief btw of andersom. Met de btw-tarieven van 21, 9 en 0 procent en wanneer welk tarief geldt.",
      alternates: { canonical: "/btw-berekenen" },
    };

export default function BtwPagina() {
  if (IS_EN) notFound();
  return (
    <RekenPagina id="btw">
      <BtwRekenaar />
      <section className="paneel reken-blok">
        <h2>Btw-tarieven in Nederland</h2>
        <table className="reken-tabel smal-eerste">
          <thead>
            <tr>
              <th>Tarief</th>
              <th>Geldt onder meer voor</th>
            </tr>
          </thead>
          <tbody>
            {BTW_TARIEVEN.map((t) => (
              <tr key={t.pct}>
                <td>{t.pct}%</td>
                <td>{t.voorbeelden}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="reken-noot">Erbij: vermenigvuldig met 1,21 of 1,09. Eraf: deel door 1,21 of 1,09.</p>
      </section>
    </RekenPagina>
  );
}
