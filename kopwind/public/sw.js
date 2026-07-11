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
      icon: "/icons/icon-192.png",
      data: { url: "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((lijst) => {
      for (const client of lijst) {
        if ("focus" in client) return client.focus();
      }
      return self.clients.openWindow("/");
    })
  );
});
