import Link from "next/link";
import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import { IS_EN } from "@/lib/i18n/locale";
import { VAKANTIE_DATA } from "@/lib/aftellen/vakanties";
import { vindAftellerOpId } from "@/lib/aftellen";
import { vandaag, uitSleutel, datumTekst, vergelijk } from "@/lib/aftellen/datums";

export const revalidate = 3600;

const VOLGORDE = [
  { sleutel: "herfst", naam: "Herfstvakantie", teller: "herfstvakantie" },
  { sleutel: "kerst", naam: "Kerstvakantie", teller: "kerstvakantie" },
  { sleutel: "voorjaar", naam: "Voorjaarsvakantie", teller: "voorjaarsvakantie" },
  { sleutel: "mei", naam: "Meivakantie", teller: "meivakantie" },
  { sleutel: "zomer", naam: "Zomervakantie", teller: "zomervakantie" },
];

/** Schooljaar van een vakantie: herfst en kerst horen bij het startjaar. */
function schooljaarVan(sleutelNaam, start) {
  const j = uitSleutel(start).j;
  return sleutelNaam === "herfst" || (sleutelNaam === "kerst" && uitSleutel(start).m === 12) ? j : j - 1;
}

function schooljaren(nu) {
  const per = new Map();
  for (const v of VOLGORDE) {
    for (const r of VAKANTIE_DATA[v.sleutel]) {
      const sj = schooljaarVan(v.sleutel, r.start);
      if (!per.has(sj)) per.set(sj, {});
      const blok = per.get(sj);
      blok[v.sleutel] = blok[v.sleutel] ?? {};
      blok[v.sleutel][r.regio] = r;
    }
  }
  return [...per.entries()]
    .sort((a, b) => a[0] - b[0])
    .filter(([, blok]) => !blok.zomer || Object.values(blok.zomer).some((r) => vergelijk(uitSleutel(r.eind), nu) >= 0));
}

export function generateMetadata() {
  if (IS_EN) return {};
  const jaren = schooljaren(vandaag()).map(([sj]) => `${sj}-${sj + 1}`);
  return {
    title: `Schoolvakanties ${jaren.join(" en ")} per regio`,
    description: `Alle schoolvakanties ${jaren.join(" en ")} voor regio noord, midden en zuid: herfst, kerst, voorjaar, mei en zomer, met een teller per vakantie.`,
    alternates: { canonical: "/schoolvakanties" },
  };
}

const kort = (s) => datumTekst(uitSleutel(s), { metJaar: false });

export default function VakantiePagina() {
  if (IS_EN) notFound();
  const nu = vandaag();
  return (
    <RekenPagina id="schoolvakanties">
      {schooljaren(nu).map(([sj, blok]) => (
        <section key={sj} className="paneel reken-blok">
          <h2>
            Schooljaar {sj}-{sj + 1}
          </h2>
          <table className="reken-tabel">
            <thead>
              <tr>
                <th>Vakantie</th>
                <th>Noord</th>
                <th>Midden</th>
                <th>Zuid</th>
              </tr>
            </thead>
            <tbody>
              {VOLGORDE.filter((v) => blok[v.sleutel]).map((v) => {
                const teller = vindAftellerOpId(v.teller);
                return (
                  <tr key={v.sleutel}>
                    <td>
                      <Link href={`/${teller.slug}`}>{v.naam}</Link>
                    </td>
                    {["noord", "midden", "zuid"].map((regio) => {
                      const r = blok[v.sleutel][regio];
                      return <td key={regio}>{r ? `${kort(r.start)} t/m ${kort(r.eind)}` : "nog niet bekend"}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="reken-noot">
            Herfst-, voorjaars- en de tweede meivakantieweek zijn adviesdata. Een vakantie loopt van zaterdag tot en met zondag.
          </p>
        </section>
      ))}
    </RekenPagina>
  );
}
