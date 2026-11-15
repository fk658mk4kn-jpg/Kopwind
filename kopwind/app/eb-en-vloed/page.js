import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import { IS_EN } from "@/lib/i18n/locale";
import { getijPerioden } from "@/lib/getij";
import { vandaag, datumTekst } from "@/lib/aftellen/datums";

export const revalidate = 3600;

export function generateMetadata() {
  if (IS_EN) return {};
  const s = getijPerioden().find((p) => p.soort === "springtij");
  const d = s ? vandaag(s.tijdstip) : null;
  return {
    title: d ? `Eb en vloed: volgend springtij rond ${datumTekst(d, { metJaar: false })}` : "Eb en vloed: hoogwater, springtij en doodtij",
    description:
      "Hoe eb en vloed werken langs de Nederlandse kust, wanneer het springtij en doodtij is (berekend uit de maan) en waar je de exacte hoogwatertijden per strand vindt.",
    alternates: { canonical: "/eb-en-vloed" },
  };
}

export default function GetijPagina() {
  if (IS_EN) notFound();
  const perioden = getijPerioden(Date.now(), 8);
  const eerst = perioden[0];
  return (
    <RekenPagina id="getij">
      <section className="paneel aftel-hoofd">
        <p className="aftel-label">Eerstvolgend</p>
        <p className="aftel-groot klein">{eerst.soort === "springtij" ? "Springtij" : "Doodtij"}</p>
        <p className="aftel-datum">rond {datumTekst(vandaag(eerst.tijdstip), { metDag: true })}</p>
        <p className="aftel-sub">
          {eerst.soort === "springtij"
            ? "Het verschil tussen hoog- en laagwater is dan het grootst: hoger water en verder teruggetrokken eb."
            : "Het verschil tussen hoog- en laagwater is dan het kleinst."}
        </p>
      </section>
      <section className="paneel reken-blok">
        <h2>Springtij en doodtij de komende weken</h2>
        <table className="reken-tabel">
          <thead>
            <tr>
              <th>Rond</th>
              <th>Getij</th>
              <th>Door</th>
            </tr>
          </thead>
          <tbody>
            {perioden.map((p) => (
              <tr key={p.tijdstip}>
                <td>{datumTekst(vandaag(p.tijdstip), { metDag: true, metJaar: false })}</td>
                <td>{p.soort === "springtij" ? "Springtij" : "Doodtij"}</td>
                <td>{p.maan}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="reken-noot">
          Afgeleid uit de maanfasen, met de gebruikelijke vertraging van ongeveer twee dagen langs onze kust. Exacte hoog- en laagwatertijden per meetpunt publiceert Rijkswaterstaat.
        </p>
      </section>
    </RekenPagina>
  );
}
