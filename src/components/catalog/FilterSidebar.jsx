import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

const CATEGORIES = [
  "Muebles",
  "Electrodomésticos",
  "Electrónica",
  "Arte",
  "Joyería",
  "Vehículos",
  "Ropa",
  "Herramientas",
  "Libros",
  "Otros",
];
const STATUSES = [
  { value: "depot", label: "En Depósito" },
  { value: "upcoming", label: "Próximo Remate" },
  { value: "sold", label: "Vendido" },
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
    <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-5 space-y-6">
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
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                filters.category === cat
                  ? "bg-brand-500 text-white font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat}
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
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Precio Estimado ($)
        </h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Mín"
            value={filters.minPrice}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            className="input"
          />
          <input
            type="number"
            placeholder="Máx"
            value={filters.maxPrice}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            className="input"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block w-56 flex-shrink-0 sticky top-24 self-start">
        {panel}
      </div>

      {/* Mobile toggle */}
      <div className="md:hidden w-full mb-4">
        <button
          onClick={() => setOpen(!open)}
          className="btn-secondary w-full justify-center"
        >
          <SlidersHorizontal size={15} />
          Filtros{" "}
          {hasFilters && (
            <span className="bg-brand-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
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
