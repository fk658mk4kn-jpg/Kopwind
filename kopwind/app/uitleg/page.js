import Link from "next/link";
import { UITLEG } from "@/content/uitleg";
import { HUB_NAAM } from "@/lib/brand";

export const metadata = {
  title: "Het weer in gewone taal",
  description:
    "Korte uitleg zonder vakjargon: gevoelstemperatuur, hoe je was droogt, waarom tegenwind zwaarder telt en wat buienkans echt betekent.",
  alternates: { canonical: "/uitleg" },
};

export default function UitlegIndex() {
  return (
    <main>
      <div className="tool-hero">
        <h1>Het weer in gewone taal</h1>
        <p>
          Waarom zeggen de checks wat ze zeggen? Korte uitleg zonder vakjargon, zodat je de
          voorspelling zelf ook beter leest.
        </p>
      </div>
      <div className="toolkaarten">
        {UITLEG.map((a) => (
          <Link key={a.slug} href={`/uitleg/${a.slug}`} className="toolkaart">
            <h2>{a.vraag}</h2>
            <p>{a.intro.slice(0, 120)}...</p>
            <span className="doorlink">Lees de uitleg</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
