import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Gavel,
  ShieldCheck,
  Package,
  Truck,
  MessageCircle,
  Play,
  Armchair,
  Wrench,
  Tv,
  Car,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MapPin,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function HeroSection() {
  const [swiperInstance, setSwiperInstance] = useState(null);

  const categories = [
    {
      title: "HOGAR",
      sub: "Ver artículos",
      to: "/catalogo?category=deposito&subcategory=Muebles+y+Hogar",
      icon: Armchair,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    },
    {
      title: "HERRAMIENTAS",
      sub: "Ver artículos",
      to: "/catalogo?category=deposito&subcategory=Herramientas+y+Ferretería",
      icon: Wrench,
      image:
        "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80",
    },
    {
      title: "TECNOLOGÍA",
      sub: "Ver artículos",
      to: "/catalogo?category=deposito&subcategory=Electrodomésticos+y+Climatización",
      icon: Tv,
      image:
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80",
    },
    {
      title: "VEHÍCULOS",
      sub: "Ver artículos",
      to: "/catalogo?category=vehiculo",
      icon: Car,
      image:
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="relative w-full bg-zinc-950 overflow-hidden border-b border-zinc-800">
      
      {/* ── CONTENEDOR PRINCIPAL FULL-WIDTH (100% ANCHO, COHERENCIA TOTAL ENTRE SLIDES) ── */}
      <div className="relative w-full overflow-hidden group">
        
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            el: ".hero-custom-pagination",
            bulletClass: "hero-bullet",
            bulletActiveClass: "hero-bullet-active",
          }}
          onSwiper={setSwiperInstance}
          className="w-full h-full"
        >

          {/* ══════════════════════════════════════════════════════════════
              SLIDE 1: EL SHOWROOM DE OPORTUNIDADES
          ══════════════════════════════════════════════════════════════ */}
          <SwiperSlide className="w-full">
            <div className="relative w-full min-h-[500px] sm:min-h-[520px] lg:min-h-[540px] xl:min-h-[560px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white flex items-center overflow-hidden px-6 sm:px-12 lg:px-16 xl:px-24 py-6 sm:py-8 lg:py-10">
              
              {/* Iluminación ambiental */}
              <div className="absolute top-1/2 right-20 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[150px] pointer-events-none" />

              <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                
                {/* Columna Izquierda: Estructura Estándar */}
                <div className="lg:col-span-6 xl:col-span-6 text-left flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-400 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-3 w-fit backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                    <span>Subastas en vivo y venta directa</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.08] tracking-tight mb-3 text-white">
                    Las mejores{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">
                      oportunidades,
                    </span>
                    <br /> en un solo lugar.
                  </h1>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-5 max-w-xl font-medium">
                    Subastas locales, artículos nuevos y usados, con la confianza y garantía que solo{" "}
                    <strong className="text-white font-bold tracking-wider">TELEREMATE</strong> te da.
                  </p>

                  {/* 4 Micro-badges uniformes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                        <Gavel size={15} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-white leading-tight">En vivo</p>
                        <p className="text-[10px] text-gray-400">Participá online</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                        <ShieldCheck size={15} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-white leading-tight">Segura</p>
                        <p className="text-[10px] text-gray-400">Pagos protegidos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                        <Package size={15} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-white leading-tight">Variedad</p>
                        <p className="text-[10px] text-gray-400">+600 artículos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                        <Truck size={15} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-white leading-tight">Envíos</p>
                        <p className="text-[10px] text-gray-400">A todo Uruguay</p>
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex flex-row items-center gap-3 w-full">
                    <Link
                      to="/catalogo"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl sm:rounded-2xl shadow-lg shadow-orange-500/30 transition-all active:scale-95 whitespace-nowrap"
                    >
                      <span>VER CATÁLOGO</span>
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      to="/vender"
                      className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl sm:rounded-2xl transition-all active:scale-95 whitespace-nowrap"
                    >
                      <span>VENDER ARTÍCULO</span>
                      <MessageCircle size={16} className="text-emerald-400" />
                    </Link>
                  </div>
                </div>

                {/* Columna Derecha: Showroom Centrado */}
                <div className="lg:col-span-6 xl:col-span-6 h-[240px] sm:h-[300px] lg:h-[400px] xl:h-[440px] flex items-center justify-center lg:justify-end">
                  <img
                    src="/images/hero-showroom.jpg"
                    alt="Showroom Teleremate"
                    className="w-full max-w-[560px] lg:max-w-[620px] h-full object-contain select-none pointer-events-none drop-shadow-[0_20px_40px_rgba(249,115,22,0.25)]"
                  />
                </div>

              </div>
            </div>
          </SwiperSlide>

          {/* ══════════════════════════════════════════════════════════════
              SLIDE 2: CATEGORÍAS PRINCIPALES (MISMO ALTO Y PROPORCIÓN)
          ══════════════════════════════════════════════════════════════ */}
          <SwiperSlide className="w-full">
            <div className="relative w-full min-h-[500px] sm:min-h-[520px] lg:min-h-[540px] xl:min-h-[560px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white flex items-center overflow-hidden px-6 sm:px-12 lg:px-16 xl:px-24 py-6 sm:py-8 lg:py-10">
              
              {/* Iluminación ambiental */}
              <div className="absolute top-1/2 right-20 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[150px] pointer-events-none" />

              <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                
                {/* Columna Izquierda: Estructura Estándar */}
                <div className="lg:col-span-6 xl:col-span-6 text-left flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-400 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-3 w-fit backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                    <span>Catálogo de venta directa</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.08] tracking-tight mb-3 text-white">
                    Explorá nuestras{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">
                      categorías,
                    </span>
                    <br /> listas para entrega.
                  </h2>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-5 max-w-xl font-medium">
                    Muebles, herramientas, tecnología y vehículos inspeccionados para entrega inmediata o retiro en depósito.
                  </p>

                  {/* 4 Micro-badges uniformes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                        <Armchair size={15} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-white leading-tight">Hogar</p>
                        <p className="text-[10px] text-gray-400">Muebles y confort</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                        <Wrench size={15} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-white leading-tight">Herramientas</p>
                        <p className="text-[10px] text-gray-400">Taller y obra</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                        <Tv size={15} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-white leading-tight">Tecnología</p>
                        <p className="text-[10px] text-gray-400">Electro y audio</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                        <Car size={15} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-white leading-tight">Vehículos</p>
                        <p className="text-[10px] text-gray-400">Autos y utilitarios</p>
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex flex-row items-center gap-3 w-full">
                    <Link
                      to="/catalogo"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl sm:rounded-2xl shadow-lg shadow-orange-500/30 transition-all active:scale-95 whitespace-nowrap"
                    >
                      <span>VER CATÁLOGO</span>
                      <ArrowRight size={16} />
                    </Link>
                    <Link
                      to="/como-funciona"
                      className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl sm:rounded-2xl transition-all active:scale-95 whitespace-nowrap"
                    >
                      <Play size={14} className="text-orange-400 fill-orange-400" />
                      <span>CÓMO FUNCIONA</span>
                    </Link>
                  </div>
                </div>

                {/* Columna Derecha: Tarjetas Calibradas a la misma altura */}
                <div className="lg:col-span-6 xl:col-span-6 h-[240px] sm:h-[300px] lg:h-[400px] xl:h-[440px] grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 items-center">
                  {categories.map((cat, idx) => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={idx}
                        to={cat.to}
                        className="group relative h-full max-h-[230px] sm:max-h-[290px] lg:max-h-[380px] rounded-2xl overflow-hidden border border-white/15 hover:border-orange-500 transition-all duration-300 flex flex-col justify-end p-3 sm:p-4 shadow-xl hover:-translate-y-1"
                      >
                        <img
                          src={cat.image}
                          alt={cat.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 group-hover:opacity-85 transition-opacity" />
                        <div className="absolute inset-0 bg-orange-600/15 opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10 flex flex-col items-start">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-2 group-hover:bg-orange-500 group-hover:border-orange-400 transition-colors">
                            <Icon size={16} />
                          </div>
                          <h3 className="text-xs sm:text-sm font-black text-white tracking-wider uppercase leading-tight">
                            {cat.title}
                          </h3>
                          <span className="text-[10px] text-orange-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-0.5">
                            {cat.sub} <ArrowRight size={10} />
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>

              </div>
            </div>
          </SwiperSlide>

          {/* ══════════════════════════════════════════════════════════════
              SLIDE 3: COMPRA SEGURA Y GARANTÍA (MISMO FORMATO Y ALTO)
          ══════════════════════════════════════════════════════════════ */}
          <SwiperSlide className="w-full">
            <div className="relative w-full min-h-[500px] sm:min-h-[520px] lg:min-h-[540px] xl:min-h-[560px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white flex items-center overflow-hidden px-6 sm:px-12 lg:px-16 xl:px-24 py-6 sm:py-8 lg:py-10">
              
              {/* Iluminación ambiental */}
              <div className="absolute top-1/2 right-20 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/20 rounded-full blur-[150px] pointer-events-none" />

              <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                
                {/* Columna Izquierda: Estructura Estándar */}
                <div className="lg:col-span-6 xl:col-span-6 text-left flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-orange-500/50 bg-orange-500/10 text-orange-400 text-[11px] sm:text-xs font-black uppercase tracking-wider mb-3 w-fit backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                    <span>Transparencia y respaldo total</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.08] tracking-tight mb-3 text-white">
                    Todo lo que buscás,{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">
                      con total garantía,
                    </span>
                    <br /> y respaldo local.
                  </h2>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-5 max-w-xl font-medium">
                    Pagos protegidos con MercadoPago, transferencias directas o pago en persona al retirar en nuestro local en Durazno.
                  </p>

                  {/* 4 Micro-badges uniformes */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                        <CreditCard size={15} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-white leading-tight">MercadoPago</p>
                        <p className="text-[10px] text-gray-400">Tarjetas y cuotas</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                        <MapPin size={15} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-white leading-tight">Retiro local</p>
                        <p className="text-[10px] text-gray-400">En Durazno</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                        <Sparkles size={15} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-white leading-tight">Certificado</p>
                        <p className="text-[10px] text-gray-400">Estado revisado</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
                        <MessageCircle size={15} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-white leading-tight">WhatsApp</p>
                        <p className="text-[10px] text-gray-400">Atención directa</p>
                      </div>
                    </div>
                  </div>

                  {/* Botones */}
                  <div className="flex flex-row items-center gap-3 w-full">
                    <Link
                      to="/catalogo"
                      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl sm:rounded-2xl shadow-lg shadow-orange-500/30 transition-all active:scale-95 whitespace-nowrap"
                    >
                      <span>VER CATÁLOGO</span>
                      <ArrowRight size={16} />
                    </Link>
                    <a
                      href="https://chat.whatsapp.com/BSnSdwa9CSQHWR2BM1HkHA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 rounded-xl sm:rounded-2xl transition-all active:scale-95 whitespace-nowrap"
                    >
                      <span>GRUPO WHATSAPP</span>
                      <MessageCircle size={16} className="text-emerald-400" />
                    </a>
                  </div>
                </div>

                {/* Columna Derecha: Tarjeta Showcase con la misma altura */}
                <div className="lg:col-span-6 xl:col-span-6 h-[240px] sm:h-[300px] lg:h-[400px] xl:h-[440px] flex items-center justify-center lg:justify-end">
                  <div className="relative w-full max-w-[560px] lg:max-w-[620px] h-full max-h-[230px] sm:max-h-[290px] lg:max-h-[380px] bg-zinc-900/90 rounded-3xl p-5 sm:p-7 border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden">
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src="/iconodefin.png"
                          alt="Logo Teleremate"
                          className="h-8 w-auto object-contain invert brightness-0 invert-1"
                        />
                        <span className="font-black text-sm uppercase tracking-wider text-white">
                          TELEREMATE <span className="text-orange-500">URUGUAY</span>
                        </span>
                      </div>
                      <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                        100% Verificado
                      </span>
                    </div>

                    <div className="space-y-2 my-auto">
                      <p className="text-base sm:text-lg font-black text-white">
                        Venta Directa de Depósito & Remates Semanales
                      </p>
                      <p className="text-xs text-gray-400 leading-relaxed max-w-md">
                        Inspección rigurosa de cada lote. Comprá de forma online o visítanos en nuestro depósito oficial en la ciudad de Durazno.
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-bold text-gray-400">
                      <span>✓ Sin comisiones ocultas</span>
                      <span>✓ Envíos asegurados</span>
                      <span className="text-orange-400">Desde Durazno al país</span>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </SwiperSlide>

        </Swiper>

        {/* ── BOTONES DE NAVEGACIÓN LATERALES (FLOTANTES BIEN A LOS EXTREMOS) ── */}
        <button
          onClick={() => swiperInstance?.slidePrev()}
          className="absolute left-3 sm:left-5 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl hover:scale-110"
          aria-label="Slide anterior"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={() => swiperInstance?.slideNext()}
          className="absolute right-3 sm:right-5 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl hover:scale-110"
          aria-label="Slide siguiente"
        >
          <ChevronRight size={22} />
        </button>

        {/* ── PUNTOS DE PAGINACIÓN NARANJAS EN LA PARTE INFERIOR ── */}
        <div className="hero-custom-pagination absolute bottom-3 sm:bottom-4 left-0 right-0 z-30 flex justify-center items-center gap-2 pointer-events-auto" />

      </div>

      {/* Estilos para las balas de paginación del Hero */}
      <style>{`
        .hero-bullet {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background-color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
        }
        .hero-bullet-active {
          width: 28px !important;
          background-color: #ea580c !important;
          box-shadow: 0 0 12px rgba(234, 88, 12, 0.7);
        }
      `}</style>
    </section>
  );
}
