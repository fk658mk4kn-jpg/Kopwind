import { AFFILIATE_DISCLOSURE, BOL_AFFILIATE_ACTIEF, metPartnerlink } from "@/lib/affiliate";
import { kies } from "@/lib/i18n/locale";
import TekstMetLinks from "@/components/TekstMetLinks";
import Icoon from "@/components/Icoon";

/**
 * Rendert het adviesblok van een tool (v3.22.0). Advies eerst, links als
 * hulpmiddel. Bij een ACTIEVE affiliate-relatie krijgen de links
 * rel="sponsored nofollow noopener" plus een verplichte disclosure
 * eronder; zonder actieve relatie zijn het gewone product-links
 * (rel="nofollow noopener", geen disclosure), zodat we niets melden wat
 * niet klopt. Geen tracking-pixels, geen banner: nette tekst plus links,
 * passend bij de privacy-first opzet.
 *
 * Geeft null terug als de tool geen adviesblok heeft, zodat de
 * toolpagina hem onvoorwaardelijk kan aanroepen.
 */
export default function AdviesBlok({ affiliate, toolId = "" }) {
  if (!affiliate) return null;
  const disclosure = kies(affiliate.disclosure ?? AFFILIATE_DISCLOSURE);
  const items = metPartnerlink(affiliate.items, toolId);
  const rel = BOL_AFFILIATE_ACTIEF ? "sponsored nofollow noopener" : "nofollow noopener";
  return (
    <section className="adviesblok" aria-label={kies(affiliate.kop)}>
      <h2>{kies(affiliate.kop)}</h2>
      <p><TekstMetLinks tekst={kies(affiliate.advies)} /></p>
      <div className="adviesblok-links">
        {items.map((it, i) => (
          <a
            key={i}
            href={it.url}
            className="adviesblok-link"
            target="_blank"
            rel={rel}
          >
            <span>{kies(it.label)}</span>
            <span className="adviesblok-partner">
              {it.partner}
              <Icoon naam="pijl" maat={14} />
            </span>
          </a>
        ))}
      </div>
      {BOL_AFFILIATE_ACTIEF && (
        <p className="adviesblok-disclosure">{disclosure}</p>
      )}
    </section>
  );
}
