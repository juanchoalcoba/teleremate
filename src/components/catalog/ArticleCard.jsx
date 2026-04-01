import { Link } from "react-router-dom";
import { ArrowRight, Tag } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";
import { getCategoryLabel, getPriceLabel, getCurrencySymbol } from "../../utils/articleUtils";

export default function ArticleCard({ article }) {
  const { _id, title, price, estimatedPrice, images, status, category, currency } =
    article;

  // In the real backend, images might be objects with a 'url' property
  const imgSrc = getImageUrl(
    (typeof images?.[0] === "string" ? images[0] : images?.[0]?.url)
  ) || "https://images.unsplash.com/photo-1558618047-3fd3eb4d5af6?w=600";

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
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col grow">
        <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <Tag size={10} className="text-white/40" />{" "}
          {getCategoryLabel(category)}
        </div>

        <h3 className="text-base font-bold text-white mb-4 leading-snug group-hover:text-white/80 transition-colors line-clamp-2">
          {title}
        </h3>

        <div className="mt-auto flex items-end justify-between pt-2 border-t border-white/5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">
              {getPriceLabel(article)}
            </p>
            <p className="text-lg font-black text-white">
              <span className="text-xs mr-1 opacity-70">{getCurrencySymbol(currency, category)}</span>
              {(price || estimatedPrice)?.toLocaleString() || "0"}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-white group-hover:text-[#111316] transition-all">
            <ArrowRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
