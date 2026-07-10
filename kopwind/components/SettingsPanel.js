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

/** Modal met drempelinstellingen (pijnscore) en presetbeheer. */
export default function SettingsPanel({
  open,
  onClose,
  thresholds,
  setThresholds,
  presets,
  onDeletePreset,
}) {
  if (!open) return null;
  return (
    <div className="modalachter" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Instellingen</h2>

        <h3>Drempels voor de pijnscore</h3>
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
          Advies op basis van de score: 0 tot 29 fiets prima, 30 tot 59 fiets met
          tegenzin, 60 plus pak de scooter.
        </p>

        <h3>Opgeslagen locaties</h3>
        {presets.length === 0 && (
          <p className="uitleg">
            Nog geen presets. Kies een locatie in de planner en klik op ★ om hem te
            bewaren.
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
