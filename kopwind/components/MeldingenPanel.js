"use client";

import { useEffect, useState } from "react";

/**
 * Modal voor de meldinginstellingen: browserpermissie, ochtendbriefing en
 * vertrekherinnering. De planning zelf draait in NotificationManager.
 */
export default function MeldingenPanel({ open, onClose, meldingen, setMeldingen }) {
  const [permissie, setPermissie] = useState("default");

  useEffect(() => {
    if (open && typeof Notification !== "undefined") {
      setPermissie(Notification.permission);
    }
  }, [open]);

  if (!open) return null;

  const ondersteund = typeof Notification !== "undefined";

  const vraagPermissie = async () => {
    const p = await Notification.requestPermission();
    setPermissie(p);
  };

  const testMelding = () => {
    try {
      const n = new Notification("Fietscheck testmelding", {
        body: "Zo zien je meldingen eruit. Prima fietsdag (9,3): 14 graden, droog, wind 3 Bft uit ZW.",
      });
      n.onclick = () => window.focus();
    } catch {
      window.alert(
        "Kon geen melding tonen. Check de meldingsinstellingen van je browser en besturingssysteem."
      );
    }
  };

  return (
    <div className="modalachter" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Meldingen</h2>

        {!ondersteund && (
          <p className="uitleg">
            Deze browser ondersteunt geen webmeldingen. Probeer Chrome, Edge of
            Firefox op desktop.
          </p>
        )}

        {ondersteund && permissie !== "granted" && (
          <div style={{ marginBottom: 12 }}>
            <p className="uitleg" style={{ marginTop: 0 }}>
              {permissie === "denied"
                ? "Meldingen zijn geblokkeerd voor deze site. Zet ze aan via het slotje in de adresbalk en herlaad de pagina."
                : "Geef de browser eenmalig toestemming om meldingen te tonen."}
            </p>
            {permissie === "default" && (
              <button className="knop primair" onClick={vraagPermissie}>
                Meldingen aanzetten
              </button>
            )}
          </div>
        )}

        <h3>Ochtendbriefing</h3>
        <div className="instelrij">
          <label htmlFor="meld-ochtend">Dagadvies elke ochtend</label>
          <input
            id="meld-ochtend"
            type="checkbox"
            checked={meldingen.ochtend}
            onChange={(e) => setMeldingen({ ...meldingen, ochtend: e.target.checked })}
          />
        </div>
        <div className="instelrij">
          <label htmlFor="meld-ochtendtijd">Tijdstip</label>
          <input
            id="meld-ochtendtijd"
            type="time"
            value={meldingen.ochtendTijd}
            onChange={(e) =>
              setMeldingen({ ...meldingen, ochtendTijd: e.target.value })
            }
          />
        </div>

        <h3>Vertrekherinnering</h3>
        <div className="instelrij">
          <label htmlFor="meld-vertrek">Melding voor elke etappe</label>
          <input
            id="meld-vertrek"
            type="checkbox"
            checked={meldingen.vertrek}
            onChange={(e) => setMeldingen({ ...meldingen, vertrek: e.target.checked })}
          />
        </div>
        <div className="instelrij">
          <label htmlFor="meld-minuten">Minuten voor vertrek</label>
          <input
            id="meld-minuten"
            type="number"
            min="5"
            step="5"
            value={meldingen.vertrekMinuten}
            onChange={(e) =>
              setMeldingen({ ...meldingen, vertrekMinuten: Number(e.target.value) })
            }
          />
        </div>

        <p className="uitleg">
          De briefing en herinneringen gebruiken je laatst berekende keten en het
          actuele weer: advies, temperatuur, regen en wind. Herinneringen gelden
          voor ritten met een geplande tijd (niet bij vertrekken nu). Werkt zolang er ergens een tabblad
          met de fietscheck open staat; een gemiste briefing wordt tot 3 uur later
          ingehaald zodra je de app opent.
        </p>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
          {ondersteund && permissie === "granted" && (
            <button className="knop" onClick={testMelding}>
              Test melding
            </button>
          )}
          <button className="knop primair" onClick={onClose}>
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
}
