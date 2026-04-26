import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
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
  BookmarkPlus,
  ShoppingCart,
  MessageCircle
} from "lucide-react";
import { getArticleById } from "../../services/api";
import PurchaseModal from "../../components/modals/PurchaseModal";
import ReservationModal from "../../components/modals/ReservationModal";
import AnnotationModal from "../../components/modals/AnnotationModal";
import { getWALink, WAMessages, TELEREMATE_WA } from "../../utils/whatsapp";
import { getImageUrl } from "../../utils/imageUtils";
import { getCategoryLabel, getPriceLabel, getCurrencySymbol } from "../../utils/articleUtils";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleById(id),
  });

  const article = data?.data;

  const absoluteUrl = useMemo(() => `${window.location.origin}/articulo/${id}`, [id]);
  
  const shareDescription = useMemo(() => {
    if (!article) return "Consultá este artículo en Teleremate";
    return `Consultá por este artículo en Teleremate. ${getPriceLabel(article)}: ${getCurrencySymbol(article.currency, article.category)} ${article.estimatedPrice?.toLocaleString("es-UY")}`;
  }, [article]);

  const currentImage = useMemo(() => {
    if (!article) return "https://images.unsplash.com/photo-1558618047-3fd3eb4d5af6?w=800";
    return getImageUrl(article.images?.[activeImageIdx]?.url) || "https://images.unsplash.com/photo-1558618047-3fd3eb4d5af6?w=800";
  }, [article, activeImageIdx]);

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

  if (error || !article) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Helmet>
        <title>{article.title} | Teleremate</title>
        <meta name="description" content={shareDescription} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={`${article.title} | Teleremate`} />
        <meta property="og:description" content={shareDescription} />
        <meta property="og:image" content={currentImage} />
        <meta property="og:url" content={absoluteUrl} />
        <meta property="og:type" content="product" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={shareDescription} />
        <meta name="twitter:image" content={currentImage} />
      </Helmet>

      <Link
        to="/catalogo"
        className="flex items-center text-gray-500 hover:text-brand-600 mb-8 font-medium"
      >
        <ChevronLeft size={18} className="mr-1" /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square rounded-4xl overflow-hidden border border-gray-100 bg-white relative group shadow-sm">
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
                    src={getImageUrl(img.url)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight leading-tight whitespace-normal">
            {article.auctionLot && (
              <span className="text-brand-500 mr-4">Lote #{article.auctionLot}</span>
            )}
            {article.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full">
              <Tag size={14} className="text-brand-500" />{" "}
              {getCategoryLabel(article.category)}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 px-4 py-2 rounded-full">
              <ShieldCheck size={14} className="text-brand-500" />{" "}
              {article.condition}
            </div>
          </div>

          <div className="flex-1 bg-white border border-gray-50 rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
              Información del artículo
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-sm md:text-base">
              {article.description}
            </p>
          </div>

          <div className="bg-dark-950 text-white p-8 rounded-4xl shadow-xl">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-gray-400 text-[10px] font-black mb-2 uppercase tracking-[0.2em]">
                  {getPriceLabel(article)}
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-black text-white whitespace-nowrap">
                  {getCurrencySymbol(article.currency, article.category)} $ {article.estimatedPrice?.toLocaleString("es-UY")}
                </p>
              </div>
              <div className="text-right">
                {article.category === "remate" ? (
                  <>
                    <p className="text-brand-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                       Fecha de Remate
                    </p>
                    <div className="flex items-center gap-2 text-brand-400 font-black italic justify-end">
                      <Calendar size={18} />{" "}
                      {article.auctionDate 
                        ? new Date(article.auctionDate).toLocaleDateString("es-UY", { timeZone: 'UTC' })
                        : "Fecha a confirmar"}
                    </div>
                  </>
                ) : (
                  article.reservedUntil && (
                    <>
                      <p className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                        Reservado hasta
                      </p>
                      <div className="flex items-center gap-2 text-orange-400 font-bold italic justify-end animate-pulse">
                        <Calendar size={18} />{" "}
                        {new Date(article.reservedUntil).toLocaleDateString("es-UY", { timeZone: 'UTC' })}
                      </div>
                    </>
                  )
                )}
              </div>
            </div>

            {/* Status Badge */}
            {(article.status === "reserved" || article.hasActiveReservation) && (
              <div className="mb-4 p-3 bg-orange-500/20 border border-orange-500/50 rounded-2xl flex flex-col items-center">
                <p className="text-orange-400 font-black text-center text-sm tracking-widest uppercase">
                  Reservado
                </p>
              </div>
            )}

            {article.status === "sold" && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/40 rounded-3xl flex flex-col items-center shadow-inner">
                <p className="text-red-600 font-black text-center text-sm tracking-[0.2em] uppercase animate-pulse">
                   ESTE ARTÍCULO HA SIDO VENDIDO
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {(article.status !== "sold" && article.status !== "reserved" && article.category !== "remate") && (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                      onClick={() => setShowReservationModal(true)}
                      disabled={article.hasActiveReservation || article.hasActivePurchase}
                      className={`flex items-center justify-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-all transform ${
                        article.hasActiveReservation || article.hasActivePurchase
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                          : "bg-linear-to-r from-brand-500 to-brand-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                      }`}
                    >
                      <BookmarkPlus size={18} /> Reservar
                    </button>
                    <button
                      onClick={() => setShowPurchaseModal(true)}
                      disabled={article.hasActiveReservation || article.hasActivePurchase}
                      className={`flex items-center justify-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg transition-all transform ${
                        article.hasActiveReservation || article.hasActivePurchase
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
                          : "bg-linear-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                      }`}
                    >
                      <ShoppingCart size={18} /> Comprar
                    </button>
                  </div>
                </>
              )}
              {article.category === "remate" && article.status !== "sold" && (
                <button
                  onClick={() => setShowAnnotationModal(true)}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-brand-500/20 active:scale-95 transition-all mb-3 flex items-center justify-center gap-2"
                >
                  <BookmarkPlus size={20} /> ANOTARME AL REMATE
                </button>
              )}
              <a
                href={getWALink(TELEREMATE_WA, WAMessages.inquiry(article.lotNumber, article.title))}
                target="_blank"
                rel="noreferrer"
                className="btn-primary bg-green-700 w-full py-3 text-[13px] sm:text-sm whitespace-nowrap shadow-md shadow-brand-500/10 flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} className="shrink-0" />  Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAnnotationModal && (
        <AnnotationModal
          articleId={id}
          onClose={() => setShowAnnotationModal(false)}
        />
      )}
      {showReservationModal && (
        <ReservationModal
          articleId={id}
          onClose={() => setShowReservationModal(false)}
          onSuccess={() => {
            refetch();
          }}
        />
      )}

      {showPurchaseModal && (
        <PurchaseModal
          articleId={id}
          onClose={() => setShowPurchaseModal(false)}
          onSuccess={() => {
            refetch();
          }}
        />
      )}
    </div>
  );
}
