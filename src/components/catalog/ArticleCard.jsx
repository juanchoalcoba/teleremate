import { Link } from "react-router-dom";
import { ArrowRight, Tag, Share2 } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";
import { getCategoryLabel, getPriceLabel, getCurrencySymbol } from "../../utils/articleUtils";
import { toast } from "react-hot-toast";

export default function ArticleCard({ article, theme }) {
  const { _id, title, price, estimatedPrice, images, status, category, currency } =
    article;

  const isDark = theme === "dark";

  // In the real backend, images might be objects with a 'url' property
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

  return (
    <Link 
      to={`/articulo/${_id}`} 
      className={`group block h-full ${
        isDark 
          ? "bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:-translate-y-1 transition-all duration-500 backdrop-blur-md" 
          : "card-premium"
      }`}
    >
      {/* Image Container */}
      <div className={`relative aspect-video overflow-hidden ${isDark ? "bg-black/50" : "bg-gray-50"}`}>
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
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
          {article.auctionLot && (
            <span className={`badge-status ${
              isDark 
                ? "bg-zinc-950/80 text-white border border-white/20 shadow-md backdrop-blur-md" 
                : "bg-white/90 text-brand-600 border border-brand-100 shadow-sm backdrop-blur-sm"
            }`}>
              Lote #{article.auctionLot}
            </span>
          )}
        </div>
        {/* Subtle gradient overlay for dark mode */}
        {isDark && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        )}
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col grow relative z-10">
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex items-center gap-1 text-[9px] md:text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
            <Tag
              size={12}
              className={
                category === "deposito" ? "text-green-500 shrink-0" : (isDark ? "text-white/60 shrink-0" : "text-brand-500 shrink-0")
              }
            />{" "}
            <span
              className={category === "deposito" ? "text-green-600/80" : (isDark ? "text-gray-400" : "text-gray-400")}
            >
              {getCategoryLabel(category)}
            </span>
          </div>

          <button
            onClick={handleShare}
            className={`p-2 -m-2 transition-all hover:scale-110 active:scale-95 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 ${
              isDark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-brand-500"
            }`}
            aria-label="Compartir producto"
            title="Compartir"
          >
            <Share2 size={16} />
          </button>
        </div>

        <h3 className={`text-xs md:text-base font-bold mb-3 md:mb-4 leading-snug transition-colors line-clamp-2 ${
          isDark ? "text-white group-hover:text-gray-300" : "text-gray-900 group-hover:text-brand-500"
        }`}>
          {title}
        </h3>

        <div className={`mt-auto flex items-end justify-between pt-2 border-t transition-colors duration-500 ${
          isDark ? "border-white/10 group-hover:border-white/30" : "border-gray-100"
        }`}>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}>
              {getPriceLabel(article)}
            </p>
            <p className={`text-lg font-black transition-all ${
              isDark ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "text-brand-500"
            }`}>
              <span className="text-xs mr-1 opacity-70">{getCurrencySymbol(currency, category)}</span>
              {(price || estimatedPrice)?.toLocaleString() || "0"}
            </p>
          </div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            isDark 
              ? "bg-white/10 text-white group-hover:bg-white group-hover:text-zinc-950 shadow-[0_0_15px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] group-hover:scale-110" 
              : "bg-gray-50 text-gray-400 group-hover:bg-brand-500 group-hover:text-white"
          }`}>
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
