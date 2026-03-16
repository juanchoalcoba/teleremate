import React, { useEffect } from "react";
import { X, AlertCircle, Camera, FileText, CheckCircle2 } from "lucide-react";

const SellWarningModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg sm:max-w-xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-brand-500 px-6 py-8 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none" />
          
          <div className="relative flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center border border-white/30 mb-4">
              <AlertCircle className="text-white" size={28} />
            </div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">
              Importante antes de publicar
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all border border-white/5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-gray-50/30 custom-scrollbar">
          <p className="text-gray-600 font-medium leading-relaxed text-center text-sm sm:text-base">
            Para que tu artículo pueda ser revisado y aprobado, te pedimos que completes la información de forma clara y sincera.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Descripción</p>
                <p className="text-gray-700 text-sm font-medium leading-snug">
                  Incluye una descripción precisa e indica el estado real del artículo.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                <Camera size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Registro Visual</p>
                <p className="text-gray-700 text-sm font-medium leading-snug">
                  Sube fotos claras que muestren bien el producto desde distintos ángulos.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100/50">
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-emerald-800 leading-tight">
                Esto permite mantener un proceso transparente y confiable entre los clientes y TELEREMATE.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gray-100 flex justify-center shrink-0">
          <button 
            onClick={onClose}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellWarningModal;
