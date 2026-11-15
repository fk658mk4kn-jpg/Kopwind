import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import DagZoeker from "@/components/reken/DagZoeker";
import { IS_EN } from "@/lib/i18n/locale";
import { vandaag, dagVanJaar, dagenInJaar, datumTekst, sleutel } from "@/lib/aftellen/datums";

export const revalidate = 3600;

export function generateMetadata() {
  if (IS_EN) return {};
  const d = vandaag();
  return {
    title: `Welke dag van het jaar is het? Vandaag is dag ${dagVanJaar(d)} van ${dagenInJaar(d.j)}`,
    description: "Het dagnummer van vandaag, hoeveel dagen het jaar nog heeft, welk deel van het jaar voorbij is, en het dagnummer van elke andere datum.",
    alternates: { canonical: "/welke-dag-van-het-jaar-is-het" },
  };
}

export default function DagVanJaarPagina() {
  if (IS_EN) notFound();
  const d = vandaag();
  const n = dagVanJaar(d);
  const totaal = dagenInJaar(d.j);
  const pct = Math.round((n / totaal) * 1000) / 10;
  return (
    <RekenPagina id="dag-van-jaar">
      <section className="paneel aftel-hoofd">
        <p className="aftel-label">{datumTekst(d, { metDag: true })} is</p>
        <p className="aftel-groot">dag {n}</p>
        <p className="aftel-sub">van de {totaal} dagen van {d.j}</p>
        <ul className="aftel-feiten">
          <li>Nog {totaal - n} dagen tot het einde van het jaar</li>
          <li>{String(pct).replace(".", ",")} procent van het jaar is voorbij</li>
        </ul>
        <div className="jaar-balk" aria-hidden="true">
          <div style={{ width: `${pct}%` }} />
        </div>
      </section>
      <DagZoeker startDatum={sleutel(d)} />
    </RekenPagina>
  );
}
