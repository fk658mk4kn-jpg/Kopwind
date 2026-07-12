"use client";

import Link from "next/link";
import { HUB_NAAM } from "@/lib/brand";
import { S } from "@/lib/strings/nl";
import { TOOLS } from "@/lib/tools";
import { useGebruiker } from "./GebruikerContext";
import Icoon from "./Icoon";

/**
 * Vaste kop (Zephyr item 1): merk links, een rustige tool-switcher in het
 * midden, en meldingen en instellingen als kleine iconen rechtsboven,
 * duim-bereikbaar op mobiel. Consistent op elke pagina.
 */
export default function SiteHeader() {
  const g = useGebruiker();
  return (
    <header className="kop">
      <Link href="/" className="merk" aria-label={HUB_NAAM}>
        <span className="merk-mark" aria-hidden="true" />
        <span className="merk-naam">{HUB_NAAM.toLowerCase()}</span>
      </Link>
      <nav className="hoofdnav" aria-label={S.header.alleTools}>
        {TOOLS.map((t) => (
          <Link key={t.slug} href={`/${t.slug}`} className="navlink">
            {t.meldingKort}
          </Link>
        ))}
      </nav>
      <span className="spacer" />
      <button
        className="iconknop kop-icoon"
        onClick={g.openMeldingen}
        aria-label={S.header.meldingen}
        title={S.header.meldingen}
      >
        <Icoon naam="bel" maat={19} />
        {g.syncCode ? <span className="stip" aria-hidden="true" /> : null}
      </button>
      <button
        className="iconknop kop-icoon"
        onClick={g.openInstellingen}
        aria-label={S.header.instellingen}
        title={S.header.instellingen}
      >
        <Icoon naam="tandwiel" maat={19} />
      </button>
    </header>
  );
}
