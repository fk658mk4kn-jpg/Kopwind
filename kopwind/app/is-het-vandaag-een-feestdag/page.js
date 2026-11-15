import Link from "next/link";
import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import { IS_EN } from "@/lib/i18n/locale";
import { vandaag, feestdagenLijst, vergelijk, dagenTussen, datumTekst, dagNaam, sleutel } from "@/lib/aftellen/datums";

export const revalidate = 3600;

function stand(nu) {
  const lijst = [...feestdagenLijst(nu.j), ...feestdagenLijst(nu.j + 1)].filter((f) => f.vrij !== "nee");
  const vandaagF = lijst.find((f) => vergelijk(f.datum, nu) === 0) ?? null;
  const volgende = lijst.find((f) => vergelijk(f.datum, nu) > 0);
  return { vandaagF, volgende };
}

export function generateMetadata() {
  if (IS_EN) return {};
  const nu = vandaag();
  const { vandaagF, volgende } = stand(nu);
  return {
    title: vandaagF
      ? `Is het vandaag een feestdag? Ja: ${vandaagF.naam}`
      : `Is het vandaag een feestdag? Nee, de volgende is ${volgende.naam}`,
    description: "Of vandaag een feestdag of vrije dag is in Nederland, welke feestdag als volgende komt en wat er dicht is op een feestdag.",
    alternates: { canonical: "/is-het-vandaag-een-feestdag" },
  };
}

export default function VrijeDagPagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  const { vandaagF, volgende } = stand(nu);
  const weekend = ["zaterdag", "zondag"].includes(dagNaam(nu));
  let groot = "Nee";
  let zin = weekend ? `Het is ${dagNaam(nu)}, geen feestdag.` : `Het is een gewone ${dagNaam(nu)}.`;
  if (vandaagF) {
    groot = "Ja";
    zin =
      vandaagF.vrij === "lustrum"
        ? `Het is ${vandaagF.naam}. Vrij voor wie dat in de cao heeft; veel cao's geven alleen in lustrumjaren vrij.`
        : `Het is ${vandaagF.naam}.`;
  }
  return (
    <RekenPagina id="vrije-dag">
      <section className="paneel aftel-hoofd">
        <p className="aftel-label">{datumTekst(nu, { metDag: true })}</p>
        <p className="aftel-groot klein">{groot}</p>
        <p className="aftel-sub">{zin}</p>
        <ul className="aftel-feiten">
          <li>
            Volgende feestdag: {volgende.naam}, {datumTekst(volgende.datum, { metDag: true })}, over {dagenTussen(nu, volgende.datum)} dagen
          </li>
          <li>
            <Link href="/feestdagen">Alle feestdagen van dit en volgend jaar</Link>
          </li>
        </ul>
      </section>
    </RekenPagina>
  );
}
