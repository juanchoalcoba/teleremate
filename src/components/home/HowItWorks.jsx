import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gavel, Shield, TrendingUp, ArrowRight } from "lucide-react";
import { getWALink, WAMessages, TELEREMATE_WA } from "../../utils/whatsapp";

const steps = [
  {
    number: "01",
    icon: TrendingUp,
    title: "Explorá",
    tag: "Catálogo verificado",
    desc: "Navegá nuestro catálogo completo de artículos verificados y encontrá exactamente lo que buscás.",
    cta: "Ver catálogo",
    link: "/catalogo",
  },
  {
    number: "02",
    icon: Gavel,
    title: "Consultá",
    tag: "Atención directa",
    desc: "Pedí más información, coordiná para ver el artículo en persona o contactanos por WhatsApp.",
    cta: "Hablar con un asesor",
    isWhatsApp: true,
  },
  {
    number: "03",
    icon: Shield,
    title: "Compra y Vende",
    tag: "100% seguro",
    desc: "Participá de nuestros remates de forma segura o envianos tus artículos para vender con nosotros.",
    cta: "Contactar ahora",
    link: "/vender",
  },
];

function StepCard({ step, index, isVisible }) {
  const navigate = useNavigate();
  const Icon = step.icon;
  const delay = index * 150;

  const handleClick = () => {
    if (step.link) {
      navigate(step.link);
    } else if (step.isWhatsApp) {
      window.open(getWALink(TELEREMATE_WA, WAMessages.general), "_blank");
    }
  };

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
      className="group relative flex flex-col"
      onClick={handleClick}
    >
      {/* Card */}
      <div
        className="relative flex-1 rounded-2xl overflow-hidden cursor-pointer"
        style={{
          background: "linear-gradient(145deg, #1a1a1a 0%, #111 100%)",
          border: "1px solid #2a2a2a",
        }}
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 90%)",
          }}
        />

        {/* Top bar accent */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          }}
        />

        <div className="p-8 flex flex-col h-full">
          {/* Number + Tag row */}
          <div className="flex items-start justify-between mb-6">
            <span
              className="font-black leading-none select-none"
              style={{
                fontSize: "clamp(4rem, 8vw, 6rem)",
                color: "#1f1f1f",
                fontFamily: "'Georgia', serif",
                lineHeight: 1,
              }}
            >
              {step.number}
            </span>
            <span
              className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mt-2"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {step.tag}
            </span>
          </div>

          {/* Icon circle */}
          <div
            className="mb-5 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Icon size={22} style={{ color: "#ffffff" }} />
          </div>

          {/* Title */}
          <h3
            className="text-2xl font-bold mb-3 text-white tracking-tight"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {step.title}
          </h3>

          {/* Desc */}
          <p
            className="text-sm leading-relaxed mb-8 flex-1"
            style={{ color: "#999" }}
          >
            {step.desc}
          </p>

          {/* CTA */}
          <div
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest group/cta transition-colors hover:text-white"
            style={{ color: "#ffffff" }}
          >
            <span>{step.cta}</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover/cta:translate-x-1"
            />
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-orange-400 transition-all duration-500 group-hover:right-0"
          style={{ width: "0%", right: "100%" }}
        />
        <div
          className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500"
          style={{ background: "linear-gradient(90deg, #ffffff, #aaaaaa)" }}
        />
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.02) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 40%)`,
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className="mb-20"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8" style={{ background: "#ffffff" }} />
            <span
              className="text-xs font-bold uppercase tracking-[0.4em]"
              style={{ color: "#ffffff" }}
            >
              Guía rápida
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2
              className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              ¿Cómo
              <br />
              <span style={{ color: "#ffffff" }}>funciona?</span>
            </h2>

            <p
              className="text-sm leading-relaxed max-w-xs md:text-right"
              style={{ color: "#888" }}
            >
              En tres simples pasos podés participar de nuestros remates y
              conseguir lo que buscás.
            </p>
          </div>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {steps.map((step, i) => (
            <StepCard key={i} step={step} index={i} isVisible={isVisible} />
          ))}
        </div>

        {/* Bottom strip */}
        <div
          className="mt-12 flex items-center justify-between px-6 py-4 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid #1f1f1f",
            opacity: isVisible ? 1 : 0,
            transition: "opacity 0.7s ease 600ms",
          }}
        >
          <p className="text-xs" style={{ color: "#888" }}>
            Más de <span className="text-white font-semibold">2.400 artículos</span>{" "}
            rematados exitosamente
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs" style={{ color: "#888" }}>
              Remate en curso
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
