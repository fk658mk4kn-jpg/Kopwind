"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { DEFAULT_THRESHOLDS } from "@/lib/advice";
import SettingsPanel from "./SettingsPanel";
import MeldingenPanel from "./MeldingenPanel";
import InstallPrompt from "./InstallPrompt";
import { registreerSw } from "@/lib/push-client";

/**
 * Gedeelde gebruikersstaat voor de hele hub: favoriete plekken, opgeslagen
 * routes, drempels, synccode en toolmeldingen. Elke tool en elke pagina
 * leest en schrijft via deze context, zodat de synccode-account overal
 * hetzelfde is en de panelen (Meldingen, Instellingen) op elke pagina
 * werken.
 *
 * Opslagsleutels behouden het interne voorvoegsel kopwind, zodat bestaande
 * gebruikersdata deze refactor niets merkt.
 */

const LS = {
  presets: "kopwind.presets",
  thresholds: "kopwind.thresholds",
  routes: "kopwind.routes",
  synccode: "kopwind.synccode",
  toolMeldingen: "kopwind.toolMeldingen",
};

const Ctx = createContext(null);

export function useGebruiker() {
  return useContext(Ctx);
}

export default function GebruikerProvider({ children }) {
  const [presets, setPresets] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [thresholds, setThresholds] = useState({ ...DEFAULT_THRESHOLDS });
  const [toolMeldingen, setToolMeldingen] = useState({});
  const [syncCode, setSyncCode] = useState(null);
  const [instellingenOpen, setInstellingenOpen] = useState(false);
  const [meldingenOpen, setMeldingenOpen] = useState(false);
  const [interactieGedaan, setInteractieGedaan] = useState(false);

  const syncKlaar = useRef(false);
  const syncTimer = useRef(null);

  useEffect(() => {
    registreerSw();
    let code = null;
    try {
      const p = JSON.parse(localStorage.getItem(LS.presets) ?? "[]");
      if (Array.isArray(p)) setPresets(p);
      const r = JSON.parse(localStorage.getItem(LS.routes) ?? "[]");
      if (Array.isArray(r)) setRoutes(r);
      const t = JSON.parse(localStorage.getItem(LS.thresholds) ?? "null");
      if (t) setThresholds({ ...DEFAULT_THRESHOLDS, ...t });
      const tm = JSON.parse(localStorage.getItem(LS.toolMeldingen) ?? "null");
      if (tm && typeof tm === "object") setToolMeldingen(tm);
      code = localStorage.getItem(LS.synccode) || null;
      setSyncCode(code);
    } catch {
      // Kapotte localStorage negeren; schone start.
    }
    (async () => {
      if (code) {
        try {
          const res = await fetch(`/api/sync?code=${encodeURIComponent(code)}`);
          if (res.ok) {
            const { data } = await res.json();
            pasServerDataToe(data);
          }
        } catch {
          // Offline of server weg: lokaal verder.
        }
      }
      syncKlaar.current = true;
    })();
  }, []);

  const pasServerDataToe = (data) => {
    if (!data) return;
    if (Array.isArray(data.presets)) {
      setPresets(data.presets);
      localStorage.setItem(LS.presets, JSON.stringify(data.presets));
    }
    if (Array.isArray(data.routes)) {
      setRoutes(data.routes);
      localStorage.setItem(LS.routes, JSON.stringify(data.routes));
    }
    if (data.thresholds) {
      const t = { ...DEFAULT_THRESHOLDS, ...data.thresholds };
      setThresholds(t);
      localStorage.setItem(LS.thresholds, JSON.stringify(t));
    }
    if (data.toolMeldingen && typeof data.toolMeldingen === "object") {
      setToolMeldingen(data.toolMeldingen);
      localStorage.setItem(LS.toolMeldingen, JSON.stringify(data.toolMeldingen));
    }
  };

  // Wijzigingen debounced naar de server (last write wins).
  useEffect(() => {
    if (!syncKlaar.current || !syncCode) return;
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      fetch("/api/sync", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: syncCode,
          data: { presets, routes, thresholds, toolMeldingen },
        }),
      }).catch(() => {});
    }, 800);
    return () => clearTimeout(syncTimer.current);
  }, [presets, routes, thresholds, toolMeldingen, syncCode]);

  const bewaarPreset = (preset) => {
    const next = [...presets.filter((p) => p.naam !== preset.naam), preset];
    setPresets(next);
    localStorage.setItem(LS.presets, JSON.stringify(next));
  };

  const verwijderPreset = (naam) => {
    const next = presets.filter((p) => p.naam !== naam);
    setPresets(next);
    localStorage.setItem(LS.presets, JSON.stringify(next));
  };

  const zetRoutes = (next) => {
    setRoutes(next);
    localStorage.setItem(LS.routes, JSON.stringify(next));
  };

  const wijzigRouteMeldingen = (naam, meldingen) => {
    zetRoutes(routes.map((r) => (r.naam === naam ? { ...r, meldingen } : r)));
  };

  const wijzigToolMeldingen = (toolId, schema) => {
    const next = { ...toolMeldingen, [toolId]: schema };
    setToolMeldingen(next);
    localStorage.setItem(LS.toolMeldingen, JSON.stringify(next));
  };

  const wijzigThresholds = (t) => {
    setThresholds(t);
    localStorage.setItem(LS.thresholds, JSON.stringify(t));
  };

  const maakSyncCode = async () => {
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const d = await res.json();
      if (!res.ok) return d.error ?? "Kon geen synccode aanmaken.";
      setSyncCode(d.code);
      localStorage.setItem(LS.synccode, d.code);
      await fetch("/api/sync", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: d.code,
          data: { presets, routes, thresholds, toolMeldingen },
        }),
      }).catch(() => {});
      return null;
    } catch {
      return "Kon geen synccode aanmaken (server niet bereikbaar).";
    }
  };

  const koppelSyncCode = async (code) => {
    try {
      const res = await fetch(`/api/sync?code=${encodeURIComponent(code)}`);
      const d = await res.json();
      if (!res.ok) return d.error ?? "Onbekende synccode.";
      setSyncCode(code);
      localStorage.setItem(LS.synccode, code);
      pasServerDataToe(d.data);
      return null;
    } catch {
      return "Koppelen mislukt (server niet bereikbaar).";
    }
  };

  const ontkoppel = () => {
    setSyncCode(null);
    localStorage.removeItem(LS.synccode);
  };

  const waarde = {
    presets,
    routes,
    thresholds,
    toolMeldingen,
    syncCode,
    bewaarPreset,
    verwijderPreset,
    zetRoutes,
    wijzigRouteMeldingen,
    wijzigToolMeldingen,
    wijzigThresholds,
    maakSyncCode,
    koppelSyncCode,
    ontkoppel,
    openInstellingen: () => setInstellingenOpen(true),
    openMeldingen: () => setMeldingenOpen(true),
    meldInteractie: () => setInteractieGedaan(true),
  };

  return (
    <Ctx.Provider value={waarde}>
      {children}
      <SettingsPanel
        open={instellingenOpen}
        onClose={() => setInstellingenOpen(false)}
        thresholds={thresholds}
        setThresholds={wijzigThresholds}
        presets={presets}
        onDeletePreset={verwijderPreset}
        routes={routes}
        onDeleteRoute={(naam) => zetRoutes(routes.filter((r) => r.naam !== naam))}
      />
      <MeldingenPanel
        open={meldingenOpen}
        onClose={() => setMeldingenOpen(false)}
      />
      <InstallPrompt interactieGedaan={interactieGedaan} />
    </Ctx.Provider>
  );
}
