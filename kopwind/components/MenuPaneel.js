"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TOOLS } from "@/lib/tools";
import { CATEGORIEEN } from "@/lib/categorieen";
import { POPULAIRE_TOOL_IDS } from "@/lib/tools";
import { S } from "@/lib/strings";
import { PAD } from "@/lib/i18n/paden";
import Icoon from "./Icoon";
import { IS_EN } from "@/lib/i18n/locale";
import { AFTEL_HUB_PAD } from "@/lib/aftellen";
import { ANTWOORDEN_HUB_PAD } from "@/lib/rekenhulpen";

/**
 * Het uitklapmenu. Sinds v3.40.1 "Sirocco":
 * - via een portal in document.body, zodat het niet meer gevangen zit in
 *   de stapellaag van de sticky kop (z-index 100) en boven de cookiebalk
 *   ligt;
 * - "Snel naar" (handige antwoorden, aftellen, alle keuzehulpen) direct
 *   onder Populair in plaats van onderaan;
 * - thema's met een zichtbaar pijltje, zodat duidelijk is wat openklapt;
 *   het kopje "Meer" (dat op een knop leek maar niets deed) is weg.
 */
export default function MenuPaneel({ open, onClose }) {
  const [klaar, setKlaar] = useState(false);
  useEffect(() => setKlaar(true), []);
  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);
  if (!open || !klaar) return null;

  const groepen = CATEGORIEEN.map((c) => ({
    id: c.id,
    slug: c.slug,
    naam: c.titel,
    tools: TOOLS.filter((t) => t.categorieId === c.id),
  })).filter((g) => g.tools.length);
  const zuster = process.env.NEXT_PUBLIC_ALTERNATE_LOCALE_URL;

  const snel = [
    !IS_EN && { href: ANTWOORDEN_HUB_PAD, label: "Handige antwoorden", sub: "Geld, kalender, rekenhulpen" },
    !IS_EN && { href: AFTEL_HUB_PAD, label: "Aftellen en kalender", sub: "Feestdagen, vakanties, seizoenen" },
    { href: PAD.alleChecks, label: S.menu.alle, sub: null },
  ].filter(Boolean);

  return createPortal(
    <div className="modalachter menuachter" onClick={onClose}>
      <nav className="modal menupaneel" aria-label={S.menu.knop} onClick={(e) => e.stopPropagation()}>
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

        <div className="menugroep">
          <span className="menugroep-titel">{S.menu.snel}</span>
          <div className="menusnel">
            {snel.map((l) => (
              <Link key={l.href} href={l.href} className="menusnel-link" onClick={onClose}>
                <span className="menusnel-label">{l.label}</span>
                {l.sub && <span className="menusnel-sub">{l.sub}</span>}
              </Link>
            ))}
          </div>
        </div>

        <div className="menugroep">
          <span className="menugroep-titel">{S.menu.themas}</span>
          {groepen.map((g) => (
            <details key={g.id} className="menuthema">
              <summary className="menuthema-kop">
                <span className="menuthema-naam">{g.naam}</span>
                <span className="menuthema-teller">{g.tools.length}</span>
                <span className="menuthema-pijl" aria-hidden="true" />
              </summary>
              <div className="menuthema-inhoud">
                <Link href={`/${g.slug}`} className="menulink menulink-alle" onClick={onClose}>
                  {IS_EN ? `All: ${g.naam}` : `Alles over ${g.naam.toLowerCase()}`}
                </Link>
                {g.tools.map((t) => (
                  <Link key={t.id} href={`/${t.slug}`} className="menulink" onClick={onClose}>
                    <span className="menulink-icoon" style={{ color: t.kleur }}>
                      <Icoon naam={t.icoon} maat={17} />
                    </span>
                    {t.korteVraag}
                  </Link>
                ))}
              </div>
            </details>
          ))}
        </div>

        <div className="menugroep">
          <span className="menugroep-titel">{S.menu.over}</span>
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
    </div>,
    document.body
  );
}
