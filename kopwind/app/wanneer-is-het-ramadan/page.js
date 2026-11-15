import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import { IS_EN } from "@/lib/i18n/locale";
import { huidigeRamadan } from "@/lib/ramadan";
import {
  vandaag, sleutel, uitSleutel, dagenTussen, plusDagen, datumTekst, zonTijden, tijdTekst,
} from "@/lib/aftellen/datums";

export const revalidate = 3600;

export function generateMetadata() {
  if (IS_EN) return {};
  const r = huidigeRamadan(sleutel(vandaag()));
  const start = r ? uitSleutel(r.start) : null;
  return {
    title: r
      ? `Wanneer is het ramadan in ${r.jaar}? Verwacht vanaf ${datumTekst(start, { metJaar: false })}`
      : "Wanneer is het ramadan? Verwachte data en iftartijden",
    description:
      "De verwachte eerste vastendag van de ramadan, het Suikerfeest en de zonsondergang (iftar) voor elke vastendag in De Bilt.",
    alternates: { canonical: "/wanneer-is-het-ramadan" },
  };
}

export default function RamadanPagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  const r = huidigeRamadan(sleutel(nu));
  if (!r) {
    return (
      <RekenPagina id="ramadan">
        <section className="paneel aftel-hoofd">
          <p className="aftel-sub">De verwachte data voor de volgende ramadan worden hier gezet zodra ze bekend zijn.</p>
        </section>
      </RekenPagina>
    );
  }
  const start = uitSleutel(r.start);
  const eindLaat = uitSleutel(r.eindLaat);
  const dagen = dagenTussen(nu, start);
  const bezig = dagen <= 0;
  const lengte = dagenTussen(start, eindLaat) + 1;
  const rijen = Array.from({ length: lengte }, (_, i) => {
    const d = plusDagen(start, i);
    return { d, onder: tijdTekst(zonTijden(d, 52.1, 5.18).onder) };
  });
  const [eid1, eid2] = r.suikerfeest.map(uitSleutel);
  return (
    <RekenPagina id="ramadan">
      <section className="paneel aftel-hoofd">
        {bezig ? (
          <>
            <p className="aftel-groot klein">Het is ramadan</p>
            <p className="aftel-sub">Dag {1 - dagen} van {lengte - 1} of {lengte}.</p>
          </>
        ) : (
          <>
            <p className="aftel-groot">{dagen}</p>
            <p className="aftel-sub">dagen tot de verwachte eerste vastendag</p>
          </>
        )}
        <p className="aftel-datum">Verwacht begin: {datumTekst(start, { metDag: true })}</p>
        <ul className="aftel-feiten">
          <li>
            Suikerfeest verwacht op {datumTekst(eid1, { metDag: true })} of {datumTekst(eid2, { metDag: true })}
          </li>
          <li>De definitieve datum hangt af van de waarneming van de maansikkel</li>
        </ul>
      </section>
      <section className="paneel reken-blok">
        <h2>Zonsondergang (iftar) per vastendag in De Bilt</h2>
        <table className="reken-tabel">
          <thead>
            <tr>
              <th>Dag</th>
              <th>Datum</th>
              <th className="rechts">Zonsondergang</th>
            </tr>
          </thead>
          <tbody>
            {rijen.map((x, i) => (
              <tr key={i} className={sleutel(x.d) === sleutel(nu) ? "nu" : undefined}>
                <td>{i + 1}</td>
                <td>{datumTekst(x.d, { metDag: true, metJaar: false })}</td>
                <td className="rechts">{x.onder}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="reken-noot">
          Berekend voor De Bilt. In het oosten van het land gaat de zon een paar minuten eerder onder, in het westen later. Moskeeen publiceren hun eigen tijden.
        </p>
      </section>
    </RekenPagina>
  );
}
