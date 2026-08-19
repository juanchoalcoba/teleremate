import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[min(720px,calc(100vh-90px))] flex items-center overflow-hidden bg-white text-gray-900 py-10 lg:py-14 border-b border-gray-100">
      
      {/* ── LÍNEAS CRUZADAS DEFINIDAS Y VISIBLES DE LADO A LADO ── */}
      {/* 1. Malla de Cuadrícula Cruzada */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="hero-cross-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              {/* Línea Horizontal Nítida */}
              <line x1="0" y1="40" x2="80" y2="40" stroke="#cbd5e1" strokeWidth="1" strokeOpacity="0.6" />
              {/* Línea Vertical Nítida */}
              <line x1="40" y1="0" x2="40" y2="80" stroke="#cbd5e1" strokeWidth="1" strokeOpacity="0.6" />
              {/* Líneas Diagonales Cruzadas Doradas */}
              <line x1="0" y1="0" x2="80" y2="80" stroke="#9a7b38" strokeWidth="0.8" strokeDasharray="4 4" strokeOpacity="0.35" />
              <line x1="80" y1="0" x2="0" y2="80" stroke="#9a7b38" strokeWidth="0.8" strokeDasharray="4 4" strokeOpacity="0.35" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-cross-grid)" />
        </svg>
      </div>

      {/* 2. Líneas Diagonales Largas Cruzadas de Lado a Lado (Edge-to-Edge Beams) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1000 600">
          {/* Gran Diagonal de Izquierda Arriba a Derecha Abajo */}
          <line x1="-100" y1="0" x2="1100" y2="600" stroke="#9a7b38" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="-100" y1="100" x2="1100" y2="700" stroke="#ea580c" strokeWidth="1" strokeDasharray="6 6" strokeOpacity="0.2" />

          {/* Gran Diagonal Cruzada de Derecha Arriba a Izquierda Abajo */}
          <line x1="1100" y1="0" x2="-100" y2="600" stroke="#9a7b38" strokeWidth="1.5" strokeOpacity="0.25" />
          <line x1="1100" y1="100" x2="-100" y2="700" stroke="#9a7b38" strokeWidth="1" strokeDasharray="6 6" strokeOpacity="0.2" />

          {/* Líneas Horizontales Destacadas */}
          <line x1="0" y1="150" x2="1000" y2="150" stroke="#9a7b38" strokeWidth="1" strokeOpacity="0.2" />
          <line x1="0" y1="450" x2="1000" y2="450" stroke="#ea580c" strokeWidth="1" strokeOpacity="0.15" />
        </svg>
      </div>

      {/* ── MANCHAS DE DEGRADÉ AMBIENTALES DE ALTO IMPACTO (MESH GRADIENT BLOBS) ── */}
      {/* Mancha 1: Superior Derecha (Dorado Cálido & Ámbar) */}
      <div className="absolute -top-24 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-amber-400/25 via-orange-300/15 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse" />

      {/* Mancha 2: Inferior Izquierda (Cobre & Naranja Suave) */}
      <div className="absolute -bottom-28 -left-20 w-[650px] h-[650px] bg-gradient-to-tr from-amber-500/20 via-amber-300/15 to-transparent rounded-full blur-[130px] pointer-events-none" />

      {/* Mancha 3: Centro / Detrás del Icono (Resplandor Metálico) */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-orange-400/20 via-amber-300/25 to-amber-500/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Mancha 4: Superior Izquierda (Destello Dorado Foco) */}
      <div className="absolute top-12 left-1/4 w-[350px] h-[350px] bg-amber-300/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
        
        {/* LEFT: Text + CTA */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left relative z-10 lg:col-span-6 xl:col-span-6 w-full">
          
          {/* WhatsApp Group Button */}
          <a
            href="https://chat.whatsapp.com/BSnSdwa9CSQHWR2BM1HkHA"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-hero-btn relative z-20 inline-flex items-center gap-2 bg-[#128C7E] hover:bg-[#075E54] active:bg-[#054c44] text-white font-bold text-xs md:text-sm px-5 py-2 rounded-full mb-4 lg:mb-6 shadow-[0_4px_16px_rgba(18,140,126,0.3)] hover:shadow-[0_6px_22px_rgba(18,140,126,0.45)] transition-all duration-300 active:scale-95 uppercase tracking-wide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 shrink-0"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.122 1.528 5.855L.057 23.17a.75.75 0 0 0 .92.92l5.335-1.474A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.726 9.726 0 0 1-4.952-1.352l-.355-.21-3.668 1.014 1.032-3.573-.228-.368A9.726 9.726 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
            </svg>
            Unirse al grupo de WhatsApp
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
          </a>

          {/* Heading with Orange to Dark Gradient */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-black leading-[1.05] tracking-tight mb-4 lg:mb-6 flex flex-col items-center lg:items-start">
            {/* Mobile icon center */}
            <img
              src="/iconodefin.png"
              alt="Teleremate"
              loading="eager"
              decoding="sync"
              style={{ mixBlendMode: "multiply" }}
              className="block lg:hidden w-44 sm:w-56 h-auto object-contain my-3 animate-float mix-blend-multiply drop-shadow-md rounded-3xl p-3 bg-white/80 backdrop-blur-xs border border-gray-100 shadow-xl"
            />

            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-amber-900 bg-clip-text text-transparent">
              TELEREMATE
            </span>

            <span className="relative inline-block mt-1 sm:mt-0 animate-reveal bg-gradient-to-r from-[#9a7b38] via-orange-600 to-amber-800 bg-clip-text text-transparent">
              Uruguay
              <div className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-1 sm:h-1.5 bg-amber-500/20 rounded-full overflow-hidden">
                <div className="w-full h-full bg-[#9a7b38] animate-sweep" />
              </div>
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8 max-w-lg font-medium mx-auto lg:mx-0">
            La plataforma más confiable para subastas locales y venta directa. Fácil, seguro y totalmente transparente.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 w-full max-w-sm mx-auto sm:max-w-none">
            {/* BOTÓN: VER CATÁLOGOS */}
            <Link
              to="/catalogo"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-3 bg-gradient-to-r from-[#9a7b38] via-[#b89547] to-[#85672a] hover:from-[#85672a] hover:to-[#9a7b38] text-white font-black px-7 py-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#9a7b38]/30 active:scale-95 uppercase tracking-wider text-sm sm:text-base cursor-pointer"
            >
              <span>Ver Catálogos</span>
              <ArrowRight size={18} />
            </Link>

            {/* BOTÓN: VENDER */}
            <Link
              to="/vender"
              className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white/90 backdrop-blur-xs hover:bg-gray-50 border-2 border-gray-200 hover:border-[#9a7b38] text-gray-900 font-bold px-7 py-4 rounded-2xl transition-all duration-300 active:scale-95 uppercase tracking-wider text-sm sm:text-base shadow-xs hover:shadow-md cursor-pointer"
            >
              Vender Artículo
            </Link>
          </div>
        </div>

        {/* RIGHT: Logo iconodefin.png Visual inside rounded showcase card */}
        <div className="hidden lg:flex flex-col items-center justify-center relative z-10 lg:col-span-6 xl:col-span-6 w-full lg:pl-8">
          <div className="relative w-full max-w-[380px] lg:max-w-[460px] mx-auto flex items-center justify-center animate-float p-5 bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(154,123,56,0.12)]">
            {/* Glow Aura posterior directo detrás del logo */}
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-amber-400/20 via-orange-300/15 to-amber-500/15 blur-[60px] pointer-events-none" />

            <img
              src="/iconodefin.png"
              alt="Teleremate Uruguay"
              loading="eager"
              decoding="sync"
              style={{ mixBlendMode: "multiply" }}
              className="relative z-10 w-full h-auto object-contain mix-blend-multiply rounded-3xl"
            />
          </div>
        </div>
      </div>

      {/* Custom Styles for Hero Animations */}
      <style>{`
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
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-sweep { animation: sweep 5s ease-in-out infinite; }
        .animate-reveal { animation: reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </section>
  );
}
