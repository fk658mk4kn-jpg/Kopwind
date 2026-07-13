"use client";

import { bft, kompas, fmtKm, fmtDuur, fmtTijd, fmtCijfer } from "@/lib/format";

const BADGE_KLEUR = {
  "prima fietsdag": "groen",
  "pittige rit": "oranje",
  "liever niet fietsen": "rood",
};

/**
 * Kaart voor een etappe. De windstrip is de kern: elk routesegment als
 * blokje, breedte naar afstand, kleur naar kopwind. Zo zie je in een
 * oogopslag waar op de route je last hebt. Bij meerdere routes staan er
 * chips om te wisselen; de route met de minste wind wordt gemarkeerd.
 *
 * De kaart is een klikbaar blok (geen button, want er zitten knoppen in).
 */
export default function LegCard({ leg, index, actief, onClick, onKiesRoute }) {
  const a = leg.advies;
  const m = leg.metrics;
  const eersteWeer = leg.segments.find((s) => s.weer)?.weer;
  const totaal = leg.segments.length
    ? leg.segments[leg.segments.length - 1].cumEnd
    : 0;

  const alts = leg.alternatieven ?? [];
  const heeftAlts = alts.length > 1;
  let snelsteIdx = 0;
  let besteWindIdx = 0;
  alts.forEach((alt, j) => {
    if (alt.duration < alts[snelsteIdx].duration) snelsteIdx = j;
    if (alt.advies.score < alts[besteWindIdx].advies.score) besteWindIdx = j;
  });

  const downwind = eersteWeer && eersteWeer.windFrom != null
    ? (eersteWeer.windFrom + 180) % 360
    : null;

  const optoets = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={"legkaart" + (actief ? " actief" : "")}
      onClick={onClick}
      onKeyDown={optoets}
      role="button"
      tabIndex={0}
      aria-pressed={actief}
    >
      <div className="legkop">
        <span className="route">
          {index + 1}. {leg.van.naam.split(",")[0]} → {leg.naar.naam.split(",")[0]}
        </span>
        <span className={"badge " + BADGE_KLEUR[a.advies]}>
          {a.advies} · {schaalVoor(a.score).label}
        </span>
      </div>

      <div className="legmeta">
        {fmtTijd(leg.departure)} → {fmtTijd(leg.arrival)} · {fmtDuur(leg.duration)} ·{" "}
        {fmtKm(leg.distance)}
      </div>

      {eersteWeer && (
        <div className="legmeta weerregel">
          {Math.round(eersteWeer.temp)}° (voelt als {Math.round(eersteWeer.gevoel)}°) ·{" "}
          {Math.round(m.neerslagKansMax)}% neerslag
          {m.neerslagMmMax > 0
            ? ` (tot ${m.neerslagMmMax.toFixed(1).replace(".", ",")} mm/u)`
            : ""}{" "}
          · wind {bft(eersteWeer.windSpeed)} Bft uit {kompas(eersteWeer.windFrom)}
          {downwind != null && (
            <span
              className="windpijl-glyph"
              style={{ transform: `rotate(${downwind}deg)` }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" width="14" height="14">
                <path
                  d="M12 3 L12 21 M12 3 L7.5 9 M12 3 L16.5 9"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
          {m.maxGust ? `, stoten ${Math.round(m.maxGust)} km/u` : ""}
        </div>
      )}

      {heeftAlts && (
        <div className="routekeuze" onClick={(e) => e.stopPropagation()}>
          <span className="routekeuze-label">Route:</span>
          {alts.map((alt, j) => {
            const dmin = Math.round((alt.duration - alts[snelsteIdx].duration) / 60);
            const rol = j === snelsteIdx ? "Snelste" : "Alternatief";
            const dtxt = j === snelsteIdx ? "" : ` · ${dmin >= 0 ? "+" : ""}${dmin} min`;
            const minsteWind = j === besteWindIdx && besteWindIdx !== snelsteIdx;
            return (
              <button
                key={j}
                className={"routechip" + (j === leg.gekozenIndex ? " actief" : "")}
                onClick={() => onKiesRoute(index, alt.index)}
                title={`${schaalVoor(alt.advies.score).label}, ${fmtKm(alt.distance)}`}
              >
                {rol} · {schaalVoor(alt.advies.score).label}
                {dtxt}
                {minsteWind && <span className="minstewind"> minste wind</span>}
              </button>
            );
          })}
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
      <KleurLegenda soort="wind" links="rugwind" rechts="tegenwind" />

      <p className="samenvatting">{leg.samenvatting}</p>
      {a.redenen.length > 0 && (
        <p className="redenen">Cijfer gedrukt door: {a.redenen.join(", ")}.</p>
      )}
      {leg.warning && <p className="waarschuwing">{leg.warning}</p>}
    </div>
  );
}
