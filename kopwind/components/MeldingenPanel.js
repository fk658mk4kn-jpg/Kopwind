"use client";

import { useEffect, useState } from "react";
import { DEFAULT_MELDINGEN } from "@/lib/notify";
import {
  pushOndersteund,
  draaitStandalone,
  isIos,
  abonneer,
  zegOp,
  isGeabonneerd,
} from "@/lib/push-client";

/**
 * Modal voor synchronisatie en meldingen:
 * 1. Apparaten koppelen met een synccode (laptop en telefoon zien hetzelfde).
 * 2. Dit apparaat aanmelden voor push (op iPhone: eerst op het beginscherm).
 * 3. Per opgeslagen route de ochtendbriefing en vertrekherinnering instellen.
 */
export default function MeldingenPanel({
  open,
  onClose,
  routes,
  onWijzigRouteMeldingen,
  syncCode,
  onMaakCode,
  onKoppelCode,
  onOntkoppel,
}) {
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

  if (!open) return null;

  const ios = isIos();
  const standalone = draaitStandalone();
  const ondersteund = pushOndersteund();

  const maakCode = async () => {
    setBezig(true);
    setStatus(null);
    const fout = await onMaakCode();
    if (fout) setStatus(fout);
    setBezig(false);
  };

  const koppel = async () => {
    if (!invoer.trim()) return;
    setBezig(true);
    setStatus(null);
    const fout = await onKoppelCode(invoer.trim().toUpperCase());
    if (fout) setStatus(fout);
    else setStatus("Gekoppeld. Je routes en instellingen zijn overgenomen.");
    setBezig(false);
  };

  const zetPushAan = async () => {
    setBezig(true);
    setStatus(null);
    const r = await abonneer(syncCode);
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
    await zegOp(syncCode);
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
        body: JSON.stringify({ code: syncCode }),
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
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Meldingen en apparaten</h2>

        <h3>1. Apparaten koppelen</h3>
        {syncCode ? (
          <>
            <p className="uitleg" style={{ marginTop: 0 }}>
              Jouw synccode. Voer hem in op je andere apparaat (laptop of
              telefoon), dan zien ze allebei dezelfde routes, favorieten en
              instellingen.
            </p>
            <div className="synccode-rij">
              <code className="synccode">{syncCode}</code>
              <button
                className="knop klein"
                onClick={() => {
                  navigator.clipboard?.writeText(syncCode);
                  setStatus("Code gekopieerd.");
                }}
              >
                Kopieer
              </button>
              <button className="knop klein" onClick={onOntkoppel}>
                Ontkoppel
              </button>
            </div>
            <p className="uitleg">
              Bewaar de code ergens veilig: hij is je enige sleutel, er is geen
              wachtwoordherstel.
            </p>
          </>
        ) : (
          <>
            <p className="uitleg" style={{ marginTop: 0 }}>
              Maak een synccode aan (geen account of e-mail nodig) of voer de
              code van je andere apparaat in.
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
        {!syncCode && (
          <p className="uitleg">Koppel eerst je apparaten (stap 1).</p>
        )}
        {syncCode && ios && !standalone && (
          <p className="uitleg">
            Op iPhone en iPad: zet de site eerst op je beginscherm (deelknop,
            dan "Zet op beginscherm") en open de app daarvandaan. Daarna kun je
            hier meldingen aanzetten. Werkt vanaf iOS 16.4.
          </p>
        )}
        {syncCode && !ondersteund && !ios && (
          <p className="uitleg">
            Deze browser ondersteunt geen webpush. Probeer Chrome, Edge of
            Firefox, of Safari op iPhone via het beginscherm.
          </p>
        )}
        {syncCode && ondersteund && (!ios || standalone) && (
          <div className="synccode-rij">
            {abo ? (
              <>
                <button className="knop" onClick={zetPushUit} disabled={bezig}>
                  Meldingen op dit apparaat uitzetten
                </button>
                <button className="knop" onClick={testMelding} disabled={bezig}>
                  Test melding
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
        {routes.length === 0 && (
          <p className="uitleg">
            Nog geen opgeslagen routes. Vul je woon-werkrit in en klik op Route
            opslaan; daarna stel je hier per route de meldingen in.
          </p>
        )}
        {routes.map((r) => {
          const m = { ...DEFAULT_MELDINGEN, ...(r.meldingen ?? {}) };
          const wijzig = (patch) => onWijzigRouteMeldingen(r.naam, { ...m, ...patch });
          return (
            <div className="routemeldingen" key={r.naam}>
              <strong>{r.naam}</strong>
              <div className="instelrij">
                <label htmlFor={`ocht-${r.naam}`}>Ochtendbriefing</label>
                <span className="instelgroep">
                  <input
                    id={`ocht-${r.naam}`}
                    type="checkbox"
                    checked={m.ochtend}
                    onChange={(e) => wijzig({ ochtend: e.target.checked })}
                  />
                  <input
                    type="time"
                    value={m.ochtendTijd}
                    disabled={!m.ochtend}
                    onChange={(e) => wijzig({ ochtendTijd: e.target.value })}
                    aria-label={`Tijdstip ochtendbriefing ${r.naam}`}
                  />
                </span>
              </div>
              <div className="instelrij">
                <label htmlFor={`vert-${r.naam}`}>Herinnering voor vertrek</label>
                <span className="instelgroep">
                  <input
                    id={`vert-${r.naam}`}
                    type="checkbox"
                    checked={m.vertrek}
                    onChange={(e) => wijzig({ vertrek: e.target.checked })}
                  />
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={m.vertrekMinuten}
                    disabled={!m.vertrek}
                    onChange={(e) => wijzig({ vertrekMinuten: Number(e.target.value) })}
                    aria-label={`Minuten voor vertrek ${r.naam}`}
                  />
                  <span className="instelhint">min vooraf</span>
                </span>
              </div>
            </div>
          );
        })}
        {routes.length > 0 && (
          <p className="uitleg">
            De briefing geeft het dagadvies met weer voor de hele route.
            Vertrekherinneringen gelden voor ritten met een vaste vertrek- of
            aankomsttijd (niet bij vertrekken nu). De klok kijkt elke 5 minuten,
            dus een melding kan een paar minuten verschuiven.
          </p>
        )}

        {status && <p className="uitleg synstatus">{status}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <button className="knop primair" onClick={onClose}>
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
}
