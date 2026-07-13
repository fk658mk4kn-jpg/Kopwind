"use client";

import { useEffect, useState } from "react";
import {
  migreerRouteSchema,
  DEFAULT_TOOL_SCHEMA,
  schemaZin,
} from "@/lib/engine/meldingen";
import { S } from "@/lib/strings/nl";
import { TOOLS } from "@/lib/tools";
import {
  pushOndersteund,
  draaitStandalone,
  isIos,
  abonneer,
  zegOp,
  isGeabonneerd,
} from "@/lib/push-client";
import { useGebruiker } from "./GebruikerContext";

/**
 * Meldingen en apparaten, granulair (§8):
 * 1. Apparaten koppelen met een synccode.
 * 2. Dit apparaat aanmelden voor push (iPhone: eerst op het beginscherm).
 * 3. Per opgeslagen route: dagen, tijden, typen en drempel als klikbare
 *    instellingen, met een mensentaal-zin eronder.
 * 4. Per locatie-tool (zoals de wascheck): hetzelfde, met een locatie.
 */
export default function MeldingenPanel({ open, onClose }) {
  const g = useGebruiker();
  const [invoer, setInvoer] = useState("");
  const [bezig, setBezig] = useState(false);
  const [status, setStatus] = useState(null);
  const [abo, setAbo] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStatus(null);
    setInvoer("");
    isGeabonneerd().then(setAbo);
  }, [open]);

  if (!open || !g) return null;

  const ios = isIos();
  const standalone = draaitStandalone();
  const ondersteund = pushOndersteund();
  const locatieTools = TOOLS.filter((t) => t.inputType === "locatie");

  const maakCode = async () => {
    setBezig(true);
    setStatus(null);
    const fout = await g.maakSyncCode();
    if (fout) setStatus(fout);
    setBezig(false);
  };

  const koppel = async () => {
    if (!invoer.trim()) return;
    setBezig(true);
    setStatus(null);
    const fout = await g.koppelSyncCode(invoer.trim().toUpperCase());
    setStatus(fout ?? "Gekoppeld. Je routes en instellingen zijn overgenomen.");
    setBezig(false);
  };

  const zetPushAan = async () => {
    setBezig(true);
    setStatus(null);
    const r = await abonneer(g.syncCode);
    if (r.ok) {
      setAbo(true);
      setStatus("Dit apparaat ontvangt nu meldingen.");
    } else {
      setStatus(r.fout);
    }
    setBezig(false);
  };

  const zetPushUit = async () => {
    setBezig(true);
    await zegOp(g.syncCode);
    setAbo(false);
    setStatus("Meldingen op dit apparaat uitgezet.");
    setBezig(false);
  };

  const testMelding = async () => {
    setBezig(true);
    setStatus(null);
    try {
      const res = await fetch("/api/push/testmelding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: g.syncCode }),
      });
      const d = await res.json();
      setStatus(
        res.ok
          ? `Testmelding verstuurd naar ${d.apparaten} apparaat/apparaten.`
          : d.error ?? "Testmelding mislukt."
      );
    } catch {
      setStatus("Testmelding mislukt.");
    }
    setBezig(false);
  };

  return (
    <div className="modalachter" onClick={onClose}>
      <div className="modal modal-breed" onClick={(e) => e.stopPropagation()}>
        <h2>Meldingen en apparaten</h2>

        <h3>Op je beginscherm</h3>
        {g.geinstalleerd || standalone ? (
          <p className="uitleg">
            Deze check staat als app op dit apparaat. Meldingen en snelle
            toegang werken hiervandaan het best.
          </p>
        ) : g.installBeschikbaar ? (
          <div className="synccode-rij">
            <button className="knop primair" onClick={g.zetOpBeginscherm}>
              Zet op beginscherm
            </button>
            <span className="uitleg" style={{ margin: 0 }}>
              Een tik en de check staat als app tussen je andere apps.
            </span>
          </div>
        ) : ios ? (
          <p className="uitleg">
            Op iPhone en iPad: tik op de deelknop en kies {"\u201c"}Zet op
            beginscherm{"\u201d"}. Daarna opent de check als app en kun je
            hieronder meldingen aanzetten (iOS 16.4 of nieuwer).
          </p>
        ) : (
          <p className="uitleg">
            In Chrome of Edge: open het browsermenu en kies {"\u201c"}App
            installeren{"\u201d"} of {"\u201c"}Toevoegen aan startscherm{"\u201d"}.
            In Firefox en Safari op desktop werkt de check gewoon in de
            browser, inclusief meldingen.
          </p>
        )}

        <p className="uitleg" style={{ marginTop: 0 }}>
          Zet een seintje aan als je op tijd wilt weten of fietsen, wassen of
          terrassen slim is. Twee stappen:
        </p>
        <h3>1. Apparaten koppelen</h3>
        {g.syncCode ? (
          <>
            <p className="uitleg" style={{ marginTop: 0 }}>
              Jouw synccode. Voer hem in op je andere apparaat, dan zien laptop
              en telefoon dezelfde routes, favorieten en meldingen.
            </p>
            <div className="synccode-rij">
              <code className="synccode">{g.syncCode}</code>
              <button
                className="knop klein"
                onClick={() => {
                  navigator.clipboard?.writeText(g.syncCode);
                  setStatus("Code gekopieerd.");
                }}
              >
                Kopieer
              </button>
              <button className="knop klein" onClick={g.ontkoppel}>
                Ontkoppel
              </button>
            </div>
            <p className="uitleg">
              Bewaar 'm ergens veilig. We werken zonder account, dus deze code
              kunnen we niet voor je terughalen.
            </p>
          </>
        ) : (
          <>
            <p className="uitleg" style={{ marginTop: 0 }}>
              Gebruik je dit ook op je telefoon of een ander apparaat? Maak dan
              je persoonlijke code aan, of vul de code van je andere apparaat
              in. Geen account of e-mail nodig.
            </p>
            <div className="synccode-rij">
              <button className="knop primair" onClick={maakCode} disabled={bezig}>
                Maak synccode
              </button>
            </div>
            <div className="synccode-rij">
              <input
                type="text"
                placeholder="Bestaande code, bv. K7QX-2MP9"
                value={invoer}
                onChange={(e) => setInvoer(e.target.value)}
                aria-label="Synccode invoeren"
              />
              <button className="knop" onClick={koppel} disabled={bezig || !invoer.trim()}>
                Koppel
              </button>
            </div>
          </>
        )}

        <h3>2. Meldingen op dit apparaat</h3>
        {!g.syncCode && <p className="uitleg">Koppel eerst je apparaten (stap 1).</p>}
        {g.syncCode && ios && !standalone && (
          <p className="uitleg">
            Op iPhone en iPad: zet de site eerst op je beginscherm (deelknop,
            dan {"\u201c"}Zet op beginscherm{"\u201d"}) en open de app daarvandaan. Daarna kun
            je hier meldingen aanzetten. Werkt vanaf iOS 16.4.
          </p>
        )}
        {g.syncCode && !ondersteund && !ios && (
          <p className="uitleg">
            Deze browser ondersteunt geen webpush. Probeer Chrome, Edge of
            Firefox, of Safari op iPhone via het beginscherm.
          </p>
        )}
        {g.syncCode && ondersteund && (!ios || standalone) && (
          <div className="synccode-rij">
            {abo ? (
              <>
                <button className="knop" onClick={zetPushUit} disabled={bezig}>
                  Meldingen op dit apparaat uitzetten
                </button>
                <button className="knop" onClick={testMelding} disabled={bezig}>
                  Stuur testmelding
                </button>
              </>
            ) : (
              <button className="knop primair" onClick={zetPushAan} disabled={bezig}>
                Zet meldingen aan op dit apparaat
              </button>
            )}
          </div>
        )}

        <h3>3. Meldingen per route</h3>
        {g.routes.length === 0 && (
          <p className="uitleg">
            Nog geen opgeslagen routes. Sla in de fietscheck je woon-werkrit op;
            daarna stel je hier per route in wanneer je een melding wilt.
          </p>
        )}
        {g.routes.map((r) => (
          <RouteSchema
            key={r.naam}
            route={r}
            onWijzig={(schema) => g.wijzigRouteMeldingen(r.naam, schema)}
          />
        ))}

        {locatieTools.map((tool) => (
          <ToolSchema
            key={tool.id}
            tool={tool}
            presets={g.presets}
            schema={g.toolMeldingen[tool.id]}
            onWijzig={(schema) => g.wijzigToolMeldingen(tool.id, schema)}
          />
        ))}

        <p className="uitleg">
          De klok kijkt elke 5 minuten, dus een melding kan een paar minuten
          verschuiven. Vertrekherinneringen gelden voor ritten met een vaste
          vertrek- of aankomsttijd (niet bij vertrekken nu).
        </p>

        {status && <p className="uitleg synstatus">{status}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <button className="knop primair" onClick={onClose}>
            {S.algemeen.sluiten}
          </button>
        </div>
      </div>
    </div>
  );
}

