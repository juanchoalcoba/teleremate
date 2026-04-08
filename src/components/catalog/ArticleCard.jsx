import { Link } from "react-router-dom";
import { ArrowRight, Tag, Share2 } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";
import { getCategoryLabel, getPriceLabel, getCurrencySymbol } from "../../utils/articleUtils";
import { toast } from "react-hot-toast";
import { useState } from "react";
import AnnotationModal from "../modals/AnnotationModal";

export default function ArticleCard({ article }) {
  const { _id, title, price, estimatedPrice, images, status, category, currency } =
    article;
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);

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
    <Link to={`/articulo/${_id}`} className="card-premium group block h-full">
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-50">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {status === "reserved" && (
            <span className="badge-status badge-status-reserved">
              Reservado
            </span>
          )}
          {status === "sold" && (
            <span className="badge-status bg-red-100 text-red-700">
              Vendido
            </span>
          )}
        </div>

        {/* Annotation Button Overlay for Remate */}
        {category === "remate" && status !== "sold" && (
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowAnnotationModal(true);
              }}
              className="w-full bg-brand-500 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-brand-500/40 hover:bg-brand-600 transition-colors"
            >
              Anotarme
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col grow">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Tag
              size={12}
              className={
                category === "deposito" ? "text-green-500" : "text-brand-500"
              }
            />{" "}
            <span
              className={category === "deposito" ? "text-green-600/80" : ""}
            >
              {getCategoryLabel(category)}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="p-2 -m-2 text-gray-400 hover:text-brand-500 transition-all hover:scale-110 active:scale-95 sm:opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="Compartir producto"
            title="Compartir"
          >
            <Share2 size={16} />
          </button>
        </div>

        <h3 className="text-base font-bold text-gray-900 mb-4 leading-snug group-hover:text-brand-500 transition-colors line-clamp-2">
          {title}
        </h3>

        <div className="mt-auto flex items-end justify-between pt-2 border-t border-gray-100">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
              {getPriceLabel(article)}
            </p>
            <p className="text-lg font-black text-brand-500">
              <span className="text-xs mr-1 opacity-70">{getCurrencySymbol(currency, category)}</span>
              {(price || estimatedPrice)?.toLocaleString() || "0"}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-brand-500 group-hover:text-white transition-all">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>

      {showAnnotationModal && (
        <AnnotationModal
          articleId={_id}
          onClose={() => setShowAnnotationModal(false)}
        />
      )}
    </Link>
  );
}
