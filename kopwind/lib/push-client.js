/**
 * lib/push-client.js
 *
 * Clienthulpjes voor de PWA-push: service worker registreren, abonneren op
 * meldingen (gekoppeld aan de synccode) en opzeggen. Alleen in de browser.
 */

export function pushOndersteund() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    typeof Notification !== "undefined"
  );
}

/** iOS toont de meldingsvraag alleen als de app vanaf het beginscherm draait. */
export function draaitStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    window.navigator.standalone === true
  );
}

export function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export async function registreerSw() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    return await navigator.serviceWorker.register("/sw.js");
  } catch {
    return null;
  }
}

function base64NaarUint8(base64) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

/**
 * Abonneert dit apparaat op push voor de gegeven synccode.
 * @returns {Promise<{ok: boolean, fout?: string}>}
 */
export async function abonneer(code) {
  if (!pushOndersteund()) {
    return { ok: false, fout: "Deze browser ondersteunt geen push." };
  }
  const permissie = await Notification.requestPermission();
  if (permissie !== "granted") {
    return { ok: false, fout: "Geen toestemming voor meldingen gegeven." };
  }
  const reg = await registreerSw();
  if (!reg) return { ok: false, fout: "Service worker registreren mislukt." };
  await navigator.serviceWorker.ready;

  const sleutelRes = await fetch("/api/push");
  if (!sleutelRes.ok) {
    const d = await sleutelRes.json().catch(() => ({}));
    return { ok: false, fout: d.error ?? "Push is niet geconfigureerd op de server." };
  }
  const { publicKey } = await sleutelRes.json();

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: base64NaarUint8(publicKey),
    });
  }

  const res = await fetch("/api/push", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, subscription: sub.toJSON() }),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    return { ok: false, fout: d.error ?? "Abonneren mislukt." };
  }
  return { ok: true };
}

/** Zegt het push-abonnement van dit apparaat op. */
export async function zegOp(code) {
  if (!("serviceWorker" in navigator)) return;
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = await reg?.pushManager.getSubscription();
  if (!sub) return;
  const endpoint = sub.endpoint;
  try {
    await sub.unsubscribe();
  } catch {
    // Lokaal opzeggen is best effort.
  }
  await fetch("/api/push", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, endpoint }),
  }).catch(() => {});
}

/** Is dit apparaat al geabonneerd? */
export async function isGeabonneerd() {
  if (!pushOndersteund()) return false;
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = await reg?.pushManager.getSubscription();
  return Boolean(sub);
}
