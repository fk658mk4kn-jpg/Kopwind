import { maanNu, fasenTussen, FASE_NAMEN } from "@/lib/maan";
import { vandaag, datumTekst, tijdTekst } from "@/lib/aftellen/datums";

/**
 * Maanfase van vandaag plus de komende fasen en een jaar volle manen
 * (v3.37.0). Server-gerenderd; de pagina revalideert elk uur.
 */
export default function MaanBlok({ nu = Date.now() }) {
  const maan = maanNu(nu);
  const komend = fasenTussen(nu, nu + 32 * 86400000).slice(0, 4);
  const vollen = fasenTussen(nu, nu + 400 * 86400000).filter((f) => f.soort === 2).slice(0, 13);
  return (
    <>
      <section className="paneel aftel-daglicht">
        <h2 className="paneel-titel">De maan vandaag</h2>
        <div className="maan-rij">
          <div className="maan-schijf" aria-hidden="true">
            <div
              className="maan-licht"
              style={{
                // Een eenvoudige weergave: het verlichte deel schuift van rechts (wassend) naar links (afnemend).
                clipPath: maan.wassend
                  ? `inset(0 0 0 ${100 - maan.verlicht}%)`
                  : `inset(0 ${100 - maan.verlicht}% 0 0)`,
              }}
            />
          </div>
          <ul className="aftel-feiten">
            <li>
              <strong>{maan.naam}</strong>
            </li>
            <li>{maan.verlicht}% verlicht</li>
            <li>{maan.leeftijd} dagen na nieuwe maan</li>
          </ul>
        </div>
        <h3 className="maan-kop">De komende fasen</h3>
        <ul className="aftel-feiten">
          {komend.map((f) => (
            <li key={f.tijdstip}>
              {FASE_NAMEN[f.soort]}: {datumTekst(vandaag(f.tijdstip), { metDag: true })} om {tijdTekst(f.tijdstip)}
            </li>
          ))}
        </ul>
      </section>
      <section className="paneel reken-blok">
        <h2>Alle volle manen het komende jaar</h2>
        <table className="reken-tabel">
          <thead>
            <tr>
              <th>Datum</th>
              <th className="rechts">Tijd</th>
            </tr>
          </thead>
          <tbody>
            {vollen.map((f) => (
              <tr key={f.tijdstip}>
                <td>{datumTekst(vandaag(f.tijdstip), { metDag: true })}</td>
                <td className="rechts">{tijdTekst(f.tijdstip)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="reken-noot">Tijden in Nederlandse tijd, op ongeveer een minuut nauwkeurig.</p>
      </section>
    </>
  );
}
