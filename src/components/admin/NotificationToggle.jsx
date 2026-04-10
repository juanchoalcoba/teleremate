import { useState, useEffect } from 'react';
import api from '../../services/api';

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

      // Send to backend using the unified API service
      await api.subscribePush(subscription);

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

  if (error === 'Push No Soportado') {
    return (
      <div className="p-2 text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md">
        ⚠️ Notificaciones no compatibles en este navegador/protocolo (usa HTTPS).
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700 shadow-inner">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Centro de Alertas</span>
          <span className={`text-[11px] font-medium ${isSubscribed ? 'text-green-400' : 'text-slate-500'}`}>
            {isSubscribed ? '● Suscripto' : '○ Desactivado'}
          </span>
        </div>
        {!isSubscribed && (
          <span className="animate-pulse w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
        )}
      </div>
      
      <button
        onClick={isSubscribed ? unsubscribeUser : subscribeUser}
        disabled={loading}
        className={`w-full px-3 py-2 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
          isSubscribed
            ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30'
            : 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20'
        } disabled:opacity-50`}
      >
        {loading ? (
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          isSubscribed ? 'Desactivar Notificaciones' : '🔔 Activar Notificaciones'
        )}
      </button>

      {error && error !== 'Push No Soportado' && (
        <span className="text-[10px] text-center text-rose-400 bg-rose-400/10 px-1.5 py-1 rounded border border-rose-400/20">
          {error}
        </span>
      )}
    </div>
  );
};

export default NotificationToggle;
