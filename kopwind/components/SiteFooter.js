import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { UITLEG } from "@/content/uitleg";
import { HUB_NAAM } from "@/lib/brand";
import { S } from "@/lib/strings";
import { PAD } from "@/lib/i18n/paden";

/**
 * Voet van elke pagina (Zephyr item 5): de checks, de uitleg en het
 * over-blok met bronnen, changelog, privacy en voorwaarden.
 */
export default function SiteFooter() {
  return (
    <footer className="voet">
      <div className="voet-kolommen">
        <div>
          <h2>{S.voet.checks}</h2>
          {TOOLS.map((t) => (
            <Link key={t.slug} href={`/${t.slug}`}>
              {t.naam}
            </Link>
          ))}
        </div>
        <div>
          <h2>{S.voet.uitleg}</h2>
          {UITLEG.map((a) => (
            <Link key={a.slug} href={`${PAD.uitleg}/${a.slug}`}>
              {a.vraag}
            </Link>
          ))}
        </div>
        <div>
          <h2>{S.voet.over}</h2>
          <Link href={PAD.over}>{S.voet.overSite} {HUB_NAAM}</Link>
          <Link href={PAD.bronnen}>{S.voet.bronnen}</Link>
          <Link href={PAD.changelog}>{S.voet.changelog}</Link>
          <Link href={PAD.privacy}>{S.voet.privacy}</Link>
          <Link href={PAD.voorwaarden}>{S.voet.voorwaarden}</Link>
        </div>
      </div>
      <p className="voet-regel">
        {HUB_NAAM} {S.voet.regel}
      </p>
    </footer>
  );
}
