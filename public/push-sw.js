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
    icon: '/icon-192.png',
    badge: '/iconodefin.png',
    tag: 'teleremate-alert', // Crucial para Android
    renotify: true,          // Asegura que el móvil reaccione
    requireInteraction: true,
    data: {
      url: data.url || '/'
    },
    vibrate: [200, 100, 200, 100, 200], // Vibración más notable
    actions: [
      { action: 'open', title: 'Abrir App' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Teleremate", options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data.url || '/';

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
