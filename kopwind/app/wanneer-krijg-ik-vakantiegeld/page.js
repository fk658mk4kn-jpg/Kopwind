import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import VakantiegeldRekenaar from "@/components/reken/VakantiegeldRekenaar";
import { IS_EN } from "@/lib/i18n/locale";
import { vandaag, ymd, dagenTussen, datumTekst, vergelijk } from "@/lib/aftellen/datums";

export const revalidate = 3600;

function doel(nu) {
  const dit = ymd(nu.j, 5, 31);
  return vergelijk(nu, ymd(nu.j, 6, 30)) > 0 ? ymd(nu.j + 1, 5, 31) : dit;
}

export function generateMetadata() {
  if (IS_EN) return {};
  const d = doel(vandaag());
  return {
    title: `Wanneer krijg ik vakantiegeld in ${d.j}? Datum en bedrag berekenen`,
    description: `Vakantiegeld ${d.j}: wanneer het meestal wordt uitbetaald, hoeveel het is (minimaal 8 procent) en waarom er netto minder overblijft. Met rekenhulp.`,
    alternates: { canonical: "/wanneer-krijg-ik-vakantiegeld" },
  };
}

export default function VakantiegeldPagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  const d = doel(nu);
  const dagen = dagenTussen(nu, d);
  const inJuni = nu.m === 6;
  return (
    <RekenPagina id="vakantiegeld">
      <section className="paneel aftel-hoofd">
        {inJuni ? (
          <>
            <p className="aftel-groot klein">Deze maand</p>
            <p className="aftel-sub">Is je vakantiegeld er nog niet, dan komt het bij de meeste werkgevers met het salaris van juni.</p>
          </>
        ) : dagen === 0 ? (
          <p className="aftel-groot klein">Vandaag</p>
        ) : (
          <>
            <p className="aftel-groot">{dagen}</p>
            <p className="aftel-sub">dagen tot eind mei, wanneer veel werkgevers het vakantiegeld uitbetalen</p>
          </>
        )}
        <ul className="aftel-feiten">
          <li>Bij veel werkgevers: met het salaris van mei, rond {datumTekst(d, { metJaar: true })}</li>
          <li>Anders meestal in juni; je cao of contract noemt de maand</li>
          <li>Minimaal 8 procent van je brutoloon</li>
        </ul>
      </section>
      <VakantiegeldRekenaar />
    </RekenPagina>
  );
}
