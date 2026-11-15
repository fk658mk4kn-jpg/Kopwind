import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import AftelTeller from "@/components/aftellen/AftelTeller";
import { IS_EN } from "@/lib/i18n/locale";
import { vandaag, ymd, dagenTussen, datumTekst, amsterdamTijdstip } from "@/lib/aftellen/datums";
import { aangifteFase } from "@/lib/belasting";

export const revalidate = 3600;

export function generateMetadata() {
  if (IS_EN) return {};
  const f = aangifteFase(vandaag());
  return {
    title: `Uiterste datum belastingaangifte ${f.belastingjaar}: voor 1 mei ${f.doel.j}`,
    description: `Tot wanneer kun je aangifte inkomstenbelasting over ${f.belastingjaar} doen? De deadline, uitstel tot 1 september, wanneer je geld terugkrijgt en wat er gebeurt als je te laat bent.`,
    alternates: { canonical: "/uiterste-datum-belastingaangifte" },
  };
}

export default function BelastingPagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  const f = aangifteFase(nu);
  const dagen = dagenTussen(nu, f.doel);
  const label =
    f.soort === "aangifte"
      ? `dagen om aangifte over ${f.belastingjaar} te doen`
      : f.soort === "uitstel"
        ? `dagen tot het einde van het uitstel (aangifte over ${f.belastingjaar})`
        : `dagen tot de deadline voor de aangifte over ${f.belastingjaar}`;
  const opent = ymd(f.doel.j, 3, 1);
  return (
    <RekenPagina id="belasting">
      <section className="paneel aftel-hoofd">
        <p className="aftel-groot">{dagen}</p>
        <p className="aftel-sub">{label}</p>
        <p className="aftel-datum">Deadline: aangifte binnen voor {datumTekst(f.doel, { metDag: true })}</p>
        <AftelTeller doel={amsterdamTijdstip(f.doel, 0, 0)} klaarTekst="De termijn is verstreken." />
        <ul className="aftel-feiten">
          <li>Aangifte doen kan vanaf {datumTekst(opent)}</li>
          <li>Aangifte voor 1 april: uitkomst meestal voor 1 juli</li>
          <li>Uitstel aanvragen voor 1 mei geeft je tot 1 september</li>
        </ul>
      </section>
    </RekenPagina>
  );
}
