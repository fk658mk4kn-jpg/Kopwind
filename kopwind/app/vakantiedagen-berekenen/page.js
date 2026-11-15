import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import VakantiedagenRekenaar from "@/components/reken/VakantiedagenRekenaar";
import { IS_EN } from "@/lib/i18n/locale";
import { wettelijkeVakantie } from "@/lib/rekenen";

export const metadata = IS_EN
  ? {}
  : {
      title: "Vakantiedagen berekenen: wettelijk minimum bij fulltime en parttime",
      description: "Op hoeveel vakantiedagen heb je recht? Reken het wettelijke minimum uit bij jouw uren, ook in deeltijd of als je in de loop van het jaar begon. Plus wanneer dagen vervallen.",
      alternates: { canonical: "/vakantiedagen-berekenen" },
    };

const ROOSTERS = [
  [40, 5], [36, 5], [36, 4], [32, 4], [24, 3], [20, 5], [16, 2],
];

export default function VakantiePagina() {
  if (IS_EN) notFound();
  return (
    <RekenPagina id="vakantiedagen">
      <VakantiedagenRekenaar />
      <section className="paneel reken-blok">
        <h2>Wettelijk minimum per rooster</h2>
        <table className="reken-tabel">
          <thead>
            <tr>
              <th>Rooster</th>
              <th className="rechts">Uren per jaar</th>
              <th className="rechts">Dagen</th>
            </tr>
          </thead>
          <tbody>
            {ROOSTERS.map(([u, d]) => {
              const r = wettelijkeVakantie(u, d);
              return (
                <tr key={`${u}-${d}`}>
                  <td>{u} uur in {d} dagen</td>
                  <td className="rechts">{r.uren}</td>
                  <td className="rechts">{String(r.dagen).replace(".", ",")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p className="reken-noot">Vier keer de wekelijkse arbeidsduur, per heel jaar in dienst. Cao of contract kan meer geven.</p>
      </section>
    </RekenPagina>
  );
}
