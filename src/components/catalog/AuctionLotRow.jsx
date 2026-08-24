import React from "react";
import { Tag } from "lucide-react";

export default function AuctionLotRow({ article, theme }) {
  const { title, description, auctionLot, lotNumber } = article;
  const displayLot = auctionLot || lotNumber || "";
  const fullText = (description || title || "").trim();
  const isDark = theme === "dark";

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-200 shadow-xs flex items-center gap-3.5 ${
        isDark
          ? "bg-zinc-900 border-zinc-700 text-white"
          : "bg-white border-gray-200/90 text-black hover:border-amber-400"
      }`}
    >
      {/* Lot Number Badge */}
      <div className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 border border-amber-400/80 text-amber-950 font-black text-xs sm:text-sm tracking-wide shadow-2xs">
        <Tag size={13} className="text-amber-800" />
        <span>LOTE #{displayLot}</span>
      </div>

      {/* Article Description (High Contrast Dark Text) */}
      <div className="grow min-w-0">
        <p className="text-xs sm:text-sm font-extrabold text-black dark:text-white leading-relaxed tracking-tight">
          {fullText}
        </p>
      </div>
    </div>
  );
}
