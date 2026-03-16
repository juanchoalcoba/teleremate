import React, { useEffect } from "react";
import { X, Shield, Gavel, Handshake, AlertCircle, FileText } from "lucide-react";

const TermsModal = ({ isOpen, onClose }) => {
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
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-dark-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-dark-950 px-8 py-10 relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
                <FileText className="text-brand-500" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">
                  Términos y <span className="text-brand-500">Condiciones</span>
                </h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                  TeleRemate • Transparencia Jurídica
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all border border-white/5"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-10 custom-scrollbar bg-gray-50/50" data-lenis-prevent>
          
          <section className="space-y-4">
            <div className="flex items-center gap-3 text-dark-950">
              <Shield size={20} className="text-brand-600" />
              <h3 className="text-lg font-black uppercase tracking-wider">1. Objeto y Aceptación</h3>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm leading-relaxed text-gray-600">
              <p>
                El presente documento establece las condiciones legales que regulan el uso de la plataforma <strong>TeleRemate</strong>. Al utilizar nuestros servicios, participar en reservas o realizar compras directas, usted acepta íntegramente los presentes términos. TeleRemate actúa como plataforma de intermediación y corretaje, garantizando la publicidad y transparencia de los lotes ofrecidos.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-dark-950">
              <Gavel size={20} className="text-brand-600" />
              <h3 className="text-lg font-black uppercase tracking-wider">2. Régimen de Remates y Ventas</h3>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 font-bold text-sm">A</div>
                <p className="text-gray-600 text-sm leading-relaxed pt-1">
                  <strong>Estado de los Lotes:</strong> Todos los bienes se subastan o venden en el estado en que se encuentran, a la vista y sin reclamo posterior. TeleRemate proporciona descripciones y fotografías que buscan reflejar fielmente la realidad del lote.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-700 font-bold text-sm">B</div>
                <p className="text-gray-600 text-sm leading-relaxed pt-1">
                  <strong>Comisión:</strong> Según la normativa vigente, se aplicará la comisión correspondiente al martillero o la plaza comercial en el momento de la liquidación final del bien.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-dark-950">
              <Handshake size={20} className="text-brand-600" />
              <h3 className="text-lg font-black uppercase tracking-wider">3. Sistema de Reservas y Compras</h3>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm leading-relaxed text-gray-600 text-sm space-y-4">
              <p>
                Las reservas efectuadas a través del sitio web tienen carácter de <strong>preferencia temporal</strong>. El cliente se compromete a formalizar la operación dentro del plazo estipulado en la reserva. En caso de incumplimiento del plazo, el lote podrá ser reintegrado al inventario público o remate sin previo aviso.
              </p>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 text-amber-800">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="text-xs font-bold leading-tight">
                  IMPORTANTE: La confirmación definitiva de la compra depende de la verificación de fondos o acuerdo entre partes gestionado directamente por nuestro personal administrativo.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-dark-950">
              <Shield size={20} className="text-brand-600" />
              <h3 className="text-lg font-black uppercase tracking-wider">4. Privacidad y Seguridad</h3>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm leading-relaxed text-gray-600 text-sm">
              <p>
                Los datos recolectados (Nombre y Teléfono) se utilizan exclusivamente para la gestión de las operaciones comerciales de TeleRemate. No se cederán datos a terceros bajo ningún concepto ajeno a la formalización legal del remate o venta.
              </p>
            </div>
          </section>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-400 font-medium">
              Última actualización: Marzo 2026 • TeleRemate Durazno, Uruguay.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white p-6 border-t border-gray-100 flex justify-center shrink-0">
          <button 
            onClick={onClose}
            className="btn-primary px-12 py-3 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
