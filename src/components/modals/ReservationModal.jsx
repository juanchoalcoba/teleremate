import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader, Calendar, ShieldCheck, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ReservationModal({ articleId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    reservedUntil: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedGuarantee, setAcceptedGuarantee] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      reservedUntil: date,
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
    if (!formData.reservedUntil) {
      toast.error("Por favor selecciona una fecha de reserva");
      return false;
    }

    if (formData.reservedUntil <= new Date()) {
      toast.error("La fecha de reserva debe ser en el futuro");
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
    mutationFn: (payload) =>
      fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Error al crear la reserva");
        return data;
      }),
    onSuccess: () => {
      toast.success("¡Reserva creada exitosamente!", {
        icon: "✅",
        duration: 3000,
      });
      queryClient.invalidateQueries(["articles"]);
    },
    onError: (error) => {
      toast.error(error.message || "Error al procesar la reserva");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await mutation.mutateAsync({
        articleId,
        fullName: formData.fullName,
        phone: formData.phone,
        reservedUntil: formData.reservedUntil.toISOString(),
      });

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
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-brand-500 to-brand-600 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Reservar Artículo</h2>
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
                <h4 className="text-sm font-black text-brand-900 uppercase tracking-wider mb-1">Certificación TeleRemate</h4>
                <p className="text-xs text-brand-700 leading-relaxed">
                  Este artículo ha sido verificado por nuestro equipo. Garantizamos que su estado coincide con las imágenes y descripción presentadas.
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
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition disabled:bg-gray-50"
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
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition disabled:bg-gray-50"
            />
          </div>

          {/* Reservation Date */}
          <div>
            <label
              htmlFor="reservedUntil"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Reservar Hasta *
            </label>
            <div className="relative">
              <DatePicker
                selected={formData.reservedUntil}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                minDate={new Date()}
                placeholderText="Selecciona una fecha"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition disabled:bg-gray-50"
                calendarClassName="shadow-lg border border-gray-200 rounded-lg bg-white"
                dayClassName={() => "hover:bg-brand-50 rounded-md"}
                wrapperClassName="w-full"
                popperClassName="z-50"
              />
              <Calendar
                className="absolute right-3 top-3.5 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>

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
              className="flex-1 px-4 py-3 bg-linear-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                "Confirmar Reserva"
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
