import React, { useState, useEffect } from "react";
import { Download, Share, X } from "lucide-react";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS] = useState(
    () => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  );
  const [isStandalone] = useState(
    () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone
  );
  const [showPrompt, setShowPrompt] = useState(true);

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
    }
    setDeferredPrompt(null);
  };

  if (isStandalone || !showPrompt) return null;

  // iOS prompt
  if (isIOS) {
    return (
      <div className="fixed bottom-6 left-6 right-6 z-100 animate-in slide-in-from-bottom duration-500">
        <div className="bg-white rounded-3xl p-4 shadow-2xl border border-gray-100 flex items-center gap-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-500" />
          <button 
            onClick={() => setShowPrompt(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
          >
            <X size={16} />
          </button>
          <div className="w-12 h-12 bg-dark-950 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-black/20">
            <img src="/pwa-icon.png" alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex-1 pr-6">
            <p className="text-sm font-black text-gray-900 leading-tight">Instalar TeleRemate</p>
            <p className="text-[10px] text-gray-500 font-bold mt-1">
              Tocá <Share size={12} className="inline-block mx-0.5 text-brand-500" /> y luego <span className="text-brand-600">"Agregar a pantalla de inicio"</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-100 animate-in slide-in-from-bottom duration-700 sm:left-auto sm:right-8 sm:bottom-8 sm:w-80">
      <div className="bg-white rounded-4xl p-5 shadow-2xl border border-gray-100 flex flex-col gap-4 relative overflow-hidden shadow-brand-500/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-3xl rounded-full -mr-16 -mt-16" />
        
        <button 
          onClick={() => setShowPrompt(false)}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition-colors"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-dark-950 rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-black/20 ring-4 ring-gray-50 overflow-hidden">
            <img src="/pwa-icon.png" alt="Logo" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900 leading-tight">TeleRemate App</h3>
            <p className="text-[10px] text-brand-600 font-black uppercase tracking-widest mt-1">Versión Instalable</p>
          </div>
        </div>
        
        <button
          onClick={handleInstallClick}
          className="w-full bg-brand-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-500/30 hover:bg-brand-600 transition-all flex items-center justify-center gap-3 active:scale-95 group"
        >
          <Download size={18} className="group-hover:bounce transition-transform" />
          Instalar TeleRemate
        </button>
      </div>
    </div>
  );
};

export default InstallPWA;
