import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bell } from "lucide-react";
import Typed from "typed.js";

const UPCOMING_AUCTIONS = ["Próximos remates: 25 y 26 de abril"];

// ✅ WebP optimizado
const HERO_IMAGES = ["/bgaura.webp", "/hero-bg.webp", "/3hero.webp"];

export default function HeroSection() {
  const typedRef = useRef(null);
  const [bgIndex, setBgIndex] = useState(0);

  // 🔁 Cambio de fondo
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // ⚡ Precarga de la siguiente imagen
  useEffect(() => {
    const nextIndex = (bgIndex + 1) % HERO_IMAGES.length;
    const img = new Image();
    img.src = HERO_IMAGES[nextIndex];
  }, [bgIndex]);

  // ⌨️ Typed
  useEffect(() => {
    if (UPCOMING_AUCTIONS.length === 0) return;

    const typed = new Typed(typedRef.current, {
      strings: UPCOMING_AUCTIONS,
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });

    return () => typed.destroy();
  }, []);

  return (
    <section className="relative w-full min-h-[min(800px,calc(100vh-90px))] flex items-center overflow-hidden bg-dark-950 py-16 lg:py-0">
      {/* ✅ UNA sola imagen (no map) */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGES[bgIndex]}
          alt="Remates Teleremate"
          className="w-full h-full object-cover object-center animate-kenburns transition-opacity duration-1000 ease-in-out opacity-90"
          loading="eager"
          fetchpriority="high"
        />
        <div className="absolute inset-0 bg-linear-to-r from-dark-950 via-dark-950/50 to-dark-950/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* LEFT */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:col-span-5">
          {/* Ticker */}
          {UPCOMING_AUCTIONS.length > 0 && (
            <div className="inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-4">
              <Bell size={12} className="text-brand-500" />
              <span className="text-white/90 text-xs font-black uppercase tracking-[0.1em]">
                <span ref={typedRef} />
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6">
            TELEREMATE <br />
            <span className="text-blue-200">Uruguay</span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-300 text-base md:text-xl mb-8 max-w-md">
            La plataforma más confiable para subastas locales.
          </p>

          {/* CTAs */}
          <div className="flex gap-4 flex-wrap justify-center lg:justify-start">
            <Link
              to="/catalogo"
              className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-2xl flex items-center gap-2"
            >
              Ver Catálogos <ArrowRight size={18} />
            </Link>

            <Link
              to="/vender"
              className="bg-white/5 border border-white/20 text-white font-bold px-8 py-4 rounded-2xl"
            >
              VENDER
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden lg:flex justify-center lg:col-span-7">
          <img
            src="/logoprincipal.png"
            alt="Teleremate"
            className="max-w-[700px] object-contain"
          />
        </div>
      </div>

      {/* Animaciones */}
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-kenburns {
          animation: kenburns 20s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
