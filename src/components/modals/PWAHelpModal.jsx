import React from "react";
import { X, Share, Download, PlusSquare, ExternalLink } from "lucide-react";

const PWAHelpModal = ({ isOpen, onClose, isIOS, handleInstallClick, isInstallable }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-dark-950 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
              <img src="/pwa-icon.png" alt="TeleRemate" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Instalar App</h3>
              <p className="text-white/50 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Llevanos en tu pantalla</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {isIOS ? (
            <div className="space-y-6">
              <p className="text-gray-600 text-sm leading-relaxed text-center">
                Apple no permite botones de instalación directa, pero podés agregarla manualmente:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-500">
                    <Share size={20} />
                  </div>
                  <p className="text-xs font-bold text-gray-800">
                    1. Tocá el botón de <span className="text-blue-500">Compartir</span> en Safari.
                  </p>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-700">
                    <PlusSquare size={20} />
                  </div>
                  <p className="text-xs font-bold text-gray-800">
                    2. Elegí <span className="text-dark-950">"Agregar a inicio"</span>.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 text-center">
              <p className="text-gray-600 text-sm leading-relaxed">
                Disfrutá de una mejor experiencia, acceso rápido y notificaciones instalando nuestra app oficial.
              </p>
              
              {isInstallable ? (
                <button
                  onClick={handleInstallClick}
                  className="w-full bg-brand-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-500/30 hover:bg-brand-600 transition-all flex items-center justify-center gap-3"
                >
                  <Download size={18} />
                  Instalar Ahora
                </button>
              ) : (
                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                  <p className="text-orange-800 text-[11px] font-bold leading-relaxed">
                    Si no ves el botón de instalación, buscá <span className="underline">"Instalar aplicación"</span> en el menú de tu navegador (<ExternalLink size={10} className="inline" />).
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full mt-6 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-gray-600 transition-colors"
          >
            Cerrar Guía
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAHelpModal;
