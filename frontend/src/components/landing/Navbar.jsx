import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { scrollToId } from "./scroll";

const LINKS = [
  { label: "Inicio", href: "#inicio", id: "nav-inicio" },
  { label: "Servicios", href: "#servicios", id: "nav-servicios" },
  { label: "Nosotros", href: "#nosotros", id: "nav-nosotros" },
  { label: "Contacto", href: "#contacto", id: "nav-contacto" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (href) => {
    setOpen(false);
    scrollToId(href);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? "bg-[#050505]/70 backdrop-blur-xl border-b border-[#1E2028]" : "bg-transparent border-b border-transparent"
      }`}
      data-testid="navbar"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10 h-[68px] flex items-center justify-between">
        <button onClick={() => go("#inicio")} className="focus:outline-none" data-testid="nav-logo-button">
          <Logo />
        </button>

        <nav className="hidden md:flex items-center gap-9">
          {LINKS.map((l) => (
            <button
              key={l.id}
              data-testid={l.id}
              onClick={() => go(l.href)}
              className="font-mono text-xs uppercase tracking-[0.18em] text-white/60 hover:text-white transition-colors duration-300"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => go("#contacto")}
          data-testid="nav-cta-button"
          className="hidden md:inline-flex items-center font-mono text-xs uppercase tracking-[0.18em] px-5 py-2.5 rounded-full border border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#050505] transition-colors duration-300"
        >
          Cotizar
        </button>

        <button className="md:hidden text-white" onClick={() => setOpen((v) => !v)} data-testid="nav-mobile-toggle" aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-[#050505]/95 backdrop-blur-xl border-b border-[#1E2028]"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {LINKS.map((l) => (
                <button
                  key={l.id}
                  data-testid={`${l.id}-mobile`}
                  onClick={() => go(l.href)}
                  className="text-left font-mono text-sm uppercase tracking-[0.18em] text-white/70"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