function DagenChips({ dagen, onWijzig }) {
  const toggle = (d) => {
    const set = new Set(dagen ?? []);
    if (set.has(d)) set.delete(d);
    else set.add(d);
    onWijzig([...set].sort((a, b) => a - b));
  };
  return (
    <div className="chips dagchips" role="group" aria-label="Dagen">
      {S.meldingen.dagen.map((naam, i) => (
        <button
          key={naam}
          type="button"
          className={"chip" + ((dagen ?? []).includes(i + 1) ? " actief" : "")}
          onClick={() => toggle(i + 1)}
        >
          {naam}
        </button>
      ))}
    </div>
  );
}

function TijdenLijst({ tijden, onWijzig }) {
  const lijst = tijden?.length ? tijden : ["07:00"];
  return (
    <span className="instelgroep">
      {lijst.map((t, i) => (
        <span key={i} className="tijdchip">
          <input
            type="time"
            value={t}
            onChange={(e) => {
              const next = lijst.slice();
              next[i] = e.target.value;
              onWijzig(next);
            }}
            aria-label={`Tijd ${i + 1}`}
          />
          {lijst.length > 1 && (
            <button
              type="button"
              className="knop klein"
              onClick={() => onWijzig(lijst.filter((_, j) => j !== i))}
              aria-label="Tijd verwijderen"
            >
              &times;
            </button>
          )}
        </span>
      ))}
      {lijst.length < 3 && (
        <button
          type="button"
          className="knop klein"
          onClick={() => onWijzig([...lijst, "17:00"])}
        >
          {S.meldingen.tijdToevoegen}
        </button>
      )}
    </span>
  );
}

