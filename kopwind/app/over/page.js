import Link from "next/link";
import { HUB_NAAM } from "@/lib/brand";
import { kies } from "@/lib/i18n/locale";
import { PAD } from "@/lib/i18n/paden";

const T = kies({
  nl: {
    metaTitel: `Over ${HUB_NAAM}`,
    metaOms: "Waarom Kan het vandaag? bestaat, hoe de checks rekenen en waar de grenzen liggen.",
    heroSub: "Een oordeel, het beste moment en de reden erbij. Daar heb je wat aan.",
    kop1: "Waarom dit bestaat",
    p1: (naam) => `Een weersverwachting vertelt wat er uit de lucht komt; jij wilt weten of je plan doorgaat. ${naam} pakt het daarom per vraag aan: elke check weegt precies de factoren die voor die ene beslissing tellen en komt terug met een oordeel, het beste moment en een uitleg in gewone taal.`,
    kop2: "Hoe het werkt",
    p2: "Elke check haalt live de uurvoorspelling op voor jouw plek en rekent daar per uur op. Het oordeel (van Zeer slecht tot Ideaal) zegt hoe goed de omstandigheden zijn; een aparte statusregel zegt of je het nu nog redt en wanneer het beste blok valt. Alles werkt zonder account, is gratis en draait op je beginscherm als app, met meldingen op de momenten die jij kiest.",
    kop3: "Eerlijk over de grenzen",
    p3a: "Een voorspelling blijft een voorspelling. We tonen altijd het tijdstip waarop de data is opgehaald en trekken geen conclusies die de data niet dragen. Waar het model twijfelt, zeggen we dat gewoon. Meer weten over de rekensommen? Lees",
    linkUitleg: "het weer in gewone taal",
    p3b: "of check",
    linkBronnen: "de bronnen",
  },
  en: {
    metaTitel: `About ${HUB_NAAM}`,
    metaOms: "Why Good day for it? exists, how the checks calculate and where the limits are.",
    heroSub: "A verdict, the best moment and the reason. That is what you can act on.",
    kop1: "Why this exists",
    p1: (naam) => `A forecast tells you what falls out of the sky; you want to know whether your plan goes ahead. ${naam} therefore works per question: every check weighs exactly the factors that matter for that one decision and comes back with a verdict, the best moment and an explanation in plain words.`,
    kop2: "How it works",
    p2: "Every check fetches the live hourly forecast for your place and works per hour. The verdict (from Very poor to Ideal) says how good the conditions are; a separate status line says whether you can still make it and when the best window falls. Everything works without an account, is free and runs on your home screen as an app, with notifications at the moments you choose.",
    kop3: "Honest about the limits",
    p3a: "A forecast remains a forecast. We always show the time the data was fetched and draw no conclusions the data can't carry. Where the model is unsure, we simply say so. Want the maths? Read",
    linkUitleg: "the weather in plain words",
    p3b: "or check",
    linkBronnen: "the sources",
  },
});

export const metadata = {
  title: { absolute: T.metaTitel },
  description: T.metaOms,
  alternates: { canonical: PAD.over },
};

export default function OverPagina() {
  return (
    <main>
      <div className="tool-hero">
        <h1>{T.metaTitel}</h1>
        <p>{T.heroSub}</p>
      </div>
      <section className="seotekst">
        <h2>{T.kop1}</h2>
        <p>{T.p1(HUB_NAAM)}</p>
        <h2>{T.kop2}</h2>
        <p>{T.p2}</p>
        <h2>{T.kop3}</h2>
        <p>
          {T.p3a} <Link href={PAD.uitleg}>{T.linkUitleg}</Link> {T.p3b}{" "}
          <Link href={PAD.bronnen}>{T.linkBronnen}</Link>.
        </p>
      </section>
    </main>
  );
}
