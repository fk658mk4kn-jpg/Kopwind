import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import { IS_EN } from "@/lib/i18n/locale";
import { vandaag, isSchrikkeljaar, volgendSchrikkeljaar, ymd, dagNaam } from "@/lib/aftellen/datums";

export const revalidate = 86400;

export function generateMetadata() {
  if (IS_EN) return {};
  const j = vandaag().j;
  return {
    title: isSchrikkeljaar(j)
      ? `Is ${j} een schrikkeljaar? Ja, met 29 februari`
      : `Is ${j} een schrikkeljaar? Nee, het volgende is ${volgendSchrikkeljaar(j)}`,
    description: "Is dit jaar een schrikkeljaar, wanneer komt het volgende, en waarom heeft de kalender om de vier jaar een 29 februari? Met de regel voor eeuwjaren.",
    alternates: { canonical: "/is-het-een-schrikkeljaar" },
  };
}

export default function SchrikkelPagina() {
  if (IS_EN) notFound();
  const j = vandaag().j;
  const ja = isSchrikkeljaar(j);
  const komend = [];
  for (let x = j; komend.length < 8; x++) if (isSchrikkeljaar(x)) komend.push(x);
  return (
    <RekenPagina id="schrikkeljaar" h1={`Is ${j} een schrikkeljaar?`}>
      <section className="paneel aftel-hoofd">
        <p className="aftel-groot klein">{ja ? "Ja" : "Nee"}</p>
        <p className="aftel-sub">
          {ja ? `${j} heeft 366 dagen, met 29 februari op een ${dagNaam(ymd(j, 2, 29))}.` : `${j} heeft 365 dagen. Het volgende schrikkeljaar is ${volgendSchrikkeljaar(j)}.`}
        </p>
      </section>
      <section className="paneel reken-blok">
        <h2>De komende schrikkeljaren</h2>
        <table className="reken-tabel">
          <thead>
            <tr>
              <th>Jaar</th>
              <th>29 februari valt op</th>
            </tr>
          </thead>
          <tbody>
            {komend.map((x) => (
              <tr key={x}>
                <td>{x}</td>
                <td>{dagNaam(ymd(x, 2, 29))}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="reken-noot">2100 is geen schrikkeljaar: eeuwjaren tellen alleen mee als ze deelbaar zijn door 400.</p>
      </section>
    </RekenPagina>
  );
}
