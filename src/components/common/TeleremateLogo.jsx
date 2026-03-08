import React from "react";

const TeleremateLogo = ({
  className = "h-12",
  showText = true,
  light = false,
}) => {
  const brandDark = "#18181B"; // corporate near‑black
  const brandAccent = "#F15A24"; // subtle orange accent

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* TV silhouette */}
      <svg
        viewBox="0 0 100 100"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* TV frame */}
        <rect
          x="10"
          y="20"
          width="80"
          height="60"
          rx="12"
          stroke={brandDark}
          strokeWidth="4"
          fill="rgba(0,0,0,0.02)"
        />
        {/* Wheat stalk – rural element */
        <path
          d="M30 70 L30 45 L35 45 L35 70 M65 70 L65 45 L70 45 L70 70"
          stroke={brandAccent}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Simple antenna */}
        <line x1="50" y1="20" x2="50" y2="5" stroke={brandDark} strokeWidth="3" strokeLinecap="round" />
        {/* Gavel inside TV */}
        <path
          d="M40 45 L60 45 M50 45 L50 65 M45 65 L55 65"
          stroke={brandDark}
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div className="flex flex-col">
          <span
            className={`font-display font-black text-2xl tracking-tighter leading-none uppercase ${light ? "text-white" : "text-gray-900"}`}
          >
            Teleremate
          </span>
          <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase mt-0.5">
            Uruguay
          </span>
        </div>
      )}
    </div>
  );
};

export default TeleremateLogo;


