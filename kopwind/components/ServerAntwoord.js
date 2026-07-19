import { haalHourly } from "@/lib/server/externe";
import { BASIS_VELDEN } from "@/lib/engine/weerbasis";
import { bouwStadAntwoord, nuInNederland, fmtStempel } from "@/lib/steden/serverAntwoord";
import { kies } from "@/lib/i18n/locale";

/**
 * Server-antwoordblok voor de stadpagina's (v3.27.0 "Solano"): het
 * verdict, de kernzin en een tijdstempel, server-side gerenderd zodat
 * het antwoord in de ruwe HTML staat (snippets, AI-citeerbaarheid).
 * Draait op standaardinstellingen; de live check eronder rekent na
 * hydration met de voorkeuren van de bezoeker en is dus leidend.
 *
 * Robuust by design: een timeout van vier seconden en elke fout geeft
 * null terug, dan rendert de pagina gewoon zonder blok (zoals voor
 * deze versie). ISR ververst het blok per pagina (zie revalidate op
 * de route); het tijdstempel maakt de leeftijd eerlijk.
 */
export default async function ServerAntwoord({ tool, stad }) {
  let hourly = null;
  try {
    hourly = await Promise.race([
      haalHourly(stad.lat, stad.lon, tool.weerVelden ?? BASIS_VELDEN, 2),
      new Promise((_, weiger) => setTimeout(() => weiger(new Error("timeout")), 4000)),
    ]);
  } catch {
    return null;
  }
  const nu = nuInNederland();
  const antwoord = bouwStadAntwoord(tool, hourly, nu);
  if (!antwoord) return null;

  return (
    <div className="stad-antwoord">
      <p className="stad-antwoord-kern">
        <span className={"badge " + antwoord.kleur}>{antwoord.label}</span>
        <span className="stad-antwoord-zin">{antwoord.zin}</span>
      </p>
      {antwoord.metric && <p className="stad-antwoord-metric">{antwoord.metric}</p>}
      <p className="stad-antwoord-noot">
        {kies({
          nl: `Live berekend om ${fmtStempel(nu)} op standaardinstellingen; de check hieronder rekent met jouw voorkeuren.`,
          en: `Calculated live at ${fmtStempel(nu)} on default settings; the check below uses your own preferences.`,
        })}
      </p>
    </div>
  );
}
