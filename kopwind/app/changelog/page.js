import { VERSIES } from "@/content/versies";
import { HUB_NAAM } from "@/lib/brand";

export const metadata = {
  title: "Changelog",
  description: "Wat er per versie bijkwam en veranderde in Kan het vandaag?",
  alternates: { canonical: "/changelog" },
};

export default function ChangelogPagina() {
  return (
    <main>
      <div className="tool-hero">
        <h1>Changelog</h1>
        <p>Wat er per versie veranderde en bijkwam.</p>
      </div>
      <section className="seotekst">
        {VERSIES.map((v) => (
          <div key={v.versie}>
            <h2>
              v{v.versie} "{v.codenaam}" · {v.datum}
            </h2>
            <p>{v.zin}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
