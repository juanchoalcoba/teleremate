import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[min(800px,calc(100vh-90px))] flex items-center overflow-hidden bg-dark-950 py-16 lg:py-0">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/hero-bg.png"
          alt="Remates Teleremate"
          className="w-full h-full object-cover opacity-90 object-center"
        />
        {/* Gradient overlay: left dark, right lighter */}
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/50 to-dark-950/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* LEFT: Text + CTA */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left relative z-10 lg:col-span-5 xl:col-span-5 w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/30 rounded-full px-4 py-2 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
              Plataforma de Remates y Venta directa
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[5.5rem] font-black leading-[1.1] lg:leading-[0.95] tracking-tight text-white mb-6  drop-shadow-sm flex flex-col items-center lg:items-start">
            <span className="mb-2 lg:mb-0">TELEREMATE</span>

            <span
              className="text-orange-100 relative inline-block 
  [text-shadow:1px_1px_0_rgba(255,255,255,0.7),-1px_1px_0_rgba(255,255,255,0.7),1px_-1px_0_rgba(255,255,255,0.7),-1px_-1px_0_rgba(255,255,255,0.7)]"
            >
              Uruguay
              <span className="absolute -bottom-1.5 lg:-bottom-2 left-0 w-full h-1 lg:h-1.5 bg-brand-500/50 rounded-full" />
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-300 text-base md:text-xl leading-relaxed mb-8 max-w-md font-normal mx-auto lg:mx-0">
            La plataforma más confiable para subastas locales. Fácil, seguro y
            totalmente transparente.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 w-full">
            <Link
              to="/catalogo"
              className="w-full sm:w-auto group inline-flex justify-center items-center gap-3 bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-brand-500/30 active:scale-95"
            >
              Ver Catálogo
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <a
              href="https://wa.me/59899626385"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-white/5 border border-white/10 hover:border-white/30 text-white font-bold px-8 py-4 rounded-xl transition-all hover:bg-white/10 active:scale-95"
            >
              Consultar
            </a>
          </div>

          {/* Mini stats */}
        </div>

        {/* RIGHT: Logo Visual */}
        <div className="hidden lg:flex flex-col items-center justify-center relative z-0 lg:col-span-7 xl:col-span-7 w-full lg:pl-16 mt-8 lg:mt-0">
          {/* Constrained layout for Image */}
          <div className="relative w-full max-w-[280px] sm:max-w-[400px] lg:max-w-[750px] xl:max-w-[850px] mx-auto flex items-center justify-center lg:translate-x-4 xl:translate-x-12 lg:scale-110 xl:scale-125">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-brand-500/10 blur-[60px] lg:blur-[100px] scale-100 lg:scale-125" />
            <img
              src="/logoprincipal.png"
              alt="Teleremate"
              className="relative z-10 w-full object-contain drop-shadow-[0_0_80px_rgba(255,255,255,0.08)] brightness-110"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