function DrempelKeuze({ drempel, richtingGoed, onWijzig }) {
  const d = drempel ?? { modus: "altijd", cijfer: richtingGoed ? 7 : 6.5 };
  return (
    <span className="instelgroep">
      <select
        value={d.modus}
        onChange={(e) => onWijzig({ ...d, modus: e.target.value })}
        aria-label="Wanneer melden"
      >
        <option value="altijd">{S.meldingen.drempelAltijd}</option>
        <option value="slecht">{S.meldingen.drempelSlecht}</option>
        <option value="goed">{S.meldingen.drempelGoed}</option>
      </select>
      {d.modus !== "altijd" && (
        <select
          value={String(d.cijfer)}
          onChange={(e) => onWijzig({ ...d, cijfer: Number(e.target.value) })}
          aria-label="Grens"
        >
          {(richtingGoed
            ? [
                ["8.8", "alleen bij Ideaal"],
                ["7", "bij Goed of beter"],
                ["5.5", "bij Twijfelachtig of beter"],
              ]
            : [
                ["5.4", "bij Matig of slechter"],
                ["3.8", "alleen bij Zeer slecht"],
              ]
          ).map(([w, label]) => (
            <option key={w} value={w}>
              {label}
            </option>
          ))}
          {![8.8, 7, 5.5, 5.4, 3.8].includes(d.cijfer) && (
            <option value={String(d.cijfer)}>eigen grens</option>
          )}
        </select>
      )}
    </span>
  );
}

