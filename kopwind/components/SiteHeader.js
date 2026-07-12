"use client";

import Link from "next/link";
import { HUB_NAAM } from "@/lib/brand";
import { S } from "@/lib/strings/nl";
import { TOOLS } from "@/lib/tools";
import { useGebruiker } from "./GebruikerContext";
import Icoon from "./Icoon";

/** Vaste kop van de hub: merk, toolnavigatie en de twee panelen. */
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
            {t.naam}
          </Link>
        ))}
      </nav>
      <span className="spacer" />
      <button className="knop" onClick={g.openMeldingen}>
        <Icoon naam="bel" maat={15} /> {S.header.meldingen}
        {g.syncCode ? <span className="stip" aria-hidden="true" /> : null}
      </button>
      <button className="knop" onClick={g.openInstellingen}>
        {S.header.instellingen}
      </button>
    </header>
  );
}
