import React from "react";
import { Tag } from "lucide-react";

export default function AuctionLotRow({ article }) {
  const { title, description, auctionLot, lotNumber } = article;
  const displayLot = auctionLot || lotNumber || "";
  const fullText = (description || title || "").trim();

  return (
    <div className="p-3.5 sm:p-4 rounded-xl border border-gray-200/90 bg-white hover:border-amber-400 shadow-2xs flex items-center gap-3.5 transition-all">
      {/* Lot Number Badge */}
      <div className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 border border-amber-400/80 text-amber-950 font-black text-xs sm:text-sm tracking-wide">
        <Tag size={13} className="text-amber-800" />
        <span style={{ color: '#451a03' }}>LOTE #{displayLot}</span>
      </div>

      {/* Article Description (Forced 100% Solid Black Text) */}
      <div className="grow min-w-0">
        <p 
          style={{ color: '#09090b' }} 
          className="text-xs sm:text-sm md:text-base font-extrabold leading-relaxed tracking-tight text-gray-950"
        >
          {fullText}
        </p>
      </div>
    </div>
  );
}
