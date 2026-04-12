import { useState, useEffect } from 'react';
import { subscribePush } from '../../services/api';

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

  console.log('[PUSH] NotificationToggle component rendering...');

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setError('Push No Soportado');
        setLoading(false);
        return;
      }

      // For admin path, ensure we use the admin service worker
      const isAdminPath = window.location.pathname.startsWith('/backoffice');
      const swPath = isAdminPath ? '/backoffice/sw.js' : '/sw.js';
      const scope = isAdminPath ? '/backoffice/' : '/';

      let registration = await navigator.serviceWorker.getRegistration(scope);
      if (!registration) {
        // Try to register if not found
        registration = await navigator.serviceWorker.register(swPath, { scope });
        await navigator.serviceWorker.ready; // Wait for it to be ready
        registration = await navigator.serviceWorker.getRegistration(scope);
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
      const swPath = isAdminPath ? '/backoffice/sw.js' : '/sw.js';
      const scope = isAdminPath ? '/backoffice/' : '/';

      let registration = await navigator.serviceWorker.getRegistration(scope);
      if (!registration) {
        registration = await navigator.serviceWorker.register(swPath, { scope });
        await navigator.serviceWorker.ready;
        registration = await navigator.serviceWorker.getRegistration(scope);
      }

      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      };

      const subscription = await registration.pushManager.subscribe(subscribeOptions);

      // Send to backend using the unified API service
      await subscribePush(subscription);

      setIsSubscribed(true);
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
    </div>
  );
};

export default NotificationToggle;
