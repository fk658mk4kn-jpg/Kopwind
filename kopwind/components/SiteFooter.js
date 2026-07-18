import Link from "next/link";
import { TOOLS, POPULAIRE_TOOL_IDS } from "@/lib/tools";
import { CATEGORIEEN } from "@/lib/categorieen";
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
          <h2>{S.voet.themas}</h2>
          {CATEGORIEEN.map((c) => (
            <Link key={c.slug} href={`/${c.slug}`}>
              {c.titel}
            </Link>
          ))}
        </div>
        <div>
          <h2>{S.voet.checks}</h2>
          {/* Compact sinds v3.24.0 (feedback: 24 links werd te lang):
              de zes populaire plus een link naar het volledige
              overzicht. De hubs en alle-keuzehulpen dragen de rest van
              het interne linkwerk. */}
          {POPULAIRE_TOOL_IDS.map((id) => TOOLS.find((t) => t.id === id))
            .filter(Boolean)
            .map((t) => (
              <Link key={t.slug} href={`/${t.slug}`}>
                {t.naam}
              </Link>
            ))}
          <Link href={PAD.alleChecks} className="voet-alle">
            {S.hub.alleChecksTitel}
          </Link>
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
          {process.env.NEXT_PUBLIC_ALTERNATE_LOCALE_URL && (
            <a href={process.env.NEXT_PUBLIC_ALTERNATE_LOCALE_URL}>{S.menu.taalwissel}</a>
          )}
        </div>
      </div>
      <p className="voet-regel">
        {HUB_NAAM} {S.voet.regel}
      </p>
    </footer>
  );
}
