import React from "react";
import { X, PlusSquare, Smartphone, Download, CheckCircle2 } from "lucide-react";

/**
 * A professional help modal for PWA installation.
 * Provides specific instructions for iOS and a direct button for Android/Chrome.
 */
export default function PWAHelpModal({ 
  isOpen, 
  onClose, 
  isIOS, 
  handleInstallClick,
  isAdmin = false // ✅ Added for identity awareness
}) {
  if (!isOpen) return null;

  const appName = isAdmin ? "Admin Teleremate" : "TeleRemate App";
  const appIcon = isAdmin ? "/admin-icon-192.png" : "/logoprincipal.png";

  return (
    <div className="fixed inset-0 z-110 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-brand-500 rounded-full blur-sm opacity-30" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gray-50 p-1 border border-gray-100 shadow-xl mb-4">
               <img 
                 src={appIcon} 
                 alt="Logo" 
                 className="w-full h-full object-contain rounded-2xl"
               />
            </div>
            <h2 className="text-2xl font-black text-black tracking-tight leading-tight">
              Instalar {appName}
            </h2>
            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              {isIOS
                ? "Agregá la app a tu inicio en 2 pasos"
                : "Disfrutá de acceso instantáneo sin ocupar espacio."}
            </p>
          </div>

          <div className="space-y-6">
            {isIOS ? (
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0 font-black text-lg">
                    ⋯
                  </div>
                  <div className="flex-1">
                    <p className="text-black font-bold text-sm">Paso 1 — Tocá "Compartir"</p>
                    <p className="text-gray-500 text-xs mt-0.5">Buscá los tres puntos o el ícono de compartir en Safari.</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
                    <PlusSquare size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-black font-bold text-sm">Paso 2 — Agregar a inicio</p>
                    <p className="text-gray-500 text-xs mt-0.5">Seleccioná "Agregar a pantalla de inicio".</p>
                  </div>
                </div>

                <button onClick={onClose} className="w-full mt-2 bg-black text-white font-black h-14 rounded-2xl transition-all">Entendido ✓</button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                    <Smartphone className="mx-auto mb-2 text-brand-600" size={24} />
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Mobile Ready</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                    <CheckCircle2 className="mx-auto mb-2 text-brand-600" size={24} />
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Sin Descargas</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    handleInstallClick();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-brand-500 hover:bg-brand-600 text-white font-black h-14 rounded-2xl transition-all shadow-xl shadow-brand-500/20 active:scale-[0.98]"
                >
                  <Download size={20} />
                  INSTALAR AHORA
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
