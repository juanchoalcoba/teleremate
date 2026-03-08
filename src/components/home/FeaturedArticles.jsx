import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getArticles } from "../../services/api";
import ArticleCard from "../catalog/ArticleCard";

export default function FeaturedArticles() {
  const { data, isLoading } = useQuery({
    queryKey: ["articles", "featured"],
    queryFn: () => getArticles({ featured: true, limit: 4 }),
  });

  const articles = data?.data?.articles || [];

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-12">
        <h2 className="section-title">Destacados</h2>
        <Link
          to="/catalogo"
          className="text-brand-600 font-bold text-sm flex items-center gap-1 hover:underline"
        >
          VER TODO <ArrowRight size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-80 bg-gray-50 animate-pulse rounded-2xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {articles.map((a) => (
            <ArticleCard key={a._id} article={a} />
          ))}
        </div>
      )}
    </section>
  );
}
