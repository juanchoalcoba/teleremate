import { Link } from "react-router-dom";
import { ArrowRight, Tag } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";
import { getCategoryLabel, getPriceLabel, getCurrencySymbol } from "../../utils/articleUtils";

export default function ArticleCard({ article }) {
  const { _id, title, price, estimatedPrice, images, status, category, currency } =
    article;

  const imgSrc = getImageUrl(
    (typeof images?.[0] === "string" ? images[0] : images?.[0]?.url)
  ) || "https://images.unsplash.com/photo-1558618047-3fd3eb4d5af6?w=600";

  return (
    <Link to={`/articulo/${_id}`} className="card-premium-v2 group block h-full">
      <div className="premium-glow" />
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden m-2 rounded-2xl">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Subtle Overlay for content at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#171719] via-transparent to-transparent opacity-80" />

        {/* Badges on top of image */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {status === "reserved" && (
            <span className="bg-purple-500/20 backdrop-blur-md text-purple-200 border border-purple-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Reservado
            </span>
          )}
          {status === "sold" && (
            <span className="bg-red-500/20 backdrop-blur-md text-red-100 border border-red-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              Vendido
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5 pt-2 flex flex-col">
        <div className="mb-3">
          <div className="badge-category-pills inline-flex mb-3">
            <Tag size={10} className="text-white/40" />
            {getCategoryLabel(category)}
          </div>

          <h3 className="text-[17px] font-bold text-white mb-4 leading-tight group-hover:text-white transition-colors line-clamp-2 min-h-[3rem]">
            {title}
          </h3>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">
              {getPriceLabel(article)}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[11px] font-black text-white/40">{getCurrencySymbol(currency, category)}</span>
              <span className="text-2xl font-black text-white tracking-tighter">
                {(price || estimatedPrice)?.toLocaleString() || "0"}
              </span>
            </div>
          </div>
          
          <div className="btn-next-circle">
            <ArrowRight size={18} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </Link>
  );
}
