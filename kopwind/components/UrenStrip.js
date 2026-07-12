"use client";

import { kleurSequentieel } from "@/lib/engine/kleuren";
import KleurLegenda from "./KleurLegenda";

/**
 * De signature-vormtaal toegepast op uren (Zephyr 1b): een gelabelde
 * strip waarin elk blokje de score van dat uur kleurt (sequentiele ramp),
 * natte uren een streep-patroon krijgen (dus niet alleen kleur draagt de
 * betekenis) en het aanbevolen blok een duidelijke markering heeft.
 * Tijdlabels bij begin, einde en de venstergrenzen.
 */
export default function UrenStrip({ uren, venster, legenda, vensterLabel = "beste blok" }) {
  if (!uren?.length) return null;
  const eerste = uren[0].uur;
  const n = uren.length;
  const pct = (uur) => ((uur - eerste) / n) * 100;

  const labels = [...new Set([eerste, venster?.van, venster?.tot, uren[n - 1].uur + 1].filter((x) => x != null))].sort(
    (a, b) => a - b
  );

  return (
    <div className="urenstrip-wrap">
      <div className="windstrip urenstrip" aria-hidden="true">
        {uren.map((u) => (
          <div
            key={u.uur}
            className={u.nat ? "uur-nat" : undefined}
            style={{
              width: `${100 / n}%`,
              background: kleurSequentieel((u.score ?? 0) / 100),
            }}
            title={`${String(u.uur).padStart(2, "0")}:00 \u00b7 ${u.nat ? "nat" : `score ${u.score}/100`}`}
          />
        ))}
        {venster && (
          <span
            className="venster-markering"
            style={{ left: `${pct(venster.van)}%`, width: `${((venster.tot - venster.van) / n) * 100}%` }}
          >
            <span className="venster-label">{vensterLabel}</span>
          </span>
        )}
      </div>
      <div className="strip-tijden" aria-hidden="true">
        {labels.map((uur) => (
          <span key={uur} style={{ left: `${pct(uur)}%` }}>
            {String(uur).padStart(2, "0")}
          </span>
        ))}
      </div>
      {legenda && <KleurLegenda soort="goedheid" links={legenda.links} rechts={legenda.rechts} />}
    </div>
  );
}
