import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import usePWA from "../../hooks/usePWA";
import PWAHelpModal from "../modals/PWAHelpModal";

/**
 * Trigger component for Admin PWA installation.
 * Shows a banner specifically designed for the backoffice.
 */
export default function InstallAdminPWA() {
  const { 
    isStandalone, 
    isIOS, 
    isInstallable, 
    handleInstallClick 
  } = usePWA();

  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Isolated prompt tracking for Admin using a different key
    const seenAdmin = sessionStorage.getItem("admin_pwa_prompt_seen");
    
    if (isInstallable && !isStandalone && !seenAdmin) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isStandalone]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("admin_pwa_prompt_seen", "true");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsVisible(false); // Hide banner when modal opens
    sessionStorage.setItem("admin_pwa_prompt_seen", "true");
  };

  // We only render this inside /backoffice naturally.
  if (!isVisible && !isModalOpen) return null;

  return (
    <>
      {/* Non-invasive Bottom Banner for Admin */}
      {isVisible && (
        <div className="fixed bottom-4 left-4 right-4 z-100 md:left-auto md:right-8 md:bottom-8 md:w-88 animate-in slide-in-from-bottom-12 duration-700 ease-out">
          <div className="relative overflow-hidden bg-dark-900 border border-dark-700 rounded-4xl p-5 shadow-2xl shadow-black/50">
            {/* Subtle brand glow in dark context */}
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl" />
            
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center shrink-0 shadow-lg group relative overflow-hidden">
                 <img 
                  src="/admin-icon-192.png" 
                  alt="" 
                  className="w-10 h-10 object-contain rounded-lg"
                />
              </div>
              <div className="flex-1 pr-6 relative z-10">
                <h3 className="text-white font-bold text-sm tracking-tight flex items-center gap-2">
                  Teleremate Admin
                </h3>
                <p className="text-gray-400 text-[11px] leading-tight mt-0.5">
                  Instala el panel de gestión como App nativa.
                </p>
                <button
                  onClick={handleOpenModal}
                  className="mt-2 text-brand-400 text-[11px] font-black uppercase tracking-widest hover:text-brand-300 transition-colors flex items-center gap-1.5"
                >
                  <Download size={12} />
                  Instalar Panel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reusing unified Help Modal but this will trigger the admin installation flow */}
      <PWAHelpModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isIOS={isIOS}
        isAdmin={true}
        handleInstallClick={handleInstallClick}
      />
    </>
  );
}