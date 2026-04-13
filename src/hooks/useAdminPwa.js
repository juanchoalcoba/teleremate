import { useState, useEffect } from "react";

export default function useAdminPWA() {
  const [installPrompt, setInstallPrompt] = useState(null);

  const [isStandalone] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
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
    const handler = (e) => {
      const isAdmin = window.location.pathname.startsWith("/backoffice");

      // 🔥 SOLO ADMIN
      if (!isAdmin) return;

      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
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