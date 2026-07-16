"use client";

import Link from "next/link";
import { HUB_NAAM } from "@/lib/brand";
import { S } from "@/lib/strings";
import { useGebruiker } from "./GebruikerContext";
import Icoon from "./Icoon";
import MenuPaneel from "./MenuPaneel";
import { useState } from "react";

/**
 * Vaste kop (Zephyr item 1): merk links, een rustige tool-switcher in het
 * midden, en meldingen en instellingen als kleine iconen rechtsboven,
 * duim-bereikbaar op mobiel. Consistent op elke pagina.
 */
export default function SiteHeader() {
  const g = useGebruiker();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="kop">
      <Link href="/" className="merk" aria-label={HUB_NAAM}>
        <span className="merk-mark" aria-hidden="true" />
        <span className="merk-naam">{HUB_NAAM.toLowerCase()}</span>
      </Link>
      <span className="spacer" />
      <button
        className="iconknop kop-icoon"
        onClick={g.openMeldingen}
        aria-label={g.syncCode ? `${S.header.meldingen} \u00b7 ${S.header.gekoppeld}` : S.header.meldingen}
        title={g.syncCode ? `${S.header.meldingen} \u00b7 ${S.header.gekoppeld}` : S.header.meldingen}
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
      <button
        className="iconknop kop-icoon"
        onClick={() => setMenuOpen(true)}
        aria-label={S.menu.knop}
        title={S.menu.knop}
      >
        <Icoon naam="menu" maat={19} />
      </button>
      <MenuPaneel open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
