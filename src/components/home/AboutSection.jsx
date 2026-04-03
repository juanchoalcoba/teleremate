import { Gavel, ShieldCheck, Globe } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-gray-50/50 overflow-hidden relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="space-y-6">
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-brand-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-500">
                  Institucional
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight uppercase font-display leading-tight">
                ¿Qué es <span className="text-brand-500">Teleremate</span>?
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-xl">
                Tele-Remate es una plataforma de subastas en vivo y online activa desde 2005, dedicada a la compra y venta de una amplia variedad de productos, desde artículos nuevos y usados hasta vehículos e inmuebles. 
              </p>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-xl">
                A través de tecnología de streaming, catálogo web y atención telefónica, conecta compradores y vendedores de todo el país de forma ágil, segura y transparente. Fundada y dirigida por <span className="font-bold text-gray-900 whitespace-nowrap">Virginia C. Tierno</span> y el <span className="font-bold text-gray-900 whitespace-nowrap">Ing. Agr. Marcelo Mondino</span>.
              </p>
            </div>
          </div>

          {/* Right Column: Key Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <Gavel size={24} className="text-brand-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Subastas en vivo</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Experiencia real con tecnología de streaming de alta calidad.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <ShieldCheck size={24} className="text-brand-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Compra segura</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Transacciones protegidas y procesos verificados para su tranquilidad.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                  <Globe size={24} className="text-brand-500 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Alcance nacional</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Conectando compradores y vendedores en cada rincón del país.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle bottom separator line */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
        <div className="h-px w-full bg-linear-to-r from-transparent via-gray-200 to-transparent" />
      </div>
    </section>
  );
}
