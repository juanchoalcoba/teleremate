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
      data.tag = payload.tag || null;
    }
  } catch (e) {
    console.warn('[PUSH-SW] Error de parseo, usando fallback', e);
    if (event.data) {
        data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/iconodefin.png',
    badge: '/badge-gavel.svg',
    tag: data.tag || 'teleremate-admin-general', // Tag dinámico para evitar colapso/spam
    renotify: data.tag ? true : false,
    requireInteraction: true,
    timestamp: Date.now(),
    data: {
      url: data.url || '/backoffice/'
    },
    vibrate: [100, 50, 100], // Vibración más sutil
    actions: [
      { action: 'open', title: 'Ver Detalles' }
    ]
  };

  const safeSetBadge = () => {
    try {
      if (self.navigator && self.navigator.setAppBadge) {
        return self.navigator.setAppBadge(1).catch(() => Promise.resolve());
      }
    } catch (e) {}
    return Promise.resolve();
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(data.title, options),
      safeSetBadge()
    ])
  );
});



self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Limpiar el badge al entrar
  if ('clearAppBadge' in navigator) {
    navigator.clearAppBadge();
  }

  // Asegurar que la URL sea absoluta y apunte al admin
  const urlToOpen = new URL(event.notification.data.url || '/backoffice/', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // 1. Buscar cualquier ventana que ya esté en el Panel Admin (scope /backoffice)
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        // Comprobar si la ventana pertenece al Admin
        if (client.url.includes('/backoffice') && 'focus' in client) {
          // Si encontramos la ventana, la enfocamos
          return client.focus().then(() => {
            // Y si no está exactamente en la URL de la notificación, la navegamos ahí
            if (client.url !== urlToOpen) {
              return client.navigate(urlToOpen);
            }
          });
        }
      }
      
      // 2. Si no hay ventana de Admin abierta, abrir una nueva
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

