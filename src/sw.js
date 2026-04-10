// v2.0.0 - SW unificado para Teleremate (injectManifest)
// El push listener está AQUÍ DIRECTAMENTE, no en importScripts

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

console.log('[SW] Teleremate Service Worker v2.0.0 iniciado');

// Forzar activación inmediata - crítico para Android
self.addEventListener('install', () => {
  console.log('[SW] Install: skipWaiting forzado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activate: reclamando clientes');
  event.waitUntil(self.clients.claim());
});

// Workbox: Precacheo y rutas de runtime
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({ cacheName: 'images-cache' })
);

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({ cacheName: 'api-cache', networkTimeoutSeconds: 10 })
);

// ─── Push Notifications ─────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  console.log('[SW] Push recibido!', event.data ? 'con datos' : 'sin datos');

  const baseUrl = self.location.origin;
  let title = 'Teleremate';
  let body = 'Tienes un mensaje nuevo.';
  const urlToOpen = baseUrl + '/backoffice';

  try {
    if (event.data) {
      const parsed = event.data.json();
      if (parsed.title) title = parsed.title;
      if (parsed.body) body = parsed.body;
    }
  } catch (e) {
    console.warn('[SW] No se pudo parsear el payload push:', e);
  }

  const options = {
    body,
    icon: baseUrl + '/icon-192.png',
    tag: 'teleremate-admin-alert',
    renotify: true,
    requireInteraction: true,
    data: { url: urlToOpen },
    vibrate: [200, 100, 200, 100, 200],
    actions: [{ action: 'open', title: 'Abrir Admin' }],
  };

  event.waitUntil(
    self.registration.showNotification(title, options).catch((err) => {
      console.error('[SW] Error showNotification:', err);
      // Fallback mínimo sin opciones avanzadas
      return self.registration.showNotification(title, {
        body,
        icon: baseUrl + '/icon-192.png',
      });
    })
  );
});

// ─── Notification Click ──────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen =
    (event.notification.data && event.notification.data.url) ||
    self.location.origin + '/backoffice';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Buscar ventana ya abierta del backoffice y enfocarla
        for (const client of windowClients) {
          if (client.url.includes('/backoffice') && 'focus' in client) {
            return client.focus();
          }
        }
        // Si no hay ninguna, abrir una nueva
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});
