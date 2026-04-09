import { useState, useEffect } from 'react';

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

      const registration = await navigator.serviceWorker.ready;
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

      const registration = await navigator.serviceWorker.ready;
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      };

      const subscription = await registration.pushManager.subscribe(subscribeOptions);

      // Send to backend
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      if (!response.ok) {
        throw new Error('Error al guardar suscripción en servidor');
      }

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
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
      }
    } catch (err) {
      console.error('Error unsubscribing', err);
      setError('Error al Desactivar');
    } finally {
      setLoading(false);
    }
  };

  if (error === 'Push No Soportado') return null;

  return (
    <div className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-lg border border-slate-700">
      <div className="flex flex-col">
        <span className="text-xs font-medium text-slate-400">Notificaciones PWA</span>
        <span className={`text-[10px] ${isSubscribed ? 'text-green-400' : 'text-slate-500'}`}>
          {isSubscribed ? 'Activas' : 'Inactivas'}
        </span>
      </div>
      
      <button
        onClick={isSubscribed ? unsubscribeUser : subscribeUser}
        disabled={loading}
        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
          isSubscribed
            ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
        } disabled:opacity-50`}
      >
        {loading ? (
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          isSubscribed ? 'Desactivar' : 'Activar'
        )}
      </button>

      {error && error !== 'Push No Soportado' && (
        <span className="text-[10px] text-rose-400 bg-rose-400/10 px-1.5 py-0.5 rounded border border-rose-400/20">
          {error}
        </span>
      )}
    </div>
  );
};

export default NotificationToggle;
