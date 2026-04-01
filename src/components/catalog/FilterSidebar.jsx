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

export default function FilterSidebar({ filters, onChange }) {
  const [open, setOpen] = useState(false);

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
    <div className="bg-white rounded-2xl shadow-(--shadow-card) p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 font-display">Filtros</h3>
        {hasFilters && (
          <button
            onClick={handleClear}
            className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <X size={12} /> Limpiar
          </button>
        )}
      </div>

      {/* Category */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Categoría
        </h4>
        <div className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategory(cat.value)}
              className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                filters.category === cat.value
                  ? "bg-brand-500 text-white font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Estado
        </h4>
        <div className="flex flex-col gap-1">
          {STATUSES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleStatus(value)}
              className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                filters.status === value
                  ? "bg-brand-500 text-white font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="pt-2 border-t border-gray-50">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
          Rango de Precio (UYU)
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 group-focus-within:text-brand-500 transition-colors">$</span>
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => onChange({ minPrice: e.target.value })}
              className="w-full pl-6 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-brand-500 focus:bg-white transition-all placeholder:text-gray-300"
            />
          </div>
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 group-focus-within:text-brand-500 transition-colors">$</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => onChange({ maxPrice: e.target.value })}
              className="w-full pl-6 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-brand-500 focus:bg-white transition-all placeholder:text-gray-300 transition-all"
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
      <div className="md:hidden w-full mb-4 flex justify-center">
        <button
          onClick={() => setOpen(!open)}
          className="btn-filter-blue"
        >
          <SlidersHorizontal size={15} />
          Filtros{" "}
          {hasFilters && (
            <span className="bg-white text-blue-600 rounded-full w-5 h-5 text-xs flex items-center justify-center shadow-inner font-black">
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
