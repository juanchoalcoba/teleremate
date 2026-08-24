import React from "react";
import { Link } from "react-router-dom";
import { Tag, ArrowRight } from "lucide-react";

export default function AuctionLotRow({ article, theme }) {
  const { _id, title, description, auctionLot, lotNumber } = article;
  const displayLot = auctionLot || lotNumber || "";
  const fullText = description || title || "";

  const isDark = theme === "dark";

  return (
    <Link
      to={`/articulo/${_id}`}
      className={`group block p-3.5 sm:p-4 rounded-xl border transition-all duration-200 shadow-xs hover:shadow-md ${
        isDark
          ? "bg-zinc-900/90 border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800/80 text-white"
          : "bg-white border-gray-200/80 hover:border-amber-600/40 hover:bg-amber-50/20 text-gray-900"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-start sm:items-center gap-3 grow min-w-0">
          {/* Lot Number Badge */}
          <div className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-950 font-black text-xs sm:text-sm tracking-wide">
            <Tag size={13} className="text-amber-700" />
            <span>LOTE #{displayLot}</span>
          </div>

          {/* Article Description */}
          <div className="grow min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 sm:line-clamp-none">
              {fullText}
            </p>
          </div>
        </div>

        {/* Action / Detail Arrow */}
        <div className="shrink-0 flex items-center justify-end sm:justify-center self-end sm:self-center">
          <span className="text-[11px] font-bold text-amber-800 group-hover:text-amber-900 flex items-center gap-1 transition-colors">
            Ver detalle
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
