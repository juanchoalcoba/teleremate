import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Package } from "lucide-react";
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Catálogo</h1>
        <p className="text-gray-500">
          Explorá los artículos disponibles para remate.
        </p>
      </div>

      <div className="relative mb-8">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Buscar lotes o categorías..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-500 transition-all shadow-sm"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-64 shrink-0">
          <FilterSidebar filters={filters} onChange={updateFilters} />
        </aside>

        <div className="grow">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${isFetching ? "opacity-50" : ""}`}
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
