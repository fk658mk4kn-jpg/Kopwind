/**
 * Storefront-blok 4 (PLAYBOOK sectie 11): de uitleg-blokken. Waar let je
 * op: de onderwerpen die de keuze bepalen. Drie vaste vormen uit de
 * storefront-content: beslislogica (kop plus punten), situaties en
 * seizoen (kop plus naam/tekst-kaartjes). Elke vorm is optioneel.
 */
export default function UitlegBlokken({ sf }) {
  const heeftIets = sf?.beslislogica || sf?.situaties || sf?.seizoen;
  if (!heeftIets) return null;
  return (
    <section className="seotekst storefront-tekst">
      {sf.beslislogica && (
        <>
          <h2>{sf.beslislogica.kop}</h2>
          <ul className="storefront-punten">
            {sf.beslislogica.punten.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </>
      )}

      {sf.situaties && (
        <>
          <h2>{sf.situaties.kop}</h2>
          <div className="storefront-situaties">
            {sf.situaties.items.map((s) => (
              <div key={s.naam} className="storefront-situatie">
                <h3>{s.naam}</h3>
                <p>{s.tekst}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {sf.seizoen && (
        <>
          <h2>{sf.seizoen.kop}</h2>
          <div className="storefront-situaties">
            {sf.seizoen.items.map((s) => (
              <div key={s.naam} className="storefront-situatie">
                <h3>{s.naam}</h3>
                <p>{s.tekst}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
