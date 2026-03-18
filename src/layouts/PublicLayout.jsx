import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  Menu,
  X,
  Phone,
  Mail,
  ArrowRight,
  Facebook,
  Instagram,
  MapPin,
} from "lucide-react";
import { getWALink, WAMessages, TELEREMATE_WA } from "../utils/whatsapp";
import TermsModal from "../components/modals/TermsModal";
import InstallPWA from "../components/common/InstallPWA";

const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/catalogo", label: "Catálogo" },
    { to: "/vender", label: "Vender" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── TOP CONTACT BAR ── */}
      <div className="hidden md:block bg-brand-500 text-white py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-end items-center gap-6 text-[11px] font-bold  tracking-widest">
          <a
            href="tel:099626385"
            className="flex items-center gap-2 hover:text-white/80 transition-colors"
          >
            <Phone size={12} /> 099 626 385
          </a>
          <a
            href="mailto:contacto@teleremate.com.uy"
            className="flex items-center gap-2 hover:text-white/80 transition-colors"
          >
            <Mail size={12} /> contacto@tele-remate.com.uy
          </a>
        </div>
      </div>

      {/* ── NAVBAR ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 bg-dark-950 ${
          scrolled
            ? "shadow-2xl shadow-black/40 border-b border-white/5"
            : "border-b border-white/0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logoprincipal.png"
                alt="Teleremate"
                className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex items-center gap-2.5">
                <span className="hidden sm:block font-black text-white text-sm uppercase tracking-[0.15em] leading-none">
                  Tele<span className="text-gray-300">remate</span>
                </span>
                <img
                  src="https://flagcdn.com/w20/uy.png"
                  alt="Uruguay"
                  className="h-3.5 w-auto sm:h-2.5 rounded-[1px] opacity-70 sm:opacity-60 border border-white/10 shadow-sm"
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => {
                const isActive = pathname === to;
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                      isActive
                        ? "text-white bg-white/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {label}
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-orange-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA + Hamburger */}
            <div className="flex items-center gap-3">
              {/* Social Icons Desktop */}
              <div className="hidden md:flex items-center gap-3">
                <a
                  target="_blank"
                  href="https://www.facebook.com/canal6zebra"
                  className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/10"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  target="_blank"
                  href="https://www.instagram.com/teleremate/"
                  className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all border border-white/5 hover:border-white/10"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href={getWALink(TELEREMATE_WA, WAMessages.general)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-[#25D366] hover:bg-white/10 transition-all border border-white/5 hover:border-white/10"
                  aria-label="WhatsApp"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.602 6.602 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                  </svg>
                </a>
              </div>
              <button
                className="md:hidden p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-all"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-dark-950/98 backdrop-blur-md border-t border-white/5 px-4 py-4 flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                  pathname === to
                    ? "text-white bg-brand-500/20 border border-brand-500/30"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            ))}
            {/* Social Icons Mobile */}
            <div className="mt-2 flex items-center justify-center gap-4 py-4 border-t border-white/5">
              <a
                href="https://www.facebook.com/canal6zebra"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-white"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://www.instagram.com/teleremate/"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href={getWALink(TELEREMATE_WA, WAMessages.general)}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-[#25D366]"
                aria-label="WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.602 6.602 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="grow">
        <Outlet />
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-black text-gray-300 py-16 lg:py-24 border-t border-white/5 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand & Intro */}
            <div className="lg:col-span-1">
              <img
                src="/logoprincipal.png"
                alt="Teleremate"
                className="h-20 w-auto object-contain mb-8 drop-shadow-sm"
              />
              <p className="text-gray-400 text-sm leading-relaxed mb-8 pr-4">
                La plataforma líder en remates online de Durazno y la región.
                Transparencia, confianza y seguridad en cada artículo que adquieres.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all duration-300 shadow-lg"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all duration-300 shadow-lg"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href={getWALink(TELEREMATE_WA, WAMessages.general)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all duration-300 shadow-lg"
                  aria-label="WhatsApp"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.602 6.602 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em] relative inline-block">
                Navegación
                <span className="absolute -bottom-3 left-0 w-8 h-1 bg-brand-200 rounded-full"></span>
              </h3>
              <ul className="space-y-4">
                {navLinks.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-gray-400 text-sm hover:text-white hover:translate-x-1 inline-flex items-center transition-all duration-300"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/como-funciona"
                    className="text-gray-400 text-sm hover:text-white hover:translate-x-1 inline-flex items-center transition-all duration-300"
                  >
                    ¿Cómo funciona?
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support / Services */}
            <div>
              <h3 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em] relative inline-block">
                Servicios
                <span className="absolute -bottom-3 left-0 w-8 h-1 bg-brand-200 rounded-full"></span>
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-white hover:translate-x-1 inline-flex items-center transition-all duration-300"
                  >
                    Remates Presenciales
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-white hover:translate-x-1 inline-flex items-center transition-all duration-300"
                  >
                    Tasaciones Comerciales
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-white hover:translate-x-1 inline-flex items-center transition-all duration-300"
                  >
                    Información de Artículos
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-bold mb-8 uppercase text-xs tracking-[0.2em] relative inline-block">
                Contacto Directo
                <span className="absolute -bottom-3 left-0 w-8 h-1 bg-brand-200 rounded-full"></span>
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group hover:bg-brand-500/10 hover:border-brand-500/30 transition-all">
                    <MapPin size={16} className="text-brand-100" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm mb-1 line-clamp-1">
                      Durazno, Uruguay
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      Local principal de tasación y exhibición.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group hover:bg-brand-500/10 hover:border-brand-500/30 transition-all">
                    <Phone size={16} className="text-brand-100" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm mb-1 line-clamp-1">
                      Atención Telefónica
                    </p>
                    <p className="text-gray-400 text-xs">099 626 385</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group hover:bg-brand-500/10 hover:border-brand-500/30 transition-all">
                    <Mail size={16} className="text-brand-100" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm mb-1 line-clamp-1">
                      Correo Electrónico
                    </p>
                    <p className="text-gray-400 text-xs break-all">
                      contacto@teleremate.com.uy
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs font-medium text-center md:text-left">
              &copy; {new Date().getFullYear()} Teleremate. Todos los derechos
              reservados.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-gray-500 text-xs font-medium">
              <button
                onClick={() => setIsTermsOpen(true)}
                className="hover:text-white transition-colors"
              >
                Términos y Condiciones
              </button>
              <button
                onClick={() => setIsTermsOpen(true)}
                className="hover:text-white transition-colors"
              >
                Aviso de Privacidad
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Terms & Conditions Modal */}
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />

      {/* PWA Install Prompt */}
      <InstallPWA />
    </div>
  );
};

export default PublicLayout;
