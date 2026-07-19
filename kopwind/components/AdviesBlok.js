import { AFFILIATE_DISCLOSURE, metPartnerlink } from "@/lib/affiliate";
import { kies } from "@/lib/i18n/locale";
import TekstMetLinks from "@/components/TekstMetLinks";
import Icoon from "@/components/Icoon";

/**
 * Rendert het affiliate-adviesblok van een tool (v3.22.0). Advies eerst,
 * links als hulpmiddel, met een verplichte disclosure eronder. Alle
 * uitgaande links krijgen rel="sponsored nofollow noopener" en openen
 * in een nieuw tabblad. Geen tracking, geen banner: gewoon tekst plus
 * nette links, zodat het bij de privacy-first opzet past.
 *
 * Geeft null terug als de tool geen affiliate-blok heeft, zodat de
 * toolpagina hem onvoorwaardelijk kan aanroepen.
 */
export default function AdviesBlok({ affiliate, toolId = "" }) {
  if (!affiliate) return null;
  const disclosure = kies(affiliate.disclosure ?? AFFILIATE_DISCLOSURE);
  const items = metPartnerlink(affiliate.items, toolId);
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
            rel="sponsored nofollow noopener"
          >
            <span>{kies(it.label)}</span>
            <span className="adviesblok-partner">
              {it.partner}
              <Icoon naam="pijl" maat={14} />
            </span>
          </a>
        ))}
      </div>
      <p className="adviesblok-disclosure">{disclosure}</p>
    </section>
  );
}
