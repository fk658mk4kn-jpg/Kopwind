/**
 * Service worker: ontvangt server-push en toont de melding, ook als de
 * app dicht is (op iPhone: mits toegevoegd aan het beginscherm, iOS 16.4+).
 */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { title: "Fietscheck", body: event.data ? event.data.text() : "" };
  }
  event.waitUntil(
    self.registration.showNotification(data.title ?? "Fietscheck", {
      body: data.body ?? "",
      tag: data.tag,
      icon: data.icon ?? "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: data.url ?? "/" },
    })
  );
});

// Browsers vernieuwen push-abonnementen; zonder deze handler sterft de
// koppeling stil (het oude endpoint wordt 410). Opnieuw abonneren met
// dezelfde sleutel en de server het nieuwe endpoint laten overnemen.
self.addEventListener("pushsubscriptionchange", (event) => {
  const oud = event.oldSubscription;
  const sleutel = oud?.options?.applicationServerKey;
  if (!sleutel) return;
  event.waitUntil(
    self.registration.pushManager
      .subscribe({ userVisibleOnly: true, applicationServerKey: sleutel })
      .then((sub) =>
        fetch("/api/push/vervang", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ oudEndpoint: oud.endpoint, subscription: sub.toJSON() }),
        })
      )
      .catch(() => {})
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url ?? "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((lijst) => {
      for (const client of lijst) {
        if ("focus" in client) {
          if ("navigate" in client) client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
