"use client";

import { DEFAULT_THRESHOLDS } from "@/lib/advice";

const VELDEN = [
  { key: "tegenwindMatig", label: "Tegenwind merkbaar vanaf", eenheid: "km/u" },
  { key: "tegenwindZwaar", label: "Tegenwind zwaar vanaf", eenheid: "km/u" },
  { key: "neerslagKans", label: "Neerslagkans telt mee vanaf", eenheid: "%" },
  { key: "neerslagMm", label: "Neerslag zwaar vanaf", eenheid: "mm/u" },
  { key: "gevoelMin", label: "Te koud onder gevoels-", eenheid: "°C" },
  { key: "segmentLengte", label: "Segmentlengte", eenheid: "m" },
];

/** Modal met drempelinstellingen, favoriete plekken en opgeslagen routes. */
export default function SettingsPanel({
  open,
  onClose,
  thresholds,
  setThresholds,
  presets,
  onDeletePreset,
  routes,
  onDeleteRoute,
}) {
  if (!open) return null;
  return (
    <div className="modalachter" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Instellingen</h2>

        <h3>Drempels voor het cijfer</h3>
        {VELDEN.map((v) => (
          <div className="instelrij" key={v.key}>
            <label htmlFor={"inst-" + v.key}>
              {v.label} ({v.eenheid})
            </label>
            <input
              id={"inst-" + v.key}
              type="number"
              step={v.key === "neerslagMm" ? 0.1 : 1}
              value={thresholds[v.key]}
              onChange={(e) =>
                setThresholds({
                  ...thresholds,
                  [v.key]: Number(e.target.value),
                })
              }
            />
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button
            className="knop klein"
            onClick={() => setThresholds({ ...DEFAULT_THRESHOLDS })}
          >
            Terug naar standaard
          </button>
        </div>
        <p className="uitleg">
          Elke rit krijgt een rapportcijfer voor het fietsweer: 7 of hoger is een
          prima fietsdag, tussen 4 en 7 wordt het pittig, onder de 4 raden we
          fietsen af. Wind, regen, kou en windstoten drukken het cijfer.
        </p>

        <h3>Opgeslagen routes</h3>
        {(!routes || routes.length === 0) && (
          <p className="uitleg">
            Nog geen routes. Vul je woon-werkrit in en klik op Route opslaan; dan
            staat hij morgen met een klik klaar.
          </p>
        )}
        {(routes ?? []).map((r) => (
          <div className="presetrij" key={r.naam}>
            <div>
              <strong>{r.naam}</strong>
              <div className="adres">
                {r.stops.map((s) => s.naam.split(",")[0]).join(" → ")}
              </div>
            </div>
            <button className="knop klein" onClick={() => onDeleteRoute(r.naam)}>
              verwijder
            </button>
          </div>
        ))}

        <h3>Favoriete plekken</h3>
        {presets.length === 0 && (
          <p className="uitleg">
            Nog geen favorieten. Kies een locatie in de planner en klik op de ster
            om hem te bewaren.
          </p>
        )}
        {presets.map((p) => (
          <div className="presetrij" key={p.naam}>
            <div>
              <strong>{p.naam}</strong>
              <div className="adres">
                {p.lat.toFixed(4)}, {p.lon.toFixed(4)}
              </div>
            </div>
            <button className="knop klein" onClick={() => onDeletePreset(p.naam)}>
              verwijder
            </button>
          </div>
        ))}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <button className="knop primair" onClick={onClose}>
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
}
