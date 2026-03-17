import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getArticles } from "../../services/api";
import ArticleCard from "../catalog/ArticleCard";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function FeaturedArticles() {
  const { data, isLoading } = useQuery({
    queryKey: ["articles", "featured"],
    queryFn: () => getArticles({ featured: true, limit: 12 }),
  });

  const articles = data?.data?.articles || [];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
          
          <div className="flex items-center gap-6">
            <Link
              to="/catalogo"
              className="group hidden sm:inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-brand-600 transition-all font-display"
            >
              Catálogo completo
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            {/* Custom Navigation */}
            <div className="flex items-center gap-2">
              <button 
                id="prev-btn"
                className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm active:scale-90"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                id="next-btn"
                className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm active:scale-90"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
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
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1.2}
          navigation={{
            prevEl: "#prev-btn",
            nextEl: "#next-btn",
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
            el: ".swiper-pagination-custom",
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2.2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="!pb-16"
        >
          {articles.map((a) => (
            <SwiperSlide key={a._id}>
              <ArticleCard article={a} />
            </SwiperSlide>
          ))}
          
          {/* Custom dots at the bottom */}
          <div className="swiper-pagination-custom flex justify-center gap-2 mt-12" />
        </Swiper>
      )}

      {/* Mobile only link at bottom */}
      <div className="mt-8 sm:hidden text-center">
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-600"
        >
          Ver todo el catálogo
          <ArrowRight size={12} />
        </Link>
      </div>
      </div>
    </section>
  );
}
