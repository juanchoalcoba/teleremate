import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { getArticles } from "../../services/api";
import ArticleCard from "./ArticleCard";

export default function CatalogGridSlide({ 
  page, 
  filters, 
  search, 
  updateFilters, 
  setSearch,
  shouldFetch,
  theme = "light"
}) {
  const queryParams = {
    ...filters,
    search: search || undefined,
    page,
    limit: 12,
  };

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["articles", queryParams],
    queryFn: () => getArticles(queryParams),
    enabled: shouldFetch,
  });

  const articles = data?.data?.articles || [];

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-700 bg-red-50 rounded-3xl border border-red-200">
        <Package size={48} className="mb-4 text-red-500" />
        <p className="font-bold text-red-600 mb-2">Error al cargar los artículos</p>
        <button onClick={() => refetch()} className="btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  if (isLoading || !shouldFetch) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-72 bg-white border border-gray-100 animate-pulse rounded-2xl shadow-xs"
          />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-3xl border-2 border-dashed border-gray-200 shadow-xs">
        <Package size={48} className="mb-4 opacity-20" />
        <p className="font-bold text-gray-600">No se encontraron artículos</p>
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
          className="mt-4 text-amber-700 font-bold text-sm hover:underline transition-colors"
        >
          Limpiar todos los filtros
        </button>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${
        isFetching ? "opacity-50" : ""
      }`}
    >
      {articles.map((a) => (
        <ArticleCard key={a._id} article={a} theme={theme} />
      ))}
    </div>
  );
}
