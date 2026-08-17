import { useState } from "react";
import { SlidersHorizontal, X, Package, Gavel, Home, Car, Clock } from "lucide-react";

const CATEGORIES = [
  { value: "deposito", label: "Venta Directa", icon: Package },
  { value: "remate", label: "A Rematar", icon: Gavel },
  { value: "inmueble", label: "Inmuebles", icon: Home },
  { value: "vehiculo", label: "Vehículos", icon: Car },
];
const STATUSES = [
  { value: "reserved", label: "Reservado", icon: Clock },
];

export default function FilterSidebar({ filters, onChange, theme = "light" }) {
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
    <div className={`rounded-2xl p-5 space-y-6 transition-all duration-300 ${
      isDark 
        ? "bg-zinc-900/80 backdrop-blur-md border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]" 
        : "bg-white border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]"
    }`}>
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h3 className={`font-black tracking-tight text-base ${isDark ? "text-white" : "text-gray-900"}`}>Filtros</h3>
        {hasFilters && (
          <button
            onClick={handleClear}
            className="text-xs font-bold flex items-center gap-1 text-amber-700 hover:text-amber-800 hover:underline transition-colors"
          >
            <X size={12} /> Limpiar
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
          CATEGORÍA
        </h4>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = filters.category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => handleCategory(cat.value)}
                className={`text-left text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? "bg-amber-50/70 border border-amber-600/40 text-amber-950 shadow-xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                }`}
              >
                <Icon size={16} className={isSelected ? "text-amber-700" : "text-gray-400"} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status */}
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
          ESTADO
        </h4>
        <div className="flex flex-col gap-1.5">
          {STATUSES.map(({ value, label, icon: Icon }) => {
            const isSelected = filters.status === value;
            return (
              <button
                key={value}
                onClick={() => handleStatus(value)}
                className={`text-left text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-2.5 ${
                  isSelected
                    ? "bg-amber-50/70 border border-amber-600/40 text-amber-950 shadow-xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                }`}
              >
                <Icon size={16} className={isSelected ? "text-amber-700" : "text-gray-400"} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div className="pt-3 border-t border-gray-100 space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          RANGO DE PRECIO (UYU)
        </h4>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">$</span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onChange({ minPrice: e.target.value })}
              className="w-full pl-7 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-gray-900 placeholder:text-gray-400 transition-all"
            />
          </div>
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">$</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onChange({ maxPrice: e.target.value })}
              className="w-full pl-7 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 text-gray-900 placeholder:text-gray-400 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className="pt-2">
        <button
          onClick={() => {
            // Apply is automatic via state, but this button provides clear UX feedback
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="w-full bg-[#9a7b38] hover:bg-[#85672a] text-white font-bold py-3 px-4 rounded-xl shadow-sm hover:shadow transition-all text-xs uppercase tracking-wider cursor-pointer"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block w-64 shrink-0 sticky top-24 self-start">
        {panel}
      </div>

      {/* Mobile toggle */}
      <div className="md:hidden w-full mb-4">
        <button
          onClick={() => setOpen(!open)}
          className="w-full justify-center btn-secondary !bg-white !border-gray-200 !text-gray-900 shadow-sm"
        >
          <SlidersHorizontal size={15} />
          Filtros{" "}
          {hasFilters && (
            <span className="bg-[#9a7b38] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
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
