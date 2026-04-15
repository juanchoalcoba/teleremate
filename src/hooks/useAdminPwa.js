import { useState, useEffect } from "react";

export default function useAdminPWA() {
  const [installPrompt, setInstallPrompt] = useState(null);

  const [isStandalone] = useState(() => {
    if (typeof window === "undefined") return false;
    
    // Check if URL has the specific PWA start parameter
    const isPwaUrl = window.location.search.includes('pwa=admin');
    
    return (
      isPwaUrl ||
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone
    );
  });

  const [isIOS] = useState(() => {
    if (typeof navigator === "undefined") return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  });

  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // 🛡️ GUARDIÁN DE CONTEXTO: Limpiar cualquier prompt residual de la web pública
    const isAdmin = window.location.pathname.startsWith("/backoffice");
    if (isAdmin && window.__pwaInstallPrompt) {
      console.log("[PWA-ADMIN] Limpiando prompt residual de clientes para evitar conflicto.");
      window.__pwaInstallPrompt = null;
    }

    const handler = (e) => {
      const currentPath = window.location.pathname;
      const isCurrentlyAdmin = currentPath.startsWith("/backoffice");

      // BLOQUEO DE SEGURIDAD: Solo capturar si el manifest inyectado es el de admin
      const manifestLink = document.querySelector('link[rel="manifest"]');
      const isCorrectManifest = manifestLink?.href.includes('manifest-admin.json');

      if (!isCurrentlyAdmin || !isCorrectManifest) {
        console.warn("[PWA-ADMIN] Ignorando prompt inapropiado para el contexto actual.");
        return;
      }

      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
      console.log("[PWA-ADMIN] Prompt de instalación de Panel Administrador capturado correctamente.");
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () =>
      window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // iOS fallback admin
  useEffect(() => {
    if (isIOS && !isStandalone) {
      const isAdmin = window.location.pathname.startsWith("/backoffice");
      if (isAdmin) {
        setIsInstallable(true);
      }
    }
  }, [isIOS, isStandalone]);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setInstallPrompt(null);
      setIsInstallable(false);
    }
  };

  return {
    isStandalone,
    isIOS,
    isInstallable,
    handleInstallClick,
  };
}