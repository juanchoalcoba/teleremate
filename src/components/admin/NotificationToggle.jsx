import { useState, useEffect } from 'react';
import { subscribeAdminPush, getPushCount, testPushOnDevice } from '../../services/api';

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

  useEffect(() => {
    checkSubscriptionStatus();
    fetchSubscriptionCount();
  }, []);

  const fetchSubscriptionCount = async () => {
    try {
      const response = await getPushCount();
      setSubscriptionCount(response.data.count);
    } catch (err) {
      console.error('Error fetching count:', err);
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setError('No Soportado');
        setLoading(false);
        return;
      }

      // IMPORTANTE: Registramos el SW explícitamente con el scope del Admin
      // Esto separa legalmente el canal del Admin del canal del sitio público
      const registration = await navigator.serviceWorker.register('/push-sw.js', { scope: '/backoffice' });
      const subscription = await registration.pushManager.getSubscription();
      
      setIsSubscribed(!!subscription);
    } catch (err) {
      console.error('Error checking status:', err);
      setError('Error de Estado');
    } finally {
      setLoading(false);
    }
  };

  const subscribeUser = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Pedir permiso
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permiso denegado');
      }

      // 2. Registrar/Obtener el Service Worker con Scope Aislado
      const registration = await navigator.serviceWorker.register('/push-sw.js', { scope: '/backoffice' });
      await navigator.serviceWorker.ready; // Asegurar que esté activo
      
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      };

      // 3. Suscribir
      const subscription = await registration.pushManager.subscribe(subscribeOptions);

      // 4. Enviar al backend (Admin)
      await subscribeAdminPush(subscription);

      setIsSubscribed(true);
      fetchSubscriptionCount();
    } catch (err) {
      console.error('Error al suscribir:', err);
      setError(err.message === 'Permiso denegado' ? 'Permiso Bloqueado' : 'Error al Activar');
    } finally {
      setLoading(false);
    }
  };

  const unsubscribeUser = async () => {
    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.register('/push-sw.js', { scope: '/backoffice' });
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        fetchSubscriptionCount();
      }
    } catch (err) {
      console.error('Error al desactivar:', err);
      setError('Error al Desactivar');
    } finally {
      setLoading(false);
    }
  };

  const testNotification = async () => {
    setTestingNotification(true);
    try {
      const registration = await navigator.serviceWorker.register('/push-sw.js', { scope: '/backoffice' });
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) throw new Error("No hay suscripción");

      await testPushOnDevice({
        subscription,
        title: "TeleRemate Admin 🔔",
        body: "¡Prueba exitosa! Motor unificado funcionando.",
        url: "/backoffice/dashboard"
      });
      
      setError("¡Enviado!");
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError("Error de envío");
      setTimeout(() => setError(null), 3000);
    } finally {
      setTestingNotification(false);
    }
  };

  return (
    <div className="px-1 py-1">
      <button
        onClick={isSubscribed ? unsubscribeUser : subscribeUser}
        disabled={loading}
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
      </button>

      {error && (
        <p className="text-[8px] text-center text-rose-400 mt-1 uppercase font-black truncate">
          {error}
        </p>
      )}

      {isSubscribed && (
        <button
          onClick={testNotification}
          disabled={testingNotification}
          className="w-full mt-2 px-2 py-1 bg-slate-600 text-white text-[8px] rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          {testingNotification ? 'Enviando...' : 'Probar en este equipo'}
        </button>
      )}
    </div>
  );
};

export default NotificationToggle;
