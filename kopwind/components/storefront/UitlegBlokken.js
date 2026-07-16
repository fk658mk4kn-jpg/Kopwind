import Icoon from "@/components/Icoon";

/**
 * Storefront-blok 4 (PLAYBOOK sectie 11): de uitleg-blokken. Waar let je
 * op: de onderwerpen die de keuze bepalen. Drie vaste vormen uit de
 * storefront-content, elk met een licht visueel anker in de
 * categorie-kleur (feedbackronde juli 2026: meer ritme, wel rustig):
 * beslislogica-punten met een vinkje, situatie-kaartjes met een
 * accentrand, seizoen-kaartjes met een seizoensicoon.
 */

// Seizoensicoon op naam (werkt ook voor "Late herfst" of "Vroege lente");
// buiten het seizoenskwartet (zoals "De rest van het jaar") valt hij
// terug op de zon.
function seizoenIcoon(naam) {
  const n = naam.toLowerCase();
  if (n.includes("lente") || n.includes("spring")) return "bloem";
  if (n.includes("zomer") || n.includes("summer")) return "zon";
  if (n.includes("herfst") || n.includes("autumn")) return "druppel";
  if (n.includes("winter")) return "vlok";
  return "zon";
}

export default function UitlegBlokken({ sf, categorie }) {
  const heeftIets = sf?.beslislogica || sf?.situaties || sf?.seizoen;
  if (!heeftIets) return null;
  const kleur = categorie?.kleur ?? "#1B2733";
  return (
    <section className="seotekst storefront-tekst">
      {sf.beslislogica && (
        <>
          <h2>{sf.beslislogica.kop}</h2>
          <ul className="storefront-punten">
            {sf.beslislogica.punten.map((p, i) => (
              <li key={i}>
                <span className="punt-vink" style={{ color: kleur }} aria-hidden="true">
                  <Icoon naam="vinkje" maat={15} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      {sf.situaties && (
        <>
          <h2>{sf.situaties.kop}</h2>
          <div className="storefront-situaties">
            {sf.situaties.items.map((s) => (
              <div key={s.naam} className="storefront-situatie" style={{ borderLeftColor: kleur }}>
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
              <div key={s.naam} className="storefront-situatie storefront-seizoen">
                <h3>
                  <span className="icon-chip klein" style={{ background: `color-mix(in srgb, ${kleur} 14%, #ffffff)`, color: kleur }}>
                    <Icoon naam={seizoenIcoon(s.naam)} maat={15} />
                  </span>
                  {s.naam}
                </h3>
                <p>{s.tekst}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
