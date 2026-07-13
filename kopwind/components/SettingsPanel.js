"use client";

import { kies } from "@/lib/i18n/locale";
import { S } from "@/lib/strings";

import { useState } from "react";
import { TOOLS, defaultsVoor } from "@/lib/tools";

/**
 * Instellingen per tool (P1-C): een toolkiezer bovenaan en daaronder
 * alleen de drempels die bij die tool horen, rechtstreeks uit het
 * register (tool.instellingen). Fietsdrempels op de wascheck en andersom
 * bestaan dus niet meer. Daaronder de gedeelde spullen: opgeslagen routes
 * en favoriete plekken.
 */
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
  const [actieveTool, setActieveTool] = useState(TOOLS[0].id);
  if (!open) return null;

  const tool = TOOLS.find((t) => t.id === actieveTool) ?? TOOLS[0];
  const meta = tool.instellingen;
  const waarden = { ...defaultsVoor(tool.id), ...(thresholds?.[tool.id] ?? {}) };

  return (
    <div className="modalachter" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{S.header.instellingen}</h2>

        <h3>{kies({ nl: "Drempels per check", en: "Thresholds per check" })}</h3>
        <div className="chips" role="tablist" aria-label={kies({ nl: "Kies een check", en: "Pick a check" })}>
          {TOOLS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={t.id === actieveTool}
              className={"chip" + (t.id === actieveTool ? " actief" : "")}
              onClick={() => setActieveTool(t.id)}
            >
              {t.meldingKort}
            </button>
          ))}
        </div>

        {meta?.velden
          ?.filter((v) => !v.geavanceerd)
          .map((v) =>
            v.type === "keuze" ? (
              <div className="instelrij keuzerij" key={v.id}>
                <span className="keuze-vraag">{v.vraag}</span>
                <div className="chips">
                  {v.keuzes.map((k) => {
                    const actief = Object.entries(k.zet).every(
                      ([key, w]) => waarden[key] === w
                    );
                    return (
                      <button
                        key={k.label}
                        className={"chip" + (actief ? " actief" : "")}
                        onClick={() => setThresholds(tool.id, { ...waarden, ...k.zet })}
                      >
                        {k.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <NummerRij key={v.key} tool={tool} v={v} waarden={waarden} setThresholds={setThresholds} />
            )
          )}
        {meta?.velden?.some((v) => v.geavanceerd) && (
          <details className="geavanceerd">
            <summary>{kies({ nl: "Geavanceerd", en: "Advanced" })}</summary>
            {meta.velden
              .filter((v) => v.geavanceerd)
              .map((v) => (
                <NummerRij key={v.key} tool={tool} v={v} waarden={waarden} setThresholds={setThresholds} />
              ))}
          </details>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button
            className="knop klein"
            onClick={() => setThresholds(tool.id, { ...defaultsVoor(tool.id) })}
          >
            {kies({ nl: "Terug naar standaard", en: "Back to defaults" })}
          </button>
        </div>
        {meta?.uitleg && <p className="uitleg">{meta.uitleg}</p>}

        {tool.inputType === "route" && (
          <>
        <h3>{kies({ nl: "Opgeslagen routes", en: "Saved routes" })}</h3>
        {(!routes || routes.length === 0) && (
          <p className="uitleg">
            {kies({
              nl: "Nog geen routes. Vul je woon-werkrit in en klik op Route opslaan; dan staat hij morgen met een klik klaar.",
              en: "No routes yet. Fill in your commute and click Save route; tomorrow it's one click away.",
            })}
          </p>
        )}
        {(routes ?? []).map((r) => (
          <div className="presetrij" key={r.naam}>
            <div>
              <strong>{r.naam}</strong>
              <div className="adres">
                {r.stops.map((s) => s.naam.split(",")[0]).join(" \u2192 ")}
              </div>
            </div>
            <button className="knop klein" onClick={() => onDeleteRoute(r.naam)}>
              verwijder
            </button>
          </div>
        ))}

          </>
        )}

        <h3>{kies({ nl: "Algemeen: favoriete plekken", en: "General: favourite places" })}</h3>
        {presets.length === 0 && (
          <p className="uitleg">
            {kies({
              nl: "Nog geen favorieten. Kies een locatie in een van de checks en klik op de ster om hem te bewaren.",
              en: "No favourites yet. Pick a location in one of the checks and click the star to save it.",
            })}
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
            {S.algemeen.sluiten}
          </button>
        </div>
      </div>
    </div>
  );
}

function NummerRij({ tool, v, waarden, setThresholds }) {
  return (
    <div className="instelrij">
      <label htmlFor={"inst-" + tool.id + "-" + v.key}>
        {v.label} ({v.eenheid})
      </label>
      <input
        id={"inst-" + tool.id + "-" + v.key}
        type="number"
        step={v.step ?? 1}
        min={v.min}
        max={v.max}
        value={waarden[v.key]}
        onChange={(e) =>
          setThresholds(tool.id, {
            ...waarden,
            [v.key]: Number(e.target.value),
          })
        }
      />
    </div>
  );
}
