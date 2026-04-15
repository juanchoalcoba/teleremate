import { useState, useEffect } from 'react';
import { subscribePush, subscribeAdminPush, testPush, testPushOnDevice, getPushCount } from '../../services/api';

const VAPID_PUBLIC_KEY = "BEpaqg41Bl3SXo9056-cg_Z22GR1cSg9-Q2RbteEkBlL7VA9oHsjGDzoTHADM1poX5M8GSa8WfsCx2GmrFp0Oew";

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const NotificationToggle = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [testingNotification, setTestingNotification] = useState(false);

  console.log('[PUSH] NotificationToggle component rendering...');

  useEffect(() => {
    checkSubscriptionStatus();
    fetchSubscriptionCount();
  }, []);

  const fetchSubscriptionCount = async () => {
    try {
      const response = await getPushCount();
      setSubscriptionCount(response.data.count);
    } catch (err) {
      console.error('Error fetching subscription count:', err);
    }
  };

  const testNotification = async () => {
    setTestingNotification(true);
    try {
      const isAdminPath = window.location.pathname.startsWith('/backoffice');
      const scope = isAdminPath ? '/backoffice/' : '/';
      const reg = await navigator.serviceWorker.getRegistration(scope);
      const subscription = await reg?.pushManager.getSubscription();

      if (!subscription) {
        throw new Error("No hay suscripción activa en este equipo.");
      }

      await testPushOnDevice({
        subscription,
        title: "Test de Notificación",
        body: "¡Funciona! Esta es una prueba solo para tu equipo desde el panel admin.",
        url: "/backoffice/"
      });
      // Temporarily show success message
      setError("¡Recibida! Test enviado a este equipo.");
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      console.error('Error testing notification:', err);
      setError(err.message || "Error al enviar test");
      setTimeout(() => setError(null), 3000);
    } finally {
      setTestingNotification(false);
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setError('Push No Soportado');
        setLoading(false);
        return;
      }

      // For admin path, ensure we use the admin service worker
      const isAdminPath = window.location.pathname.startsWith('/backoffice');
      const swPath = isAdminPath ? '/push-sw.js' : '/sw.js';
      const scope = isAdminPath ? '/backoffice/' : '/';

      let registrations = await navigator.serviceWorker.getRegistrations();
      for (let reg of registrations) {
        if (reg.active && reg.active.scriptURL.includes('/backoffice/sw.js')) {
          console.warn('[PUSH] Unregistering obsolete ghost SW:', reg.active.scriptURL);
          await reg.unregister();
        }
      }

      let registration = await navigator.serviceWorker.getRegistration(scope);
      if (!registration || (registration.active && !registration.active.scriptURL.includes(swPath.substring(1)))) {
        console.log('[PUSH] Registering fresh service worker:', swPath);
        registration = await navigator.serviceWorker.register(swPath, { scope });
      }
      
      // ✅ FIX CRÍTICA: Esperar OBLIGATORIAMENTE que pase a 'activated'
      if (registration.installing || registration.waiting) {
        const worker = registration.installing || registration.waiting;
        await new Promise(resolve => {
          if (worker.state === 'activated') {
            resolve();
          } else {
            worker.addEventListener('statechange', e => {
              if (e.target.state === 'activated') resolve();
            });
          }
        });
        registration = await navigator.serviceWorker.getRegistration(scope);
      } else {
        await navigator.serviceWorker.ready;
      }

      const subscription = await registration.pushManager.getSubscription();
      
      setIsSubscribed(!!subscription);
    } catch (err) {
      console.error('Error checking subscription status:', err);
      setError('Error de Estado');
    } finally {
      setLoading(false);
    }
  };

  const subscribeUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permiso denegado');
      }

      // For admin path, ensure we use the admin service worker
      const isAdminPath = window.location.pathname.startsWith('/backoffice');
      const swPath = isAdminPath ? '/push-sw.js' : '/sw.js';
      const scope = isAdminPath ? '/backoffice/' : '/';

      let registrations = await navigator.serviceWorker.getRegistrations();
      for (let reg of registrations) {
        if (reg.active && reg.active.scriptURL.includes('/backoffice/sw.js')) {
          console.warn('[PUSH] Unregistering obsolete ghost SW before subscribe:', reg.active.scriptURL);
          await reg.unregister();
        }
      }

      let registration = await navigator.serviceWorker.getRegistration(scope);
      if (!registration || (registration.active && !registration.active.scriptURL.includes(swPath.substring(1)))) {
        registration = await navigator.serviceWorker.register(swPath, { scope });
      }

      // ✅ FIX CRÍTICA: Esperar OBLIGATORIAMENTE que pase a 'activated' antes de suscribir a Push
      if (registration.installing || registration.waiting) {
        const worker = registration.installing || registration.waiting;
        await new Promise(resolve => {
          if (worker.state === 'activated') {
            resolve();
          } else {
            worker.addEventListener('statechange', e => {
              if (e.target.state === 'activated') resolve();
            });
          }
        });
        registration = await navigator.serviceWorker.getRegistration(scope);
      } else {
        await navigator.serviceWorker.ready;
      }

      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      };

      const subscription = await registration.pushManager.subscribe(subscribeOptions);

      // Send to backend using the unified API service
      if (isAdminPath) {
        await subscribeAdminPush(subscription);
      } else {
        await subscribePush(subscription);
      }

      setIsSubscribed(true);
      fetchSubscriptionCount(); // Update count after subscribing
    } catch (err) {
      console.error('Failed to subscribe the user: ', err);
      setError(err.message === 'Permiso denegado' ? 'Permiso Bloqueado' : 'Error al Activar');
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeUser = async () => {
    setLoading(true);
    try {
      // For admin path, ensure we use the admin service worker
      const isAdminPath = window.location.pathname.startsWith('/backoffice');
      const scope = isAdminPath ? '/backoffice/' : '/';

      const registration = await navigator.serviceWorker.getRegistration(scope);
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          setIsSubscribed(false);
          fetchSubscriptionCount(); // Update count after unsubscribing
        }
      }
    } catch (err) {
      console.error('Error unsubscribing', err);
      setError('Error al Desactivar');
    } finally {
      setLoading(false);
    }
  };

  if (error === 'Push No Soportado') {
    return (
      <div className="p-2 text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md">
        ⚠️ Notificaciones no compatibles en este navegador/protocolo (usa HTTPS).
      </div>
    );
  }

  return (
    <div className="px-1 py-1">
      <button
        onClick={isSubscribed ? unsubscribeUser : subscribeUser}
        disabled={loading}
        title={isSubscribed ? 'Notificaciones Activas' : 'Activar Notificaciones'}
        className={`w-full px-3 py-2 rounded-xl text-[10px] font-bold transition-all duration-300 flex items-center justify-between gap-2 ${
          isSubscribed
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-brand-500 text-white hover:bg-brand-600 shadow-md shadow-brand-500/10'
        } disabled:opacity-50`}
      >
        <div className="flex items-center gap-2">
          {loading ? (
            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className={`w-1.5 h-1.5 rounded-full ${isSubscribed ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
          )}
          <span>{isSubscribed ? 'ALERTAS: ON' : 'ACTIVAR PUSH'}</span>
        </div>
        {!loading && !isSubscribed && <span className="text-[8px] opacity-50 font-black">CLICK</span>}
      </button>

      {error && error !== 'Push No Soportado' && (
        <p className="text-[8px] text-center text-rose-400 mt-1 uppercase font-black truncate">
          {error}
        </p>
      )}

      {isSubscribed && (
        <div className="mt-2 space-y-1">
          <div className="text-[9px] text-center text-slate-400">
            📱 {subscriptionCount} equipo{subscriptionCount !== 1 ? 's' : ''} registrado{subscriptionCount !== 1 ? 's' : ''}
          </div>
          
          <button
            onClick={testNotification}
            disabled={testingNotification}
            className="w-full px-2 py-1 bg-slate-600 text-white text-[8px] rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {testingNotification ? 'Enviando...' : 'Probar en este equipo'}
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationToggle;
