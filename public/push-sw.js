// Este archivo maneja las notificaciones de forma independiente para evitar errores de compilación
// Versión Optimizada (Miércoles Peak) - Especial para Panel Admin
console.log('[PUSH-SW] Motor de notificaciones activado - Versión Admin');

self.addEventListener('push', (event) => {
  let data = { 
    title: "TeleRemate Admin 🔔", 
    body: "Nueva actualización en el panel de gestión." 
  };
  
  try {
    if (event.data) {
      const payload = event.data.json();
      data.title = payload.title || data.title;
      data.body = payload.body || data.body;
      data.url = payload.url || '/backoffice/';
    }
  } catch (e) {
    console.warn('[PUSH-SW] Error de parseo, usando fallback', e);
    if (event.data) {
        data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/admin-icon-192.png',
    badge: '/iconodefin.png',
    tag: 'teleremate-admin-alert', // TAG Único para evitar colisiones
    renotify: true,
    requireInteraction: true,
    data: {
      url: data.url || '/backoffice/'
    },
    vibrate: [300, 100, 300],
    actions: [
      { action: 'open', title: 'Ver en Panel' }
    ]
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(data.title, options),
      // App Badging API: Poner el puntito rojo en el icono de la App
      (self.navigator && self.navigator.setAppBadge) ? self.navigator.setAppBadge(1) : Promise.resolve()
    ])
  );
});



self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Limpiar el badge al entrar
  if ('clearAppBadge' in navigator) {
    navigator.clearAppBadge();
  }
  const urlToOpen = new URL(event.notification.data.url || '/backoffice/', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Intentar enfocar una pestaña abierta
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Si no hay pestaña abierta, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
