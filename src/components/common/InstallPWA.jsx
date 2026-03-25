import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

export default function InstallPWA() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    // Check if already installed
    const isStandaloneMode = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
    
    setIsIOS(isIOSDevice);
    setIsStandalone(isStandaloneMode);

    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      if (!isStandaloneMode) {
        setShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (isStandalone || (!showPrompt && !isIOS)) return null;

  // Show generic instructions for iOS
  return (
    <div className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:right-8 md:bottom-8 md:w-96 animate-in slide-in-from-bottom-8 duration-500">
      <div className="relative overflow-hidden bg-dark-900 border border-white/10 rounded-3xl p-5 shadow-2xl shadow-black/50">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl" />
        
        <button 
          onClick={() => setShowPrompt(false)}
          className="absolute top-3 right-3 p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
            <Download className="text-white" size={24} />
          </div>
          <div className="flex-1 pr-6">
            <h3 className="text-white font-bold text-base mb-1 font-display">
              Instalar TeleRemate
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              {isIOS 
                ? "Tocá el botón 'Compartir' y luego 'Agregar a Inicio' para instalar la App."
                : "Instalá nuestra aplicación para una experiencia más rápida y acceso directo."}
            </p>
          </div>
        </div>

        {!isIOS && (
          <button
            onClick={handleInstallClick}
            className="w-full mt-4 bg-white text-black font-bold py-3 px-4 rounded-xl hover:bg-gray-200 transition-all text-sm uppercase tracking-wider"
          >
            Instalar ahora
          </button>
        )}
      </div>
    </div>
  );
}
