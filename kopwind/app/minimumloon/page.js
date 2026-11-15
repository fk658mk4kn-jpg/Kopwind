import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import MinimumloonRekenaar from "@/components/reken/MinimumloonRekenaar";
import { IS_EN } from "@/lib/i18n/locale";
import { MINIMUMLOON, maandloon } from "@/lib/geld";
import { uitSleutel, datumTekst } from "@/lib/aftellen/datums";

const fmt = (n) => n.toLocaleString("nl-NL", { style: "currency", currency: "EUR" });
const vanaf = uitSleutel(MINIMUMLOON.geldigVanaf);

export const metadata = IS_EN
  ? {}
  : {
      title: `Minimumloon ${vanaf.j}: ${fmt(MINIMUMLOON.perUur[0].bedrag)} per uur, met jeugdlonen`,
      description: `Het minimumloon per ${datumTekst(vanaf)}: ${fmt(MINIMUMLOON.perUur[0].bedrag)} bruto per uur vanaf 21 jaar, de jeugdlonen per leeftijd en een rekenhulp voor het bedrag per maand.`,
      alternates: { canonical: "/minimumloon" },
    };

export default function MinimumloonPagina() {
  if (IS_EN) notFound();
  return (
    <RekenPagina id="minimumloon" h1={`Minimumloon ${vanaf.j}`}>
      <section className="paneel aftel-hoofd">
        <p className="aftel-label">Vanaf {datumTekst(vanaf)}, 21 jaar en ouder</p>
        <p className="aftel-groot klein">{fmt(MINIMUMLOON.perUur[0].bedrag)}</p>
        <p className="aftel-sub">bruto per uur</p>
      </section>
      <MinimumloonRekenaar />
      <section className="paneel reken-blok">
        <h2>Minimumloon per leeftijd</h2>
        <table className="reken-tabel">
          <thead>
            <tr>
              <th>Leeftijd</th>
              <th className="rechts">Per uur</th>
              <th className="rechts">Per maand bij 36 uur</th>
              <th className="rechts">Bij 40 uur</th>
            </tr>
          </thead>
          <tbody>
            {MINIMUMLOON.perUur.map((r) => (
              <tr key={r.leeftijd}>
                <td>{r.leeftijd}</td>
                <td className="rechts">{fmt(r.bedrag)}</td>
                <td className="rechts">{fmt(maandloon(r.bedrag, 36))}</td>
                <td className="rechts">{fmt(maandloon(r.bedrag, 40))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="reken-noot">Bruto, zonder vakantiegeld. Uurbedragen: Rijksoverheid, bedragen minimumloon {vanaf.j}. Maandbedragen berekend met 52 weken per jaar.</p>
      </section>
    </RekenPagina>
  );
}
