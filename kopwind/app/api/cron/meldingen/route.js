/**
 * app/api/cron/meldingen/route.js
 *
 * De klok van de meldingen. Wordt elke 5 minuten aangeroepen door een
 * externe gratis cron (bv. cron-job.org) met een geheim:
 *   GET /api/cron/meldingen  met header  x-cron-secret: <CRON_SECRET>
 *
 * V2 (granulair, par. 8): elk schema heeft dagen, een of meer tijden, en
 * een drempel (altijd melden, alleen bij cijfer <= grens, of alleen bij
 * cijfer >= grens). Er zijn twee soorten:
 *
 * 1. Per opgeslagen ROUTE (fiets): briefing op tijdstippen plus een
 *    vertrekherinnering X minuten voor een geplande vertrektijd. De cron
 *    bepaalt de vertrektijden offline (reistijden uit de cache op de
 *    route; ontbreken ze, dan eenmalig vers ophalen en terugschrijven),
 *    dedupliceert via melding_log, en rekent pas daarna het volledige
 *    plan door met actueel weer via dezelfde pijplijn als de browser.
 *    De drempel geldt voor de briefing; een vertrekherinnering gaat
 *    altijd door (die bevat zelf het actuele weer).
 *
 * 2. Per gevolgde LOCATIE-TOOL (zoals de wascheck): een briefing op
 *    tijdstippen voor een vaste plek, met de drempel als filter
 *    ("alleen als het een drooghangdag is").
 *
 * Alles rekent in Nederlandse wandkloktijd (nuAmsterdam), ook al draait
 * de server in UTC.
 */

import { dbGeconfigureerd, dbSelect, dbInsert, dbPatch, dbDelete } from "@/lib/server/db";
import { verstuurNaarAbos, pushGeconfigureerd } from "@/lib/server/push";
import { serverFetch, haalRoutes, haalHourly, nuAmsterdam } from "@/lib/server/externe";
import { berekenPlan } from "@/lib/planner";
import {
  normalizeChainToToday,
  planTimes,
  briefingTekst,
  vertrekTekst,
  migreerRouteSchema,
  dueBriefings,
  dueVertrek,
  drempelLaatDoor,
} from "@/lib/engine/meldingen";
import { DEFAULT_THRESHOLDS } from "@/lib/advice";
import { vindToolOpId, migreerThresholds } from "@/lib/tools";
import { BASIS_VELDEN } from "@/lib/engine/weerbasis";
import { fmtCijfer } from "@/lib/format";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  const gegeven =
    request.headers.get("x-cron-secret") ??
    new URL(request.url).searchParams.get("secret");
  if (!secret || gegeven !== secret) {
    return Response.json({ error: "Geen toegang." }, { status: 401 });
  }
  if (!dbGeconfigureerd() || !pushGeconfigureerd()) {
    return Response.json(
      { error: "Database of push is niet geconfigureerd." },
      { status: 501 }
    );
  }

  const nu = nuAmsterdam();
  let gecheckt = 0;
  let verzonden = 0;
  const fouten = [];

  try {
    const profielen = await dbSelect("profielen?select=code_hash,data&limit=200");

    for (const profiel of profielen) {
      const data = profiel.data ?? {};
      // Drempels zijn sinds v2.1 per tool; oude platte profielen migreren mee.
      const perTool = migreerThresholds(data.thresholds);
      const thresholds = { ...DEFAULT_THRESHOLDS, ...(perTool["fiets-naar-werk"] ?? {}) };
      let dataGewijzigd = false;
      let abosCache = null;
      const abos = async () => {
        if (abosCache == null) {
          abosCache = await dbSelect(
            `push_abos?code_hash=eq.${profiel.code_hash}&select=endpoint,subscription`
          );
        }
        return abosCache;
      };

      // 1. Routes (fiets): briefing plus vertrekherinnering.
      for (const route of Array.isArray(data.routes) ? data.routes : []) {
        const schema = migreerRouteSchema(route.meldingen);
        if (!schema.briefing.aan && !schema.vertrek.aan) continue;
        if (!Array.isArray(route.stops) || route.stops.length < 2) continue;
        gecheckt++;

        try {
          const opties = normalizeChainToToday(route.legOptions ?? [], nu);

          // Reistijden: uit de cache op de route, anders eenmalig vers
          // ophalen en terugschrijven zodat volgende ticks gratis zijn.
          let durations = route.durations;
          const heeftVasteTijden = opties.some(
            (o) => o?.mode === "vertrek" || o?.mode === "aankomst"
          );
          if (
            (!Array.isArray(durations) || durations.length < route.stops.length - 1) &&
            schema.vertrek.aan &&
            heeftVasteTijden
          ) {
            durations = [];
            for (let i = 0; i < route.stops.length - 1; i++) {
              const van = route.stops[i];
              const naar = route.stops[i + 1];
              const rts = await haalRoutes([van.lat, van.lon], [naar.lat, naar.lon]);
              durations.push(rts[0].duration);
            }
            route.durations = durations;
            dataGewijzigd = true;
          }

          const times = planTimes(opties, durations ?? [], nu);
          const due = [
            ...dueBriefings({ schema, log: {}, nu, prefix: route.naam }),
            ...dueVertrek({ schema, times, log: {}, nu, prefix: route.naam }),
          ];
          if (!due.length) continue;

          const teSturen = await dedupe(profiel.code_hash, due);
          if (!teSturen.length) continue;
          const lijst = await abos();
          if (!lijst.length) continue;

          // Nu pas het volledige plan met actueel weer doorrekenen.
          let plan = null;
          try {
            plan = await berekenPlan({
              stops: route.stops,
              legOptions: opties,
              thresholds,
              fetchImpl: serverFetch(),
              nu,
            });
          } catch {
            // Weer of routering even weg: melding zonder details.
          }

          for (const item of teSturen) {
            let tekst;
            if (item.type === "briefing") {
              // Drempel: alleen melden als de dagscore erdoorheen komt.
              if (plan?.dag && !drempelLaatDoor(schema.drempel, plan.dag.score)) {
                continue;
              }
              tekst = plan
                ? briefingTekst(plan, route.naam)
                : {
                    title: `Fietscheck \u00b7 ${route.naam}`,
                    body: "Kon het weer niet ophalen. Open de fietscheck voor je advies van vandaag.",
                  };
            } else {
              const leg = plan?.legs?.[item.legIdx];
              tekst = leg
                ? vertrekTekst(leg, schema.vertrek.minuten ?? 15)
                : {
                    title: `Bijna vertrekken \u00b7 ${route.naam}`,
                    body: "Je volgende rit staat gepland. Open de fietscheck voor het actuele weer.",
                  };
            }
            verzonden += await verstuurNaarAbos(lijst, { ...tekst, tag: item.key });
          }
        } catch (e) {
          fouten.push(`${route.naam}: ${String(e)}`);
        }
      }

      // 2. Locatie-tools (zoals de wascheck): briefing voor een vaste plek.
      const toolMeldingen = data.toolMeldingen ?? {};
      for (const [toolId, schema] of Object.entries(toolMeldingen)) {
        if (!schema?.aan || !schema?.locatie?.lat) continue;
        const tool = vindToolOpId(toolId);
        if (!tool) continue;
        gecheckt++;

        try {
          const due = dueBriefings({
            schema: { dagen: schema.dagen, briefing: { aan: true, tijden: schema.tijden } },
            log: {},
            nu,
            prefix: `tool_${toolId}`,
          });
          if (!due.length) continue;
          const teSturen = await dedupe(profiel.code_hash, due);
          if (!teSturen.length) continue;
          const lijst = await abos();
          if (!lijst.length) continue;

          const tekst = await toolBriefing(tool, schema, nu, perTool);
          if (!tekst) continue; // Drempel hield hem tegen of data ontbrak.
          for (const item of teSturen) {
            verzonden += await verstuurNaarAbos(lijst, { ...tekst, tag: item.key });
          }
        } catch (e) {
          fouten.push(`${toolId}: ${String(e)}`);
        }
      }

      if (dataGewijzigd) {
        try {
          await dbPatch(`profielen?code_hash=eq.${profiel.code_hash}`, { data });
        } catch {
          // Cache terugschrijven is best effort.
        }
      }
    }

    // Oud logboek opruimen (ouder dan 3 dagen).
    const grens = new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString();
    try {
      await dbDelete(`melding_log?verzonden=lt.${encodeURIComponent(grens)}`);
    } catch {
      // Opruimen is best effort.
    }

    return Response.json({ gecheckt, verzonden, fouten });
  } catch (e) {
    return Response.json(
      { error: "Cron mislukt.", detail: String(e), gecheckt, verzonden },
      { status: 502 }
    );
  }
}

