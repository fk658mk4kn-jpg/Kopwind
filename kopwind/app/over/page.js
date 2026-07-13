import Link from "next/link";
import { HUB_NAAM } from "@/lib/brand";

export const metadata = {
  title: { absolute: `Over ${HUB_NAAM}` },
  description:
    "Waarom Kan het vandaag? bestaat: dagelijkse beslissingen verdienen een antwoord, geen weerkaart.",
  alternates: { canonical: "/over" },
};

export default function OverPagina() {
  return (
    <main>
      <div className="tool-hero">
        <h1>Over {HUB_NAAM}</h1>
        <p>Geen weerbericht, maar een antwoord. Met het wanneer en waar erbij.</p>
      </div>
      <section className="seotekst">
        <h2>Waarom dit bestaat</h2>
        <p>
          Weerapps geven je een kaart vol getallen en laten het denkwerk aan jou. {HUB_NAAM}{" "}
          draait dat om. Elke check weegt de factoren die er voor die ene beslissing toe doen
          en geeft ja of nee, het beste moment en een uitleg in gewone taal.
        </p>
        <h2>Hoe het werkt</h2>
        <p>
          Elke check haalt live de uurvoorspelling op voor jouw plek en rekent daar per uur op.
          Het oordeel (van Zeer slecht tot Ideaal) zegt hoe goed de omstandigheden zijn; een
          aparte statusregel zegt of je het nu nog redt en wanneer het beste blok valt. Alles werkt zonder account, is gratis en
          draait op je beginscherm als app, met meldingen op de momenten die jij kiest.
        </p>
        <h2>Eerlijk over de grenzen</h2>
        <p>
          Een voorspelling blijft een voorspelling. We tonen altijd het tijdstip waarop de data
          is opgehaald en trekken geen conclusies die de data niet dragen. Waar het model
          twijfelt, zeggen we dat gewoon. Meer weten over de rekensommen? Lees{" "}
          <Link href="/uitleg">het weer in gewone taal</Link> of check{" "}
          <Link href="/bronnen">de bronnen</Link>.
        </p>
      </section>
    </main>
  );
}
