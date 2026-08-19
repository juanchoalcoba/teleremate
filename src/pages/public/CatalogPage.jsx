import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Package, 
  Gavel, 
  ArrowRight,
  Tv,
  Armchair,
  Utensils,
  Wrench,
  Dumbbell,
  Baby,
  Car,
  Grid,
  X,
  LayoutGrid,
  List,
  ArrowUpDown,
  Filter
} from "lucide-react";
import { getArticles } from "../../services/api";
import CatalogGridSlide from "../../components/catalog/CatalogGridSlide";
import ArticleCard from "../../components/catalog/ArticleCard";
import FilterSidebar from "../../components/catalog/FilterSidebar";
import QuickViewModal from "../../components/modals/QuickViewModal";
import PurchaseModal from "../../components/modals/PurchaseModal";

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" | "price_asc" | "price_desc"
  const [quickViewArticle, setQuickViewArticle] = useState(null);
  const [purchaseModalArticle, setPurchaseModalArticle] = useState(null);

  const currentCategory = searchParams.get("category") || "deposito";
  const defaultAuctionDate = "";

  const filters = {
    category: currentCategory,
    status: searchParams.get("status") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    auctionDate: searchParams.get("auctionDate") || defaultAuctionDate,
    isNewCondition: searchParams.get("isNewCondition") || "",
    subcategory: searchParams.get("subcategory") || "",
  };
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const CATEGORY_TABS = [
    { value: "deposito", label: "Venta Directa", icon: Package },
    { value: "remate", label: "A Rematar", icon: Gavel },
    { value: "inmueble", label: "Inmuebles", icon: Package },
    { value: "vehiculo", label: "Vehículos", icon: Package },
  ];

  const CONDITION_TABS = [
    { value: "", label: "Todos" },
    { value: "true", label: "Nuevos" },
    { value: "false", label: "Usados" },
  ];

  const SUBCATEGORIES = [
    { label: "Electrodomésticos y Climatización", icon: Tv },
    { label: "Muebles y Hogar", icon: Armchair },
    { label: "Bazar y Cocina", icon: Utensils },
    { label: "Herramientas y Ferretería", icon: Wrench },
    { label: "Deportes y Tiempo Libre", icon: Dumbbell },
    { label: "Bebés y Niños", icon: Baby },
    { label: "Vehículos y Accesorios", icon: Car },
    { label: "Varios / Otros", icon: Grid },
  ];

  const updateFilters = useCallback((patch) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      Object.entries(patch).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });
      newParams.set("page", "1");
      return newParams;
    });
  }, [setSearchParams]);

  const setSearch = useCallback((val) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      if (val) newParams.set("search", val);
      else newParams.delete("search");
      newParams.set("page", "1");
      return newParams;
    });
  }, [setSearchParams]);

  const setPage = useCallback((val) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", val.toString());
      return newParams;
    });
  }, [setSearchParams]);

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
  const pagination = data?.data?.pagination || { totalPages: 1 };
  const totalPages = pagination.totalPages || 0;
  const totalArticlesCount = pagination.total || articles.length;

  const hasActiveFilters =
    filters.subcategory ||
    filters.isNewCondition ||
    filters.status ||
    filters.minPrice ||
    filters.maxPrice ||
    search;

  return (
    <div className="bg-[#f8fafc] min-h-screen relative overflow-hidden text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10">
        
        {/* Slim Compact Hero Section */}
        <div className="mb-6 relative overflow-hidden bg-[#0f172a] text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-white/5">
          {/* Subtle gold ambient glow */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-0.5 w-6 bg-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
                  Remates en línea
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
                Nuestros{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                  Catálogos
                </span>
              </h1>
              
              <p className="text-slate-300 text-xs font-medium max-w-xl mt-1">
                Descubra una selección curada de artículos exclusivos y oportunidades únicas.
              </p>
            </div>

            {/* High-contrast Light Search Bar (Wide on Desktop) */}
            <div className="w-full md:w-[450px] lg:w-[540px] shrink-0 mt-3 md:mt-0">
              <div className="relative group">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-amber-700 transition-colors z-10"
                />
                <input
                  type="text"
                  placeholder="Buscar por nombre o ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all text-gray-900 placeholder:text-gray-400 text-xs font-semibold shadow-md"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors p-1"
                    title="Limpiar búsqueda"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Categories section */}
        <div id="catalog-content" className="flex flex-col gap-4 mb-6">
          
          {/* Main Category Tabs Container */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 p-1.5 bg-white border border-gray-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)] rounded-2xl overflow-x-auto no-scrollbar scroll-smooth">
              {CATEGORY_TABS.map((tab) => {
                const isSelected = filters.category === tab.value;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.value}
                    onClick={() =>
                      updateFilters({
                        category: tab.value,
                        auctionDate: "",
                        isNewCondition: "",
                        subcategory: "",
                      })
                    }
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                      isSelected
                        ? "bg-amber-50/80 border border-amber-600/40 text-amber-950 shadow-xs scale-[1.02]"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={isSelected ? "text-amber-700" : "text-gray-400"}
                    />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Sub-tabs for "Venta Directa" */}
            {filters.category === "deposito" && (
              <div className="flex flex-col gap-3 pt-1">
                
                {/* Condition Tabs (Todos, Nuevos, Usados) */}
                <div className="flex items-center gap-2 overflow-x-auto md:flex-wrap no-scrollbar pb-1 px-1">
                  {CONDITION_TABS.map((cond) => {
                    const isSelected = (filters.isNewCondition || "") === cond.value;
                    return (
                      <button
                        key={cond.label}
                        onClick={() => updateFilters({ isNewCondition: cond.value })}
                        className={`px-5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                          isSelected
                            ? "bg-zinc-900 text-white shadow-sm"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        {cond.label}
                      </button>
                    );
                  })}
                </div>

                {/* Subcategory Tabs with Icons */}
                <div className="flex items-center gap-2 overflow-x-auto md:flex-wrap no-scrollbar pb-1 px-1">
                  <button
                    onClick={() => updateFilters({ subcategory: "" })}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                      !filters.subcategory
                        ? "bg-amber-50/80 border-amber-600/40 text-amber-950 shadow-xs"
                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Grid size={14} className={!filters.subcategory ? "text-amber-700" : "text-gray-400"} />
                    Todas
                  </button>
                  {SUBCATEGORIES.map(({ label, icon: Icon }) => {
                    const isSelected = filters.subcategory === label;
                    return (
                      <button
                        key={label}
                        onClick={() => updateFilters({ subcategory: label })}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 ${
                          isSelected
                            ? "bg-amber-50/80 border-amber-600/40 text-amber-950 shadow-xs font-black"
                            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <Icon size={14} className={isSelected ? "text-amber-700" : "text-gray-400"} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters Chips Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-white border border-gray-100 rounded-2xl shadow-xs">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 mr-1">
              <Filter size={12} className="text-amber-700" /> Filtros Activos:
            </span>

            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-600/30 text-amber-950 rounded-full text-xs font-bold">
                Búsqueda: "{search}"
                <button onClick={() => setSearch("")} className="hover:text-amber-700 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.subcategory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-600/30 text-amber-950 rounded-full text-xs font-bold">
                {filters.subcategory}
                <button onClick={() => updateFilters({ subcategory: "" })} className="hover:text-amber-700 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.isNewCondition && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 text-white rounded-full text-xs font-bold">
                {filters.isNewCondition === "true" ? "Nuevos" : "Usados"}
                <button onClick={() => updateFilters({ isNewCondition: "" })} className="hover:text-gray-300 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {filters.status && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold">
                Estado: {filters.status}
                <button onClick={() => updateFilters({ status: "" })} className="hover:text-purple-950 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            {(filters.minPrice || filters.maxPrice) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-full text-xs font-bold">
                Precio: ${filters.minPrice || "0"} - ${filters.maxPrice || "∞"}
                <button onClick={() => updateFilters({ minPrice: "", maxPrice: "" })} className="hover:text-emerald-950 cursor-pointer">
                  <X size={12} />
                </button>
              </span>
            )}

            <button
              onClick={() => {
                setSearch("");
                updateFilters({
                  subcategory: "",
                  isNewCondition: "",
                  status: "",
                  minPrice: "",
                  maxPrice: "",
                });
              }}
              className="text-xs font-bold text-amber-700 hover:underline ml-auto cursor-pointer"
            >
              Limpiar todos
            </button>
          </div>
        )}

        {/* Sidebar + Main Grid Section */}
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="md:w-64 shrink-0">
            <FilterSidebar
              filters={filters}
              onChange={updateFilters}
              theme="light"
            />
          </aside>

          <div className="grow overflow-hidden relative">
            
            {/* Toolbar Above Grid: Counter, Sort Dropdown, View Mode Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 p-3.5 bg-white border border-gray-100 rounded-2xl shadow-xs">
              <div className="text-xs font-bold text-gray-500">
                Mostrando <span className="text-gray-900 font-black">{articles.length}</span> de{" "}
                <span className="text-gray-900 font-black">{totalArticlesCount}</span> artículos
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {/* Sort Order Selector */}
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
                  <ArrowUpDown size={14} className="text-amber-700 shrink-0" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-transparent text-xs font-bold text-gray-800 outline-none cursor-pointer"
                  >
                    <option value="newest">Más recientes</option>
                    <option value="price_asc">Precio: Menor a Mayor</option>
                    <option value="price_desc">Precio: Mayor a Menor</option>
                  </select>
                </div>

                {/* View Mode Buttons (Grid / List) */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === "grid" ? "bg-white text-gray-900 shadow-xs font-bold" : "text-gray-400 hover:text-gray-700"
                    }`}
                    title="Vista en Cuadrícula"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === "list" ? "bg-white text-gray-900 shadow-xs font-bold" : "text-gray-400 hover:text-gray-700"
                    }`}
                    title="Vista en Lista"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {isError ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-700 bg-red-50 rounded-3xl border border-red-200">
                <Package size={48} className="mb-4 text-red-500" />
                <p className="font-bold text-red-600 mb-2">
                  Error al cargar los artículos
                </p>
                <p className="text-sm text-center max-w-sm mb-6 text-gray-500">
                  Hubo un problema de conexión. Por favor, intenta nuevamente.
                </p>
                <button onClick={() => refetch()} className="btn-primary">
                  Reintentar
                </button>
              </div>
            ) : totalPages === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-xs">
                <Package size={48} className="mb-4 opacity-20" />
                <p className="font-bold text-gray-600">
                  No se encontraron artículos
                </p>
                <button
                  onClick={() => {
                    setSearchParams(new URLSearchParams({ category: "deposito" }));
                  }}
                  className="mt-4 text-amber-700 font-bold text-sm hover:underline transition-colors"
                >
                  Limpiar todos los filtros
                </button>
              </div>
            ) : (
              <>
                <CatalogGridSlide
                  page={page}
                  filters={filters}
                  search={search}
                  updateFilters={updateFilters}
                  setSearch={setSearch}
                  shouldFetch={true}
                  theme="light"
                  viewMode={viewMode}
                  sortOrder={sortOrder}
                  onQuickView={(art) => setQuickViewArticle(art)}
                />

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                      disabled={page === 1}
                      onClick={() => {
                        setPage(page - 1);
                        document.getElementById('catalog-content')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-2 border border-gray-200 text-gray-700 bg-white rounded-xl disabled:opacity-30 font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer shadow-xs"
                    >
                      Anterior
                    </button>
                    <span className="text-sm font-bold text-gray-500">
                      Página {page} de {totalPages}
                    </span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => {
                        setPage(page + 1);
                        document.getElementById('catalog-content')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-2 border border-gray-200 text-gray-700 bg-white rounded-xl disabled:opacity-30 font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer shadow-xs"
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

      {/* Quick View Modal */}
      {quickViewArticle && (
        <QuickViewModal
          article={quickViewArticle}
          onClose={() => setQuickViewArticle(null)}
          onOpenPurchase={(art) => {
            setQuickViewArticle(null);
            setPurchaseModalArticle(art);
          }}
        />
      )}

      {/* Purchase Modal */}
      {purchaseModalArticle && (
        <PurchaseModal
          article={purchaseModalArticle}
          articleId={purchaseModalArticle._id}
          onClose={() => setPurchaseModalArticle(null)}
          onSuccess={() => {
            setPurchaseModalArticle(null);
          }}
        />
      )}
    </div>
  );
}