/** Dedupe via melding_log: alleen sleutels die echt nieuw zijn komen terug. */
async function dedupe(codeHash, due) {
  const inserted = await dbInsert(
    "melding_log",
    due.map((d) => ({ code_hash: codeHash, sleutel: d.key })),
    { negeerDuplicaten: true }
  );
  const nieuw = new Set(inserted.map((r) => r.sleutel));
  return due.filter((d) => nieuw.has(d.key));
}

/**
 * Berekent de briefing van een locatie-tool met dezelfde overlay als de
 * browser (het overlay-contract): elke tool in het register met een
 * overlay-functie krijgt hier gratis meldingen. Geeft null terug als de
 * drempel de melding tegenhoudt.
 */
async function toolBriefing(tool, schema, nu, perTool = {}) {
  if (typeof tool.overlay !== "function") return null;
  const hourly = await haalHourly(
    schema.locatie.lat,
    schema.locatie.lon,
    tool.weerVelden ?? BASIS_VELDEN,
    2
  );
  const instellingen = { ...(tool.instellingen?.defaults ?? {}), ...(perTool[tool.id] ?? {}) };
  const vandaag = tool.overlay(hourly, nu, instellingen).dagen?.[0];
  if (!vandaag) return null;
  if (!drempelLaatDoor(schema.drempel, vandaag.conditie.score)) return null;
  return {
    title: `${tool.meldingKort}: ${vandaag.conditie.advies} (${fmtCijfer(vandaag.conditie.score)})`,
    body: `${vandaag.status.zin} Voor ${schema.locatie.naam.split(",")[0]}.`,
  };
}
