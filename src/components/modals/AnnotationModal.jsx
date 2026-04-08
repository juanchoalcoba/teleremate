import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { X, Loader, User, Phone, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { createAnnotation } from "../../services/api";

export default function AnnotationModal({ articleId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
  });
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      // Basic numeric validation
      const numericValue = value.replace(/[^\d+-\s()]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Por favor ingresa tu nombre");
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 6) {
      toast.error("Por favor ingresa un teléfono válido");
      return false;
    }
    return true;
  };

  const mutation = useMutation({
    mutationFn: (payload) => createAnnotation(payload),
    onSuccess: () => {
      setIsDone(true);
      toast.success("¡Te has anotado correctamente!", { icon: "👋" });
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Error al procesar la solicitud");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutation.mutate({
      articleId,
      fullName: formData.fullName,
      phone: formData.phone,
    });
  };

  if (isDone) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl p-10 flex flex-col items-center max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">¡Registrado!</h2>
          <p className="text-gray-500">Te has anotado correctamente para este remate. Nos contactaremos pronto.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-brand-500 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Anotarme al Remate</h2>
            <p className="text-brand-100 text-xs mt-1">Ingresa tus datos para registrar interés</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">
                Nombre y Apellido
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-2xl outline-hidden transition-all text-gray-900 font-bold"
                  required
                />
                <User className="absolute left-4 top-4 text-gray-400" size={20} />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">
                Teléfono de contacto
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ej: 099 123 456"
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-2xl outline-hidden transition-all text-gray-900 font-bold"
                  required
                />
                <Phone className="absolute left-4 top-4 text-gray-400" size={20} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-brand-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Procesando...
                </>
              ) : (
                "CONFIRMAR REGISTRO"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-white text-gray-400 font-bold py-3 hover:text-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
