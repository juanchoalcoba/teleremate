import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bell } from "lucide-react";
import Typed from "typed.js";

const UPCOMING_AUCTIONS = ["REMATADOR: Rodrigo Báez de los Reyes"];

const HERO_IMAGES = ["/bgaura.webp", "/hero-bg.webp", "/3hero.webp"];

export default function HeroSection() {
  const typedRef = useRef(null);
  const [bgIndex, setBgIndex] = useState(0);

  // Background Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3000); // 5 seconds (1s transition + 4s stable)
    return () => clearInterval(timer);
  }, []);

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

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <section className="relative w-full min-h-[min(800px,calc(100vh-90px))] flex items-center overflow-hidden bg-dark-950 py-4 lg:py-0">
      {/* Background Image ... */}
      {/* Background Images Loop */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {HERO_IMAGES.map((src, index) => (
          <img
            key={src}
            src={src}
            alt="Remates Teleremate"
            className={`absolute inset-0 w-full h-full object-cover object-center animate-kenburns transition-opacity duration-1000 ease-in-out ${
              index === bgIndex ? "opacity-90" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-linear-to-r from-dark-950 via-dark-950/50 to-dark-950/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* LEFT: Text + CTA */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left relative z-10 lg:col-span-5 xl:col-span-5 w-full">
          {/* Auction Ticker Badge */}
          {UPCOMING_AUCTIONS.length > 0 && (
            <div className="inline-flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-1 lg:mb-4 shadow-xl animate-reveal animation-delay-300">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-brand-500/20 blur-sm rounded-full animate-pulse" />
                <Bell size={12} className="text-brand-500 relative z-10" />
              </div>
              <span className="text-white/90 text-[10px] md:text-xs font-black uppercase tracking-[0.1em] min-h-[1.2rem] flex items-center">
                <span ref={typedRef} />
              </span>
            </div>
          )}

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-2 lg:mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-gray-100 text-[10px] md:text-xs font-bold uppercase tracking-widest">
              Plataforma de Remates y Venta directa
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-display font-black leading-[1.1] lg:leading-[0.95] tracking-tight text-white mb-4 lg:mb-6 drop-shadow-md flex flex-col items-center lg:items-start">
            {/* Imagen exclusiva para celulares - TAMAÑO MÁXIMO */}
            <img
              src="/LOGOTRANSPARENTE.png"
              alt="Teleremate"
              className="block lg:hidden w-full max-w-[550px] h-auto object-contain -mt-12 -mb-20 animate-reveal drop-shadow-[0_0_50px_rgba(255,255,255,0.25)] scale-125"
            />

            {/* Texto exclusivo para Desktop y Pantallas Grandes */}
            <span className="hidden lg:block mb-1 lg:mb-0">TELEREMATE </span>

            <span
              className="relative inline-block sm:scale-100 mt-2 sm:mt-0 animate-reveal
  bg-gradient-to-r from-white via-orange-100 to-orange-200
  bg-clip-text [-webkit-background-clip:text] text-transparent
  [-webkit-text-stroke:1px_black]
  drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]"
            >
              Uruguay
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1 sm:h-1.5 bg-white/70 rounded-full overflow-hidden">
                <div className="w-full h-full bg-white/80 animate-sweep" />
              </div>
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-300 text-base md:text-xl leading-relaxed mb-8 max-w-md font-normal mx-auto lg:mx-0">
            La plataforma más confiable para subastas locales. Fácil, seguro y
            totalmente transparente.
          </p>

          {/* CTA Buttons - Híbridos (Premium en móvil, Original en Desktop) */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 w-full mt-4">
            {/* BOTÓN: VER CATÁLOGOS */}
            <Link
              to="/catalogo"
              className="relative w-auto min-w-[220px] sm:w-auto sm:min-w-0 group overflow-hidden inline-flex justify-center items-center gap-4 bg-linear-to-r from-brand-500 via-brand-600 to-brand-500 bg-[length:200%_auto] sm:bg-brand-500 sm:bg-none hover:bg-[right_center] text-white font-black sm:font-bold px-10 py-5 sm:px-8 sm:py-4 rounded-full sm:rounded-2xl transition-all duration-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] sm:shadow-none hover:shadow-[0_0_35px_rgba(249,115,22,0.5)] sm:hover:shadow-xl sm:hover:shadow-brand-500/30 active:scale-95 uppercase sm:normal-case text-sm"
            >
              {/* El brillo animado */}
              <span className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine sm:hidden" />
              Ver Catálogos
              <div className="bg-white/20 sm:bg-transparent rounded-full p-1 sm:p-0 group-hover:translate-x-1 transition-transform">
                <ArrowRight size={18} />
              </div>
            </Link>

            {/* BOTÓN: VENDER */}
            <Link
              to="/vender"
              className="w-auto min-w-[220px] sm:w-auto sm:min-w-0 inline-flex justify-center items-center gap-3 bg-white/5 backdrop-blur-md sm:backdrop-blur-none border-2 sm:border border-white/10 sm:border-white/20 hover:border-white/30 sm:hover:border-white/40 text-white font-black sm:font-bold px-10 py-5 sm:px-8 sm:py-4 rounded-full sm:rounded-2xl transition-all duration-300 hover:bg-white/10 active:scale-95 uppercase sm:normal-case text-sm"
            >
              Vender Artículo
            </Link>
          </div>

          {/* Mini stats */}
        </div>

        {/* RIGHT: Logo Visual */}
        <div className="hidden lg:flex flex-col items-center justify-center relative z-0 lg:col-span-7 xl:col-span-7 w-full lg:pl-16 mt-8 lg:mt-0">
          {/* Constrained layout for Image */}
          <div className="relative w-full max-w-[280px] sm:max-w-[400px] lg:max-w-[750px] xl:max-w-[850px] mx-auto flex items-center justify-center lg:translate-x-4 xl:translate-x-12 lg:scale-110 xl:scale-125 animate-float">
            {/* Simple static glow ring */}
            <div className="absolute inset-0 rounded-full bg-brand-500/10 blur-[60px] lg:blur-[100px] scale-100 lg:scale-125" />

            <img
              src="/logoprincipal.png"
              alt="Teleremate"
              className="relative z-10 w-full object-contain drop-shadow-[0_0_80px_rgba(255,255,255,0.08)] brightness-110"
            />
          </div>
        </div>
      </div>
      {/* Custom Styles for Hero Animations */}
      <style>{`
        @keyframes kenburns {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes reveal {
          0% { opacity: 0; transform: translateY(10px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
        .animate-kenburns { animation: kenburns 30s ease-in-out infinite; }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-sweep { animation: sweep 5s ease-in-out infinite; }
        .animate-reveal { animation: reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .group-hover\\:animate-shine { animation: shine 0.8s ease-in-out; }
        .animation-delay-300 { animation-delay: 300ms; }
        .typed-cursor { color: var(--color-brand-500); font-weight: 900; margin-left: 2px; }
      `}</style>
    </section>
  );
}
