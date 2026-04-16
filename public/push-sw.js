// Este archivo maneja las notificaciones de forma independiente para evitar errores de compilación
// Versión Optimizada (Miércoles Peak) - Especial para Panel Admin
console.log('[PUSH-SW] Motor de notificaciones activado - Versión Admin');

self.addEventListener('push', (event) => {
  let data = { title: "Nuevo Evento", body: "Tienes una nueva notificación de Teleremate." };
  
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.warn('[PUSH-SW] Error de parseo, usando texto o fallback', e);
    if (event.data) {
        data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/admin-icon-192.png', // Icono específico del Admin (Restaurado de Miércoles Mañana)
    badge: '/iconodefin.png',
    tag: 'teleremate-admin-alert', // TAG Único para evitar colisiones con el sitio público
    renotify: true,
    requireInteraction: true,
    data: {
      url: data.url || '/backoffice/'
    },
    vibrate: [300, 100, 300], // Patrón de vibración de alta intensidad
    actions: [
      { action: 'open', title: 'Ver en Panel' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "TeleRemate Admin", options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // Asegurar que la URL sea absoluta
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