function RouteSchema({ route, onWijzig }) {
  const s = migreerRouteSchema(route.meldingen);
  const patch = (p) => onWijzig({ ...s, ...p });
  return (
    <div className="routemeldingen">
      <strong>{route.naam}</strong>
      <DagenChips dagen={s.dagen} onWijzig={(dagen) => patch({ dagen })} />
      <div className="instelrij">
        <label>
          <input
            type="checkbox"
            checked={s.briefing.aan}
            onChange={(e) => patch({ briefing: { ...s.briefing, aan: e.target.checked } })}
          />{" "}
          {S.meldingen.briefing}
        </label>
        {s.briefing.aan && (
          <TijdenLijst
            tijden={s.briefing.tijden}
            onWijzig={(tijden) => patch({ briefing: { ...s.briefing, tijden } })}
          />
        )}
      </div>
      <div className="instelrij">
        <label>
          <input
            type="checkbox"
            checked={s.vertrek.aan}
            onChange={(e) => patch({ vertrek: { ...s.vertrek, aan: e.target.checked } })}
          />{" "}
          {S.meldingen.vertrek}
        </label>
        {s.vertrek.aan && (
          <span className="instelgroep">
            <input
              type="number"
              min="5"
              step="5"
              value={s.vertrek.minuten}
              onChange={(e) =>
                patch({ vertrek: { ...s.vertrek, minuten: Number(e.target.value) } })
              }
              aria-label="Minuten voor vertrek"
            />
            <span className="instelhint">{S.meldingen.minVooraf}</span>
          </span>
        )}
      </div>
      <div className="instelrij">
        <span className="instelhint">Wanneer melden</span>
        <DrempelKeuze
          drempel={s.drempel}
          richtingGoed={false}
          onWijzig={(drempel) => patch({ drempel })}
        />
      </div>
      <p className="schemazin">{schemaZin(s, "route")}</p>
    </div>
  );
}

function ToolSchema({ tool, presets, schema, onWijzig }) {
  const s = { ...structuredClone(DEFAULT_TOOL_SCHEMA), ...(schema ?? {}) };
  const patch = (p) => onWijzig({ ...s, ...p });
  return (
    <div className="routemeldingen">
      <h3 style={{ margin: "14px 0 4px" }}>Meldingen voor {tool.naam}</h3>
      <div className="instelrij">
        <label>
          <input
            type="checkbox"
            checked={s.aan}
            onChange={(e) => patch({ aan: e.target.checked })}
          />{" "}
          Volg deze check
        </label>
        <span className="instelgroep">
          <select
            value={s.locatie?.naam ?? ""}
            onChange={(e) => {
              const p = presets.find((x) => x.naam === e.target.value);
              patch({ locatie: p ? { naam: p.naam, lat: p.lat, lon: p.lon } : null });
            }}
            aria-label="Locatie voor deze melding"
          >
            <option value="">kies locatie...</option>
            {presets.map((p) => (
              <option key={p.naam} value={p.naam}>
                {p.naam}
              </option>
            ))}
          </select>
        </span>
      </div>
      {s.aan && (
        <>
          {!s.locatie && (
            <p className="uitleg">
              Kies een favoriete plek hierboven (sla er eerst een op met de ster
              in een van de tools).
            </p>
          )}
          <DagenChips dagen={s.dagen} onWijzig={(dagen) => patch({ dagen })} />
          <div className="instelrij">
            <span className="instelhint">Tijd</span>
            <TijdenLijst tijden={s.tijden} onWijzig={(tijden) => patch({ tijden })} />
          </div>
          <div className="instelrij">
            <span className="instelhint">Wanneer melden</span>
            <DrempelKeuze
              drempel={s.drempel}
              richtingGoed
              onWijzig={(drempel) => patch({ drempel })}
            />
          </div>
          <p className="schemazin">{schemaZin(s, "tool")}</p>
        </>
      )}
    </div>
  );
}
