"use client";

import { kies } from "@/lib/i18n/locale";
import { fmtCijfer } from "@/lib/format";
import { fietsNaarWerk } from "@/lib/tools/fiets-naar-werk";
import VerdictBadge from "@/components/VerdictBadge";
import FactorBalken from "@/components/FactorBalken";

/**
 * Het dagadvies bovenaan (fase 2, v3.20.0 "Bayamo"): de badge draagt
 * hetzelfde schaalwoord en dezelfde kleur als elke andere check op de
 * site (VerdictBadge, vijfschaal) in plaats van de eigen 3-woordige
 * fiets-taal; dat IS het ja/nee-signaal, consistent met de rest van
 * de site ("een losse Ja/Nee-badge was dubbelop", zie VerdictBadge).
 * Daaronder, gestructureerd in plaats van in een lopende zin: de
 * windsamenvatting van de zwaarste rit, de naam van die rit, de
 * top-redenen als losse punten, de factorbalken en de cijferdrempels
 * expliciet uitgeschreven.
 */
export default function DagBanner({ dag }) {
  if (!dag) return null;
  const cijfer = fmtCijfer(dag.score);
  const top = (dag.redenen ?? []).slice(0, 3);

  return (
    <div className="dagbanner">
      <div className="dagbanner-kop">
        <VerdictBadge score={dag.score} labels={fietsNaarWerk.schaalLabels} />
        <span className="dagbanner-cijfer">{cijfer}</span>
      </div>

      {dag.windZin && <p className="dagbanner-wind">{dag.windZin}</p>}

      <p className="dagbanner-zwaarste">
        {kies({ nl: "Zwaarste rit: ", en: "Toughest leg: " })}
        <strong>{dag.worstLabel}</strong>
      </p>

      {top.length > 0 && (
        <ul className="dagbanner-redenen">
          {top.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      )}

      <FactorBalken factoren={dag.factoren} />

      <p className="dagbanner-drempels">
        {kies({
          nl: "Drempels: cijfer 7,0 of hoger is een prima fietsdag; tussen 4,0 en 7,0 is het pittig maar te doen; onder 4,0 kun je beter iets anders nemen.",
          en: "Thresholds: 7.0 or higher is a good cycling day; between 4.0 and 7.0 is tough but doable; below 4.0 you're better off with something else.",
        })}
      </p>

      <p className="noot">
        {kies({
          nl: "Heen en terug tellen allebei mee: de zwaarste rit van je dag bepaalt het advies.",
          en: "Outbound and return both count: the toughest leg of your day sets the verdict.",
        })}
      </p>
    </div>
  );
}
