"use client";

import { useEffect, useRef } from "react";
import { berekenPlan } from "@/lib/planner";
import {
  normalizeChainToToday,
  planTimes,
  dueNotifications,
  briefingTekst,
  vertrekTekst,
} from "@/lib/notify";

const LS_CHAIN = "kopwind.lastChain";
const LS_LOG = "kopwind.meldingenLog";

/**
 * Onzichtbare component die elke 30 seconden checkt of er een melding af
 * moet. Werkt op de laatst opgeslagen keten (kloktijden verschoven naar
 * vandaag) en rekent op het meldmoment het actuele weer door, zodat de
 * melding het volledige plaatje geeft: advies, wind, regen, temperatuur.
 *
 * Beperking, bewust: dit draait in de pagina, dus er moet ergens een
 * tabblad met Kopwind open staan. Echte push zonder open tab vraagt een
 * service worker plus een server die op tijden pusht (bv. Vercel Cron);
 * dat staat in het logboek als vervolgstap.
 */
export default function NotificationManager({ meldingen, thresholds }) {
  const bezigRef = useRef(false);

  useEffect(() => {
    const tick = async () => {
      if (bezigRef.current) return;
      if (typeof Notification === "undefined") return;
      if (Notification.permission !== "granted") return;
      if (!meldingen?.ochtend && !meldingen?.vertrek) return;

      let chain;
      try {
        chain = JSON.parse(localStorage.getItem(LS_CHAIN) ?? "null");
      } catch {
        return;
      }
      if (!chain?.stops || chain.stops.length < 2) return;

      const nu = new Date();
      const opties = normalizeChainToToday(chain.legOptions ?? [], nu);
      const times = planTimes(opties, chain.durations ?? [], nu);

      let log;
      try {
        log = JSON.parse(localStorage.getItem(LS_LOG) ?? "{}") ?? {};
      } catch {
        log = {};
      }

      const due = dueNotifications({ settings: meldingen, log, times, nu });
      if (!due.length) return;

      bezigRef.current = true;
      try {
        // Eerst loggen, dan pas rekenen: voorkomt dubbel vuren bij races.
        for (const item of due) log[item.key] = Date.now();
        for (const [k, ts] of Object.entries(log)) {
          if (Date.now() - ts > 2 * 24 * 3600 * 1000) delete log[k];
        }
        localStorage.setItem(LS_LOG, JSON.stringify(log));

        let plan = null;
        try {
          plan = await berekenPlan({
            stops: chain.stops,
            legOptions: opties,
            thresholds,
            nu,
          });
        } catch {
          // Netwerk of API even weg: we melden dan zonder weerdetails.
        }

        for (const item of due) {
          let t;
          if (item.type === "ochtend") {
            t = plan
              ? briefingTekst(plan)
              : {
                  title: "Kopwind ochtendbriefing",
                  body: "Kon het weer niet ophalen. Open Kopwind voor je advies van vandaag.",
                };
          } else {
            const leg = plan?.legs?.[item.legIdx];
            t = leg
              ? vertrekTekst(leg, meldingen.vertrekMinuten)
              : {
                  title: `Over ${meldingen.vertrekMinuten} min vertrekken`,
                  body: "Je volgende etappe staat gepland. Open Kopwind voor het actuele weer.",
                };
          }
          try {
            const n = new Notification(t.title, { body: t.body, tag: item.key });
            n.onclick = () => window.focus();
          } catch {
            // Sommige platforms weigeren paginameldingen; stil falen.
          }
        }
      } finally {
        bezigRef.current = false;
      }
    };

    tick();
    const interval = setInterval(tick, 30 * 1000);
    const zichtbaar = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", zichtbaar);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", zichtbaar);
    };
  }, [meldingen, thresholds]);

  return null;
}
