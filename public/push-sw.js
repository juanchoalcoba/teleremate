// Este archivo maneja las notificaciones de forma independiente para evitar errores de compilación
console.log('[PUSH-SW] Script de notificaciones cargado');

self.addEventListener('push', (event) => {
  let data = { title: "Nuevo Evento", body: "Tienes una nueva notificación de Teleremate." };
  
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.warn('[PUSH-SW] Error parsing JSON, using text or default', e);
    if (event.data) {
        data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/admin-icon-192.png',
    badge: '/iconodefin.png',
    tag: 'teleremate-admin-alert',
    renotify: true,
    requireInteraction: true,
    data: {
      url: data.url || '/backoffice/'
    },
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open', title: 'Ver Panel' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "TeleRemate Admin", options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = new URL(event.notification.data.url || '/backoffice/', self.location.origin).href;

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
