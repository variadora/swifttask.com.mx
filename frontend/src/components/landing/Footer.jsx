import React from "react";
import { Logo } from "./Logo";
import { scrollToId } from "./scroll";

export const Footer = () => {
  const go = (href) => scrollToId(href);
  return (
    <footer className="border-t border-[#1E2028] bg-[#050505]" data-testid="footer">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 py-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-[36ch]">
            <Logo />
            <p className="text-white/45 text-sm mt-4 leading-relaxed">
              Consultoría en computación, software, ciberseguridad y soporte para empresas que no se detienen.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { l: "Inicio", h: "#inicio" },
              { l: "Servicios", h: "#servicios" },
              { l: "Nosotros", h: "#nosotros" },
              { l: "Contacto", h: "#contacto" },
            ].map((i) => (
              <button
                key={i.h}
                onClick={() => go(i.h)}
                data-testid={`footer-link-${i.l.toLowerCase()}`}
                className="font-mono text-xs uppercase tracking-[0.18em] text-white/55 hover:text-[#00E5FF] transition-colors duration-300"
              >
                {i.l}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-12 pt-6 border-t border-[#1E2028] flex flex-col sm:flex-row justify-between gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/35">
            © {new Date().getFullYear()} SWIFT TASK, S.A. de C.V.
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/35">
            Ciudad de México · Todos los derechos reservados
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
