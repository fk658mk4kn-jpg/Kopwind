"use client";

import { useEffect, useState } from "react";
import {
  migreerRouteSchema,
  DEFAULT_TOOL_SCHEMA,
  schemaZin,
} from "@/lib/engine/meldingen";
import { S } from "@/lib/strings";
import { kies } from "@/lib/i18n/locale";
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
    setStatus(fout ?? kies({ nl: "Gekoppeld. Je routes en instellingen zijn overgenomen.", en: "Linked. Your routes and settings have been carried over." }));
    setBezig(false);
  };

  const zetPushAan = async () => {
    setBezig(true);
    setStatus(null);
    const r = await abonneer(g.syncCode);
    if (r.ok) {
      setAbo(true);
      setStatus(kies({ nl: "Dit apparaat ontvangt nu meldingen.", en: "This device now receives notifications." }));
    } else {
      setStatus(r.fout);
    }
    setBezig(false);
  };

  const zetPushUit = async () => {
    setBezig(true);
    await zegOp(g.syncCode);
    setAbo(false);
    setStatus(kies({ nl: "Meldingen op dit apparaat uitgezet.", en: "Notifications turned off on this device." }));
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
          ? kies({ nl: `Testmelding verstuurd naar ${d.apparaten} apparaat/apparaten.`, en: `Test notification sent to ${d.apparaten} device(s).` })
          : d.error ?? kies({ nl: "Testmelding mislukt.", en: "Test notification failed." })
      );
    } catch {
      setStatus(kies({ nl: "Testmelding mislukt.", en: "Test notification failed." }));
    }
    setBezig(false);
  };

  return (
    <div className="modalachter" onClick={onClose}>
      <div className="modal modal-breed" onClick={(e) => e.stopPropagation()}>
        <h2>{kies({ nl: "Meldingen en apparaten", en: "Notifications and devices" })}</h2>

        <h3>{kies({ nl: "Op je beginscherm", en: "On your home screen" })}</h3>
        {g.geinstalleerd || standalone ? (
          <p className="uitleg">
            {kies({
              nl: "Deze check staat als app op dit apparaat. Meldingen en snelle toegang werken hiervandaan het best.",
              en: "This check is installed as an app on this device. Notifications and quick access work best from here.",
            })}
          </p>
        ) : g.installBeschikbaar ? (
          <div className="synccode-rij">
            <button className="knop primair" onClick={g.zetOpBeginscherm}>
              {S.install.knop}
            </button>
            <span className="uitleg" style={{ margin: 0 }}>
              {kies({ nl: "Een tik en de check staat als app tussen je andere apps.", en: "One tap and the check sits with your other apps." })}
            </span>
          </div>
        ) : ios ? (
          <p className="uitleg">
            {kies({
              nl: "Op iPhone en iPad: tik op de deelknop en kies \u201cZet op beginscherm\u201d. Daarna opent de check als app en kun je hieronder meldingen aanzetten (iOS 16.4 of nieuwer).",
              en: "On iPhone and iPad: tap the share button and choose \u201cAdd to Home Screen\u201d. The check then opens as an app and you can turn on notifications below (iOS 16.4 or newer).",
            })}
          </p>
        ) : (
          <p className="uitleg">
            {kies({
              nl: "In Chrome of Edge: open het browsermenu en kies \u201cApp installeren\u201d of \u201cToevoegen aan startscherm\u201d. In Firefox en Safari op desktop werkt de check gewoon in de browser, inclusief meldingen.",
              en: "In Chrome or Edge: open the browser menu and choose \u201cInstall app\u201d or \u201cAdd to home screen\u201d. In Firefox and Safari on desktop the check simply works in the browser, notifications included.",
            })}
          </p>
        )}

        <p className="uitleg" style={{ marginTop: 0 }}>
          {kies({
            nl: "Zet een seintje aan als je op tijd wilt weten of fietsen, wassen of terrassen slim is. Twee stappen:",
            en: "Turn on a nudge if you want to know in time whether biking, laundry or the patio is smart. Two steps:",
          })}
        </p>
        <h3>{kies({ nl: "1. Apparaten koppelen", en: "1. Link your devices" })}</h3>
        {g.syncCode ? (
          <>
            <p className="uitleg" style={{ marginTop: 0 }}>
              {kies({
                nl: "Jouw synccode. Voer hem in op je andere apparaat, dan zien laptop en telefoon dezelfde routes, favorieten en meldingen.",
                en: "Your sync code. Enter it on your other device and laptop and phone share the same routes, favourites and notifications.",
              })}
            </p>
            <div className="synccode-rij">
              <code className="synccode">{g.syncCode}</code>
              <button
                className="knop klein"
                onClick={() => {
                  navigator.clipboard?.writeText(g.syncCode);
                  setStatus(kies({ nl: "Code gekopieerd.", en: "Code copied." }));
                }}
              >
                Kopieer
              </button>
              <button className="knop klein" onClick={g.ontkoppel}>
                Ontkoppel
              </button>
            </div>
            <p className="uitleg">
              {kies({
                nl: "Bewaar 'm ergens veilig. We werken zonder account, dus deze code kunnen we niet voor je terughalen.",
                en: "Keep it somewhere safe. We work without accounts, so we can't recover this code for you.",
              })}
            </p>
          </>
        ) : (
          <>
            <p className="uitleg" style={{ marginTop: 0 }}>
              {kies({
                nl: "Gebruik je dit ook op je telefoon of een ander apparaat? Maak dan je persoonlijke code aan, of vul de code van je andere apparaat in. Geen account of e-mail nodig.",
                en: "Using this on your phone or another device too? Create your personal code, or enter the code from your other device. No account or email needed.",
              })}
            </p>
            <div className="synccode-rij">
              <button className="knop primair" onClick={maakCode} disabled={bezig}>
                {kies({ nl: "Maak synccode", en: "Create sync code" })}
              </button>
            </div>
            <div className="synccode-rij">
              <input
                type="text"
                placeholder={kies({ nl: "Bestaande code, bv. K7QX-2MP9", en: "Existing code, e.g. K7QX-2MP9" })}
                value={invoer}
                onChange={(e) => setInvoer(e.target.value)}
                aria-label={kies({ nl: "Synccode invoeren", en: "Enter sync code" })}
              />
              <button className="knop" onClick={koppel} disabled={bezig || !invoer.trim()}>
                Koppel
              </button>
            </div>
          </>
        )}

        <h3>{kies({ nl: "2. Meldingen op dit apparaat", en: "2. Notifications on this device" })}</h3>
        {!g.syncCode && <p className="uitleg">{kies({ nl: "Koppel eerst je apparaten (stap 1).", en: "Link your devices first (step 1)." })}</p>}
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
                  {kies({ nl: "Meldingen op dit apparaat uitzetten", en: "Turn off notifications on this device" })}
                </button>
                <button className="knop" onClick={testMelding} disabled={bezig}>
                  {kies({ nl: "Stuur testmelding", en: "Send test notification" })}
                </button>
              </>
            ) : (
              <button className="knop primair" onClick={zetPushAan} disabled={bezig}>
                {kies({ nl: "Zet meldingen aan op dit apparaat", en: "Turn on notifications on this device" })}
              </button>
            )}
          </div>
        )}

        <h3>{kies({ nl: "3. Meldingen per route", en: "3. Notifications per route" })}</h3>
        {g.routes.length === 0 && (
          <p className="uitleg">
            {kies({
              nl: "Nog geen opgeslagen routes. Sla in de fietscheck je woon-werkrit op; daarna stel je hier per route in wanneer je een melding wilt.",
              en: "No saved routes yet. Save your commute in the bike check; then set per route here when you want a notification.",
            })}
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
          {kies({
            nl: "De klok kijkt elke 5 minuten, dus een melding kan een paar minuten verschuiven. Vertrekherinneringen gelden voor ritten met een vaste vertrek- of aankomsttijd (niet bij vertrekken nu).",
            en: "The clock checks every 5 minutes, so a notification can shift a few minutes. Departure reminders apply to rides with a fixed departure or arrival time (not for leave now).",
          })}
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
    <div className="chips dagchips" role="group" aria-label={kies({ nl: "Dagen", en: "Days" })}>
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
              aria-label={kies({ nl: "Tijd verwijderen", en: "Remove time" })}
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
        aria-label={kies({ nl: "Wanneer melden", en: "When to notify" })}
      >
        <option value="altijd">{S.meldingen.drempelAltijd}</option>
        <option value="slecht">{S.meldingen.drempelSlecht}</option>
        <option value="goed">{S.meldingen.drempelGoed}</option>
      </select>
      {d.modus !== "altijd" && (
        <select
          value={String(d.cijfer)}
          onChange={(e) => onWijzig({ ...d, cijfer: Number(e.target.value) })}
          aria-label={kies({ nl: "Grens", en: "Threshold" })}
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
              aria-label={kies({ nl: "Minuten voor vertrek", en: "Minutes before departure" })}
            />
            <span className="instelhint">{S.meldingen.minVooraf}</span>
          </span>
        )}
      </div>
      <div className="instelrij">
        <span className="instelhint">{kies({ nl: "Wanneer melden", en: "When to notify" })}</span>
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
            aria-label={kies({ nl: "Locatie voor deze melding", en: "Location for this notification" })}
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
            <span className="instelhint">{kies({ nl: "Tijd", en: "Time" })}</span>
            <TijdenLijst tijden={s.tijden} onWijzig={(tijden) => patch({ tijden })} />
          </div>
          <div className="instelrij">
            <span className="instelhint">{kies({ nl: "Wanneer melden", en: "When to notify" })}</span>
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
