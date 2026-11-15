import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import { IS_EN } from "@/lib/i18n/locale";
import { TOESLAG_DATA, volgendeToeslag } from "@/lib/geld";
import { vandaag, uitSleutel, dagenTussen, datumTekst, sleutel } from "@/lib/aftellen/datums";

export const revalidate = 3600;

export function generateMetadata() {
  if (IS_EN) return {};
  const v = volgendeToeslag(vandaag());
  return {
    title: v
      ? `Wanneer wordt de toeslag uitbetaald? Volgende: ${datumTekst(uitSleutel(v.datum), { metJaar: false })}`
      : "Wanneer wordt de toeslag uitbetaald? Betaaldata zorgtoeslag en huurtoeslag",
    description:
      "De eerstvolgende betaaldatum van zorgtoeslag, huurtoeslag, kindgebonden budget en kinderopvangtoeslag, waarom het een voorschot is en wat er verandert.",
    alternates: { canonical: "/wanneer-wordt-de-toeslag-uitbetaald" },
  };
}

export default function ToeslagPagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  const v = volgendeToeslag(nu);
  return (
    <RekenPagina id="toeslagen">
      <section className="paneel aftel-hoofd">
        {v ? (
          <>
            <p className="aftel-label">Volgende betaling</p>
            <p className="aftel-groot klein">{datumTekst(uitSleutel(v.datum), { metDag: true, metJaar: false })}</p>
            <p className="aftel-sub">
              {dagenTussen(nu, uitSleutel(v.datum)) === 0 ? "Vandaag" : `Over ${dagenTussen(nu, uitSleutel(v.datum))} dagen`}, voor de maand {v.voor}
            </p>
          </>
        ) : (
          <p className="aftel-sub">De Belastingdienst heeft de volgende betaaldata nog niet gepubliceerd. De toeslag komt rond de twintigste van de maand, voor de maand erna.</p>
        )}
      </section>
      <section className="paneel reken-blok">
        <h2>Gepubliceerde betaaldata</h2>
        <table className="reken-tabel">
          <thead>
            <tr>
              <th>Betaaldag</th>
              <th>Voor de maand</th>
            </tr>
          </thead>
          <tbody>
            {TOESLAG_DATA.map((t) => (
              <tr key={t.datum} className={t.datum === v?.datum ? "nu" : undefined} style={t.datum < sleutel(nu) ? { opacity: 0.55 } : undefined}>
                <td>{datumTekst(uitSleutel(t.datum), { metDag: true })}</td>
                <td>{t.voor}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="reken-noot">Bron: Belastingdienst, Betaaldatums toeslagen. Nieuwe data nemen we over zodra ze gepubliceerd zijn.</p>
      </section>
    </RekenPagina>
  );
}
