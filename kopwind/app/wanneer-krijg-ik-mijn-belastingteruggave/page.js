import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import { IS_EN } from "@/lib/i18n/locale";
import { teruggaveFase } from "@/lib/belasting";
import { vandaag, dagenTussen, datumTekst } from "@/lib/aftellen/datums";

export const revalidate = 3600;

export function generateMetadata() {
  if (IS_EN) return {};
  const f = teruggaveFase(vandaag());
  return {
    title: `Wanneer krijg ik mijn belastingteruggave over ${f.belastingjaar}? Aangifte voor 1 april, bericht voor 1 juli`,
    description: "Wanneer je de uitslag van je aangifte inkomstenbelasting krijgt en je teruggave op je rekening staat, met een teller naar de belangrijkste datums.",
    alternates: { canonical: "/wanneer-krijg-ik-mijn-belastingteruggave" },
  };
}

export default function TeruggavePagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  const f = teruggaveFase(nu);
  const teller = (doel, tekst) => {
    const n = dagenTussen(nu, doel);
    return (
      <>
        <p className="aftel-groot">{n}</p>
        <p className="aftel-sub">{n === 1 ? "dag" : "dagen"} {tekst}</p>
        <p className="aftel-datum">{datumTekst(doel, { metDag: true })}</p>
      </>
    );
  };
  return (
    <RekenPagina id="belastingteruggave">
      <section className="paneel aftel-hoofd">
        <p className="aftel-label">Aangifte over {f.belastingjaar}</p>
        {f.soort === "voor-seizoen" || f.soort === "na-juli"
          ? teller(f.start, "tot je aangifte kunt doen")
          : f.soort === "voor-april"
            ? teller(f.april, "om aangifte te doen en voor 1 juli bericht te krijgen")
            : teller(f.juli, "tot 1 juli, voor wie voor 1 april aangifte deed")}
      </section>
      <section className="paneel reken-blok">
        <h2>De data voor aangifte over {f.belastingjaar}</h2>
        <table className="reken-tabel">
          <tbody>
            <tr><td>Aangifte doen kan vanaf</td><td className="rechts">{datumTekst(f.start)}</td></tr>
            <tr><td>Aangifte voor</td><td className="rechts">{datumTekst(f.april)}</td></tr>
            <tr><td>Dan bericht voor</td><td className="rechts">{datumTekst(f.juli)}</td></tr>
            <tr><td>Later aangifte</td><td className="rechts">bericht binnen ongeveer drie maanden</td></tr>
          </tbody>
        </table>
        <p className="reken-noot">Bron: Belastingdienst, Ik heb aangifte gedaan: wanneer hoor ik iets?</p>
      </section>
    </RekenPagina>
  );
}
