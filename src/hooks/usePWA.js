import { useState, useEffect } from "react";

const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(
    () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone
  );
  const [isIOS] = useState(
    () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  return {
    isInstallable,
    isStandalone,
    isIOS,
    handleInstallClick,
  };
};

export default usePWA;
