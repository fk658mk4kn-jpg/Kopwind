/**
 * app/llms.txt/route.js
 * llms.txt per taal, gegenereerd uit het register zodat nieuwe checks
 * automatisch meelopen.
 */
import { TOOLS } from "@/lib/tools";
import { HUB_NAAM, HUB_CLAIM } from "@/lib/brand";
import { SITE_URL } from "@/lib/site";
import { PAD } from "@/lib/i18n/paden";
import { kies } from "@/lib/i18n/locale";

export const dynamic = "force-static";

export function GET() {
  const T = kies({
    nl: {
      sub: "Vijf checks die de uurvoorspelling (Open-Meteo) omzetten in een antwoord: ja of nee, een oordeel van Zeer slecht tot Ideaal, en het beste tijdblok.",
      checks: "Checks",
      uitleg: "Uitleg",
      uitlegZin: "Het weer in gewone taal: korte artikelen over gevoelstemperatuur, droogtijd, wind en buienkans.",
      over: "Over",
      overZin: "Gratis, zonder account, voor 35 Nederlandse steden en elk adres.",
    },
    en: {
      sub: "Five checks that turn the hourly forecast (Open-Meteo) into an answer: yes or no, a verdict from Very poor to Ideal, and the best time window.",
      checks: "Checks",
      uitleg: "Explainers",
      uitlegZin: "The weather in plain words: short articles on feels-like temperature, drying time, wind and rain chance.",
      over: "About",
      overZin: "Free, no account, for 35 Dutch cities and any address.",
    },
  });
  const regels = [
    `# ${HUB_NAAM}`,
    "",
    `> ${HUB_CLAIM}`,
    "",
    T.sub,
    "",
    `## ${T.checks}`,
    ...TOOLS.map((t) => `- [${t.naam}](${SITE_URL}/${t.slug}): ${t.diepte}`),
    "",
    `## ${T.uitleg}`,
    `- [${T.uitleg}](${SITE_URL}${PAD.uitleg}): ${T.uitlegZin}`,
    "",
    `## ${T.over}`,
    `- [${T.over}](${SITE_URL}${PAD.over}): ${T.overZin}`,
    "",
  ];
  return new Response(regels.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
