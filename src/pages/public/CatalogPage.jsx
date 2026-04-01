import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Package, Gavel } from "lucide-react";
import { getArticles } from "../../services/api";
import ArticleCard from "../../components/catalog/ArticleCard";
import FilterSidebar from "../../components/catalog/FilterSidebar";

export default function CatalogPage() {
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    minPrice: "",
    maxPrice: "",
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const CATEGORY_TABS = [
    { value: "", label: "Todos", icon: Package },
    { value: "deposito", label: "En Depósito", icon: Package },
    { value: "remate", label: "A Rematar", icon: Gavel },
    { value: "inmueble", label: "Inmuebles", icon: Package },
    { value: "vehiculo", label: "Vehículos", icon: Package },
  ];

  const updateFilters = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  }, []);

  const queryParams = {
    ...filters,
    search: search || undefined,
    page,
    limit: 12,
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["articles", queryParams],
    queryFn: () => getArticles(queryParams),
  });

  const articles = data?.data?.articles || [];
  const pagination = data?.data?.pagination || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 relative overflow-hidden rounded-3xl">
        <div className="p-1"> {/* Padding to prevent blur cutoff */}
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-brand-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-500">
              Remates en línea
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight uppercase font-display mb-4">
                Nuestro <span className="text-gray-400">Catálogo</span>
              </h1>
              <p className="text-gray-500 max-w-xl text-sm md:text-base leading-relaxed font-medium">
                Descubra una selección curada de lotes exclusivos, antigüedades y oportunidades únicas. Calidad verificada en cada remate.
              </p>
            </div>
            
            <div className="hidden md:flex items-center gap-4 text-gray-100 pb-2">
              <Gavel size={64} strokeWidth={1} className="opacity-10 rotate-12" />
            </div>
          </div>
        </div>
        
        {/* Subtle decorative element */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-500/10 blur-[100px] rounded-full pointer-events-none" />
      </div>

      <div className="flex flex-col gap-6 mb-12">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Buscar por nombre o número de lote..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:border-brand-500 transition-all shadow-sm font-medium"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl overflow-x-auto no-scrollbar scroll-smooth">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => updateFilters({ category: tab.value })}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                filters.category === tab.value
                  ? "bg-white text-brand-600 shadow-sm ring-1 ring-gray-100"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <tab.icon size={16} className={filters.category === tab.value ? "text-brand-500" : "opacity-40"} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 shrink-0">
          <FilterSidebar filters={filters} onChange={updateFilters} />
        </aside>

        <div className="grow">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 bg-gray-50 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
              <Package size={48} className="mb-4 opacity-20" />
              <p className="font-bold">No se encontraron artículos</p>
              <button
                onClick={() => {
                  setSearch("");
                  updateFilters({
                    category: "",
                    status: "",
                    minPrice: "",
                    maxPrice: "",
                  });
                }}
                className="mt-4 text-brand-600 font-bold text-sm hover:underline"
              >
                Limpiar todos los filtros
              </button>
            </div>
          ) : (
            <>
              <div
                className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${isFetching ? "opacity-50" : ""}`}
              >
                {articles.map((a) => (
                  <ArticleCard key={a._id} article={a} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-30 font-bold text-sm hover:bg-gray-50 transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="text-sm font-bold text-gray-500">
                    Página {page} de {pagination.totalPages}
                  </span>
                  <button
                    disabled={page === pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 border border-gray-200 rounded-xl disabled:opacity-30 font-bold text-sm hover:bg-gray-50 transition-colors"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
