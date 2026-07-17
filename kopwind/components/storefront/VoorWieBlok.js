/**
 * Storefront-blok 2 (PLAYBOOK sectie 11): voor wie / waarvoor.
 * Herkenbare situaties in 2-3 korte regels, direct onder de hero. Geen
 * lijstjes of verkooppraat: de bezoeker moet zich in een regel herkennen.
 */
import TekstMetLinks from "@/components/TekstMetLinks";

export default function VoorWieBlok({ blok }) {
  if (!blok?.regels?.length) return null;
  return (
    <section className="seotekst storefront-voorwie">
      <h2>{blok.kop}</h2>
      {blok.regels.map((r, i) => (
        <p key={i}><TekstMetLinks tekst={r} /></p>
      ))}
    </section>
  );
}
