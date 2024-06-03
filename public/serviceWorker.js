// @ts-check

/// <reference no-default-lib="true"/>
/// <reference lib="esnext"/>
/// <reference lib="webworker"/>

const sw = /** @type {ServiceWorkerGlobalScope & typeof globalThis} */ (
  globalThis
);
sw.addEventListener("push", (event) => {
  const message = event.data?.json();
  const { title, body, id } = message;
  //console.log("received message ", message);
  async function handlePushEvent() {
    const windowClients = await sw.clients.matchAll({ type: "window" });
    if (windowClients.length > 0) {
      const appInForeground = windowClients.some((client) => client.focused);
      if (appInForeground) {
        console.log("app is in foreground");
        return;
      }
    }
    await sw.registration.showNotification(title, {
      body,
      badge: "/images/ezh-logo-no-text.png",
      // action: [{ title: "open chat", action: "open_chat" }],
      tag: id,
      // renotify: true,
      data: { id },
    });
  }
  event.waitUntil(handlePushEvent());
});

sw.addEventListener("notificationclick", (event) => {
  const notification = event.notification;
  notification.close();

  async function handleNotificationClick() {
    const windowClients = await sw.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });

    const channelId = notification.data.id;

    if (windowClients.length > 0) {
      sw.clients.openWindow("/chat/" + channelId);
    } else {
      sw.clients.openWindow("/chat/" + channelId);
    }
  }
  event.waitUntil(handleNotificationClick());
});
