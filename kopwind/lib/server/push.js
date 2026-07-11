/**
 * lib/server/push.js
 *
 * Web-push verzending met VAPID. Vereist env: VAPID_PUBLIC_KEY,
 * VAPID_PRIVATE_KEY en VAPID_SUBJECT (mailto:...). Eenmalig genereren:
 *   npx web-push generate-vapid-keys
 */

import webpush from "web-push";
import { dbDelete } from "./db.js";

export function pushGeconfigureerd() {
  return Boolean(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

function init() {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? "mailto:beheer@example.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

/**
 * Stuurt een melding naar alle abonnementen van een profiel. Abonnementen
 * die niet meer bestaan (404/410) worden opgeruimd.
 *
 * @param {Array<{endpoint: string, subscription: object}>} abos
 * @param {{title: string, body: string, tag?: string}} payload
 * @returns {Promise<number>} aantal geslaagde verzendingen
 */
export async function verstuurNaarAbos(abos, payload) {
  if (!pushGeconfigureerd() || !abos.length) return 0;
  init();
  let ok = 0;
  for (const abo of abos) {
    try {
      await webpush.sendNotification(abo.subscription, JSON.stringify(payload), {
        TTL: 3600,
        urgency: "high",
      });
      ok++;
    } catch (e) {
      const status = e?.statusCode;
      if (status === 404 || status === 410) {
        // Abonnement bestaat niet meer (app verwijderd): opruimen.
        try {
          await dbDelete(`push_abos?endpoint=eq.${encodeURIComponent(abo.endpoint)}`);
        } catch {
          // Opruimen is best effort.
        }
      }
    }
  }
  return ok;
}
