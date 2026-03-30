import { useState, useEffect } from "react";

/**
 * Hook to manage PWA installation state and platform detection.
 */
export default function usePWA() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isStandalone] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(display-mode: standalone)").matches || 
      window.navigator.standalone || 
      (document.referrer && document.referrer.includes("android-app://"));
  });
  const [isIOS] = useState(() => {
    if (typeof navigator === "undefined") return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  });
  const [hasSeenPrompt, setHasSeenPrompt] = useState(() => {
    if (typeof sessionStorage === "undefined") return false;
    return !!sessionStorage.getItem("pwa_prompt_seen");
  });
  const [isInstallable, setIsInstallable] = useState(() => {
    if (typeof navigator === "undefined" || typeof window === "undefined") return false;
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const standalone = window.matchMedia("(display-mode: standalone)").matches || 
      window.navigator.standalone || 
      (document.referrer && document.referrer.includes("android-app://"));
    return ios && !standalone;
  });

  useEffect(() => {
    // 3. Listen for native install prompt (Android/Chrome)
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const markAsSeen = () => {
    sessionStorage.setItem("pwa_prompt_seen", "true");
    setHasSeenPrompt(true);
  };

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        setInstallPrompt(null);
        setIsInstallable(false);
      }
    }
  };

  return {
    isStandalone,
    isIOS,
    isInstallable,
    hasSeenPrompt,
    markAsSeen,
    handleInstallClick,
  };
}
