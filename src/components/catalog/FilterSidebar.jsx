import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

const CATEGORIES = [
  { value: "deposito", label: "Venta Directa" },
  { value: "remate", label: "A Rematar" },
  { value: "inmueble", label: "Inmuebles" },
  { value: "vehiculo", label: "Vehículos" },
];
const STATUSES = [
  { value: "reserved", label: "Reservado" },
];
const CONDITIONS = ["Excelente", "Muy bueno", "Bueno", "Regular"];

export default function FilterSidebar({ filters, onChange, theme }) {
  const [open, setOpen] = useState(false);
  const isDark = theme === "dark";

  const handleCategory = (cat) => {
    onChange({ category: filters.category === cat ? "" : cat });
  };
  const handleStatus = (st) => {
    onChange({ status: filters.status === st ? "" : st });
  };
  const handleClear = () => {
    onChange({ category: "", status: "", minPrice: "", maxPrice: "" });
  };

  const hasFilters =
    filters.category || filters.status || filters.minPrice || filters.maxPrice;

  const panel = (
    <div className={`rounded-2xl p-5 space-y-6 transition-all duration-300 ${isDark ? "bg-zinc-900/80 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]" : "bg-white shadow-(--shadow-card)"}`}>
      <div className="flex items-center justify-between">
        <h3 className={`font-bold font-display ${isDark ? "text-white" : "text-gray-900"}`}>Filtros</h3>
        {hasFilters && (
          <button
            onClick={handleClear}
            className={`text-xs flex items-center gap-1 transition-colors ${isDark ? "text-gray-400 hover:text-white" : "text-brand-600 hover:text-brand-700"}`}
          >
            <X size={12} /> Limpiar
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
          Categoría
        </h4>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategory(cat.value)}
              className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                filters.category === cat.value
                  ? (isDark ? "bg-white text-zinc-950 font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "bg-brand-500 text-white font-medium")
                  : (isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-600 hover:bg-gray-50")
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
          Estado
        </h4>
        <div className="flex flex-col gap-1">
          {STATUSES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleStatus(value)}
              className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                filters.status === value
                  ? (isDark ? "bg-white text-zinc-950 font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "bg-brand-500 text-white font-medium")
                  : (isDark ? "text-gray-400 hover:bg-white/5 hover:text-white" : "text-gray-600 hover:bg-gray-50")
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className={`pt-2 border-t ${isDark ? "border-white/10" : "border-gray-50"}`}>
        <h4 className={`text-[10px] font-black uppercase tracking-widest mb-3 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Rango de Precio (UYU)
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative group">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-colors ${isDark ? "text-gray-500 group-focus-within:text-white" : "text-gray-300 group-focus-within:text-brand-500"}`}>$</span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onChange({ minPrice: e.target.value })}
              className={`w-full pl-6 pr-3 py-2.5 rounded-xl text-sm font-bold outline-none transition-all ${
                isDark 
                  ? "bg-black/50 border border-white/10 text-white placeholder:text-gray-600 focus:border-white/30 focus:bg-white/5" 
                  : "bg-gray-50 border border-gray-100 text-gray-900 focus:border-brand-500 focus:bg-white placeholder:text-gray-300"
              }`}
            />
          </div>
          <div className="relative group">
            <span className={`absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold transition-colors ${isDark ? "text-gray-500 group-focus-within:text-white" : "text-gray-300 group-focus-within:text-brand-500"}`}>$</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onChange({ maxPrice: e.target.value })}
              className={`w-full pl-6 pr-3 py-2.5 rounded-xl text-sm font-bold outline-none transition-all ${
                isDark 
                  ? "bg-black/50 border border-white/10 text-white placeholder:text-gray-600 focus:border-white/30 focus:bg-white/5" 
                  : "bg-gray-50 border border-gray-100 text-gray-900 focus:border-brand-500 focus:bg-white placeholder:text-gray-300"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block w-56 shrink-0 sticky top-24 self-start">
        {panel}
      </div>

      {/* Mobile toggle */}
      <div className="md:hidden w-full mb-4">
        <button
          onClick={() => setOpen(!open)}
          className={`w-full justify-center ${isDark ? "btn-secondary !bg-white/5 !border-white/10 !text-white hover:!bg-white/10 backdrop-blur-md" : "btn-secondary"}`}
        >
          <SlidersHorizontal size={15} />
          Filtros{" "}
          {hasFilters && (
            <span className={`${isDark ? "bg-white text-zinc-950" : "bg-brand-500 text-white"} rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold`}>
              {
                [filters.category, filters.status, filters.minPrice].filter(
                  Boolean,
                ).length
              }
            </span>
          )}
        </button>
        {open && <div className="mt-3">{panel}</div>}
      </div>
    </>
  );
}
