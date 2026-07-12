"use client";

import { kleurSequentieel } from "@/lib/engine/kleuren";

/**
 * De signature-vormtaal van de hub, toegepast op uren: een horizontale
 * strip van 08:00 tot 20:00 waarin elk blokje de droogkracht (of een
 * andere goedheid 0..100) van dat uur kleurt. Zelfde ramp als de windstrip.
 */
export default function UrenStrip({ uren, venster }) {
  if (!uren?.length) return null;
  return (
    <div>
      <div className="windstrip urenstrip" aria-hidden="true">
        {uren.map((u) => (
          <div
            key={u.uur}
            style={{
              width: `${100 / uren.length}%`,
              background: kleurSequentieel(u.kracht / 100),
              opacity: venster && (u.uur < venster.van || u.uur >= venster.tot) ? 0.45 : 1,
            }}
            title={`${String(u.uur).padStart(2, "0")}:00 \u00b7 droogkracht ${u.kracht}/100`}
          />
        ))}
      </div>
      <div className="windstriplegenda">
        <span>{String(uren[0].uur).padStart(2, "0")}:00</span>
        <span>{String(uren[uren.length - 1].uur + 1).padStart(2, "0")}:00</span>
      </div>
    </div>
  );
}
