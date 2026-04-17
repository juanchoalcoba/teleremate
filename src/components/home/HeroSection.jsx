import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bell } from "lucide-react";
import Typed from "typed.js";

const UPCOMING_AUCTIONS = ["Próximos remates: 25 y 26 de abril"];

const HERO_IMAGES = ["/bgaura.webp", "/hero-bg.webp", "/3hero.webp"];

export default function HeroSection() {
  const typedRef = useRef(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [fade, setFade] = useState(false);

  // Background optimized loop
  useEffect(() => {
    const timer = setInterval(() => {
      setFade(true);

      setTimeout(() => {
        setBgIndex((prev) => {
          const newIndex = (prev + 1) % HERO_IMAGES.length;
          setNextIndex((newIndex + 1) % HERO_IMAGES.length);
          return newIndex;
        });
        setFade(false);
      }, 500); // transición real
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Typed
  useEffect(() => {
    if (!typedRef.current) return;

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
      {/* BACKGROUND OPTIMIZADO */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Imagen actual */}
        <img
          src={HERO_IMAGES[bgIndex]}
          alt="Remates Teleremate"
          loading="eager"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out will-change-transform ${
            fade ? "opacity-0" : "opacity-90 animate-kenburns"
          }`}
        />

        {/* Preload siguiente */}
        <img
          src={HERO_IMAGES[nextIndex]}
          alt=""
          loading="lazy"
          className="hidden"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-dark-950 via-dark-950/50 to-dark-950/50" />
      </div>

      {/* CONTENT (igual que el tuyo, no se toca) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:col-span-5 w-full">
          {/* Ticker */}
          {UPCOMING_AUCTIONS.length > 0 && (
            <div className="inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-4 shadow-xl">
              <Bell size={12} className="text-brand-500" />
              <span className="text-white text-xs font-black uppercase tracking-wider">
                <span ref={typedRef} />
              </span>
            </div>
          )}

          {/* Heading */}
          <h1 className="text-5xl lg:text-7xl font-black text-white mb-6">
            TELEREMATE
            <span className="block text-blue-200">Uruguay</span>
          </h1>

          <p className="text-gray-300 mb-8 max-w-md">
            La plataforma más confiable para subastas locales.
          </p>

          {/* CTA */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <Link
              to="/catalogo"
              className="bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
            >
              Ver Catálogos <ArrowRight size={16} />
            </Link>

            <Link
              to="/vender"
              className="border border-white/20 text-white px-6 py-3 rounded-xl"
            >
              Vender
            </Link>
          </div>
        </div>
      </div>

      {/* Animaciones optimizadas */}
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .animate-kenburns {
          animation: kenburns 20s ease-in-out infinite;
          will-change: transform;
        }

        .typed-cursor {
          color: var(--color-brand-500);
          font-weight: 900;
        }
      `}</style>
    </section>
  );
}
