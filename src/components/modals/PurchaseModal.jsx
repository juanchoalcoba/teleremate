import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader, ShieldCheck, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { createPurchase } from "../../services/api";

export default function PurchaseModal({ articleId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    deliveryMethod: "pickup",
    deliveryAddress: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedGuarantee, setAcceptedGuarantee] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Por favor ingresa tu nombre completo");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Por favor ingresa tu teléfono");
      return false;
    }
    if (
      formData.deliveryMethod === "delivery" &&
      !formData.deliveryAddress.trim()
    ) {
      toast.error("Por favor ingresa tu dirección de entrega");
      return false;
    }

    if (!acceptedGuarantee) {
      toast.error("Debes aceptar la garantía de certificación");
      return false;
    }

    return true;
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload) => createPurchase(payload),
    onSuccess: () => {
      toast.success("¡Compra creada exitosamente!", {
        icon: "✅",
        duration: 3000,
      });
      queryClient.invalidateQueries(["articles"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Error al procesar la compra",
      );
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const requestBody = {
        articleId,
        fullName: formData.fullName,
        phone: formData.phone,
        deliveryMethod: formData.deliveryMethod,
      };

      if (formData.deliveryMethod === "delivery") {
        requestBody.deliveryAddress = formData.deliveryAddress;
      }

      await mutation.mutateAsync(requestBody);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        data-lenis-prevent
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Comprar Artículo</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Certification Guarantee Box */}
          <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-brand-500/10 p-2 rounded-xl text-brand-600">
                <ShieldCheck size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-brand-900 uppercase tracking-wider mb-1">
                  Certificación TeleRemate
                </h4>
                <p className="text-xs text-brand-700 leading-relaxed">
                  Este artículo cuenta con nuestra garantía oficial. Nuestro
                  equipo técnico ha verificado personalmente su estado y
                  funcionamiento para asegurar que recibas exactamente lo que
                  ves
                </p>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer group mt-2 bg-white/50 p-2 rounded-lg border border-brand-200/50 hover:bg-white transition-colors">
              <input
                type="checkbox"
                checked={acceptedGuarantee}
                onChange={(e) => setAcceptedGuarantee(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-brand-300 transition-all cursor-pointer"
              />
              <span className="text-[10px] font-bold text-brand-900 uppercase tracking-wider group-hover:text-brand-600 transition-colors">
                Entiendo y acepto la garantía de estado
              </span>
            </label>
          </div>
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Nombre Completo *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:bg-gray-50"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Teléfono *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Tu número de teléfono"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:bg-gray-50"
            />
          </div>

          {/* Delivery Method */}
          <div>
            <label
              htmlFor="deliveryMethod"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Forma de Entrega *
            </label>
            <select
              id="deliveryMethod"
              name="deliveryMethod"
              value={formData.deliveryMethod}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:bg-gray-50"
            >
              <option value="pickup">Retiro en depósito</option>
              <option value="delivery">Envío a domicilio</option>
            </select>
          </div>

          {/* Delivery Address (conditional) */}
          {formData.deliveryMethod === "delivery" && (
            <div className="animate-in fade-in">
              <label
                htmlFor="deliveryAddress"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Dirección de Entrega *
              </label>
              <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                placeholder="Tu dirección completa (calle, número, ciudad, provincia)"
                disabled={isLoading}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:bg-gray-50 resize-none"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar Compra"
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center pt-2">
            Los campos marcados con * son obligatorios
          </p>
        </form>
      </div>
    </div>
  );
}
