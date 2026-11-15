import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import { IS_EN } from "@/lib/i18n/locale";
import { vandaag, ymd, dagenTussen, datumTekst } from "@/lib/aftellen/datums";

export const revalidate = 3600;

export function generateMetadata() {
  if (IS_EN) return {};
  const j = vandaag().j;
  return {
    title: `Mag je vuurwerk afsteken met oud en nieuw ${j}? Nee, behalve sterretjes`,
    description: "Sinds de jaarwisseling 2026 op 2027 geldt een landelijk vuurwerkverbod voor consumenten. Wat nog wel mag, hoe het zit met shows en buitenlands vuurwerk, en hoe lang het nog duurt tot oud en nieuw.",
    alternates: { canonical: "/vuurwerk-afsteken" },
  };
}

const MAG = [
  ["Sterretjes, trektouwtjes, knalerwten (F1)", "Mag"],
  ["Knalvuurwerk en vuurpijlen (F2, F3)", "Mag niet"],
  ["Siervuurwerk zoals cakes en fonteinen (F2, F3)", "Mag niet"],
  ["Professionele vuurwerkshow", "Mag, onder voorwaarden"],
  ["Show van een vereniging", "Alleen met ontheffing"],
  ["Illegaal vuurwerk, zoals cobra's", "Verboden"],
];

export default function VuurwerkPagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  const oud = nu.m === 1 && nu.d === 1 ? nu : ymd(nu.j, 12, 31);
  const n = dagenTussen(nu, oud);
  return (
    <RekenPagina id="vuurwerk">
      <section className="paneel aftel-hoofd">
        <p className="aftel-groot">{n === 0 ? "Vandaag" : n}</p>
        {n > 0 && <p className="aftel-sub">{n === 1 ? "dag" : "dagen"} tot oudejaarsavond</p>}
        <p className="aftel-datum">{datumTekst(oud, { metDag: true })}</p>
        <p className="aftel-voetnoot">Het landelijke vuurwerkverbod geldt sinds de jaarwisseling van 2026 op 2027.</p>
      </section>
      <section className="paneel reken-blok">
        <h2>Wat mag wel en niet</h2>
        <table className="reken-tabel">
          <tbody>
            {MAG.map(([wat, mag]) => (
              <tr key={wat}>
                <td>{wat}</td>
                <td className="rechts">{mag}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="reken-noot">Bron: Ondernemersplein (KVK), verkoop consumentenvuurwerk stopt door vuurwerkverbod. Lokale regels staan op de site van je gemeente.</p>
      </section>
    </RekenPagina>
  );
}
