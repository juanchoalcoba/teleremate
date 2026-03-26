import React, { useEffect } from "react";
import { X, CheckCircle2, ShieldCheck, AlertTriangle } from "lucide-react";

const SellConfirmModal = ({ isOpen, onClose, onConfirm, isSubmitting }) => {
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
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300 border border-gray-100">
        {/* Header */}
        <div className="bg-dark-950 px-6 py-6 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none" />
          
          <div className="relative flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 mb-3 shadow-inner">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <h2 className="text-lg font-black text-white tracking-tight uppercase font-display">
              Confirmación de Venta
            </h2>
          </div>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/10 disabled:opacity-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-5 bg-gray-50/30">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="shrink-0 w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 shadow-inner">
                <CheckCircle2 size={20} />
              </div>
              <p className="text-gray-700 text-sm sm:text-base font-semibold leading-relaxed">
                "Por intermedio de este contrato autorizo a <span className="text-brand-600 font-black">TELEREMATE</span> a vender los artículos aquí detallados descontando el <span className="underline decoration-brand-200 decoration-4">20 %</span>."
              </p>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="shrink-0 w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-inner">
                <AlertTriangle size={20} />
              </div>
              <p className="text-gray-700 text-sm sm:text-base font-semibold leading-relaxed">
                "Los articulos correspondientes a <span className="text-gray-900 font-bold italic">inmuebles</span> y <span className="text-gray-900 font-bold italic">vehiculos</span> estaran sujetos a un acuerdo de <span className="text-amber-600 font-black">comision a definir</span> luego de su aprobacion."
              </p>
            </div>
          </div>
          
          <p className="text-center text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] px-4">
            Al confirmar, tu pedido será procesado por nuestro equipo comercial.
          </p>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-white border-t border-gray-50 flex flex-col sm:flex-row gap-3 shrink-0">
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-2 bg-brand-500 hover:bg-brand-600 text-white px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
          >
            {isSubmitting ? (
              <>Procesando...</>
            ) : (
              <>Confirmar y Enviar</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellConfirmModal;
