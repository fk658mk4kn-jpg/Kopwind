import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import WeekZoeker from "@/components/reken/WeekZoeker";
import { IS_EN } from "@/lib/i18n/locale";
import {
  vandaag, isoWeek, maandagVanWeek, wekenInJaar, plusDagen, datumTekst, sleutel, MAAND_NAMEN,
} from "@/lib/aftellen/datums";

export const revalidate = 3600;

export function generateMetadata() {
  if (IS_EN) return {};
  const w = isoWeek(vandaag());
  const title = `Welke week is het? Nu week ${w.week} (weeknummer ${w.jaar})`;
  return {
    title: `${title}`,
    description: `Vandaag is het week ${w.week} van ${w.jaar}. Met de data van deze week, alle weeknummers van het jaar en een zoeker voor elke datum.`,
    alternates: { canonical: "/welke-week-is-het" },
  };
}

const kort = (d) => `${d.d} ${MAAND_NAMEN[d.m - 1].slice(0, 3)}`;

function JaarTabel({ jaar, huidig }) {
  const n = wekenInJaar(jaar);
  return (
    <section className="paneel reken-blok">
      <h2>Weeknummers {jaar}</h2>
      <table className="reken-tabel">
        <thead>
          <tr>
            <th>Week</th>
            <th>Maandag</th>
            <th>Zondag</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: n }, (_, i) => {
            const ma = maandagVanWeek(jaar, i + 1);
            const nu = huidig && huidig.jaar === jaar && huidig.week === i + 1;
            return (
              <tr key={i} className={nu ? "nu" : undefined}>
                <td>{i + 1}</td>
                <td>{kort(ma)} {ma.j !== jaar ? ma.j : ""}</td>
                <td>{kort(plusDagen(ma, 6))} {plusDagen(ma, 6).j !== jaar ? plusDagen(ma, 6).j : ""}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="reken-noot">{jaar} heeft {n} weken.</p>
    </section>
  );
}

export default function WeekPagina() {
  if (IS_EN) notFound();
  const dag = vandaag();
  const w = isoWeek(dag);
  const ma = maandagVanWeek(w.jaar, w.week);
  return (
    <RekenPagina id="weeknummer">
      <section className="paneel aftel-hoofd">
        <p className="aftel-label">Vandaag, {datumTekst(dag, { metDag: true })}, is het</p>
        <p className="aftel-groot">week {w.week}</p>
        <p className="aftel-datum">
          {datumTekst(ma, { metDag: true })} tot en met {datumTekst(plusDagen(ma, 6), { metDag: true })}
        </p>
        <p className="aftel-sub">Volgende week is week {isoWeek(plusDagen(ma, 7)).week}.</p>
      </section>
      <WeekZoeker startDatum={sleutel(dag)} />
      <JaarTabel jaar={w.jaar} huidig={w} />
      <JaarTabel jaar={w.jaar + 1} huidig={w} />
    </RekenPagina>
  );
}
