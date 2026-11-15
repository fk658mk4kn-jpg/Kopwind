import { notFound } from "next/navigation";
import RekenPagina from "@/components/reken/RekenPagina";
import NoorderlichtNachten from "@/components/reken/NoorderlichtNachten";
import { IS_EN } from "@/lib/i18n/locale";
import { haalKp, nachten, kpOordeel } from "@/lib/noorderlicht";

/**
 * Noorderlichtpagina (v3.37.0). Haalt de Kp-verwachting server-side op,
 * zodat de stand van vannacht ook in de HTML en de title staat. Een
 * kwartier revalidatie. Lukt NOAA niet, dan een eerlijke melding.
 */
export const revalidate = 900;

async function stand() {
  const kp = await haalKp();
  if (!kp) return null;
  return nachten(kp).map((n) => ({ ...n, oordeel: kpOordeel(n.kp) }));
}

export async function generateMetadata() {
  if (IS_EN) return {};
  const n = await stand();
  const eerste = n?.[0];
  const title = eerste
    ? `Kan ik vannacht het noorderlicht zien? Kp ${eerste.kp.toFixed(1).replace(".", ",")}: ${eerste.oordeel.woord.toLowerCase()}`
    : "Kan ik vannacht het noorderlicht zien in Nederland?";
  return {
    title,
    description:
      "De kans op noorderlicht in Nederland per nacht: de verwachte Kp-index van NOAA vertaald naar wat je in het noorden en de rest van het land kunt zien, met de bewolking voor jouw plek.",
    alternates: { canonical: "/kan-ik-het-noorderlicht-zien" },
  };
}

export default async function NoorderlichtPagina() {
  if (IS_EN) notFound();
  const n = await stand();
  return (
    <RekenPagina id="noorderlicht">
      {n?.length ? (
        <NoorderlichtNachten nachten={n} />
      ) : (
        <section className="paneel aftel-hoofd">
          <p className="aftel-sub">
            De Kp-verwachting van NOAA is op dit moment niet bereikbaar. De uitleg hieronder blijft gelden; probeer het over een kwartier opnieuw.
          </p>
        </section>
      )}
    </RekenPagina>
  );
}
