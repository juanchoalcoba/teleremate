import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Tag, Share2, BookmarkPlus, Eye } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";
import { getCategoryLabel, getPriceLabel, getCurrencySymbol } from "../../utils/articleUtils";
import { toast } from "react-hot-toast";
import AnnotationModal from "../modals/AnnotationModal";

export default function ArticleCard({ article, theme, onQuickView, viewMode = "grid" }) {
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const { _id, title, price, estimatedPrice, images, status, category, currency } =
    article;

  const isDark = theme === "dark";
  const isListView = viewMode === "list";

  const imgSrc = getImageUrl(
    (typeof images?.[0] === "string" ? images[0] : images?.[0]?.url)
  ) || "https://images.unsplash.com/photo-1558618047-3fd3eb4d5af6?w=600";

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/articulo/${_id}`;
    const shareData = {
      title: title,
      text: "Mirá este artículo en Teleremate",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Enlace copiado al portapapeles", {
          icon: "🔗",
        });
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error sharing:", err);
      }
    }
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) onQuickView(article);
  };

  return (
    <>
    <Link 
      to={`/articulo/${_id}`} 
      className={`group flex ${isListView ? "flex-col sm:flex-row" : "flex-col"} h-full ${
        isDark 
          ? "bg-zinc-900/90 md:bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-500 backdrop-blur-none md:backdrop-blur-md" 
          : "bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_-5px_rgba(154,123,56,0.18)] hover:border-[#9a7b38]/30 hover:-translate-y-1 transition-all duration-300"
      }`}
    >
      {/* Image Container */}
      <div className={`relative ${isListView ? "sm:w-64 shrink-0 aspect-square sm:aspect-auto" : "aspect-video"} overflow-hidden ${isDark ? "bg-black/50" : "bg-[#f8fafc]"}`}>
        <img
          src={imgSrc}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain p-2 transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {article.isNewCondition && (
            <span className={`badge-status shadow-lg font-black tracking-widest px-3 backdrop-blur-none md:backdrop-blur-md ${
              isDark 
                ? "bg-emerald-950/90 md:bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]" 
                : "bg-emerald-50 text-emerald-700 border border-emerald-500 shadow-emerald-500/20"
            }`}>
              NUEVO
            </span>
          )}
          {status === "reserved" && (
            <span className="badge-status badge-status-reserved shadow-sm">
              Reservado
            </span>
          )}
          {status === "sold" && (
            <span className="badge-status bg-red-100 text-red-700 shadow-sm">
              Vendido
            </span>
          )}
          {category === "remate" && article.auctionLot && (
            <span className={`badge-status backdrop-blur-none md:backdrop-blur-md ${
              isDark 
                ? "bg-zinc-950/90 md:bg-zinc-950/80 text-white border border-white/20 shadow-md" 
                : "bg-white/90 text-brand-600 border border-brand-100 shadow-sm md:backdrop-blur-sm"
            }`}>
              Lote #{article.auctionLot}
            </span>
          )}
        </div>

        {/* Floating Quick View button on hover */}
        {onQuickView && (
          <button
            onClick={handleQuickViewClick}
            className="absolute bottom-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white text-gray-900 font-bold px-3 py-1.5 rounded-full text-xs shadow-md backdrop-blur-xs flex items-center gap-1.5 hover:scale-105"
            title="Vista Rápida"
          >
            <Eye size={14} className="text-[#9a7b38]" />
            <span className="hidden sm:inline">Vista Rápida</span>
          </button>
        )}

        {/* Subtle gradient overlay for dark mode */}
        {isDark && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        )}
      </div>
      
      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col grow relative z-10">
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
            <Tag
              size={13}
              className={
                category === "deposito" ? "text-emerald-600 shrink-0" : (isDark ? "text-white/60 shrink-0" : "text-amber-700 shrink-0")
              }
            />{" "}
            <span
              className={category === "deposito" ? "text-emerald-600 font-extrabold" : (isDark ? "text-gray-400" : "text-gray-500 font-extrabold")}
            >
              {getCategoryLabel(category)}
            </span>
          </div>

          <button
            onClick={handleShare}
            className={`p-2 -m-2 transition-all hover:scale-110 active:scale-95 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 ${
              isDark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-amber-700"
            }`}
            aria-label="Compartir producto"
            title="Compartir"
          >
            <Share2 size={15} />
          </button>
        </div>

        <h3 className={`text-xs md:text-sm font-black mb-3 leading-snug transition-colors line-clamp-2 uppercase tracking-tight ${
          isDark ? "text-white group-hover:text-gray-300" : "text-gray-900 group-hover:text-[#9a7b38]"
        }`}>
          {title}
        </h3>

        <div className={`mt-auto flex items-end justify-between pt-3 border-t transition-colors duration-500 ${
          isDark ? "border-white/10 group-hover:border-white/30" : "border-gray-100"
        }`}>
          <div>
            {category === "deposito" ? (
              <>
                <p className={`text-[10px] font-semibold tracking-wide mb-0.5 line-through ${
                  isDark ? "text-gray-500 decoration-gray-500/50" : "text-gray-400 decoration-gray-300"
                }`}>
                  Base: {getCurrencySymbol(currency, category)} {(price || estimatedPrice)?.toLocaleString()}
                </p>
                <p className={`text-[9px] font-extrabold uppercase tracking-widest mb-1 ${
                  isDark ? "text-brand-300" : "text-gray-500"
                }`}>
                  FINAL [ +20% COM. ]
                </p>
                <p className={`text-lg font-black transition-all ${
                  isDark ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "text-gray-900"
                }`}>
                  <span className="text-xs mr-1 opacity-70">{getCurrencySymbol(currency, category)}</span>
                  {Math.round((price || estimatedPrice) * 1.2)?.toLocaleString() || "0"}
                </p>
              </>
            ) : (
              <>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}>
                  {getPriceLabel(article)}
                </p>
                <p className={`text-lg font-black transition-all ${
                  isDark ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "text-gray-900"
                }`}>
                  <span className="text-xs mr-1 opacity-70">{getCurrencySymbol(currency, category)}</span>
                  {(price || estimatedPrice)?.toLocaleString() || "0"}
                </p>
              </>
            )}
          </div>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            isDark 
              ? "bg-white/10 text-white group-hover:bg-white group-hover:text-zinc-950 shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] group-hover:scale-110" 
              : "bg-[#9a7b38] hover:bg-[#85672a] text-white shadow-sm group-hover:scale-105 cursor-pointer"
          }`}>
            <ArrowRight size={16} />
          </div>
        </div>

        {category === "remate" && status !== "sold" && (
          <div className="mt-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAnnotationModal(true);
              }}
              className="w-full bg-white hover:bg-gray-100 text-black border-2 border-black font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <BookmarkPlus size={16} /> ANOTARME AL REMATE
            </button>
          </div>
        )}
      </div>
    </Link>
    
    {showAnnotationModal && (
      <AnnotationModal
        articleId={_id}
        onClose={() => setShowAnnotationModal(false)}
      />
    )}
    </>
  );
}
