import React from "react";
import { X, Share, PlusSquare, Smartphone, Download, CheckCircle2 } from "lucide-react";

/**
 * A professional help modal for PWA installation.
 * Provides specific instructions for iOS and a direct button for Android/Chrome.
 */
export default function PWAHelpModal({ 
  isOpen, 
  onClose, 
  isIOS, 
  isInstallable, 
  handleInstallClick 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Container */}
      <div 
        className="relative w-full max-w-md bg-dark-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-brand-500 rounded-full blur-sm opacity-50" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-dark-950 p-1 border border-white/5 shadow-xl mb-4 group hover:scale-105 transition-transform duration-500">
               <img 
                 src="/logoprincipal.png" 
                 alt="TeleRemate Logo" 
                 className="w-full h-full object-contain rounded-2xl"
               />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
              Instala la aplicación <span className="text-brand-400">TeleRemate</span>
            </h2>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              Disfruta de una experiencia más fluida, notificaciones directas y acceso instantáneo.
            </p>
          </div>

          {/* Platform Specific Content */}
          <div className="space-y-6">
            {isIOS ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Share size={20} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Paso 1</p>
                    <p className="text-gray-400 text-xs">Toca el botón <span className="text-blue-400 font-bold">"Compartir"</span> en la barra de Safari.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                    <PlusSquare size={20} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Paso 2</p>
                    <p className="text-gray-400 text-xs">Selecciona <span className="text-white font-bold">"Agregar a Pantalla de Inicio"</span>.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <Smartphone className="mx-auto mb-2 text-brand-400" size={24} />
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Mobile Ready</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                    <CheckCircle2 className="mx-auto mb-2 text-brand-400" size={24} />
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Sin Descargas</p>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    handleInstallClick();
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-brand-500 hover:bg-brand-600 text-white font-black h-14 rounded-2xl transition-all shadow-xl shadow-brand-500/20 group active:scale-[0.98]"
                >
                  <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                  INSTALAR AHORA
                </button>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
             <p className="text-[10px] text-gray-500 font-medium tracking-wide">
               INSTALACIÓN RÁPIDA Y SEGURA • PWA TECHNOLOGY
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
