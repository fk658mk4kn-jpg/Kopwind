import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import { IS_EN } from "@/lib/i18n/locale";
import { zorgOverstap, EIGEN_RISICO } from "@/lib/geld";
import { vandaag, dagenTussen, datumTekst } from "@/lib/aftellen/datums";

export const revalidate = 3600;

export function generateMetadata() {
  if (IS_EN) return {};
  const z = zorgOverstap(vandaag());
  return {
    title: `Zorgverzekering overstappen voor ${z.polisJaar}: opzeggen tot en met 31 december`,
    description: `Tot wanneer je je zorgverzekering kunt opzeggen en een nieuwe kunt afsluiten voor ${z.polisJaar}, met een teller, wat er verandert en waar je op let bij vergelijken.`,
    alternates: { canonical: "/zorgverzekering-overstappen" },
  };
}

export default function ZorgOverstapPagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  const z = zorgOverstap(nu);
  const nOpzeg = dagenTussen(nu, z.opzeggen);
  const nPolis = dagenTussen(nu, z.nieuwePolis);
  return (
    <RekenPagina id="zorg-overstappen">
      <section className="paneel aftel-hoofd">
        {z.fase === "januari" ? (
          <>
            <p className="aftel-label">Al opgezegd?</p>
            <p className="aftel-groot">{nPolis}</p>
            <p className="aftel-sub">{nPolis === 1 ? "dag" : "dagen"} om een nieuwe polis af te sluiten, met terugwerkende kracht tot 1 januari</p>
            <p className="aftel-datum">uiterlijk {datumTekst(z.nieuwePolis, { metDag: true })}</p>
          </>
        ) : (
          <>
            <p className="aftel-label">Opzeggen kan nog</p>
            <p className="aftel-groot">{nOpzeg}</p>
            <p className="aftel-sub">{nOpzeg === 1 ? "dag" : "dagen"}, tot en met {datumTekst(z.opzeggen, { metDag: true })}</p>
            <p className="aftel-datum">Nieuwe polis afsluiten: tot en met {datumTekst(z.nieuwePolis)}</p>
          </>
        )}
      </section>
      <section className="paneel reken-blok">
        <h2>Overstappen in het kort</h2>
        <table className="reken-tabel">
          <tbody>
            <tr><td>Opzeggen oude verzekering</td><td className="rechts">tot en met {datumTekst(z.opzeggen)}</td></tr>
            <tr><td>Nieuwe verzekering afsluiten</td><td className="rechts">tot en met {datumTekst(z.nieuwePolis)}</td></tr>
            <tr><td>Nieuwe verzekering gaat in</td><td className="rechts">1 januari {z.polisJaar}</td></tr>
            {EIGEN_RISICO[z.polisJaar] && (
              <tr><td>Verplicht eigen risico {z.polisJaar}</td><td className="rechts">{EIGEN_RISICO[z.polisJaar]} euro</td></tr>
            )}
          </tbody>
        </table>
        <p className="reken-noot">Bron: Rijksoverheid, overstappen zorgverzekeraar.</p>
      </section>
    </RekenPagina>
  );
}
