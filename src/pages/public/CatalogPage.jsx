import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Package, Gavel, ArrowRight } from "lucide-react";
import { getArticles } from "../../services/api";
import ArticleCard from "../../components/catalog/ArticleCard";
import FilterSidebar from "../../components/catalog/FilterSidebar";

export default function CatalogPage() {
  const [filters, setFilters] = useState({
    category: "remate",
    status: "",
    minPrice: "",
    maxPrice: "",
    auctionDate: "2026-05-08T00:00:00.000Z",
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const CATEGORY_TABS = [
    { value: "deposito", label: "Venta Directa", icon: Package },
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

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["articles", queryParams],
    queryFn: () => getArticles(queryParams),
  });

  const articles = data?.data?.articles || [];
  const pagination = data?.data?.pagination || {};

  return (
    <div className="bg-zinc-950 min-h-screen relative overflow-hidden text-gray-200">
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[50%] bg-accent-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="mb-12 relative overflow-hidden rounded-3xl">
          <div className="p-1">
            {" "}
            {/* Padding to prevent blur cutoff */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-brand-100" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-100">
                Remates en línea
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
              <div>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase font-display mb-4">
                  Nuestros <span className="text-gray-500">Catálogos</span>
                </h1>
                <p className="text-gray-400 max-w-xl text-sm md:text-base leading-relaxed font-medium">
                  Descubra una selección curada de artículos exclusivos,
                  antigüedades y oportunidades únicas. Calidad verificada en
                  cada remate.
                </p>
              </div>

              <div className="hidden md:flex items-center gap-4 text-white pb-2">
                <Gavel
                  size={64}
                  strokeWidth={1}
                  className="opacity-30 rotate-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                />
              </div>
            </div>
          </div>

          {/* Subtle decorative element */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 blur-[100px] rounded-full pointer-events-none" />
        </div>

        <div className="flex flex-col gap-6 mb-12">
          <div className="relative group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors z-10"
            />
            <input
              type="text"
              placeholder="Buscar por nombre o ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-white/30 focus:bg-white/10 transition-all shadow-sm font-medium text-white placeholder:text-gray-500 backdrop-blur-md"
            />
          </div>

          {/* Category Tabs and Indicator Container */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/5 backdrop-blur-md rounded-2xl overflow-x-auto no-scrollbar scroll-smooth">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() =>
                    updateFilters({ 
                      category: tab.value, 
                      auctionDate: tab.value === "remate" ? "2026-05-08T00:00:00.000Z" : "" 
                    })
                  }
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                    filters.category === tab.value
                      ? "bg-white text-zinc-950 shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <tab.icon
                    size={16}
                    className={
                      filters.category === tab.value
                        ? "text-zinc-950"
                        : "opacity-60"
                    }
                  />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sub-tabs for "A Rematar" */}
            {filters.category === "remate" && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 px-1">
                {[
                  { label: "Todos", value: "" },
                  {
                    label: "Viernes 8 de Mayo",
                    value: "2026-05-08T00:00:00.000Z",
                  },
                  {
                    label: "Sábado 9 de Mayo",
                    value: "2026-04-25T00:00:00.000Z",
                  },
                  {
                    label: "Domingo 10 de Mayo",
                    value: "2026-04-26T00:00:00.000Z",
                  },
                ].map((sub) => (
                  <button
                    key={sub.label}
                    onClick={() => updateFilters({ auctionDate: sub.value })}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                      (filters.auctionDate || "") === sub.value
                        ? "bg-white text-zinc-950 border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        : "bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}

            {/* Dedicated indicator row (Only on Mobile) */}
            <div className="flex items-center justify-end md:hidden pr-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 backdrop-blur-sm rounded-full border border-white/10 animate-pulse pointer-events-none">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                  Desliza para ver más
                </span>
                <ArrowRight size={12} className="text-white/50" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-64 shrink-0">
            <FilterSidebar
              filters={filters}
              onChange={updateFilters}
              theme="dark"
            />
          </aside>

          <div className="grow">
            {isError ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-300 bg-red-950/30 rounded-3xl border border-red-900/50 backdrop-blur-md">
                <Package size={48} className="mb-4 text-red-400" />
                <p className="font-bold text-red-400 mb-2">
                  Error al cargar los artículos
                </p>
                <p className="text-sm text-center max-w-sm mb-6 opacity-80 text-gray-400">
                  Hubo un problema de conexión. Por favor, intenta nuevamente.
                </p>
                <button onClick={() => refetch()} className="btn-primary">
                  Reintentar
                </button>
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 bg-white/5 border border-white/5 animate-pulse rounded-2xl backdrop-blur-sm"
                  />
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-zinc-900/50 rounded-3xl border-2 border-dashed border-white/10 backdrop-blur-sm">
                <Package size={48} className="mb-4 opacity-20" />
                <p className="font-bold text-gray-400">
                  No se encontraron artículos
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    updateFilters({
                      category: "deposito",
                      status: "",
                      minPrice: "",
                      maxPrice: "",
                    });
                  }}
                  className="mt-4 text-white font-bold text-sm hover:underline hover:text-accent-500 transition-colors"
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
                    <ArticleCard key={a._id} article={a} theme="dark" />
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="px-4 py-2 border border-white/10 text-white rounded-xl disabled:opacity-30 font-bold text-sm hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm"
                    >
                      Anterior
                    </button>
                    <span className="text-sm font-bold text-gray-400">
                      Página {page} de {pagination.totalPages}
                    </span>
                    <button
                      disabled={page === pagination.totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="px-4 py-2 border border-white/10 text-white rounded-xl disabled:opacity-30 font-bold text-sm hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm"
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
    </div>
  );
}
