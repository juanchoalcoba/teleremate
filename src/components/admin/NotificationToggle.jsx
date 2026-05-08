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

      if (Notification.permission === 'denied') {
        setError('Bloqueado en Navegador');
      }

      // IMPORTANTE: Usamos el SW unificado que ya registra VitePWA
      const registration = await navigator.serviceWorker.ready;
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

      // 2. Obtener el Service Worker Unificado
      const registration = await navigator.serviceWorker.ready;
      
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
      setError(err.message === 'Permiso denegado' ? 'Bloqueado (Revisa el candado)' : 'Error al Activar');
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
        fetchSubscriptionCount();
      }
    } catch (err) {
      console.error('Error al desactivar:', err);
      setError('Error al Desactivar');
    } finally {
      setLoading(false);
    }
  };

  const emergencyReset = async () => {
    if (!confirm("Esto reseteará todas las notificaciones en este equipo para resolver conflictos. ¿Continuar?")) return;
    
    setLoading(true);
    try {
      // 1. Desuscribir si es posible
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) await subscription.unsubscribe();

      // 2. Desregistrar TODOS los service workers para limpiar scopes duplicados
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let reg of registrations) {
        await reg.unregister();
      }

      // 3. Limpiar cachés de la app
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      alert("Limpieza completada. Por favor, recarga la página y vuelve a Activar Push.");
      window.location.reload();
    } catch (err) {
      console.error('Error en reset:', err);
      alert("Hubo un error en la limpieza.");
    } finally {
      setLoading(false);
    }
  };

  const testNotification = async () => {
    setTestingNotification(true);
    setError(null);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (!subscription) throw new Error("No hay suscripción activa en este navegador.");

      await testPushOnDevice({
        subscription,
        title: "TeleRemate Admin 🔔",
        body: "¡Prueba desde Servidor Exitosa!",
        url: "/backoffice"
      });
      
      setError("¡Enviado con éxito!");
      setTimeout(() => setError(null), 5000);
    } catch (err) {
      console.error('Error en test:', err);
      const msg = err.response?.data?.message || err.message || "Error de envío";
      setError(msg);
      // No quitar el error tan rápido si es un fallo real
      if (msg !== "¡Enviado con éxito!") setTimeout(() => setError(null), 10000);
    } finally {
      setTestingNotification(false);
    }
  };

  const testLocalNotification = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification("TeleRemate Local 🖥️", {
        body: "Si ves esto, el navegador permite notificaciones. El problema es el servidor o conexión.",
        icon: '/iconodefin.png',
        badge: '/badge-gavel.svg',
        tag: 'local-test'
      });
    } catch (err) {
      alert("Error local: " + err.message);
      setError("Error en navegador");
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
        <p className="text-[8px] text-center text-rose-400 mt-1 uppercase font-black">
          {error}
        </p>
      )}

      {isSubscribed && (
        <div className="flex flex-col gap-1 mt-2">
          <button
            onClick={testNotification}
            disabled={testingNotification}
            className="w-full px-2 py-1 bg-slate-600 text-white text-[8px] rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors uppercase font-black"
          >
            {testingNotification ? 'Enviando...' : 'Probar vía Servidor'}
          </button>

          <button
            onClick={testLocalNotification}
            className="w-full px-2 py-1 bg-sky-600/20 text-sky-400 text-[8px] rounded-lg border border-sky-500/20 hover:bg-sky-500/30 transition-all uppercase font-black"
          >
            Prueba Local (Navegador)
          </button>
          
          <button
            onClick={emergencyReset}
            className="w-full px-2 py-1 bg-rose-500/10 text-rose-400 text-[7px] rounded-lg border border-rose-500/20 hover:bg-rose-500/20 transition-all uppercase font-bold"
          >
            Resetear Configuración
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationToggle;
