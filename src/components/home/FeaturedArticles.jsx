import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getArticles } from "../../services/api";
import ArticleCard from "../catalog/ArticleCard";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function FeaturedArticles() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["articles", "featured"],
    queryFn: () => getArticles({ featured: true, limit: 50 }),
  });

  const articles = data?.data?.articles || [];

  return (
    <section className="pt-8 md:pt-12 pb-24 relative overflow-hidden">
      {/* Subtle vertical marker line */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-32 bg-brand-500/10 rounded-r-full hidden lg:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
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
            className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-brand-600 transition-all font-display"
          >
            Explorar todo el catálogo
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {isError ? (
          <div className="flex flex-col items-center justify-center py-20 bg-red-50/50 rounded-3xl border border-red-100">
            <p className="font-bold text-red-600 mb-2">
              Error al cargar los artículos destacados
            </p>
            <button
              onClick={() => refetch()}
              className="text-sm font-bold text-brand-600 hover:underline"
            >
              Reintentar
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-80 bg-gray-50 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : (
          <div className="featured-slider-container -mx-4 px-4 sm:mx-0 sm:px-0">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={24}
              slidesPerView={1.2}
              centeredSlides={true}
              loop={articles.length > 4}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2.2,
                  centeredSlides: false,
                },
                1024: {
                  slidesPerView: 4,
                  centeredSlides: false,
                  spaceBetween: 24,
                },
              }}
              className="pb-20 featured-swiper"
            >
              {articles.map((a) => (
                <SwiperSlide key={a._id} className="h-auto py-2">
                  <ArticleCard article={a} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .featured-swiper .swiper-pagination-bullet-active {
          background-color: #18181b !important;
        }
        .featured-swiper .swiper-pagination {
          bottom: 0 !important;
        }
        .featured-swiper .swiper-slide {
          height: auto;
        }
      `}} />
    </section>
  );
}
