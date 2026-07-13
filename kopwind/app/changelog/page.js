import { VERSIES } from "@/content/versies";
import { HUB_NAAM } from "@/lib/brand";
import { kies } from "@/lib/i18n/locale";

export const metadata = {
  title: "Changelog",
  description: kies({ nl: `Wat er per versie bijkwam en veranderde in ${HUB_NAAM}`, en: `What changed and arrived per version in ${HUB_NAAM}` }),
  alternates: { canonical: "/changelog" },
};

export default function ChangelogPagina() {
  return (
    <main>
      <div className="tool-hero">
        <h1>Changelog</h1>
        <p>{kies({ nl: "Wat er per versie veranderde en bijkwam.", en: "What changed and arrived per version." })}</p>
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
