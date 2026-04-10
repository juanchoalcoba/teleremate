// v1.0.6 - Refuerzo de rutas absolutas para Android
console.log('[PUSH-SW] Script de notificaciones cargado v1.0.6');

self.addEventListener('push', (event) => {
  const baseUrl = self.location.origin;
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
    icon: `${baseUrl}/icon-192.png`,
    tag: 'teleremate-alert',
    renotify: true,
    requireInteraction: true,
    data: {
      url: data.url || '/'
    },
    vibrate: [200, 100, 200, 100, 200],
    actions: [
      { action: 'open', title: 'Abrir App' }
    ]
  };

  const promiseChain = self.registration.showNotification(data.title || "Teleremate", options)
    .then(() => {
      // Establecer el punto rojo (Badge) en el icono de la App
      if ('setAppBadge' in navigator) {
        navigator.setAppBadge(1).catch(err => console.log('Error setting app badge:', err));
      }
    })
    .catch((err) => {
      console.error('[PUSH-SW] Error showing notification:', err);
      // Fallback simple por si fallan las opciones avanzadas
      return self.registration.showNotification("Notificación", { body: "Tienes un mensaje nuevo" });
    });

  event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Limpiar el badge al hacer click
  if ('clearAppBadge' in navigator) {
    navigator.clearAppBadge().catch(err => console.log('Error clearing badge:', err));
  }
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
