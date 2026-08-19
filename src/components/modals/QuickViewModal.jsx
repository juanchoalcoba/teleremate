import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Tag, ArrowRight, ExternalLink, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";
import { getCategoryLabel } from "../../utils/articleUtils";

export default function QuickViewModal({ article, onClose, onOpenPurchase }) {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!article) return null;

  const {
    _id,
    title,
    price,
    estimatedPrice,
    images = [],
    status,
    category,
    currency,
    description,
    isNewCondition,
    auctionLot,
  } = article;

  const basePrice = price || estimatedPrice || 0;
  const standardPrice = Math.round(basePrice * 1.2);
  const currencySymbol = currency === "USD" ? "US$" : "$";
  const formattedImages = images.length > 0 ? images.map(img => getImageUrl(img)) : ["https://placehold.co/600x400?text=Sin+Imagen"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 bg-gray-900/60 hover:bg-gray-900 text-white rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md"
          aria-label="Cerrar modal"
        >
          <X size={18} />
        </button>

        {/* Left Side: Images Gallery */}
        <div className="w-full md:w-1/2 bg-gray-50 p-4 flex flex-col justify-between relative border-b md:border-b-0 md:border-r border-gray-100">
          {/* Main Image */}
          <div className="relative aspect-square w-full bg-white rounded-2xl overflow-hidden shadow-xs flex items-center justify-center p-2 mb-3">
            <img
              src={formattedImages[selectedImgIndex]}
              alt={title}
              className="w-full h-full object-contain transition-all duration-300"
            />
            {/* Nav Arrows if multiple */}
            {formattedImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImgIndex((prev) => (prev === 0 ? formattedImages.length - 1 : prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setSelectedImgIndex((prev) => (prev === formattedImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center shadow-md transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {isNewCondition && (
                <span className="bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-xs">
                  NUEVO
                </span>
              )}
              {status === "reserved" && (
                <span className="bg-purple-600 text-white font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-xs">
                  Reservado
                </span>
              )}
              {status === "sold" && (
                <span className="bg-red-600 text-white font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-xs">
                  Vendido
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {formattedImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar justify-center">
              {formattedImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImgIndex === idx ? "border-[#9a7b38] scale-105 shadow-sm" : "border-gray-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details & Actions */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 flex flex-col overflow-y-auto no-scrollbar">
          {/* Tag */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
            <Tag size={14} className="shrink-0" />
            <span>{getCategoryLabel(category)}</span>
            {auctionLot && <span className="text-gray-400 text-[10px] ml-auto">Lote #{auctionLot}</span>}
          </div>

          {/* Title */}
          <h2 className="text-base sm:text-lg font-black text-gray-900 leading-snug uppercase mb-3 line-clamp-2">
            {title}
          </h2>

          {/* Description snippet */}
          {description && (
            <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
              {description}
            </p>
          )}

          {/* Guarantee Badge */}
          <div className="flex items-center gap-2 p-2.5 bg-amber-50/60 border border-amber-600/30 rounded-xl mb-4 text-[11px] font-bold text-amber-950">
            <ShieldCheck size={16} className="text-amber-700 shrink-0" />
            <span>Garantía de calidad TeleRemate verificada</span>
          </div>

          {/* Price Block */}
          <div className="mt-auto pt-3 border-t border-gray-100 mb-4">
            {category === "deposito" ? (
              <div>
                <p className="text-[11px] font-semibold text-gray-400 line-through mb-0.5">
                  Base: {currencySymbol} {basePrice?.toLocaleString()}
                </p>
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 mb-1">
                  FINAL [ +20% COM. INCLUIDA ]
                </p>
                <p className="text-2xl font-black text-gray-900">
                  <span className="text-sm mr-1 text-gray-500 font-bold">{currencySymbol}</span>
                  {standardPrice?.toLocaleString()}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Precio Estimado
                </p>
                <p className="text-2xl font-black text-gray-900">
                  <span className="text-sm mr-1 text-gray-500 font-bold">{currencySymbol}</span>
                  {basePrice?.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {category === "deposito" && status !== "sold" && status !== "reserved" && (
              <button
                onClick={() => {
                  onClose();
                  if (onOpenPurchase) onOpenPurchase(article);
                }}
                className="w-full bg-[#9a7b38] hover:bg-[#85672a] text-white font-bold py-3.5 px-4 rounded-xl shadow-sm hover:shadow transition-all text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Comprar / Reservar Ahora</span>
                <ArrowRight size={16} />
              </button>
            )}

            <Link
              to={`/articulo/${_id}`}
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-xl transition-colors text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5"
            >
              <span>Ver detalle completo</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
