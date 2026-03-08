import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Tag,
  Calendar,
  ShieldCheck,
  Phone,
  Maximize2,
  Info,
} from "lucide-react";
import { getArticleById } from "../../services/api";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleById(id),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-100 rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-10 bg-gray-100 rounded-lg w-3/4"></div>
            <div className="h-6 bg-gray-100 rounded-lg w-1/4"></div>
            <div className="h-40 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Info size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold">Artículo no encontrado</h2>
        <Link to="/catalogo" className="btn-primary mt-6">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const article = data.data;
  const currentImage =
    article.images?.[activeImageIdx]?.url ||
    "https://images.unsplash.com/photo-1558618047-3fd3eb4d5af6?w=800";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/catalogo"
        className="flex items-center text-gray-500 hover:text-brand-600 mb-8 font-medium"
      >
        <ChevronLeft size={18} className="mr-1" /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square rounded-[2rem] overflow-hidden border border-gray-100 bg-white relative group shadow-sm">
            <img
              src={currentImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
            />
            <button className="absolute bottom-6 right-6 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 size={18} />
            </button>
          </div>
          {article.images?.length > 1 && (
            <div className="grid grid-cols-5 gap-3 mt-4">
              {article.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${activeImageIdx === idx ? "border-brand-500 shadow-md ring-2 ring-brand-50" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap gap-3 mb-8">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full">
              <Tag size={14} className="text-brand-500" /> {article.category}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full">
              <ShieldCheck size={14} className="text-brand-500" />{" "}
              {article.condition}
            </div>
          </div>

          <div className="flex-1 bg-white border border-gray-50 rounded-3xl p-8 mb-8">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
              Información del lote
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              {article.description}
            </p>
          </div>

          <div className="bg-dark-950 text-white p-8 rounded-[2rem] shadow-xl">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-gray-500 text-[10px] font-black mb-2 uppercase tracking-[0.2em]">
                  Inversión estimada
                </p>
                <p className="text-4xl font-black text-white">
                  $ {article.estimatedPrice?.toLocaleString("es-UY")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-brand-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                  Remate
                </p>
                <div className="flex items-center gap-2 text-white font-bold italic">
                  <Calendar size={18} />{" "}
                  {article.auctionDate
                    ? new Date(article.auctionDate).toLocaleDateString("es-UY")
                    : "Próximamente"}
                </div>
              </div>
            </div>
            <a
              href={`https://wa.me/59899626385?text=Hola, consulto por el lote ${article.title}`}
              target="_blank"
              className="btn-primary bg-green-700 w-full py-5 text-base shadow-lg shadow-brand-500/20"
            >
              <Phone size={18} className="mr-3" /> Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
