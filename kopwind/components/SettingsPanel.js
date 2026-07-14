"use client";

import { useState } from "react";
import { kies } from "@/lib/i18n/locale";
import { S } from "@/lib/strings";
import { TOOLS, defaultsVoor } from "@/lib/tools";
import Icoon from "./Icoon";

/**
 * Instellingen (v3.7.0 "Etesian"): drie heldere secties met eigen kop en
 * uitleg, zodat een leek meteen snapt wat waar hoort.
 *
 * 1. Stel de checks op jou af: een toolkiezer, daaronder de keuzes van
 *    die tool (duidelijk gescheiden van de toolkiezer zelf).
 * 2. Mijn plekken: favorieten en routes, met verwijderen.
 * 3. Meenemen naar je andere apparaten: de koppelcode voor sync.
 *
 * Tools met een eigen component (nowcast-checks) hebben geen instelbare
 * drempels en verschijnen niet in de toolkiezer.
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
  syncCode,
  onMaakSyncCode,
  onKoppelSyncCode,
  onOntkoppel,
}) {
  const instelbareTools = TOOLS.filter((t) => t.instellingen?.velden?.length);
  const [actieveTool, setActieveTool] = useState(instelbareTools[0]?.id);
  const [codeInvoer, setCodeInvoer] = useState("");
  const [syncFout, setSyncFout] = useState(null);
  const [syncBezig, setSyncBezig] = useState(false);
  const [gekopieerd, setGekopieerd] = useState(false);

  if (!open) return null;

  const tool = instelbareTools.find((t) => t.id === actieveTool) ?? instelbareTools[0];
  const meta = tool?.instellingen;
  const waarden = tool ? { ...defaultsVoor(tool.id), ...(thresholds?.[tool.id] ?? {}) } : {};

  const maakCode = async () => {
    setSyncBezig(true);
    setSyncFout(null);
    const fout = await onMaakSyncCode();
    if (fout) setSyncFout(fout);
    setSyncBezig(false);
  };

  const koppel = async () => {
    if (!codeInvoer.trim()) return;
    setSyncBezig(true);
    setSyncFout(null);
    const fout = await onKoppelSyncCode(codeInvoer.trim().toUpperCase());
    if (fout) setSyncFout(fout);
    else setCodeInvoer("");
    setSyncBezig(false);
  };

  const kopieer = async () => {
    try {
      await navigator.clipboard.writeText(syncCode);
      setGekopieerd(true);
      setTimeout(() => setGekopieerd(false), 2000);
    } catch {
      // klembord dicht: stil laten
    }
  };

  return (
    <div className="modalachter" onClick={onClose}>
      <div className="modal modal-instellingen" onClick={(e) => e.stopPropagation()}>
        <div className="modal-kop">
          <h2>{S.header.instellingen}</h2>
          <button className="iconknop" onClick={onClose} aria-label={S.algemeen.sluiten}>
            <Icoon naam="menu_dicht" maat={18} />
          </button>
        </div>

        {/* 1. Persoonlijke drempels per check */}
        {tool && (
          <section className="instel-sectie">
            <h3>{S.instellingen.persoonlijkKop}</h3>
            <p className="uitleg">{S.instellingen.persoonlijkUitleg}</p>

            <div className="instel-veld">
              <span className="instel-label">{S.instellingen.kiesCheck}</span>
              <div className="chips" role="tablist">
                {instelbareTools.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={t.id === actieveTool}
                    className={"chip" + (t.id === actieveTool ? " actief" : "")}
                    onClick={() => setActieveTool(t.id)}
                  >
                    {t.meldingKort ?? t.navLabel}
                  </button>
                ))}
              </div>
            </div>

            <div className="instel-keuzes">
              {meta?.velden
                ?.filter((v) => !v.geavanceerd)
                .map((v) =>
                  v.type === "keuze" ? (
                    <div className="instel-veld" key={v.id}>
                      <span className="instel-label">{v.vraag}</span>
                      <div className="chips">
                        {v.keuzes.map((k) => {
                          const actief = Object.entries(k.zet).every(([key, w]) => waarden[key] === w);
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
            </div>

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

            <button className="knop klein" onClick={() => setThresholds(tool.id, { ...defaultsVoor(tool.id) })}>
              {S.instellingen.terugStandaard}
            </button>
            {meta?.uitleg && <p className="uitleg klein">{meta.uitleg}</p>}
          </section>
        )}

        {/* 2. Mijn plekken */}
        <section className="instel-sectie">
          <h3>{S.instellingen.plekkenKop}</h3>

          <h4 className="instel-subkop">{S.instellingen.favorieten}</h4>
          {presets.length === 0 ? (
            <p className="uitleg">{S.instellingen.favorietenLeeg}</p>
          ) : (
            presets.map((p) => (
              <div className="presetrij" key={p.naam}>
                <div>
                  <strong>{p.naam}</strong>
                  <div className="adres">
                    {p.lat.toFixed(4)}, {p.lon.toFixed(4)}
                  </div>
                </div>
                <button className="knop klein" onClick={() => onDeletePreset(p.naam)}>
                  {S.instellingen.verwijder}
                </button>
              </div>
            ))
          )}

          <h4 className="instel-subkop">{S.instellingen.routes}</h4>
          {(!routes || routes.length === 0) ? (
            <p className="uitleg">{S.instellingen.routesLeeg}</p>
          ) : (
            routes.map((r) => (
              <div className="presetrij" key={r.naam}>
                <div>
                  <strong>{r.naam}</strong>
                  <div className="adres">{r.stops.map((s) => s.naam.split(",")[0]).join(" \u2192 ")}</div>
                </div>
                <button className="knop klein" onClick={() => onDeleteRoute(r.naam)}>
                  {S.instellingen.verwijder}
                </button>
              </div>
            ))
          )}
        </section>

        {/* 3. Synchroniseren tussen apparaten */}
        <section className="instel-sectie">
          <h3>{S.instellingen.syncKop}</h3>
          <p className="uitleg">{S.instellingen.syncUitleg}</p>

          {syncCode ? (
            <div className="sync-actief">
              <p className="uitleg">{S.instellingen.syncActief}</p>
              <div className="sync-code-rij">
                <code className="sync-code">{syncCode}</code>
                <button className="knop klein" onClick={kopieer}>
                  {gekopieerd ? S.instellingen.syncGekopieerd : S.instellingen.syncKopieer}
                </button>
                <button className="knop klein" onClick={onOntkoppel}>
                  {S.instellingen.syncOntkoppel}
                </button>
              </div>
            </div>
          ) : (
            <div className="sync-start">
              <button className="knop primair" onClick={maakCode} disabled={syncBezig}>
                {syncBezig ? S.instellingen.syncBezig : S.instellingen.syncMaak}
              </button>
              <span className="sync-of">{S.instellingen.syncOfVul}</span>
              <div className="sync-invoer-rij">
                <input
                  type="text"
                  value={codeInvoer}
                  onChange={(e) => setCodeInvoer(e.target.value)}
                  placeholder={S.instellingen.syncPlaceholder}
                  className="sync-invoer"
                  autoCapitalize="characters"
                />
                <button className="knop klein" onClick={koppel} disabled={syncBezig || !codeInvoer.trim()}>
                  {S.instellingen.syncKoppel}
                </button>
              </div>
            </div>
          )}
          {syncFout && <p className="fout">{syncFout}</p>}
        </section>

        <div className="modal-voet">
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
        onChange={(e) => setThresholds(tool.id, { ...waarden, [v.key]: Number(e.target.value) })}
      />
    </div>
  );
}
