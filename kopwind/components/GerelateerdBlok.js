import Link from "next/link";
import { TOOLS } from "@/lib/tools";
import { vindCategorieOpId } from "@/lib/categorieen";
import { S } from "@/lib/strings";
import { kies } from "@/lib/i18n/locale";
import Icoon from "./Icoon";

/**
 * "Ook handig vandaag": het interne linkweefsel per check (v3.19.0
 * "Harmattan", SEO-run met akkoord Martijn). Elke check linkt naar 2
 * tot 4 verwante checks, gekozen op echte intentie-overlap en waar
 * zinnig wederkerig; ankertekst is altijd de canonieke vraag van de
 * doelcheck, zodat geen pagina op andermans zoekterm gaat leunen
 * (anti-cannibalisatie). Een item kan ook een hub-anchor zijn: een
 * vraag-antwoord op een storefront (zelfde URL-patroon als de
 * catalogus: /categorie-slug#anker-id). De kledingvarianten hebben
 * eigen sleutels (templateId) met de ouder plus de twee zusters.
 */
const RELATIES = {
  // Regen
  "regen-timing": [
    "paraplu",
    "fiets-naar-werk",
    "was-buiten-drogen",
    { ankerCategorie: "regen", anker: "regenkans-betekenis", tekst: { nl: "Wat betekent 60 procent regenkans?", en: "What does a 60 percent rain chance mean?" } },
  ],
  "paraplu": ["regen-timing", "wat-trek-ik-aan", "fiets-naar-werk"],
  // Sport
  "fiets-naar-werk": ["wat-trek-ik-aan", "regen-timing", "gladheid"],
  "hardloopweer": [
    "wandelen",
    "buiten-sporten",
    "hooikoorts",
    { ankerCategorie: "sport", anker: "sporten-bij-smog-of-slechte-lucht", tekst: { nl: "Sporten bij smog: verstandig?", en: "Training in smog: sensible?" } },
  ],
  "wandelen": ["hardloopweer", "picknickweer", "wat-trek-ik-aan"],
  "buiten-sporten": [
    "hardloopweer",
    "wandelen",
    "padel-of-tennis",
    { ankerCategorie: "sport", anker: "sporten-bij-smog-of-slechte-lucht", tekst: { nl: "Sporten bij smog: verstandig?", en: "Training in smog: sensible?" } },
  ],
  "padel-of-tennis": ["buiten-sporten", "regen-timing", "hardloopweer"],
  // Buiten
  "terras": ["barbecue", "picknickweer", "zonkracht"],
  "barbecue": ["terras", "picknickweer", "regen-timing"],
  "strandweer": ["zonkracht", "buiten-zwemmen", "suppen-of-kajakken"],
  "picknickweer": [
    "terras",
    "barbecue",
    "wandelen",
    { ankerCategorie: "buiten", anker: "buiten-eten-met-kinderen", tekst: { nl: "Buiten eten met kinderen: beste tijdstip?", en: "Eating outside with kids: best time?" } },
  ],
  "buiten-zwemmen": ["strandweer", "zonkracht", "suppen-of-kajakken"],
  "suppen-of-kajakken": ["buiten-zwemmen", "strandweer", "zonkracht"],
  "sterrenkijken": ["terras", "wat-trek-ik-aan"],
  // Huis, tuin en auto
  "was-buiten-drogen": ["hooikoorts", "regen-timing", "zonnepanelen"],
  "auto-wassen": ["ramen-wassen", "krabben", "regen-timing"],
  "grasmaaien": [
    "auto-wassen",
    "ramen-wassen",
    "was-buiten-drogen",
    { ankerCategorie: "huis-tuin", anker: "klusweer-droogste-dag", tekst: { nl: "Klusweer: welke dag is het droogst?", en: "DIY weather: which day is driest?" } },
  ],
  "ramen-wassen": ["auto-wassen", "grasmaaien", "was-buiten-drogen"],
  "zonnepanelen": ["was-buiten-drogen", "zonkracht"],
  // Kleding
  "wat-trek-ik-aan": [
    "fiets-naar-werk",
    "zonkracht",
    "wandelen",
    { ankerCategorie: "kleding", anker: "wat-trek-ik-aan-bij-10-graden", tekst: { nl: "Wat trek ik aan bij 10 graden?", en: "What to wear at 10 degrees?" } },
  ],
  "jas": [
    "wat-trek-ik-aan",
    "korte-broek",
    "t-shirt",
    { ankerCategorie: "kleding", anker: "wat-trek-ik-aan-bij-5-graden", tekst: { nl: "Wat trek ik aan bij 5 graden?", en: "What to wear at 5 degrees?" } },
  ],
  "korte-broek": [
    "wat-trek-ik-aan",
    "t-shirt",
    "jas",
    { ankerCategorie: "kleding", anker: "wat-trek-ik-aan-bij-20-graden", tekst: { nl: "Wat trek ik aan bij 20 graden?", en: "What to wear at 20 degrees?" } },
  ],
  "t-shirt": [
    "wat-trek-ik-aan",
    "korte-broek",
    "jas",
    { ankerCategorie: "kleding", anker: "wat-trek-ik-aan-bij-20-graden", tekst: { nl: "Wat trek ik aan bij 20 graden?", en: "What to wear at 20 degrees?" } },
  ],
  // Zon, lucht en gezondheid
  "zonkracht": ["strandweer", "terras", "buiten-zwemmen", "hooikoorts"],
  "hooikoorts": [
    "was-buiten-drogen",
    "hardloopweer",
    "fiets-naar-werk",
    { ankerCategorie: "gezondheid", anker: "pollenkalender", tekst: { nl: "Pollenkalender: welke pollen wanneer?", en: "Pollen calendar: which pollen when?" } },
  ],
  // Winter
  "krabben": ["gladheid", "auto-wassen", "fiets-naar-werk"],
  "gladheid": ["krabben", "fiets-naar-werk", "wat-trek-ik-aan"],
};

export default function GerelateerdBlok({ toolId }) {
  const items = RELATIES[toolId] ?? [];
  const links = items
    .map((item) => {
      if (typeof item === "string") {
        const t = TOOLS.find((x) => x.id === item);
        return t ? { soort: "tool", tool: t } : null;
      }
      const cat = vindCategorieOpId(item.ankerCategorie);
      return cat ? { soort: "anker", cat, anker: item.anker, tekst: kies(item.tekst) } : null;
    })
    .filter(Boolean);
  if (!links.length) return null;
  return (
    <section className="gerelateerd" aria-label={S.gerelateerd.kop}>
      <h2>{S.gerelateerd.kop}</h2>
      <div className="gerelateerd-rij">
        {links.map((l) =>
          l.soort === "tool" ? (
            <Link key={l.tool.id} href={`/${l.tool.slug}`} className="gerelateerd-link">
              <span className="menulink-icoon" style={{ color: l.tool.kleur }}>
                <Icoon naam={l.tool.icoon} maat={16} />
              </span>
              {l.tool.korteVraag}
            </Link>
          ) : (
            <Link key={`${l.cat.id}-${l.anker}`} href={`/${l.cat.slug}#${l.anker}`} className="gerelateerd-link">
              <span className="menulink-icoon" style={{ color: l.cat.kleur }}>
                <Icoon naam={l.cat.icoon} maat={16} />
              </span>
              {l.tekst}
            </Link>
          )
        )}
      </div>
    </section>
  );
}
