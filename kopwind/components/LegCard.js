"use client";

import { bft, kompas, fmtKm, fmtDuur, fmtTijd } from "@/lib/format";

const BADGE_KLEUR = {
  "fiets prima": "groen",
  "fiets met tegenzin": "oranje",
  "pak de scooter": "rood",
};

/**
 * Kaart voor een etappe. De windstrip is de kern: elk routesegment als
 * blokje, breedte naar afstand, kleur naar kopwind. Zo zie je in een
 * oogopslag waar op de route je last hebt.
 */
export default function LegCard({ leg, index, actief, onClick }) {
  const a = leg.advies;
  const m = leg.metrics;
  const eersteWeer = leg.segments.find((s) => s.weer)?.weer;
  const totaal = leg.segments.length
    ? leg.segments[leg.segments.length - 1].cumEnd
    : 0;

  return (
    <button
      className={"legkaart" + (actief ? " actief" : "")}
      onClick={onClick}
      aria-pressed={actief}
    >
      <div className="legkop">
        <span className="route">
          {index + 1}. {leg.van.naam.split(",")[0]} → {leg.naar.naam.split(",")[0]}
        </span>
        <span className={"badge " + BADGE_KLEUR[a.advies]}>
          {a.advies} · {a.score}
        </span>
      </div>

      <div className="legmeta">
        {fmtTijd(leg.departure)} → {fmtTijd(leg.arrival)} · {fmtDuur(leg.duration)} ·{" "}
        {fmtKm(leg.distance)}
      </div>

      {eersteWeer && (
        <div className="legmeta">
          {Math.round(eersteWeer.temp)}° (voelt als {Math.round(eersteWeer.gevoel)}°) ·{" "}
          {Math.round(m.neerslagKansMax)}% neerslag
          {m.neerslagMmMax > 0
            ? ` (tot ${m.neerslagMmMax.toFixed(1).replace(".", ",")} mm/u)`
            : ""}{" "}
          · wind {bft(eersteWeer.windSpeed)} Bft uit {kompas(eersteWeer.windFrom)}
          {m.maxGust ? `, stoten ${Math.round(m.maxGust)} km/u` : ""}
        </div>
      )}

      <div className="windstrip" aria-hidden="true">
        {leg.segments.map((seg, i) => (
          <div
            key={i}
            style={{
              width: totaal ? `${(seg.distance / totaal) * 100}%` : 0,
              background: seg.kleur,
            }}
            title={`${fmtKm(seg.cumStart)} tot ${fmtKm(seg.cumEnd)}: ${
              seg.headwind >= 0
                ? Math.round(seg.headwind) + " km/u tegenwind"
                : Math.round(-seg.headwind) + " km/u rugwind"
            } rond ${fmtTijd(seg.passage)}`}
          />
        ))}
      </div>
      <div className="windstriplegenda">
        <span>start</span>
        <span>aankomst</span>
      </div>

      <p className="samenvatting">{leg.samenvatting}</p>
      {a.redenen.length > 0 && (
        <p className="redenen">Score: {a.redenen.join(", ")}.</p>
      )}
      {leg.warning && <p className="waarschuwing">{leg.warning}</p>}
    </button>
  );
}
