import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ChevronRight } from "lucide-react";

export default function SuccessPaymentPage() {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const status = searchParams.get("status");

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl text-center border border-gray-100">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2">¡Pago Exitoso!</h1>
        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado correctamente. En breve nos contactaremos contigo para coordinar la entrega o retiro de tu artículo.
        </p>

        {paymentId && status === "approved" && (
          <div className="bg-gray-50 rounded-xl p-4 mb-8 border border-gray-200">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
              Referencia de pago
            </p>
            <p className="text-sm font-mono text-gray-800 font-medium">
              #{paymentId}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <Link 
            to="/catalogo" 
            className="w-full btn-primary py-4 flex items-center justify-center gap-2 group"
          >
            Volver al Catálogo
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/" 
            className="w-full block py-3 text-sm font-semibold text-gray-500 hover:text-brand-600 transition-colors"
          >
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
