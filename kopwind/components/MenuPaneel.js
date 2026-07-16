"use client";

import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { CATEGORIEEN } from "@/lib/categorieen";
import { POPULAIRE_TOOL_IDS } from "@/lib/tools";
import { S } from "@/lib/strings";
import { PAD } from "@/lib/i18n/paden";
import Icoon from "./Icoon";

/**
 * Het uitklapmenu (v3.3.0 "Meltemi"): de tekstlinks verhuisden uit de
 * kopbalk naar een paneel achter een hamburger. Checks gegroepeerd op
 * de categorie (een bron: lib/categorieen), met een Populair-blok erboven,
 * taalwissel als de zustersite geconfigureerd is.
 */
export default function MenuPaneel({ open, onClose }) {
  if (!open) return null;
  const groepen = CATEGORIEEN.map((c) => ({
    id: c.id,
    slug: c.slug,
    naam: c.titel,
    tools: TOOLS.filter((t) => t.categorieId === c.id),
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
        <div className="menugroep">
          <span className="menugroep-titel">{S.menu.populair}</span>
          {POPULAIRE_TOOL_IDS.map((id) => TOOLS.find((t) => t.id === id))
            .filter(Boolean)
            .map((t) => (
              <Link key={t.id} href={`/${t.slug}`} className="menulink" onClick={onClose}>
                <span className="menulink-icoon" style={{ color: t.kleur }}>
                  <Icoon naam={t.icoon} maat={17} />
                </span>
                {t.korteVraag}
              </Link>
            ))}
        </div>
        {groepen.map((g) => (
          <details key={g.id} className="menugroep menugroep-klap">
            <summary className="menugroep-kop">
              <Link href={`/${g.slug}`} className="menugroep-titel menugroep-link" onClick={onClose}>
                {g.naam}
              </Link>
              <span className="menugroep-teller stil" aria-hidden="true">{g.tools.length}</span>
            </summary>
            {g.tools.map((t) => (
              <Link key={t.id} href={`/${t.slug}`} className="menulink" onClick={onClose}>
                <span className="menulink-icoon" style={{ color: t.kleur }}>
                  <Icoon naam={t.icoon} maat={17} />
                </span>
                {t.korteVraag}
              </Link>
            ))}
          </details>
        ))}
        <div className="menugroep">
          <span className="menugroep-titel">{S.menu.meer}</span>
          <Link href={PAD.alleChecks} className="menulink" onClick={onClose}>
            {S.menu.alle}
          </Link>
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
