import React, { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import useAdminPWA from "../../hooks/useAdminPwa";// ✅ HOOK CORRECTO
import PWAHelpModal from "../modals/PWAHelpModal";

export default function InstallAdminPWA() {
  const { 
    isStandalone, 
    isIOS, 
    isInstallable, 
    handleInstallClick 
  } = useAdminPWA();

  // ✅ SOLO depende del hook correcto
  const hasInstallPrompt = isInstallable;

  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isStandalone) {
      setIsVisible(false);
      return;
    }

    const seenAdmin = localStorage.getItem("admin_pwa_prompt_dismissed");
    if (seenAdmin) return;

    // Solo mostrar si es instalable nativamente o es iOS
    if (hasInstallPrompt || isIOS) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [hasInstallPrompt, isStandalone, isIOS]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("admin_pwa_prompt_dismissed", "true");
  };

  const handlePrimaryAction = () => {
    if (hasInstallPrompt) {
      handleInstallClick();
    } else if (isIOS) {
      setIsModalOpen(true);
    }
  };

  if (isStandalone) return null;
  if (!isVisible && !isModalOpen) return null;

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-4 left-4 right-4 z-100 md:left-auto md:right-8 md:bottom-8 md:w-88 animate-in slide-in-from-bottom-12 duration-700 ease-out">
          <div className="relative overflow-hidden bg-brand-600 border border-brand-500 rounded-4xl p-5 shadow-2xl shadow-black/40">
            
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 p-2 text-white/50 hover:text-white rounded-full transition-all"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center shrink-0 shadow-lg border border-white/10">
                <Smartphone className="text-white" size={28} />
              </div>

              <div className="flex-1 pr-6">
                <h3 className="text-white font-bold text-sm tracking-tight">
                  Panel Administrador
                </h3>

                <p className="text-gray-300 text-[11px] leading-tight mt-0.5">
                  {hasInstallPrompt ? "Instalá el panel nativo ahora." : "Instrucciones para iPhone."}
                </p>

                <button
                  onClick={handlePrimaryAction}
                  className="mt-3 w-full bg-white text-brand-600 h-10 rounded-xl font-black text-[10px] uppercase tracking-wider active:scale-[0.95] transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/20"
                >
                  {hasInstallPrompt ? <Download size={14} /> : <Smartphone size={14} />}
                  {hasInstallPrompt ? "INSTALAR PANEL" : "CÓMO INSTALAR"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PWAHelpModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isIOS={isIOS}
        isInstallable={isInstallable}
        handleInstallClick={handleInstallClick}
      />
    </>
  );
}