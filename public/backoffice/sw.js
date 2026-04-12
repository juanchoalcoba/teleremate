// Admin Service Worker for push notifications
console.log('[ADMIN-SW] Admin service worker loaded');

self.addEventListener('push', (event) => {
  let data = { title: "ADMIN - Nuevo Evento", body: "Tienes una nueva notificación administrativa de Teleremate." };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.warn('[ADMIN-SW] Error parsing JSON, using text or default', e);
    if (event.data) {
        data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/admin-icon-192.png',
    badge: '/admin-icon-192.png',
    tag: 'teleremate-admin-alert',
    renotify: true,
    requireInteraction: true,
    data: {
      url: data.url || '/backoffice/'
    },
    vibrate: [200, 100, 200, 100, 200],
    actions: [
      { action: 'open', title: 'Abrir Panel Admin' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "ADMIN Teleremate", options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url || '/backoffice/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});