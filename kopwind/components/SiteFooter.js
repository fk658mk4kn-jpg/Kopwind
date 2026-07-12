import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { UITLEG } from "@/content/uitleg";
import { HUB_NAAM } from "@/lib/brand";

/**
 * Voet van elke pagina (Zephyr item 5): de checks, de uitleg en het
 * over-blok met bronnen, changelog, privacy en voorwaarden.
 */
export default function SiteFooter() {
  return (
    <footer className="voet">
      <div className="voet-kolommen">
        <div>
          <h2>Checks</h2>
          {TOOLS.map((t) => (
            <Link key={t.slug} href={`/${t.slug}`}>
              {t.naam}
            </Link>
          ))}
        </div>
        <div>
          <h2>Uitleg</h2>
          {UITLEG.map((a) => (
            <Link key={a.slug} href={`/uitleg/${a.slug}`}>
              {a.vraag}
            </Link>
          ))}
        </div>
        <div>
          <h2>Over</h2>
          <Link href="/over">Over {HUB_NAAM}</Link>
          <Link href="/bronnen">Bronnen en data</Link>
          <Link href="/changelog">Changelog</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/voorwaarden">Voorwaarden</Link>
        </div>
      </div>
      <p className="voet-regel">
        {HUB_NAAM} Geen weerbericht, maar een antwoord. Voorspellingen blijven voorspellingen:
        kijk voor je vertrekt ook even naar buiten.
      </p>
    </footer>
  );
}
