"use client";

import { kies } from "@/lib/i18n/locale";

import LocatieZoek from "./LocatieZoek";
import Icoon from "./Icoon";
import { isFavoriet } from "@/lib/engine/locatie";

/**
 * Editor voor de keten van stops (bv. Thuis, Werk, en eventueel een
 * tussenstop). Per stop drie invoerwegen: favoriete plekken als chips,
 * huidige locatie (geolocation) en adres-autocomplete. Tussen twee stops
 * staat een tijdregel voor de rit; de eerste rit kan ook "nu" vertrekken.
 *
 * Een plek die al favoriet is krijgt een gevulde gouden ster, zodat je in
 * een oogopslag ziet wat er al opgeslagen is.
 */
export default function StopsEditor({
  stops,
  setStops,
  legOptions,
  setLegOptions,
  presets,
  onSavePreset,
}) {
  const updateStop = (i, stop) => {
    const next = stops.slice();
    next[i] = stop;
    setStops(next);
  };

  const removeStop = (i) => {
    setStops(stops.filter((_, j) => j !== i));
    setLegOptions(legOptions.filter((_, j) => j !== Math.max(0, i - 1)));
  };

  const addStop = () => {
    setStops([...stops, null]);
    setLegOptions([...legOptions, { mode: "auto", verblijfMin: 45 }]);
  };

  const updateLeg = (i, patch) => {
    const next = legOptions.slice();
    next[i] = { ...next[i], ...patch };
    setLegOptions(next);
  };

  return (
    <div>
      {stops.map((stop, i) => (
        <div key={i}>
          {i > 0 && (
            <LegTimeRow
              index={i - 1}
              opties={legOptions[i - 1] ?? { mode: "auto", verblijfMin: 45 }}
              onChange={(patch) => updateLeg(i - 1, patch)}
            />
          )}
          <StopRow
            index={i}
            stop={stop}
            presets={presets}
            onChange={(s) => updateStop(i, s)}
            onRemove={stops.length > 2 ? () => removeStop(i) : null}
            onSavePreset={onSavePreset}
          />
        </div>
      ))}
      <button className="knop klein" onClick={addStop} style={{ marginTop: 8 }}>
        + Tussenstop toevoegen
      </button>
    </div>
  );
}

function StopRow({ index, stop, presets, onChange, onRemove, onSavePreset }) {
  const favoriet = isFavoriet(stop, presets);
  return (
    <div className="stoprij">
      <div className="stopnummer">{index + 1}</div>
      <div className="stopinhoud">
        {presets.length > 0 && (
          <div className="chips">
            {presets.map((p) => (
              <button
                key={p.naam}
                className={
                  "chip" + (stop && stop.naam === p.naam ? " actief" : "")
                }
                onClick={() => onChange({ ...p })}
                title={`${p.lat.toFixed(4)}, ${p.lon.toFixed(4)}`}
              >
                {p.naam}
              </button>
            ))}
          </div>
        )}
        {stop ? (
          <div className="stopgekozen">
            <span className="adres" title={stop.naam}>
              {stop.naam}
            </span>
            <button
              className="knop klein"
              onClick={() => onChange(null)}
              title="Andere locatie kiezen"
            >
              wijzig
            </button>
          </div>
        ) : (
          <LocatieZoek onKies={onChange} placeholder={kies({ nl: "Zoek een adres (bv. je werk)...", en: "Search an address (e.g. your work)..." })} />
        )}
      </div>
      {stop && (
        <button
          className={"iconknop ster" + (favoriet ? " goud" : "")}
          title={
            favoriet
              ? "Al opgeslagen als favoriet"
              : "Bewaar als favoriete plek"
          }
          aria-label={
            favoriet
              ? "Al opgeslagen als favoriet"
              : "Bewaar als favoriete plek"
          }
          onClick={() => {
            if (favoriet) return;
            const naam = window.prompt(
              "Naam voor deze plek (bv. Thuis, Werk):",
              stop.naam.split(",")[0]
            );
            if (naam) onSavePreset({ ...stop, naam: naam.trim() });
          }}
        >
          <Icoon naam="ster" vol={favoriet} maat={17} />
        </button>
      )}
      {onRemove && (
        <button className="iconknop" title="Stop verwijderen" onClick={onRemove}>
          <Icoon naam="kruis" maat={15} />
        </button>
      )}
    </div>
  );
}

function LegTimeRow({ index, opties, onChange }) {
  const eerste = index === 0;
  return (
    <div className="tijdrij">
      <span>Rit {index + 1}:</span>
      <select
        value={eerste && opties.mode === "auto" ? "nu" : opties.mode}
        onChange={(e) => onChange({ mode: e.target.value })}
        aria-label={kies({ nl: "Tijdmodus", en: "Time mode" })}
      >
        {eerste ? (
          <option value="nu">{kies({ nl: "vertrekken nu", en: "leave now" })}</option>
        ) : (
          <option value="auto">{kies({ nl: "na vorige stop", en: "after previous stop" })}</option>
        )}
        <option value="vertrek">{kies({ nl: "vertrek om", en: "leave at" })}</option>
        <option value="aankomst">{kies({ nl: "aankomst om", en: "arrive at" })}</option>
      </select>
      {opties.mode === "auto" && !eerste && (
        <>
          <input
            type="number"
            min="0"
            step="5"
            value={opties.verblijfMin ?? 45}
            onChange={(e) => onChange({ verblijfMin: Number(e.target.value) })}
            aria-label={kies({ nl: "Verblijf in minuten", en: "Stay in minutes" })}
          />
          <span>{kies({ nl: "min verblijf", en: "min stay" })}</span>
        </>
      )}
      {(opties.mode === "vertrek" || opties.mode === "aankomst") && (
        <input
          type="datetime-local"
          value={opties.tijd ?? ""}
          onChange={(e) => onChange({ tijd: e.target.value })}
          aria-label={kies({ nl: "Tijdstip", en: "Time" })}
        />
      )}
    </div>
  );
}
