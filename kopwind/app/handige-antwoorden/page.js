import Link from "next/link";
import { notFound } from "next/navigation";
import Broodkruimel from "@/components/Broodkruimel";
import { HUB_NAAM } from "@/lib/brand";
import { IS_EN } from "@/lib/i18n/locale";
import { REKENHULPEN, REKEN_GROEPEN, ANTWOORDEN_HUB_PAD } from "@/lib/rekenhulpen";
import { REKEN_INHOUD } from "@/content/rekenhulpen";
import { AFTEL_HUB_PAD } from "@/lib/aftellen";

/** Verzamelpagina van alle kalender-, reken- en gidspagina's (v3.38.0). */
export const metadata = IS_EN
  ? {}
  : {
      title: "Handige antwoorden: kalender, geld, zon, maan en zee",
      description:
        "Weeknummer, feestdagen, schoolvakanties, werkdagen, vakantiegeld, belastingaangifte, goedkope stroom, volle maan, noorderlicht, eb en vloed en meer, elk met een eigen pagina.",
      alternates: { canonical: ANTWOORDEN_HUB_PAD },
    };

export default function AntwoordenHub() {
  if (IS_EN) notFound();
  return (
    <main>
      <Broodkruimel items={[{ naam: HUB_NAAM, href: "/" }, { naam: "Handige antwoorden" }]} />
      <section className="tool-hero">
        <h1>Handige antwoorden</h1>
        <p>
          Vragen over de kalender, geld, de zon en de maan, de zee en het weer, elk met een eigen pagina. Voor feestdagen,
          vakanties en seizoenen is er ook een <Link href={AFTEL_HUB_PAD}>aftelpagina</Link>.
        </p>
      </section>
      {REKEN_GROEPEN.map((g) => (
        <section key={g.id} className="aftel-groep">
          <h2>{g.titel}</h2>
          <ul className="aftel-lijst">
            {REKENHULPEN.filter((r) => r.groep === g.id).map((r) => (
              <li key={r.id}>
                <Link href={`/${r.slug}`}>
                  <span>{REKEN_INHOUD[r.id].h1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
