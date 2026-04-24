import { Gavel } from "lucide-react";

export default function AuctioneerSection() {
  return (
    <section className="py-12 md:py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark-950 rounded-[2.5rem] p-8 md:p-14 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center gap-12 border border-white/5">
          {/* Brillo decorativo de fondo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
          
          {/* Contenedor de Imagen */}
          <div className="relative z-10 shrink-0">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl md:rotate-3 hover:rotate-0 transition-all duration-500 group">
              <img 
                src="/rodrigo.jpeg" 
                alt="Rodrigo Baez de los Reyes" 
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all"
              />
            </div>
            {/* Sello Flotante */}
            <div className="absolute -bottom-4 -right-4 bg-brand-500 text-white p-4 rounded-2xl shadow-xl animate-float">
              <Gavel size={28} />
            </div>
          </div>

          {/* Contenido de Texto */}
          <div className="relative z-10 text-center md:text-left space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="h-px w-6 bg-brand-500" />
                <span className="text-brand-400 font-black uppercase tracking-[0.3em] text-[10px]">
                  Autoridad Oficial
                </span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white font-display leading-none uppercase tracking-tight">
                Rodrigo Baez <br className="hidden md:block" />
                <span className="text-gray-500">de los Reyes</span>
              </h2>
              <p className="text-brand-200 font-bold text-sm md:text-lg uppercase tracking-widest flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1">
                <span>Rematador Público</span>
                <span className="hidden md:inline text-white/20">•</span>
                <span>Tasador</span>
                <span className="hidden md:inline text-white/20">•</span>
                <span>Operador Inmobiliario</span>
              </p>
            </div>
            
            <p className="text-gray-400 text-base md:text-xl max-w-xl leading-relaxed font-light">
              Garantía de transparencia, seguridad y profesionalismo. Con una trayectoria 
              consolidada en el mercado, Rodrigo lidera cada instancia de remate asegurando 
              la mejor experiencia para todos nuestros clientes.
            </p>

            <div className="pt-4 flex items-center justify-center md:justify-start gap-4">
               <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-dark-950 bg-brand-500 flex items-center justify-center text-[10px] font-black text-white">UY</div>
               </div>
               <span className="text-gray-500 font-bold text-[10px] md:text-xs uppercase tracking-tight leading-tight">
                  Matricula 6230 - Inscripto en el Registro Nacional de Rematadores
               </span>
            </div>
          </div>

          {/* Logo de marca sutil al fondo */}
          <img 
            src="/logoprincipal.png" 
            alt="" 
            className="absolute bottom-[-10%] right-[-5%] w-64 opacity-[0.03] pointer-events-none grayscale invert"
          />
        </div>
      </div>
    </section>
  );
}
