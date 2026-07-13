"use client";

import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { S } from "@/lib/strings";
import { PAD } from "@/lib/i18n/paden";
import Icoon from "./Icoon";

/**
 * Het uitklapmenu (v3.3.0 "Meltemi"): de tekstlinks verhuisden uit de
 * kopbalk naar een paneel achter een hamburger. Checks gegroepeerd op
 * het groep-veld uit het register, daaronder uitleg en over, en de
 * taalwissel als de zustersite geconfigureerd is.
 */
const GROEP_VOLGORDE = ["Elke dag", "Rondom huis", "Onderweg"];

export default function MenuPaneel({ open, onClose }) {
  if (!open) return null;
  const groepen = GROEP_VOLGORDE.map((g) => ({
    naam: S.menu.groepen[g] ?? g,
    tools: TOOLS.filter((t) => t.groep === g),
  })).filter((g) => g.tools.length);
  const zuster = process.env.NEXT_PUBLIC_ALTERNATE_LOCALE_URL;

  return (
    <div className="modalachter menuachter" onClick={onClose}>
      <nav
        className="modal menupaneel"
        aria-label={S.menu.knop}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="menupaneel-kop">
          <span className="menupaneel-titel">{S.menu.knop}</span>
          <button className="iconknop" onClick={onClose} aria-label={S.algemeen.sluiten}>
            <Icoon naam="menu_dicht" maat={18} />
          </button>
        </div>
        {groepen.map((g) => (
          <div key={g.naam} className="menugroep">
            <span className="menugroep-titel">{g.naam}</span>
            {g.tools.map((t) => (
              <Link key={t.id} href={`/${t.slug}`} className="menulink" onClick={onClose}>
                <span className="menulink-icoon" style={{ color: t.kleur }}>
                  <Icoon naam={t.icoon} maat={17} />
                </span>
                {t.korteVraag}
              </Link>
            ))}
          </div>
        ))}
        <div className="menugroep">
          <span className="menugroep-titel">{S.menu.meer}</span>
          <Link href={PAD.uitleg} className="menulink" onClick={onClose}>
            {S.voet.uitleg}
          </Link>
          <Link href={PAD.over} className="menulink" onClick={onClose}>
            {S.voet.over}
          </Link>
          {zuster && (
            <a href={zuster} className="menulink">
              {S.menu.taalwissel}
            </a>
          )}
        </div>
      </nav>
    </div>
  );
}
