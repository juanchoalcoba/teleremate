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
    <section className="py-24 relative overflow-hidden">
      {/* Subtle vertical marker line */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-32 bg-brand-500/10 rounded-r-full hidden lg:block" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-brand-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-500">
                Selección Premium
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight uppercase font-display">
              Objetos <span className="text-gray-400">Destacados</span>
            </h2>
          </div>
          
          <Link
            to="/catalogo"
            className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-brand-600 transition-all"
          >
            Explorar todo el catálogo
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
      </div>
    </section>
  );
}
