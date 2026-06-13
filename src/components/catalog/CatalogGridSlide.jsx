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
  shouldFetch 
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
      <div className="flex flex-col items-center justify-center py-20 text-gray-300 bg-red-950/30 rounded-3xl border border-red-900/50 backdrop-blur-md">
        <Package size={48} className="mb-4 text-red-400" />
        <p className="font-bold text-red-400 mb-2">Error al cargar los artículos</p>
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
            className="h-72 bg-white/5 border border-white/5 animate-pulse rounded-2xl backdrop-blur-none md:backdrop-blur-sm"
          />
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-zinc-900/50 rounded-3xl border-2 border-dashed border-white/10 backdrop-blur-sm">
        <Package size={48} className="mb-4 opacity-20" />
        <p className="font-bold text-gray-400">No se encontraron artículos</p>
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
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${
        isFetching ? "opacity-50" : ""
      }`}
    >
      {articles.map((a) => (
        <ArticleCard key={a._id} article={a} theme="dark" />
      ))}
    </div>
  );
}
