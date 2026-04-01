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
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img
          src={imgSrc}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {status === "reserved" && (
            <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-purple-700 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm border border-white/20">
              Reservado
            </span>
          )}
          {status === "sold" && (
            <span className="px-3 py-1 bg-red-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
              Vendido
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col grow">
        <div className="flex items-center gap-1.5 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <Tag size={12} className="text-brand-500 animate-pulse" />{" "}
          {getCategoryLabel(category)}
        </div>

        <h3 className="text-[17px] font-bold text-slate-900 mb-5 leading-tight group-hover:text-brand-500 transition-colors line-clamp-2 min-h-[3rem]">
          {title}
        </h3>

        <div className="mt-auto flex items-end justify-between pt-4 border-t border-slate-100/80">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 mb-1.5">
              {getPriceLabel(article)}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-bold text-slate-400">{getCurrencySymbol(currency, category)}</span>
              <span className="text-2xl font-black text-brand-500 tracking-tighter">
                {(price || estimatedPrice)?.toLocaleString() || "0"}
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-brand-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-500/20 transition-all duration-300">
            <ArrowRight size={20} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </Link>
  );
}
