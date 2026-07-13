import Link from "next/link";
import { UITLEG } from "@/content/uitleg";
import { HUB_NAAM } from "@/lib/brand";
import { kies } from "@/lib/i18n/locale";
import { PAD } from "@/lib/i18n/paden";

const T = kies({
  nl: {
    titel: "Het weer in gewone taal",
    oms: "Korte uitleg zonder vakjargon: gevoelstemperatuur, hoe je was droogt, waarom tegenwind zwaarder telt en wat buienkans echt betekent.",
    sub: "Waarom zeggen de checks wat ze zeggen? Korte uitleg zonder vakjargon, zodat je de voorspelling zelf ook beter leest.",
    lees: "Lees de uitleg",
  },
  en: {
    titel: "The weather in plain words",
    oms: "Short explainers without jargon: feels-like temperature, how laundry dries, why headwind counts double and what rain chance really means.",
    sub: "Why do the checks say what they say? Short explainers without jargon, so you read the forecast better yourself too.",
    lees: "Read the explainer",
  },
});

export const metadata = {
  title: T.titel,
  description: T.oms,
  alternates: { canonical: PAD.uitleg },
};

export default function UitlegIndex() {
  return (
    <main>
      <div className="tool-hero">
        <h1>{T.titel}</h1>
        <p>{T.sub}</p>
      </div>
      <div className="toolkaarten">
        {UITLEG.map((a) => (
          <Link key={a.slug} href={`${PAD.uitleg}/${a.slug}`} className="toolkaart">
            <h2>{a.vraag}</h2>
            <p>{a.intro.slice(0, 120)}...</p>
            <span className="doorlink">{T.lees}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
