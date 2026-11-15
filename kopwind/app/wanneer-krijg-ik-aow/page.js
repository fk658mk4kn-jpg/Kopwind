import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import AowRekenaar from "@/components/reken/AowRekenaar";
import { IS_EN } from "@/lib/i18n/locale";
import { AOW_LEEFTIJD, AOW_LAATST_VASTGESTELD } from "@/lib/geld";

export const metadata = IS_EN
  ? {}
  : {
      title: `Wanneer krijg ik AOW? AOW-leeftijd berekenen tot en met ${AOW_LAATST_VASTGESTELD}`,
      description: `Bereken je AOW-datum met je geboortedatum. De AOW-leeftijd per jaar tot en met ${AOW_LAATST_VASTGESTELD}, hoe die wordt vastgesteld en hoe het zit met je pensioen.`,
      alternates: { canonical: "/wanneer-krijg-ik-aow" },
    };

const leeftijd = (m) => `${Math.floor(m / 12)} jaar${m % 12 ? ` en ${m % 12} maanden` : ""}`;

export default function AowPagina() {
  if (IS_EN) notFound();
  return (
    <RekenPagina id="aow">
      <AowRekenaar />
      <section className="paneel reken-blok">
        <h2>AOW-leeftijd per jaar</h2>
        <table className="reken-tabel">
          <thead>
            <tr>
              <th>Jaar</th>
              <th>AOW-leeftijd</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(AOW_LEEFTIJD).map(([j, m]) => (
              <tr key={j}>
                <td>{j}</td>
                <td>{leeftijd(m)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="reken-noot">Bron: Rijksoverheid, AOW-leeftijd. Vastgesteld tot en met {AOW_LAATST_VASTGESTELD}; elk najaar komt er een jaar bij.</p>
      </section>
    </RekenPagina>
  );
}
