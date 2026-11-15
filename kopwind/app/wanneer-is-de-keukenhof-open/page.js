import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import { IS_EN } from "@/lib/i18n/locale";
import { huidigeKeukenhof } from "@/lib/evenementen";
import { vandaag, sleutel, uitSleutel, dagenTussen, datumTekst } from "@/lib/aftellen/datums";

export const revalidate = 3600;

export function generateMetadata() {
  if (IS_EN) return {};
  const k = huidigeKeukenhof(sleutel(vandaag()));
  return {
    title: k
      ? `Wanneer is de Keukenhof open? ${datumTekst(uitSleutel(k.van), { metJaar: false })} tot ${datumTekst(uitSleutel(k.tot))}`
      : "Wanneer is de Keukenhof open?",
    description: "De openingsdata van de Keukenhof met een teller, wat er wanneer bloeit, de bollenvelden rond Lisse en hoe je de drukte vermijdt.",
    alternates: { canonical: "/wanneer-is-de-keukenhof-open" },
  };
}

export default function KeukenhofPagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  const k = huidigeKeukenhof(sleutel(nu));
  if (!k) {
    return (
      <RekenPagina id="keukenhof">
        <section className="paneel aftel-hoofd">
          <p className="aftel-sub">De data van het volgende seizoen zijn nog niet bekend. Zodra de Keukenhof ze publiceert, staan ze hier.</p>
        </section>
      </RekenPagina>
    );
  }
  const van = uitSleutel(k.van);
  const tot = uitSleutel(k.tot);
  const tot_open = dagenTussen(nu, van);
  const open = tot_open <= 0;
  return (
    <RekenPagina id="keukenhof">
      <section className="paneel aftel-hoofd">
        {open ? (
          <>
            <p className="aftel-groot klein">Nu open</p>
            <p className="aftel-sub">Nog {dagenTussen(nu, tot)} dagen, tot en met {datumTekst(tot, { metDag: true })}.</p>
          </>
        ) : (
          <>
            <p className="aftel-groot">{tot_open}</p>
            <p className="aftel-sub">dagen tot de Keukenhof opengaat</p>
          </>
        )}
        <p className="aftel-datum">
          {datumTekst(van, { metDag: true })} tot en met {datumTekst(tot, { metDag: true })}
        </p>
        <p className="aftel-voetnoot">Bron: {k.bron}. Openingstijden en tickets per dag op de site van het park.</p>
      </section>
    </RekenPagina>
  );
}
