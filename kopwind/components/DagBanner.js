"use client";

import { fmtCijfer } from "@/lib/format";

const KLEUR = {
  "prima fietsdag": "groen",
  "pittige rit": "oranje",
  "liever niet fietsen": "rood",
};

const TITEL = {
  "prima fietsdag": "Prima fietsdag",
  "pittige rit": "Pittige rit, fietsen kan",
  "liever niet fietsen": "Vandaag liever niet fietsen",
};

/** Dagadvies: de zwaarste rit van de dag bepaalt of de fiets meegaat. */
export default function DagBanner({ dag }) {
  if (!dag) return null;
  return (
    <div className={"dagbanner " + KLEUR[dag.advies]}>
      <h2>
        {TITEL[dag.advies]}{" "}
        <span className="dagcijfer">· {fmtCijfer(dag.score)}</span>
      </h2>
      <p>{dag.uitleg}</p>
      <p className="noot">
        Heen en terug tellen allebei mee: de zwaarste rit van je dag bepaalt het
        advies.
      </p>
    </div>
  );
}
