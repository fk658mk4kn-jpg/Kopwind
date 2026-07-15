"use client";

import LocatieZoek from "@/components/LocatieZoek";
import Icoon from "@/components/Icoon";
import { S } from "@/lib/strings";

/**
 * Gedeelde plek-kiezer voor elke tool (PLAYBOOK sectie 1 en 7): favorieten-
 * chips, een zoekveld, de gekozen plek met een ster om te bewaren, en de
 * actieknop. Losgetrokken uit LocatieTool zodat de locatie-checks en de
 * nowcast-checks (paraplu, regentiming) exact dezelfde plek-kiezer tonen,
 * zonder parallelle opmaak. Extra invoervelden (zoals de buitentijd bij
 * paraplu) kunnen als children meegegeven worden; die renderen in het paneel
 * boven de actieknop.
 */
export default function PlekKiezer({
  presets = [],
  locatie,
  onKies,
  onCheck,
  bezig = false,
  cta,
  locatieHint,
  favoriet = false,
  bewaarPreset,
  children = null,
}) {
  return (
    <section className="paneel plek-paneel">
      <h2 className="paneel-titel">{S.locatieTool.jouwPlek}</h2>
      {presets.length > 0 && (
        <div className="chips">
          {presets.map((p) => (
            <button key={p.naam} className="chip" onClick={() => onKies(p)}>
              {p.naam}
            </button>
          ))}
        </div>
      )}
      <LocatieZoek onKies={onKies} placeholder={locatieHint ?? S.locatieTool.zoekStandaard} />
      {locatie && (
        <div className="locatie-gekozen">
          <Icoon naam="locatie" vol maat={16} />
          <span className="locatie-naam">{locatie.naam}</span>
          <button
            className="iconknop"
            title={favoriet ? S.locatieTool.favorietActief : S.locatieTool.favorietTitel}
            onClick={() => {
              if (favoriet || !bewaarPreset) return;
              const naam = window.prompt(S.locatieTool.favorietPrompt, locatie.naam.split(",")[0]);
              if (naam) bewaarPreset({ naam: naam.trim(), lat: locatie.lat, lon: locatie.lon });
            }}
          >
            <Icoon naam="ster" vol={favoriet} maat={17} />
          </button>
        </div>
      )}
      {children}
      <div className="actiebalk">
        <button className="knop primair" onClick={onCheck} disabled={bezig}>
          {bezig ? S.algemeen.bezig : cta}
        </button>
      </div>
    </section>
  );
}
