import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import { IS_EN } from "@/lib/i18n/locale";
import {
  vandaag, plusDagen, daglengte, zonTijden, tijdTekst, duurTekst, datumTekst, seizoenDatum, dagenTussen, vergelijk,
} from "@/lib/aftellen/datums";

export const revalidate = 3600;

const BILT = [52.1, 5.18];
const lengte = (d) => daglengte(d, ...BILT);

/** De kortste dag die het dichtst achter ons ligt en de langste die komt. */
function keerpunten(nu) {
  const winterDit = seizoenDatum("winter", nu.j);
  const kortste = vergelijk(nu, winterDit) >= 0 ? winterDit : seizoenDatum("winter", nu.j - 1);
  const zomerDit = seizoenDatum("zomer", nu.j);
  const langste = vergelijk(nu, zomerDit) <= 0 ? zomerDit : seizoenDatum("zomer", nu.j + 1);
  const winterVolgend = vergelijk(nu, winterDit) < 0 ? winterDit : seizoenDatum("winter", nu.j + 1);
  return { kortste, langste, winterVolgend, langerWordend: vergelijk(langste, winterVolgend) < 0 };
}

/** Eerste dag vanaf `van` waarop de zon na een bepaald uur ondergaat. */
function eersteOnderNa(van, uur, maxDagen = 200) {
  for (let i = 0; i < maxDagen; i++) {
    const d = plusDagen(van, i);
    if (tijdTekst(zonTijden(d, ...BILT).onder) >= `${String(uur).padStart(2, "0")}:00`) return d;
  }
  return null;
}

export function generateMetadata() {
  if (IS_EN) return {};
  const nu = vandaag();
  const k = keerpunten(nu);
  const title = k.langerWordend
    ? `Wanneer worden de dagen weer langer? Nu al ${duurTekst(lengte(nu) - lengte(k.kortste))} langer dan op de kortste dag`
    : `Wanneer worden de dagen weer langer? Vanaf ${datumTekst(k.winterVolgend, { metJaar: false })}`;
  return {
    title,
    description:
      "Hoe lang de dag vandaag is, hoeveel minuten er per dag bij komen of af gaan, en wanneer de zon weer na vijf, zes en zeven uur ondergaat.",
    alternates: { canonical: "/wanneer-worden-de-dagen-weer-langer" },
  };
}

export default function DagenLangerPagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  const k = keerpunten(nu);
  const vandaagL = lengte(nu);
  const verschil = vandaagL - lengte(plusDagen(nu, -1));
  const start = k.langerWordend ? nu : k.winterVolgend;
  const mijlpalen = [17, 18, 19, 20, 21]
    .map((u) => ({ u, d: eersteOnderNa(start, u) }))
    .filter((x) => x.d && vergelijk(x.d, k.langerWordend ? k.langste : plusDagen(k.winterVolgend, 200)) <= 0)
    .slice(0, 4);
  const weken = [];
  for (let d = start; vergelijk(d, k.langerWordend ? k.langste : plusDagen(k.winterVolgend, 182)) <= 0 && weken.length < 27; d = plusDagen(d, 7)) {
    const z = zonTijden(d, ...BILT);
    weken.push({ d, op: tijdTekst(z.op), onder: tijdTekst(z.onder), l: lengte(d) });
  }
  return (
    <RekenPagina id="dagen-langer">
      <section className="paneel aftel-hoofd">
        {k.langerWordend ? (
          <>
            <p className="aftel-label">De dagen worden langer. Vandaag in De Bilt</p>
            <p className="aftel-groot klein">{duurTekst(vandaagL)}</p>
            <p className="aftel-sub">
              {verschil > 0 ? `${verschil} ${verschil === 1 ? "minuut" : "minuten"} langer dan gisteren` : "nauwelijks langer dan gisteren"}, en {duurTekst(vandaagL - lengte(k.kortste))} langer dan op de kortste dag.
            </p>
          </>
        ) : (
          <>
            <p className="aftel-label">De dagen worden nog korter. Weer langer vanaf</p>
            <p className="aftel-groot klein">{datumTekst(k.winterVolgend, { metJaar: false })}</p>
            <p className="aftel-sub">
              Nog {dagenTussen(nu, k.winterVolgend)} dagen tot de kortste dag. Vandaag duurt de dag {duurTekst(vandaagL)}, {Math.abs(verschil)} {Math.abs(verschil) === 1 ? "minuut" : "minuten"} korter dan gisteren.
            </p>
          </>
        )}
        {mijlpalen.length > 0 && (
          <ul className="aftel-feiten">
            {mijlpalen.map((x) => (
              <li key={x.u}>
                Zon voor het eerst weer na {x.u}:00 onder: {datumTekst(x.d, { metDag: true })}
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="paneel reken-blok">
        <h2>Week voor week tot de langste dag</h2>
        <table className="reken-tabel">
          <thead>
            <tr>
              <th>Datum</th>
              <th className="rechts">Op</th>
              <th className="rechts">Onder</th>
              <th className="rechts">Daglengte</th>
            </tr>
          </thead>
          <tbody>
            {weken.map((w) => (
              <tr key={w.d.j * 1000 + w.d.m * 40 + w.d.d}>
                <td>{datumTekst(w.d, { metJaar: false })}</td>
                <td className="rechts">{w.op}</td>
                <td className="rechts">{w.onder}</td>
                <td className="rechts">
                  {Math.floor(w.l / 60)}:{String(w.l % 60).padStart(2, "0")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="reken-noot">Voor De Bilt, inclusief de klokwissel naar zomertijd eind maart.</p>
      </section>
    </RekenPagina>
  );
}
