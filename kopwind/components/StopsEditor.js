"use client";

import { useEffect, useRef, useState } from "react";

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

function isFavoriet(stop, presets) {
  if (!stop) return false;
  return presets.some(
    (p) =>
      p.naam === stop.naam ||
      (Math.abs(p.lat - stop.lat) < 1e-4 && Math.abs(p.lon - stop.lon) < 1e-4)
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
          <ZoekVeld onKies={onChange} />
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
          {favoriet ? "★" : "☆"}
        </button>
      )}
      {onRemove && (
        <button className="iconknop" title="Stop verwijderen" onClick={onRemove}>
          ✕
        </button>
      )}
    </div>
  );
}

function ZoekVeld({ onKies }) {
  const [tekst, setTekst] = useState("");
  const [suggesties, setSuggesties] = useState([]);
  const [bezig, setBezig] = useState(false);
  const timer = useRef(null);
  const laatste = useRef("");

  useEffect(() => {
    return () => clearTimeout(timer.current);
  }, []);

  const zoek = (q) => {
    setTekst(q);
    clearTimeout(timer.current);
    if (q.trim().length < 3) {
      setSuggesties([]);
      return;
    }
    timer.current = setTimeout(async () => {
      laatste.current = q;
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (laatste.current === q) setSuggesties(data.results ?? []);
      } catch {
        setSuggesties([]);
      }
    }, 300);
  };

  const huidigeLocatie = () => {
    if (!navigator.geolocation) {
      window.alert("Geolocatie wordt niet ondersteund door deze browser.");
      return;
    }
    setBezig(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        let naam = `Huidige locatie (${lat.toFixed(4)}, ${lon.toFixed(4)})`;
        try {
          const res = await fetch(`/api/geocode?lat=${lat}&lon=${lon}`);
          const data = await res.json();
          if (data.results?.[0]?.naam) naam = data.results[0].naam;
        } catch {
          // Reverse geocoding is nice-to-have; coordinaten volstaan.
        }
        setBezig(false);
        onKies({ naam, lat, lon });
      },
      () => {
        setBezig(false);
        window.alert("Kon je locatie niet bepalen. Geef de browser toestemming.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="zoekwrap">
      <input
        type="text"
        placeholder="Zoek een adres (bv. je werk)..."
        value={tekst}
        onChange={(e) => zoek(e.target.value)}
        aria-label="Adres zoeken"
      />
      <button
        className="iconknop"
        title="Huidige locatie gebruiken"
        onClick={huidigeLocatie}
        disabled={bezig}
      >
        {bezig ? "…" : "📍"}
      </button>
      {suggesties.length > 0 && (
        <div className="suggesties">
          {suggesties.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setSuggesties([]);
                setTekst("");
                onKies(s);
              }}
            >
              {s.naam}
            </button>
          ))}
        </div>
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
        aria-label="Tijdmodus"
      >
        {eerste ? (
          <option value="nu">vertrekken nu</option>
        ) : (
          <option value="auto">na vorige stop</option>
        )}
        <option value="vertrek">vertrek om</option>
        <option value="aankomst">aankomst om</option>
      </select>
      {opties.mode === "auto" && !eerste && (
        <>
          <input
            type="number"
            min="0"
            step="5"
            value={opties.verblijfMin ?? 45}
            onChange={(e) => onChange({ verblijfMin: Number(e.target.value) })}
            aria-label="Verblijf in minuten"
          />
          <span>min verblijf</span>
        </>
      )}
      {(opties.mode === "vertrek" || opties.mode === "aankomst") && (
        <input
          type="datetime-local"
          value={opties.tijd ?? ""}
          onChange={(e) => onChange({ tijd: e.target.value })}
          aria-label="Tijdstip"
        />
      )}
    </div>
  );
}
