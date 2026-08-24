import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { getArticles } from "../../services/api";
import ArticleCard from "./ArticleCard";
import AuctionLotRow from "./AuctionLotRow";

export default function CatalogGridSlide({ 
  page, 
  filters, 
  search, 
  updateFilters, 
  setSearch,
  shouldFetch,
  theme = "light",
  viewMode = "grid",
  sortOrder = "newest",
  onQuickView,
}) {
  const isRemateCategory = filters.category === "remate";
  const limitPerPage = isRemateCategory ? 50 : 12;

  const queryParams = {
    ...filters,
    search: search || undefined,
    page,
    limit: limitPerPage,
  };

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["articles", queryParams],
    queryFn: () => getArticles(queryParams),
    enabled: shouldFetch,
  });

  const rawArticles = data?.data?.articles || [];

  // Sort articles locally for instantaneous smooth UX
  const articles = [...rawArticles].sort((a, b) => {
    if (isRemateCategory) {
      // Keep numerical lot order for remates
      const lotA = parseInt(a.auctionLot || a.lotNumber || "0", 10);
      const lotB = parseInt(b.auctionLot || b.lotNumber || "0", 10);
      return lotA - lotB;
    }
    const priceA = a.price || a.estimatedPrice || 0;
    const priceB = b.price || b.estimatedPrice || 0;
    if (sortOrder === "price_asc") return priceA - priceB;
    if (sortOrder === "price_desc") return priceB - priceA;
    return 0; // default newest from server
  });

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
    if (isRemateCategory) {
      return (
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-white border border-gray-100 animate-pulse rounded-xl shadow-xs"
            />
          ))}
        </div>
      );
    }
    return (
      <div className={viewMode === "list" ? "flex flex-col gap-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`${viewMode === "list" ? "h-40" : "h-72"} bg-white border border-gray-100 animate-pulse rounded-2xl shadow-xs`}
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
              category: "remate",
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

  if (isRemateCategory) {
    return (
      <div className={`transition-opacity flex flex-col gap-2.5 ${isFetching ? "opacity-50" : ""}`}>
        {articles.map((a) => (
          <AuctionLotRow key={a._id} article={a} theme={theme} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`transition-opacity ${isFetching ? "opacity-50" : ""} ${
        viewMode === "list"
          ? "flex flex-col gap-4"
          : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      }`}
    >
      {articles.map((a) => (
        <ArticleCard 
          key={a._id} 
          article={a} 
          theme={theme} 
          viewMode={viewMode}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  );
}

