import Link from "next/link";
import { AFTELLERS, volgende, AFTEL_HUB_PAD, vindAftellerOpId } from "@/lib/aftellen";

/**
 * Homepage-strook (v3.35.0): de vijf dichtstbijzijnde datums plus de
 * weekendklok, met de stand van vandaag. De homepage revalideert elk uur.
 */
export default function AftelStrook() {
  const nu = Date.now();
  const dichtbij = AFTELLERS.filter((a) => a.soort === "datum" && !a.daglicht && !a.sneeuw && !a.tijdDoel?.u)
    .map((a) => ({ a, m: volgende(a, nu)[0] }))
    .filter((x) => x.m && !x.m.bezig)
    .sort((x, y) => x.m.dagen - y.m.dagen)
    .slice(0, 5);
  const weekend = vindAftellerOpId("weekend");
  return (
    <section className="aftel-strook">
      <h2>Aftellen</h2>
      <div className="aftel-chips">
        {dichtbij.map(({ a, m }) => (
          <Link key={a.id} href={`/${a.slug}`} className="chip">
            {a.titel}: {m.isVandaag ? "vandaag" : `nog ${m.dagen} ${m.dagen === 1 ? "dag" : "dagen"}`}
          </Link>
        ))}
        <Link href={`/${weekend.slug}`} className="chip">
          Weekend
        </Link>
        <Link href={AFTEL_HUB_PAD} className="chip">
          Alle tellers
        </Link>
      </div>
    </section>
  );
}
