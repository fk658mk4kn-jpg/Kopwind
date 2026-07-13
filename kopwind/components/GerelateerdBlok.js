import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { S } from "@/lib/strings";
import Icoon from "./Icoon";

/**
 * "Ook handig vandaag" (v3.3.0): drie gerelateerde checks onder elke
 * toolpagina. Contextueel gekozen, niet willekeurig: wie de terrascheck
 * leest, wil vaak ook de barbecue en de zonkracht weten. De interne
 * links helpen bezoekers en zoekmachines dezelfde kant op.
 */
const RELATIES = {
  "fiets-naar-werk": ["wat-trek-ik-aan", "zonkracht", "was-buiten-drogen"],
  "was-buiten-drogen": ["terras", "wat-trek-ik-aan", "barbecue"],
  "wat-trek-ik-aan": ["zonkracht", "fiets-naar-werk", "terras"],
  "terras": ["barbecue", "zonkracht", "was-buiten-drogen"],
  "barbecue": ["terras", "zonkracht", "was-buiten-drogen"],
  "zonkracht": ["terras", "wat-trek-ik-aan", "barbecue"],
};

export default function GerelateerdBlok({ toolId }) {
  const ids = RELATIES[toolId] ?? [];
  const links = ids.map((id) => TOOLS.find((t) => t.id === id)).filter(Boolean);
  if (!links.length) return null;
  return (
    <section className="gerelateerd" aria-label={S.gerelateerd.kop}>
      <h2>{S.gerelateerd.kop}</h2>
      <div className="gerelateerd-rij">
        {links.map((t) => (
          <Link key={t.id} href={`/${t.slug}`} className="gerelateerd-link">
            <span className="menulink-icoon" style={{ color: t.kleur }}>
              <Icoon naam={t.icoon} maat={16} />
            </span>
            {t.korteVraag}
          </Link>
        ))}
      </div>
    </section>
  );
}
