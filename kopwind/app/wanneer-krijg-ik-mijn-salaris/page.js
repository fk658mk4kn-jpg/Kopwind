import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import SalarisRekenaar from "@/components/reken/SalarisRekenaar";
import { IS_EN } from "@/lib/i18n/locale";
import { salarisDatum } from "@/lib/geld";
import { vandaag, dagenTussen, datumTekst, vergelijk } from "@/lib/aftellen/datums";

export const revalidate = 3600;

function volgende(nu) {
  let d = salarisDatum(nu.j, nu.m);
  if (vergelijk(d, nu) < 0) d = nu.m === 12 ? salarisDatum(nu.j + 1, 1) : salarisDatum(nu.j, nu.m + 1);
  return d;
}

export function generateMetadata() {
  if (IS_EN) return {};
  const d = volgende(vandaag());
  return {
    title: `Wanneer krijg ik mijn salaris? Bij de 25e: ${datumTekst(d, { metDag: true, metJaar: false })}`,
    description:
      "Op welke dag komt je salaris als de salarisdag in het weekend of op een feestdag valt? Per maand de betaaldag voor dit jaar, met je eigen salarisdag.",
    alternates: { canonical: "/wanneer-krijg-ik-mijn-salaris" },
  };
}

export default function SalarisPagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  const d = volgende(nu);
  const n = dagenTussen(nu, d);
  return (
    <RekenPagina id="salaris">
      <section className="paneel aftel-hoofd">
        <p className="aftel-label">Bij salaris op de 25e</p>
        <p className="aftel-groot">{n === 0 ? "Vandaag" : n}</p>
        {n > 0 && <p className="aftel-sub">{n === 1 ? "dag" : "dagen"} tot de volgende salarisdag</p>}
        <p className="aftel-datum">{datumTekst(d, { metDag: true })}</p>
      </section>
      <SalarisRekenaar jaar={nu.m === 12 ? nu.j + 1 : nu.j} />
    </RekenPagina>
  );
}
