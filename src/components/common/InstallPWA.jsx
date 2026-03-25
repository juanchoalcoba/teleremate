import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import usePWA from "../../hooks/usePWA";
import PWAHelpModal from "../modals/PWAHelpModal";

/**
 * Trigger component for PWA installation.
 * Shows a non-invasive banner and opens the help modal.
 */
export default function InstallPWA() {
  const { 
    isStandalone, 
    isIOS, 
    isInstallable, 
    hasSeenPrompt, 
    markAsSeen, 
    handleInstallClick 
  } = usePWA();

  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Logic to show the banner
    // Cond: Installable && Not in app already && Hasn't seen it THIS session
    if (isInstallable && !isStandalone && !hasSeenPrompt) {
      // Show immediately
      setIsVisible(true);
    }
  }, [isInstallable, isStandalone, hasSeenPrompt]);

  const handleClose = () => {
    setIsVisible(false);
    markAsSeen();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsVisible(false); // Hide banner when modal opens
    markAsSeen();        // Also mark as seen
  };

  if (!isVisible && !isModalOpen) return null;

  return (
    <>
      {/* Non-invasive Bottom Banner (White Theme) */}
      {isVisible && (
        <div className="fixed bottom-4 left-4 right-4 z-100 md:left-auto md:right-8 md:bottom-8 md:w-88 animate-in slide-in-from-bottom-12 duration-700 ease-out">
          <div className="relative overflow-hidden bg-white border border-gray-200 rounded-4xl p-5 shadow-2xl shadow-black/20">
            {/* Subtle brand glow */}
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl" />
            
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20 group">
                <img 
                  src="/logoprincipal.png" 
                  alt="" 
                  className="w-10 h-10 object-contain brightness-110"
                />
              </div>
              <div className="flex-1 pr-6">
                <h3 className="text-black font-bold text-sm tracking-tight">
                  TeleRemate App
                </h3>
                <p className="text-gray-600 text-[11px] leading-tight mt-0.5">
                  Acceso rápido y mejor experiencia. No ocupa espacio.
                </p>
                <button
                  onClick={handleOpenModal}
                  className="mt-2 text-brand-600 text-[11px] font-black uppercase tracking-widest hover:text-brand-700 transition-colors flex items-center gap-1.5"
                >
                  <Download size={12} />
                  Instalar ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unified Help Modal */}
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
