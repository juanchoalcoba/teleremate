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
  handleInstallClick 
}) {
  if (!isOpen) return null;

  // Real iOS Share icon SVG (the box with arrow up that iOS users recognize)
  const IOSShareIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M8.684 7.316 12 4l3.316 3.316M12 4v10.5" />
      <path d="M5 10H3.5A1.5 1.5 0 0 0 2 11.5v8A1.5 1.5 0 0 0 3.5 21h17a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 20.5 10H19" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-110 flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Container (White Theme) */}
      <div 
        className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top brand accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-brand-500 rounded-full blur-sm opacity-30" />

        {/* Close Button (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-3xl bg-gray-50 p-1 border border-gray-100 shadow-xl mb-4 hover:scale-105 transition-transform duration-500">
               <img 
                 src="/logoprincipal.png" 
                 alt="TeleRemate Logo" 
                 className="w-full h-full object-contain rounded-2xl"
               />
            </div>
            <h2 className="text-2xl font-black text-black tracking-tight leading-tight">
              {isIOS ? "Instalar TeleRemate" : "Instala la aplicación"} <span className="text-brand-600">{isIOS ? "" : "TeleRemate"}</span>
            </h2>
            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              {isIOS
                ? "Agregá la app a tu inicio en 2 pasos"
                : "Disfruta de acceso instantáneo sin ocupar espacio."}
            </p>
          </div>

          {/* Platform Specific Content */}
          <div className="space-y-6">
            {isIOS ? (
              <div className="space-y-3">
                {/* Step 1 */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0 font-black text-lg">
                    ⋯
                  </div>
                  <div className="flex-1">
                    <p className="text-black font-bold text-sm">
                      Paso 1 — Tocá los <span className="text-blue-600">tres puntitos</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5 leading-snug">
                      Buscá el botón <span className="font-bold text-black">⋯</span> en la esquina de Safari y tocá <span className="text-blue-600 font-bold">"Compartir"</span> en el menú que aparece.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
                    <PlusSquare size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-black font-bold text-sm">
                      Paso 2 — Tocá <span className="text-orange-600">"Agregar a inicio"</span>
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5 leading-snug">
                      Seleccioná <span className="font-bold text-black">"Agregar a pantalla de inicio"</span>, confirmá el nombre y listo. ¡Ya tenés el ícono!
                    </p>
                  </div>
                </div>

                {/* Entendido Button (iOS) */}
                <button
                  onClick={onClose}
                  className="w-full mt-2 bg-black hover:bg-gray-900 active:scale-[0.98] text-white font-black h-14 rounded-2xl transition-all text-sm tracking-wide"
                >
                  Entendido ✓
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {!isInstallable && (
                  <div className="space-y-3">
                    {/* Manual Android Step 1 */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-600 shrink-0 font-black text-lg">
                        ⋮
                      </div>
                      <div className="flex-1">
                        <p className="text-black font-bold text-sm">
                          Paso 1 — Menú de Chrome
                        </p>
                        <p className="text-gray-500 text-[11px] mt-0.5 leading-tight">
                          Toca los <span className="font-bold text-black">tres puntos (⋮)</span> en la esquina superior derecha del navegador.
                        </p>
                      </div>
                    </div>

                    {/* Manual Android Step 2 */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
                        <PlusSquare size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-black font-bold text-sm">
                          Paso 2 — Instalar aplicación
                        </p>
                        <p className="text-gray-500 text-[11px] mt-0.5 leading-tight">
                          Busca <span className="font-bold text-brand-600">"Instalar aplicación"</span> o "Agregar a la pantalla de inicio".
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full mt-2 bg-black hover:bg-gray-900 active:scale-[0.98] text-white font-black h-14 rounded-2xl transition-all text-sm tracking-wide"
                    >
                      Entendido ✓
                    </button>
                  </div>
                )}

                {isInstallable && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                        <Smartphone className="mx-auto mb-2 text-brand-600" size={24} />
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Panel Admin</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-center">
                        <Download className="mx-auto mb-2 text-brand-600" size={24} />
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Nativo</p>
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
                      INSTALAR PANEL AHORA
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {!isIOS && (
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400 font-medium tracking-wide">
                INSTALACIÓN RÁPIDA Y SEGURA • PWA TECHNOLOGY
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
