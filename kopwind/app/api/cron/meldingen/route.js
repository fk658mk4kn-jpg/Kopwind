/**
 * app/api/cron/meldingen/route.js
 *
 * De klok van de meldingen. Wordt elke 5 minuten aangeroepen door een
 * externe gratis cron (bv. cron-job.org) met een geheim:
 *   GET /api/cron/meldingen  met header  x-cron-secret: <CRON_SECRET>
 *
 * Per profiel en per opgeslagen route met meldingen aan:
 * 1. Bepaal de geplande vertrektijden van vandaag (kloktijden van de route,
 *    reistijden uit de cache of eenmalig vers opgehaald).
 * 2. Kijk of er een ochtendbriefing of vertrekherinnering in het venster valt.
 * 3. Dedupliceer via de melding_log tabel (insert die duplicaten negeert).
 * 4. Reken dan pas het volledige plan door met actueel weer en verstuur de
 *    push naar alle gekoppelde apparaten.
 *
 * Alles rekent in Nederlandse wandkloktijd (nuAmsterdam), ook al draait de
 * server in UTC.
 */

import { dbGeconfigureerd, dbSelect, dbInsert, dbPatch, dbDelete } from "@/lib/server/db";
import { verstuurNaarAbos, pushGeconfigureerd } from "@/lib/server/push";
import { serverFetch, haalRoutes, nuAmsterdam } from "@/lib/server/externe";
import { berekenPlan } from "@/lib/planner";
import {
  normalizeChainToToday,
  planTimes,
  dueNotifications,
  briefingTekst,
  vertrekTekst,
} from "@/lib/notify";
import { DEFAULT_THRESHOLDS } from "@/lib/advice";

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
    const profielen = await dbSelect(
      "profielen?select=code_hash,data&limit=200"
    );

    for (const profiel of profielen) {
      const data = profiel.data ?? {};
      const routes = Array.isArray(data.routes) ? data.routes : [];
      const thresholds = { ...DEFAULT_THRESHOLDS, ...(data.thresholds ?? {}) };
      let dataGewijzigd = false;

      for (const route of routes) {
        const m = route.meldingen;
        if (!m || (!m.ochtend && !m.vertrek)) continue;
        if (!Array.isArray(route.stops) || route.stops.length < 2) continue;
        gecheckt++;

        try {
          const opties = normalizeChainToToday(route.legOptions ?? [], nu);

          // Reistijden: uit de cache op de route, anders eenmalig vers
          // ophalen en terugschrijven zodat de volgende ticks gratis zijn.
          let durations = route.durations;
          const heeftVasteTijden = opties.some(
            (o) => o?.mode === "vertrek" || o?.mode === "aankomst"
          );
          if (
            (!Array.isArray(durations) || durations.length < route.stops.length - 1) &&
            m.vertrek &&
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
          const due = dueNotifications({
            settings: m,
            log: {},
            times,
            nu,
            prefix: route.naam,
          });
          if (!due.length) continue;

          // Dedupe: alleen sleutels die echt nieuw zijn komen terug.
          const inserted = await dbInsert(
            "melding_log",
            due.map((d) => ({ code_hash: profiel.code_hash, sleutel: d.key })),
            { negeerDuplicaten: true }
          );
          const nieuweSleutels = new Set(inserted.map((r) => r.sleutel));
          const teSturen = due.filter((d) => nieuweSleutels.has(d.key));
          if (!teSturen.length) continue;

          const abos = await dbSelect(
            `push_abos?code_hash=eq.${profiel.code_hash}&select=endpoint,subscription`
          );
          if (!abos.length) continue;

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
            if (item.type === "ochtend") {
              tekst = plan
                ? briefingTekst(plan, route.naam)
                : {
                    title: `Fietscheck · ${route.naam}`,
                    body: "Kon het weer niet ophalen. Open de fietscheck voor je advies van vandaag.",
                  };
            } else {
              const leg = plan?.legs?.[item.legIdx];
              tekst = leg
                ? vertrekTekst(leg, m.vertrekMinuten ?? 15)
                : {
                    title: `Bijna vertrekken · ${route.naam}`,
                    body: "Je volgende rit staat gepland. Open de fietscheck voor het actuele weer.",
                  };
            }
            verzonden += await verstuurNaarAbos(abos, {
              ...tekst,
              tag: item.key,
            });
          }
        } catch (e) {
          fouten.push(`${route.naam}: ${String(e)}`);
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
