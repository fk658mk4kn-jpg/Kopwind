import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import { IS_EN } from "@/lib/i18n/locale";
import { komendeEclipsen } from "@/lib/eclipsen";
import { vandaag, sleutel, uitSleutel, dagenTussen, datumTekst } from "@/lib/aftellen/datums";

export const revalidate = 86400;

export function generateMetadata() {
  if (IS_EN) return {};
  const e = komendeEclipsen(sleutel(vandaag()))[0];
  return {
    title: e
      ? `Volgende verduistering in Nederland: ${e.titel.toLowerCase()} op ${datumTekst(uitSleutel(e.datum))}`
      : "Wanneer is de volgende zons- of maansverduistering in Nederland?",
    description: "De komende zons- en maansverduisteringen die vanuit Nederland te zien zijn, hoeveel er bij ons zichtbaar is, en hoe je veilig kijkt.",
    alternates: { canonical: "/volgende-zonsverduistering" },
  };
}

export default function VerduisteringPagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  const lijst = komendeEclipsen(sleutel(nu));
  const eerste = lijst[0];
  return (
    <RekenPagina id="verduistering">
      {eerste && (
        <section className="paneel aftel-hoofd">
          <p className="aftel-label">Eerstvolgende in Nederland</p>
          <p className="aftel-groot">{dagenTussen(nu, uitSleutel(eerste.datum))}</p>
          <p className="aftel-sub">dagen tot de {eerste.titel.toLowerCase()}</p>
          <p className="aftel-datum">{datumTekst(uitSleutel(eerste.datum), { metDag: true })}</p>
          <p className="aftel-sub">{eerste.detail}</p>
        </section>
      )}
      <section className="paneel reken-blok">
        <h2>Verduisteringen zichtbaar vanuit Nederland</h2>
        <table className="reken-tabel">
          <thead>
            <tr>
              <th>Datum</th>
              <th>Soort</th>
              <th>Wat je ziet</th>
            </tr>
          </thead>
          <tbody>
            {lijst.map((e) => (
              <tr key={e.datum}>
                <td>{datumTekst(uitSleutel(e.datum), { metDag: true })}</td>
                <td>{e.titel}</td>
                <td>{e.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="reken-noot">Bronnen: zonsverduistering.nl (zon) en hemel.waarnemen.com (maan, tijden voor Utrecht).</p>
      </section>
    </RekenPagina>
  );
}
