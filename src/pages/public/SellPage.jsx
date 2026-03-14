import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Camera,
  Check,
  User,
  Phone,
  Mail,
  Type,
  FileText,
  DollarSign,
  MapPin,
  Loader2,
  Clock,
} from "lucide-react";
import { createSubmission, uploadPublicImages } from "../../services/api";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const SellPage = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    sellerName: "",
    sellerPhone: "",
    sellerEmail: "",
    title: "",
    description: "",
    estimatedPrice: "",
    pickupLocation: "",
    usageYears: "",
    conditionDetails: "",
  });

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (files.length + acceptedFiles.length > 5) {
        toast.error("Máximo 5 imágenes permitidas");
        return;
      }

      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          setFiles((prev) => [
            ...prev,
            Object.assign(file, {
              preview: reader.result,
            }),
          ]);
        };
        reader.readAsDataURL(file);
      });
    },
    [files],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 5,
  });

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (files.length === 0) {
      toast.error("Por favor, subí al menos una imagen");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Subir imágenes
      const uploadRes = await uploadPublicImages(files);
      const imageUrls = uploadRes.data.images;

      // 2. Crear pedido
      await createSubmission({
        ...formData,
        estimatedPrice: Number(formData.estimatedPrice),
        images: imageUrls,
      });

      setStep(4);
      toast.success("¡Pedido enviado con éxito!");
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "Error al enviar el pedido");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 4) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-display">¡Recibimos tu pedido!</h1>
          <p className="text-gray-600 leading-relaxed">
            Gracias por confiar en <strong>TeleRemate</strong>. Nuestro equipo revisará los detalles y te contactaremos a la brevedad para coordinar la venta.
          </p>
          <div className="pt-6">
            <Link to="/catalogo" className="btn-primary w-full justify-center py-4 text-lg">
              Volver al catálogo <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8 overflow-x-auto pb-6 scrollbar-hide px-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center group shrink-0">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 border-2 ${
                    step >= s
                      ? "bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/20 ring-2 sm:ring-4 ring-brand-500/10"
                      : "bg-white text-gray-300 border-gray-100 group-hover:border-brand-200"
                  }`}
                >
                  {step > s ? <Check size={20} className="sm:w-6 sm:h-6" strokeWidth={3} /> : s}
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className={`text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-bold transition-colors ${step >= s ? "text-brand-600" : "text-gray-400"}`}>Paso 0{s}</p>
                  <p className={`text-[11px] sm:text-xs font-bold whitespace-nowrap uppercase tracking-wider ${step >= s ? "text-gray-900" : "text-gray-400"}`}>
                    {s === 1 ? "Tus Datos" : s === 2 ? "El Artículo" : "Imágenes"}
                  </p>
                </div>
                {s < 3 && (
                  <div className={`h-px w-12 sm:w-20 mx-4 transition-colors duration-500 ${step > s ? "bg-brand-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form area */}
        <div className="bg-white rounded-3xl sm:rounded-4xl shadow-lg shadow-black/5 border border-gray-100/50 p-6 sm:p-12 relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-14 h-14 bg-brand-50/50 text-brand-500 rounded-2xl flex items-center justify-center shadow-inner">
                    <User size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-display tracking-tight uppercase">Información Personal</h2>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">Completá tus datos para que podamos contactarte.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Nombre Completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input
                        required
                        name="sellerName"
                        value={formData.sellerName}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all font-medium text-gray-900 shadow-sm outline-hidden"
                        placeholder="Juan Pérez"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">WhatsApp / Teléfono</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input
                        required
                        name="sellerPhone"
                        value={formData.sellerPhone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all font-medium text-gray-900 shadow-sm outline-hidden"
                        placeholder="099 000 000"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Email (Opcional)</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input
                        type="email"
                        name="sellerEmail"
                        value={formData.sellerEmail}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all font-medium text-gray-900 shadow-sm outline-hidden"
                        placeholder="juan@ejemplo.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-14 h-14 bg-brand-50/50 text-brand-500 rounded-2xl flex items-center justify-center shadow-inner">
                    <FileText size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-display tracking-tight uppercase">Detalles del Artículo</h2>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">Contanos qué preferís rematar hoy.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Nombre del artículo</label>
                    <div className="relative">
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                      <input
                        required
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-brand-500 transition-all font-medium text-gray-900"
                        placeholder="Ej: Sofá de cuero vintage"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Descripción General</label>
                    <textarea
                      required
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all font-medium text-gray-900 resize-none shadow-sm outline-hidden"
                      placeholder="Describí el artículo, materiales, medidas..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Detalles de uso / Desperfectos</label>
                    <textarea
                      name="conditionDetails"
                      value={formData.conditionDetails}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-5 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all font-medium text-gray-900 resize-none shadow-sm outline-hidden"
                      placeholder="Ej: Tiene un pequeño raspón en la pata trasera, funciona perfecto."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Años de uso</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                          name="usageYears"
                          value={formData.usageYears}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all font-medium text-gray-900 shadow-sm outline-hidden"
                          placeholder="Ej: 2 años / Menos de 1 año"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Ubicación</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                          name="pickupLocation"
                          value={formData.pickupLocation}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all font-medium text-gray-900 shadow-sm outline-hidden"
                          placeholder="Ciudad / Barrio"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-1">Precio Estimado (UYU)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input
                          required
                          type="number"
                          name="estimatedPrice"
                          value={formData.estimatedPrice}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all font-medium text-gray-900 shadow-sm outline-hidden"
                          placeholder="25000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-14 h-14 bg-brand-50/50 text-brand-500 rounded-2xl flex items-center justify-center shadow-inner">
                    <Camera size={28} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 font-display tracking-tight uppercase">Registros Visuales</h2>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium">Subí hasta 5 fotos claras de tu artículo.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer ${
                      isDragActive
                        ? "border-brand-500 bg-brand-50 scale-[0.98]"
                        : "border-gray-200 hover:border-brand-400 hover:bg-gray-50"
                    }`}
                  >
                    <input {...getInputProps({ capture: "environment" })} />
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mb-4">
                        <Upload size={32} />
                      </div>
                      <p className="font-bold text-gray-800 text-lg">Arrastrá las fotos acá</p>
                      <p className="text-gray-400 text-sm mt-1">O hacé click para seleccionar</p>
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                      {files.map((file, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-xl shadow-black/5 animate-in zoom-in duration-300">
                          <img src={file.preview} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="absolute top-1.5 right-1.5 p-1.5 bg-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                    <AlertCircle className="text-amber-500 shrink-0" size={20} />
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                      Sugerencia: Subí fotos nítidas y con buena luz para que el proceso de aprobación sea más rápido.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-8 flex flex-col-reverse sm:flex-row gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="w-full sm:w-auto px-6 py-4 rounded-xl sm:rounded-2xl text-gray-500 font-bold hover:bg-gray-100 flex items-center justify-center gap-2 transition-all order-1 sm:order-0"
                >
                  <ArrowLeft size={18} /> Atrás
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1 justify-center py-4 sm:py-5 rounded-xl sm:rounded-2xl text-base sm:text-xl font-bold uppercase tracking-widest shadow-lg shadow-brand-500/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-3" size={20} /> Enviando...
                  </>
                ) : (
                  <>
                    {step === 3 ? "Enviar Pedido" : "Siguiente"}
                    <ArrowRight className="ml-2" size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
