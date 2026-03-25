import { useState, useEffect } from "react";

/**
 * Hook to manage PWA installation state and platform detection.
 */
export default function usePWA() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [hasSeenPrompt, setHasSeenPrompt] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // 1. Detect environment
    const isStandaloneMode = 
      window.matchMedia("(display-mode: standalone)").matches || 
      window.navigator.standalone || 
      document.referrer.includes("android-app://");
    
    const isIOSDevice = 
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    setIsStandalone(isStandaloneMode);
    setIsIOS(isIOSDevice);

    // 2. Check if user already saw the prompt in this session
    const seen = sessionStorage.getItem("pwa_prompt_seen");
    setHasSeenPrompt(!!seen);

    // 3. Listen for native install prompt (Android/Chrome)
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // 4. Special case for iOS: It's technically "installable" if not standalone
    if (isIOSDevice && !isStandaloneMode) {
      setIsInstallable(true);
    }

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
