"use client";

const KLEUR = {
  "fiets prima": "groen",
  "fiets met tegenzin": "oranje",
  "pak de scooter": "rood",
};

const TITEL = {
  "fiets prima": "Fiets prima",
  "fiets met tegenzin": "Fiets, met tegenzin",
  "pak de scooter": "Pak de scooter",
};

/** Dagadvies: de zwaarste etappe van de keten bepaalt de keuze. */
export default function DagBanner({ dag }) {
  if (!dag) return null;
  return (
    <div className={"dagbanner " + KLEUR[dag.advies]}>
      <h2>
        {TITEL[dag.advies]} <span style={{ fontWeight: 400 }}>· score {dag.score}</span>
      </h2>
      <p>{dag.uitleg}</p>
      <p className="noot">
        Je kiest een keer per dag: het zwaarste stuk van de keten bepaalt het advies.
      </p>
    </div>
  );
}
